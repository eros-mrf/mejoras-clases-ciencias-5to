// Clase 21 · ¿De dónde viene la electricidad que usamos? — escenas interactivas (misma estructura que la versión original).
import { gsap, $, $$, ic, enter, pop, shake, confetti, toast, beep, mv, D, reduced, sortGame, poll, draggable, under } from '../../shared/kit.js';
import { startDeck } from '../../shared/deck.js';
import { head, fbox, mcq, ruta, flipCards, vocabCards, vocabGame, evalQuiz, checklist, roadPath } from '../../shared/blocks.js';
import * as C from './content.js';
import erosImg from '../../../assets/eros21.webp';

const STAGES = [['meta', 'Meta'], ['ruta', 'Ruta'], ['ini', 'Inicio'], ['rec', 'Recorrido'], ['fue', 'Fuentes'], ['cad', 'Cadena'], ['sala', 'Mi sala'], ['uso', 'Uso responsable'], ['eval', 'Evaluación'], ['cierre', 'Cierre']].map(([id, name]) => ({ id, name }));
const FL = ['fuente', 'gen', 'trans', 'dist', 'user'];

/* íconos propios de la clase (recorrido y fuentes) */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="f-fuente" viewBox="0 0 48 48"><circle cx="14" cy="14" r="6"/><path d="M14 3v3M14 22v3M3 14h3M22 14h3M6.2 6.2l2.1 2.1M19.7 19.7l-2.1-2.1M6.2 21.8l2.1-2.1M19.7 8.3l-2.1 2.1"/><path d="M26 30q4-6 8 0t8 0M26 38q4-6 8 0t8 0"/></symbol>
<symbol id="f-gen" viewBox="0 0 48 48"><circle cx="24" cy="24" r="17"/><path d="M26 11 17 26h7l-2 11 10-16h-7z"/></symbol>
<symbol id="f-trans" viewBox="0 0 48 48"><path d="M24 4 12 44M24 4l12 40M16 28h16M19 16h10M10 38h28M8 12h32"/><path d="M2 14q4 5 6-2M46 14q-4 5-6-2"/></symbol>
<symbol id="f-dist" viewBox="0 0 48 48"><path d="M24 6v38M14 14h20M16 22h16"/><path d="M2 20q5 6 12-6M46 20q-5 6-12-6"/><path d="M8 44h32"/></symbol>
<symbol id="f-user" viewBox="0 0 48 48"><path d="M5 22 24 6l19 16M10 20v22h28V20"/><path d="M20 42V30h8v12"/></symbol>
${Object.entries(C.SRC_ICONS).map(([k, d]) => `<symbol id="s-${k}" viewBox="0 0 48 48">${d}</symbol>`).join('')}</svg>`;
document.body.insertAdjacentHTML('beforeend', SPRITE);
const fi = (n, cls = 'fi') => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><use href="#f-${n}"/></svg>`;

/* estado que sobrevive al ir y volver entre diapositivas */
const S = { hyp: null, hv: {}, vc: new Set(), vg: {}, qv: new Set(), node: 0, src: [], sr: {}, pf: {}, o1: { slots: [null, null, null, null, null], checked: false }, o2: { arr: [0, 2, 1, 3, 4], sel: null, checked: false },
  map: { i: 0, a: {} }, expl: 'La electricidad que usamos no aparece en el enchufe; antes ', devs: new Set([0, 2, 5, 7, 8, 11]), ev: { i: 0, ans: {}, done: false }, can: new Set(), rev: null, rv: {}, tk: ['', ''], gen: 'viento' };

const SCENES = [];
const add = (stage, title, build) => SCENES.push({ stage, title, build });
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Resalta uno a uno los elementos (un pulso de energía recorriendo la cadena). */
function pulse(els, cls = 'lit', gap = 0.5) {
  const tl = gsap.timeline();
  els.forEach((e, k) => tl.call(() => { els.forEach((x) => x.classList.remove(cls)); e.classList.add(cls); beep('tick'); }, null, k * gap));
  tl.call(() => els.forEach((x) => x.classList.remove(cls)), null, els.length * gap + 0.3);
  return tl;
}

/* ===== META ===== */
add('meta', 'Portada y meta', (el) => {
  el.innerHTML = `<div class="eyebrow" data-a><span>Clase 21 · OA 11 (profundización contextual)</span><button class="time" data-min="90" aria-label="Temporizador de 90 minutos">90 min</button></div>
  <div class="cover"><div class="eros" data-a><svg class="deco-g" viewBox="0 0 320 200" aria-hidden="true"><path d="M70 196 88 70 106 196M76 150h24M82 108h12M58 80h60"/><path d="M214 196 232 70 250 196M220 150h24M226 108h12M202 80h60"/><path class="w" d="M88 74Q160 120 232 74M58 84Q130 130 202 84M118 84Q190 130 262 84"/></svg><img alt="El profe Eros señalando la meta de la clase" src="${erosImg}"></div>
  <div class="cover-text"><h1>¿De dónde viene la <em>electricidad que usamos?</em></h1>
  <div class="meta-box" data-build="1"><div class="meta-label"><span>Meta de la clase</span><small>${ic('pen')}Anótala en tu cuaderno</small></div><p class="meta-text">${C.META}</p></div>
  <div class="agree" data-build="2"><b>Habilidades de hoy:</b> organizar información y seguir un proceso paso a paso (OAH c) y formular explicaciones razonables (OAH f). <b>Idea para recordar:</b> el enchufe no fabrica electricidad, solo es el final del recorrido.</div></div></div>`;
  $('.meta-box', el).addEventListener('reveal', () => { beep('ok'); gsap.fromTo($('.meta-box', el), { boxShadow: '0 0 0 0 rgba(255,79,216,.5)' }, { boxShadow: '0 0 0 18px rgba(255,79,216,0)', duration: D(1.2), repeat: 2 }); });
});

/* ===== RUTA ===== */
add('ruta', 'Ruta de la clase', ruta({ eb: 'Ruta de la clase', h2: 'Cinco pasos para seguir el recorrido de la electricidad', lead: 'Toca una estación para destacarla. Hoy iremos del enchufe hasta el origen y de vuelta.', items: C.ROUTE }));
add('ruta', 'Vocabulario clave', vocabCards({ eb: 'Ruta de la clase · Vocabulario', VOCAB: C.VOCAB, store: S.vc }));
add('ruta', 'Juego: ¿qué palabra es?', vocabGame({ eb: 'Ruta de la clase · Juego rápido', VOCAB: C.VOCAB, store: S.vg }));

/* ===== INICIO ===== */
add('ini', 'Mi hipótesis', (el) => {
  el.innerHTML = `${head('Inicio · “El enchufe no fabrica electricidad”', 10, 'Si el enchufe no crea la electricidad, ¿de dónde viene?', 'Solo <strong>observamos la imagen</strong>: en la sala nunca tocamos enchufes. Elige la hipótesis que te parezca más razonable (cada toque suma un voto de la clase). <strong>Volveremos a ella al cierre</strong>.')}
  <div class="grid2"><div class="panel" data-a style="display:grid;gap:.7rem;justify-items:center;text-align:center">
  <svg class="outlet" viewBox="0 0 400 150" role="img" aria-label="Dibujo de un enchufe de pared del que sale un cable hacia un lugar desconocido"><rect x="12" y="12" width="126" height="126" rx="22" fill="#1A2536" stroke="#3A4a60" stroke-width="3"/><circle cx="75" cy="75" r="46" fill="#131C28" stroke="#3A4a60" stroke-width="3"/><rect x="52" y="58" width="9" height="30" rx="3" fill="#FFC53D"/><rect x="89" y="58" width="9" height="30" rx="3" fill="#FFC53D"/><circle cx="75" cy="102" r="4" fill="#FFC53D"/>
  <path class="wire" d="M138 75C200 75 220 36 290 36S360 75 392 75"/><text id="qm" x="330" y="30" fill="#FF4FD8" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="40">?</text></svg>
  <p class="qtext">Imagen para observar, no para tocar.</p><p class="muted">¿Qué pistas tienes? Piensa en postes, torres, cables y en lo que necesita un aparato para funcionar.</p></div>
  <div data-a style="display:grid;gap:.7rem;align-content:start"><h3 style="font-size:1.3rem">Mi hipótesis</h3><div class="opts" id="hyp"></div><div id="hypFb"></div></div></div>`;
  if (!reduced()) gsap.to($('#qm', el), { y: -8, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  const draw = () => {
    $('#hyp', el).innerHTML = C.HYP.map((h, i) => `<button class="opt ${S.hyp === i ? 'sel' : ''}" data-i="${i}" aria-pressed="${S.hyp === i}"><span class="k">${'ABCD'[i]}</span>${h.t}${S.hv[i] ? `<span class="tally" aria-label="${S.hv[i]} votos">${S.hv[i]}</span>` : ''}</button>`).join('');
    $$('#hyp .opt', el).forEach((b) => (b.onclick = () => { const i = +b.dataset.i; S.hyp = i; S.hv[i] = (S.hv[i] || 0) + 1; beep('tap'); draw(); pop($$('#hyp .opt', el)[i], 1.03); }));
    $('#hypFb', el).innerHTML = S.hyp === null ? '' : fbox('warn', 'Hipótesis guardada', 'No decimos todavía si es correcta: la revisaremos al cierre, con evidencia.');
  };
  draw();
});
add('ini', 'Preguntas iniciales', flipCards({ eb: 'Inicio · Preguntas iniciales', min: 10, h2: 'Preguntas iniciales · toca una para ver una pista', lead: 'Un estudiante lee la pregunta en voz alta y propone una idea. Luego damos vuelta la tarjeta para ver una pista.', pairs: C.INI_Q.map((q, i) => [`${i + 1}. ${q[0]}`, `<b>Pista</b>${q[1]}`]), store: S.qv, noun: 'Pistas descubiertas', hint: 'Toca para ver una pista', tall: true }));

/* ===== RECORRIDO ===== */
add('rec', 'El recorrido general', (el, api) => {
  el.innerHTML = `${head('Modelamiento · de la fuente al usuario', 15, 'El recorrido general de la electricidad', 'Toca cada etapa para ver <strong>qué ocurre</strong>, o sigue el recorrido de principio a fin. También puedes <strong>retroceder desde el enchufe</strong> hasta el origen.')}
  <div class="row" data-a><button class="btn amber" id="pf">${ic('play')} Del origen al usuario</button><button class="btn" id="pb">${ic('left')} Retroceder desde el enchufe</button></div>
  <div class="fl" data-a><svg aria-hidden="true"></svg><div class="fnodes">${C.FLOW.map((f, i) => `<button class="fnode" data-i="${i}" aria-pressed="false"><span class="num">${i + 1}</span>${fi(f.ic)}<b>${f.n}</b><small>${f.s}</small></button>`).join('')}</div></div><div class="fb info" id="flowFb" aria-live="polite" data-a></div>`;
  const nodes = $$('.fnode', el), fb = $('#flowFb', el); let rp = null, tl = null;
  const sel = (i, snd = true) => {
    S.node = i; nodes.forEach((n, k) => { n.classList.toggle('on', k === i); n.setAttribute('aria-pressed', k === i); }); const f = C.FLOW[i];
    fb.innerHTML = `<b>${i + 1}. ${f.n}</b>${f.w}<br><span class="muted">${f.ex}</span>${f.sf ? `<div class="safe-note">${ic('warn')}<span><b style="color:var(--risk);display:inline">Seguridad:</b> ${f.sf}</span></div>` : ''}`;
    gsap.fromTo(fb, { scale: 0.98 }, { scale: 1, duration: D(0.3), ease: 'back.out(2)' }); if (snd) beep('tick');
  };
  nodes.forEach((n, i) => (n.onclick = () => { tl?.kill(); sel(i); pop(n, 1.04); }));
  api.later(() => { rp = roadPath($('.fl', el), nodes, (n) => $('svg.fi', n)); if (rp) { gsap.set(rp.ways, { drawSVG: '0% 0%' }); const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); dot.setAttribute('r', 9); dot.setAttribute('class', 'pulse'); rp.svg.appendChild(dot); rp.dot = dot; gsap.set(dot, { autoAlpha: 0 }); } }, 120);
  const play = (rev) => {
    tl?.kill(); tl = gsap.timeline(); const order = rev ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4]; sel(order[0]);
    if (rp) { gsap.set(rp.ways, { drawSVG: '0% 0%' }); tl.set(rp.dot, { autoAlpha: 1 }); }
    order.slice(1).forEach((to, k) => {
      const t = k * 2.1, seg = Math.min(order[k], to);
      if (rp) {
        const trk = $$('.track', rp.svg)[seg];
        tl.to(rp.dot, { motionPath: { path: trk, align: trk, alignOrigin: [0.5, 0.5], start: rev ? 1 : 0, end: rev ? 0 : 1 }, duration: reduced() ? 0.05 : 1.6, ease: 'power1.inOut' }, t);
        tl.fromTo(rp.ways[seg], { drawSVG: rev ? '100% 100%' : '0% 0%' }, { drawSVG: rev ? '0% 100%' : '0% 100%', duration: reduced() ? 0.05 : 1.6, ease: 'power1.inOut' }, t);
      }
      tl.call(sel, [to], t + 1.7);
    });
    if (rp) tl.to(rp.dot, { autoAlpha: 0, duration: 0.3 }, '+=0.6');
  };
  $('#pf', el).onclick = () => play(false); $('#pb', el).onclick = () => play(true);
  api.cleanup(() => tl?.kill()); sel(S.node, false);
});

add('rec', 'Generación: se transforma la energía', (el, api) => {
  el.innerHTML = `${head('Modelamiento · Generación', 15, '¿Qué pasa en la generación?', 'En una central, la energía de una fuente se <strong>transforma</strong> en energía eléctrica: el <strong>movimiento</strong> del viento o del agua, o el <strong>calor</strong> de un combustible al quemarse. Es la misma idea de las transformaciones de energía que ya estudiamos.')}
  <div class="chips" data-a id="gch" role="group" aria-label="Elige una fuente">${Object.entries(C.GEN).map(([k, g]) => `<button class="chip" data-k="${k}" aria-pressed="${S.gen === k}">${g.n}</button>`).join('')}</div>
  <div class="panel" data-a style="display:grid;gap:.8rem"><svg class="gensvg" viewBox="0 0 760 230" role="img" aria-label="Una fuente de energía mueve una turbina que produce electricidad">
  <g id="gsrc"></g><path class="fl2" d="M150 112H290"/><circle class="fillc" cx="380" cy="112" r="68"/><g transform="translate(380 112)"><g id="tb"><path class="blade" d="M0 0C14-20 12-50 0-58-12-50-14-20 0 0z"/><path class="blade" transform="rotate(120)" d="M0 0C14-20 12-50 0-58-12-50-14-20 0 0z"/><path class="blade" transform="rotate(240)" d="M0 0C14-20 12-50 0-58-12-50-14-20 0 0z"/></g><circle r="8" fill="#FFC53D"/></g>
  <path class="fl2" d="M470 112H600"/><circle class="fillc" cx="660" cy="112" r="52"/><path class="st" d="M668 82 645 120h18l-4 28 28-40h-18z" style="fill:rgba(255,197,61,.2)"/>
  <text x="90" y="212" id="gl1"></text><text x="380" y="212">Turbina</text><text x="660" y="212">Electricidad</text></svg>
  <div class="row" id="gchain" style="justify-content:center"></div><p class="lead" id="ghow" style="max-width:none;text-align:center"></p></div>
  <div class="panel" data-build="1" style="border-color:var(--safe)"><h3>Piensa: ¿qué tienen en común las tres fuentes?</h3><p class="qtext" style="font-weight:600">En todas, la energía de una fuente <span style="color:var(--amber)">se transforma</span> en energía eléctrica dentro de una central.</p></div>`;
  let spin = null;
  const draw = () => {
    const g = C.GEN[S.gen], k = S.gen === 'fuego' ? 'gas' : S.gen;
    $$('#gch .chip', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === S.gen));
    $('#gsrc', el).innerHTML = `<circle class="fillc" cx="90" cy="112" r="60"/><use class="st" href="#s-${k}" x="52" y="74" width="76" height="76"/>`; $('#gl1', el).textContent = g.n;
    $('#gchain', el).innerHTML = g.chain.map((c, i) => `${i ? '<span class="ar" style="color:var(--amber);font-weight:800">→</span>' : ''}<span class="pill">${c}</span>`).join(''); $('#ghow', el).textContent = g.how;
    spin?.kill(); if (!reduced()) spin = gsap.to($('#tb', el), { rotation: 360, svgOrigin: '0 0', duration: g.speed, repeat: -1, ease: 'none' });
    gsap.from($('#gsrc', el), { scale: 0.7, autoAlpha: 0, transformOrigin: '90px 112px', duration: D(0.4), ease: 'back.out(2)' });
  };
  $$('#gch .chip', el).forEach((b) => (b.onclick = () => { S.gen = b.dataset.k; beep('tap'); draw(); }));
  draw(); api.cleanup(() => spin?.kill());
});

/* ===== FUENTES ===== */
add('fue', 'Compara dos fuentes', (el) => {
  el.innerHTML = `${head('Actividad central · Comparamos fuentes', 15, 'Distintas fuentes, distintas ventajas y desafíos', 'Son <strong>ejemplos de contexto</strong>: no hay que memorizar tecnologías, sino comparar y explicar con ideas generales. <strong>Toca dos tarjetas</strong> para compararlas.')}
  <div class="srcs" data-a>${C.SRC.map((s) => `<button class="scard" data-k="${s.k}" aria-pressed="false"><span class="ord"></span><svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><use href="#s-${s.k}"/></svg><b>${s.n}</b><span class="tg ${s.t === 'R' ? 're' : 'nr'}">${s.t === 'R' ? 'Renovable' : 'No renovable'}</span></button>`).join('')}</div><div id="cmp" data-a></div>`;
  const tg = (s) => `<span class="tg ${s.t === 'R' ? 're' : 'nr'}">${s.t === 'R' ? 'Renovable' : 'No renovable'}</span>`;
  const show = (anim) => {
    $$('.scard', el).forEach((c) => { const i = S.src.indexOf(c.dataset.k); c.classList.toggle('sel', i >= 0); c.setAttribute('aria-pressed', i >= 0); $('.ord', c).textContent = i + 1; });
    const [a, b] = S.src.map((k) => C.SRC.find((s) => s.k === k)), box = $('#cmp', el);
    if (!b) { box.innerHTML = '<p class="muted">Elige dos fuentes para ver la comparación.</p>'; return; }
    box.innerHTML = `<div class="tbl-wrap"><table><thead><tr><th></th><th>${a.n}</th><th>${b.n}</th></tr></thead><tbody><tr><td><b>Tipo</b></td><td>${tg(a)}</td><td>${tg(b)}</td></tr><tr><td><b>Cómo se usa</b></td><td>${a.o}</td><td>${b.o}</td></tr><tr><td><b>Una ventaja</b></td><td>${a.v}</td><td>${b.v}</td></tr><tr><td><b>Un desafío</b></td><td>${a.d}</td><td>${b.d}</td></tr></tbody></table></div><div class="fb info" style="margin-top:.7rem"><b>Tu turno</b>Anota en tu cuaderno una característica general de cada fuente y una diferencia entre ellas.</div>`;
    if (anim) enter($$('tbody tr', box), { stagger: 0.12, y: 14 });
  };
  $$('.scard', el).forEach((c) => (c.onclick = () => { const k = c.dataset.k, i = S.src.indexOf(k); if (i >= 0) S.src.splice(i, 1); else { S.src.push(k); if (S.src.length > 2) S.src.shift(); } beep('tap'); pop(c, 1.06); show(true); }));
  show(false);
});
add('fue', 'Renovable o no renovable', (el) => {
  el.innerHTML = `${head('Actividad central · Clasificamos fuentes', 15, '¿Renovable o no renovable?', 'Arrastra cada tarjeta a su cajón, o toca el cajón.')}
  <div class="grid2 wide-r"><div style="display:grid;gap:.8rem" data-a><div class="fb ok"><b>Renovable</b>Se repone de forma natural y se puede seguir usando.<div class="row" style="margin-top:.5rem">${['sol', 'viento', 'agua'].map((k) => `<svg class="ico" style="width:2rem;height:2rem;stroke:var(--safe)" viewBox="0 0 48 48"><use href="#s-${k}"/></svg>`).join('')}</div></div>
  <div class="fb warn"><b>No renovable</b>Se agota al usarse, porque se forma muy lentamente.<div class="row" style="margin-top:.5rem">${['carbon', 'gas', 'petro'].map((k) => `<svg class="ico" style="width:2rem;height:2rem;stroke:var(--amber)" viewBox="0 0 48 48"><use href="#s-${k}"/></svg>`).join('')}</div></div></div><div id="gR" data-a></div></div>`;
  sortGame($('#gR', el), { items: C.SORTR, cats: C.CATR, store: S.sr, tint: ['good', 'c1'] });
});
add('fue', '¿Existe una fuente perfecta?', (el) => {
  const q = C.PERF[0];
  el.innerHTML = `${head('Actividad central · Debate', 15, q.q, 'Piensen en lo que vimos: ¿cada fuente tiene ventajas, desafíos, o ninguna dificultad? Voten con un toque y luego comprobamos.')}
  <div id="pp" data-a></div><div data-build="1" style="display:grid;gap:.7rem">${fbox('ok', `Respuesta: ${q.o[q.a]}`, q.w)}</div>`;
  const cards = [];
  poll($('#pp', el), { options: q.o, store: S.pf });
  $('[data-build]', el).addEventListener('reveal', () => { beep('win'); const c = $$('.pcard', el)[q.a]; c.classList.add('win'); pop(c, 1.06); });
});

/* ===== CADENA ===== */
add('cad', 'Cadena: ordena las tarjetas', (el) => {
  const O = S.o1;
  el.innerHTML = `${head('Actividad central · Cadena “Del origen al uso”', 15, 'Nivel 1 · Ordena el recorrido', 'Arrastra cada tarjeta a su casillero, o tócala para ponerla en el siguiente. Toca un casillero lleno para devolver la tarjeta.')}
  <div class="panel" data-a style="display:grid;gap:1rem"><div class="cslots" id="slots"></div><div class="cbank" id="bank" aria-label="Banco de tarjetas"></div><div class="row"><button class="btn amber" id="chk">Comprobar orden</button><button class="btn" id="rst">Reiniciar</button></div><div id="fb" aria-live="polite"></div></div>`;
  const put = (i, k) => { O.slots[i] = k; O.checked = false; $('#fb', el).innerHTML = ''; beep('tap'); draw(); };
  const draw = () => {
    $('#slots', el).innerHTML = O.slots.map((v, i) => { const c = ['cslot']; if (v !== null) c.push('full'); if (O.checked && v !== null) c.push(v === i ? 'right' : 'wrong'); return `<button class="${c.join(' ')}" data-i="${i}" aria-label="Casillero ${i + 1}${v !== null ? ': ' + C.CH[v].n : ' vacío'}"><span><span class="sn">PASO ${i + 1}</span>${v !== null ? `<b>${C.CH[v].n}</b>` : '—'}</span></button>`; }).join('');
    $$('.cslot', el).forEach((b) => (b.onclick = () => { const i = +b.dataset.i; if (O.slots[i] !== null) { O.slots[i] = null; O.checked = false; draw(); } }));
    $('#bank', el).innerHTML = C.BANK_ORDER.filter((k) => !O.slots.includes(k)).map((k) => `<div class="ccard" data-k="${k}" role="button" tabindex="0">${C.CH[k].n}<small>${C.CH[k].d}</small></div>`).join('') || '<span class="muted">Todas las tarjetas están en los casilleros.</span>';
    $$('.ccard', el).forEach((c) => {
      const k = +c.dataset.k;
      draggable(c, {
        onMove: (x, y) => $$('.cslot', el).forEach((s) => s.classList.toggle('hot', s === under(x, y, '.cslot'))),
        onDrop: (x, y) => { $$('.cslot', el).forEach((s) => s.classList.remove('hot')); const s = under(x, y, '.cslot'); if (!s || O.slots[+s.dataset.i] !== null) return false; put(+s.dataset.i, k); return true; },
      });
      c.addEventListener('tap', () => { const i = O.slots.indexOf(null); if (i >= 0) put(i, k); });
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const i = O.slots.indexOf(null); if (i >= 0) put(i, k); } });
    });
  };
  $('#chk', el).onclick = () => {
    if (O.slots.includes(null)) { toast('Completa los cinco casilleros'); beep('no'); return; }
    O.checked = true; const bad = O.slots.filter((v, i) => v !== i).length; draw();
    $('#fb', el).innerHTML = bad ? fbox('no', 'Casi', 'Revisa los casilleros en rojo. Pregúntate: ¿qué tiene que existir antes para que ocurra el siguiente paso?') : fbox('ok', 'Cadena correcta', 'Fuente → generación → transporte → distribución → usuario. La electricidad no aparece en el enchufe: antes se generó y viajó.');
    gsap.from($('#fb', el).firstChild, { y: mv(12), autoAlpha: 0, duration: D(0.3) });
    if (bad) { beep('no'); shake($('#slots', el)); } else { beep('win'); confetti(); pulse($$('.cslot', el)); }
  };
  $('#rst', el).onclick = () => { O.slots = [null, null, null, null, null]; O.checked = false; $('#fb', el).innerHTML = ''; draw(); };
  draw();
});
add('cad', 'Cadena: detecta el error', (el) => {
  const P = S.o2;
  el.innerHTML = `${head('Actividad central · Cadena “Del origen al uso”', 15, 'Nivel 2 · Detecta el error', 'Alguien armó esta cadena con el <strong>orden incorrecto</strong>. <strong>Arrastra una tarjeta sobre otra</strong> (o toca una y luego otra) para intercambiarlas hasta corregirla.')}
  <div class="panel" data-a style="display:grid;gap:1rem"><div class="cslots" id="swap"></div><div class="row"><button class="btn amber" id="chk">Comprobar corrección</button><button class="btn" id="rst">Volver al error</button></div><div id="fb" aria-live="polite"></div></div>`;
  const box = $('#swap', el);
  const flipDraw = (mutate) => { // la tarjeta se desliza hasta su nuevo lugar (FLIP)
    const before = new Map($$('.cswap', box).map((c) => [c.dataset.k, c.getBoundingClientRect()])); mutate(); draw();
    $$('.cswap', box).forEach((c) => { const b = before.get(c.dataset.k), a = c.getBoundingClientRect(); if (b && (b.left !== a.left || b.top !== a.top)) gsap.from(c, { x: b.left - a.left, y: b.top - a.top, duration: D(0.45), ease: 'power3.out' }); });
  };
  const swap = (i, j) => flipDraw(() => { const t = P.arr[i]; P.arr[i] = P.arr[j]; P.arr[j] = t; P.sel = null; P.checked = false; $('#fb', el).innerHTML = ''; beep('tap'); });
  const draw = () => {
    box.innerHTML = P.arr.map((k, i) => { const c = ['cswap']; if (P.sel === i) c.push('pick'); if (P.checked) c.push(k === i ? 'right' : 'wrong'); return `<div class="${c.join(' ')}" data-i="${i}" data-k="${k}" role="button" tabindex="0"><small>PASO ${i + 1}</small><b>${C.CH[k].n}</b><small>${C.CH[k].d}</small></div>`; }).join('');
    $$('.cswap', box).forEach((c) => {
      const i = +c.dataset.i;
      draggable(c, { onMove: (x, y) => $$('.cswap', box).forEach((s) => s.classList.toggle('hot', s !== c && s === under(x, y, '.cswap'))), onDrop: (x, y) => { const t = under(x, y, '.cswap'); if (!t || t === c) return false; swap(i, +t.dataset.i); return true; } });
      c.addEventListener('tap', () => { if (P.sel === null) { P.sel = i; P.checked = false; draw(); } else if (P.sel === i) { P.sel = null; draw(); } else swap(P.sel, i); });
    });
  };
  $('#chk', el).onclick = () => {
    P.checked = true; const ok = P.arr.every((k, i) => k === i); draw();
    $('#fb', el).innerHTML = ok ? fbox('ok', 'Error corregido', 'El transporte no puede ocurrir antes de la generación: todavía no habría electricidad que llevar.') : fbox('no', 'Todavía hay un error', 'Mira las tarjetas en rojo. ¿Qué debe ocurrir primero: llevar la electricidad o producirla?');
    gsap.from($('#fb', el).firstChild, { y: mv(12), autoAlpha: 0, duration: D(0.3) });
    if (ok) { beep('win'); confetti(); pulse($$('.cswap', box)); } else { beep('no'); shake(box); }
  };
  $('#rst', el).onclick = () => { P.arr = [0, 2, 1, 3, 4]; P.sel = null; P.checked = false; $('#fb', el).innerHTML = ''; draw(); };
  draw();
});

/* ===== MI SALA ===== */
add('sala', 'La luz de nuestra sala', (el) => {
  const M = S.map, Q = C.MAP.map((m, i) => ({ q: `Etapa ${m.l}: ¿qué ocurre con la electricidad de la ampolleta de la sala?`, o: m.o, a: m.a, w: C.FLOW[i].w }));
  el.innerHTML = `${head('Actividad central · Relacionamos con un dispositivo', 15, 'La luz de nuestra sala: ¿qué recorrido hizo la electricidad?', 'Elige en cada etapa la <strong>descripción correcta</strong>. Cada acierto <strong>enciende un tramo</strong>; si logras las cinco, ¡se enciende la luz!')}
  <div class="grid2 wide-r"><div class="panel" id="mq" data-a></div><div class="panel" data-a style="display:flex;gap:1.2rem;align-items:center;justify-content:space-around"><div class="rail" id="rail"></div><svg class="lamp" id="lamp" viewBox="0 0 100 120" aria-label="Ampolleta"><g class="rays"><path d="M50 4V14M14 22l7 7M86 22l-7 7M4 58h10M86 58h10"/></g><path class="glass" d="M50 22a24 24 0 0 0-14 43c3 3 4 6 4 10h20c0-4 1-7 4-10A24 24 0 0 0 50 22z"/><path d="M40 86h20M42 94h16M45 102h10" stroke="#9DACBF" stroke-width="4" stroke-linecap="round" fill="none"/></svg></div></div>`;
  const rail = () => {
    $('#rail', el).innerHTML = C.FLOW.map((f, i) => { const a = M.a[i], c = a === undefined ? (M.i === i ? 'cur' : '') : (a === Q[i].a ? 'ok' : 'bad'); return `<div class="rn ${c}"><div class="c">${fi(f.ic, '')}</div><span>${f.n}</span></div>`; }).join('');
    const all = Q.every((q, i) => M.a[i] === q.a); $('#lamp', el).classList.toggle('on', all);
    return all;
  };
  rail();
  mcq($('#mq', el), Q, M, { onAnswer: () => { if (rail()) { confetti(); beep('win'); toast('¡Recorrido completo: se encendió la luz!'); const l = $('#lamp', el); gsap.fromTo(l, { scale: 1 }, { scale: 1.12, duration: D(0.25), yoyo: true, repeat: 3 }); } } });
  const mqEl = $('#mq', el); new MutationObserver(rail).observe(mqEl, { childList: true }); // refleja también la pregunta actual
});
add('sala', 'Mi explicación', (el) => {
  const T = [['fuente', /fuente/], ['generación', /genera|central/], ['transporte', /transport|torres|lineas/], ['distribución', /distribu|postes/]];
  el.innerHTML = `${head('Actividad central · Mi explicación', 15, 'Explica el recorrido con tus palabras', 'Continúa la frase en 4 líneas y usa estas palabras: <strong>se iluminan</strong> cuando las incluyes.')}
  <div class="grid2"><div class="panel" data-a style="display:grid;gap:.8rem"><div class="chips" id="chips"></div><textarea id="expl" aria-label="Mi explicación sobre el origen de la electricidad" style="min-height:9rem"></textarea><div class="prog"><i id="eb"></i></div></div>
  <div style="display:grid;gap:.8rem;align-content:start" data-a><div class="fb info"><b>Para escribir mejor</b>Empieza por la fuente y avanza paso a paso hasta la sala. Usa palabras como “primero”, “luego” y “por último”.</div><button class="btn" id="ex">${ic('eye')} Ver una explicación modelo</button><div class="fb ok" id="exb" hidden><b>Explicación modelo</b>La electricidad que usamos no aparece en el enchufe; antes se genera en una central a partir de una fuente de energía, luego se transporta por líneas y torres y se distribuye por postes y cables hasta la sala.</div></div></div>`;
  const ta = $('#expl', el); ta.value = S.expl; let all = false;
  const chips = () => { const n = norm(ta.value), hit = T.filter((t) => t[1].test(n)).length; $('#chips', el).innerHTML = T.map((t) => `<span class="pill ${t[1].test(n) ? 'on' : ''}" style="${t[1].test(n) ? 'border-color:var(--safe);color:var(--safe)' : ''}">${t[1].test(n) ? '✓ ' : ''}${t[0]}</span>`).join(''); gsap.to($('#eb', el), { scaleX: hit / T.length, duration: D(0.4) }); if (hit === T.length && !all) { all = true; confetti(); beep('win'); toast('¡Usaste las cuatro palabras clave!'); } if (hit < T.length) all = false; };
  chips(); ta.oninput = () => { S.expl = ta.value; chips(); };
  $('#ex', el).onclick = () => { const b = $('#exb', el); b.hidden = false; enter(b); $('#ex', el).hidden = true; };
});

/* ===== USO RESPONSABLE ===== */
add('uso', 'Lo que usamos hoy tuvo que generarse', (el, api) => {
  const NEED = 20, MAX = 32;
  el.innerHTML = `${head('Aplicación · Generación y uso responsable', 10, 'Lo que usamos hoy tuvo que generarse antes', 'Toca los equipos para encenderlos o apagarlos. Es un <strong>modelo simplificado</strong>, no son medidas reales: sirve para pensar.')}
  <div class="grid2 wide-r"><div class="panel" data-a style="display:grid;gap:.8rem"><div class="row" style="justify-content:space-between"><b>Equipos encendidos sin necesidad: <span id="rv">0</span></b><span class="row"><button class="btn sm" id="off">Apagar los innecesarios</button><button class="btn sm" id="on">Encender todos</button></span></div><div class="devs" id="devs"></div></div>
  <div class="panel demand" data-a style="display:grid;gap:.8rem;align-content:start"><div class="row" style="justify-content:center"><svg viewBox="0 0 120 120" style="width:7.5rem" aria-label="Turbina de la central: gira más rápido cuando se necesita generar más"><circle cx="60" cy="60" r="52" fill="#1A2536" stroke="#3A4a60" stroke-width="3"/><g transform="translate(60 60)"><g id="tb"><path fill="#5B9DFF" d="M0 0C12-16 10-40 0-47-10-40-12-16 0 0z"/><path fill="#5B9DFF" transform="rotate(120)" d="M0 0C12-16 10-40 0-47-10-40-12-16 0 0z"/><path fill="#5B9DFF" transform="rotate(240)" d="M0 0C12-16 10-40 0-47-10-40-12-16 0 0z"/></g><circle r="6" fill="#FFC53D"/></g></svg></div>
  <p class="muted" style="text-align:center;margin-top:-.4rem">La central tiene que generar…</p>
  <div class="dbar" role="img" aria-label="Barra de electricidad que hay que generar" style="position:relative"><i class="need" id="dn" style="position:absolute;inset:0"></i><i class="waste" id="dw" style="position:absolute;inset:0"></i></div>
  <div class="legend"><span><i style="background:var(--blue)"></i>Electricidad necesaria</span><span><i style="background:var(--amber)"></i>Usada sin necesidad</span></div><p id="dtext" aria-live="polite" class="muted"></p></div></div>`;
  const dv = $('#devs', el); dv.innerHTML = Array.from({ length: 12 }, (_, i) => { const [n, k] = C.TILES[i % 4]; return `<button class="dev" data-i="${i}" aria-pressed="false"><svg viewBox="0 0 48 48" aria-hidden="true">${C.TILE_ICONS[k]}</svg><small>${n}</small></button>`; }).join('');
  let spin = null; if (!reduced()) spin = gsap.to($('#tb', el), { rotation: 360, svgOrigin: '0 0', duration: 3, repeat: -1, ease: 'none' });
  gsap.set($('#dn', el), { scaleX: NEED / MAX, transformOrigin: '0 50%' }); gsap.set($('#dw', el), { transformOrigin: '0 50%', xPercent: (NEED / MAX) * 100, scaleX: 0 });
  const up = (snd) => {
    const n = S.devs.size; $$('.dev', el).forEach((d) => { const on = S.devs.has(+d.dataset.i); d.classList.toggle('on', on); d.setAttribute('aria-pressed', on); }); $('#rv', el).textContent = n;
    gsap.to($('#dw', el), { scaleX: n / MAX, duration: D(0.4), ease: 'power2.out' }); spin?.timeScale(0.5 + ((NEED + n) / MAX) * 2.2);
    $('#dtext', el).textContent = n === 0 ? 'Solo se usa la electricidad necesaria: hace falta generar lo mínimo para las actividades.' : `Hay ${n} equipo${n > 1 ? 's' : ''} encendido${n > 1 ? 's' : ''} sin necesidad: esa electricidad se suma, y para abastecerla hay que generar más.`;
    if (snd) beep('tick');
  };
  $$('.dev', el).forEach((d) => (d.onclick = () => { const i = +d.dataset.i; S.devs.has(i) ? S.devs.delete(i) : S.devs.add(i); pop(d, 1.08); up(true); }));
  $('#off', el).onclick = () => { [...S.devs].forEach((i, k) => api.later(() => { S.devs.delete(i); up(true); }, k * 140)); if (!S.devs.size) toast('¡Ya están todos apagados!'); };
  $('#on', el).onclick = () => { for (let i = 0; i < 12; i++) S.devs.add(i); up(true); };
  up(false); api.cleanup(() => spin?.kill());
});
add('uso', 'Decisión segura', (el) => {
  el.innerHTML = `${head('Aplicación · Decisiones', 10, '¿Qué decisión ayuda a necesitar menos electricidad… y es segura?', 'Arrastra cada decisión a su cajón. Recuerda: en la sala nunca se manipulan enchufes ni cables.')}<div id="gU" data-a style="max-width:62rem;width:100%"></div>`;
  sortGame($('#gU', el), { items: C.SORTU, cats: C.CATU, store: S.su || (S.su = {}), tint: ['good', 'c1', 'bad'] });
});

/* ===== EVALUACIÓN ===== */
add('eval', 'Evaluación formativa', evalQuiz({ QS: C.QS, store: S.ev, msg: (ok, N) => (ok === N ? '¡Excelente! Puedes explicar el recorrido completo de la electricidad.' : ok >= 4 ? 'Muy bien. Revisa las explicaciones de las preguntas incorrectas para fortalecer la idea.' : 'Buen comienzo. Repasa la cadena: fuente, generación, transporte, distribución y usuario.') }));

/* ===== CIERRE ===== */
add('cierre', 'Volvemos a la hipótesis', (el, api) => {
  el.innerHTML = `${head('Puesta en común y cierre', 8, 'Volvemos a nuestra hipótesis inicial', 'Al comienzo nos preguntamos de dónde viene la electricidad. Ahora <strong>corrige o confirma</strong> lo que pensaste.')}
  <div class="grid2"><div class="panel" data-a style="display:grid;gap:.8rem"><h3>Mi hipótesis inicial</h3><p class="qtext" id="hb"></p><p><b>Después de la clase, mi hipótesis…</b></p><div class="chips" id="rv"></div><div id="rvFb" aria-live="polite"></div></div>
  <div class="panel" data-a style="display:grid;gap:1rem;align-content:start"><h3>Repaso rápido del recorrido</h3><div class="recap" id="recap">${C.FLOW.map((f, i) => `${i ? '<span class="ar">→</span>' : ''}<div class="rc">${fi(f.ic, '')}<small>${f.n}</small></div>`).join('')}</div><button class="btn" id="rp">${ic('play')} Repasar otra vez</button></div></div>`;
  $('#hb', el).textContent = S.hyp === null ? 'No elegiste una hipótesis al inicio. Escribe en tu cuaderno qué pensabas y compárala con lo aprendido.' : '“' + C.HYP[S.hyp].t + '”';
  const draw = () => {
    $('#rv', el).innerHTML = C.REVS.map((r, i) => `<button class="chip" data-i="${i}" aria-pressed="${S.rev === i}">${r}${S.rv[i] ? `<span class="tally" style="margin-left:.5rem">${S.rv[i]}</span>` : ''}</button>`).join('');
    $$('#rv .chip', el).forEach((b) => (b.onclick = () => { const i = +b.dataset.i; S.rev = i; S.rv[i] = (S.rv[i] || 0) + 1; beep('tap'); draw(); }));
    $('#rvFb', el).innerHTML = S.rev === null ? '' : fbox('info', 'Idea para quedarte', `La electricidad se genera en una central a partir de una fuente de energía, viaja por transporte y distribución, y recién llega al enchufe.${S.hyp !== null ? '<br><span class="muted">' + C.HYP[S.hyp].w + '</span>' : ''}`);
  };
  draw();
  const rc = $$('.rc', el), run = () => { const tl = gsap.timeline({ delay: 0.5 }); rc.forEach((r) => r.classList.remove('on')); rc.forEach((r, k) => tl.call(() => { r.classList.add('on'); beep('tick'); }, null, k * 0.55)); api.cleanup(() => tl.kill()); };
  $('#rp', el).onclick = run; run();
});
add('cierre', 'Lo que ya puedo hacer', (el) => {
  const sel = (id, arr) => `<select id="${id}"><option value="">elige…</option>${arr.map((a, i) => `<option value="${i}">${a}</option>`).join('')}</select>`;
  el.innerHTML = `${head('Cierre · Autoevaluación y ticket de salida', 8, 'Lo que ya puedo hacer', '')}
  <div class="grid2"><div class="panel" data-a><h3>Marca lo que ya logras</h3><div class="check" id="can"></div></div>
  <div class="ticket" data-a><h3>Ticket de salida</h3><label>Antes de llegar a nuestra sala, la electricidad debe ${sel('tk1', C.TK1)}, y yo puedo ayudar ${sel('tk2', C.TK2)}</label><button class="btn amber" id="tkSave" style="align-self:flex-start">Guardar mi ticket</button><p id="tkfb" aria-live="polite"></p></div></div>
  <div class="next" data-a>${ic('calendar')}<div><b>Próxima clase 22: “Elegir y usar mejor: decisiones de consumo responsable”</b><p class="muted">Aprenderemos a comparar decisiones de uso sin necesitar calcular cuentas eléctricas.</p></div></div>`;
  checklist($('#can', el), C.CAN, S.can);
  $('#tk1', el).value = S.tk[0]; $('#tk2', el).value = S.tk[1];
  $('#tkSave', el).onclick = () => {
    const a = $('#tk1', el).value, b = $('#tk2', el).value; if (a === '' || b === '') { toast('Completa las dos partes del ticket'); return; }
    S.tk = [a, b]; const ok = a === '0' && b === '0', f = $('#tkfb', el);
    f.style.color = ok ? 'var(--safe)' : 'var(--amber)';
    f.textContent = ok ? 'Ticket guardado y correcto. En la clase 22 compararemos decisiones de consumo responsable.' : 'Ticket guardado, pero revísalo: la electricidad se genera antes y viaja hasta la sala, y la seguridad va primero al ayudar.';
    if (ok) { confetti(); beep('win'); } else beep('no');
  };
});

startDeck({ stages: STAGES, scenes: SCENES, brand: 'Ciencias 5° · <b>Clase 21</b>', metaText: C.META });
