import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outputFile = path.join(rootDir, 'src', 'generated', 'siteMeta.js');

let iso = new Date().toISOString();

try {
  const result = execFileSync('git', ['log', '-1', '--format=%cI'], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const value = result.toString().trim();
  if (value) iso = value;
} catch {
  // Fallback keeps the current build time if git metadata is unavailable.
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `export const SITE_LAST_UPDATED_AT = ${JSON.stringify(iso)};\n`);
console.log(`Site metadata updated to ${iso}`);
