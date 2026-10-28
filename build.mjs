// Empaqueta una clase en un único HTML autocontenido (JS + CSS + fuentes + imágenes en base64).
// Uso: node build.mjs [clase-20 ...]   (sin argumentos construye todas las de src/clases)
import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const FONTS = [
  ['Bricolage Grotesque', 700, 'bricolage-grotesque-latin-700-normal'],
  ['Bricolage Grotesque', 800, 'bricolage-grotesque-latin-800-normal'],
  ['Atkinson Hyperlegible', 400, 'atkinson-hyperlegible-latin-400-normal'],
  ['Atkinson Hyperlegible', 700, 'atkinson-hyperlegible-latin-700-normal'],
  ['JetBrains Mono', 500, 'jetbrains-mono-latin-500-normal'],
  ['JetBrains Mono', 700, 'jetbrains-mono-latin-700-normal'],
];
const fontCss = FONTS.map(([fam, w, f]) => {
  const b64 = readFileSync(join(root, 'assets/fonts', f + '.woff2')).toString('base64');
  return `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
}).join('');

const clasesDir = join(root, 'src/clases');
const wanted = process.argv.slice(2);
const clases = wanted.length ? wanted : readdirSync(clasesDir);
mkdirSync(join(root, 'dist'), { recursive: true });

for (const c of clases) {
  const dir = join(clasesDir, c);
  if (!existsSync(join(dir, 'index.js'))) throw new Error(`No existe src/clases/${c}/index.js`);
  const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
  const out = await build({
    entryPoints: [join(dir, 'index.js')],
    bundle: true, minify: true, write: false, format: 'iife', target: 'es2020',
    outdir: 'out', loader: { '.webp': 'dataurl', '.css': 'css' }, legalComments: 'none',
  });
  const js = out.outputFiles.find((f) => f.path.endsWith('.js')).text.replace(/<\/script/gi, '<\\/script');
  const css = out.outputFiles.find((f) => f.path.endsWith('.css'))?.text ?? '';
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0B1119">
<title>${meta.title}</title>
<style>${fontCss}${css}</style></head>
<body><div id="app"></div>
<script>${js}</script></body></html>`;
  const file = join(root, 'dist', meta.file);
  writeFileSync(file, html);
  console.log(`✔ ${c} → dist/${meta.file} (${(html.length / 1024).toFixed(0)} KB)`);
}
