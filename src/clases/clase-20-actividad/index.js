// Clase 20 · versión para estudiantes: solo la actividad central (Laboratorio + Interpretar), para usar en Chrome en cada equipo.
import { $, $$, ic, enter, toast, confetti } from '../../shared/kit.js';
import { startDeck } from '../../shared/deck.js';
import { SCENES, S, head, fbox } from '../clase-20/scenes.js';
import * as C from '../clase-20/content.js';

const STAGES = [{ id: 'ini', name: 'Instrucciones' }, { id: 'lab', name: 'Laboratorio' }, { id: 'int', name: 'Interpretar' }, { id: 'fin', name: 'Mi resumen' }];
S.name = '';

const intro = {
  stage: 'ini', title: 'Instrucciones',
  build(el) {
    el.innerHTML = `<div class="head" data-a><div class="eyebrow"><span>Clase 20 · Actividad central</span><span class="tag">35 min</span></div><h2>De la tabla al gráfico: ¡ahora lo haces tú!</h2>
    <p class="lead">Trabaja en tu equipo, a tu ritmo. Si necesitas ayuda, levanta la mano. Al terminar tendrás un resumen para mostrarle a tu profesor/a.</p></div>
    <div class="steps3" data-a>${[['1 · Laboratorio', 'Con la tabla elige título, eje y escala. Luego ajusta cada barra y pulsa Comprobar.', 'var(--amber)'], ['2 · Veo, interpreto, me pregunto', 'Arrastra cada frase al cajón correcto usando el gráfico por sectores.', 'var(--blue)'], ['3 · Detector', 'Decide qué conclusiones están respaldadas y cuáles son exageradas.', 'var(--meta)']].map(([t, d, c]) => `<div class="s" style="--c:${c}"><h3>${t}</h3><p class="muted">${d}</p></div>`).join('')}</div>
    <div class="panel" data-a style="max-width:34rem"><h3>Mi nombre</h3><input id="nm" aria-label="Mi nombre" placeholder="Escribe tu nombre" style="font:inherit;width:100%;background:var(--surface-2);color:var(--text);border:2px solid var(--line-2);border-radius:.8rem;padding:.7rem 1rem;min-height:3rem"></div>
    <div class="agree" data-a><b>Regla de oro:</b> una conclusión no puede decir más de lo que muestran los datos.</div>`;
    const i = $('#nm', el); i.value = S.name; i.oninput = () => (S.name = i.value.trim());
  },
};

const fin = {
  stage: 'fin', title: 'Mi resumen',
  build(el) {
    const L = S.lab, g = (st, n) => `${st.first ?? 0} de ${n} a la primera${st.idx >= n ? '' : ' (incompleto)'}`;
    const lab = L.ok ? 'Gráfico comprobado y correcto' : (L.t === 0 && L.y === 0 && L.s === 0 ? 'Título, eje y escala listos; faltó comprobar las barras' : 'Laboratorio incompleto');
    const txt = `Clase 20 · Actividad central\nNombre: ${S.name || '(sin nombre)'}\nLaboratorio: ${lab}\nVeo / interpreto / me pregunto: ${g(S.s2, C.SORT2.length)}\nRespaldada o exagerada: ${g(S.s3, C.SORT3.length)}`;
    el.innerHTML = `${head('Cierre de la actividad', 5, 'Mi resumen', 'Muéstrale esta pantalla a tu profesor/a. Si algo salió incompleto, vuelve a esa diapositiva con <strong>Anterior</strong>.')}
    <div class="score" data-a><div><span class="tag">Estudiante</span><div class="qtext" style="margin-top:.4rem">${S.name || '(sin nombre)'}</div></div></div>
    <div class="grid2" data-a>${[['Laboratorio', lab, L.ok], ['Veo / interpreto / me pregunto', g(S.s2, C.SORT2.length), S.s2.idx >= C.SORT2.length], ['Respaldada o exagerada', g(S.s3, C.SORT3.length), S.s3.idx >= C.SORT3.length]].map(([t, v, ok]) => `<div class="fb ${ok ? 'ok' : 'warn'}"><b>${ok ? '✔' : '…'} ${t}</b>${v}</div>`).join('')}</div>
    <div class="row" data-a><button class="btn amber" id="cp">${ic('check')} Copiar mi resumen</button><span class="muted">Puedes pegarlo en un mensaje o documento.</span></div>
    <div class="panel" data-a><h3>Ticket de salida</h3><p class="qtext" style="font-weight:600">Nuestro gráfico muestra ___ por eso una medida posible es ___.</p><p class="muted" style="margin-top:.4rem">Escríbelo en tu cuaderno con una idea que tus datos respalden.</p></div>`;
    $('#cp', el).onclick = async () => { try { await navigator.clipboard.writeText(txt); toast('Resumen copiado'); confetti(); } catch (e) { toast('No se pudo copiar: selecciona y copia el texto de la pantalla'); } };
  },
};

const keep = SCENES.filter((s) => s.stage === 'lab' || s.stage === 'int');
startDeck({ stages: STAGES, scenes: [intro, ...keep, fin], brand: 'Ciencias 5° · <b>Actividad central</b>', metaText: 'Organizar datos en tablas y gráficos, interpretar tendencias y formular conclusiones prudentes.', tools: ['tTimer', 'tSnd', 'tFull'] });
