#!/usr/bin/env node
import { randomBytes, scryptSync } from 'node:crypto';
import { stdin, stdout, stderr } from 'node:process';

function writePrompt(s) {
  stderr.write(s);
}

async function readPassword(prompt) {
  writePrompt(prompt);
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      let buf = '';
      stdin.setEncoding('utf8');
      stdin.on('data', (chunk) => { buf += chunk; });
      stdin.on('end', () => resolve(buf.replace(/\r?\n$/, '')));
      stdin.on('error', reject);
      return;
    }
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let buf = '';
    const onData = (key) => {
      for (const ch of key) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          stderr.write('\n');
          resolve(buf);
          return;
        }
        if (ch === '') {
          stdin.setRawMode(false);
          stdin.pause();
          stderr.write('\n');
          reject(new Error('Aborted'));
          return;
        }
        if (ch === '' || ch === '\b') {
          buf = buf.slice(0, -1);
          continue;
        }
        buf += ch;
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  const pw1 = await readPassword('Enter new admin password: ');
  if (pw1.length < 12) {
    stderr.write('Password must be at least 12 characters.\n');
    process.exit(1);
  }
  const pw2 = await readPassword('Confirm password: ');
  if (pw1 !== pw2) {
    stderr.write('Passwords do not match.\n');
    process.exit(1);
  }

  const salt = randomBytes(16);
  const hash = scryptSync(pw1, salt, 64);
  const encoded = `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;

  stderr.write('\nSet this in your systemd override:\n\n');
  stdout.write(`ADMIN_PASSWORD_HASH=${encoded}\n`);
}

main().catch((err) => {
  stderr.write(`${err.message ?? err}\n`);
  process.exit(1);
});
