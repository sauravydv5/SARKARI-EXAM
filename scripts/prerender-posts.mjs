import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const prerenderCache = path.join(root, '.prerender-cache');
const postCacheDirectory = path.join(prerenderCache, 'posts');
const assetCacheDirectory = path.join(prerenderCache, 'assets');
const cacheManifestFile = path.join(prerenderCache, 'manifest.json');
const sitemap = await fs.readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
const postPaths = [...sitemap.matchAll(/<loc>https:\/\/sarkarijobhub\.website(\/post\/[^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((value, index, values) => values.indexOf(value) === index);
console.error(`Prerender input loaded: ${postPaths.length} post routes.`);

async function walkJsonFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkJsonFiles(entryPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) files.push(entryPath);
  }
  return files;
}

async function loadPostFingerprints() {
  const fingerprints = new Map();
  const contentDirectory = path.join(root, 'content');
  for (const filePath of await walkJsonFiles(contentDirectory)) {
    if (path.basename(filePath).toLowerCase().includes(' copy.json')) continue;
    const raw = await fs.readFile(filePath, 'utf8');
    const post = JSON.parse(raw);
    const slug = String(post.slug || post.id || path.basename(filePath, '.json')).trim().toLowerCase();
    if (!slug) continue;
    fingerprints.set(`/post/${encodeURIComponent(slug)}`, crypto.createHash('sha256').update(raw).digest('hex'));
  }
  return fingerprints;
}

async function readCacheManifest() {
  try {
    return JSON.parse(await fs.readFile(cacheManifestFile, 'utf8'));
  } catch {
    return {};
  }
}

function cacheFileFor(postPath) {
  return path.join(postCacheDirectory, `${decodeURIComponent(postPath.slice('/post/'.length))}.html`);
}

async function copyIfPresent(source, destination) {
  try {
    await fs.copyFile(source, destination);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function restoreCachedAssets() {
  await fs.cp(assetCacheDirectory, path.join(dist, 'assets'), { recursive: true, force: true }).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}

async function snapshotAssets() {
  await fs.cp(path.join(dist, 'assets'), assetCacheDirectory, { recursive: true, force: true });
}

async function restoreCachedPosts(postFingerprints, cacheManifest) {
  const postsToRender = [];
  await fs.mkdir(postCacheDirectory, { recursive: true });
  await fs.mkdir(path.join(dist, 'post'), { recursive: true });
  for (const postPath of postPaths) {
    const output = path.join(dist, postPath.slice(1), 'index.html');
    const cacheFile = cacheFileFor(postPath);
    const isCurrent = cacheManifest[postPath] === postFingerprints.get(postPath);
    let restored = isCurrent && await copyIfPresent(cacheFile, output);
    if (!restored && cacheManifest[postPath] === undefined) {
      restored = await copyIfPresent(output, cacheFile);
      if (restored) cacheManifest[postPath] = postFingerprints.get(postPath);
    }
    if (restored) console.error(`Reusing cached post: ${postPath}`);
    else postsToRender.push(postPath);
  }
  return postsToRender;
}

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
  const postFingerprints = await loadPostFingerprints();
  const cacheManifest = await readCacheManifest();
  await restoreCachedAssets();
  const postsToRender = await restoreCachedPosts(postFingerprints, cacheManifest);
  await waitForPreview();
  console.error('Preview ready.');
  const failures = [];
  const totalRoutes = indexableSectionPaths.length + postsToRender.length;
  let successfulRoutes = 0;
  browser = await chromium.launch({ headless: true });
  console.error(`Browser launched for ${totalRoutes} routes (${postPaths.length - postsToRender.length} cached posts reused).`);

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

  for (const postPath of postsToRender) {
    console.error(`Prerendering route ${successfulRoutes + failures.length + 1}/${totalRoutes}: ${postPath}`);
    const output = path.join(dist, postPath.slice(1), 'index.html');
    try {
      await renderPostRouteWithFreshContext(browser, postPath, output);
      await fs.mkdir(path.dirname(cacheFileFor(postPath)), { recursive: true });
      await fs.copyFile(output, cacheFileFor(postPath));
      cacheManifest[postPath] = postFingerprints.get(postPath);
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

  await fs.mkdir(prerenderCache, { recursive: true });
  await snapshotAssets();
  await fs.writeFile(cacheManifestFile, `${JSON.stringify(cacheManifest, null, 2)}\n`, 'utf8');
  console.log(`Prerendered ${indexableSectionPaths.length} sections and ${postsToRender.length} changed posts; reused ${postPaths.length - postsToRender.length} cached posts.`);
} finally {
  await browser?.close();
  preview.kill();
}
