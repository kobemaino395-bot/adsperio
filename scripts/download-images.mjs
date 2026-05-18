#!/usr/bin/env node
/**
 * Download images listed in scripts/images.json into the repo.
 *
 * Usage:
 *   node scripts/download-images.mjs          # downloads missing only
 *   node scripts/download-images.mjs --force  # re-downloads everything
 *
 * All sources are CC0 (Picsum.photos by default). To swap a slot for a
 * specific image, edit its `url` in scripts/images.json and rerun.
 */
import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(__dirname, 'images.json');

const force = process.argv.includes('--force');

async function main() {
  const raw = await fs.readFile(MANIFEST, 'utf8');
  const manifest = JSON.parse(raw);
  const entries = Array.isArray(manifest.images) ? manifest.images : [];

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    const outPath = path.join(ROOT, entry.path);
    if (!force && existsSync(outPath)) {
      process.stderr.write(`= ${entry.path} (already present)\n`);
      skipped++;
      continue;
    }

    await fs.mkdir(path.dirname(outPath), { recursive: true });

    try {
      process.stderr.write(`> ${entry.url} -> ${entry.path} ... `);
      const res = await fetch(entry.url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024) throw new Error(`suspiciously small (${buf.length} bytes)`);
      await fs.writeFile(outPath, buf);
      process.stderr.write(`ok (${(buf.length / 1024).toFixed(0)} KB)\n`);
      downloaded++;
    } catch (err) {
      process.stderr.write(`FAILED: ${err.message ?? err}\n`);
      failed++;
    }
  }

  process.stderr.write(`\nDone. downloaded=${downloaded} skipped=${skipped} failed=${failed}\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message ?? err}\n`);
  process.exit(1);
});
