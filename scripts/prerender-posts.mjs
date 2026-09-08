import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const contentDirectory = path.join(root, 'content');
const generatedPostDirectory = path.join(root, 'public', 'post');
const generatedManifestFile = path.join(generatedPostDirectory, '.manifest.json');
const manifestVersion = 1;

const sitemap = await fs.readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
const postPaths = [...sitemap.matchAll(/<loc>https:\/\/sarkarijobhub\.website(\/post\/[^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((value, index, values) => values.indexOf(value) === index);

if (postPaths.some((postPath) => !postPath.startsWith('/post/') || postPath.includes('..'))) {
  throw new Error('Sitemap contains an invalid post route.');
}

async function walkJsonFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkJsonFiles(entryPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) files.push(entryPath);
  }
  return files;
}

function fingerprint(raw) {
  return crypto.createHash('sha256').update(raw.replace(/\r\n?/g, '\n')).digest('hex');
}

async function loadContentFingerprints() {
  const fingerprints = new Map();
  for (const filePath of await walkJsonFiles(contentDirectory)) {
    if (path.basename(filePath).toLowerCase().includes(' copy.json')) continue;
    const raw = await fs.readFile(filePath, 'utf8');
    const post = JSON.parse(raw);
    const slug = String(post.slug || post.id || path.basename(filePath, '.json')).trim().toLowerCase();
    if (slug) fingerprints.set(`/post/${encodeURIComponent(slug)}`, fingerprint(raw));
  }
  return fingerprints;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

function manifestPosts(manifest) {
  if (manifest?.posts && typeof manifest.posts === 'object') return manifest.posts;
  return Object.fromEntries(
    Object.entries(manifest || {}).filter(([key, value]) => key.startsWith('/post/') && typeof value === 'string')
  );
}

function postOutputFor(postPath) {
  return path.join(generatedPostDirectory, postPath.slice('/post/'.length), 'index.html');
}

function normalizeAssetReferences(html) {
  return html.replace(/\/assets\/([^"'<>?]+)/g, (source, assetName) => {
    const hashedAsset = assetName.match(/^(.+)-[A-Za-z0-9_-]{8,}\.(js|css)$/);
    return hashedAsset ? `/assets/${hashedAsset[1]}.${hashedAsset[2]}` : source;
  });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function removeDeletedPosts(existingPosts) {
  const activePosts = new Set(postPaths);
  for (const postPath of Object.keys(existingPosts)) {
    if (!activePosts.has(postPath)) delete existingPosts[postPath];
  }

  try {
    for (const entry of await fs.readdir(generatedPostDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const postPath = `/post/${encodeURIComponent(entry.name)}`;
      if (!activePosts.has(postPath)) {
        await fs.rm(path.join(generatedPostDirectory, entry.name), { recursive: true, force: true });
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

async function removeDeletedDistPosts() {
  const activePosts = new Set(postPaths);
  const distPostDirectory = path.join(dist, 'post');
  try {
    for (const entry of await fs.readdir(distPostDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const postPath = `/post/${encodeURIComponent(entry.name)}`;
      if (!activePosts.has(postPath)) {
        await fs.rm(path.join(distPostDirectory, entry.name), { recursive: true, force: true });
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

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
  throw new Error('Vite preview server did not start. Run npm run build first.');
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
  await fs.writeFile(temporaryOutput, normalizeAssetReferences(html), 'utf8');
  await fs.rename(temporaryOutput, output);
}

async function renderChangedPosts(changedPosts, generatedPosts, contentFingerprints) {
  if (!changedPosts.length) return;
  if (!await fileExists(path.join(dist, 'index.html'))) {
    throw new Error('The Vite build output is missing. Run npm run build before generating post HTML.');
  }

  const preview = spawn(process.execPath, [
    path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4173',
  ], { cwd: root, stdio: 'ignore', windowsHide: true });
  let browser;

  try {
    await waitForPreview();
    browser = await chromium.launch({ headless: true });
    const failures = [];
    for (const postPath of changedPosts) {
      console.log(`Prerendering changed post: ${postPath}`);
      const context = await browser.newContext();
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      try {
        await renderPostRoute(page, postPath, postOutputFor(postPath));
        const distOutput = path.join(dist, postPath.slice(1), 'index.html');
        await fs.mkdir(path.dirname(distOutput), { recursive: true });
        await fs.copyFile(postOutputFor(postPath), distOutput);
        generatedPosts[postPath] = contentFingerprints.get(postPath);
      } catch (error) {
        failures.push(`${postPath}: ${error.message}`);
      } finally {
        await context.close();
      }
    }
    if (failures.length) throw new Error(`Failed to prerender ${failures.length} post(s):\n${failures.join('\n')}`);
  } finally {
    await browser?.close();
    preview.kill();
  }
}

const contentFingerprints = await loadContentFingerprints();
const generatedManifest = await readJson(generatedManifestFile, { version: manifestVersion, posts: {} });
const generatedPosts = manifestPosts(generatedManifest);
const generated = { version: manifestVersion, posts: generatedPosts };
const previousGeneratedPaths = Object.keys(generatedPosts);

await removeDeletedPosts(generated.posts);
await removeDeletedDistPosts();
await fs.mkdir(generatedPostDirectory, { recursive: true });

const changedPosts = [];
let reusedPosts = 0;
for (const postPath of postPaths) {
  const output = postOutputFor(postPath);
  const currentFingerprint = contentFingerprints.get(postPath);
  const isCurrent = currentFingerprint && generated.posts[postPath] === currentFingerprint && await fileExists(output);
  if (isCurrent) {
    reusedPosts += 1;
    continue;
  }

  changedPosts.push(postPath);
}

const removedPosts = previousGeneratedPaths.filter((postPath) => !postPaths.includes(postPath)).length;
console.log(`Detected ${reusedPosts} existing generated posts`);
console.log(`Changed posts: ${changedPosts.length}`);
console.log(`Generated: ${changedPosts.length}`);
console.log(`Reused: ${reusedPosts}`);
console.log(`Removed: ${removedPosts}`);

await renderChangedPosts(changedPosts, generated.posts, contentFingerprints);
await fs.writeFile(generatedManifestFile, `${JSON.stringify(generated, null, 2)}\n`, 'utf8');
console.log(`Post generation complete: ${changedPosts.length} generated, ${reusedPosts} reused, ${removedPosts} removed.`);
