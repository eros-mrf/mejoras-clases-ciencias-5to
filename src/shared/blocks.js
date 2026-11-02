// Bloques de escena reutilizables entre clases: encabezado, preguntas, ruta, vocabulario, evaluación, autoevaluación.
import { gsap, $, $$, ic, enter, pop, shake, confetti, toast, beep, mv, D, countUp } from './kit.js';

export const head = (eb, min, h, lead) => `<div class="head" data-a><div class="eyebrow"><span>${eb}</span><button class="time" data-min="${min}" aria-label="Iniciar temporizador de ${min} minutos">${min} min</button></div><h2>${h}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
export const fbox = (cls, t, m) => `<div class="fb ${cls}"><b>${t}</b>${m}</div>`;

/** Pregunta a pregunta con respuesta inmediata. st = {i, a:{}} */
export function mcq(el, list, st, { onDone, onAnswer } = {}) {
  const draw = () => {
    const i = st.i, q = list[i], a = st.a[i], done = a !== undefined;
    el.innerHTML = `<div style="display:grid;gap:.8rem"><div class="row" style="justify-content:space-between"><span class="tag">Pregunta ${i + 1} de ${list.length}</span><span class="pill">Correctas: <b>${Object.keys(st.a).filter((k) => st.a[k] === list[k].a).length}</b></span></div>
    <div class="prog"><i style="transform:scaleX(${(i + (done ? 1 : 0)) / list.length})"></i></div><p class="qtext">${q.q}</p>
    <div class="opts">${q.o.map((o, k) => `<button class="opt ${done ? (k === q.a ? 'right' : a === k ? 'wrong' : 'dim') : ''}" data-k="${k}" ${done ? 'disabled' : ''}><span class="k">${'ABC'[k]}</span>${o}</button>`).join('')}</div>
    <div id="mfb">${done ? fbox(a === q.a ? 'ok' : 'no', a === q.a ? 'Correcto' : 'Revisemos', q.w) : ''}</div>
    <div class="row">${i > 0 ? `<button class="btn sm" id="mp">${ic('left')} Anterior</button>` : ''}${done && i < list.length - 1 ? `<button class="btn amber" id="mn">Siguiente pregunta ${ic('right')}</button>` : ''}${done && i === list.length - 1 ? `<span class="tag">¡Terminaste!</span>` : ''}</div></div>`;
    $$('.opt', el).forEach((b) => (b.onclick = () => {
      const k = +b.dataset.k; st.a[i] = k; beep(k === q.a ? 'ok' : 'no'); draw();
      const t = k === q.a ? $('.opt.right', el) : $('.opt.wrong', el); k === q.a ? pop(t, 1.04) : shake(t);
      gsap.from($('#mfb', el).firstChild, { y: mv(12), autoAlpha: 0, duration: D(0.3) });
      onAnswer?.(i, k, k === q.a); if (Object.keys(st.a).length === list.length) onDone?.();
    }));
    $('#mn', el)?.addEventListener('click', () => { st.i++; draw(); gsap.from(el.firstChild, { x: mv(40), autoAlpha: 0, duration: D(0.35), ease: 'power3.out' }); });
    $('#mp', el)?.addEventListener('click', () => { st.i--; draw(); });
  };
  draw();
}

/** Calcula segmentos curvos que unen los centros de las estaciones (coordenadas relativas a `road`). */
export function roadPath(road, nodes, centerOf = (n) => n) {
  const r0 = road.getBoundingClientRect(), svg = $('svg', road);
  if (!svg || !svg.clientWidth || getComputedStyle(svg).display === 'none') return null;
  const pts = nodes.map((n) => { const r = centerOf(n).getBoundingClientRect(); return [r.left + r.width / 2 - r0.left, r.top + r.height / 2 - r0.top]; });
  svg.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
  const segs = pts.slice(1).map((p, i) => { const a = pts[i], dx = (p[0] - a[0]) / 2; return `M${a[0]} ${a[1]}C${a[0] + dx} ${a[1]} ${p[0] - dx} ${p[1]} ${p[0]} ${p[1]}`; });
  svg.innerHTML = segs.map((d) => `<path class="track" d="${d}"/>`).join('') + segs.map((d) => `<path class="way" d="${d}"/>`).join('');
  return { svg, ways: $$('.way', svg), segs, pts };
}

/** Escena "Ruta de la clase": estaciones que aparecen a lo largo de un camino dibujado. */
export const ruta = ({ eb, min = 5, h2, lead, items }) => (el, api) => {
  el.innerHTML = `${head(eb, min, h2, lead)}
  <div class="road" data-a><svg aria-hidden="true"></svg><div class="stations">${items.map((s, i) => `<button class="station" data-i="${i}"><span class="n">${i + 1}</span><h3>${s[0]}</h3><p>${s[1]}</p></button>`).join('')}</div></div>`;
  gsap.set($$('.station', el), { autoAlpha: 0 });
  api.later(() => { try {
    const st = $$('.station', el), rp = roadPath($('.road', el), st, (s) => $('.n', s));
    if (!rp) { enter(st, { stagger: 0.12 }); return; } // pantallas angostas: sin camino dibujado, solo tarjetas
    const tl = gsap.timeline({ delay: 0.2 });
    gsap.set(st, { autoAlpha: 0, y: mv(30) });
    tl.to(st[0], { autoAlpha: 1, y: 0, duration: D(0.5), ease: 'back.out(1.6)' });
    rp.ways.forEach((w, i) => { tl.fromTo(w, { drawSVG: '0%' }, { drawSVG: '100%', duration: D(0.55), ease: 'power1.inOut' }).to(st[i + 1], { autoAlpha: 1, y: 0, duration: D(0.5), ease: 'back.out(1.6)' }, '-=0.1'); });
    api.cleanup(() => tl.kill());
  } catch (e) { gsap.set($$('.station', el), { autoAlpha: 1, y: 0 }); } }, 60);
  $$('.station', el).forEach((s) => (s.onclick = () => { $$('.station', el).forEach((x) => x.classList.toggle('on', x === s)); pop(s, 1.05); beep('tap'); }));
};

/** Tarjetas que se dan vuelta: pares [frente, reverso]. store = Set de claves ya vistas */
export const flipCards = ({ eb, h2, lead, pairs, store, min = 5, noun = 'Tarjetas descubiertas', hint = 'Toca para girar', tall = false }) => (el) => {
  el.innerHTML = `${head(eb, min, h2, lead)}
  <div class="row" data-a><span class="pill">${noun}: <b id="vc">${store.size}</b> / ${pairs.length}</span></div>
  <div class="vocab ${tall ? 'tall' : ''}" data-a>${pairs.map(([f, b], i) => `<button class="vcard" data-k="${i}" aria-label="${f}: tocar para ver el reverso"><span class="f a">${f}<small>${hint}</small></span><span class="f b">${b}</span></button>`).join('')}</div>`;
  const flip = (c, to, anim = true) => gsap.to(c, { rotationY: to ? 180 : 0, duration: anim ? D(0.6) : 0, ease: 'power3.inOut' });
  $$('.vcard', el).forEach((c) => { if (store.has(c.dataset.k)) flip(c, true, false); c.onclick = () => { const on = store.has(c.dataset.k); on ? store.delete(c.dataset.k) : store.add(c.dataset.k); flip(c, !on); beep('tap'); $('#vc', el).textContent = store.size; if (store.size === pairs.length) { confetti(); toast('¡Descubrieron todas!'); } }; });
};
export const vocabCards = ({ eb, VOCAB, store }) => flipCards({ eb, h2: 'Vocabulario clave · da vuelta cada tarjeta', lead: 'Un estudiante voluntario toca una palabra, intenta decir qué significa y luego la damos vuelta para comprobarlo.', pairs: Object.keys(VOCAB).map((k) => [k, `<b>${k}</b>${VOCAB[k]}`]), store, noun: 'Palabras descubiertas' });

/** Juego "¿qué palabra es?": 5 rondas con respuesta inmediata. store = objeto de estado persistente */
export const vocabGame = ({ eb, VOCAB, store }) => (el) => {
  const keys = Object.keys(VOCAB), n = Math.min(5, keys.length);
  if (!store.list) Object.assign(store, { i: 0, a: {}, list: keys.slice().sort(() => Math.random() - 0.5).slice(0, n).map((k) => { const o = keys.filter((x) => x !== k).sort(() => Math.random() - 0.5).slice(0, 2).concat(k).sort(() => Math.random() - 0.5); return { q: `Es: «${VOCAB[k]}». ¿Qué palabra es?`, o, a: o.indexOf(k), w: `Es “${k}”.` }; }) });
  el.innerHTML = `${head(eb, 5, '¿Qué palabra es?', 'Leemos el significado y elegimos la palabra. Usa el botón <strong>Turno</strong> para que cada pregunta la responda un estudiante distinto.')}<div class="panel" data-a id="vg" style="max-width:56rem"></div>`;
  mcq($('#vg', el), store.list, store, { onDone: () => { confetti(); beep('win'); } });
};

/** Evaluación formativa: una pregunta a la vez, resultados solo al finalizar. */
export const evalQuiz = ({ QS, store: E, msg }) => (el) => {
  const N = QS.length;
  el.innerHTML = `${head('Evaluación formativa', 7, 'Comprobamos lo aprendido', `Responde las ${N === 6 ? 'seis' : N} preguntas y pulsa <strong>Finalizar</strong>: solo ahí verás cuáles fueron correctas.`)}<div class="panel" id="ev" data-a style="max-width:62rem"></div>`;
  const box = $('#ev', el);
  const draw = () => {
    if (E.done) return results();
    const i = E.i, q = QS[i], n = Object.keys(E.ans).length;
    box.innerHTML = `<div class="row" style="justify-content:space-between"><span class="tag">Pregunta ${i + 1} de ${N}</span><span class="pill">Respondidas: <b>${n}</b> / ${N}</span></div>
    <div class="row" style="margin:.7rem 0">${QS.map((_, k) => `<button class="chip" data-g="${k}" aria-pressed="${k === i}" style="${E.ans[k] !== undefined ? 'border-color:var(--safe)' : ''};min-width:3rem">${k + 1}</button>`).join('')}</div>
    <p class="qtext" style="margin-bottom:.8rem">${q.q}</p><div class="opts">${q.o.map((o, k) => `<button class="opt ${E.ans[i] === k ? 'sel' : ''}" data-k="${k}"><span class="k">${'ABC'[k]}</span>${o}</button>`).join('')}</div>
    <div class="row" style="margin-top:1rem">${i > 0 ? `<button class="btn" id="ep">${ic('left')} Anterior</button>` : ''}${i < N - 1 ? `<button class="btn" id="en">Siguiente ${ic('right')}</button>` : ''}<button class="btn amber" id="fin" ${n < N ? 'disabled' : ''}>Finalizar y ver resultados</button><span class="muted">${n < N ? `Te faltan ${N - n} por responder.` : '¡Listo! Puedes finalizar.'}</span></div>`;
    $$('.opt', box).forEach((b) => (b.onclick = () => { E.ans[i] = +b.dataset.k; beep('tap'); draw(); if (i < N - 1) setTimeout(() => { E.i = i + 1; draw(); gsap.from(box.children, { x: mv(40), autoAlpha: 0, duration: D(0.35), stagger: 0.04 }); }, 450); }));
    $$('[data-g]', box).forEach((b) => (b.onclick = () => { E.i = +b.dataset.g; draw(); }));
    $('#ep', box)?.addEventListener('click', () => { E.i--; draw(); }); $('#en', box)?.addEventListener('click', () => { E.i++; draw(); });
    $('#fin', box).onclick = () => { E.done = true; draw(); };
  };
  const results = () => {
    const ok = QS.filter((q, i) => E.ans[i] === q.a).length;
    box.innerHTML = `<div class="score"><div><span class="tag">Tu resultado</span><div class="big" id="sc">0 / ${N}</div></div><p style="max-width:48ch">${msg(ok, N)}</p></div>
    <div class="res-list" style="margin-top:1rem">${QS.map((q, i) => { const g = E.ans[i] === q.a; return `<div class="fb ${g ? 'ok' : 'no'}"><b>${g ? '✔' : '✘'} Pregunta ${i + 1}</b>${g ? q.w : `Correcta: <b style="display:inline;color:inherit">${q.o[q.a]}</b>. ${q.w}`}</div>`; }).join('')}</div>`;
    countUp($('#sc', box), ok, 1, (n) => `${Math.round(n)} / ${N}`); enter($$('.fb', box), { stagger: 0.12, delay: 0.5 }); if (ok >= N - 1) setTimeout(() => { confetti(); beep('win'); }, 800);
  };
  draw();
};

/** Lista de logros con casillas. set = Set de índices marcados. */
export function checklist(box, items, set) {
  const d = () => {
    box.innerHTML = items.map((c, i) => `<button class="chk" data-i="${i}" aria-pressed="${set.has(i)}"><span class="box">${set.has(i) ? ic('check') : ''}</span>${c}</button>`).join('');
    $$('.chk', box).forEach((b) => (b.onclick = () => { const i = +b.dataset.i; set.has(i) ? set.delete(i) : set.add(i); d(); pop($$('.chk .box', box)[i], 1.3); beep('tap'); if (set.size === items.length) { confetti(); beep('win'); } }));
  };
  d();
}
