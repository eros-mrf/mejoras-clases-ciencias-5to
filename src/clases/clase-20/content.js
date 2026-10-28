// Contenido pedagógico de la Clase 20 (se mantiene igual que la versión original).
export const DATA=[['Luces',6],['Computadores',4],['Proyectores',2],['Cargadores',5],['Otros equipos',2]];
export const SECT=[['Sala de 5°',4],['Biblioteca',5],['Sala de computación',4],['Pasillo',1]];
export const VOCAB={dato:'Información que se puede contar o registrar, como “6 luces encendidas sin uso”.',frecuencia:'Cuántas veces aparece o se observa algo. En un gráfico de barras, la altura de la barra.',tabla:'Forma ordenada de mostrar datos en filas y columnas.','gráfico de barras':'Dibujo con barras: cada barra representa una categoría y su altura muestra la frecuencia.',tendencia:'Lo que se repite o se nota al comparar datos, por ejemplo qué categoría aparece más.',conclusión:'Explicación razonable que se apoya en los datos y no dice más de lo observado.',evidencia:'Dato o hecho observado que respalda lo que afirmamos.'};
export const INI_Q=[
{q:'¿Qué representa cada barra del gráfico?',o:['Un tipo de dispositivo y cuántos estaban encendidos sin uso','Una sala distinta de la escuela con su cantidad de personas','El dinero que cuesta cada tipo de dispositivo al mes'],a:0,w:'Cada barra es una categoría (tipo de dispositivo) y su altura es la frecuencia observada.'},
{q:'¿Qué categoría tiene la mayor frecuencia?',o:['Computadores, con 4 equipos','Luces, con 6 equipos','Cargadores, con 5 equipos'],a:1,w:'Luces tiene la barra más alta: 6 encendidas sin uso.'},
{q:'Además de las barras, ¿qué información sigue siendo necesaria para entender el gráfico?',o:['Un fondo de colores y un dibujo grande','El nombre de quien hizo la auditoría','Título, nombre de los ejes y una escala'],a:2,w:'Sin título, ejes y escala no sabemos qué se midió ni cuánto vale cada barra.'}];
export const PARTS={
titulo:{n:'Título',w:'Dice qué datos muestra el gráfico, dónde y cuándo se observaron. Sin título, el gráfico no cuenta nada.'},
eje_y:{n:'Eje vertical',w:'Muestra la escala y la unidad: aquí, la cantidad de equipos observados (frecuencia). Parte en 0 y avanza de a un número fijo.'},
eje_x:{n:'Eje horizontal',w:'Muestra las categorías que comparamos: aquí, los tipos de dispositivo.'},
barra:{n:'Barra',w:'Su altura representa la frecuencia de esa categoría. Todas las barras deben medirse con la misma escala.'},
escala:{n:'Escala',w:'Los números del eje vertical. Si no parte en 0 o salta de forma irregular, el gráfico puede engañar a quien lo lee.'}};
export const SORT1=[
{t:'La barra de luces llega a 6 y la de proyectores a 2.',a:'Descripción',w:'Dice lo que se ve en el gráfico, sin agregar nada.'},
{t:'Hay más luces encendidas sin uso que proyectores: quizás conviene revisar primero las luces.',a:'Interpretación prudente',w:'Usa el dato para proponer algo, sin afirmar de más.'},
{t:'Las luces siempre quedan encendidas en toda la escuela.',a:'Exageración',w:'Los datos son de cuatro sectores y un momento: no permiten decir “siempre” ni “toda la escuela”.'}];
export const CAT1=['Descripción','Interpretación prudente','Exageración'];
export const SORT2=[
{t:'La barra de la biblioteca llega a 5.',a:'Veo',w:'Es una lectura directa del gráfico.'},
{t:'Algunos equipos quedan encendidos al terminar de usarlos.',a:'Interpreto',w:'Es una explicación posible que va más allá de la barra.'},
{t:'¿Los números cambiarían durante el recreo?',a:'Me pregunto',w:'Es una pregunta nueva que los datos no responden.'},
{t:'El eje vertical parte en 0 y sube de 1 en 1.',a:'Veo',w:'Es algo que se ve en el gráfico.'},
{t:'Los sectores con más actividad podrían tener más equipos que revisar.',a:'Interpreto',w:'Propone una razón posible, pero habría que comprobarla.'},
{t:'¿Habría los mismos resultados si observamos otro día?',a:'Me pregunto',w:'Es una pregunta para una nueva observación.'}];
export const CAT2=['Veo','Interpreto','Me pregunto'];
export const SORT3=[
{t:'En la biblioteca se observaron 5 equipos encendidos sin uso.',a:'Respaldada',w:'Es un dato visible en la barra de la biblioteca.'},
{t:'La biblioteca es el sector que peor cuida la energía de toda la escuela.',a:'Exagerada',w:'Solo se observaron cuatro sectores, y la frase juzga a las personas.'},
{t:'El pasillo tuvo la menor cantidad: 1 equipo sin uso.',a:'Respaldada',w:'Se ve en el gráfico: es la barra más baja.'},
{t:'Como en el pasillo había solo 1, nunca se desperdicia energía en los pasillos.',a:'Exagerada',w:'Un solo momento de observación no permite decir “nunca”.'},
{t:'Tres sectores tienen 4 o 5 equipos sin uso; convendría observarlos de nuevo para confirmar.',a:'Respaldada',w:'Se apoya en los datos y reconoce que faltan más observaciones.'}];
export const CAT3=['Respaldada','Exagerada'];
export const LT=[['Equipos encendidos sin uso por tipo de dispositivo',1],['Gráfico de la escuela de Cajón',0],['Energía y dispositivos eléctricos',0]];
export const LY=[['Cantidad de equipos observados (n.º)',1],['Dinero gastado en electricidad ($)',0],['Tamaño de los dispositivos (cm)',0]];
export const LS=[['Parte en 0 y sube de 1 en 1 hasta 8',1,0,8,1],['Parte en 4 y sube de 2 en 2 hasta 8',0,4,8,2],['Va de 0 a 100 y sube de 25 en 25',0,0,100,25]];
export const RECS_D=['6 luces encendidas sin uso','2 proyectores encendidos sin uso','5 cargadores conectados sin uso'];
export const RECS_M=[
{t:'Recordar apagar las luces autorizadas al salir de un espacio vacío',d:0},
{t:'Pedir a un adulto que apague el proyector al terminar la actividad',d:1},
{t:'Avisar a un adulto para que revise los cargadores que no se usan',d:2},
{t:'Desenchufar nosotros los equipos durante el recreo',d:-1}];
export const QS=[
{q:'En un gráfico de barras de la auditoría, ¿qué representa la altura de cada barra?',o:['La cantidad de dispositivos que hay en una escuela completa','La frecuencia: cuántas veces se observó esa categoría','El gasto en dinero que tiene cada tipo de dispositivo'],a:1,w:'La altura de la barra es la frecuencia de la categoría observada.'},
{q:'Un gráfico muestra luces 6, computadores 4 y proyectores 2. ¿Qué frase solo DESCRIBE el gráfico?',o:['Los proyectores son los equipos que más energía malgastan','Las luces son el equipo que se debe prohibir en la escuela','La categoría con mayor frecuencia fue luces, con 6 casos'],a:2,w:'Describir es decir lo que se ve en los datos, sin juicios ni causas.'},
{q:'Hay 6 luces encendidas sin uso en dos salas. ¿Cuál es una interpretación razonable?',o:['Podría haber una oportunidad de ahorro al apagar luces de espacios vacíos','Toda la escuela deja siempre las luces prendidas sin ninguna razón','Las luces consumen mucho más energía que todos los demás equipos'],a:0,w:'La interpretación prudente propone una posibilidad que se apoya en el dato, sin exagerar.'},
{q:'Un gráfico no tiene título ni nombre en los ejes. ¿Por qué es un problema?',o:['Porque las barras quedan con un color poco atractivo','Porque no se pueden escribir los números en la escala','Porque no se sabe qué datos muestra ni qué se midió'],a:2,w:'El título y los ejes explican qué se midió, en qué categorías y con qué escala.'},
{q:'Observaste solo la biblioteca, un martes a las 10:00. ¿Qué conclusión está respaldada?',o:['En todos los colegios del país se desperdicia energía','En la biblioteca, ese martes, había equipos encendidos sin uso','Los estudiantes de la escuela dejan siempre todo encendido'],a:1,w:'La conclusión debe limitarse al sector y al momento observados.'},
{q:'¿Qué recomendación incluye el dato que la apoya y es segura para estudiantes?',o:['Como vimos 5 cargadores sin uso, avisaremos a un adulto para que los revise','Como vimos 5 cargadores sin uso, los desenchufaremos nosotros en el recreo','Como vimos 5 cargadores sin uso, ya no se debe usar ningún cargador'],a:0,w:'Une el dato con una acción segura. Los estudiantes avisan; no manipulan equipos conectados.'}];

export const ROUTE = [['Revisamos los datos', 'Partimos de la tabla de la auditoría.'], ['Construimos un gráfico', 'Título, ejes, escala y barras.'], ['Leemos antes de interpretar', 'Primero describimos lo que vemos.'], ['Formulamos conclusiones', 'Explicaciones que los datos respaldan.'], ['Detectamos exageraciones', 'Revisamos si decimos más de lo observado.']];
export const CAN = ['Puedo organizar datos de una auditoría en una tabla y en un gráfico de barras.', 'Puedo leer un gráfico: título, ejes, escala y barras.', 'Puedo diferenciar descripción, interpretación y exageración.', 'Puedo escribir una recomendación segura que incluya el dato que la apoya.'];
export const TK1 = ['que las luces tuvieron la mayor frecuencia sin uso', 'que hay equipos encendidos sin uso en varios sectores', 'que el pasillo tuvo la menor cantidad de equipos sin uso'];
export const TK2 = ['recordar apagar lo que está autorizado al salir', 'avisar a un adulto para que revise los equipos sin uso', 'observar de nuevo otro día para confirmar el dato'];
export const BECAUSE = ['porque así evitamos energía desperdiciada', 'porque es una acción segura para estudiantes', 'porque lo podemos comprobar en una nueva observación'];
// Íconos simples (viewBox 48×48) para el sondeo de dispositivos
export const DEV_ICONS = [
  '<path d="M18 36h12M20 41h8M24 5a13 13 0 0 0-7 24c1 1 2 3 2 5h10c0-2 1-4 2-5A13 13 0 0 0 24 5z"/>',
  '<rect x="9" y="10" width="30" height="20" rx="2"/><path d="M4 36h40l-3 4H7z"/>',
  '<rect x="5" y="16" width="38" height="16" rx="3"/><circle cx="31" cy="24" r="5"/><path d="M11 36v3M37 36v3"/>',
  '<path d="M17 6v10M31 6v10M12 16h24v8a12 12 0 0 1-24 0zM24 36v8"/>',
  '<circle cx="24" cy="24" r="6"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4 4M33.5 33.5l4 4M37.5 10.5l-4 4M14.5 33.5l-4 4"/>'];
