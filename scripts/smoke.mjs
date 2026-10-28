// Prueba de humo: abre el HTML, recorre todas las diapositivas y falla si hay errores de consola.
// Uso: node scripts/smoke.mjs [archivo.html] [carpetaCapturas] [ancho] [alto]
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = createRequire(process.env.NODE_PATH ? process.env.NODE_PATH + '/' : '/usr/lib/node_modules/')('playwright'); }
const { chromium } = pw;
const file = resolve(process.argv[2] || 'dist/Clase_20_De_la_tabla_al_grafico.html');
const out = process.argv[3]; const W = +process.argv[4] || 1920, H = +process.argv[5] || 1080;
if (out) mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: H }, hasTouch: true, reducedMotion: process.env.REDUCE ? 'reduce' : 'no-preference' });
const errs = []; p.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()));
await p.goto('file://' + file); await p.waitForTimeout(1500);
const n = await p.locator('#dots button').count();
for (let i = 0; i < n; i++) {
  await p.evaluate((k) => (location.hash = '#' + (k + 1)), i); await p.waitForTimeout(1900);
  const over = await p.evaluate(() => { const s = document.querySelector('.scene'); return s ? s.scrollHeight - s.clientHeight : -1; });
  if (out) await p.screenshot({ path: `${out}/s${String(i + 1).padStart(2, '0')}.png` });
  console.log(`diapositiva ${i + 1}: desborde vertical ${over}px`);
}
await b.close();
if (errs.length) { console.error(errs.join('\n')); process.exit(1); } console.log('OK: sin errores de consola');
