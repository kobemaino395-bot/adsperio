import { promises as fs } from 'node:fs';
import { randomBytes } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { readSessionFromCookies, verifySessionCsrf } from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';
import {
  ensureDataDirs,
  fileMeta,
  sanitizeFilename,
  takeHomeBackupPath,
  takeHomePath,
  writeTakeHomeMeta,
} from '@/server/storage';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 50 * 1024 * 1024;
const ZIP_MAGIC = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'form parse failed' });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('Invalid form data'));
  }

  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'csrf' });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('CSRF check failed'));
  }

  const entries = form.getAll('file');
  if (entries.length !== 1) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'expected exactly one file' });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('Upload exactly one file'));
  }
  const file = entries[0];
  if (!(file instanceof File)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'not a file' });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('Invalid file'));
  }
  if (file.size > MAX_BYTES) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: `size ${file.size} > ${MAX_BYTES}` });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('File exceeds 50 MB limit'));
  }
  if (file.size === 0) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'empty file' });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('Empty file'));
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length < 4 || !buf.subarray(0, 4).equals(ZIP_MAGIC)) {
    audit({ kind: 'upload.reject', username: session.username, ip, reason: 'magic bytes' });
    return adminRedirect('/admin/downloads?error=' + encodeURIComponent('File must be a valid ZIP or DOCX (PK header missing)'));
  }

  ensureDataDirs();
  const target = takeHomePath();
  const backup = takeHomeBackupPath();
  const tmp = path.join(os.tmpdir(), `adn-upload-${randomBytes(8).toString('hex')}.bin`);
  await fs.writeFile(tmp, buf);

  const existing = await fileMeta(target);
  if (existing) {
    try {
      await fs.rename(target, backup);
    } catch {
      await fs.copyFile(target, backup);
    }
  }

  try {
    await fs.rename(tmp, target);
  } catch {
    await fs.copyFile(tmp, target);
    await fs.unlink(tmp).catch(() => undefined);
  }

  await writeTakeHomeMeta({
    filename: sanitizeFilename(file.name),
    contentType: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    size: buf.length,
  });

  audit({
    kind: 'upload.replace',
    username: session.username,
    ip,
    bytes: buf.length,
    backupPath: backup,
  });
  return adminRedirect('/admin/downloads?ok=1');
}
