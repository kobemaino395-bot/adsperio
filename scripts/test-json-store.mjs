#!/usr/bin/env node
// Concurrency test for the json-store pattern used by src/server/slot-stats.ts
// and friends. Fires N concurrent read-modify-write operations at the same
// file path and asserts:
//   1. The file remains valid JSON after every increment.
//   2. The final counter equals N (no lost updates).
//
// This is a pure-Node port of the production helper (kept in sync by hand —
// the prod version lives at src/server/json-store.ts). If you change the
// algorithm there, mirror it here.
//
// Run: node scripts/test-json-store.mjs

import { promises as fs } from 'node:fs';
import { existsSync, mkdirSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import os from 'node:os';

const locks = new Map();

function withFileLock(absPath, fn) {
  const prev = locks.get(absPath) ?? Promise.resolve();
  const next = prev.catch(() => undefined).then(fn);
  locks.set(
    absPath,
    next.finally(() => {
      if (locks.get(absPath) === next) locks.delete(absPath);
    }),
  );
  return next;
}

async function writeJsonAtomic(absPath, value) {
  const dir = path.dirname(absPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const json = JSON.stringify(value);
  const tmp = path.join(dir, `.${path.basename(absPath)}.tmp-${randomBytes(8).toString('hex')}`);
  const handle = await fs.open(tmp, 'w');
  try {
    await handle.writeFile(json, 'utf8');
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await renameWithRetry(tmp, absPath);
  } catch (err) {
    await fs.unlink(tmp).catch(() => undefined);
    throw err;
  }
}

async function renameWithRetry(from, to, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      await fs.rename(from, to);
      return;
    } catch (err) {
      const code = err.code;
      if (i === attempts - 1 || (code !== 'EPERM' && code !== 'EBUSY' && code !== 'EACCES')) throw err;
      await new Promise((r) => setTimeout(r, 10 * (i + 1)));
    }
  }
}

async function readJsonResilient(absPath, fallback) {
  let raw;
  try {
    raw = await fs.readFile(absPath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const N = 100;
const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'adn-jsonstore-'));
const file = path.join(tmpRoot, 'stats.json');

console.log(`Test dir: ${tmpRoot}`);
console.log(`Firing ${N} concurrent increments at ${path.basename(file)}…`);

// Phase 1: N concurrent read-modify-write increments. The lock must
// serialize them so no update is lost.
const increments = Array.from({ length: N }, (_, i) =>
  withFileLock(file, async () => {
    const cur = await readJsonResilient(file, { downloads: 0 });
    cur.downloads = (cur.downloads ?? 0) + 1;
    cur.lastWriter = i;
    await writeJsonAtomic(file, cur);
  }),
);
await Promise.all(increments);

// Phase 2: file must be valid JSON with the exact expected count.
const raw = await fs.readFile(file, 'utf8');
let final;
try {
  final = JSON.parse(raw);
} catch (err) {
  console.error(`FAIL: stats.json is not valid JSON after ${N} writes: ${err.message}`);
  console.error(`Raw contents (${raw.length} bytes):`, JSON.stringify(raw));
  process.exit(1);
}
console.log(`Final state: ${JSON.stringify(final)}`);

let failed = false;
if (final.downloads !== N) {
  console.error(`FAIL: expected downloads=${N}, got ${final.downloads}. Lost ${N - final.downloads} updates.`);
  failed = true;
}

// Phase 3: explicitly check the resilient reader handles a corrupted file
// without throwing (so the dashboard never 500s on bad data).
const corruptPath = path.join(tmpRoot, 'corrupt.json');
await fs.writeFile(corruptPath, '{"downloads":2}}', 'utf8'); // trailing junk like the original bug
const recovered = await readJsonResilient(corruptPath, { downloads: 0 });
if (recovered.downloads !== 0) {
  console.error(`FAIL: resilient read should return fallback on corrupt JSON, got ${JSON.stringify(recovered)}`);
  failed = true;
} else {
  console.log('Resilient read on corrupt file: fell back to default (good).');
}

await fs.rm(tmpRoot, { recursive: true, force: true });

if (failed) process.exit(1);
console.log('PASS');
