import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const sitemap = await fs.readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
const postPaths = [...sitemap.matchAll(/<loc>https:\/\/sarkarijobhub\.website(\/post\/[^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((value, index, values) => values.indexOf(value) === index);

const previewCommand = process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : 'npm';
const previewArgs = process.platform === 'win32'
  ? ['/d', '/s', '/c', 'npm run preview -- --host 127.0.0.1 --port 4173']
  : ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'];
const preview = spawn(previewCommand, previewArgs, {
  cwd: root,
  stdio: 'ignore',
  windowsHide: true,
});

async function waitForPreview() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4173/');
      if (response.ok) return;
    } catch {
      // Preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Vite preview server did not start in time.');
}

try {
  await waitForPreview();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  for (const postPath of postPaths) {
    await page.goto(`http://127.0.0.1:4173${postPath}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.pd-page, .error-box').first().waitFor();
    const html = await page.content();
    const output = path.join(dist, postPath.slice(1), 'index.html');
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, html, 'utf8');
  }

  await browser.close();
  console.log(`Prerendered ${postPaths.length} published post pages.`);
} finally {
  preview.kill();
}
