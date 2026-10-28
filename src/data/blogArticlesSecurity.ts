import type { WritingArticle } from '../types';
import { articleCode, articleTable, buildArticle, compareDiagram, flowDiagram, readTimeOf } from './articleTemplate';

/* Artículos 36-38 del blog: incidentes de seguridad de octubre de 2026 (PHP, Node.js y Railway).
   Los datos salen de los avisos oficiales enlazados en las referencias de cada artículo. */

const PHP_CONTENT = buildArticle({
  prefix: 'php',
  intro:
    'El 21 de octubre de 2026 el proyecto PHP publicó una actualización de emergencia para dos vulnerabilidades críticas, CVE-2026-109618 y CVE-2026-109619, ambas con puntuación CVSS 9.2. Las dos permiten ejecutar código en el servidor sin iniciar sesión, con los permisos del proceso que atiende las peticiones web. PHP sigue moviendo una parte enorme de la web: WordPress, Laravel, tiendas en línea y paneles internos. Si tienes un sitio en PHP, esta no es una actualización para "cuando haya tiempo". Este artículo explica qué falla, quién está más expuesto, cómo comprobar la versión que de verdad atiende tu sitio y qué hacer mientras actualizas.',
  takeaways: [
    'Las versiones corregidas son PHP 8.2.35, 8.3.36, 8.4.27 y 8.5.12. Cualquier versión anterior de esas ramas es vulnerable.',
    'Apache con mod_php es la configuración más expuesta: ahí se demostró la ejecución remota de código completa.',
    'La única protección completa es actualizar. Las mitigaciones de configuración reducen el riesgo, pero el propio proyecto PHP dice que no hacen segura una instalación.',
    'La versión que importa es la del servidor web, no la que muestra la terminal: pueden ser distintas en el mismo equipo.',
  ],
  sections: [
    {
      id: 'php-que-paso',
      title: 'Qué pasó y qué versiones están corregidas',
      html: `<p>El 20 de octubre el proyecto PHP anunció en su sitio oficial que al día siguiente, a las 14:00 UTC, publicaría una versión de seguridad crítica. Avisar con un día de anticipación da tiempo a los equipos de operaciones para preparar la ventana de actualización. El 21 de octubre salieron las versiones corregidas de todas las ramas con soporte, junto con dos avisos de seguridad en el repositorio oficial del proyecto. Los dos fallos los reportaron investigadores de varias organizaciones, y la corrección la desarrolló el equipo principal de PHP.</p>
<p>Ambos fallos son del tipo "uso de memoria después de liberarla" (use after free): el intérprete sigue usando una zona de memoria que ya no es válida, y un atacante que logra controlar lo que hay en esa zona puede terminar ejecutando código. La complejidad del ataque es alta, pero no requiere usuario ni contraseña: basta con poder enviar peticiones al sitio. Esta tabla resume el estado de cada rama:</p>
${articleTable(
  ['Rama de PHP', 'Versión corregida', 'Estado del soporte'],
  [
    ['8.5', '8.5.12', 'Soporte activo'],
    ['8.4', '8.4.27', 'Soporte activo'],
    ['8.3', '8.3.36', 'Solo parches de seguridad'],
    ['8.2', '8.2.35', 'Solo seguridad, termina el 31 de diciembre de 2026'],
    ['8.1, 8.0, 7.4', 'Sin versión oficial', 'Sin soporte; existen parches mínimos que algunos proveedores empaquetan'],
    ['8.6 (versión candidata)', '8.6.0 RC4', 'Solo para pruebas; las RC anteriores son vulnerables'],
  ]
)}
<p>En los días siguientes hubo dos avisos más relacionados. El 23 de octubre el proyecto recomendó desactivar el progreso de subida de sesiones hasta la próxima versión de mantenimiento, por un caso adicional (CVE-2026-115560) que se documentará con esa versión. El 26 de octubre publicó compilaciones nuevas para Windows que actualizan la biblioteca Brotli por el fallo CVE-2026-111497, el mismo que obligó a Node.js a publicar su boletín de seguridad esa semana.</p>`,
    },
    {
      id: 'php-como-funcionan',
      title: 'Cómo funcionan los dos fallos',
      html: '<p>No hace falta entender el intérprete por dentro para protegerse, pero conocer el mecanismo ayuda a entender por qué ciertas configuraciones están más expuestas y por qué algunas mitigaciones funcionan y otras no.</p>',
      subsections: [
        {
          id: 'php-oom',
          title: 'CVE-2026-109618: memoria corrupta al quedarse sin memoria',
          html: `<p>Cuando PHP supera su límite de memoria, corta la petición de golpe con un salto interno (<code>longjmp()</code>). El problema es que, en algunos momentos del arranque de la petición, hay datos a medio inicializar. Si el corte ocurre justo ahí, la fase de limpieza encuentra esos datos y los trata como válidos. Lo grave es que el atacante puede provocar el corte a voluntad: una petición multipart sin longitud declarada que sigue enviando datos, partes con miles de cabeceras o campos de archivo vacíos con nombres anidados consumen mucha más memoria dentro de PHP que en la red.</p>
${flowDiagram(['Petición multipart\nmuy pesada', 'PHP supera su\nlímite de memoria', 'Corte abrupto\nde la petición', 'Datos a medio\ninicializar', 'La limpieza usa\ndatos inválidos'], 'Cómo un error de memoria se convierte en una puerta de entrada')}
<p>La corrección elimina ese corte abrupto: ahora PHP marca el error y detiene la petición en el siguiente punto seguro, y solo si el consumo sigue creciendo hasta un umbral mayor termina el proceso por completo.</p>`,
        },
        {
          id: 'php-estado-global',
          title: 'CVE-2026-109619: estado que sobrevive entre peticiones',
          html: '<p>PHP guarda información global sobre errores, sesiones y extensiones. En los servidores donde un mismo proceso atiende muchas peticiones seguidas, esa información puede quedarse apuntando a memoria de una petición que ya terminó. Si un error fatal, un tiempo de espera agotado o falta de memoria interrumpen la petición antes de que se limpie ese estado, la siguiente petición que llegue al mismo proceso puede usar un puntero que ya no es válido. El ataque necesita dos peticiones: una que deja el estado sucio y otra que lo usa. Los casos confirmados fueron la opción <code>fatal_error_backtraces</code> de PHP 8.5 y el progreso de subida de sesiones.</p>',
        },
        {
          id: 'php-mod-php',
          title: 'Por qué mod_php es el más expuesto',
          html: '<p>Con mod_php, PHP vive dentro del proceso de Apache y la fase de limpieza se ejecuta incluso cuando el arranque de la petición falla. Por eso ahí se demostró la cadena completa con los límites de entrada y de memoria que vienen por defecto. Más procesos y más tráfico no impiden el ataque: solo le dan al atacante más intentos.</p>',
        },
      ],
    },
    {
      id: 'php-exposicion',
      title: '¿Mi servidor está expuesto? Actualizar vs. mitigar',
      html: `<p>La forma en que el servidor web ejecuta PHP (lo que se llama SAPI) define qué tan fácil es explotar estos fallos. Los avisos oficiales lo detallan así:</p>
${articleTable(
  ['Cómo se ejecuta PHP', 'Riesgo según los avisos', 'Comentario'],
  [
    ['Apache con mod_php', 'Explotación completa demostrada', 'Prioridad máxima'],
    ['PHP-FPM (Nginx, Apache con proxy)', 'Afectado; sin ataque completo demostrado', 'El caso de subida de sesiones sí se validó en FPM'],
    ['FrankenPHP', 'Probablemente afectado', 'Ejecuta la limpieza siempre, como mod_php'],
    ['LiteSpeed (LSAPI)', 'Probablemente afectado', 'Depende de la aplicación'],
    ['php-cgi', 'Afectado', 'Mencionado en el anuncio oficial'],
  ]
)}
<p>Si tu configuración aparece en la tabla, tienes dos caminos, y no valen lo mismo:</p>
${compareDiagram(
  { title: 'Actualizar PHP', points: ['Corrige los dos fallos', 'Sin cambios de código', 'Exige reiniciar', 'Protección completa'] },
  { title: 'Solo mitigar', points: ['Reduce la superficie', 'Cambia la configuración', 'Tiene efectos secundarios', 'Protección parcial'] },
  'La mitigación gana tiempo; la actualización resuelve'
)}
<p>En hosting compartido normalmente no eliges la versión exacta del intérprete: depende de tu proveedor. En ese caso, revisa su panel o pregúntale directamente si ya aplicó las versiones de octubre. En un VPS, un contenedor o un servidor propio, la responsabilidad es tuya.</p>`,
    },
    {
      id: 'php-proteger',
      title: 'Cómo protegerte paso a paso',
      html: '<p>El orden importa: primero saber qué versión atiende de verdad tu sitio, después actualizar y, solo si no puedes hacerlo hoy mismo, aplicar mitigaciones temporales mientras llega la ventana de mantenimiento.</p>',
      subsections: [
        {
          id: 'php-version',
          title: 'Comprobar la versión real del servidor web',
          html: `<p>El error más común al verificar es abrir una terminal, escribir <code>php -v</code> y quedarse tranquilo. En muchos servidores la versión de la terminal (CLI) y la que usa el servidor web (FPM o mod_php) son paquetes distintos. La forma confiable es preguntarle al propio servidor web con un script temporal:</p>
${articleCode(`
<?php
// verificar-php.php: súbelo, ábrelo en el navegador y BÓRRALO al terminar
$corregidas = ['8.2' => '8.2.35', '8.3' => '8.3.36', '8.4' => '8.4.27', '8.5' => '8.5.12'];
$rama = PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION;

echo 'Versión: ' . PHP_VERSION . ' (' . PHP_SAPI . ')' . PHP_EOL;

if (!isset($corregidas[$rama])) {
    echo 'Rama sin soporte oficial: migra a una versión con soporte.';
} elseif (version_compare(PHP_VERSION, $corregidas[$rama], '<')) {
    echo 'VULNERABLE: actualiza al menos a ' . $corregidas[$rama];
} else {
    echo 'Corregida.';
}`)}`,
        },
        {
          id: 'php-actualizar',
          title: 'Actualizar y reiniciar',
          html: `<p>Si la versión aparece vulnerable, actualiza con el gestor de paquetes de tu sistema o de tu proveedor y reinicia el servicio que ejecuta PHP (Apache o PHP-FPM). Reiniciar no es opcional: los procesos que ya estaban corriendo siguen usando el código viejo. Si usas Docker, reconstruye la imagen descargando de nuevo la imagen base (<code>docker build --pull</code>) y vuelve a desplegar; una imagen construida antes del 21 de octubre sigue siendo vulnerable aunque su etiqueta diga <code>8.3</code>. Las distribuciones como Debian, Ubuntu o Red Hat publican sus propios paquetes corregidos, a veces con un número de versión distinto: en ese caso guíate por su aviso de seguridad y no por el número de PHP.</p>`,
        },
        {
          id: 'php-mitigaciones',
          title: 'Mitigaciones temporales mientras actualizas',
          html: `<p>Si no puedes actualizar hoy mismo, por ejemplo porque necesitas una ventana de mantenimiento, el proyecto PHP propone medidas que reducen la superficie de ataque. Deben configurarse a nivel de administrador (en <code>php.ini</code> o con <code>php_admin_value</code> en el pool de FPM), nunca con <code>ini_set()</code> ni con <code>.user.ini</code>, porque esas opciones se aplican demasiado tarde. Después hay que reiniciar todos los procesos.</p>
${articleCode(`
; Mitigaciones temporales: NO reemplazan la actualización
memory_limit = -1                    ; quita el límite predecible del que depende el ataque
post_max_size = 8M                   ; valores conservadores para el cuerpo de la petición
upload_max_filesize = 8M
max_input_nesting_level = 16
session.upload_progress.enabled = 0  ; recomendado aunque ya hayas actualizado
fatal_error_backtraces = 0           ; solo en PHP 8.5`)}
<p>Quitar el límite de memoria tiene un costo: una sola petición podría consumir toda la memoria del servidor. Por eso conviene combinarlo con un límite del contenedor o del grupo de control del sistema (cgroup <code>memory.max</code>). El aviso pide expresamente no usar <code>RLIMIT_AS</code> ni <code>RLIMIT_DATA</code>, porque provocan justamente el tipo de fallo de memoria que se quiere evitar. Si tu aplicación no recibe formularios con archivos, bloquear las peticiones multipart en el servidor web o en el proxy elimina la vía de ataque más directa del primer fallo.</p>`,
        },
      ],
    },
    {
      id: 'php-errores',
      title: 'Errores comunes al responder a esta vulnerabilidad',
      html: `<ul>
  <li><strong>Revisar la versión en la terminal y no en el servidor web.</strong> Pueden ser paquetes distintos. Verifica siempre a través de una petición web.</li>
  <li><strong>Actualizar sin reiniciar.</strong> Apache y PHP-FPM mantienen procesos vivos con el binario anterior hasta que se reinician.</li>
  <li><strong>Confiar en una imagen de Docker vieja.</strong> La etiqueta no cambia, el contenido sí. Reconstruye con la imagen base actualizada.</li>
  <li><strong>Aplicar las mitigaciones con <code>.user.ini</code> o <code>ini_set()</code>.</strong> Llegan después de que PHP ya procesó la petición; no protegen.</li>
  <li><strong>Olvidar los entornos secundarios.</strong> El servidor de pruebas, el panel interno o el WordPress olvidado también son entradas al resto de la red.</li>
  <li><strong>Dejar el script de verificación publicado.</strong> Muestra información del servidor; bórralo en cuanto termines.</li>
</ul>`,
    },
    {
      id: 'php-limites',
      title: 'Límites de las mitigaciones: lo que no te protege',
      html: `<p>Ninguna combinación de opciones de configuración cierra por completo estos fallos. El aviso del segundo fallo lo dice sin rodeos: no existe una mitigación genérica completa por configuración. Un registro de errores limpio tampoco prueba que el servidor esté a salvo. Tampoco sirve un firewall de aplicaciones web como única defensa: puede bloquear patrones conocidos, pero las variantes del ataque dependen de la aplicación y de las extensiones instaladas.</p>
<p>Y hay un límite más incómodo: si tu aplicación corre en PHP 8.1 o anterior, no hay versión oficial corregida. Los parches mínimos que algunos proveedores empaquetan ganan tiempo, pero la solución real es migrar a una rama con soporte. Si estás en 8.2, ese mismo problema llegará el 31 de diciembre de 2026, así que este es buen momento para planear el salto a 8.4 o 8.5.</p>`,
    },
  ],
  faqs: [
    {
      q: '¿WordPress o Laravel están afectados?',
      a: 'El fallo está en el intérprete de PHP, no en el framework. Cualquier aplicación que corra sobre una versión vulnerable está expuesta, sin importar si es WordPress, Laravel, Symfony o código propio. Actualizar el framework no corrige nada: hay que actualizar PHP.',
    },
    {
      q: '¿Necesita el atacante una cuenta en mi sitio?',
      a: 'No. Ambos avisos indican que no se requieren privilegios ni interacción del usuario. La complejidad del ataque es alta, pero basta con poder enviar peticiones al servidor.',
    },
    {
      q: 'Uso Nginx con PHP-FPM, ¿puedo esperar?',
      a: 'No conviene. FPM es menos expuesto que mod_php para el primer fallo, pero el segundo fallo se validó también en FPM a través del progreso de subida de sesiones. Actualiza y, mientras tanto, aplica las mitigaciones.',
    },
    {
      q: '¿Cómo sé si alguien ya explotó mi servidor?',
      a: 'No hay una señal única. Revisa procesos y archivos nuevos, conexiones salientes inusuales, cambios en los archivos de la aplicación y cuentas creadas recientemente. Si encuentras algo, asume que las credenciales del servidor están comprometidas y cámbialas.',
    },
    {
      q: '¿Qué tiene que ver esto con el fallo de Brotli?',
      a: 'Es un fallo distinto en una biblioteca de compresión que usan muchos proyectos. En PHP solo afecta a las compilaciones de Windows cuando la extensión cURL tiene activada la descompresión automática, que viene desactivada por defecto. El 26 de octubre salieron compilaciones de Windows con la biblioteca corregida.',
    },
  ],
  refs: [
    { label: 'PHP — Noticias y anuncios de 2026', url: 'https://www.php.net/archive/2026.php' },
    { label: 'GHSA-w8hw-w9fx-j79w — RCE via OOM corruption (CVE-2026-109618)', url: 'https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w' },
    { label: 'GHSA-6wmf-4rv5-p3rp — RCE via stale global state (CVE-2026-109619)', url: 'https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp' },
    { label: 'PHP — Versiones con soporte', url: 'https://www.php.net/supported-versions.php' },
    { label: 'PHP Manual — Session Upload Progress', url: 'https://www.php.net/manual/en/session.upload-progress.php' },
  ],
  closing: '¿Tienes un sitio en PHP y no sabes si está expuesto? Hablemos.',
});

const NODE_CONTENT = buildArticle({
  prefix: 'node',
  intro:
    'El 21 de octubre de 2026 Node.js publicó un boletín de seguridad con diez vulnerabilidades, cuatro de ellas de severidad alta. La más llamativa está en el descompresor Brotli que trae Node: datos maliciosos pueden escribir fuera de la memoria reservada y, en el peor caso, ejecutar código en el servidor. Las otras tres altas permiten que una conexión TLS o una consulta DNS terminen en un servidor distinto al que tu código validó. Todas las líneas con soporte (22, 24 y 26) están afectadas. Este artículo explica cada fallo, cómo saber cuáles te tocan y cómo actualizar sin romper el despliegue.',
  takeaways: [
    'Las versiones corregidas son Node.js 22.23.4, 24.22.1 y 26.12.1. Las líneas sin soporte, como Node 20, también están afectadas y no recibirán parche.',
    'Si tu aplicación descomprime datos que no controlas con node:zlib, el fallo de Brotli (CVE-2026-111497) es tu prioridad número uno.',
    'Tres fallos de TLS y DNS se aprovechan de direcciones IP y dominios escritos de formas poco comunes: validar texto no es lo mismo que validar el destino real.',
    'Después de actualizar hay que reconstruir los snapshots y los ejecutables (SEA): si no, siguen generando los mismos UUID "aleatorios".',
  ],
  sections: [
    {
      id: 'node-que-paso',
      title: 'Qué publicó Node.js',
      html: `<p>Node.js agrupa sus correcciones de seguridad en boletines programados. El de octubre de 2026 corrige diez vulnerabilidades en el propio Node y además actualiza varias dependencias incluidas: c-ares (resolución DNS), el almacén de certificados raíz (por el compromiso de una autoridad intermedia de eMudhra), OpenSSL en las líneas 22 y 24, SQLite en la 22 y Undici, el cliente HTTP de Node, en todas las líneas.</p>
${articleTable(
  ['CVE', 'Severidad', 'Qué afecta', 'Líneas'],
  [
    ['CVE-2026-111497', 'Alta', 'Descompresión Brotli en node:zlib', '22, 24, 26'],
    ['CVE-2026-105482', 'Alta', 'dns.resolve*() corta el dominio en un byte NUL', '22, 24, 26'],
    ['CVE-2026-105483', 'Alta', 'TLS no reconoce IPs escritas con dígitos de ancho completo', '24, 26'],
    ['CVE-2026-106069', 'Alta', 'TLS valida una IP distinta cuando lleva ceros a la izquierda', '22, 24, 26'],
    ['CVE-2026-105481', 'Media', 'Conexiones keep-alive aceptan respuestas no solicitadas', '22, 24, 26'],
    ['CVE-2026-106072', 'Media', 'IPv4 en formatos no canónicos y certificados con nombre DNS', '22, 24, 26'],
    ['CVE-2026-106074', 'Media', 'UUID y números aleatorios repetidos en snapshots y SEA', '22, 24, 26'],
    ['CVE-2026-106070', 'Baja', 'zlib.ZipFile devuelve bytes falsos tras una validación fallida', '26'],
    ['CVE-2026-106071', 'Baja', 'Comodines del modelo de permisos que cubren rutas de más', '26'],
    ['CVE-2026-106073', 'Baja', 'fs.realpathSync() sin chequeo del modelo de permisos', '22, 24, 26'],
  ]
)}
<p>Varios de estos fallos son correcciones incompletas o regresiones de vulnerabilidades corregidas en boletines anteriores de 2026. Es una señal de que la validación de nombres de host e IPs es un terreno difícil incluso para el equipo de Node, y una razón más para no implementarla a mano en tu aplicación.</p>`,
    },
    {
      id: 'node-altas',
      title: 'Los cuatro fallos de severidad alta',
      html: '<p>Los cuatro tienen algo en común: una diferencia entre lo que el código cree que está procesando y lo que realmente procesa. En Brotli, la diferencia está entre el tamaño esperado y el real. En los demás, entre el texto de un dominio o una IP y el destino al que se termina conectando.</p>',
      subsections: [
        {
          id: 'node-brotli',
          title: 'Brotli: escribir fuera de la memoria reservada',
          html: '<p>El descompresor Brotli que viene con Node puede escribir más allá de un búfer de ocho bytes cuando recibe datos malformados. Las consecuencias van desde que el proceso se caiga hasta que revele memoria o, en el peor caso, se ejecute código. Estás expuesto si tu servidor descomprime contenido que no controlas: cuerpos de peticiones con <code>Content-Encoding: br</code>, archivos que suben los usuarios o respuestas de servicios externos. El mismo fallo de la biblioteca Brotli afectó a otros proyectos esa semana; PHP, por ejemplo, publicó compilaciones de Windows corregidas.</p>',
        },
        {
          id: 'node-dns',
          title: 'DNS: el dominio que validaste no es el que se resuelve',
          html: `<p>Las funciones <code>dns.resolve*()</code> y <code>dns.reverse()</code> cortaban el nombre en el primer byte NUL. Un atacante puede enviar un dominio que tu código valida como permitido porque termina en tu dominio de confianza, pero que DNS resuelve como otro:</p>
${flowDiagram(['Tu código valida\nel dominio', 'Termina en\n.trusted.example', 'dns.resolve()\ncorta en el NUL', 'Resuelve\nattacker.example'], 'Validar el texto no garantiza el destino real')}`,
        },
        {
          id: 'node-tls',
          title: 'TLS: IPs escritas de formas raras',
          html: '<p>Una misma dirección IP se puede escribir de muchas maneras: <code>127.0.0.1</code>, <code>0127.0.0.1</code>, <code>0x7f.0.0.1</code> o incluso con dígitos de ancho completo. Algunas reglas interpretan <code>0127</code> como octal y algunos sistemas operativos, como decimal. El resultado es que Node verificaba el certificado contra una IP distinta de aquella a la que se conectaba, o aceptaba un certificado emitido para un nombre DNS como si fuera para una IP. Afecta sobre todo a quien se conecta a servicios por IP o depende de la verificación de identidad del certificado.</p>',
        },
      ],
    },
    {
      id: 'node-prioriza',
      title: 'Prioriza según cómo usas Node: qué corrige el boletín y qué no',
      html: `<p>Antes de priorizar conviene tener claro el alcance. El boletín corrige el entorno de ejecución; lo que tu aplicación hace con los datos sigue siendo responsabilidad tuya:</p>
${compareDiagram(
  { title: 'Lo corrige el boletín', points: ['Brotli en node:zlib', 'Validación TLS y DNS', 'Snapshots y SEA', 'Modelo de permisos'] },
  { title: 'Sigue siendo tuyo', points: ['Dependencias de npm', 'Límites de tamaño', 'Validar entradas', 'Tokens seguros'] },
  'Actualizar Node corrige el entorno, no tu aplicación'
)}
<p>Actualizar es lo correcto en todos los casos, pero si administras varios servicios, el orden importa. Esta tabla ayuda a decidir qué actualizar primero:</p>
${articleTable(
  ['Si tu aplicación…', 'Fallos que te afectan', 'Urgencia'],
  [
    ['Descomprime datos que envían usuarios o terceros', 'Brotli (CVE-2026-111497)', 'Inmediata'],
    ['Se conecta por TLS a servicios usando su IP', 'CVE-2026-105483, -106069, -106072', 'Alta'],
    ['Valida dominios y luego los resuelve con dns.resolve*()', 'CVE-2026-105482', 'Alta'],
    ['Se distribuye como ejecutable (SEA) o usa snapshots', 'CVE-2026-106074', 'Media, y exige reconstruir'],
    ['Ejecuta código ajeno con --permission', 'CVE-2026-106071, -106073', 'Media'],
    ['Es una API común detrás de un proxy', 'Undici, OpenSSL, keep-alive', 'Actualiza en tu próximo despliegue'],
  ]
)}`,
    },
    {
      id: 'node-actualizar',
      title: 'Cómo actualizar sin romper nada',
      html: `<p>Dentro de una misma línea, las versiones de seguridad no cambian la API, así que pasar de 22.x a 22.23.4 rara vez rompe algo. Lo que sí rompe despliegues es actualizar en un lugar y olvidar otro: la máquina local, el CI, la imagen de Docker y el servidor pueden tener versiones distintas.</p>`,
      subsections: [
        {
          id: 'node-verificar',
          title: 'Verificar la versión al arrancar',
          html: `<p>Fija la versión en un solo lugar y haz que la aplicación se niegue a arrancar con una versión vulnerable. Así, si algún entorno se quedó atrás, lo descubres en el despliegue y no en un incidente:</p>
${articleCode(`
// verificar-node.js: falla el arranque si la versión de Node es vulnerable
const corregidas = { 22: "22.23.4", 24: "24.22.1", 26: "26.12.1" };
const [mayor] = process.versions.node.split(".").map(Number);
const minima = corregidas[mayor];

const comparar = (a, b) => {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
};

if (!minima) {
  throw new Error("Node " + process.versions.node + " no tiene soporte: migra a 22, 24 o 26");
}
if (comparar(process.versions.node, minima) < 0) {
  throw new Error("Node " + process.versions.node + " es vulnerable: actualiza a " + minima);
}

// Mientras actualizas: rechaza dominios con byte NUL antes de resolverlos (CVE-2026-105482)
export const validarHost = (host) => {
  if (host.includes("\\0")) throw new Error("Nombre de host inválido");
  return host;
};`)}`,
        },
        {
          id: 'node-docker',
          title: 'Docker, CI y el repositorio',
          html: `<p>En Docker, usa una etiqueta con la línea (<code>node:22-alpine</code>) y reconstruye con <code>docker build --pull</code> para tomar la imagen corregida. En el repositorio, deja la versión en <code>.nvmrc</code> y en el campo <code>engines</code> de <code>package.json</code>, y usa la misma en GitHub Actions con <code>actions/setup-node</code>.</p>`,
        },
        {
          id: 'node-otros',
          title: 'Snapshots, permisos y los fallos medios',
          html: `<p>El fallo de los snapshots (CVE-2026-106074) es silencioso y por eso peligroso. Node guardaba en el snapshot la reserva de aleatoriedad que usan <code>crypto.randomUUID()</code>, <code>randomUUIDv7()</code> y <code>randomInt()</code>. Todos los procesos que arrancaban desde ese snapshot generaban la misma secuencia de valores. Si usabas esos UUID como identificadores de sesión o como tokens, eran predecibles.</p>
<p>Los fallos del modelo de permisos importan si ejecutas código de terceros con <code>--permission</code>: una regla con comodín como <code>/etc/passwd.*</code> también daba acceso a <code>/etc/passwd</code>, y <code>fs.realpathSync()</code> permitía comprobar si existían rutas fuera de las carpetas autorizadas. El de las conexiones keep-alive permitía que una respuesta enviada antes de la petición se asociara a ella, lo que en ciertos escenarios con proxies puede mezclar respuestas.</p>
<p>Si tu proyecto genera snapshots (<code>--build-snapshot</code>) o ejecutables SEA, reconstrúyelos después de actualizar y evita llamar a <code>crypto.randomUUID()</code> o <code>randomInt()</code> mientras se construye el snapshot.</p>`,
        },
      ],
    },
    {
      id: 'node-errores',
      title: 'Errores comunes al actualizar Node',
      html: `<ul>
  <li><strong>Actualizar solo la máquina local.</strong> Lo que importa es la versión que corre en producción. Verifícala en el arranque o en un endpoint interno de salud.</li>
  <li><strong>Seguir en Node 20 o anterior.</strong> Node 20 llegó al fin de su soporte el 30 de abril de 2026 y está afectado por fallos que ya no se corregirán en esa línea.</li>
  <li><strong>Reconstruir la imagen con caché.</strong> Sin <code>--pull</code>, Docker puede reutilizar la imagen base vieja aunque la etiqueta sea la misma.</li>
  <li><strong>Olvidar los snapshots y SEA.</strong> Actualizar Node no regenera los artefactos que ya construiste.</li>
  <li><strong>Validar dominios con expresiones regulares propias.</strong> Los formatos alternativos de IP y los caracteres especiales rompen casi cualquier validación casera.</li>
  <li><strong>Confundir este boletín con <code>npm audit</code>.</strong> npm revisa tus paquetes, no el binario de Node que los ejecuta.</li>
</ul>`,
    },
    {
      id: 'node-limites',
      title: 'Límites: lo que actualizar Node no resuelve',
      html: `<p>Actualizar Node corrige el entorno de ejecución, no tu aplicación. Si tu código acepta archivos comprimidos sin límite de tamaño, si confía en la IP que escribe el usuario o si genera tokens con <code>Math.random()</code>, sigue teniendo un problema aunque uses la última versión. Lo mismo pasa con las dependencias: Express, Fastify, Next.js o cualquier paquete de npm tienen su propio ciclo de seguridad y se actualizan aparte.</p>
<p>Tampoco conviene reaccionar cambiando de línea de Node con prisa. Saltar de la 22 a la 26 en medio de un incidente añade cambios de API y riesgo innecesario. La respuesta correcta es la versión corregida de tu misma línea hoy, y la migración planeada de línea después, con pruebas.</p>`,
    },
  ],
  faqs: [
    {
      q: '¿Next.js, Express o NestJS están afectados?',
      a: 'Los fallos están en Node, que es donde corren esos frameworks. Si tu aplicación usa una versión de Node vulnerable, está expuesta sin importar el framework. Actualiza Node y, por separado, mantén al día las dependencias del framework.',
    },
    {
      q: '¿Los servicios como Vercel o Railway actualizan Node por mí?',
      a: 'Depende de cómo configures la versión. Si fijas una versión exacta, la plataforma usará esa aunque sea vulnerable. Si usas solo la línea (por ejemplo 22.x), normalmente tomará la última en el próximo despliegue: vuelve a desplegar y verifica la versión en los registros.',
    },
    {
      q: 'Uso Node 20, ¿qué hago?',
      a: 'Node 20 ya no recibe parches de la comunidad desde el 30 de abril de 2026. Migra a Node 22 o 24, que tienen soporte de largo plazo, y prueba la aplicación antes de desplegar. Algunas empresas venden soporte extendido, pero es una solución temporal.',
    },
    {
      q: '¿Cómo me entero de los próximos boletines?',
      a: 'Node.js publica los boletines en su blog de vulnerabilidades y los anuncia con anticipación en la lista nodejs-sec. Suscribirse a esa lista es la forma más simple de no enterarse tarde.',
    },
    {
      q: '¿El fallo de Brotli afecta si solo envío respuestas comprimidas?',
      a: 'El fallo está en la descompresión. Comprimir respuestas no te expone por sí solo. El riesgo está en descomprimir datos que vienen de fuera: peticiones con cuerpo comprimido, archivos subidos o respuestas de servicios que no controlas.',
    },
  ],
  refs: [
    { label: 'Node.js — October 2026 Security Releases', url: 'https://nodejs.org/en/blog/vulnerability/october-2026-security-releases' },
    { label: 'Node.js — Versiones y calendario de soporte', url: 'https://nodejs.org/en/about/previous-releases' },
    { label: 'Node.js — Documentación de zlib', url: 'https://nodejs.org/api/zlib.html' },
    { label: 'Node.js — Modelo de permisos', url: 'https://nodejs.org/api/permissions.html' },
    { label: 'Lista de anuncios nodejs-sec', url: 'https://groups.google.com/g/nodejs-sec' },
  ],
  closing: '¿Necesitas revisar y actualizar tus servicios en Node.js? Hablemos.',
});

const RAILWAY_CONTENT = buildArticle({
  prefix: 'rw',
  intro:
    'Entre el 20 y el 22 de octubre de 2026, Railway, una plataforma muy usada para desplegar aplicaciones, bases de datos y APIs, sufrió un incidente de seguridad. Un atacante entró por su infraestructura de compilación, obtuvo credenciales de su entorno de integración continua y consultó variables de entorno cifradas de los clientes. Una parte de ellas la logró descifrar. Railway pidió a todos sus usuarios registrados antes del 21 de octubre que rotaran sus secretos. Este artículo resume lo que se sabe según el informe preliminar de la empresa, qué deberías hacer si usas Railway y qué lecciones aplican a cualquier plataforma donde guardes secretos.',
  takeaways: [
    'Si creaste tu cuenta de Railway antes del 21 de octubre de 2026, Railway recomienda rotar todos los secretos guardados allí, aunque no te hayan notificado.',
    'Según Railway, hasta el 1,85 % de los espacios de trabajo, unos 100.000, tuvo variables de entorno posiblemente comprometidas.',
    'El atacante buscaba sobre todo claves de proveedores de IA; revisa el consumo de tus claves de OpenAI, Anthropic u OpenRouter.',
    'Una variable de entorno es tan segura como la plataforma que la guarda: usa claves con el mínimo permiso posible y límites de gasto.',
  ],
  sections: [
    {
      id: 'rw-que-paso',
      title: 'Qué pasó',
      html: `<p>Railway reportó acceso no autorizado a sistemas internos. Según su informe preliminar, el ataque empezó el 20 de octubre a las 13:58 UTC con un intento de escalar privilegios en la infraestructura de compilación, la parte que construye el código de los clientes antes de desplegarlo. El equipo detectó latencia anormal, detuvo las compilaciones y aplicó mitigaciones, pero el atacante encontró otras rutas. En la madrugada del 21 obtuvo credenciales del entorno de CI, descifró artefactos con más accesos y ejecutó una consulta sobre las variables de entorno cifradas de los clientes. Con las credenciales comprometidas descifró una parte de ellas.</p>
<p>Railway estima que, como máximo, el 1,85 % de los espacios de trabajo tuvo alguna variable posiblemente expuesta, alrededor de 100.000. Para ponerlo en escala, BleepingComputer cita unos 4,8 millones de usuarios en la plataforma. Según la empresa, el atacante apuntó sobre todo a proyectos con muchas variables y con muchas claves de proveedores de IA, y cree que buscaba claves de esos proveedores. Las cuentas individuales no fueron usadas para iniciar sesión y los servicios que ya estaban desplegados siguieron funcionando. El acceso al código fuente todavía no está descartado: se confirmará en el informe final.</p>
${articleTable(
  ['Afectado', 'Qué se sabe', 'Estado'],
  [
    ['Infraestructura de compilación y CI', 'Fue la vía de entrada y de escalada', 'Reconstruida desde código validado'],
    ['Variables de entorno', 'Consultadas cifradas; un subconjunto descifrado', 'Railway pide rotarlas'],
    ['Cuentas de usuario', 'Sin inicios de sesión del atacante', 'Sesiones y tokens invalidados'],
    ['Servicios desplegados', 'Siguieron en línea', 'Sin cambios'],
    ['Código fuente', 'No descartado', 'Pendiente del informe final'],
  ]
)}`,
    },
    {
      id: 'rw-cronologia',
      title: 'Cómo avanzó el ataque',
      html: `<p>El recorrido muestra un patrón clásico: el atacante no rompió el cifrado, sino que consiguió las llaves que permiten descifrar.</p>
${flowDiagram(['Escalada en la\ncompilación', 'Credenciales\nde CI', 'Consulta de\nvariables cifradas', 'Descifrado de\nuna parte', 'Revocación y\nreconstrucción'], 'Del sistema de compilación a los secretos de los clientes')}`,
      subsections: [
        {
          id: 'rw-entrada',
          title: 'La entrada: el sistema de compilación',
          html: '<p>Una plataforma de despliegue ejecuta código de miles de clientes para compilarlo. Ese es un riesgo inherente: el código de compilación es, por definición, código ajeno ejecutándose en tu infraestructura. Railway aceleró la migración a constructores de un solo cliente (single-tenant), que ya tenía planeada, para que una compilación no comparta máquina con otras.</p>',
        },
        {
          id: 'rw-escalada',
          title: 'La escalada: de CI a los secretos',
          html: '<p>Con credenciales del entorno de integración continua, el atacante descifró artefactos que contenían más accesos a APIs internas, y desde ahí consultó la base de datos de variables. Railway usa cifrado por sobres (envelope encryption): cada variable se cifra con una clave propia, protegida a su vez por otra clave. Eso limitó el daño a un subconjunto, pero también explica por qué todavía no puede decir con exactitud qué claves de cada proyecto se vieron.</p>',
        },
        {
          id: 'rw-respuesta',
          title: 'La respuesta: revocar primero, avisar después',
          html: '<p>Railway avisó primero a proveedores como GitHub, GitLab, Anthropic, OpenAI, OpenRouter y Stripe para que revocaran las claves afectadas, y solo después pidió a los usuarios que rotaran las suyas, para no alertar al atacante mientras seguía dentro. También invalidó todas las sesiones y tokens de acceso, rotó las credenciales de los buckets de almacenamiento y reconstruyó sus herramientas internas. Algunas revocaciones preventivas causaron errores 401 y 402 en aplicaciones que usaban esas claves. El 22 de octubre confirmó que el atacante ya no tenía acceso.</p>',
        },
      ],
    },
    {
      id: 'rw-leccion',
      title: 'La lección de fondo: secretos de larga duración',
      html: `<p>Este incidente no es exclusivo de Railway. Cualquier plataforma que guarde tus variables de entorno (Vercel, Render, Heroku, Fly.io o tu propio CI) es un lugar donde un atacante puede encontrar todas tus llaves juntas. Lo que cambia el impacto no es dónde guardas los secretos, sino qué pueden hacer si alguien los roba:</p>
${compareDiagram(
  { title: 'Secreto de larga duración', points: ['Vale meses o años', 'Permisos amplios', 'Sin límite de gasto', 'Rotarlo es manual'] },
  { title: 'Credencial acotada', points: ['Expira sola o se rota', 'Mínimo permiso', 'Límite de gasto', 'Una por entorno'] },
  'El mismo robo, con consecuencias muy distintas'
)}
<p>En la práctica: crea claves de IA separadas por proyecto y por entorno, con límite de gasto mensual; usa usuarios de base de datos con permisos solo sobre las tablas que necesita la aplicación; conecta las bases de datos por red privada y no por internet; y, donde el proveedor lo permita, usa identidades temporales (OIDC) en lugar de claves fijas. Así, un robo masivo de secretos se convierte en una molestia acotada y no en una factura de miles de dólares.</p>`,
    },
    {
      id: 'rw-que-hacer',
      title: 'Qué hacer si usas Railway',
      html: '<p>Las recomendaciones oficiales están pensadas para todos los usuarios, no solo para los notificados. El trabajo tiene tres partes: saber qué secretos tienes, cambiarlos en un orden que no tumbe tu aplicación y revisar si alguien ya los usó.</p>',
      subsections: [
        {
          id: 'rw-inventario',
          title: 'Hacer el inventario de secretos',
          html: `<p>Antes de rotar nada, haz un inventario: no puedes cambiar un secreto que no sabes que existe. Este script, ejecutado con las variables de tu servicio, muestra solo los nombres de las que parecen secretos, sin imprimir sus valores:</p>
${articleCode(`
// listar-secretos.js: muestra los NOMBRES de las variables sensibles, nunca sus valores
// Uso: railway run node listar-secretos.js
const patron = /(KEY|TOKEN|SECRET|PASSWORD|PASS|PRIVATE|CREDENTIAL|DATABASE_URL|DSN)/i;

const nombres = Object.keys(process.env)
  .filter((nombre) => patron.test(nombre))
  .sort();

console.log(nombres.length + " variables para rotar:");
for (const nombre of nombres) console.log(" - " + nombre);`)}
<p>El patrón es un punto de partida, no una lista completa: revisa a mano las variables restantes, porque un secreto puede tener cualquier nombre.</p>`,
        },
        {
          id: 'rw-rotar',
          title: 'Rotar en el orden correcto',
          html: `<p>Empieza por lo que más daño causa si se usa: dinero, datos y acceso al código.</p>
${articleTable(
  ['Paso', 'Qué hacer', 'Prioridad'],
  [
    ['1', 'Rotar claves de IA, pagos (Stripe) y nube; revisar su consumo reciente', 'Hoy'],
    ['2', 'Cambiar contraseñas de bases de datos y quitar su acceso público', 'Hoy'],
    ['3', 'Revisar el registro de auditoría de GitHub y las apps instaladas', 'Hoy'],
    ['4', 'Revisar el registro de auditoría del registro de contenedores (Docker Hub)', 'Esta semana'],
    ['5', 'Volver a desplegar el último commit y reconectar GitHub si hace falta', 'Esta semana'],
    ['6', 'Crear de nuevo los tokens de la CLI y de CI', 'Esta semana'],
  ]
)}
<p>Rotar significa crear la credencial nueva, actualizarla en Railway, desplegar, confirmar que la aplicación funciona y solo entonces revocar la vieja. Si revocas primero, tumbas tu propia aplicación.</p>`,
        },
        {
          id: 'rw-gasto',
          title: 'Revisar si alguien ya usó tus claves',
          html: '<p>Rotar evita usos futuros, pero no dice qué pasó antes. Revisa el consumo de los últimos días en el panel de cada proveedor de IA, los pagos recientes en Stripe y los registros de acceso de tu base de datos. Si encuentras gasto fraudulento con claves de IA, Railway indica contactar primero al proveedor de IA y luego a su soporte con fechas y pruebas, y aclara que no puede reembolsar ese gasto. Aprovecha para activar alertas y límites de gasto, que habrían avisado desde el primer día.</p>',
        },
      ],
    },
    {
      id: 'rw-errores',
      title: 'Errores comunes después de un incidente así',
      html: `<ul>
  <li><strong>No rotar porque "no me notificaron".</strong> Railway recomienda rotar a todos los usuarios anteriores al 21 de octubre, no solo a los notificados.</li>
  <li><strong>Revocar antes de reemplazar.</strong> La aplicación se cae. Crea la nueva credencial, despliega y luego revoca la vieja.</li>
  <li><strong>Rotar solo las claves obvias.</strong> La URL de la base de datos, el secreto de las cookies de sesión y los tokens de webhooks también son secretos.</li>
  <li><strong>Reutilizar la misma clave en varios proyectos.</strong> Al rotarla rompes todos a la vez, y si se filtra desde uno, compromete a todos.</li>
  <li><strong>No revisar el consumo.</strong> Una clave de IA robada se nota primero en la factura. Revisa el uso de los últimos días y activa alertas de gasto.</li>
  <li><strong>Dejar la base de datos con acceso público.</strong> Una contraseña filtrada con un puerto abierto es acceso directo a los datos.</li>
</ul>`,
    },
    {
      id: 'rw-limites',
      title: 'Límites: lo que todavía no se sabe',
      html: `<p>Este artículo se basa en el informe preliminar de Railway y en su registro de cambios. La investigación forense sigue abierta con expertos externos, y la empresa no ha publicado la causa raíz completa ni ha confirmado si el atacante accedió al código fuente de los clientes. Algunas cifras pueden ajustarse en el informe final, y el propio informe preliminar tiene pequeñas diferencias de horario entre secciones.</p>
<p>Tampoco es una razón automática para abandonar la plataforma. Migrar en medio de un incidente añade riesgo y no elimina el problema de fondo: cualquier proveedor puede sufrir un ataque. Lo que sí conviene evaluar es cómo comunicó y contuvo el incidente, y si tus secretos están diseñados para que su robo cause el menor daño posible, estés en Railway o en cualquier otro lugar.</p>`,
    },
  ],
  faqs: [
    {
      q: '¿Mi aplicación en Railway dejó de funcionar?',
      a: 'Según Railway, los servicios ya desplegados siguieron en línea. Lo que se detuvo temporalmente fueron las compilaciones, los despliegues nuevos y partes del panel. Si tu aplicación falló, revisa si un proveedor revocó una de tus claves de forma preventiva, porque eso causó errores 401 y 402.',
    },
    {
      q: '¿Cómo sé si mi espacio de trabajo está entre los afectados?',
      a: 'Railway está contactando directamente a los clientes confirmados y a los que considera de alto riesgo. Aun así, recomienda que todos los usuarios registrados antes del 21 de octubre roten sus secretos, porque por el cifrado por sobres no puede precisar todavía qué claves de cada proyecto se vieron.',
    },
    {
      q: '¿Tengo que cambiar la contraseña de mi cuenta de Railway?',
      a: 'Railway indica que las cuentas individuales no fueron usadas para iniciar sesión e invalidó todas las sesiones y tokens. Lo prioritario son los secretos guardados en tus servicios. Si usas la misma contraseña en otros sitios, cámbiala igualmente, y activa la autenticación en dos pasos.',
    },
    {
      q: '¿Qué pasa si alguien usó mis claves de IA y generó gastos?',
      a: 'Railway recomienda contactar primero al proveedor de IA y después enviar a su soporte una solicitud con fechas y pruebas del consumo. Aclara que no puede reembolsar el gasto hecho con claves comprometidas.',
    },
    {
      q: '¿Las variables de entorno siguen siendo una buena práctica?',
      a: 'Sí: son mucho mejores que escribir secretos en el código. Pero no bastan solas. Combínalas con claves de mínimo permiso, límites de gasto, una clave por entorno y, cuando sea posible, credenciales temporales que expiren solas.',
    },
  ],
  refs: [
    { label: 'Railway — October 21 security incident (changelog)', url: 'https://railway.com/changelog/2026-10-23-october-21-security-incident' },
    { label: 'Railway — Preliminary report: October security incident', url: 'https://blog.railway.com/p/preliminary-report-october-security-incident' },
    { label: 'BleepingComputer — Railway warns devs to rotate secrets after potential breach', url: 'https://www.bleepingcomputer.com/news/security/railway-warns-devs-to-rotate-secrets-after-potential-breach/' },
    { label: 'OWASP — Secrets Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html' },
    { label: 'GitHub Docs — Revisar el registro de auditoría de una organización', url: 'https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization' },
  ],
  closing: '¿Quieres revisar cómo guardas los secretos de tus aplicaciones? Hablemos.',
});

export const SECURITY_WRITING_ARTICLES: WritingArticle[] = [
  {
    id: 'art-vulnerabilidades-php-octubre-2026',
    slug: 'vulnerabilidades-criticas-php-octubre-2026',
    date: 'OCTUBRE 2026',
    tag: 'SECURITY',
    title: 'Vulnerabilidades Críticas en PHP (Octubre 2026): Qué Pasó y Cómo Proteger tu Servidor',
    metaDescription:
      'CVE-2026-109618 y CVE-2026-109619: dos fallos críticos de PHP que permiten ejecutar código sin login. Versiones corregidas, quién está expuesto y mitigaciones.',
    excerpt:
      'Dos fallos críticos en PHP permiten ejecutar código en el servidor sin iniciar sesión. Qué versiones están corregidas, por qué mod_php es el más expuesto y qué hacer hoy.',
    readTime: readTimeOf(PHP_CONTENT),
    contentHtml: PHP_CONTENT,
  },
  {
    id: 'art-vulnerabilidades-nodejs-octubre-2026',
    slug: 'vulnerabilidades-nodejs-octubre-2026',
    date: 'OCTUBRE 2026',
    tag: 'SECURITY',
    title: 'Node.js: las Vulnerabilidades de Octubre 2026 y Cómo Actualizar sin Romper Nada',
    metaDescription:
      'Boletín de seguridad de Node.js de octubre de 2026: el fallo de Brotli, los fallos de TLS y DNS, a quién afectan y cómo actualizar a 22.23.4, 24.22.1 o 26.12.1.',
    excerpt:
      'Diez vulnerabilidades, cuatro de severidad alta: un descompresor que escribe donde no debe y validaciones de TLS y DNS que se engañan. Qué te afecta y cómo actualizar.',
    readTime: readTimeOf(NODE_CONTENT),
    contentHtml: NODE_CONTENT,
  },
  {
    id: 'art-incidente-railway-octubre-2026',
    slug: 'incidente-seguridad-railway-octubre-2026',
    date: 'OCTUBRE 2026',
    tag: 'SECURITY',
    title: 'El Incidente de Seguridad de Railway (Octubre 2026): Qué Pasó y Cómo Proteger tus Secretos',
    metaDescription:
      'Un atacante descifró variables de entorno de clientes de Railway. Qué se sabe, qué hacer si usas Railway y cómo limitar el daño si tus secretos se filtran.',
    excerpt:
      'Un atacante entró por el sistema de compilación de Railway y descifró variables de entorno de clientes. Qué se sabe, qué rotar primero y la lección para cualquier plataforma.',
    readTime: readTimeOf(RAILWAY_CONTENT),
    contentHtml: RAILWAY_CONTENT,
  },
];
