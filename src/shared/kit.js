// Kit compartido: GSAP + helpers de movimiento accesible, sonido, confeti y componentes interactivos.
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(SplitText, DrawSVGPlugin, MotionPathPlugin);
export { gsap };

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const ic = (n) => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- movimiento accesible (accessible-animation: niveles, no apagado total) ---------- */
const RM = matchMedia('(prefers-reduced-motion: reduce)');
export const reduced = () => RM.matches;
const mv = (v) => (RM.matches ? 0 : v);
const D = (s) => (RM.matches ? 0.01 : s);
export { mv, D };

/** Entrada escalonada (solo transform + opacity → 60 fps). */
export function enter(targets, o = {}) {
  const t = typeof targets === 'string' ? $$(targets) : targets;
  if (!t || (t.length === 0)) return gsap.timeline();
  return gsap.fromTo(t, { autoAlpha: 0, y: mv(o.y ?? 26), scale: o.scale ?? 1 }, {
    autoAlpha: 1, y: 0, scale: 1, duration: D(o.duration ?? 0.55), ease: 'power3.out',
    stagger: RM.matches ? 0 : o.stagger ?? 0.07, delay: o.delay ?? 0, overwrite: 'auto', clearProps: 'transform', ...o.vars,
  });
}
/** Revela las palabras de un título con máscara (SplitText). */
export function splitReveal(el, delay = 0) {
  if (!el) return;
  const s = SplitText.create(el, { type: 'words', wordsClass: 'sw' });
  gsap.from(s.words, { yPercent: mv(110), autoAlpha: 0, duration: D(0.7), ease: 'power4.out', stagger: RM.matches ? 0 : 0.05, delay });
}
export function pop(el, s = 1.08) {
  if (!el) return;
  gsap.fromTo(el, { scale: 1 }, { scale: mv(s) || 1, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: 'auto' });
}
export function shake(el) {
  if (!el) return;
  gsap.fromTo(el, { x: 0 }, { x: mv(10), duration: 0.07, repeat: 5, yoyo: true, ease: 'sine.inOut', onComplete: () => gsap.set(el, { x: 0 }) });
}
export function countUp(el, to, dur = 0.9, fmt = (n) => Math.round(n)) {
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: D(dur), ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)), onComplete: () => (el.textContent = fmt(to)) });
}
export function confetti(x = innerWidth / 2, y = innerHeight / 3, n = 42) {
  if (RM.matches) return;
  const cols = ['#FFC53D', '#34D399', '#5B9DFF', '#FF4FD8', '#EAF0F7'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.className = 'conf';
    p.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % 5]}`;
    document.body.appendChild(p);
    gsap.to(p, {
      x: gsap.utils.random(-320, 320), y: gsap.utils.random(-260, 340), rotation: gsap.utils.random(-540, 540),
      duration: gsap.utils.random(1, 1.8), ease: 'power2.out', onComplete: () => p.remove(),
    });
    gsap.to(p, { autoAlpha: 0, delay: 0.9, duration: 0.7 });
  }
}
let toastT;
export function toast(m) {
  $$('.toast').forEach((t) => t.remove());
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = m;
  document.body.appendChild(t);
  gsap.from(t, { y: mv(16), autoAlpha: 0, duration: D(0.25) });
  clearTimeout(toastT);
  toastT = setTimeout(() => gsap.to(t, { autoAlpha: 0, duration: D(0.25), onComplete: () => t.remove() }), 2200);
}

/* ---------- sonido sintetizado (sin archivos) ---------- */
let AC, muted = false;
export const sound = { get muted() { return muted; }, toggle() { muted = !muted; return muted; } };
export function beep(kind = 'ok') {
  if (muted) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [660, 880], no: [220, 180], tap: [520], win: [523, 659, 784, 1047], tick: [440] }[kind] || [440];
    notes.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + i * 0.1;
      o.type = kind === 'no' ? 'sawtooth' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(AC.destination); o.start(t); o.stop(t + 0.2);
    });
  } catch (e) { /* sin audio */ }
}

/* ---------- arrastrar con puntero (táctil y mouse) ---------- */
/** Hace arrastrable `el`. onDrop(x,y) recibe la posición final; devuelve true si se aceptó. */
export function draggable(el, { onDrop, onMove, onStart } = {}) {
  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    e.preventDefault(); el.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY; let moved = false;
    el.classList.add('dragging');
    const mm = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) > 8) { moved = true; onStart?.(); }
      if (moved) { gsap.set(el, { x: dx, y: dy, scale: 1.06, rotation: dx * 0.02 }); onMove?.(ev.clientX, ev.clientY); }
    };
    const up = (ev) => {
      el.removeEventListener('pointermove', mm); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.classList.remove('dragging');
      const ok = moved && onDrop?.(ev.clientX, ev.clientY);
      if (!ok) gsap.to(el, { x: 0, y: 0, scale: 1, rotation: 0, duration: D(0.45), ease: 'elastic.out(1,.6)' });
      if (!moved) el.dispatchEvent(new CustomEvent('tap'));
    };
    el.addEventListener('pointermove', mm); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
}
export const under = (x, y, sel) => { for (const e of document.elementsFromPoint(x, y)) { if (e.closest('.dragging')) continue; const m = e.closest(sel); if (m) return m; } return null; };

/* ---------- gráfico de barras SVG (las barras usan scaleY → solo transform) ---------- */
export function chart(box, data, o = {}) {
  const W = 640, H = 360, L = 74, R = 16;
  let vals = o.values ? [...o.values] : data.map((d) => d[1]);
  let opt = { ...o };
  const api = { box, svg: null, bars: [], get opt() { return opt; } };
  function geo() {
    const T = opt.title !== undefined ? 50 : 22, B = opt.xlab !== undefined ? 76 : 58;
    return { T, B, pw: W - L - R, ph: H - T - B };
  }
  const frac = (v) => { const min = opt.min ?? 0, max = opt.max ?? Math.max(...data.map((d) => d[1])); return Math.max(0, Math.min(1, (v - min) / (max - min))); };
  function render() {
    const { T, ph, pw } = geo(); const min = opt.min ?? 0, max = opt.max ?? Math.max(...data.map((d) => d[1])), step = opt.step ?? 1;
    const part = (p, inner) => `<g class="part ${opt.part === p ? 'on' : ''}" data-part="${p}">${inner}</g>`;
    let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${(opt.title || 'Gráfico de barras')}. ${data.map((d, i) => d[0] + ': ' + vals[i]).join('; ')}">`;
    if (opt.title !== undefined) g += part('titulo', `<text class="tt ${opt.title ? '' : 'ph'}" x="${W / 2}" y="30" text-anchor="middle">${opt.title || '¿ Título del gráfico ?'}</text><rect class="ring" x="${W / 2 - 300}" y="8" width="600" height="32" rx="6"/><rect class="hit" x="0" y="4" width="${W}" height="38"/>`);
    const n = Math.floor((max - min) / step + 1e-9);
    for (let i = 0; i <= n; i++) { const v = min + i * step, yy = T + ph - ((v - min) / (max - min)) * ph; g += `<line class="grid" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/><text class="tm" x="${L - 8}" y="${yy + 4}" text-anchor="end">${v}</text>`; }
    g += part('escala', `<rect class="ring" x="${L - 42}" y="${T - 8}" width="40" height="${ph + 16}" rx="6"/><rect class="hit" x="${L - 46}" y="${T - 8}" width="44" height="${ph + 16}"/>`);
    g += `<line class="axis" x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}"/><line class="axis" x1="${L}" x2="${W - R}" y1="${T + ph}" y2="${T + ph}"/>`;
    const bw = pw / data.length;
    data.forEach((d, i) => {
      const x = L + i * bw + bw * 0.16, w = bw * 0.68, cls = opt.hi && opt.hi(d, i) ? 'hi' : '';
      g += `<g class="part ${opt.part === 'barra' && i === 0 ? 'on' : ''}" data-part="barra"><rect class="bar ${cls}" data-i="${i}" x="${x}" y="${T}" width="${w}" height="${ph}" rx="3"/><rect class="ring" x="${x - 3}" y="${T - 3}" width="${w + 6}" height="${ph + 6}" rx="6"/></g>`;
      g += `<text class="val" data-i="${i}" x="${x + w / 2}" y="${T + ph - 7}" text-anchor="middle">${vals[i]}</text>`;
      if (opt.drag) g += `<rect class="hit drag-col" data-col="${i}" x="${x - 4}" y="${T - 10}" width="${w + 8}" height="${ph + 10}"/>`;
      const lab = d[0].length > 13 ? [d[0].split(' ')[0], d[0].split(' ').slice(1).join(' ')] : [d[0]];
      lab.forEach((s, k) => (g += `<text class="tx" x="${x + w / 2}" y="${T + ph + 20 + k * 15}" text-anchor="middle">${s}</text>`));
    });
    g += part('eje_x', `<rect class="ring" x="${L}" y="${T + ph + 4}" width="${pw}" height="40" rx="6"/><rect class="hit" x="${L}" y="${T + ph + 4}" width="${pw}" height="40"/>`);
    if (opt.ylab !== undefined) g += part('eje_y', `<text class="tm ${opt.ylab ? '' : 'ph'}" transform="translate(16 ${T + ph / 2}) rotate(-90)" text-anchor="middle">${opt.ylab || '¿ nombre del eje ?'}</text><rect class="ring" x="2" y="${T}" width="26" height="${ph}" rx="6"/><rect class="hit" x="2" y="${T}" width="26" height="${ph}"/>`);
    if (opt.xlab !== undefined) g += `<text class="tm" x="${L + pw / 2}" y="${H - 6}" text-anchor="middle">${opt.xlab}</text>`;
    box.innerHTML = g + '</svg>';
    api.svg = box.firstChild; api.bars = $$('.bar', api.svg);
    gsap.set(api.bars, { scaleY: (i) => frac(vals[i]), transformOrigin: '50% 100%' });
    gsap.set($$('.val', api.svg), { y: (i) => -frac(vals[i]) * ph });
    if (opt.onPart) $$('.part', api.svg).forEach((p) => p.addEventListener('click', () => opt.onPart(p.dataset.part)));
    if (opt.drag) wireDrag();
  }
  function wireDrag() {
    const { T, ph } = geo(); const min = opt.min ?? 0, max = opt.max ?? 10, step = opt.step ?? 1;
    $$('.drag-col', api.svg).forEach((c) => {
      const setFrom = (ev) => {
        const r = api.svg.getBoundingClientRect(), k = H / r.height;
        const yy = (ev.clientY - r.top) * k, f = 1 - (yy - T) / ph;
        const v = Math.max(min, Math.min(max, Math.round((min + f * (max - min)) / step) * step));
        if (v !== vals[+c.dataset.col]) { opt.onDrag?.(+c.dataset.col, v); beep('tick'); }
      };
      c.addEventListener('pointerdown', (e) => { e.preventDefault(); c.setPointerCapture(e.pointerId); setFrom(e); c.onpointermove = setFrom; });
      c.addEventListener('pointerup', () => (c.onpointermove = null));
    });
  }
  api.set = (nv, animate = true) => {
    const { ph } = geo(); vals = [...nv];
    api.bars.forEach((b, i) => {
      gsap.to(b, { scaleY: frac(vals[i]), duration: animate ? D(0.5) : 0, ease: 'back.out(1.4)', overwrite: 'auto' });
      const v = $$('.val', api.svg)[i]; v.textContent = vals[i];
      gsap.to(v, { y: -frac(vals[i]) * ph, duration: animate ? D(0.5) : 0, ease: 'back.out(1.4)', overwrite: 'auto' });
    });
  };
  /** Las barras crecen desde 0 y los valores cuentan hacia arriba (chart-animation). */
  api.intro = (delay = 0.2) => {
    const { ph } = geo(); const vs = $$('.val', api.svg);
    gsap.from(api.bars, { scaleY: 0, duration: D(0.9), ease: 'power3.out', stagger: RM.matches ? 0 : 0.12, delay });
    vs.forEach((v, i) => {
      gsap.from(v, { y: 0, duration: D(0.9), ease: 'power3.out', delay: delay + (RM.matches ? 0 : i * 0.12) });
      const o = { n: 0 }; gsap.to(o, { n: vals[i], duration: D(0.9), delay: delay + (RM.matches ? 0 : i * 0.12), ease: 'power3.out', onUpdate: () => (v.textContent = Math.round(o.n)) });
    });
    gsap.from($$('.grid,.axis', api.svg), { opacity: 0, duration: D(0.4) });
  };
  api.pulse = (i) => { const b = api.bars[i]; if (b) { b.classList.add('hi'); } };
  api.update = (patch) => { opt = { ...opt, ...patch }; render(); };
  api.geo = geo;
  render();
  return api;
}

/* ---------- clasificar una carta a la vez (arrastrar o tocar el cajón) ---------- */
export function sortGame(el, { items, cats, store, onDone, tint }) {
  const S = store;
  if (!S.idx) { S.idx = 0; S.first = 0; S.miss = false; S.placed = []; S.shown = false; }
  const cls = tint || ['c0', 'c1', 'c2'];
  el.innerHTML = `<div class="sg"><div class="sg-deck"><div class="sg-count"></div><div class="sg-card" role="group" aria-label="Carta a clasificar"></div><div class="sg-fb" aria-live="polite"></div></div>
  <div class="buckets" style="--n:${cats.length}">${cats.map((c, i) => `<button class="bucket ${cls[i]}" data-c="${c}" aria-label="Cajón ${c}"><h4>${c}<em>0</em></h4></button>`).join('')}</div></div>`;
  const card = $('.sg-card', el), fb = $('.sg-fb', el), cnt = $('.sg-count', el);
  const bk = (c) => $$('.bucket', el).find((b) => b.dataset.c === c);
  const addIt = (i, c, anim) => {
    const b = bk(c), it = document.createElement('div'); it.className = 'it'; it.textContent = items[i].t; b.appendChild(it);
    $('em', b).textContent = $$('.it', b).length; if (anim) gsap.from(it, { scale: 0.6, autoAlpha: 0, duration: D(0.4), ease: 'back.out(2)' });
  };
  S.placed.forEach(([i, c]) => addIt(i, c, false));
  function show(first) {
    if (S.idx >= items.length) return finish();
    S.miss = false; S.shown = false; fb.innerHTML = '';
    card.innerHTML = items[S.idx].t + `<small>Arrástrala a su cajón o toca el cajón</small>`;
    card.style.display = '';
    cnt.innerHTML = `<span>Carta ${S.idx + 1} / ${items.length}</span><span>A la primera: ${S.first}</span>`;
    gsap.set(card, { x: 0, y: 0, scale: 1, rotation: 0 });
    gsap.fromTo(card, { autoAlpha: 0, y: mv(-30), scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: D(0.5), ease: 'back.out(1.6)', delay: first ? 0.1 : 0 });
  }
  function answer(c) {
    if (S.idx >= items.length || S.waiting) return;
    const it = items[S.idx];
    if (c === it.a) {
      beep('ok'); if (!S.miss) S.first++;
      S.placed.push([S.idx, c]); S.waiting = true;
      const b = bk(c); const r1 = card.getBoundingClientRect(), r2 = b.getBoundingClientRect();
      gsap.to(card, { x: `+=${r2.left + r2.width / 2 - (r1.left + r1.width / 2)}`, y: `+=${r2.top + r2.height / 2 - (r1.top + r1.height / 2)}`, scale: 0.25, autoAlpha: 0, duration: D(0.45), ease: 'power2.in',
        onComplete: () => { addIt(S.idx, c, true); pop(b, 1.04); } });
      fb.innerHTML = `<div class="fb ok"><b>¡Correcto! · ${c}</b>${it.w}</div>`; gsap.from(fb.firstChild, { y: mv(12), autoAlpha: 0, duration: D(0.3) });
      const next = document.createElement('button'); next.className = 'btn amber'; next.style.marginTop = '.6rem';
      next.innerHTML = S.idx + 1 >= items.length ? `Ver resultado ${ic('right')}` : `Siguiente carta ${ic('right')}`;
      next.onclick = () => { S.waiting = false; S.idx++; show(); };
      fb.firstChild.appendChild(next);
    } else {
      beep('no'); S.miss = true; shake(card);
      const b = bk(c); b.classList.add('no-b'); setTimeout(() => b.classList.remove('no-b'), 700);
      fb.innerHTML = `<div class="fb warn"><b>Casi · lo discutimos</b>Piensa: ¿lo ves en los datos, propone una posibilidad o va más allá? Puedes volver a intentarlo.</div>`;
      gsap.from(fb.firstChild, { y: mv(12), autoAlpha: 0, duration: D(0.3) });
    }
  }
  function finish() {
    card.style.display = 'none'; cnt.textContent = '';
    const all = S.first === items.length;
    fb.innerHTML = `<div class="fb ${all ? 'ok' : 'info'}"><b>${all ? '¡Perfecto! Todas a la primera' : `Terminaste: ${S.first} de ${items.length} a la primera`}</b>${all ? 'Distingues muy bien lo que dicen los datos.' : 'Revisa los cajones: ¿cuáles te costaron? Coméntalo con tu compañero.'}</div><button class="btn sm" style="margin-top:.6rem">${ic('pen')} Jugar de nuevo</button>`;
    $('button', fb).onclick = () => { Object.keys(S).forEach((k) => delete S[k]); sortGame(el, { items, cats, store, onDone, tint }); };
    if (all) { confetti(); beep('win'); } onDone?.(S);
  }
  draggable(card, {
    onMove: (x, y) => $$('.bucket', el).forEach((b) => b.classList.toggle('hot', b === under(x, y, '.bucket'))),
    onDrop: (x, y) => { $$('.bucket', el).forEach((b) => b.classList.remove('hot')); const b = under(x, y, '.bucket'); if (!b) return false; answer(b.dataset.c); return S.waiting; },
  });
  $$('.bucket', el).forEach((b) => (b.onclick = () => answer(b.dataset.c)));
  if (S.idx >= items.length) finish(); else show(true);
}

/* ---------- sondeo de clase (cada toque suma un voto) ---------- */
export function poll(el, { options, store, icons, onChange }) {
  const tot = () => options.reduce((s, _, i) => s + (store[i] || 0), 0);
  el.innerHTML = `<div class="poll">${options.map((o, i) => `<div class="pcard" role="button" tabindex="0" data-i="${i}" aria-label="Votar ${o}"><i class="fillbar"></i>${icons ? `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true">${icons[i]}</svg>` : ''}<b>${o}</b><span class="n">0</span><button class="minus" aria-label="Quitar un voto a ${o}">−</button></div>`).join('')}</div>`;
  const draw = (anim) => {
    const m = Math.max(1, ...options.map((_, i) => store[i] || 0)), top = Math.max(...options.map((_, i) => store[i] || 0));
    $$('.pcard', el).forEach((c, i) => {
      const v = store[i] || 0; $('.n', c).textContent = v; c.classList.toggle('win', v > 0 && v === top);
      gsap.to($('.fillbar', c), { scaleY: v / m * 0.9, duration: anim ? D(0.5) : 0, ease: 'power3.out' });
    });
    onChange?.(tot(), store);
  };
  $$('.pcard', el).forEach((c) => {
    const i = +c.dataset.i;
    const vote = (d) => { store[i] = Math.max(0, (store[i] || 0) + d); beep('tap'); pop($('.n', c), 1.35); draw(true); };
    c.addEventListener('click', (e) => { if (e.target.closest('.minus')) vote(-1); else vote(1); });
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vote(1); } });
  });
  draw(false);
}
