// Contenido pedagógico de la Clase 21 (igual que la versión original).
export const VOCAB={generación:'Proceso en que una central transforma la energía de una fuente en energía eléctrica.','fuente de energía':'Recurso que tiene energía disponible: el Sol, el viento, el agua en movimiento o un combustible como el gas.',electricidad:'Forma de energía que viaja por conductores y que transformamos en luz, sonido, calor o movimiento.',transporte:'Etapa en que líneas y torres llevan la electricidad desde las centrales a grandes distancias, hasta las ciudades.',distribución:'Etapa en que postes y cables reparten la electricidad por barrios, calles y edificios.',consumo:'La electricidad que usamos. Usar menos electricidad innecesaria reduce el consumo.'};
export const HYP=[
{t:'Se produce dentro de la pared, justo donde está el enchufe',ok:0,w:'En la pared solo llegan cables: allí la electricidad ya viene de otro lugar.'},
{t:'Se genera en una central lejana a partir de una fuente de energía',ok:1,w:'Esta idea es la que hoy vamos a explicar con evidencias y un esquema.'},
{t:'Está guardada en una gran pila dentro de cada edificio',ok:0,w:'Las pilas se agotan; la electricidad de la red se está generando y enviando de forma continua.'},
{t:'No lo sé todavía y quiero averiguarlo',ok:2,w:'Es una buena hipótesis de partida: hoy reuniremos pistas.'}];
export const INI_Q=[
['¿Qué significa generar electricidad?','Transformar la energía de una fuente en energía eléctrica.'],
['¿Qué fuentes pueden utilizarse para producirla?','El Sol, el viento, el agua en movimiento, el carbón o el gas, entre otras.'],
['¿Cómo llega desde el lugar de generación hasta una ciudad?','Viaja por líneas de transporte y luego por redes de distribución.'],
['¿Por qué distintas fuentes pueden tener ventajas y desafíos?','Algunas dependen del clima; otras se agotan o emiten gases al quemarse.'],
['¿Cómo se relaciona esto con el uso responsable?','Si usamos menos electricidad innecesaria, hace falta generar menos.']];
export const FLOW=[
{n:'Fuente de energía',s:'Sol, viento, agua o combustible',ic:'fuente',w:'Todo comienza con algo que tiene energía disponible: la luz del Sol, el viento, el agua que cae o corre, o combustibles como el gas o el carbón.',ex:'Ejemplo: el viento mueve las aspas de una turbina.',sf:null},
{n:'Generación',s:'Una central produce electricidad',ic:'gen',w:'En una central eléctrica, la energía de la fuente se transforma en energía eléctrica. Aquí “nace” la electricidad de la red.',ex:'Ejemplo: movimiento → electricidad.',sf:null},
{n:'Transporte',s:'Líneas y torres la llevan lejos',ic:'trans',w:'La electricidad viaja por líneas sostenidas en torres, a veces por cientos de kilómetros, desde las centrales hasta las ciudades.',ex:'Ejemplo: las torres que se ven a lo lejos en el campo.',sf:'Mira las torres y los cables solo desde lejos. Nunca te acerques, trepes ni lances objetos.'},
{n:'Distribución',s:'Postes y cables la reparten',ic:'dist',w:'Dentro de la ciudad, redes de postes y cables reparten la electricidad por calles y barrios hasta cada edificio.',ex:'Ejemplo: los postes de tu calle y los cables que llegan a la escuela.',sf:'Si ves un cable caído o un poste dañado, aléjate y avisa a un adulto.'},
{n:'Usuario',s:'Hogar o escuela: la usamos',ic:'user',w:'Cuando conectamos un aparato o encendemos una luz, la electricidad se transforma en luz, sonido, calor o movimiento. Lo que usamos se llama consumo.',ex:'Ejemplo: la ampolleta de la sala transforma electricidad en luz.',sf:'En la sala nunca tocamos enchufes ni cables. Los usan los adultos.'}];
export const SRC=[
{k:'sol',n:'Sol',t:'R',o:'La luz del Sol llega todos los días.',v:'Se renueva naturalmente y no emite gases al generar.',d:'Depende de que haya luz: de noche no genera.'},
{k:'viento',n:'Viento',t:'R',o:'El aire en movimiento mueve turbinas.',v:'Se renueva naturalmente y no se agota.',d:'Depende de que haya viento suficiente.'},
{k:'agua',n:'Agua en movimiento',t:'R',o:'Ríos y caídas de agua mueven turbinas.',v:'Se renueva con el ciclo del agua.',d:'Depende de la lluvia y puede cambiar el entorno del río.'},
{k:'carbon',n:'Carbón',t:'N',o:'Se quema para producir calor.',v:'Puede generar de forma continua.',d:'Se agota y al quemarse emite gases y humo.'},
{k:'gas',n:'Gas natural',t:'N',o:'Se quema para producir calor.',v:'Puede aumentar su producción con rapidez.',d:'Se agota y al quemarse emite gases.'},
{k:'petro',n:'Petróleo y derivados',t:'N',o:'Se quema para producir calor.',v:'Es fácil de almacenar y trasladar.',d:'Se agota y al quemarse contamina el aire.'}];
export const SORTR=[
{t:'Viento: el aire en movimiento mueve las turbinas.',a:'Renovable',w:'El viento se repone de forma natural.'},
{t:'Carbón: se forma durante muchísimo tiempo y se quema.',a:'No renovable',w:'Se forma muy lentamente y se agota al usarse.'},
{t:'Agua de un río en movimiento.',a:'Renovable',w:'El agua se renueva con el ciclo natural del agua.'},
{t:'Gas natural: se quema para producir calor.',a:'No renovable',w:'Es un combustible que se agota al usarse.'},
{t:'Luz del Sol captada por paneles.',a:'Renovable',w:'El Sol entrega energía todos los días.'},
{t:'Petróleo: se usa como combustible.',a:'No renovable',w:'Es un combustible que se agota al usarse.'}];
export const CATR=['Renovable','No renovable'];
export const PERF=[{q:'¿Existe una fuente de electricidad perfecta?',o:['Sí: las renovables no tienen ninguna dificultad','No: cada fuente tiene ventajas y desafíos distintos','Sí: la que más electricidad entrega en cualquier lugar'],a:1,w:'Todas tienen ventajas y desafíos. Por eso también importa usar bien la electricidad que generamos.'}];
export const CH=[{n:'Fuente de energía',d:'Sol, viento, agua…'},{n:'Generación',d:'La central produce'},{n:'Transporte',d:'Líneas y torres'},{n:'Distribución',d:'Postes y cables'},{n:'Usuario',d:'La usamos'}];
export const BANK_ORDER=[3,0,4,2,1];
export const MAP=[
{l:'1 · Fuente de energía',o:['El enchufe de la pared','Una fuente como el viento, el Sol, el agua o un combustible','Una pila escondida en el techo'],a:1},
{l:'2 · Generación',o:['Una central transforma esa energía en electricidad','La ampolleta fabrica la electricidad que necesita','El interruptor genera la electricidad al apretarlo'],a:0},
{l:'3 · Transporte',o:['Los cables del pupitre la llevan hasta la central','Los profesores la trasladan en baterías grandes','Líneas y torres la llevan desde la central hasta la ciudad'],a:2},
{l:'4 · Distribución',o:['Se queda guardada en la calle hasta que se necesita','Postes y cables la reparten por las calles hasta la escuela','Se transforma en agua antes de llegar al edificio'],a:1},
{l:'5 · Usuario',o:['Al encender la luz, se transforma en luz (y algo de calor)','Al encender la luz, se convierte en más fuente de energía','Al encender la luz, vuelve a la central por el enchufe'],a:0}];
export const SORTU=[
{t:'Apagar las luces autorizadas de una sala vacía.',a:'Reduce el uso',w:'Evita usar electricidad sin necesidad. Se hace con interruptores autorizados.'},
{t:'Aprovechar la luz natural cuando alcanza para trabajar.',a:'Reduce el uso',w:'Se necesita menos luz eléctrica sin perder visibilidad.'},
{t:'Cambiar el pupitre de lugar para ver mejor la pizarra.',a:'No cambia el uso',w:'Es una decisión útil, pero no cambia la electricidad que se usa.'},
{t:'Revisar con un clip un enchufe que parece dañado.',a:'Es inseguro',w:'Nunca se manipulan enchufes ni cables. Se avisa a un adulto.'}];
export const CATU=['Reduce el uso','No cambia el uso','Es inseguro'];
export const QS=[
{q:'¿Qué significa “generar” electricidad?',o:['Guardar electricidad dentro de los enchufes de la casa','Transformar energía de una fuente en energía eléctrica','Llevar la electricidad desde los postes hasta la sala'],a:1,w:'Generar es transformar la energía de una fuente (viento, agua, combustible…) en electricidad, en una central.'},
{q:'¿Cuál es el orden general del recorrido de la electricidad?',o:['Generación → fuente → distribución → transporte → usuario','Fuente → transporte → generación → usuario → distribución','Fuente → generación → transporte → distribución → usuario'],a:2,w:'Primero hay una fuente, luego se genera, se transporta, se distribuye y llega al usuario.'},
{q:'¿Cuál de estas fuentes es renovable?',o:['El viento, porque se repone de forma natural','El gas natural, porque se repone en pocos días','El petróleo, porque se repone al usarlo en una central'],a:0,w:'El viento se renueva naturalmente. El gas y el petróleo se forman muy lentamente y se agotan.'},
{q:'¿Qué etapa lleva la electricidad desde la central hasta las ciudades?',o:['Distribución: reparte la electricidad por los barrios y las calles','Generación: produce la electricidad en una central eléctrica','Transporte: lleva la electricidad por líneas hasta las ciudades'],a:2,w:'El transporte lleva la electricidad a grandes distancias. La distribución la reparte dentro de la ciudad.'},
{q:'Una estudiante dice: “La electricidad nace en el enchufe”. ¿Qué respuesta la corrige mejor?',o:['Casi: el enchufe la produce usando la energía del aire de la sala','No: antes se genera en una central y viaja hasta la sala','Sí: se fabrica dentro de cada pared de la escuela'],a:1,w:'El enchufe es solo el final del recorrido: la electricidad se generó antes en otro lugar.'},
{q:'¿Por qué apagar una luz que no se necesita se relaciona con el origen de la electricidad?',o:['Porque usar menos electricidad ayuda a que se necesite generar menos','Porque la luz apagada hace que la electricidad viaje más rápido','Porque los cables dejan de ser necesarios en la escuela'],a:0,w:'Si usamos menos electricidad innecesaria, hace falta generar menos. Siempre con interruptores autorizados.'}];

export const META = 'Reconocer de manera general que la electricidad que usamos debe generarse a partir de distintas fuentes y recorrer sistemas de transporte y distribución antes de llegar a los usuarios.';
export const ROUTE = [['Partimos desde un enchufe', 'Lo observamos sin tocarlo y proponemos una hipótesis.'], ['Retrocedemos el recorrido', 'Seguimos la electricidad hacia atrás, hasta su origen.'], ['Comparamos fuentes', 'Vemos ventajas y desafíos de distintas fuentes.'], ['Ordenamos una cadena', 'Del origen al uso: fuente, generación, transporte, distribución, usuario.'], ['Relacionamos con el uso responsable', 'Generar y usar electricidad están conectados.']];
export const CAN = ['Puedo ordenar el recorrido: fuente, generación, transporte, distribución y usuario.', 'Puedo comparar dos fuentes y decir una ventaja y un desafío de cada una.', 'Puedo explicar por qué el enchufe no fabrica electricidad.', 'Puedo relacionar usar menos electricidad innecesaria con necesitar generar menos.'];
export const TK1 = ['ser generada a partir de una fuente de energía y luego transportada y distribuida', 'salir del enchufe de la pared donde la vamos a usar', 'quedar guardada en la sala hasta que alguien la necesite'];
export const TK2 = ['apagando solo lo autorizado cuando nadie lo necesita', 'tocando cables para revisar si llega electricidad', 'dejando equipos encendidos para que se calienten'];
export const REVS = ['se confirmó', 'se confirmó en parte', 'necesita corrección'];
export const TILES = [['Luz', 0], ['Computador', 1], ['Proyector', 2], ['Cargador', 3]];
export const TILE_ICONS = [
  '<path d="M18 36h12M20 41h8M24 5a13 13 0 0 0-7 24c1 1 2 3 2 5h10c0-2 1-4 2-5A13 13 0 0 0 24 5z"/>',
  '<rect x="9" y="10" width="30" height="20" rx="2"/><path d="M4 36h40l-3 4H7z"/>',
  '<rect x="5" y="16" width="38" height="16" rx="3"/><circle cx="31" cy="24" r="5"/><path d="M11 36v3M37 36v3"/>',
  '<path d="M17 6v10M31 6v10M12 16h24v8a12 12 0 0 1-24 0zM24 36v8"/>'];
export const SRC_ICONS = {
  sol: '<circle cx="24" cy="24" r="8"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M37.4 10.6l-4.2 4.2M14.8 33.2l-4.2 4.2"/>',
  viento: '<path d="M4 18h24a5 5 0 1 0-5-5M4 26h34a5 5 0 1 1-5 5M4 34h16a4 4 0 1 1-4 4"/>',
  agua: '<path d="M24 5C16 16 12 22 12 29a12 12 0 0 0 24 0c0-7-4-13-12-24z"/><path d="M18 30a6 6 0 0 0 6 6"/>',
  carbon: '<path d="M8 32l6-14 10-6 12 6 4 14-8 8H16z"/><path d="M14 18l10 8 12-8M24 26v14"/>',
  gas: '<path d="M24 4c2 8 12 12 12 24a12 12 0 0 1-24 0c0-6 4-8 5-14 3 2 5 4 5 8 3-4 3-10 2-18z"/>',
  petro: '<rect x="10" y="8" width="28" height="34" rx="5"/><path d="M10 16h28M10 34h28M10 25h28"/>'};
export const GEN = {
  viento: { n: 'Viento', from: 'Movimiento del aire', how: 'El viento empuja las aspas y mueve la turbina.', chain: ['Movimiento del viento', 'Turbina que gira', 'Electricidad'], speed: 2.2 },
  agua: { n: 'Agua en movimiento', from: 'Movimiento del agua', how: 'El agua que corre o cae empuja una turbina y la hace girar.', chain: ['Movimiento del agua', 'Turbina que gira', 'Electricidad'], speed: 3 },
  fuego: { n: 'Combustible', from: 'Calor al quemarse', how: 'Al quemarse, el combustible da calor; ese calor produce vapor que mueve la turbina.', chain: ['Calor del combustible', 'Vapor que mueve la turbina', 'Electricidad'], speed: 4 },
};
