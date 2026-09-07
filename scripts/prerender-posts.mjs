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
console.error(`Prerender input loaded: ${postPaths.length} post routes.`);

if (postPaths.some((postPath) => !postPath.startsWith('/post/') || postPath.includes('..'))) {
  throw new Error('Sitemap contains an invalid post route.');
}

const indexableSectionPaths = ['/', '/latest-jobs', '/results', '/admit-cards', '/answer-keys', '/syllabus', '/admission', '/important', '/certificates'];

const previewCommand = process.execPath;
const previewArgs = [
  path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
  'preview',
  '--host',
  '127.0.0.1',
  '--port',
  '4173',
];
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

async function createRouteSession(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  return { context, page };
}

async function renderSectionRoute(page, sectionPath, output) {
  const temporaryOutput = `${output}.tmp-${process.pid}`;
  await page.goto(`http://127.0.0.1:4173${sectionPath}`, { waitUntil: 'domcontentloaded' });
  await page.locator(sectionPath === '/' ? '.home-grid' : '.page-header').first().waitFor();
  const html = await page.content();
  if (!html.includes('<html') || !html.includes('<body')) {
    throw new Error('Rendered output is not a complete page document.');
  }
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(temporaryOutput, html, 'utf8');
  await fs.rename(temporaryOutput, output);
}

async function renderSectionRouteWithFreshContext(browser, sectionPath, output) {
  const session = await createRouteSession(browser);

  try {
    await renderSectionRoute(session.page, sectionPath, output);
  } finally {
    await session.context.close();
  }
}

async function renderPostRoute(page, postPath, output) {
  const temporaryOutput = `${output}.tmp-${process.pid}`;
  await page.goto(`http://127.0.0.1:4173${postPath}`, { waitUntil: 'domcontentloaded' });
  await page.locator('.pd-page, .error-box').first().waitFor();
  if (await page.locator('.error-box').count()) {
    const errorText = (await page.locator('.error-box').innerText()).trim();
    throw new Error(`The application returned its post error page: ${errorText}`);
  }
  const html = await page.content();
  if (!html.includes('<html') || !html.includes('<body') || !html.includes('pd-page')) {
    throw new Error('Rendered output is not a complete post document.');
  }
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(temporaryOutput, html, 'utf8');
  await fs.rename(temporaryOutput, output);
}

async function renderPostRouteWithFreshContext(browser, postPath, output) {
  const session = await createRouteSession(browser);

  try {
    await renderPostRoute(session.page, postPath, output);
  } finally {
    await session.context.close();
  }
}

let browser;

try {
  await waitForPreview();
  console.error('Preview ready.');
  const failures = [];
  const totalRoutes = indexableSectionPaths.length + postPaths.length;
  let successfulRoutes = 0;
  browser = await chromium.launch({ headless: true });
  console.error(`Browser launched for ${totalRoutes} routes.`);

  for (const sectionPath of indexableSectionPaths) {
    console.error(`Prerendering route ${successfulRoutes + failures.length + 1}/${totalRoutes}: ${sectionPath}`);
    const output = sectionPath === '/' ? path.join(dist, 'index.html') : path.join(dist, sectionPath.slice(1), 'index.html');
    try {
      await renderSectionRouteWithFreshContext(browser, sectionPath, output);
      successfulRoutes += 1;
    } catch (error) {
      console.error(`Section failed ${sectionPath}:`, error);
      failures.push(`${sectionPath}: ${error.message}`);
    }
  }

  for (const postPath of postPaths) {
    console.error(`Prerendering route ${successfulRoutes + failures.length + 1}/${totalRoutes}: ${postPath}`);
    const output = path.join(dist, postPath.slice(1), 'index.html');
    try {
      await renderPostRouteWithFreshContext(browser, postPath, output);
      successfulRoutes += 1;
    } catch (error) {
      console.error(`Post failed ${postPath}:`, error);
      failures.push(`${postPath}: ${error.message}`);
    }
  }

  console.error(`Total routes: ${totalRoutes}`);
  console.error(`Successful routes: ${successfulRoutes}`);
  console.error(`Failed routes: ${failures.length}`);

  if (failures.length) {
    throw new Error(`Failed to prerender ${failures.length} route(s):\n${failures.join('\n')}`);
  }

  console.log(`Prerendered ${totalRoutes} routes.`);
} finally {
  await browser?.close();
  preview.kill();
}
