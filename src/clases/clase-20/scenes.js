// Clase 20 · De la tabla al gráfico — escenas interactivas (misma estructura que la versión original).
import { gsap, $, $$, ic, enter, pop, shake, confetti, toast, beep, mv, D, countUp, chart, sortGame, poll, draggable, under } from '../../shared/kit.js';
import * as C from './content.js';
import { head, fbox, mcq, ruta, vocabCards, vocabGame, evalQuiz, checklist } from '../../shared/blocks.js';
import erosImg from '../../../assets/eros.webp';

const META = 'Organizar datos de la auditoría energética en tablas y gráficos simples, interpretar tendencias y formular conclusiones prudentes.';
const STAGES = [['meta', 'Meta'], ['ruta', 'Ruta'], ['ini', 'Inicio'], ['mod', 'Modelamiento'], ['lab', 'Laboratorio'], ['int', 'Interpretar'], ['mis', 'Misión'], ['eval', 'Evaluación'], ['cierre', 'Cierre']].map(([id, name]) => ({ id, name }));
/* estado que sobrevive al ir y volver entre diapositivas */
const S = { pred: {}, camp: {}, view: 'L', times: {}, vcards: new Set(), vgame: {}, ini: { i: 0, a: {} }, part: null, tour: false, place: new Set(),
  s1: {}, s2: {}, s3: {}, lab: { t: null, y: null, s: null, v: {}, msg: '' }, link: { done: new Set() }, rec: { d: null, m: null, b: null, txt: '' }, ev: { i: 0, ans: {}, done: false }, can: new Set(), tk: ['', ''] };

const SCENES = [];
const add = (stage, title, build, enterFn) => SCENES.push({ stage, title, build, enter: enterFn });

/* ===== META ===== */
add('meta', 'Portada y meta', (el) => {
  el.innerHTML = `<div class="eyebrow" data-a><span>Clase 20 · OA 11</span><button class="time" data-min="90" aria-label="Temporizador de 90 minutos">90 min</button></div>
  <div class="cover"><div class="eros" data-a><div class="deco" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><img alt="El profe Eros señalando la meta de la clase" src="${erosImg}"></div>
  <div class="cover-text"><h1>De la tabla al gráfico: <em>¿qué nos dicen nuestros datos?</em></h1>
  <div class="meta-box" data-build="1"><div class="meta-label"><span>Meta de la clase</span><small>${ic('pen')}Anótala en tu cuaderno</small></div><p class="meta-text">${META}</p></div>
  <div class="agree" data-build="2"><b>Habilidades de hoy:</b> medir y registrar datos, compararlos en tablas y gráficos (OAH d) y formular explicaciones y conclusiones razonables (OAH f). <b>Regla de oro:</b> una conclusión no puede decir más de lo que muestran los datos.</div></div></div>`;
  $('.meta-box', el).addEventListener('reveal', () => { beep('ok'); gsap.fromTo($('.meta-box', el), { boxShadow: '0 0 0 0 rgba(255,79,216,.5)' }, { boxShadow: '0 0 0 18px rgba(255,79,216,0)', duration: D(1.2), repeat: 2 }); });
});

/* ===== RUTA ===== */
add('ruta', 'Ruta de la clase', ruta({ eb: 'Ruta de la clase', h2: 'Cinco pasos para que los datos hablen', lead: 'Tocas una estación para destacarla. Al final de la clase habremos recorrido todo el camino.', items: C.ROUTE }));
add('ruta', 'Vocabulario clave', vocabCards({ eb: 'Ruta de la clase · Vocabulario', VOCAB: C.VOCAB, store: S.vcards }));
add('ruta', 'Juego: ¿qué palabra es?', vocabGame({ eb: 'Ruta de la clase · Juego rápido', VOCAB: C.VOCAB, store: S.vgame }));

/* ===== INICIO ===== */
add('ini', 'Predice antes de ver', (el) => {
  const names = C.DATA.map((d) => d[0]);
  el.innerHTML = `${head('Inicio · “¿Qué gráfico cuenta mejor la historia?”', 15, 'Antes de ver los datos: ¡haz tu predicción!', 'En la auditoría anotamos <strong>equipos encendidos sin uso</strong>. ¿Cuál tipo crees que aparecerá más veces? Cada estudiante toca su apuesta: <strong>un toque = un voto</strong>.')}
  <div class="grid2"><div data-a><div id="poll"></div><p class="muted" id="ptot" style="margin-top:.6rem"></p></div>
  <div class="stack"><div class="ph-chart" id="phc" data-a>Aquí aparecerá el gráfico…<br>¿Acertará la clase?</div><div class="chartbox" id="pch" data-build="1" style="align-self:start"></div></div></div>
  <div id="pmsg" data-build="1"></div>`;
  const win = () => names.map((_, i) => S.pred[i] || 0);
  poll($('#poll', el), { options: names, store: S.pred, icons: C.DEV_ICONS, onChange: (t) => ($('#ptot', el).textContent = t ? `Votos de la clase: ${t}` : 'Aún no hay votos: ¡toquen una tarjeta!') });
  $('#poll .poll', el).classList.add('c3');
  const ctl = chart($('#pch', el), C.DATA, { title: 'Equipos encendidos sin uso por tipo', ylab: 'Cantidad de equipos', xlab: 'Tipo de dispositivo', max: 8, hi: (d) => d[1] === 6 });
  $('#pch', el).addEventListener('reveal', () => {
    gsap.to($('#phc', el), { autoAlpha: 0, duration: D(0.3) }); ctl.intro(0.25);
    const v = win(), top = Math.max(...v), tot = v.reduce((a, b) => a + b, 0), who = names.filter((_, i) => v[i] === top);
    const ok = tot > 0 && who.includes('Luces');
    $('#pmsg', el).innerHTML = tot ? fbox(ok ? 'ok' : 'info', ok ? '¡La clase acertó!' : 'La clase apostó distinto', `La clase apostó por <b>${who.join(' y ')}</b> (${top} votos). Los datos dicen: <b>Luces, con 6</b>. ${ok ? '' : 'Pero ojo: una predicción no es un dato, ¡por eso medimos!'}`) : fbox('info', 'Sin apuestas', 'Los datos muestran que <b>Luces</b> tuvo la mayor frecuencia: 6.');
    gsap.from($('#pmsg', el).firstChild, { y: mv(14), autoAlpha: 0, duration: D(0.4) }); if (ok) { confetti(); beep('win'); }
  });
});

add('ini', 'Lista o gráfico', (el, api) => {
  const sw = { t0: 0, run: false, id: 0 };
  el.innerHTML = `${head('Inicio · Lista contra gráfico', 15, 'La misma información, dos maneras de mostrarla', 'Un estudiante busca el <strong>mayor y el menor</strong> mirando la <strong>lista</strong>; otro lo hace con el <strong>gráfico</strong>. Cronometramos y comparamos.')}
  <div class="grid2"><div style="display:grid;gap:.9rem;align-content:start" data-a>
  <div class="view-toggle" role="group" aria-label="Forma de mostrar los datos"><button id="vL">Lista</button><button id="vG">Gráfico de barras</button></div>
  <div class="panel stopw"><span class="t" id="swT">0.0 s</span><button class="btn amber" id="swB">${ic('timer')} Iniciar cronómetro</button></div>
  <div class="row"><span class="pill">Lista: <b id="tL">${S.times.L ?? '—'}</b></span><span class="pill">Gráfico: <b id="tG">${S.times.G ?? '—'}</b></span></div><div id="swfb"></div></div>
  <div id="iniView"></div></div>`;
  const msg = () => { if (S.times.L && S.times.G) { const f = +S.times.G < +S.times.L; $('#swfb', el).innerHTML = fbox(f ? 'ok' : 'info', f ? 'El gráfico fue más rápido' : 'Esta vez la lista ganó', f ? 'Las barras permiten comparar tamaños de un vistazo, sin leer cada número.' : 'Aun así, el gráfico muestra la comparación sin leer todos los números. Repitan con otra pareja.'); } };
  const draw = (anim) => {
    $('#vL', el).setAttribute('aria-pressed', S.view === 'L'); $('#vG', el).setAttribute('aria-pressed', S.view === 'G');
    const v = $('#iniView', el);
    if (S.view === 'L') { v.innerHTML = `<div class="panel"><div class="listdata">${C.DATA.map((d) => `<div>${d[0]}: ${d[1]} encendidos sin uso</div>`).join('')}</div></div>`; if (anim) enter($$('.listdata div', v), { stagger: 0.08 }); }
    else { v.innerHTML = `<div class="chartbox"></div>`; const c = chart($('.chartbox', v), C.DATA, { title: 'Equipos encendidos sin uso por tipo', ylab: 'Cantidad de equipos', xlab: 'Tipo de dispositivo', max: 8, hi: (d) => d[1] === 6 }); if (anim) c.intro(0.1); }
  };
  $('#vL', el).onclick = () => { S.view = 'L'; draw(true); }; $('#vG', el).onclick = () => { S.view = 'G'; draw(true); };
  $('#swB', el).onclick = () => {
    const b = $('#swB', el);
    if (!sw.run) { sw.run = true; sw.t0 = performance.now(); b.innerHTML = `${ic('check')} ¡Listo!`; sw.id = setInterval(() => ($('#swT', el).textContent = ((performance.now() - sw.t0) / 1000).toFixed(1) + ' s'), 100); beep('tap'); }
    else { sw.run = false; clearInterval(sw.id); const t = ((performance.now() - sw.t0) / 1000).toFixed(1); S.times[S.view] = t; $('#swT', el).textContent = t + ' s'; $(S.view === 'L' ? '#tL' : '#tG', el).textContent = t + ' s'; b.innerHTML = `${ic('timer')} Iniciar cronómetro`; beep('ok'); msg(); }
  };
  api.cleanup(() => clearInterval(sw.id)); draw(true); msg();
});

add('ini', 'Preguntas iniciales', (el) => {
  el.innerHTML = `${head('Inicio · Preguntas iniciales', 15, 'Leemos el gráfico juntos', '')}
  <div class="grid2"><div class="chartbox" id="qc" data-a></div><div class="panel" id="qm" data-a></div></div>`;
  const c = chart($('#qc', el), C.DATA, { title: 'Equipos encendidos sin uso por tipo de dispositivo', ylab: 'Cantidad de equipos', xlab: 'Tipo de dispositivo', max: 8, hi: (d) => d[1] === 6 });
  c.intro(0.4); mcq($('#qm', el), C.INI_Q, S.ini, { onDone: () => confetti() });
});

/* ===== MODELAMIENTO ===== */
add('mod', 'Anatomía de un gráfico', (el, api) => {
  el.innerHTML = `${head('Modelamiento', 15, 'Anatomía de un gráfico de barras', 'Toca cada parte, en el gráfico o en los botones, para ver <strong>qué función cumple</strong>.')}
  <div class="grid2"><div class="chartbox" id="anat" data-a></div><div style="display:grid;gap:.9rem;align-content:start" data-a><div class="chips" id="parts" role="group" aria-label="Partes del gráfico"></div><div class="fb info" id="partFb"></div><button class="btn" id="tour">${ic('eye')} Recorrido guiado</button></div></div>`;
  let ctl; const info = () => { const p = S.part && C.PARTS[S.part]; $('#partFb', el).innerHTML = p ? `<b>${p.n}</b>${p.w}` : '<b>Elige una parte</b>Aquí aparecerá su explicación.'; gsap.fromTo($('#partFb', el), { scale: 0.97 }, { scale: 1, duration: D(0.3), ease: 'back.out(2)' }); };
  const sel = (k) => { S.part = k; ctl.update({ part: k }); $$('#parts .chip', el).forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === k)); info(); beep('tap'); };
  ctl = chart($('#anat', el), C.SECT, { title: 'Equipos sin uso por sector (práctica)', ylab: 'Cantidad de equipos', xlab: 'Sector observado', max: 6, part: S.part, onPart: (p) => sel(p) });
  $('#parts', el).innerHTML = Object.keys(C.PARTS).map((k) => `<button class="chip" data-k="${k}" aria-pressed="${S.part === k}">${C.PARTS[k].n}</button>`).join('');
  $$('#parts .chip', el).forEach((b) => (b.onclick = () => sel(b.dataset.k)));
  $('#tour', el).onclick = () => { const ks = Object.keys(C.PARTS); ks.forEach((k, i) => api.later(() => sel(k), i * 2600)); };
  info(); ctl.intro(0.3);
});

add('mod', 'Juego: pon cada etiqueta', (el) => {
  const names = Object.keys(C.PARTS);
  el.innerHTML = `${head('Modelamiento · Juego', 15, '¡Pon cada etiqueta en su lugar!', '<strong>Arrastra</strong> cada etiqueta hasta la parte del gráfico que describe (o toca la etiqueta y luego la parte). Si te equivocas, ¡intenta de nuevo!')}
  <div class="grid2"><div class="chartbox" id="gz" data-a></div><div style="display:grid;gap:.9rem;align-content:start" data-a><div class="chips" id="pool"></div><div class="prog"><i id="gb"></i></div><div id="gfb"></div></div></div>`;
  const box = $('#gz', el), ctl = chart(box, C.SECT, { title: 'Equipos sin uso por sector (práctica)', ylab: 'Cantidad de equipos', xlab: 'Sector observado', max: 6 }); ctl.intro(0.3);
  const bar = () => gsap.to($('#gb', el), { scaleX: S.place.size / names.length, duration: D(0.4) });
  const partAt = (x, y) => under(x, y, '#gz .part');
  const place = (k, g) => {
    const r = g.getBoundingClientRect(), b = box.getBoundingClientRect(), badge = document.createElement('div'); badge.className = 'zone-badge'; badge.textContent = C.PARTS[k].n;
    const off = { eje_y: [-6, -60], escala: [14, 50] }[k] || [0, 0];
    badge.style.left = r.left + r.width / 2 - b.left + off[0] + 'px'; badge.style.top = r.top + r.height / 2 - b.top + off[1] + 'px'; box.appendChild(badge); gsap.from(badge, { scale: 0, duration: D(0.4), ease: 'back.out(2.5)' });
    S.place.add(k); bar(); beep('ok');
    if (S.place.size === names.length) { $('#gfb', el).innerHTML = fbox('ok', '¡Gráfico completo!', 'Ya sabes leer cada parte: título, ejes, escala y barras.'); confetti(); beep('win'); }
  };
  // badges ya colocados (al volver a la diapositiva)
  const chips = names.map((k) => { const c = document.createElement('div'); c.className = 'chip drag'; c.textContent = C.PARTS[k].n; c.dataset.k = k; c.tabIndex = 0; $('#pool', el).appendChild(c); return c; });
  let armed = null;
  const trySet = (c, g) => { if (!g) return false; if (g.dataset.part === c.dataset.k) { c.classList.add('placed'); gsap.set(c, { x: 0, y: 0, scale: 1, rotation: 0 }); place(c.dataset.k, g); return true; } shake(c); toast(`Esa parte no es “${C.PARTS[c.dataset.k].n}”. Mira su función y prueba otra.`); beep('no'); return false; };
  chips.forEach((c) => {
    draggable(c, { onMove: (x, y) => $$('.part', box).forEach((g) => g.classList.toggle('on', g === partAt(x, y))), onDrop: (x, y) => { $$('.part', box).forEach((g) => g.classList.remove('on')); return trySet(c, partAt(x, y)); } });
    c.addEventListener('tap', () => { armed = armed === c ? null : c; chips.forEach((x) => x.classList.toggle('sel', x === armed)); });
  });
  $$('.part', box).forEach((g) => g.addEventListener('click', () => { if (armed && !armed.classList.contains('placed')) { const a = armed; if (trySet(a, g)) { armed = null; a.classList.remove('sel'); } } }));
  bar();
});

add('mod', 'Descripción, interpretación o exageración', (el) => {
  el.innerHTML = `${head('Modelamiento · Tres tipos de frases', 15, 'Descripción, interpretación y exageración', 'Usa el gráfico: las barras muestran lo observado en <strong>un solo momento</strong> y en <strong>cuatro sectores</strong> de práctica. Arrastra cada frase a su cajón.')}
  <div class="grid2 wide-r"><div class="chartbox" id="c1" data-a></div><div id="g1" data-a></div></div>`;
  chart($('#c1', el), C.SECT, { title: 'Equipos sin uso por sector (práctica)', ylab: 'Cantidad de equipos', xlab: 'Sector observado', max: 6 }).intro(0.3);
  sortGame($('#g1', el), { items: C.SORT1, cats: C.CAT1, store: S.s1 });
});

/* ===== LABORATORIO ===== */
const LABD = (L) => C.DATA.map((d, i) => [d[0], L.v[i] ?? 0]);
const scaleOf = (L) => (L.s === 0 ? C.LS[0] : [0, 0, 0, 8, 2]);
const chartOpts = (L) => ({ title: L.t === 0 ? C.LT[0][0] : '', ylab: L.y === 0 ? 'Cantidad de equipos observados' : '', xlab: 'Tipo de dispositivo', min: scaleOf(L)[2], max: scaleOf(L)[3], step: scaleOf(L)[4] });
add('lab', 'Laboratorio: título, eje y escala', (el) => {
  const L = S.lab;
  el.innerHTML = `${head('Actividad central · Laboratorio de datos “Lo que vimos en la escuela”', 20, 'Construye tu gráfico de barras · paso 1', 'Parte desde la <strong>tabla</strong>: cada acierto en título, eje y escala <strong>completa el gráfico</strong>.')}
  <div class="grid2"><div class="tbl-wrap compact" data-a><table aria-label="Tabla de datos de práctica"><thead><tr><th>Tipo de dispositivo</th><th class="n">Encendidos sin uso</th></tr></thead><tbody>${C.DATA.map((d) => `<tr><td>${d[0]}</td><td class="n hot">${d[1]}</td></tr>`).join('')}</tbody></table></div><div class="chartbox short" id="lp" data-a></div></div>
  <div class="three" data-a>${[['t', '1 · Título del gráfico', C.LT], ['y', '2 · Eje vertical', C.LY], ['s', '3 · Escala', C.LS]].map(([k, h]) => `<div class="pick"><h3>${h}</h3><div class="opts" id="p${k}"></div><div id="f${k}"></div></div>`).join('')}</div>`;
  const ctl = chart($('#lp', el), LABD({ v: {} }), { ...chartOpts(L), values: C.DATA.map(() => 0) });
  const MSG = { t: 'El título debe decir <b>qué se midió</b> y cómo se agrupó. Elige uno más preciso.', y: 'El eje vertical cuenta <b>equipos observados</b>, no dinero ni tamaño.', s: 'La escala debe partir en <b>0</b> y avanzar con saltos regulares que permitan leer los valores.' };
  const opts = (k, arr) => {
    $('#p' + k, el).innerHTML = arr.map((a, i) => `<button class="opt ${L[k] === i ? 'right' : ''}" data-i="${i}" ${L[k] !== null ? 'disabled' : ''}><span class="k">${'ABC'[i]}</span>${a[0]}</button>`).join('');
    $$('#p' + k + ' .opt', el).forEach((b) => (b.onclick = () => {
      const i = +b.dataset.i;
      if (arr[i][1]) { L[k] = i; beep('ok'); $('#f' + k, el).innerHTML = ''; opts(k, arr); ctl.update(chartOpts(L)); ctl.set(C.DATA.map((_, j) => L.v[j] ?? 0), false); pop($('#lp', el), 1.02); if (L.t === 0 && L.y === 0 && L.s === 0) { confetti(); toast('¡Ejes y escala listos! Sigue con las barras →'); } }
      else { beep('no'); shake(b); b.classList.add('wrong'); $('#f' + k, el).innerHTML = fbox('no', 'Todavía no', MSG[k]); setTimeout(() => b.classList.remove('wrong'), 900); }
    }));
  };
  opts('t', C.LT); opts('y', C.LY); opts('s', C.LS);
  ctl.update(chartOpts(L)); ctl.set(C.DATA.map((_, j) => L.v[j] ?? 0), false); ctl.intro(0.2);
});

add('lab', 'Laboratorio: ajusta las barras', (el) => {
  const L = S.lab;
  el.innerHTML = `${head('Actividad central · Laboratorio de datos', 20, 'Construye tu gráfico de barras · paso 2', '<strong>Toca o arrastra</strong> sobre cada columna para fijar su altura según la tabla (también puedes usar − y +). Cuando creas que está listo, pulsa <strong>Comprobar</strong>.')}
  <div class="grid2"><div style="display:grid;gap:.8rem" data-a><div class="panel" id="steps"></div><div class="row"><button class="btn amber" id="chk">Comprobar mi gráfico</button><button class="btn" id="rst">Reiniciar barras</button></div><div id="labFb"></div></div>
  <div class="chartbox" id="lc" aria-live="polite" data-a></div></div>`;
  const vals = () => C.DATA.map((_, i) => L.v[i] ?? 0);
  const setV = (i, v) => { L.v[i] = v; ctl.set(vals(), true); const o = $(`#steps output[data-i="${i}"]`, el); if (o) o.textContent = v; };
  const ctl = chart($('#lc', el), LABD(L), { ...chartOpts(L), values: vals(), drag: true, onDrag: setV });
  $('#steps', el).innerHTML = C.DATA.map((d, i) => `<div class="labrow"><div><b>${d[0]}</b><small class="muted">valor de la tabla: ${d[1]}</small></div><div class="stp"><button data-i="${i}" data-d="-1" aria-label="Bajar barra de ${d[0]}">−</button><output data-i="${i}">${L.v[i] ?? 0}</output><button data-i="${i}" data-d="1" aria-label="Subir barra de ${d[0]}">+</button></div></div>`).join('');
  $$('#steps .stp button', el).forEach((b) => (b.onclick = () => { const i = +b.dataset.i; setV(i, Math.max(0, Math.min(8, (L.v[i] ?? 0) + +b.dataset.d))); beep('tick'); }));
  $('#rst', el).onclick = () => { C.DATA.forEach((_, i) => setV(i, 0)); L.v = {}; $('#labFb', el).innerHTML = ''; };
  $('#chk', el).onclick = () => {
    const probs = [];
    if (L.t !== 0 || L.y !== 0 || L.s !== 0) probs.push('Vuelve al paso 1 y completa el título, el eje vertical y la escala.');
    const bad = C.DATA.filter((d, i) => (L.v[i] ?? 0) !== d[1]).map((d) => d[0]);
    if (bad.length) probs.push('Revisa estas barras con la tabla: <b>' + bad.join(', ') + '</b>.');
    if (probs.length) { beep('no'); $('#labFb', el).innerHTML = fbox('no', 'Casi. Ajusta esto:', `<ul>${probs.map((p) => `<li>${p}</li>`).join('')}</ul>`); shake($('#lc', el)); }
    else { L.ok = true; beep('win'); confetti(); $('#labFb', el).innerHTML = fbox('ok', 'Gráfico correcto', 'Tiene título claro, eje vertical bien nombrado, escala desde 0 y barras fieles a la tabla. Ahora puedes leerlo: la categoría con mayor frecuencia es <b>luces</b>.'); ctl.bars.forEach((b, i) => b.classList.toggle('hi', C.DATA[i][1] === 6)); }
    gsap.from($('#labFb', el).firstChild, { y: mv(12), autoAlpha: 0, duration: D(0.3) });
  };
  ctl.intro(0.2);
});

/* ===== INTERPRETAR ===== */
const SECT_OPT = { title: 'Equipos encendidos sin uso por sector (datos de práctica)', ylab: 'Cantidad de equipos', xlab: 'Sector observado', max: 6, hi: (d) => d[1] === 5 };
add('int', 'Veo, interpreto y me pregunto', (el) => {
  el.innerHTML = `${head('Actividad central · Leemos antes de interpretar', 15, 'Veo, interpreto y me pregunto', 'Primero <strong>describe</strong> lo que ves, después <strong>interpreta con prudencia</strong> y por último escribe lo que <strong>te preguntas</strong>. Arrastra cada frase a su cajón.')}
  <div class="grid2 wide-r"><div class="chartbox" id="c2" data-a></div><div id="g2" data-a></div></div>`;
  chart($('#c2', el), C.SECT, SECT_OPT).intro(0.3); sortGame($('#g2', el), { items: C.SORT2, cats: C.CAT2, store: S.s2 });
});
add('int', 'Detector de exageraciones', (el) => {
  el.innerHTML = `${head('Actividad central · Detector de conclusiones exageradas', 15, '¿Respaldada o exagerada?', 'Los datos son de <strong>cuatro sectores, un día y una hora</strong>. ¿Qué frase está respaldada y cuál se pasa de lo observado?')}
  <div class="grid2 wide-r"><div class="chartbox" id="c3" data-a></div><div id="g3" data-a></div></div>`;
  chart($('#c3', el), C.SECT, SECT_OPT).intro(0.3); sortGame($('#g3', el), { items: C.SORT3, cats: C.CAT3, store: S.s3, tint: ['good', 'bad'] });
});

/* ===== MISIÓN ===== */
add('mis', 'Misión: une dato y medida', (el, api) => {
  const K = S.link;
  el.innerHTML = `${head('Aplicación · Misión “Recomendación con evidencia”', 10, 'Une cada dato con la medida que lo respalda', 'Toca un <strong>dato</strong> y luego una <strong>medida</strong>: si se corresponden, se conectan con un cable. Logra las tres combinaciones y evita la medida insegura.')}
  <div class="row" data-a><span class="pill">Conexiones: <b id="lk">0</b> / 3</span><div class="prog" style="flex:1;min-width:8rem"><i id="lb"></i></div></div>
  <div class="link" data-a id="link"><svg class="wires" aria-hidden="true"></svg>
  <div class="col">${C.RECS_D.map((d, i) => `<button class="node d" data-i="${i}"><small>Dato observado</small>${d}</button>`).join('')}</div><div></div>
  <div class="col">${C.RECS_M.map((m, i) => `<button class="node m" data-i="${i}"><small>Medida</small>${m.t}</button>`).join('')}</div></div><div id="lfb" aria-live="polite"></div>`;
  let sel = null; const wires = $('svg.wires', el), L = $('#link', el);
  const nodeEl = (s, i) => $(`.node.${s}[data-i="${i}"]`, el);
  const wire = (d, m, anim) => {
    const r0 = L.getBoundingClientRect(), a = nodeEl('d', d).getBoundingClientRect(), b = nodeEl('m', m).getBoundingClientRect();
    if (!r0.width) return; wires.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
    const x1 = a.right - r0.left, y1 = a.top + a.height / 2 - r0.top, x2 = b.left - r0.left, y2 = b.top + b.height / 2 - r0.top, mx = (x1 + x2) / 2;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`); wires.appendChild(p);
    if (anim) gsap.fromTo(p, { drawSVG: '0%' }, { drawSVG: '100%', duration: D(0.6), ease: 'power2.inOut' });
  };
  const paint = () => { $('#lk', el).textContent = K.done.size; gsap.to($('#lb', el), { scaleX: K.done.size / 3, duration: D(0.4) }); $$('.node', el).forEach((n) => { const i = +n.dataset.i; const dn = n.classList.contains('d') ? K.done.has(i) : [...K.done].some((d) => C.RECS_M[+n.dataset.i].d === d); n.classList.toggle('done', dn); n.classList.toggle('sel', !!sel && sel.s === (n.classList.contains('d') ? 'd' : 'm') && sel.i === i); }); };
  const check = (d, m) => {
    const mm = C.RECS_M[m]; let h;
    if (mm.d === -1) { h = fbox('no', 'Medida insegura', 'Los estudiantes no desenchufan ni manipulan equipos conectados. Observar, avisar y pedir ayuda a un adulto es la acción segura.'); shake(nodeEl('m', m)); beep('no'); }
    else if (mm.d !== d) { h = fbox('warn', 'La medida no responde a ese dato', 'Es una medida segura, pero no resuelve lo que observamos en ese dato. Busca la que corresponde.'); shake(nodeEl('m', m)); beep('no'); }
    else { K.done.add(d); h = fbox('ok', 'Recomendación bien respaldada', `“Como observamos ${C.RECS_D[d]}, recomendamos ${mm.t.charAt(0).toLowerCase() + mm.t.slice(1)}.”`); wire(d, m, true); beep('ok'); if (K.done.size === 3) { h += fbox('info', 'Misión completada', 'Ahora arma tu propia recomendación en la siguiente diapositiva.'); setTimeout(() => { confetti(); beep('win'); }, 500); } }
    $('#lfb', el).innerHTML = h; gsap.from($('#lfb', el).children, { y: mv(12), autoAlpha: 0, duration: D(0.3), stagger: 0.1 });
  };
  $$('.node', el).forEach((n) => (n.onclick = () => {
    const s = n.classList.contains('d') ? 'd' : 'm', i = +n.dataset.i; if (n.classList.contains('done')) return;
    if (sel && sel.s !== s) { const d = s === 'd' ? i : sel.i, m = s === 'm' ? i : sel.i; sel = null; check(d, m); }
    else { sel = { s, i }; beep('tap'); }
    paint();
  }));
  api.later(() => { K.done.forEach((d) => wire(d, C.RECS_M.findIndex((m) => m.d === d), false)); paint(); }, 700); paint();
});

add('mis', 'Mi recomendación', (el) => {
  const R = S.rec, sent = () => `Como observamos <b>${R.d !== null ? C.RECS_D[R.d] : '___'}</b>, recomendamos <b>${R.m !== null ? C.RECS_M[R.m].t.charAt(0).toLowerCase() + C.RECS_M[R.m].t.slice(1) : '___'}</b> <b>${R.b !== null ? C.BECAUSE[R.b] : 'porque ___'}</b>.`;
  const grp = (k, h, arr) => `<div class="panel"><h3>${h}</h3><div class="chips" id="g${k}">${arr.map((a, i) => `<button class="chip" data-i="${i}" aria-pressed="${R[k] === i}">${a}</button>`).join('')}</div></div>`;
  el.innerHTML = `${head('Aplicación · Mi recomendación', 10, 'Arma tu propia recomendación con evidencia', 'En parejas: elijan las tres piezas, lean la frase en voz alta y escríbanla con sus palabras.')}
  <div class="panel" data-a style="border-color:var(--amber)"><p class="qtext" id="sent" style="font-weight:600"></p></div>
  <div class="three" data-a>${grp('d', '1 · Dato observado', C.RECS_D)}${grp('m', '2 · Medida segura', C.RECS_M.filter((m) => m.d >= 0).map((m) => m.t))}${grp('b', '3 · Porque…', C.BECAUSE)}</div>
  <div class="panel own" data-a><h3>Con mis propias palabras</h3><textarea id="mTxt" aria-label="Mi recomendación" placeholder="Como observamos…, recomendamos… porque…"></textarea></div>`;
  const show = () => { $('#sent', el).innerHTML = sent(); };
  ['d', 'm', 'b'].forEach((k) => $$(`#g${k} .chip`, el).forEach((b) => (b.onclick = () => { R[k] = +b.dataset.i; $$(`#g${k} .chip`, el).forEach((x) => x.setAttribute('aria-pressed', x === b)); show(); pop($('#sent', el), 1.02); beep('tap'); if (R.d !== null && R.m !== null && R.b !== null) { if (!R.done) { R.done = 1; confetti(); beep('win'); } } })));
  $('#mTxt', el).value = R.txt; $('#mTxt', el).oninput = (e) => (R.txt = e.target.value); show();
});

/* ===== EVALUACIÓN ===== */
add('eval', 'Evaluación formativa', evalQuiz({ QS: C.QS, store: S.ev, msg: (ok, N) => (ok === N ? '¡Excelente! Lees gráficos con cuidado y tus conclusiones se apoyan en los datos.' : ok >= 4 ? 'Muy bien. Revisa las explicaciones de las preguntas incorrectas para fortalecer la idea.' : 'Buen comienzo. Recuerda: primero describir lo que se ve, después interpretar con prudencia.') }));

/* ===== CIERRE ===== */
add('cierre', 'Puesta en común', (el) => {
  const cats = C.DATA.map((d) => d[0]);
  el.innerHTML = `${head('Puesta en común y cierre', 8, 'Intercambiamos gráficos: veo, interpreto, pregunto', 'Cada grupo intercambia su gráfico con otro y responde las tres preguntas. Después elegimos los datos para la campaña de la clase 24.')}
  <div class="steps3">${[['Veo', 'Describe lo que muestra el gráfico del otro grupo.', 'var(--blue)'], ['Interpreto', 'Propón una explicación prudente, apoyada en un dato.', 'var(--amber)'], ['Me pregunto', 'Escribe una pregunta nueva que los datos no responden.', 'var(--meta)']].map(([t, d, c], i) => `<div class="s" style="--c:${c}" data-build="${i + 1}"><h3>${i + 1} · ${t}</h3><p class="muted">${d}</p></div>`).join('')}</div>
  <div class="panel" data-build="4"><h3>Votación: ¿qué dato usaremos en la campaña de la clase 24?</h3><p class="muted" style="margin-bottom:.7rem">Cada estudiante toca el dato que cree más importante comunicar a la escuela.</p><div id="camp"></div></div>`;
  poll($('#camp', el), { options: cats, store: S.camp, icons: C.DEV_ICONS });
});

add('cierre', 'Lo que ya puedo hacer', (el) => {
  el.innerHTML = `${head('Cierre · Autoevaluación y ticket de salida', 8, 'Lo que ya puedo hacer', '')}
  <div class="grid2"><div class="panel" data-a><h3>Marca lo que ya logras</h3><div class="check" id="can"></div></div>
  <div class="ticket" data-a><h3>Ticket de salida</h3><label>Nuestro gráfico muestra <select id="tk1"><option value="">elige…</option>${C.TK1.map((t) => `<option>${t}</option>`).join('')}</select> por eso una medida posible es <select id="tk2"><option value="">elige…</option>${C.TK2.map((t) => `<option>${t}</option>`).join('')}</select></label>
  <button class="btn amber" id="tkSave">Guardar mi ticket</button><p id="tkfb" style="color:var(--safe)"></p></div></div>`;
  checklist($('#can', el), C.CAN, S.can);
  $('#tk1', el).value = S.tk[0]; $('#tk2', el).value = S.tk[1]; $('#tk1', el).onchange = (e) => (S.tk[0] = e.target.value); $('#tk2', el).onchange = (e) => (S.tk[1] = e.target.value);
  $('#tkSave', el).onclick = () => { if (!$('#tk1', el).value || !$('#tk2', el).value) { toast('Completa las dos partes del ticket'); return; } $('#tkfb', el).textContent = 'Ticket guardado. En la clase 21 seguiremos el recorrido de la electricidad desde su origen hasta nuestra sala.'; confetti(); beep('win'); };
});

add('cierre', 'Próxima clase', (el, api) => {
  el.innerHTML = `${head('Próxima clase', 1, 'Clase 21: ¿de dónde viene la electricidad que usamos?', 'Seguiremos el recorrido de la electricidad desde una fuente hasta los lugares donde la usamos.')}
  <svg class="grid-flow" viewBox="0 0 800 230" role="img" aria-label="Recorrido de la electricidad: fuente, central, torres y escuela" data-a>
  <path id="rt" class="wire" d="M90 150 C 200 40, 260 40, 330 120 S 500 200, 560 110 S 680 60, 720 120"/><path id="rg" class="glow" d="M90 150 C 200 40, 260 40, 330 120 S 500 200, 560 110 S 680 60, 720 120"/>
  <g class="nd"><circle class="node-c" cx="90" cy="150" r="34"/><circle class="sym" cx="90" cy="150" r="9"/><path class="sym" d="M90 130v-8M90 178v-8M70 150h-8M118 150h-8M76 136l-6-6M104 164l6 6M104 136l6-6M76 164l-6 6"/><text x="90" y="212">Fuente</text></g>
  <g class="nd"><circle class="node-c" cx="330" cy="120" r="34"/><path class="sym" d="M318 134v-24l12 8 12-8v24z"/><text x="330" y="182">Central</text></g>
  <g class="nd"><circle class="node-c" cx="560" cy="110" r="34"/><path class="sym" d="M560 90l-10 40M560 90l10 40M552 108h16M549 120h22"/><text x="560" y="172">Torres</text></g>
  <g class="nd"><circle class="node-c" cx="720" cy="120" r="34"/><path class="sym" d="M703 124l17-16 17 16v14h-34zM715 138v-10h10v10"/><text x="720" y="182">Escuela</text></g>
  <circle class="dot" r="7" id="dt"/></svg>
  <div class="next" data-a>${ic('calendar')}<div><b>Antes de irte:</b> <span class="muted">guarda tu ticket de salida y piensa: ¿qué crees que pasa con la electricidad antes de llegar a esta sala?</span></div></div>`;
  api.later(() => {
    const nds = $$('.nd', el), g = $('#rg', el), tl = gsap.timeline();
    gsap.set(nds, { autoAlpha: 0, scale: mv(0.6), transformOrigin: '50% 50%' });
    tl.fromTo(g, { drawSVG: '0%' }, { drawSVG: '100%', duration: D(3.2), ease: 'power1.inOut' }, 0.3);
    nds.forEach((n, i) => tl.to(n, { autoAlpha: 1, scale: 1, duration: D(0.5), ease: 'back.out(2)' }, 0.3 + i * 0.95));
    tl.fromTo('#dt', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 3.5);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) tl.to('#dt', { motionPath: { path: '#rt', align: '#rt', alignOrigin: [0.5, 0.5] }, duration: 3, ease: 'none', repeat: -1 }, 3.5);
    api.cleanup(() => tl.kill());
  }, 50);
});

export { SCENES, STAGES, META, S, head, fbox };
