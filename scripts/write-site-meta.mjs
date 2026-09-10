import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const outputFile = path.join(rootDir, 'src', 'generated', 'siteMeta.js');

// Always use the current local update time so the header reflects edits immediately.
const iso = new Date().toISOString();

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `export const SITE_LAST_UPDATED_AT = ${JSON.stringify(iso)};\n`);
console.log(`Site metadata updated to ${iso}`);
