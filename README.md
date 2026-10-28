# Clases de Ciencias 5° básico · presentaciones interactivas

Cada clase es **un único HTML autocontenido** (JS, CSS, fuentes e imagen embebidos en base64): se abre con doble clic, sin internet y sin instalar nada. Pensado para la **pantalla táctil de la sala**, siempre con fondo oscuro.

## Clase disponible

| Clase | Entregable |
|---|---|
| 20 · De la tabla al gráfico | [`dist/Clase_20_De_la_tabla_al_grafico.html`](dist/Clase_20_De_la_tabla_al_grafico.html) |

Además hay una **versión para estudiantes** con solo la actividad central (Laboratorio + Interpretar), pensada para que cada niño la use en Chrome en su equipo y la desarrolle en clase: [`dist/Clase_20_Actividad_central_estudiantes.html`](dist/Clase_20_Actividad_central_estudiantes.html). Incluye instrucciones, nombre del estudiante y una pantalla *Mi resumen* (con botón para copiarlo) que muestra al profesor cuánto logró. La presentación completa queda para el docente en la sala.

Misma estructura que la versión original (Meta → Ruta → Inicio → Modelamiento → Laboratorio → Interpretar → Misión → Evaluación → Cierre), ahora en **20 diapositivas** que caben en pantalla, con construcción por partes y actividades de participación.

## Cómo se usa en clase

- **Siguiente / Mostrar**: cuando una lámina tiene partes ocultas, el botón dice *Mostrar (n)* y las va revelando una a una; después pasa a la siguiente lámina. También sirven las flechas del teclado, **deslizar con el dedo** y los puntos inferiores.
- **Turno**: ruleta de participación (N.º de lista o grupo). **Temporizador**: toca el chip de minutos de cada lámina (o el reloj de la barra). **Lápiz**: dibuja sobre la lámina. Sonido y pantalla completa en la barra superior.
- Juegos y participación: predicción con votos de la clase, cronómetro lista vs. gráfico, vocabulario con tarjetas y juego rápido, *pon cada etiqueta en su lugar* (arrastrar), clasificar frases arrastrando a cajones, laboratorio donde las barras se fijan tocando/arrastrando, misión de conectar dato↔medida con cables, armador de recomendaciones, evaluación final con resultados animados, votación de datos para la campaña y ticket de salida.
- La evaluación formativa conserva la regla original: las respuestas correctas solo se ven al pulsar **Finalizar**.
- Accesibilidad: objetivos táctiles ≥ 3 rem, contraste alto, navegación por teclado, `aria-live` en retroalimentaciones y `prefers-reduced-motion` respetado (se quita el desplazamiento y se mantienen fundidos breves).

## Código fuente

```
build.mjs                     # esbuild → HTML único (reutilizable para las próximas clases)
assets/                       # fuentes woff2 (latin) e imagen del profe Eros
src/shared/theme.css          # tema oscuro compartido
src/shared/kit.js             # GSAP + helpers (entradas, confeti, sonido, arrastrar, gráfico SVG, clasificador, sondeo)
src/shared/deck.js            # motor de presentación (escenas, builds, transiciones, gestos, turno, timer, lápiz)
src/clases/clase-20/          # content.js (contenido pedagógico), scenes.js (escenas), index.js (presentación del docente), meta.json
src/clases/clase-20-actividad/ # versión estudiantes: reutiliza las escenas lab/int + instrucciones + resumen
scripts/smoke.mjs             # recorre todas las láminas en Chromium y falla si hay errores de consola
.claude/skills/               # skills de motion usados (ver abajo)
```

## Compilar

```bash
npm install
npm run build        # todas las clases de src/clases
npm run build:20     # solo la clase 20
```

Prueba de humo (requiere Playwright instalado; guarda capturas si pasas una carpeta):

```bash
node scripts/smoke.mjs dist/Clase_20_De_la_tabla_al_grafico.html capturas 1920 1080
```

Para una clase nueva: crear `src/clases/clase-NN/{index.js,content.js,meta.json}` reutilizando `startDeck` y `kit.js`, y ejecutar `npm run build`.

## Skills de movimiento (iart-ai/motion-skills)

Instalados en `.claude/skills/` desde los packs `web-animation-skills`, `explainer-video-skills` y `data-animation-skills`, y usados así:

| Skill | Uso real en la clase 20 |
|---|---|
| `gsap-web` | Timelines, **SplitText** en los títulos, escalonados, ruleta de turno |
| `svg-animation` | **DrawSVG** (camino de la ruta, cables de la misión, recorrido eléctrico) y **MotionPath** (punto que viaja por la red) |
| `diagram-animation` | Ruta de 5 estaciones y diagrama fuente → central → torres → escuela |
| `chart-animation` | Barras que crecen con conteo de valores; barras interactivas por `scaleY` |
| `page-transition-animation` | Transición dirigida entre láminas (sale/entra con solape) |
| `micro-interaction` | Rebote al tocar, sacudida al errar, confeti, toasts |
| `accessible-animation` | Movimiento por niveles según `prefers-reduced-motion` |
| `60fps-animation` | Solo `transform`/`opacity`, fondo ambiental sin filtros, sin layout thrash |

**Three.js / shaders no se usan**: esta clase trabaja con gráficos 2D y un objeto 3D no aportaba al aprendizaje (se reservan para clases que lo necesiten, p. ej. modelos de circuitos).
