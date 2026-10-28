// Motor de presentación: escenas con construcción por partes, transiciones, gestos táctiles y herramientas de aula.
import { gsap, $, $$, ic, enter, splitReveal, mv, D, reduced, beep, sound, toast, pop } from './kit.js';
import './theme.css';

const ICONS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></symbol>
<symbol id="i-left" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></symbol><symbol id="i-right" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></symbol>
<symbol id="i-pen" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol><symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></symbol>
<symbol id="i-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></symbol>
<symbol id="i-dice" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></symbol>
<symbol id="i-vol" viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></symbol>
<symbol id="i-mute" viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/></symbol>
<symbol id="i-full" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></symbol>
<symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="i-flag" viewBox="0 0 24 24"><path d="M4 22V4M4 4h13l-2 4 2 4H4"/></symbol></svg>`;

export function startDeck({ root = $('#app'), stages, scenes, brand, metaText }) {
  root.innerHTML = `${ICONS}<div class="ambient" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="app"><header class="top"><div class="brand"><div class="bolt">${ic('bolt')}</div><span>${brand}</span></div>
  <nav class="stages" id="stages" aria-label="Etapas de la clase"></nav>
  <div class="tools"><button class="tool" id="tTurn" aria-label="Elegir turno al azar">${ic('dice')}<span class="lbl">Turno</span></button>
  <button class="tool" id="tTimer" aria-label="Temporizador">${ic('timer')}<span class="t-time">—</span></button>
  <button class="tool" id="tPen" aria-pressed="false" aria-label="Dibujar sobre la pantalla">${ic('pen')}</button>
  <button class="tool" id="tSnd" aria-label="Sonido">${ic('vol')}</button><button class="tool" id="tFull" aria-label="Pantalla completa">${ic('full')}</button>
  <button class="tool meta" id="tMeta">${ic('flag')}<span class="lbl">Meta</span></button></div></header>
  <div class="progress" aria-hidden="true"><i id="bar"></i></div><main id="main"></main>
  <footer class="bottom"><button class="nav-btn" id="prev">${ic('left')}Anterior</button><div class="dots" id="dots" role="tablist"></div><span class="count" id="count"></span>
  <button class="nav-btn primary" id="next"><span id="nextL">Siguiente</span>${ic('right')}</button></footer></div>
  <canvas id="ink" aria-hidden="true"></canvas><div class="palette" id="pal" hidden></div>`;

  const main = $('#main');
  let cur = -1, groups = [], shown = 0, cleanups = [];
  const seen = new Set(), seenStage = new Set();
  const stageIdx = (s) => stages.findIndex((x) => x.id === s);

  /* etapas + puntos */
  const stEl = $('#stages');
  stages.forEach((s, i) => { const b = document.createElement('button'); b.className = 'stage'; b.textContent = s.name; b.onclick = () => go(scenes.findIndex((x) => x.stage === s.id)); stEl.appendChild(b); });
  const dots = $('#dots');
  scenes.forEach((sc, i) => {
    if (i && sc.stage !== scenes[i - 1].stage) { const g = document.createElement('span'); g.className = 'gap'; dots.appendChild(g); }
    const d = document.createElement('button'); d.setAttribute('aria-label', `Diapositiva ${i + 1}: ${sc.title}`); d.onclick = () => go(i); dots.appendChild(d);
  });
  const dotEls = $$('button', dots);

  /* ---------- escenas ---------- */
  function go(i, force) {
    if (i < 0 || i >= scenes.length || (i === cur && !force)) return;
    const dir = i >= cur ? 1 : -1, first = cur < 0, old = main.firstElementChild, oldClean = cleanups;
    cur = i; cleanups = [];
    $$('.scene', main).slice(0, -1).forEach((n) => n.remove());
    $('#ink').getContext('2d').clearRect(0, 0, 9999, 9999);
    const el = document.createElement('section'); el.className = 'scene'; el.setAttribute('aria-label', scenes[i].title);
    main.appendChild(el);
    const api = { cleanup: (f) => cleanups.push(f), later: (f, ms) => { const t = setTimeout(f, ms); cleanups.push(() => clearTimeout(t)); }, go, next, el };
    scenes[i].build(el, api);
    el.scrollTop = 0;
    /* títulos con máscara + elementos [data-a] entran escalonados; [data-build] esperan al toque */
    splitReveal($('h1,h2', el), first ? 0.1 : 0.25);
    const auto = $$('[data-a]', el).filter((n) => !n.closest('[data-build]'));
    enter(auto, { delay: first ? 0.15 : 0.3 });
    const bl = $$('[data-build]', el), keys = [...new Set(bl.map((n) => n.dataset.build))];
    groups = keys.map((k) => bl.filter((n) => n.dataset.build === k));
    shown = dir < 0 || seen.has(i) ? groups.length : 0;
    groups.forEach((g, gi) => gsap.set(g, gi < shown ? { autoAlpha: 1 } : { autoAlpha: 0, y: mv(28) }));
    seen.add(i); seenStage.add(scenes[i].stage);
    /* transición dirigida (page-transition-animation): sale hacia el lado contrario, entra con solape */
    if (old) {
      gsap.to(old, { autoAlpha: 0, x: mv(-60 * dir), duration: D(0.3), ease: 'power2.in', onComplete: () => { oldClean.forEach((f) => f()); gsap.killTweensOf($$('*', old)); old.remove(); } });
      gsap.fromTo(el, { autoAlpha: 0, x: mv(80 * dir) }, { autoAlpha: 1, x: 0, duration: D(0.45), ease: 'power3.out', delay: 0.12, clearProps: 'transform' });
    }
    scenes[i].enter?.(el, api);
    ui();
    history.replaceState(null, '', '#' + (i + 1));
  }
  function ui() {
    const sc = scenes[cur], si = stageIdx(sc.stage);
    $$('.stage', stEl).forEach((b, i) => { b.classList.toggle('on', i === si); b.classList.toggle('done', i !== si && seenStage.has(stages[i].id)); });
    const on = $$('.stage', stEl)[si]; stEl.scrollTo({ left: on.offsetLeft - stEl.clientWidth / 2 + on.offsetWidth / 2, behavior: reduced() ? 'auto' : 'smooth' });
    dotEls.forEach((d, i) => { d.classList.toggle('on', i === cur); d.classList.toggle('seen', i !== cur && seen.has(i)); d.setAttribute('aria-selected', i === cur); });
    gsap.to('#bar', { scaleX: (cur + 1) / scenes.length, duration: D(0.4), ease: 'power2.out' });
    $('#count').textContent = `${cur + 1} / ${scenes.length}`;
    $('#prev').disabled = cur === 0 && shown === 0;
    const more = shown < groups.length;
    $('#next').disabled = cur === scenes.length - 1 && !more;
    $('#nextL').textContent = more ? `Mostrar (${groups.length - shown})` : 'Siguiente';
  }
  function reveal(gi) {
    const g = groups[gi]; if (!g) return;
    g.forEach((n) => n.dispatchEvent(new CustomEvent('reveal')));
    gsap.to(g, { autoAlpha: 1, y: 0, duration: D(0.55), ease: 'power3.out', stagger: reduced() ? 0 : 0.08, overwrite: 'auto' });
    g[0].scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' }); beep('tap');
  }
  function next() { if (shown < groups.length) { reveal(shown++); ui(); } else go(cur + 1); }
  function prev() { if (shown > 0 && groups.length) { shown--; gsap.to(groups[shown], { autoAlpha: 0, y: mv(28), duration: D(0.25), overwrite: 'auto' }); ui(); } else go(cur - 1); }
  $('#next').onclick = next; $('#prev').onclick = prev;
  addEventListener('keydown', (e) => {
    if (e.target.matches('input,select,textarea') || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') closeOv();
    if (['ArrowRight', 'PageDown', ' '].includes(e.key) && !e.target.closest('button,[role=button]')) { e.preventDefault(); next(); }
    if (['ArrowLeft', 'PageUp'].includes(e.key)) prev();
  });
  /* deslizar para navegar (solo dedo; las zonas arrastrables lo evitan) */
  let sx, sy, sId;
  main.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch' && !e.target.closest('.sg-card,.drag,.drag-col,textarea,select,input,.pcard')) { sx = e.clientX; sy = e.clientY; sId = e.pointerId; } else sx = null; });
  main.addEventListener('pointerup', (e) => { if (sx == null || e.pointerId !== sId) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy) * 2) dx < 0 ? next() : prev(); });
  addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10) - 1; if (n >= 0 && n !== cur) go(n); });

  /* ---------- overlays (meta, turno) ---------- */
  let ov = null;
  function openOv(html, cls = '') {
    closeOv(); ov = document.createElement('div'); ov.className = 'overlay ' + cls; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="row"><button class="btn" id="ovx">${ic('x')}Cerrar</button></div>${html}`; document.body.appendChild(ov);
    $('#ovx', ov).onclick = closeOv; $('#ovx', ov).focus(); gsap.from(ov, { autoAlpha: 0, duration: D(0.25) }); enter($$('h2,.big,.row ~ *', ov), { delay: 0.1 });
    return ov;
  }
  function closeOv() { if (ov) { ov.remove(); ov = null; } }
  $('#tMeta').onclick = () => openOv(`<h2>Meta de la clase · anótala</h2><p class="big">${metaText}</p>`);

  /* turno al azar: ruleta numérica con deceleración */
  const tn = { mode: 'n', n: 30 };
  $('#tTurn').onclick = () => {
    const o = openOv(`<h2>¿Quién participa?</h2><div class="slot" id="slot" aria-live="polite">?</div><p class="muted" id="slotL"></p>
    <div class="row" style="justify-content:center"><div class="view-toggle"><button id="mN" aria-pressed="${tn.mode === 'n'}">N.º de lista</button><button id="mG" aria-pressed="${tn.mode === 'g'}">Grupo</button></div>
    <div class="stp"><button id="nm" aria-label="Menos">−</button><output id="nv">${tn.n}</output><button id="np" aria-label="Más">+</button></div>
    <button class="btn amber" id="spin">${ic('dice')} ¡Girar!</button></div>`, 'turn');
    const upd = () => { $('#nv', o).textContent = tn.n; $('#mN', o).setAttribute('aria-pressed', tn.mode === 'n'); $('#mG', o).setAttribute('aria-pressed', tn.mode === 'g'); };
    $('#mN', o).onclick = () => { tn.mode = 'n'; tn.n = 30; upd(); }; $('#mG', o).onclick = () => { tn.mode = 'g'; tn.n = 6; upd(); };
    $('#nm', o).onclick = () => { tn.n = Math.max(2, tn.n - 1); upd(); }; $('#np', o).onclick = () => { tn.n = Math.min(60, tn.n + 1); upd(); };
    $('#spin', o).onclick = () => {
      const slot = $('#slot', o), win = 1 + Math.floor(Math.random() * tn.n), o2 = { t: 0 };
      $('#slotL', o).textContent = ''; let last = 0;
      gsap.to(o2, { t: 1, duration: reduced() ? 0.05 : 2.2, ease: 'power3.out', onUpdate: () => { const k = Math.floor(o2.t * 24); if (k !== last) { last = k; slot.textContent = o2.t > 0.97 ? win : 1 + Math.floor(Math.random() * tn.n); beep('tick'); } },
        onComplete: () => { slot.textContent = win; $('#slotL', o).textContent = tn.mode === 'n' ? `N.º de lista ${win}, ¡pasa al tablero!` : `Grupo ${win}, ¡les toca!`; pop(slot, 1.15); beep('win'); } });
    };
  };

  /* temporizador: toca un chip de tiempo para iniciar; toca de nuevo para pausar/reiniciar */
  let tmr = null, left = 0, run = false;
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  function startTimer(min) {
    clearInterval(tmr); left = Math.round(min * 60); run = true; paint();
    tmr = setInterval(() => { if (!run) return; left--; paint(); if (left <= 0) { clearInterval(tmr); run = false; $('#tTimer').classList.add('ring'); beep('win'); setTimeout(() => $('#tTimer').classList.remove('ring'), 3200); } }, 1000);
  }
  function paint() { const b = $('#tTimer'); $('.t-time', b).textContent = left > 0 || run ? fmt(Math.max(0, left)) : '—'; b.classList.toggle('run', run); }
  $('#tTimer').onclick = () => { if (!left) { startTimer(5); toast('Temporizador: 5 min · toca de nuevo para pausar'); return; } if (run) { run = false; paint(); toast('Pausado · toca para reiniciar'); } else { left = 0; clearInterval(tmr); paint(); } };
  main.addEventListener('click', (e) => { const t = e.target.closest('.time[data-min]'); if (t) { startTimer(+t.dataset.min); toast(`Temporizador: ${t.dataset.min} min`); } });

  /* lápiz: dibujar encima de la lámina */
  const cv = $('#ink'), pal = $('#pal'), ctx = cv.getContext('2d'); let inkCol = '#FFC53D';
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; }; fit(); addEventListener('resize', fit);
  pal.innerHTML = ['#FFC53D', '#FF4FD8', '#34D399', '#FFFFFF'].map((c) => `<button class="sw-c" style="background:${c}" data-c="${c}" aria-pressed="${c === inkCol}" aria-label="Color ${c}"></button>`).join('') + `<button class="btn sm" id="clr">Borrar</button>`;
  $$('.sw-c', pal).forEach((b) => (b.onclick = () => { inkCol = b.dataset.c; $$('.sw-c', pal).forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
  $('#clr').onclick = () => ctx.clearRect(0, 0, cv.width, cv.height);
  $('#tPen').onclick = () => { const on = !cv.classList.contains('on'); cv.classList.toggle('on', on); pal.hidden = !on; $('#tPen').setAttribute('aria-pressed', on); };
  let drawing = false;
  cv.addEventListener('pointerdown', (e) => { drawing = true; cv.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(e.clientX, e.clientY); });
  cv.addEventListener('pointermove', (e) => { if (!drawing) return; ctx.strokeStyle = inkCol; ctx.lineWidth = 5; ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineTo(e.clientX, e.clientY); ctx.stroke(); });
  cv.addEventListener('pointerup', () => (drawing = false));

  $('#tSnd').onclick = () => { const m = sound.toggle(); $('#tSnd').innerHTML = ic(m ? 'mute' : 'vol'); if (!m) beep('ok'); };
  $('#tFull').onclick = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());

  const start = Math.max(0, Math.min(scenes.length - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  (document.fonts?.ready || Promise.resolve()).then(() => go(start, true));
  return { go, next, prev };
}
