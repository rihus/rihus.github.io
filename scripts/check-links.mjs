#!/usr/bin/env node
// Checks every internal link in the built site (dist/) — href, src, srcset,
// <object data> and meta og:image/url pointing at this site — and fails if a
// target file or #anchor does not exist. Run after `npm run build`.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://rihus.github.io';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function exists(p) {
  try {
    return await stat(p);
  } catch {
    return null;
  }
}

/** Resolve a site path (e.g. "/about/") to a file in dist, or null. */
async function resolveTarget(pathname) {
  const decoded = decodeURIComponent(pathname);
  const p = join(root, decoded);
  const s = await exists(p);
  if (s?.isFile()) return p;
  if (s?.isDirectory() && (await exists(join(p, 'index.html')))) return join(p, 'index.html');
  const bare = p.replace(/[\/]+$/, '');
  if (!extname(bare) && (await exists(bare + '.html'))) return bare + '.html';
  return null;
}

const idCache = new Map();
async function idsIn(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

if (!(await exists(root))) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const files = (await walk(root)).filter((f) => f.endsWith('.html'));
const attr = /\s(?:href|src|data)=["']([^"']*)["']/g;
// <meta content="…"> only matters when it is an absolute URL on this site (og:image, og:url).
const metaContent = new RegExp(`\\scontent=["'](${SITE.replace(/\./g, '\\.')}[^"']*)["']`, 'g');
const srcset = /\ssrcset=["']([^"']*)["']/g;
let checked = 0;
const broken = [];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const pagePath = '/' + relative(root, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const refs = [...html.matchAll(attr), ...html.matchAll(metaContent)].map((m) => m[1]);
  for (const m of html.matchAll(srcset)) refs.push(...m[1].split(',').map((s) => s.trim().split(/\s+/)[0]));

  for (let ref of refs) {
    if (!ref) continue;
    if (ref.startsWith(SITE)) ref = ref.slice(SITE.length) || '/';
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(ref)) continue; // external, mailto:, data:, …
    if (!ref.startsWith('/') && !ref.startsWith('#') && !ref.startsWith('.')) continue; // plain meta text
    const url = new URL(ref, SITE + pagePath);
    const target = await resolveTarget(url.pathname);
    checked++;
    if (!target) {
      broken.push(`${relative(root, file)} → ${ref} (missing file)`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!(await idsIn(target)).has(id)) broken.push(`${relative(root, file)} → ${ref} (missing #${id})`);
    }
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal link(s):`);
  for (const b of broken) console.error('  ' + b);
  process.exit(1);
}
console.log(`✓ ${checked} internal links checked across ${files.length} pages — no broken links.`);
