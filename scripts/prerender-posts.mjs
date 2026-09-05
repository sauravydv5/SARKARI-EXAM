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

if (postPaths.some((postPath) => !postPath.startsWith('/post/') || postPath.includes('..'))) {
  throw new Error('Sitemap contains an invalid post route.');
}

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
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    const failures = [];

    for (const postPath of postPaths) {
      const output = path.join(dist, postPath.slice(1), 'index.html');
      const temporaryOutput = `${output}.tmp-${process.pid}`;

      try {
        await page.goto(`http://127.0.0.1:4173${postPath}`, { waitUntil: 'domcontentloaded' });
        await page.locator('.pd-page, .error-box').first().waitFor();
        if (await page.locator('.error-box').count()) {
          throw new Error('The application returned its post error page.');
        }
        const html = await page.content();
        if (!html.includes('<html') || !html.includes('<body') || !html.includes('pd-page')) {
          throw new Error('Rendered output is not a complete post document.');
        }
        await fs.mkdir(path.dirname(output), { recursive: true });
        await fs.writeFile(temporaryOutput, html, 'utf8');
        await fs.rename(temporaryOutput, output);
      } catch (error) {
        failures.push(`${postPath}: ${error.message}`);
        await fs.rm(temporaryOutput, { force: true });
      }
    }

    if (failures.length) {
      throw new Error(`Failed to prerender ${failures.length} post page(s):\n${failures.join('\n')}`);
    }

    console.log(`Prerendered ${postPaths.length} published post pages.`);
  } finally {
    await browser.close();
  }
} finally {
  preview.kill();
}
