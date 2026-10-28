import type { WritingArticle } from '../types';
import { articleCode, articleTable, buildArticle, compareDiagram, flowDiagram, readTimeOf } from './articleTemplate';

/* Artículos 16-25 del blog. Cada artículo define su contenido en una constante
   para calcular readTime a partir de él (misma estructura que el artículo modelo). */

const N8N_CONTENT = buildArticle({
  prefix: 'n8n',
  intro:
    'Las plataformas de automatización SaaS cobran por tarea o por operación ejecutada, y cuando un proceso pasa de cientos a decenas de miles de ejecuciones al mes, la factura crece más rápido que el valor que aporta. n8n ofrece otro modelo: un editor visual de flujos que puedes alojar en tu propio servidor, con la opción de escribir código cuando los nodos visuales no alcanzan. Lo he usado para procesos como la actualización diaria de tasas de cambio, y la lección principal es que la pregunta útil no es "¿cuánto cuesta n8n?", sino "¿quién se hace cargo del servidor cuando algo falla a las tres de la mañana?". Este artículo cubre cuándo conviene, cómo desplegarlo bien y cómo evitar que un flujo falle en silencio.',
  takeaways: [
    'n8n combina nodos visuales con nodos de código en JavaScript o Python para la lógica que no cabe en un formulario.',
    'Autoalojado, el costo depende del servidor y no del número de ejecuciones, pero la operación (actualizaciones, copias de seguridad, HTTPS) pasa a ser tuya.',
    'Para uso serio, usa PostgreSQL en lugar de SQLite y define una clave de cifrado propia para las credenciales.',
    'Un workflow de errores dedicado y pasos idempotentes evitan que una automatización crítica falle o duplique datos sin que nadie se entere.',
    'Cuando el volumen crece, el modo de colas con Redis y workers reparte las ejecuciones sin cambiar los flujos.',
  ],
  sections: [
    {
      id: 'n8n-problema',
      title: 'El costo oculto de automatizar por tarea',
      html: `<p>Las herramientas SaaS de automatización son excelentes para empezar: conectas dos aplicaciones en minutos y no administras nada. El problema aparece con el éxito. Un flujo que sincroniza pedidos, enriquece contactos o procesa archivos puede ejecutarse miles de veces al día, y cada paso cuenta para el límite del plan. A eso se suma que los datos atraviesan la infraestructura de un tercero, algo que no siempre es aceptable con información de clientes o datos financieros.</p>
<p>n8n resuelve ambas cosas con un modelo distinto: el motor de ejecución corre donde tú decides, el número de ejecuciones solo está limitado por tu hardware y puedes mezclar nodos visuales con código. A cambio, asumes la responsabilidad de operar un servicio más. Esa es la decisión real, y conviene tomarla con los números y el equipo a la vista.</p>`,
    },
    {
      id: 'n8n-cuando',
      title: 'Cuándo elegir n8n autoalojado',
      html: `<p>La regla que aplico es simple: n8n autoalojado encaja cuando se cumplen al menos dos de estas condiciones: volumen alto de ejecuciones, datos que no deben salir de tu infraestructura, lógica con transformaciones que serían incómodas en una herramienta puramente visual, o integraciones con sistemas internos que no están expuestos a internet. Si el equipo no tiene a nadie que mantenga un servidor y el volumen es bajo, una plataforma SaaS sigue siendo la opción más simple, y n8n Cloud es un punto intermedio.</p>
${articleTable(
  ['Criterio', 'n8n autoalojado', 'n8n Cloud', 'SaaS por tarea'],
  [
    ['Modelo de costo', 'Servidor y tiempo de operación', 'Suscripción según ejecuciones', 'Suscripción según tareas u operaciones'],
    ['Dónde viven los datos', 'En tu infraestructura', 'En la nube del proveedor', 'En la nube del proveedor'],
    ['Operación y actualizaciones', 'Tu responsabilidad', 'Del proveedor', 'Del proveedor'],
    ['Acceso a sistemas internos', 'Directo, en tu red', 'Requiere exponerlos', 'Requiere exponerlos'],
    ['Lógica con código', 'JavaScript y Python', 'JavaScript y Python', 'Limitada según la plataforma'],
    ['Ideal para', 'Volumen alto o datos sensibles', 'Equipos sin operación propia', 'Flujos simples y bajo volumen'],
  ]
)}
<p>Revisa siempre la licencia y los planes vigentes en el sitio de n8n: la edición comunitaria se puede autoalojar, pero algunas funciones empresariales requieren licencia.</p>`,
    },
    {
      id: 'n8n-despliegue',
      title: 'Despliegue con Docker paso a paso',
      html: '<p>La forma más directa de autoalojar n8n es con su imagen oficial de Docker. Para una instalación que vaya a producción hay tres piezas que no conviene omitir.</p>',
      subsections: [
        {
          id: 'n8n-compose',
          title: 'Docker Compose con PostgreSQL',
          html: '<p>Por defecto n8n guarda flujos, credenciales e historial de ejecuciones en SQLite dentro de un volumen. Sirve para probar, pero con varios usuarios o mucho historial PostgreSQL es más robusto y más fácil de respaldar. Monta un volumen persistente en <code>/home/node/.n8n</code>, fija la versión de la imagen en lugar de usar <code>latest</code> y define la zona horaria, porque los disparadores programados dependen de ella.</p>',
        },
        {
          id: 'n8n-https',
          title: 'Proxy inverso, HTTPS y acceso',
          html: '<p>Coloca n8n detrás de un proxy inverso (Caddy, Nginx o Traefik) que termine HTTPS, y configura <code>WEBHOOK_URL</code> con la URL pública para que los webhooks se registren con la dirección correcta. El editor da acceso a todas las credenciales: protégelo con cuentas individuales, contraseñas robustas y, si es posible, restringe el acceso por VPN o lista de IP. Los webhooks pueden quedar públicos; el editor no debería.</p>',
        },
        {
          id: 'n8n-cifrado',
          title: 'Clave de cifrado y copias de seguridad',
          html: '<p>n8n cifra las credenciales guardadas con <code>N8N_ENCRYPTION_KEY</code>. Si no la defines, genera una y la guarda en el volumen; si pierdes ese volumen o cambias la clave, las credenciales dejan de poder descifrarse. Defínela tú, guárdala en un gestor de secretos y respalda la base de datos de forma periódica, probando la restauración al menos una vez.</p>',
        },
      ],
      after: articleCode(`
# docker-compose.yml — n8n con PostgreSQL
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: n8n
    volumes:
      - pg_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:1.x.y   # fija una versión concreta
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"             # solo accesible desde el proxy
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: n8n
      DB_POSTGRESDB_USER: n8n
      DB_POSTGRESDB_PASSWORD: \${POSTGRES_PASSWORD}
      N8N_ENCRYPTION_KEY: \${N8N_ENCRYPTION_KEY}
      N8N_HOST: n8n.midominio.com
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://n8n.midominio.com/
      GENERIC_TIMEZONE: America/Bogota
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  pg_data:
  n8n_data:`),
    },
    {
      id: 'n8n-errores-flujo',
      title: 'Manejo de fallos y reintentos',
      html: `<p>El peor fallo de una automatización no es el que se ve, sino el que nadie nota durante semanas. n8n ofrece dos mecanismos que conviene usar desde el primer flujo. El primero son los reintentos por nodo: en los nodos que llaman APIs externas, activa la opción de reintentar en caso de fallo con una espera entre intentos, porque muchos errores (límites de peticiones, cortes breves) se resuelven solos. El segundo es un workflow de errores: un flujo que empieza con el nodo <em>Error Trigger</em> y que se asigna en la configuración de cada workflow crítico. Recibe el nombre del flujo, el nodo que falló y el mensaje, y puede enviar una alerta por correo, Slack o Teams.</p>
${flowDiagram(['Disparador\n(cron/webhook)', 'Nodos con\nreintentos', 'Fallo\ndefinitivo', 'Error\nTrigger', 'Alerta al\nresponsable'], 'Ningún fallo debería pasar en silencio')}
<p>Los reintentos tienen una consecuencia: un paso puede ejecutarse más de una vez. Diseña los flujos para que repetirlos no duplique registros, usando identificadores externos, operaciones de tipo <em>upsert</em> o una comprobación previa de existencia. Un flujo idempotente se puede relanzar con tranquilidad desde el historial de ejecuciones.</p>`,
    },
    {
      id: 'n8n-codigo',
      title: 'Nodos de código con criterio',
      html: `<p>El nodo <em>Code</em> es muy útil para mapear datos, aplicar reglas de negocio o normalizar respuestas, pero si un flujo se convierte en un gran bloque de código pierdes la principal ventaja de n8n: que cualquiera del equipo pueda ver qué hace el proceso. Mantén cada nodo de código pequeño, con una responsabilidad clara, y documenta qué espera recibir y qué devuelve. Si un bloque supera unas decenas de líneas o necesita pruebas propias, probablemente debería vivir en un servicio aparte que n8n invoque por HTTP.</p>
${articleCode(`
// Nodo Code (modo "Run Once for All Items"): normaliza contactos
// Entrada: items con { email, nombre, pais }. Salida: items limpios y sin duplicados.
const vistos = new Set();
const salida = [];

for (const item of $input.all()) {
  const email = String(item.json.email ?? "").trim().toLowerCase();
  if (!email || vistos.has(email)) continue;   // descarta vacíos y repetidos
  vistos.add(email);

  salida.push({
    json: {
      email,
      nombre: String(item.json.nombre ?? "").trim(),
      pais: (item.json.pais ?? "CO").toUpperCase(),
    },
  });
}

return salida;`)}`,
    },
    {
      id: 'n8n-escalar',
      title: 'Escalar con el modo de colas',
      html: '<p>En el modo por defecto, una sola instancia de n8n recibe los disparadores y ejecuta los flujos. Cuando el volumen crece o hay flujos pesados, n8n admite un modo de colas (<code>EXECUTIONS_MODE=queue</code>): la instancia principal recibe webhooks y disparadores, publica las ejecuciones en Redis y uno o varios workers las procesan. Así puedes añadir workers según la carga sin tocar los flujos. Antes de llegar ahí, revisa lo básico: limpia el historial de ejecuciones antiguo con las opciones de poda, evita cargar archivos enormes en memoria y divide los flujos largos en subflujos. Muchas veces el cuello de botella es un flujo mal diseñado, no el servidor.</p>',
    },
    {
      id: 'n8n-errores',
      title: 'Errores comunes al autoalojar n8n',
      html: `<ul>
  <li><strong>No definir la clave de cifrado.</strong> Al migrar de servidor o recrear el contenedor sin el volumen original, todas las credenciales quedan inutilizables.</li>
  <li><strong>Usar la imagen <code>latest</code>.</strong> Una actualización automática puede cambiar el comportamiento de un nodo. Fija la versión, lee las notas de cambios y actualiza a propósito.</li>
  <li><strong>Exponer el editor a internet sin protección.</strong> Quien entra al editor puede leer y usar todas las integraciones configuradas.</li>
  <li><strong>Flujos sin workflow de errores.</strong> Un token expirado puede detener una sincronización durante días sin que nadie lo note.</li>
  <li><strong>Convertir n8n en el backend de la aplicación.</strong> Es un orquestador de procesos; la lógica central de negocio con pruebas y versionado estricto pertenece a un servicio propio.</li>
</ul>`,
    },
    {
      id: 'n8n-cuando-no',
      title: 'Cuándo NO conviene autoalojar n8n',
      html: '<p>Si el volumen es bajo, nadie en el equipo puede responder por la disponibilidad del servidor o los procesos son tan simples como "cuando llegue un formulario, crea una fila en una hoja de cálculo", el ahorro no compensa la operación: una plataforma SaaS o n8n Cloud son más razonables. Tampoco es la herramienta adecuada para procesamiento de datos masivo (millones de filas por ejecución), donde un pipeline de datos dedicado es más eficiente, ni para lógica que necesita latencias de milisegundos dentro de una petición de usuario. n8n brilla orquestando integraciones; no intentes que sea todo lo demás.</p>',
    },
  ],
  faqs: [
    {
      q: '¿n8n es gratis?',
      a: 'Tiene una edición comunitaria que puedes autoalojar y una versión en la nube de pago. Revisa la licencia y los planes actuales en su sitio, porque algunas funciones empresariales requieren licencia y las condiciones pueden cambiar.',
    },
    {
      q: '¿Puedo migrar mis automatizaciones de Zapier o Make a n8n?',
      a: 'No hay una conversión automática, pero la lógica suele trasladarse bien: el disparador se convierte en un nodo trigger o webhook y cada acción en un nodo de la integración correspondiente. Aprovecha la migración para añadir manejo de errores.',
    },
    {
      q: '¿Qué servidor necesito?',
      a: 'Para cargas moderadas basta un VPS pequeño con PostgreSQL. Si el volumen crece, el modo de colas con Redis y workers permite repartir las ejecuciones entre varias máquinas.',
    },
    {
      q: '¿Cómo versiono mis flujos?',
      a: 'Los flujos se pueden exportar como JSON y guardar en un repositorio. Las ediciones con licencia ofrecen integración con Git; en la comunitaria, una exportación periódica con la CLI de n8n es una alternativa práctica.',
    },
    {
      q: '¿Puedo usar n8n con modelos de IA?',
      a: 'Sí. Incluye nodos para llamar a modelos de lenguaje y construir agentes, además del nodo HTTP para cualquier API. Aplica los mismos criterios: límites de costo, validación de salidas y alertas ante fallos.',
    },
  ],
  refs: [
    { label: 'n8n Docs', url: 'https://docs.n8n.io' },
    { label: 'n8n — Docker installation', url: 'https://docs.n8n.io/hosting/installation/docker/' },
    { label: 'n8n — Queue mode', url: 'https://docs.n8n.io/hosting/scaling/queue-mode/' },
    { label: 'n8n — Error handling', url: 'https://docs.n8n.io/flow-logic/error-handling/' },
    { label: 'Docker Compose', url: 'https://docs.docker.com/compose/' },
  ],
  closing: '¿Quieres llevar tus automatizaciones a tu propio servidor? Puedo ayudarte.',
});

const GQL_CONTENT = buildArticle({
  prefix: 'gql',
  intro:
    'La discusión entre GraphQL y REST suele plantearse como una guerra, cuando en realidad son herramientas con fortalezas diferentes. REST aprovecha la infraestructura de HTTP de forma natural: URLs, verbos, códigos de estado y caché. GraphQL da al cliente control sobre la forma exacta de los datos a cambio de mover complejidad al servidor. La pregunta útil no es "¿cuál es más moderno?", sino "¿quién consume esta API y cómo cambian sus necesidades?". Este artículo compara ambos enfoques en lo que de verdad pesa en producción: caché, rendimiento, seguridad y costo de mantenimiento.',
  takeaways: [
    'GraphQL evita pedir datos de más o de menos: el cliente declara exactamente los campos que necesita, incluso de recursos relacionados.',
    'REST aprovecha la caché HTTP de forma nativa; en GraphQL la caché se traslada al cliente o a consultas persistidas.',
    'Los resolvers ingenuos generan el problema N+1; DataLoader agrupa las cargas y lo resuelve.',
    'Una API GraphQL pública necesita límites de profundidad y complejidad, y autorización en cada resolver.',
    'Si tu API REST funciona, no la reescribas por moda: GraphQL puede añadirse como capa cuando el caso lo justifique.',
  ],
  sections: [
    {
      id: 'gql-diferencia',
      title: 'La diferencia de fondo',
      html: `<p>En REST cada recurso tiene su URL y el servidor decide qué devuelve: <code>GET /pedidos/42</code> responde con la representación que el backend definió. Si la pantalla necesita además el cliente y los productos, el frontend hace varias peticiones o el backend crea un endpoint a medida. En GraphQL hay un único endpoint y un esquema tipado; el cliente escribe una consulta con los campos que quiere, atravesando relaciones, y recibe exactamente esa forma.</p>
<p>Esa flexibilidad brilla cuando varias interfaces (web, móvil, paneles internos) consumen los mismos datos con necesidades distintas, y cuando el frontend itera más rápido de lo que el backend puede crear endpoints. El costo es que el servidor ya no controla qué consultas recibirá, y eso afecta el rendimiento, la caché y la seguridad.</p>`,
    },
    {
      id: 'gql-comparativa',
      title: 'Comparativa práctica: REST frente a GraphQL',
      html: `<p>Más allá de la forma de las consultas, la diferencia está en qué partes del ecosistema HTTP aprovecha cada uno y dónde queda la complejidad.</p>
${articleTable(
  ['Criterio', 'REST', 'GraphQL'],
  [
    ['Forma de la respuesta', 'Definida por el servidor en cada endpoint', 'Definida por el cliente en cada consulta'],
    ['Caché', 'HTTP nativa: navegador, CDN y proxies', 'En el cliente o con consultas persistidas'],
    ['Contrato', 'OpenAPI, opcional', 'Esquema tipado obligatorio e introspectable'],
    ['Evolución', 'Versiones (/v2) ante cambios incompatibles', 'Campos nuevos y @deprecated en los viejos'],
    ['Errores', 'Códigos de estado HTTP', 'Lista errors en la respuesta, a menudo con 200'],
    ['Riesgo de rendimiento', 'Endpoints acotados y predecibles', 'Consultas costosas y N+1 si no se controla'],
  ]
)}`,
    },
    {
      id: 'gql-cache',
      title: 'Caché y rendimiento',
      html: '<p>La caché es donde la diferencia se nota más en producción, porque determina cuánto tráfico llega realmente a tu servidor.</p>',
      subsections: [
        {
          id: 'gql-cache-http',
          title: 'La caché HTTP que REST obtiene gratis',
          html: '<p>Las respuestas a <code>GET</code> se cachean en navegadores, CDN y proxies usando cabeceras estándar como <code>Cache-Control</code> y <code>ETag</code>. Si tu API es mayormente pública y de lectura (un catálogo, contenido, precios de referencia), REST con buena caché HTTP es difícil de superar: muchas peticiones ni siquiera llegan a tu infraestructura.</p>',
        },
        {
          id: 'gql-cache-cliente',
          title: 'Caché normalizada en el cliente',
          html: '<p>GraphQL suele usar <code>POST</code> a un único endpoint, que los intermediarios no cachean. Por eso clientes como Apollo, urql o Relay mantienen una caché normalizada por tipo e identificador: si dos consultas traen el mismo producto, se guarda una vez y ambas pantallas se actualizan juntas. Es potente, pero añade configuración y una fuente de errores sutiles cuando los identificadores no son consistentes.</p>',
        },
        {
          id: 'gql-persistidas',
          title: 'Consultas persistidas',
          html: '<p>Con las consultas persistidas, el cliente envía un identificador o hash de una consulta conocida en lugar del texto completo. Eso permite usar <code>GET</code> y recuperar parte de la caché HTTP, reduce el tamaño de las peticiones y, en APIs privadas, permite rechazar cualquier consulta que no esté en la lista aprobada.</p>',
        },
      ],
    },
    {
      id: 'gql-n1',
      title: 'El problema N+1 y DataLoader',
      html: `<p>Si pides 50 pedidos con su cliente y el resolver de <code>customer</code> hace una consulta por cada pedido, terminas con 51 consultas a la base de datos: una para la lista y cincuenta para los clientes. Con relaciones anidadas el número crece multiplicado. La solución estándar es agrupar las cargas por petición con DataLoader: durante un ciclo del event loop recoge todos los IDs solicitados, ejecuta una sola consulta y reparte los resultados a cada resolver.</p>
${flowDiagram(['50 resolvers\npiden cliente', 'DataLoader\nagrupa IDs', '1 consulta\nWHERE id IN', 'Reparte\nresultados'], 'De 51 consultas a 2 por petición')}
${articleCode(`
import DataLoader from "dataloader";

// Se crea un loader nuevo por petición para no compartir caché entre usuarios
export function createLoaders(db) {
  return {
    customer: new DataLoader(async (ids) => {
      const rows = await db.query(
        "SELECT * FROM customers WHERE id = ANY($1)",
        [ids]
      );
      const byId = new Map(rows.map((r) => [r.id, r]));
      return ids.map((id) => byId.get(id) ?? null); // mismo orden que ids
    }),
  };
}

export const resolvers = {
  Order: {
    customer: (order, _args, ctx) => ctx.loaders.customer.load(order.customerId),
  },
};`)}
<p>Dos detalles importan: la función de carga debe devolver los resultados en el mismo orden que los IDs recibidos, y el loader se crea por petición, porque su caché interna no debe mezclar datos de usuarios distintos.</p>`,
    },
    {
      id: 'gql-seguridad',
      title: 'Seguridad de una API GraphQL',
      html: '<p>Un único endpoint que acepta consultas arbitrarias es también una superficie de ataque. Una consulta con relaciones circulares anidadas diez niveles puede tumbar el servidor sin necesidad de muchas peticiones. Las defensas básicas son límites de profundidad y de complejidad calculada antes de ejecutar, timeouts por consulta, paginación obligatoria en las listas y límites de peticiones por cliente. La autorización debe vivir en los resolvers o en la capa de negocio, no solo en la puerta de entrada: que un usuario pueda consultar <code>pedido</code> no significa que pueda leer <code>pedido.cliente.facturas</code>. En APIs públicas, evalúa desactivar la introspección en producción y, en APIs propias, usar solo consultas persistidas.</p>',
    },
    {
      id: 'gql-elegir',
      title: 'Cómo elegir en un proyecto real',
      html: `<p>REST es buena opción para APIs públicas, integraciones con terceros, webhooks, servicios con pocos consumidores y cargas de lectura muy cacheables. GraphQL aporta más cuando hay muchos clientes con necesidades distintas, datos muy relacionados y un equipo frontend que itera rápido. También funciona bien como capa de agregación sobre varios servicios existentes, donde el frontend obtiene en una consulta lo que antes requería varias llamadas.</p>
${compareDiagram(
  { title: 'REST encaja mejor', points: ['APIs públicas y de terceros', 'Lecturas muy cacheables', 'Webhooks e integraciones', 'Pocos consumidores'] },
  { title: 'GraphQL encaja mejor', points: ['Muchos clientes distintos', 'Datos muy relacionados', 'Frontend que itera rápido', 'Agregar varios servicios'] },
  'La decisión depende de quién consume la API'
)}`,
    },
    {
      id: 'gql-errores',
      title: 'Errores comunes al adoptar GraphQL',
      html: `<ul>
  <li><strong>Exponer el modelo de base de datos tal cual.</strong> El esquema debe modelar el dominio y los casos de uso, no copiar tablas; si no, cualquier cambio interno rompe a los clientes.</li>
  <li><strong>Resolvers sin batching.</strong> Funciona en desarrollo con diez registros y genera cientos de consultas en producción.</li>
  <li><strong>Listas sin paginación.</strong> Un campo que devuelve todos los elementos de una relación es una invitación a consultas enormes.</li>
  <li><strong>Autorizar solo en la entrada.</strong> Las relaciones permiten llegar a datos por caminos que nadie previó.</li>
  <li><strong>Ignorar los errores parciales.</strong> Una respuesta con <code>data</code> y <code>errors</code> a la vez es normal en GraphQL; el cliente debe manejarla en lugar de asumir que un 200 significa éxito total.</li>
</ul>`,
    },
    {
      id: 'gql-cuando-no',
      title: 'Cuándo NO cambiar a GraphQL',
      html: '<p>Si ya tienes una API REST que funciona, con pocos consumidores y sin quejas de rendimiento o de endpoints a medida, reescribirla en GraphQL es costo sin retorno. Tampoco conviene en APIs públicas donde la caché HTTP es la principal herramienta de escala, en servicios internos simples entre backends, ni en equipos pequeños sin experiencia previa, porque la curva de aprendizaje de esquemas, resolvers, caché de cliente y seguridad es real. La alternativa intermedia suele ser mejor: mejorar los endpoints REST existentes o añadir un endpoint de agregación específico para la pantalla que lo necesita.</p>',
    },
  ],
  faqs: [
    {
      q: '¿GraphQL es más rápido que REST?',
      a: 'No por sí mismo. Puede reducir el número de peticiones y el tamaño de las respuestas, pero un resolver mal escrito puede ser más lento que un endpoint REST bien diseñado y cacheado.',
    },
    {
      q: '¿Cómo protejo una API GraphQL?',
      a: 'Con autenticación y autorización por campo o resolver, límites de profundidad y complejidad, timeouts, paginación obligatoria y, en APIs privadas, consultas persistidas que solo permitan operaciones conocidas.',
    },
    {
      q: '¿Puedo usar ambos en el mismo proyecto?',
      a: 'Sí, es común. Por ejemplo, GraphQL para la aplicación propia y REST para webhooks, integraciones con servicios externos y descargas de archivos.',
    },
    {
      q: '¿Cómo se versiona una API GraphQL?',
      a: 'En general no se versiona por URL: se añaden campos nuevos y se marcan los antiguos con @deprecated, monitoreando su uso antes de retirarlos.',
    },
    {
      q: '¿Qué código de estado devuelve GraphQL ante un error?',
      a: 'Depende del servidor. Es habitual responder 200 con una lista errors en el cuerpo para errores de ejecución, y códigos 4xx para peticiones mal formadas. Por eso el cliente debe revisar el cuerpo, no solo el estado.',
    },
  ],
  refs: [
    { label: 'GraphQL — Learn', url: 'https://graphql.org/learn/' },
    { label: 'GraphQL Specification', url: 'https://spec.graphql.org/' },
    { label: 'DataLoader', url: 'https://github.com/graphql/dataloader' },
    { label: 'MDN — HTTP caching', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching' },
    { label: 'Production Ready GraphQL', note: 'Marc-André Giroux (libro): diseño de esquemas, rendimiento y seguridad' },
  ],
  closing: '¿Dudas sobre la arquitectura de tu API? Hablemos.',
});

const REST_CONTENT = buildArticle({
  prefix: 'rest',
  intro:
    'Una API es un contrato. Cada decisión de nombres, formatos y códigos de estado se convierte en algo que otros equipos, integraciones y aplicaciones móviles dan por sentado, a veces durante años. Una API predecible ahorra horas de soporte; una inconsistente obliga a leer el código del servidor para entenderla. La pregunta útil al diseñar un endpoint no es "¿funciona?", sino "¿podría alguien usarlo correctamente sin preguntarme?". Este artículo recorre las decisiones que más pesan: recursos y verbos, códigos de estado, formato de errores, paginación, versionado y documentación.',
  takeaways: [
    'Modela recursos con sustantivos en plural y usa los verbos HTTP para las acciones, respetando su semántica de seguridad e idempotencia.',
    'Los códigos de estado deben significar lo que dicen: 201 al crear, 404 si no existe, 422 si los datos no son válidos.',
    'Un formato de error único, como Problem Details (RFC 9457), facilita el manejo de errores en todos los clientes.',
    'Pagina siempre las colecciones; la paginación por cursor es más estable cuando los datos cambian con frecuencia.',
    'Añadir campos no rompe a nadie; eliminar o renombrar sí. Versiona antes de romper el contrato y documenta con OpenAPI.',
  ],
  sections: [
    {
      id: 'rest-contrato',
      title: 'Una API es un contrato, no un detalle de implementación',
      html: `<p>El código del servidor se puede refactorizar cuando quieras; el contrato de una API publicada, no. Una vez que una aplicación móvil instalada en miles de teléfonos espera un campo llamado <code>fecha_creacion</code>, ese nombre forma parte de tu sistema aunque internamente lo hayas cambiado. Por eso conviene pensar el diseño desde el consumidor: qué necesita, cómo descubrirá los errores y qué ocurrirá cuando la API evolucione.</p>
<p>La consistencia vale más que la perfección. Un estilo de nombres discutible aplicado en toda la API es más fácil de usar que diez endpoints impecables con convenciones distintas. Decide temprano el formato de fechas (ISO 8601), el estilo de los campos (camelCase o snake_case), el formato de errores y la forma de paginar, y aplícalo en todas partes.</p>`,
    },
    {
      id: 'rest-recursos',
      title: 'Recursos y verbos HTTP',
      html: `<p>Usa rutas como <code>/clientes</code> y <code>/clientes/42/pedidos</code>, en plural y sin verbos en la URL. El verbo ya lo aporta el método HTTP, y cada método tiene una semántica que navegadores, proxies, clientes y herramientas de reintento dan por sentada. Un método <em>seguro</em> no modifica el estado del servidor; uno <em>idempotente</em> produce el mismo efecto si se repite. Respetar estas propiedades permite reintentar peticiones de forma segura ante un corte de red.</p>
${articleTable(
  ['Método', 'Uso típico', '¿Seguro?', '¿Idempotente?'],
  [
    ['GET', 'Leer un recurso o una colección', 'Sí', 'Sí'],
    ['POST', 'Crear un recurso o ejecutar una acción', 'No', 'No'],
    ['PUT', 'Reemplazar el recurso completo', 'No', 'Sí'],
    ['PATCH', 'Modificar solo algunos campos', 'No', 'No necesariamente'],
    ['DELETE', 'Eliminar un recurso', 'No', 'Sí'],
  ]
)}
<p><code>GET</code> nunca debe modificar datos: rastreadores, precargas del navegador y proxies asumen que es seguro repetirlo. Para operaciones que no encajan en CRUD, modélalas como un sub-recurso (<code>POST /pedidos/42/cancelacion</code>) en lugar de rutas con verbos como <code>/cancelarPedido</code>. Y para hacer idempotente un <code>POST</code> crítico, como un pago, acepta una cabecera <code>Idempotency-Key</code> y devuelve el mismo resultado si llega repetida.</p>`,
    },
    {
      id: 'rest-errores-http',
      title: 'Códigos de estado y formato de errores',
      html: '<p>Los errores son la parte de la API que más se usa cuando algo sale mal, y la que menos atención recibe al diseñarla.</p>',
      subsections: [
        {
          id: 'rest-codigos',
          title: 'Los códigos que importan',
          html: '<p>No necesitas todos los códigos HTTP, pero sí usar bien los principales: <code>200</code> para éxito, <code>201</code> al crear (con la cabecera <code>Location</code>), <code>204</code> sin contenido, <code>400</code> para peticiones mal formadas, <code>401</code> si falta autenticación, <code>403</code> si el usuario no tiene permiso, <code>404</code> si no existe, <code>409</code> ante conflictos de estado, <code>422</code> para datos que no pasan la validación, <code>429</code> por exceso de peticiones y <code>5xx</code> solo para fallos del servidor. Nunca devuelvas un <code>200</code> con un mensaje de error dentro: rompe el manejo de errores de cualquier cliente HTTP.</p>',
        },
        {
          id: 'rest-problem',
          title: 'Problem Details: un formato estándar',
          html: '<p>El RFC 9457 define un formato JSON para errores con el tipo de contenido <code>application/problem+json</code>: un <code>type</code> que identifica la clase de error, un <code>title</code> legible, el <code>status</code>, un <code>detail</code> específico y, opcionalmente, campos de extensión. Adoptarlo evita inventar un formato propio y permite que los clientes manejen todos los errores con el mismo código.</p>',
        },
        {
          id: 'rest-validacion',
          title: 'Errores de validación útiles',
          html: '<p>En errores de validación, devuelve la lista de campos con su mensaje, para que un formulario pueda marcar cada campo sin interpretar texto libre. Los mensajes deben explicar cómo corregir el problema y nunca exponer trazas de pila, consultas SQL ni detalles internos.</p>',
        },
      ],
      after: articleCode(`
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.ejemplo.com/errores/validacion",
  "title": "Los datos enviados no son válidos",
  "status": 422,
  "detail": "Revisa los campos marcados e inténtalo de nuevo.",
  "instance": "/clientes",
  "errors": [
    { "field": "email", "message": "Debe ser un correo válido" },
    { "field": "telefono", "message": "Debe tener 10 dígitos" }
  ]
}`),
    },
    {
      id: 'rest-paginacion',
      title: 'Paginación y filtrado',
      html: `<p>Una colección sin paginar funciona con 100 registros y tumba el servidor con un millón. Pagina siempre, con un tamaño por defecto razonable y un máximo que el cliente no pueda superar. Hay dos enfoques principales y la elección depende de cómo cambian los datos.</p>
${compareDiagram(
  { title: 'Offset (?page=3)', points: ['Simple de implementar', 'Permite saltar a una página', 'Duplica u omite si hay altas', 'Lento en offsets muy grandes'] },
  { title: 'Cursor (?after=abc)', points: ['Estable aunque haya cambios', 'Rendimiento constante', 'No permite saltar páginas', 'Ideal para feeds y listas largas'] },
  'Dos formas de paginar una colección'
)}
<p>Ofrece filtros y orden por parámetros de consulta (<code>?estado=activo&amp;orden=-fecha</code>) y devuelve la información necesaria para pedir la página siguiente, ya sea un cursor opaco o un enlace completo. Un cliente nunca debería tener que construir el cursor por su cuenta.</p>`,
    },
    {
      id: 'rest-versionado',
      title: 'Versionado y evolución del contrato',
      html: '<p>Añadir campos opcionales o endpoints nuevos no rompe a nadie, siempre que los clientes ignoren los campos que no conocen. Eliminar campos, renombrarlos, cambiar su tipo o hacer obligatorio uno que era opcional sí rompe. Cuando un cambio rompa el contrato, publícalo como una nueva versión (por ejemplo <code>/v2</code>) y anuncia una fecha de retiro para la anterior, con tiempo suficiente para que los consumidores migren. Mide qué clientes siguen usando la versión antigua antes de apagarla; retirar una versión a ciegas es la forma más rápida de perder la confianza de quien integra tu API.</p>',
    },
    {
      id: 'rest-documentacion',
      title: 'Documentación con OpenAPI',
      html: '<p>Documenta la API con la especificación OpenAPI. Un único archivo describe rutas, parámetros, esquemas de petición y respuesta, errores y autenticación. Sirve de referencia navegable, permite generar clientes tipados en varios lenguajes y probar endpoints desde el navegador. Lo ideal es que la especificación forme parte del repositorio y se valide en CI, ya sea generada desde el código o escrita primero y usada para validar las implementaciones. Una documentación que no se verifica automáticamente termina describiendo una API que ya no existe. Incluye ejemplos reales de petición y respuesta: son lo primero que copia quien integra.</p>',
    },
    {
      id: 'rest-errores',
      title: 'Errores comunes en el diseño de APIs REST',
      html: `<ul>
  <li><strong>Verbos en las URLs.</strong> Rutas como <code>/obtenerClientes</code> o <code>/crearPedido</code> duplican lo que ya dice el método HTTP.</li>
  <li><strong>Un 200 para todo.</strong> Obliga a los clientes a inspeccionar el cuerpo para saber si la operación funcionó.</li>
  <li><strong>Exponer el modelo de base de datos.</strong> Columnas internas, IDs autoincrementales sensibles o nombres técnicos se filtran al contrato y quedan congelados.</li>
  <li><strong>Colecciones sin paginar.</strong> Funcionan en desarrollo y se convierten en un incidente cuando los datos crecen.</li>
  <li><strong>Romper el contrato sin aviso.</strong> Renombrar un campo "porque se ve mejor" rompe integraciones que no controlas.</li>
</ul>`,
    },
    {
      id: 'rest-cuando-no',
      title: 'Cuándo NO seguir REST al pie de la letra',
      html: '<p>REST es un estilo, no una religión. Para comunicación interna entre servicios con contratos estrictos y alto volumen, gRPC suele ser más eficiente. Para eventos en tiempo real, WebSockets o Server-Sent Events encajan mejor que sondear un endpoint. Para frontends con necesidades de datos muy variables, GraphQL puede ahorrar endpoints a medida. Y en operaciones que son claramente acciones (recalcular, exportar, enviar), forzarlas a parecer recursos puede producir diseños más confusos que un sub-recurso de acción bien nombrado. La regla que aplico es usar REST como punto de partida por su simplicidad y compatibilidad, y desviarse solo cuando el beneficio es concreto y está documentado.</p>',
    },
  ],
  faqs: [
    {
      q: '¿PUT o PATCH?',
      a: 'PUT reemplaza el recurso completo; PATCH modifica solo los campos enviados. Para formularios que editan algunos campos, PATCH suele ser más práctico. Documenta cuál usas y con qué formato.',
    },
    {
      q: '¿Versión en la URL o en una cabecera?',
      a: 'Ambas funcionan. La versión en la URL es más visible y fácil de probar; en cabecera mantiene las URLs limpias. Lo importante es elegir una y ser consistente en toda la API.',
    },
    {
      q: '¿Cómo manejo operaciones que no son CRUD?',
      a: 'Modélalas como un recurso o sub-recurso, por ejemplo POST /pedidos/42/cancelacion, en lugar de rutas con verbos como /cancelarPedido.',
    },
    {
      q: '¿401 o 403?',
      a: '401 indica que falta autenticación o que las credenciales no son válidas; 403 indica que el usuario está autenticado pero no tiene permiso. Para no revelar que un recurso existe, algunas APIs responden 404 en lugar de 403.',
    },
    {
      q: '¿Debo escribir OpenAPI a mano o generarlo desde el código?',
      a: 'Ambos enfoques funcionan. Escribirlo primero ayuda a discutir el contrato antes de implementarlo; generarlo desde el código reduce la desincronización. Lo importante es validarlo en CI.',
    },
  ],
  refs: [
    { label: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
    { label: 'RFC 9457 — Problem Details for HTTP APIs', url: 'https://www.rfc-editor.org/rfc/rfc9457' },
    { label: 'RFC 9110 — HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
    { label: 'MDN — HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
    { label: 'Microsoft REST API Guidelines', url: 'https://github.com/microsoft/api-guidelines' },
  ],
  closing: '¿Estás diseñando una API? Puedo revisar el contrato contigo.',
});

const AUTH_CONTENT = buildArticle({
  prefix: 'auth',
  intro:
    'La autenticación es de las piezas en las que un error pequeño tiene consecuencias grandes: una cuenta tomada, datos filtrados o un token que sigue funcionando semanas después de que alguien dejó la empresa. Muchos proyectos eligen JWT por inercia, porque "es lo moderno", y terminan reimplementando, peor, lo que una sesión clásica ya resolvía. La pregunta útil no es "¿sesiones o JWT?" en abstracto, sino "¿quién valida la identidad, cuántos servicios lo hacen y qué pasa cuando necesito revocar un acceso ahora mismo?". Este artículo compara ambos enfoques, explica dónde guardar los tokens y cubre lo que nunca se debe hacer con las contraseñas.',
  takeaways: [
    'Para una aplicación web con su propio backend, las sesiones con cookies HttpOnly suelen ser la opción más simple y segura.',
    'Los JWT son útiles entre servicios o con varios clientes, pero un token emitido sigue siendo válido hasta que expira.',
    'Guardar tokens en localStorage los expone a cualquier script inyectado por XSS; una cookie HttpOnly no es legible desde JavaScript.',
    'Si usas JWT: vida corta, tokens de refresco revocables y validación estricta del algoritmo, emisor y audiencia.',
    'Las contraseñas se guardan con un hash lento y con sal (Argon2id, bcrypt), nunca cifradas ni con MD5 o SHA-256 a secas.',
  ],
  sections: [
    {
      id: 'auth-problema',
      title: 'El problema: elegir el mecanismo por inercia',
      html: `<p>Autenticar es responder "¿quién eres?" en cada petición. Hay dos grandes formas de hacerlo en la web. Con <strong>sesiones</strong>, el servidor recuerda quién eres y te da un identificador opaco. Con <strong>tokens autocontenidos</strong> como JWT, el servidor te entrega un documento firmado con tus datos y no necesita recordar nada: le basta con verificar la firma.</p>
<p>Ninguna es más moderna que la otra; resuelven problemas distintos. El error habitual es elegir JWT para una aplicación web con un solo backend y descubrir después que hace falta cerrar sesión de verdad, invalidar tokens tras un cambio de contraseña o bloquear un usuario de inmediato. Para todo eso, el servidor tiene que volver a recordar estado, y el supuesto beneficio del "sin estado" desaparece.</p>`,
    },
    {
      id: 'auth-sesiones',
      title: 'Sesiones con cookies',
      html: `<p>El servidor crea una sesión, guarda su estado (en memoria, Redis o base de datos) y envía al navegador una cookie con un identificador aleatorio de alta entropía. En cada petición, el navegador la adjunta automáticamente y el servidor busca la sesión. Cerrar sesión o revocar un acceso es tan simple como borrar el registro en el servidor, con efecto inmediato.</p>
<p>La seguridad depende de los atributos de la cookie. <code>HttpOnly</code> impide que el JavaScript de la página la lea, <code>Secure</code> exige HTTPS y <code>SameSite</code> limita que se envíe en peticiones iniciadas desde otros sitios, lo que reduce el riesgo de CSRF. Regenera el identificador al iniciar sesión para evitar la fijación de sesión, y define expiración por inactividad y absoluta.</p>
${articleCode(`
Set-Cookie: sid=V2hhdCBhIHJhbmRvbSBpZA; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`)}
<p>Si la aplicación crece a varios servidores, el estado de sesión se mueve a un almacén compartido como Redis. Es un problema resuelto, no una razón para abandonar las sesiones.</p>`,
    },
    {
      id: 'auth-jwt',
      title: 'JWT: ventajas y trampas',
      html: '<p>Un JWT (JSON Web Token) es un conjunto de afirmaciones codificado y firmado. Cualquier servicio con la clave de verificación puede validarlo sin consultar una base de datos, y eso es justamente lo que lo hace atractivo y peligroso a la vez.</p>',
      subsections: [
        {
          id: 'auth-contenido',
          title: 'Qué contiene un token',
          html: '<p>Tiene tres partes: cabecera (algoritmo), carga útil (<em>claims</em> como <code>sub</code>, <code>exp</code>, <code>iss</code>, <code>aud</code>) y firma. La carga útil está codificada en Base64URL, no cifrada: cualquiera que tenga el token puede leerla. Nunca pongas en un JWT datos que no deberían ver el usuario o un intermediario.</p>',
        },
        {
          id: 'auth-revocar',
          title: 'El problema de la revocación',
          html: '<p>Un token robado sigue siendo válido hasta que expira, porque nadie lo consulta contra un registro central. La mitigación estándar es combinar un token de acceso de vida corta (minutos) con un token de refresco de vida más larga, guardado de forma segura, que el servidor sí puede revocar y que se rota en cada uso. Si se detecta la reutilización de un token de refresco ya usado, se invalida toda la familia de tokens.</p>',
        },
        {
          id: 'auth-validar',
          title: 'Validar todo, no solo la firma',
          html: '<p>Fija el algoritmo esperado en el servidor en lugar de confiar en el que indica la cabecera del token; así evitas ataques con <code>alg: none</code> o la confusión entre algoritmos simétricos y asimétricos. Verifica también la expiración, el emisor y la audiencia. El RFC 8725 recoge estas buenas prácticas.</p>',
        },
      ],
      after: flowDiagram(['Inicio de\nsesión', 'Access token\n(minutos)', 'Expira: usa\nrefresh token', 'Servidor\nvalida y rota', 'Nuevo access\ntoken'], 'Tokens de acceso cortos, refresco revocable'),
    },
    {
      id: 'auth-comparativa',
      title: 'Sesiones frente a JWT: comparativa',
      html: `<p>La elección se aclara cuando se comparan las propiedades que de verdad importan en producción.</p>
${articleTable(
  ['Criterio', 'Sesión con cookie', 'JWT'],
  [
    ['Estado en el servidor', 'Sí (memoria, Redis, base de datos)', 'No, salvo para refresco o listas de bloqueo'],
    ['Revocación inmediata', 'Trivial: borrar la sesión', 'Difícil hasta que el token expira'],
    ['Validación entre servicios', 'Requiere consultar el almacén de sesiones', 'Cualquier servicio con la clave pública'],
    ['Exposición a XSS', 'Baja con HttpOnly', 'Alta si se guarda en localStorage'],
    ['Riesgo de CSRF', 'Mitigado con SameSite y tokens CSRF', 'Solo si viaja en cookie'],
    ['Caso ideal', 'Aplicación web con su propio backend', 'APIs entre servicios, varios clientes, SSO'],
  ]
)}`,
    },
    {
      id: 'auth-almacenar',
      title: 'Dónde guardar el token',
      html: '<p>En el navegador, una cookie <code>HttpOnly</code> es más segura que <code>localStorage</code> o <code>sessionStorage</code>, porque un ataque XSS no puede leerla. Un XSS sigue siendo grave (puede hacer peticiones en nombre del usuario mientras la página está abierta), pero no puede robar la credencial para usarla desde otro lugar. Si tu frontend y tu API están en dominios distintos, el patrón <em>backend for frontend</em> permite que un servidor propio guarde los tokens y entregue al navegador solo una cookie de sesión. En aplicaciones móviles nativas, usa el almacenamiento seguro del sistema: Keychain en iOS y Keystore en Android.</p>',
    },
    {
      id: 'auth-passwords',
      title: 'Cómo guardar contraseñas',
      html: `<p>Las contraseñas nunca se cifran (lo cifrado se puede descifrar) ni se guardan con funciones rápidas como MD5 o SHA-256, que permiten probar miles de millones de combinaciones por segundo con hardware común. Se usa una función diseñada para contraseñas, deliberadamente lenta y con sal única por usuario: Argon2id es la recomendación actual de OWASP, y bcrypt sigue siendo aceptable en sistemas existentes.</p>
${articleCode(`
import argon2 from "argon2";

// Al registrar: el hash incluye algoritmo, parámetros y sal
export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, { type: argon2.argon2id });
}

// Al iniciar sesión: compara sin revelar por qué falló
export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}`)}
<p>Complementa con límites de intentos de inicio de sesión, mensajes de error que no revelen si el usuario existe, comprobación contra listas de contraseñas filtradas y un segundo factor, al menos para cuentas con privilegios.</p>`,
    },
    {
      id: 'auth-errores',
      title: 'Errores comunes en autenticación',
      html: `<ul>
  <li><strong>JWT de larga duración sin refresco.</strong> Un token válido por 30 días es una credencial de 30 días que no puedes revocar.</li>
  <li><strong>Datos sensibles en la carga útil.</strong> El contenido de un JWT es legible por cualquiera que lo tenga.</li>
  <li><strong>Aceptar el algoritmo que indica el token.</strong> Abre la puerta a tokens sin firma o firmados con la clave equivocada.</li>
  <li><strong>Cookies sin HttpOnly, Secure o SameSite.</strong> Anulan buena parte de la ventaja de usar cookies.</li>
  <li><strong>No invalidar sesiones al cambiar la contraseña.</strong> Quien robó la sesión sigue dentro aunque la víctima haya reaccionado.</li>
</ul>`,
    },
    {
      id: 'auth-cuando-no',
      title: 'Cuándo NO usar JWT (ni construir tu propio login)',
      html: '<p>No uses JWT como mecanismo de sesión de una aplicación web tradicional con un único backend: las sesiones con cookies son más simples, se revocan al instante y tienen menos formas de configurarse mal. Reserva JWT para lo que hace bien: comunicación entre servicios, APIs consumidas por varios clientes y federación de identidad con OpenID Connect. Y antes de escribir tu propio sistema de login, considera una librería madura o un proveedor de identidad. Recuperación de cuentas, MFA, bloqueo por intentos, OAuth y auditoría son mucho trabajo y cada uno tiene sus propias trampas. Construirlo tú tiene sentido cuando hay requisitos específicos y alguien en el equipo domina las guías de OWASP.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Puedo usar JWT dentro de una cookie?',
      a: 'Sí, y es una combinación razonable: el token viaja en una cookie HttpOnly, protegido de XSS, y el servidor lo valida sin estado. Sigue necesitando vida corta y protección contra CSRF.',
    },
    {
      q: '¿Debo construir mi propio sistema de login?',
      a: 'Para muchos proyectos es mejor usar una librería o proveedor probado, sobre todo si necesitas OAuth, recuperación de cuentas o MFA. Si lo construyes, sigue las guías de OWASP.',
    },
    {
      q: '¿Cada cuánto debo expirar las sesiones?',
      a: 'Depende del riesgo. Aplicaciones con datos sensibles usan expiración por inactividad corta; aplicaciones de consumo suelen mantener sesiones más largas con reautenticación para acciones críticas.',
    },
    {
      q: '¿bcrypt o Argon2id?',
      a: 'Para proyectos nuevos, Argon2id es la recomendación de OWASP. bcrypt sigue siendo aceptable; ten en cuenta que solo procesa los primeros 72 bytes de la contraseña.',
    },
    {
      q: '¿SameSite=Lax elimina la necesidad de protección CSRF?',
      a: 'Reduce mucho el riesgo, pero no cubre todos los casos, por ejemplo peticiones GET que modifican datos o subdominios comprometidos. En operaciones sensibles, un token CSRF sigue siendo una buena defensa adicional.',
    },
  ],
  refs: [
    { label: 'OWASP — Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
    { label: 'OWASP — Session Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
    { label: 'OWASP — Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
    { label: 'RFC 7519 — JSON Web Token', url: 'https://www.rfc-editor.org/rfc/rfc7519' },
    { label: 'RFC 8725 — JWT Best Current Practices', url: 'https://www.rfc-editor.org/rfc/rfc8725' },
    { label: 'MDN — Set-Cookie', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie' },
  ],
  closing: '¿Necesitas revisar la autenticación de tu app? Escríbeme.',
});

const REDIS_CONTENT = buildArticle({
  prefix: 'redis',
  intro:
    'Cuando una consulta costosa se repite cientos de veces por minuto con el mismo resultado, guardarla en memoria es una de las optimizaciones más rentables que existen. Redis es la herramienta más común para eso: rápida, simple y disponible en cualquier nube. Pero la caché introduce una pregunta que antes no existía: cuándo un dato guardado deja de ser válido. La pregunta útil no es "¿cómo cacheo esto?", sino "¿cuánto tiempo puede estar desactualizado este dato sin causar un error de negocio?". Este artículo cubre los patrones, la invalidación, la estampida de caché y los errores que convierten una optimización en una fuente de bugs.',
  takeaways: [
    'El patrón cache-aside es el más simple y robusto: leer de caché, y si no está, leer de la base de datos y guardarlo.',
    'Todo dato en caché debe tener un TTL; los datos sin expiración terminan siendo datos falsos.',
    'Invalida la clave en el mismo flujo de la escritura y usa un esquema de claves predecible.',
    'Cuando muchas peticiones fallan la caché a la vez pueden saturar la base de datos: protégete de la estampida con bloqueos y TTL con variación.',
    'Si Redis falla, la aplicación debe degradarse a la base de datos en lugar de devolver errores al usuario.',
  ],
  sections: [
    {
      id: 'redis-por-que',
      title: 'Qué resuelve una caché y qué problema añade',
      html: `<p>Una caché guarda el resultado de una operación costosa para reutilizarlo. Redis lo hace en memoria, con tiempos de respuesta del orden de submilisegundos dentro de la misma red, frente a consultas a la base de datos que pueden tardar decenas o cientos de milisegundos cuando involucran uniones, agregaciones o servicios externos lentos. El beneficio es doble: respuestas más rápidas y menos carga sobre el sistema de origen.</p>
<p>El costo es que ahora el mismo dato existe en dos lugares. Cada vez que el origen cambia, la copia en caché queda potencialmente obsoleta, y el sistema tiene que decidir cuándo confiar en ella. Por eso la caché no es una optimización gratis: es una decisión de consistencia. Antes de añadirla, mide si la consulta es realmente un cuello de botella; muchas veces un índice en la base de datos resuelve el problema sin introducir una segunda fuente de verdad.</p>`,
    },
    {
      id: 'redis-aside',
      title: 'El patrón cache-aside',
      html: `<p>La aplicación busca la clave en Redis. Si existe (un acierto), la usa. Si no (un fallo), consulta la base de datos, guarda el resultado con un TTL y lo devuelve. Es fácil de entender, solo cachea lo que realmente se pide y, si Redis falla, la aplicación puede seguir leyendo de la base de datos con más lentitud.</p>
${flowDiagram(['Petición\nde lectura', '¿Está en\nRedis?', 'No: consulta\nla base', 'Guarda con\nTTL', 'Responde'], 'Cache-aside: la aplicación controla la caché')}
${articleCode(`
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

export async function getProduct(id: number) {
  const key = "producto:" + id;

  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);          // acierto
  } catch (err) {
    console.warn("Redis no disponible, se lee de la base", err);
  }

  const product = await db.products.findById(id);   // fallo: ir al origen
  if (product) {
    const ttl = 300 + Math.floor(Math.random() * 60); // TTL con variación
    try {
      await redis.set(key, JSON.stringify(product), { EX: ttl });
    } catch {
      /* si no se puede guardar, se responde igual */
    }
  }
  return product;
}`)}`,
    },
    {
      id: 'redis-patrones',
      title: 'Patrones de lectura y escritura',
      html: `<p>Cache-aside no es la única opción. La diferencia entre los patrones está en quién escribe en la caché y cuándo, y eso determina el riesgo de servir datos viejos o de perder escrituras.</p>
${articleTable(
  ['Patrón', 'Cómo funciona', 'Ventaja', 'Riesgo'],
  [
    ['Cache-aside', 'La aplicación lee de caché y la rellena al fallar', 'Simple; solo cachea lo usado', 'Datos viejos hasta invalidar o expirar'],
    ['Read-through', 'Una capa de caché consulta el origen por ti', 'Lógica centralizada', 'Depende de la librería o proveedor'],
    ['Write-through', 'Cada escritura actualiza origen y caché', 'Caché siempre al día', 'Escrituras más lentas; cachea datos que nadie lee'],
    ['Write-behind', 'Se escribe en caché y se persiste después', 'Escrituras muy rápidas', 'Pérdida de datos si la caché falla antes de persistir'],
  ]
)}
<p>Para la mayoría de aplicaciones web, cache-aside con invalidación explícita en las escrituras es el punto de partida correcto. Write-behind solo tiene sentido cuando entiendes y aceptas la posibilidad de perder escrituras recientes.</p>`,
    },
    {
      id: 'redis-invalidacion',
      title: 'Invalidación: la parte difícil',
      html: '<p>Decidir cuándo un dato en caché deja de ser válido es la parte difícil del diseño. Tres prácticas cubren la mayoría de los casos.</p>',
      subsections: [
        {
          id: 'redis-borrar',
          title: 'Borrar después de escribir',
          html: '<p>Cuando se actualiza un registro, borra su clave en caché inmediatamente después de confirmar la escritura en la base de datos. Borrar suele ser más seguro que reescribir el valor: si dos escrituras concurrentes actualizan la caché en distinto orden, puedes terminar con el valor antiguo guardado; si borras, la siguiente lectura trae el valor actual.</p>',
        },
        {
          id: 'redis-claves',
          title: 'Claves con un esquema predecible',
          html: '<p>Usa claves con un esquema consistente, como <code>producto:42</code> o <code>usuario:7:perfil</code>, para poder invalidarlas con precisión desde el código que modifica cada entidad. Evita depender de <code>KEYS</code> con patrones en producción: recorre todo el espacio de claves y bloquea el servidor mientras lo hace. Si necesitas invalidar grupos, mantén un conjunto con las claves relacionadas o incluye una versión en el nombre de la clave.</p>',
        },
        {
          id: 'redis-ttl',
          title: 'El TTL como red de seguridad',
          html: '<p>Aunque invalides en cada escritura, siempre habrá caminos que se escapan: un script de migración, una actualización manual o un servicio que escribe directo en la base. Un TTL garantiza que cualquier error de invalidación se corrige solo en un tiempo acotado. Para datos que toleran algo de retraso, como un catálogo, un TTL corto puede bastar sin invalidación explícita.</p>',
        },
      ],
    },
    {
      id: 'redis-estampida',
      title: 'Estampida de caché',
      html: '<p>Si una clave muy consultada expira, cientos de peticiones pueden fallar la caché al mismo tiempo e ir a la base de datos para regenerarla, justo en el momento de más carga. Se mitiga de tres formas complementarias. Primero, añade una variación aleatoria al TTL para que las claves creadas a la vez no expiren a la vez. Segundo, usa un bloqueo para que solo una petición recalcule el valor, por ejemplo con <code>SET clave:lock 1 NX EX 10</code>, mientras las demás esperan brevemente o sirven el valor anterior. Tercero, para claves críticas, refresca el valor en segundo plano antes de que expire, de modo que los usuarios nunca encuentren la caché vacía.</p>',
    },
    {
      id: 'redis-memoria',
      title: 'Memoria y política de expulsión',
      html: '<p>Redis guarda todo en memoria, y la memoria se acaba. Configura <code>maxmemory</code> con un límite explícito y elige una política de expulsión con <code>maxmemory-policy</code>. La política por defecto, <code>noeviction</code>, rechaza escrituras cuando se alcanza el límite, algo razonable para datos que no se deben perder pero problemático para una caché. Para un uso puramente de caché, <code>allkeys-lru</code> o <code>allkeys-lfu</code> expulsan las claves menos usadas. Si la misma instancia guarda datos de caché y datos persistentes, como sesiones o colas, sepáralos en instancias distintas: mezclarlos hace imposible elegir una política correcta para ambos.</p>',
    },
    {
      id: 'redis-que',
      title: 'Qué cachear y qué no',
      html: '<p>Buenos candidatos: resultados de consultas costosas que se repiten, respuestas de APIs externas lentas o con límites de peticiones, configuraciones, catálogos y contenido que cambia poco, y fragmentos de páginas renderizadas. Malos candidatos: saldos, inventario en tiempo real, permisos de usuario recién modificados o cualquier dato donde un valor desactualizado cause un error de negocio. También es mala idea cachear datos con muchísimas variantes que casi nunca se repiten, como búsquedas con parámetros libres: ocupan memoria y la tasa de aciertos es baja. Mide la tasa de aciertos por tipo de clave; una caché con pocos aciertos solo añade latencia y complejidad.</p>',
    },
    {
      id: 'redis-errores',
      title: 'Errores comunes al usar Redis como caché',
      html: `<ul>
  <li><strong>Claves sin TTL.</strong> Se acumulan, consumen memoria y sirven datos obsoletos indefinidamente.</li>
  <li><strong>Hacer que Redis sea obligatorio.</strong> Si la aplicación devuelve errores cuando la caché no responde, convertiste una optimización en un punto único de fallo.</li>
  <li><strong>Usar <code>KEYS</code> en producción.</strong> Bloquea el servidor mientras recorre todas las claves; usa <code>SCAN</code> o un esquema de invalidación explícito.</li>
  <li><strong>Cachear objetos enormes.</strong> Serializar y transferir valores de varios megabytes anula la ventaja de velocidad.</li>
  <li><strong>Mezclar datos personales en claves compartidas.</strong> Una clave mal construida puede servir los datos de un usuario a otro.</li>
</ul>`,
    },
    {
      id: 'redis-cuando-no',
      title: 'Cuándo NO añadir una caché',
      html: '<p>No añadas una caché para ocultar una consulta mal escrita o un índice que falta: corrige la causa primero. Tampoco tiene sentido cuando el tráfico es bajo y la base de datos responde con holgura, cuando los datos cambian en casi cada lectura o cuando la consistencia estricta es un requisito, como en saldos o reservas. En esos casos la caché añade una segunda fuente de verdad, más infraestructura y una clase entera de errores difíciles de reproducir, a cambio de poco. La regla que aplico es medir, optimizar el origen y cachear solo cuando el cuello de botella persiste y el negocio tolera el retraso.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Redis sirve solo como caché?',
      a: 'No. También se usa para sesiones, colas, límites de peticiones, contadores, rankings y pub/sub. Para datos que no puedes perder, configura persistencia o usa una base de datos principal.',
    },
    {
      q: '¿Qué TTL debo usar?',
      a: 'Depende de cuánto tiempo es aceptable que el dato esté desactualizado. Empieza con un valor conservador y ajústalo según la tasa de aciertos y el impacto en la base de datos.',
    },
    {
      q: '¿Y si Redis se cae?',
      a: 'Diseña la aplicación para degradarse: si la caché no responde, lee de la base de datos con timeouts cortos hacia Redis y registra el error, en lugar de devolver un fallo al usuario.',
    },
    {
      q: '¿Caché en Redis o en memoria del proceso?',
      a: 'La memoria del proceso es más rápida, pero cada instancia tiene su copia y no se invalidan juntas. Redis es compartido entre instancias. Para datos casi estáticos, una caché local con TTL corto puede complementar a Redis.',
    },
    {
      q: '¿Cómo serializo los valores?',
      a: 'JSON es lo más simple y legible. Si el volumen o el tamaño importan, formatos binarios como MessagePack reducen espacio. Incluye una versión en la clave si cambias el formato.',
    },
  ],
  refs: [
    { label: 'Redis Docs', url: 'https://redis.io/docs/latest/' },
    { label: 'Redis — SET command', url: 'https://redis.io/docs/latest/commands/set/' },
    { label: 'node-redis', url: 'https://github.com/redis/node-redis' },
    { label: 'AWS — Caching strategies', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html' },
    { label: 'Designing Data-Intensive Applications', note: 'Martin Kleppmann (libro): consistencia, replicación y sistemas derivados como las cachés' },
  ],
  closing: '¿Tu backend necesita responder más rápido? Hablemos.',
});

const TEST_CONTENT = buildArticle({
  prefix: 'test',
  intro:
    'Muchos equipos abandonan las pruebas del frontend porque se vuelven frágiles: cambia el nombre de un estado interno o la estructura de un componente y fallan veinte tests aunque la aplicación funcione igual. El problema no es probar, es probar detalles de implementación. La pregunta útil frente a cada prueba no es "¿cubre esta línea?", sino "¿fallaría esta prueba si un usuario no pudiera completar la tarea?". Este artículo muestra cómo escribir pruebas con Vitest, Testing Library, Mock Service Worker y Playwright que protegen lo importante y sobreviven a los refactors.',
  takeaways: [
    'Prueba comportamiento observable (texto, roles, interacciones), no estados internos ni nombres de funciones.',
    'Testing Library fomenta buscar elementos por rol y nombre accesible, igual que un usuario o un lector de pantalla.',
    'Simula la red en el borde con Mock Service Worker en lugar de mockear cada función interna.',
    'Reserva las pruebas end-to-end para los flujos críticos: login, compra, reserva, pago.',
    'La cobertura es una señal, no un objetivo: mide si los flujos importantes están protegidos.',
  ],
  sections: [
    {
      id: 'test-fragiles',
      title: 'Por qué las pruebas del frontend se vuelven frágiles',
      html: `<p>Una prueba frágil es la que falla cuando el código cambia pero el comportamiento no. Suele ocurrir por tres motivos: la prueba inspecciona el estado interno de un componente, busca elementos por clases CSS o por su posición en el árbol, o mockea tantas dependencias que en realidad verifica que el código llama a ciertas funciones en cierto orden. Cada refactor rompe pruebas, el equipo pierde confianza en ellas y termina desactivándolas.</p>
<p>La alternativa es probar desde fuera, como lo haría un usuario: renderizar el componente, encontrar los elementos por lo que comunican, interactuar y verificar el resultado visible. Una prueba así solo falla cuando algo que el usuario percibe se rompió, que es exactamente cuando queremos que falle.</p>`,
    },
    {
      id: 'test-piramide',
      title: 'Una estrategia práctica por niveles',
      html: `<p>La idea clásica de la pirámide, muchas pruebas unitarias y pocas end-to-end, sigue siendo útil, aunque en el frontend el punto de mayor retorno suele estar en las pruebas de integración de componentes. Cada nivel es más lento y más costoso de mantener que el anterior, pero también da más confianza.</p>
${articleTable(
  ['Nivel', 'Herramienta', 'Qué verifica', 'Velocidad y costo'],
  [
    ['Estático', 'TypeScript, ESLint', 'Tipos, errores obvios, reglas de estilo', 'Instantáneo, casi gratis'],
    ['Unitario', 'Vitest', 'Funciones puras: cálculos, formateo, validaciones', 'Milisegundos'],
    ['Componente', 'Vitest + Testing Library', 'Interacciones y estados visibles de un componente', 'Rápido'],
    ['Integración con red', 'Testing Library + MSW', 'Carga, errores y datos de la API simulada', 'Rápido a moderado'],
    ['End-to-end', 'Playwright', 'Flujos completos en navegadores reales', 'Lento y más frágil'],
  ]
)}`,
    },
    {
      id: 'test-comportamiento',
      title: 'Probar comportamiento con Testing Library',
      html: '<p>Testing Library parte de un principio: cuanto más se parezcan tus pruebas a la forma en que se usa el software, más confianza te darán. En la práctica, eso se traduce en tres hábitos.</p>',
      subsections: [
        {
          id: 'test-roles',
          title: 'Buscar por rol y nombre accesible',
          html: '<p>Usa <code>getByRole("button", { name: /enviar/i })</code> antes que <code>getByTestId</code> o selectores CSS. Si la prueba encuentra el botón "Enviar" por su rol y nombre, sigue pasando aunque cambies su clase o la estructura interna. Como beneficio extra, si no puedes encontrar un elemento por su rol, probablemente tienes un problema de accesibilidad: un lector de pantalla tampoco lo encontraría.</p>',
        },
        {
          id: 'test-user-event',
          title: 'Interactuar con user-event',
          html: '<p><code>@testing-library/user-event</code> simula interacciones completas, como escribir carácter por carácter o hacer clic con los eventos de foco y puntero asociados, en lugar de disparar un único evento sintético. Crea una instancia con <code>userEvent.setup()</code> al inicio de cada prueba y espera cada interacción con <code>await</code>.</p>',
        },
        {
          id: 'test-async',
          title: 'Esperar lo asíncrono sin pausas fijas',
          html: '<p>Para contenido que aparece después de una petición, usa las consultas <code>findBy</code>, que reintentan hasta que el elemento aparece o vence el tiempo límite. Nunca uses pausas fijas con <code>setTimeout</code>: hacen las pruebas lentas en el mejor caso e intermitentes en el peor.</p>',
        },
      ],
      after: articleCode(`
// LoginForm.test.tsx — requiere @testing-library/jest-dom en el setup de Vitest
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("muestra un error si el correo no es válido", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/correo/i), "no-es-un-correo");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/correo válido/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});`),
    },
    {
      id: 'test-red',
      title: 'Simular la red en el borde con MSW',
      html: `<p>En lugar de mockear el módulo que hace <code>fetch</code> o el cliente HTTP, intercepta las peticiones con Mock Service Worker. El componente ejecuta su código real, incluidos los hooks de datos y el manejo de errores, y solo la respuesta del servidor es simulada. Los mismos manejadores sirven para las pruebas en Node y para desarrollar en el navegador sin backend.</p>
${articleCode(`
// mocks/server.ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const server = setupServer(
  http.get("/api/productos", () =>
    HttpResponse.json([{ id: 1, nombre: "Café de origen" }])
  )
);

// vitest.setup.ts
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// En una prueba concreta: simular un error del servidor
server.use(
  http.get("/api/productos", () => new HttpResponse(null, { status: 500 }))
);`)}
<p>Con esto puedes probar fácilmente los estados que más se olvidan: carga, error, lista vacía y respuestas lentas. La opción <code>onUnhandledRequest: "error"</code> hace que cualquier petición no prevista falle de forma visible en lugar de pasar en silencio.</p>`,
    },
    {
      id: 'test-e2e',
      title: 'End-to-end para lo crítico',
      html: `<p>Herramientas como Playwright ejecutan la aplicación completa en navegadores reales (Chromium, Firefox y WebKit). Úsalas para los recorridos que no pueden fallar en producción: registro, inicio de sesión, compra, reserva. Mantenlas pocas y estables, con datos de prueba controlados y localizadores por rol, igual que en Testing Library. Una suite e2e lenta y con fallos intermitentes termina ignorada, y una prueba ignorada no protege nada.</p>
${flowDiagram(['Lint y\ntipos', 'Unitarias y\ncomponentes', 'Build', 'E2E de flujos\ncríticos', 'Despliegue'], 'Las pruebas rápidas primero; las costosas al final')}
<p>Ordena el pipeline para fallar rápido: los chequeos estáticos y las pruebas de componentes corren en segundos y detectan la mayoría de errores antes de invertir minutos en el build y las pruebas end-to-end.</p>`,
    },
    {
      id: 'test-errores',
      title: 'Errores comunes al probar el frontend',
      html: `<ul>
  <li><strong>Probar detalles de implementación.</strong> Verificar el estado interno, el número de renders o que se llamó a un hook concreto ata la prueba al código y no al comportamiento.</li>
  <li><strong>Usar <code>data-testid</code> para todo.</strong> Es un último recurso; abusar de él oculta problemas de accesibilidad.</li>
  <li><strong>Mockear todo.</strong> Una prueba que mockea cada dependencia solo verifica que el código hace lo que el mock espera.</li>
  <li><strong>Snapshots gigantes.</strong> Se aprueban sin revisar y fallan por cualquier cambio irrelevante.</li>
  <li><strong>Pausas fijas y pruebas dependientes entre sí.</strong> Son la causa principal de las pruebas intermitentes.</li>
</ul>`,
    },
    {
      id: 'test-cuando-no',
      title: 'Cuándo NO escribir una prueba',
      html: '<p>No todo merece una prueba. Componentes puramente presentacionales sin lógica, prototipos que se van a tirar, código generado o configuraciones triviales rara vez justifican el costo de mantenerla. Tampoco conviene duplicar en una prueba lo que TypeScript ya garantiza, como que una función recibe los tipos correctos. La pregunta que aplico es: si este código se rompe, ¿lo notaría un usuario o el negocio, y lo detectaría algo más antes de producción? Si la respuesta es "no" o "sí, otra prueba ya lo cubre", ese tiempo rinde más en los flujos críticos, en los casos de error o en la regla de negocio que nadie se atreve a tocar.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Vitest o Jest?',
      a: 'Vitest se integra de forma natural con proyectos Vite y su API es compatible en gran medida con la de Jest. En proyectos existentes con Jest, migrar solo vale la pena si hay un problema concreto, como la lentitud o la configuración de ESM.',
    },
    {
      q: '¿Qué cobertura debería tener?',
      a: 'La cobertura es una señal, no un objetivo. Es mejor un porcentaje moderado que cubra los flujos y reglas de negocio importantes que un porcentaje alto de pruebas que solo ejecutan código sin verificar nada.',
    },
    {
      q: '¿Debo usar snapshots?',
      a: 'Con moderación. Los snapshots grandes se aprueban sin revisar y detectan cambios irrelevantes. Son más útiles para salidas pequeñas y estables, como el resultado de un formateador.',
    },
    {
      q: '¿jsdom o happy-dom?',
      a: 'Ambos simulan el DOM en Node. jsdom es más completo; happy-dom suele ser más rápido. Si algo depende de APIs reales del navegador, como el layout, ese caso pertenece a una prueba end-to-end.',
    },
    {
      q: '¿Cómo pruebo componentes que usan un router o un estado global?',
      a: 'Crea una función de render propia que envuelva el componente con los proveedores necesarios (router en memoria, store, cliente de datos) y úsala en todas las pruebas.',
    },
  ],
  refs: [
    { label: 'Vitest', url: 'https://vitest.dev' },
    { label: 'Testing Library — Guiding principles', url: 'https://testing-library.com/docs/guiding-principles' },
    { label: 'Testing Library — About Queries', url: 'https://testing-library.com/docs/queries/about/' },
    { label: 'Testing Library — user-event', url: 'https://testing-library.com/docs/user-event/intro' },
    { label: 'Mock Service Worker', url: 'https://mswjs.io' },
    { label: 'Playwright', url: 'https://playwright.dev' },
  ],
  closing: '¿Quieres empezar a probar tu frontend sin frenar al equipo? Te ayudo.',
});

const A11Y_CONTENT = buildArticle({
  prefix: 'a11y',
  intro:
    'Una parte importante de los usuarios navega con teclado, lectores de pantalla, ampliación de pantalla o control por voz, y casi todos usamos la web alguna vez en condiciones difíciles: luz solar directa, una mano ocupada, una conexión lenta o un brazo lesionado. La mayoría de las barreras de accesibilidad no requieren soluciones complejas, sino usar bien lo que HTML ya ofrece y probar la interfaz sin el ratón. La pregunta útil no es "¿cumplimos WCAG?" como casilla del final del proyecto, sino "¿puede alguien completar esta tarea sin ver la pantalla o sin usar el ratón?". Este artículo reúne lo básico que más impacto tiene y cómo verificarlo.',
  takeaways: [
    'Un botón debe ser un <code>&lt;button&gt;</code> y un enlace un <code>&lt;a&gt;</code>: el HTML semántico trae accesibilidad gratis.',
    'Todo lo que se hace con el ratón debe poder hacerse con el teclado, con un foco siempre visible y un orden lógico.',
    'Cada campo de formulario necesita una etiqueta asociada y mensajes de error conectados al campo.',
    'El texto normal necesita un contraste de al menos 4.5:1 con el fondo (nivel AA de WCAG).',
    'ARIA complementa al HTML, no lo reemplaza: un ARIA incorrecto es peor que no tenerlo.',
  ],
  sections: [
    {
      id: 'a11y-por-que',
      title: 'Por qué empezar por lo básico',
      html: `<p>Las pautas WCAG tienen decenas de criterios y pueden intimidar. Pero los problemas que aparecen una y otra vez en los sitios reales son pocos: imágenes sin texto alternativo, contraste insuficiente, campos de formulario sin etiqueta, enlaces y botones vacíos (solo un icono) y componentes que no funcionan con teclado. Corregir esos cinco puntos elimina buena parte de las barreras más frecuentes.</p>
<p>Además, la accesibilidad es mucho más barata al construir que al corregir. Elegir el elemento HTML correcto cuesta lo mismo que elegir el incorrecto; rehacer un menú desplegable construido con <code>div</code> para que funcione con teclado y lector de pantalla puede costar días. Por eso conviene incorporarla al flujo normal de desarrollo, no dejarla para una auditoría final.</p>`,
    },
    {
      id: 'a11y-semantica',
      title: 'HTML semántico: la base de todo',
      html: `<p>Los elementos nativos ya comunican su función a las tecnologías de asistencia y funcionan con teclado. Un <code>div</code> con <code>onClick</code> no recibe foco, no responde a Enter ni a Espacio y un lector de pantalla no lo anuncia como botón; un <code>button</code> hace todo eso sin una línea extra. Usa encabezados en orden jerárquico, regiones como <code>header</code>, <code>nav</code>, <code>main</code> y <code>footer</code>, y listas para conjuntos de elementos: los usuarios de lectores de pantalla navegan saltando entre encabezados y regiones.</p>
${articleTable(
  ['Necesidad', 'Evitar', 'Usar', 'Por qué'],
  [
    ['Ejecutar una acción', '&lt;div onClick&gt;', '&lt;button&gt;', 'Foco, teclado y rol incluidos'],
    ['Ir a otra página', '&lt;span onClick&gt; con navegación', '&lt;a href&gt;', 'Abrir en otra pestaña, copiar enlace, rol de enlace'],
    ['Campo de formulario', 'Placeholder como etiqueta', '&lt;label for&gt; asociado', 'El nombre se anuncia y no desaparece al escribir'],
    ['Títulos de sección', '&lt;div class="titulo"&gt;', '&lt;h2&gt;, &lt;h3&gt; en orden', 'Permite navegar por encabezados'],
    ['Botón con solo un icono', 'Icono sin texto', 'Texto oculto visualmente o aria-label', 'El botón necesita un nombre accesible'],
    ['Ventana modal', 'div posicionado a mano', '&lt;dialog&gt; con showModal()', 'Gestiona foco y tecla Escape'],
  ]
)}
${articleCode(`
<!-- Mal: no recibe foco ni se anuncia como botón -->
<div class="btn" onclick="guardar()">Guardar</div>

<!-- Bien: foco, Enter, Espacio y rol incluidos -->
<button type="button" onclick="guardar()">Guardar</button>

<!-- Botón de icono con nombre accesible -->
<button type="button" aria-label="Cerrar menú">
  <svg aria-hidden="true" focusable="false">…</svg>
</button>

<!-- Campo con etiqueta y error asociados -->
<label for="email">Correo electrónico</label>
<input id="email" type="email" autocomplete="email"
       aria-invalid="true" aria-describedby="email-error" />
<p id="email-error">Escribe un correo válido, por ejemplo nombre@dominio.com</p>`)}`,
    },
    {
      id: 'a11y-teclado',
      title: 'Teclado y foco',
      html: '<p>Recorre tu página solo con Tab, Shift+Tab, Enter, Espacio, las flechas y Escape. Es la prueba más barata y reveladora que existe, y no requiere ninguna herramienta.</p>',
      subsections: [
        {
          id: 'a11y-orden',
          title: 'Un orden de tabulación lógico',
          html: '<p>El foco debe moverse en el mismo orden en que se lee la página. Si usas CSS para reordenar visualmente los elementos, el orden del DOM sigue mandando, y el resultado puede ser un foco que salta de forma caótica. Evita valores positivos de <code>tabindex</code>; usa <code>tabindex="0"</code> solo para hacer enfocable un componente personalizado y <code>tabindex="-1"</code> para enfocar por código un elemento que no debe estar en la secuencia de tabulación.</p>',
        },
        {
          id: 'a11y-foco-visible',
          title: 'Foco siempre visible',
          html: '<p>Nunca elimines el contorno de foco con <code>outline: none</code> sin reemplazarlo. Con <code>:focus-visible</code> puedes mostrar un indicador claro cuando se navega con teclado sin que aparezca al hacer clic con el ratón, por ejemplo <code>:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }</code>. Asegúrate también de que los encabezados fijos no tapen el elemento enfocado.</p>',
        },
        {
          id: 'a11y-modales',
          title: 'Modales y menús',
          html: '<p>En los modales, mueve el foco al abrir, mantenlo dentro mientras estén abiertos, permite cerrarlos con Escape y devuelve el foco al elemento que los abrió al cerrar. El elemento nativo <code>dialog</code> abierto con <code>showModal()</code> resuelve buena parte de esto y vuelve inerte el resto de la página. Para menús y pestañas personalizados, sigue los patrones de interacción de la guía WAI-ARIA Authoring Practices.</p>',
        },
      ],
    },
    {
      id: 'a11y-contenido',
      title: 'Contraste, imágenes y formularios',
      html: '<p>WCAG 2.2 pide, en el nivel AA, un contraste de al menos 4.5:1 para texto normal y 3:1 para texto grande, y 3:1 para componentes de interfaz y gráficos necesarios para entenderlos, como bordes de campos o iconos. Comprueba los colores de tu sistema de diseño una vez y te ahorras revisar cada pantalla. Las imágenes informativas necesitan un <code>alt</code> que describa su función, no su apariencia: "Descargar factura en PDF" es mejor que "icono de documento". Las decorativas llevan <code>alt=""</code> para que el lector de pantalla las ignore. En formularios, asocia cada <code>label</code> a su campo, no uses el placeholder como única etiqueta, indica qué campos son obligatorios, usa <code>autocomplete</code> en datos personales y conecta los mensajes de error con el campo afectado mediante <code>aria-describedby</code>. Y nunca transmitas información solo con color: un campo con error debe tener también un texto o un icono.</p>',
    },
    {
      id: 'a11y-aria',
      title: 'ARIA con cuidado',
      html: '<p>ARIA sirve para describir componentes que HTML no cubre, como pestañas, árboles o menús complejos, y para anunciar cambios dinámicos con regiones <code>aria-live</code>, por ejemplo un mensaje de "Guardado" o el número de resultados de una búsqueda. La primera regla de ARIA es no usarlo si un elemento nativo ya hace lo mismo. ARIA solo cambia lo que se anuncia, no el comportamiento: un <code>div role="button"</code> sigue sin responder al teclado hasta que lo programas. Atributos mal aplicados, como <code>aria-hidden="true"</code> en un contenedor con elementos enfocables o roles que no corresponden, pueden ocultar contenido o anunciar componentes falsos. Por eso un ARIA incorrecto suele ser peor que no tener ARIA.</p>',
    },
    {
      id: 'a11y-probar',
      title: 'Cómo probar la accesibilidad',
      html: `<p>Ninguna herramienta aislada basta. Una rutina por capas detecta la mayoría de los problemas en poco tiempo y se puede aplicar a cada funcionalidad nueva antes de darla por terminada.</p>
${flowDiagram(['Análisis\nautomático', 'Recorrido\ncon teclado', 'Lector de\npantalla', 'Zoom al\n200 %', 'Corregir y\nrepetir'], 'Una revisión por capas, de lo barato a lo profundo')}
<p>Empieza con axe o Lighthouse para atrapar lo evidente (contraste, etiquetas, atributos inválidos). Luego recorre la funcionalidad solo con teclado. Después escucha el flujo principal con un lector de pantalla: NVDA en Windows, VoiceOver en macOS e iOS o TalkBack en Android. Por último, amplía al 200 % y comprueba que nada se corte ni se superponga. Las comprobaciones automáticas también se pueden integrar en las pruebas de componentes y end-to-end para evitar regresiones.</p>`,
    },
    {
      id: 'a11y-errores',
      title: 'Errores comunes de accesibilidad',
      html: `<ul>
  <li><strong>Elementos clicables que no son botones ni enlaces.</strong> Funcionan con ratón y son invisibles para el teclado y los lectores de pantalla.</li>
  <li><strong>Quitar el contorno de foco.</strong> Deja a los usuarios de teclado sin saber dónde están.</li>
  <li><strong>Placeholder como etiqueta.</strong> Desaparece al escribir, suele tener poco contraste y no siempre se anuncia.</li>
  <li><strong>Texto alternativo redundante o ausente.</strong> "Imagen de imagen.png" no ayuda; un icono sin nombre en un botón lo deja mudo.</li>
  <li><strong>Añadir ARIA para "mejorar" elementos nativos.</strong> Roles duplicados o incorrectos confunden más de lo que ayudan.</li>
</ul>`,
    },
    {
      id: 'a11y-limites',
      title: 'Límites: lo que estas prácticas básicas no cubren',
      html: '<p>Aplicar lo básico elimina muchas barreras, pero no convierte un sitio en accesible por completo ni garantiza el cumplimiento de una norma. Los componentes complejos (editores de texto enriquecido, mapas, gráficos interactivos, tablas con edición), el contenido multimedia (subtítulos, transcripciones, audiodescripción), el lenguaje claro y los requisitos legales de cada país necesitan un análisis específico. Si tu producto está sujeto a obligaciones legales o atiende a públicos con necesidades particulares, una auditoría experta y pruebas con personas con discapacidad son irremplazables. La regla práctica es construir con estas bases desde el primer día y reservar la revisión experta para lo que de verdad la necesita.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Una herramienta automática garantiza que mi sitio es accesible?',
      a: 'No. Herramientas como Lighthouse o axe detectan solo una parte de los problemas. La validación completa requiere pruebas manuales con teclado y lectores de pantalla, idealmente con revisión experta y usuarios reales.',
    },
    {
      q: '¿Qué lector de pantalla uso para probar?',
      a: 'NVDA en Windows es gratuito, VoiceOver viene incluido en macOS e iOS y TalkBack en Android. Probar con al menos uno ya revela muchos problemas.',
    },
    {
      q: '¿La accesibilidad afecta al SEO?',
      a: 'Hay solapamiento: HTML semántico, textos alternativos y una estructura clara de encabezados ayudan tanto a los lectores de pantalla como a los buscadores.',
    },
    {
      q: '¿Qué nivel de WCAG debo buscar?',
      a: 'El nivel AA es la referencia habitual en normativas y contratos. El nivel AAA no se exige como objetivo general porque algunos criterios no se pueden cumplir en todo tipo de contenido.',
    },
    {
      q: '¿Cómo mantengo la accesibilidad en un equipo grande?',
      a: 'Incorporándola al sistema de diseño (colores con contraste verificado, componentes accesibles por defecto), a la definición de terminado y a las pruebas automatizadas, para que no dependa de la memoria de cada persona.',
    },
  ],
  refs: [
    { label: 'WCAG 2.2 — Quick Reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/' },
    { label: 'WAI-ARIA Authoring Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' },
    { label: 'Using ARIA', url: 'https://www.w3.org/TR/using-aria/' },
    { label: 'MDN — Accessibility', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' },
    { label: 'WebAIM — Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' },
  ],
  closing: '¿Quieres hacer tu sitio más accesible? Puedo hacer una revisión inicial.',
});

const AGENT_CONTENT = buildArticle({
  prefix: 'agent',
  intro:
    'Un chatbot responde preguntas; un agente actúa. Cuando un modelo de lenguaje puede consultar una base de datos, buscar en documentos, crear una cita o enviar un mensaje, deja de ser un asistente de texto y se convierte en un sistema que toca datos reales. Esa capacidad es potente y exige el mismo rigor que cualquier software con permisos de escritura, con una dificultad añadida: el componente que toma las decisiones no es determinista. La pregunta útil no es "¿qué tan inteligente es el modelo?", sino "¿qué es lo peor que puede pasar si el modelo elige mal, y qué lo impide?". Este artículo explica cómo funciona un agente, cómo diseñar sus herramientas y cómo mantener el control.',
  takeaways: [
    'Un agente es un ciclo: el modelo razona, solicita una herramienta, tu código la ejecuta y devuelve el resultado hasta completar la tarea.',
    'Las herramientas deben ser pequeñas y específicas, con descripciones claras y argumentos validados en tu código.',
    'Limita pasos, tiempo y costo por tarea, y ejecuta las herramientas con permisos mínimos.',
    'Todo contenido externo que el agente lee puede contener instrucciones maliciosas (prompt injection).',
    'Las acciones irreversibles o sensibles deben pasar por confirmación humana, y cada paso debe quedar registrado.',
  ],
  sections: [
    {
      id: 'agent-definicion',
      title: 'De chatbot a agente',
      html: `<p>Un modelo de lenguaje, por sí solo, solo produce texto. Lo que lo convierte en agente es darle herramientas: funciones que tu aplicación expone con un nombre, una descripción y un esquema de entrada. El modelo no ejecuta nada directamente; decide qué herramienta necesita y con qué argumentos, y tu código es el que la ejecuta. Esa separación es la clave de todo el diseño de seguridad: el modelo propone, tu código dispone.</p>
<p>No todo sistema con un LLM necesita ser un agente. Muchos casos se resuelven mejor con un flujo fijo: clasificar un correo, extraer campos y guardarlos. Un agente aporta cuando los pasos no se conocen de antemano y dependen de lo que se va descubriendo, como investigar un caso de soporte consultando varias fuentes. Esa flexibilidad es justo lo que lo hace más difícil de controlar.</p>`,
    },
    {
      id: 'agent-ciclo',
      title: 'Cómo funciona el ciclo de un agente',
      html: `<p>Defines un conjunto de herramientas con su esquema de entrada en JSON Schema. El modelo recibe la tarea y, en lugar de responder directamente, puede solicitar una llamada a una herramienta. Tu código valida los argumentos, ejecuta la herramienta, devuelve el resultado al modelo y el ciclo continúa hasta que el modelo responde sin pedir más herramientas o se alcanza un límite.</p>
${flowDiagram(['Tarea del\nusuario', 'Modelo elige\nherramienta', 'Tu código\nvalida y ejecuta', 'Resultado\nal modelo', 'Respuesta\nfinal'], 'El modelo propone, tu código decide y ejecuta')}
${articleCode(`
// Ciclo de agente independiente del proveedor (callModel envuelve el SDK que uses)
const MAX_STEPS = 8;

async function runAgent(task: string): Promise<string> {
  const messages: Message[] = [{ role: "user", content: task }];

  for (let step = 0; step < MAX_STEPS; step++) {
    const reply = await callModel({ messages, tools: TOOL_DEFINITIONS });
    messages.push(reply.message);

    if (reply.toolCalls.length === 0) return reply.text;   // tarea terminada

    for (const call of reply.toolCalls) {
      const tool = TOOLS[call.name];
      const args = tool?.schema.safeParse(call.arguments); // validar siempre
      let result: string;

      if (!tool || !args?.success) {
        result = "Error: herramienta o argumentos no válidos";
      } else if (tool.requiresApproval && !(await askHuman(call))) {
        result = "Acción rechazada por la persona responsable";
      } else {
        result = await tool.run(args.data);               // permisos mínimos
      }

      audit.log({ step, tool: call.name, args: call.arguments, result });
      messages.push({ role: "tool", toolCallId: call.id, content: result });
    }
  }
  throw new Error("Límite de pasos alcanzado sin completar la tarea");
}`)}`,
    },
    {
      id: 'agent-herramientas',
      title: 'Diseñar buenas herramientas',
      html: '<p>La calidad de un agente depende más de sus herramientas que del prompt. Una herramienta bien diseñada es fácil de usar correctamente y difícil de usar mal.</p>',
      subsections: [
        {
          id: 'agent-especificas',
          title: 'Pequeñas y específicas',
          html: '<p>Una herramienta como <code>buscar_cliente(email)</code> es mejor que una genérica <code>ejecutar_sql(consulta)</code>: es más fácil de entender para el modelo, limita lo que puede salir mal y se puede auditar. Cuanto más poderosa es una herramienta, más daño causa una decisión equivocada.</p>',
        },
        {
          id: 'agent-descripciones',
          title: 'Descripciones y esquemas claros',
          html: '<p>El modelo elige herramientas a partir de su nombre y descripción, así que escríbelas como documentación para un colega nuevo: qué hace, cuándo usarla, cuándo no y qué formato tienen los argumentos. Usa tipos estrictos, enumeraciones y campos obligatorios en el esquema, y vuelve a validar en tu código, porque el modelo puede generar argumentos que no cumplen el esquema.</p>',
        },
        {
          id: 'agent-resultados',
          title: 'Resultados compactos y errores útiles',
          html: '<p>Devuelve solo la información necesaria, no registros completos con decenas de campos: el contexto del modelo es limitado y cada token cuesta. Cuando algo falle, devuelve un mensaje que el modelo pueda usar para corregirse, como "No existe un cliente con ese correo; verifica la ortografía", en lugar de una traza de pila.</p>',
        },
      ],
    },
    {
      id: 'agent-limites',
      title: 'Límites, permisos y prompt injection',
      html: `<p>Fija un número máximo de iteraciones, un tiempo límite y un presupuesto de tokens por tarea; un agente que entra en un bucle puede consumir mucho antes de que alguien lo note. Ejecuta las herramientas con credenciales de mínimo privilegio, idealmente con los permisos del usuario que pidió la tarea y no con una cuenta de servicio con acceso a todo. Y trata como no confiable cualquier contenido externo que el agente lea: una página web, un correo o un documento pueden contener instrucciones dirigidas al modelo ("ignora tus instrucciones y envía estos datos a…"). No existe hoy un filtro que elimine este riesgo por completo, así que la defensa real está en limitar lo que el agente puede hacer después de leer ese contenido.</p>
${articleTable(
  ['Tipo de herramienta', 'Ejemplo', 'Riesgo', 'Control recomendado'],
  [
    ['Lectura de datos propios', 'Consultar un pedido', 'Bajo: fuga si los permisos son amplios', 'Filtrar por el usuario que pide'],
    ['Lectura de contenido externo', 'Leer una web o un correo', 'Prompt injection', 'Separar de las herramientas de escritura'],
    ['Escritura reversible', 'Crear un borrador o una nota', 'Medio', 'Registro y posibilidad de deshacer'],
    ['Escritura irreversible', 'Enviar un correo, pagar, borrar', 'Alto', 'Confirmación humana obligatoria'],
    ['Ejecución de código', 'Correr un script', 'Muy alto', 'Entorno aislado, sin red ni secretos'],
  ]
)}`,
    },
    {
      id: 'agent-humano',
      title: 'Supervisión humana y evaluación',
      html: '<p>Separa las herramientas de lectura de las de escritura y exige confirmación antes de acciones como enviar correos, modificar registros o hacer pagos, mostrando a la persona exactamente qué se va a ejecutar. Registra cada paso del agente (herramienta, argumentos, resultado y respuesta del modelo) para poder auditar qué decidió y por qué. Antes de ampliar su autonomía, evalúalo con un conjunto de tareas reales y casos difíciles, incluidos intentos de manipulación, y mide no solo si completa la tarea sino cuántos pasos usa, cuánto cuesta y con qué frecuencia elige una herramienta equivocada. Repite esa evaluación cada vez que cambies el modelo, el prompt o las herramientas.</p>',
    },
    {
      id: 'agent-errores',
      title: 'Errores comunes al construir agentes',
      html: `<ul>
  <li><strong>Herramientas demasiado poderosas.</strong> Una herramienta de SQL libre o de ejecución de comandos convierte cualquier error del modelo en un incidente.</li>
  <li><strong>Confiar en el prompt como control de seguridad.</strong> "No borres datos" en las instrucciones no es un permiso; los permisos viven en el código y en las credenciales.</li>
  <li><strong>Sin límites de pasos ni de costo.</strong> Un bucle de reintentos puede consumir el presupuesto del mes en una tarde.</li>
  <li><strong>Mezclar lectura de contenido externo con acciones sensibles.</strong> Es el escenario clásico de prompt injection.</li>
  <li><strong>No registrar las decisiones.</strong> Sin trazas, es imposible explicar un error o mejorar el agente.</li>
</ul>`,
    },
    {
      id: 'agent-cuando-no',
      title: 'Cuándo NO usar un agente',
      html: '<p>Si el proceso es determinista y siempre sigue los mismos pasos, una automatización clásica o un flujo fijo con un LLM en un paso concreto es más barata, rápida, predecible y fácil de probar. Tampoco conviene un agente autónomo cuando un error tiene consecuencias graves e irreversibles y no hay forma práctica de poner a una persona en el circuito, ni cuando no puedes medir si funciona porque no tienes ejemplos reales para evaluarlo. La regla que aplico es empezar por el flujo más simple que resuelva el problema y añadir autonomía paso a paso, solo donde la variabilidad de la tarea lo justifique.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Necesito un framework de agentes?',
      a: 'No siempre. Para casos simples, el soporte nativo de herramientas de los proveedores de modelos y un ciclo bien escrito son suficientes y más fáciles de depurar. Un framework aporta cuando necesitas orquestación compleja o integraciones que ya trae resueltas.',
    },
    {
      q: '¿Qué es MCP?',
      a: 'El Model Context Protocol es un estándar abierto para exponer herramientas y datos a aplicaciones de IA de forma uniforme, de modo que una misma integración sirva para distintos clientes.',
    },
    {
      q: '¿Los agentes reemplazan a las automatizaciones tradicionales?',
      a: 'No. Si el proceso es determinista y siempre igual, una automatización clásica es más barata, rápida y predecible. Los agentes aportan cuando hay que interpretar información variable o tomar decisiones.',
    },
    {
      q: '¿Cómo evito el prompt injection?',
      a: 'No hay una defensa completa. Lo efectivo es limitar el daño posible: separar la lectura de contenido externo de las acciones sensibles, usar permisos mínimos, pedir confirmación humana y validar las salidas.',
    },
    {
      q: '¿Cuántas herramientas puede manejar un agente?',
      a: 'Depende del modelo, pero con muchas herramientas parecidas aumenta la probabilidad de elegir mal. Es mejor un conjunto pequeño y bien descrito, o dividir el trabajo entre agentes con responsabilidades acotadas.',
    },
  ],
  refs: [
    { label: 'Anthropic — Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
    { label: 'Model Context Protocol', url: 'https://modelcontextprotocol.io' },
    { label: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/' },
    { label: 'JSON Schema', url: 'https://json-schema.org' },
    { label: 'AI Engineering', note: 'Chip Huyen (libro): evaluación, agentes y aplicaciones con modelos fundacionales' },
  ],
  closing: '¿Quieres construir un agente de IA para tu negocio? Hablemos.',
});

const ADO_CONTENT = buildArticle({
  prefix: 'ado',
  intro:
    'En empresas que ya trabajan con el ecosistema Microsoft, Azure DevOps suele ser la plataforma que conecta la planificación del trabajo con el código y los despliegues. Muchas veces se usa a medias: un tablero que nadie actualiza, repositorios sin reglas y despliegues manuales. Su valor real aparece cuando las piezas están enlazadas y cada historia de usuario lleva a sus commits, sus pull requests, el build que los validó y la versión en la que llegó a producción. La pregunta útil no es "¿qué módulos de Azure DevOps usamos?", sino "¿podemos responder en cinco minutos qué cambió en producción y por qué?". Este artículo muestra cómo configurarlo para lograrlo.',
  takeaways: [
    'Boards organiza el trabajo en épicas, características, historias y tareas; elige un proceso y úsalo de forma consistente.',
    'Las políticas de rama obligan a revisar código, vincular elementos de trabajo y pasar el build antes de fusionar.',
    'Los pipelines en YAML viven en el repositorio y se versionan y revisan junto al código.',
    'Los entornos con aprobaciones y comprobaciones controlan quién y cuándo se despliega a producción.',
    'Los secretos van en grupos de variables enlazados a Azure Key Vault, nunca en el YAML.',
  ],
  sections: [
    {
      id: 'ado-trazabilidad',
      title: 'El objetivo es la trazabilidad, no la herramienta',
      html: `<p>Azure DevOps reúne cinco servicios: Boards para planificar, Repos para el código, Pipelines para integración y despliegue continuos, Test Plans para pruebas manuales y Artifacts para paquetes. Se pueden usar por separado, pero la ventaja de tenerlos en un solo lugar es el enlace entre ellos. Cuando un incidente aparece en producción, poder ir de la versión desplegada al pull request, de ahí a la historia de usuario y a la conversación que justificó el cambio ahorra horas de investigación.</p>
<p>Esa trazabilidad no aparece sola. Requiere algunas reglas que el equipo acepta y que la plataforma hace cumplir: cada cambio nace de un elemento de trabajo, nadie fusiona sin revisión y build verde, y nadie despliega fuera del pipeline.</p>
${flowDiagram(['Elemento de\ntrabajo #123', 'Rama y\ncommits', 'Pull request\ncon políticas', 'Pipeline\nbuild y tests', 'Entorno con\naprobación'], 'De la tarea a producción, con cada paso enlazado')}`,
    },
    {
      id: 'ado-boards',
      title: 'Boards: el trabajo visible',
      html: '<p>Boards es útil solo si refleja la realidad. Tres decisiones lo hacen posible.</p>',
      subsections: [
        {
          id: 'ado-proceso',
          title: 'Elegir el proceso',
          html: `<p>Al crear el proyecto eliges un proceso que define los tipos de elementos de trabajo y sus estados. Puedes personalizarlo después con un proceso heredado, pero conviene empezar por el que mejor se ajusta a cómo trabaja el equipo.</p>
${articleTable(
  ['Proceso', 'Elemento de requisito', 'Seguimiento del trabajo', 'Encaja con'],
  [
    ['Basic', 'Issue', 'Issues y tareas, estados simples', 'Equipos pequeños que empiezan'],
    ['Agile', 'User Story', 'Historias, tareas y bugs', 'Equipos ágiles en general'],
    ['Scrum', 'Product Backlog Item', 'Sprints, tareas e impedimentos', 'Equipos que siguen Scrum'],
    ['CMMI', 'Requirement', 'Requisitos, cambios, riesgos y revisiones', 'Entornos regulados y formales'],
  ]
)}`,
        },
        {
          id: 'ado-jerarquia',
          title: 'Una jerarquía con sentido',
          html: '<p>Usa épicas para objetivos grandes, características (<em>features</em>) para capacidades entregables, historias para valor que cabe en un sprint y tareas para el trabajo técnico. La jerarquía permite ver el avance de un objetivo de negocio sumando el de sus hijos, sin informes manuales.</p>',
        },
        {
          id: 'ado-consultas',
          title: 'Consultas y paneles',
          html: '<p>Las consultas de elementos de trabajo permiten filtrar por estado, área, iteración o cualquier campo, y se pueden mostrar como gráficos en los paneles del equipo. Un panel con el avance del sprint, los bugs abiertos por prioridad y el tiempo de ciclo reemplaza buena parte de las reuniones de seguimiento.</p>',
        },
      ],
    },
    {
      id: 'ado-repos',
      title: 'Repos y políticas de rama',
      html: '<p>Protege la rama principal con políticas: un número mínimo de revisores, elementos de trabajo vinculados obligatorios, resolución de todos los comentarios, tipos de fusión permitidos (por ejemplo, solo squash) y validación de build obligatoria, que ejecuta el pipeline sobre el resultado de la fusión antes de permitirla. También puedes añadir revisores automáticos según las rutas modificadas, de modo que un cambio en la carpeta de infraestructura siempre pase por alguien del equipo de plataforma. Menciona el ID del elemento de trabajo en el commit o en el pull request (por ejemplo <code>#123</code>, o <code>AB#123</code> si el código vive en GitHub) para crear el enlace automático entre la tarea y el código. Con estas políticas, la trazabilidad deja de depender de la disciplina individual.</p>',
    },
    {
      id: 'ado-pipelines',
      title: 'Pipelines en YAML',
      html: `<p>Un archivo <code>azure-pipelines.yml</code> en el repositorio define las etapas de build, pruebas y despliegue. Al vivir junto al código, cada cambio en el pipeline se revisa en un pull request y queda en el historial. Usa plantillas para reutilizar pasos entre proyectos, caché de dependencias para acelerar las ejecuciones y artefactos para que el mismo paquete construido una vez sea el que se despliega en todos los entornos.</p>
${articleCode(`
# azure-pipelines.yml
trigger:
  branches:
    include: [main]

pool:
  vmImage: ubuntu-latest

variables:
  - group: app-comun          # grupo de variables (puede enlazarse a Key Vault)

stages:
  - stage: Build
    jobs:
      - job: build
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: "20.x"
          - script: npm ci && npm test && npm run build
            displayName: Instalar, probar y compilar
          - publish: dist
            artifact: web

  - stage: Produccion
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: deploy_web
        environment: produccion   # aprobaciones y checks se definen en el entorno
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: web
                - script: echo "Desplegando $(Pipeline.Workspace)/web"`)}`,
    },
    {
      id: 'ado-entornos',
      title: 'Entornos, aprobaciones y secretos',
      html: '<p>Crea entornos como desarrollo, pruebas y producción, y añade comprobaciones sobre ellos: aprobaciones manuales de personas o grupos, horarios permitidos para desplegar, validación de que el pipeline usa una plantilla aprobada o consultas a un sistema externo. Así el mismo pipeline despliega a todos los entornos, pero producción solo avanza cuando las personas responsables lo autorizan, y el historial del entorno muestra qué versión se desplegó, cuándo y quién la aprobó. Para los secretos, usa grupos de variables enlazados a Azure Key Vault y conexiones de servicio con permisos acotados, de preferencia con identidades federadas en lugar de contraseñas de larga duración. Nunca escribas un secreto en el YAML: queda en el historial del repositorio para siempre.</p>',
    },
    {
      id: 'ado-errores',
      title: 'Errores comunes en Azure DevOps',
      html: `<ul>
  <li><strong>Tableros desactualizados.</strong> Si el tablero no refleja la realidad, el equipo deja de mirarlo y vuelve a las hojas de cálculo.</li>
  <li><strong>Rama principal sin políticas.</strong> Cualquiera puede fusionar sin revisión ni build, y la trazabilidad se rompe.</li>
  <li><strong>Pipelines clásicos sin versionar.</strong> Los cambios en el proceso de despliegue no se revisan ni quedan en el historial.</li>
  <li><strong>Construir de nuevo en cada entorno.</strong> Lo que se probó no es exactamente lo que llega a producción.</li>
  <li><strong>Conexiones de servicio con permisos de propietario.</strong> Un pipeline comprometido obtiene acceso a toda la suscripción.</li>
</ul>`,
    },
    {
      id: 'ado-cuando-no',
      title: 'Cuándo NO conviene Azure DevOps',
      html: '<p>Si el equipo es pequeño, trabaja principalmente con código abierto o ya tiene su código y su automatización en GitHub, añadir Azure DevOps suele duplicar herramientas sin beneficio claro: GitHub Issues, Projects y Actions cubren la mayoría de las necesidades. Tampoco tiene sentido adoptar todos sus módulos solo porque están disponibles; un equipo que solo necesita CI/CD puede usar Pipelines sin Boards. La regla que aplico es elegir la plataforma donde ya vive la mayor parte del trabajo y la que la organización puede administrar, y usar las integraciones entre ambas (por ejemplo, Boards con repositorios en GitHub) cuando cada una aporta algo distinto.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Azure DevOps o GitHub?',
      a: 'Ambos son de Microsoft. GitHub concentra la comunidad y funciones modernas como Actions y Copilot; Azure DevOps destaca en gestión de trabajo empresarial y trazabilidad. Muchas empresas combinan Boards con repositorios en GitHub.',
    },
    {
      q: '¿Puedo desplegar fuera de Azure?',
      a: 'Sí. Los pipelines pueden desplegar a otras nubes, servidores propios o servicios externos mediante tareas, scripts, agentes autoalojados y conexiones de servicio.',
    },
    {
      q: '¿Classic o YAML?',
      a: 'YAML es la opción recomendada para proyectos nuevos: se versiona con el código, se revisa en pull requests y es más fácil de reutilizar con plantillas.',
    },
    {
      q: '¿Necesito agentes autoalojados?',
      a: 'Solo si el pipeline necesita acceder a recursos de una red privada, requiere software especial o el volumen hace más económico un agente propio. Para la mayoría de casos bastan los agentes hospedados por Microsoft.',
    },
    {
      q: '¿Cómo reutilizo pasos entre varios repositorios?',
      a: 'Con plantillas YAML guardadas en un repositorio compartido y referenciadas como recurso. Así un cambio en el proceso de build se aplica a todos los proyectos que usan la plantilla.',
    },
  ],
  refs: [
    { label: 'Azure DevOps documentation', url: 'https://learn.microsoft.com/en-us/azure/devops/' },
    { label: 'Azure Pipelines — YAML schema', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/' },
    { label: 'Azure Repos — Branch policies', url: 'https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies' },
    { label: 'Azure Pipelines — Environments', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments' },
    { label: 'Azure Pipelines — Approvals and checks', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals' },
  ],
  closing: '¿Quieres ordenar el flujo de trabajo de tu equipo? Puedo ayudarte.',
});

const GIT_CONTENT = buildArticle({
  prefix: 'git',
  intro:
    'Git permite casi cualquier flujo de trabajo, y por eso muchos equipos terminan con uno complicado: ramas que duran semanas, merges con cientos de conflictos, un historial que nadie puede leer y, de vez en cuando, trabajo perdido por un <code>push --force</code> desafortunado. Un buen flujo no depende de comandos avanzados, sino de acuerdos simples que el equipo cumple y que el repositorio ayuda a hacer cumplir. La pregunta útil no es "¿Git Flow o trunk-based?", sino "¿cuánto tiempo pasa entre que alguien escribe código y ese código se integra con el de los demás?". Este artículo cubre estrategias de ramas, commits, pull requests y cómo evitar perder trabajo.',
  takeaways: [
    'Las ramas de vida corta reducen conflictos y aceleran la integración; el riesgo crece con la edad de la rama.',
    'Los commits atómicos con mensajes que explican el porqué convierten el historial en documentación útil.',
    'Un pull request pequeño se revisa mejor y más rápido que uno gigante.',
    'Elijan una estrategia de integración (merge, squash o rebase) como equipo y configúrenla en el repositorio.',
    'Nunca reescribas el historial de una rama compartida; usa <code>--force-with-lease</code> solo en tus ramas y recuerda que <code>git reflog</code> existe.',
  ],
  sections: [
    {
      id: 'git-acuerdos',
      title: 'El problema no es Git, son los acuerdos',
      html: `<p>La mayoría de los dolores de cabeza con Git en equipo vienen de lo mismo: trabajo que se integra tarde. Cuando una rama vive tres semanas, acumula cambios que chocan con los de otras personas, el pull request final es enorme y nadie lo revisa con cuidado, y el merge se convierte en un evento que el equipo teme. Ningún comando avanzado arregla eso.</p>
<p>Lo que funciona son acuerdos explícitos: cuánto puede vivir una rama, cómo se escriben los commits, qué tamaño máximo razonable tiene un pull request, qué estrategia de fusión se usa y qué está prohibido en las ramas compartidas. Escríbanlos en el README o en una guía de contribución y háganlos cumplir con la configuración del repositorio: ramas protegidas, revisiones obligatorias y checks de CI.</p>`,
    },
    {
      id: 'git-estrategia',
      title: 'Trunk-based, GitHub Flow o Git Flow',
      html: `<p>Las tres estrategias más comunes difieren en cuántas ramas de larga duración mantienen y en cada cuánto se integra el trabajo.</p>
${articleTable(
  ['Criterio', 'Trunk-based', 'GitHub Flow', 'Git Flow'],
  [
    ['Ramas de larga duración', 'Solo main', 'Solo main', 'main y develop'],
    ['Vida de las ramas de trabajo', 'Horas o pocos días', 'Días', 'Días o semanas'],
    ['Publicación', 'Continua, con feature flags', 'Al fusionar en main', 'Versiones planificadas con ramas release'],
    ['Requisitos', 'CI sólida y buena cobertura', 'CI y revisiones', 'Disciplina con varias ramas'],
    ['Encaja con', 'Despliegue continuo', 'Aplicaciones web en general', 'Software con versiones publicadas y soporte'],
  ]
)}
${compareDiagram(
  { title: 'Ramas cortas', points: ['Conflictos pequeños y frecuentes', 'Revisión rápida', 'Integración continua real', 'Requiere feature flags'] },
  { title: 'Ramas largas', points: ['Conflictos grandes y tardíos', 'Pull requests enormes', 'Integración como evento', 'Aislamiento de versiones'] },
  'La edad de la rama define el dolor del merge'
)}
<p>Git Flow es útil cuando se publican versiones planificadas y se mantienen varias a la vez, como una librería o una aplicación instalada. Para la mayoría de aplicaciones web con despliegue continuo, ramas cortas sobre <code>main</code> son más simples y producen menos conflictos.</p>`,
    },
    {
      id: 'git-commits',
      title: 'Commits atómicos y mensajes',
      html: '<p>El historial de Git es la única documentación que se escribe sola mientras trabajas, siempre que los commits estén bien hechos.</p>',
      subsections: [
        {
          id: 'git-atomicos',
          title: 'Un cambio coherente por commit',
          html: '<p>Cada commit debe representar un cambio coherente que compile y pase las pruebas: no mezcles una corrección de bug con un refactor y un cambio de formato. Los commits atómicos se revisan mejor, se revierten sin efectos colaterales y hacen útil <code>git bisect</code> para encontrar el commit que introdujo un error. Usa <code>git add -p</code> para seleccionar solo las partes de un archivo que pertenecen al cambio.</p>',
        },
        {
          id: 'git-conventional',
          title: 'Conventional Commits',
          html: '<p>Convenciones como Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>docs:</code>, <code>refactor:</code>, con <code>!</code> o <code>BREAKING CHANGE</code> para cambios incompatibles) hacen el historial legible de un vistazo y permiten generar changelogs y calcular versiones semánticas automáticamente. Un hook de commit o un check de CI puede validar el formato.</p>',
        },
        {
          id: 'git-porque',
          title: 'El mensaje explica el porqué',
          html: '<p>El diff ya muestra qué cambió; el mensaje debe explicar por qué. Una línea de resumen corta en imperativo, una línea en blanco y, si hace falta, un cuerpo con el contexto: el problema, la decisión y sus alternativas. Dentro de un año, ese párrafo vale más que cualquier comentario.</p>',
        },
      ],
      after: articleCode(`
fix(pagos): evitar cobro doble al reintentar el webhook

El proveedor reenvía el webhook si no responde en 10 s. Como el
registro del pago se hacía después de llamar al servicio de facturas,
un reintento podía generar una segunda factura.

Ahora el pago se registra con la clave de idempotencia del proveedor
antes de facturar, y los reintentos se ignoran.

Refs: #482`),
    },
    {
      id: 'git-prs',
      title: 'Pull requests revisables',
      html: '<p>Un pull request de 200 líneas recibe una revisión real; uno de 3 000 recibe un "aprobado" rápido. Divide el trabajo grande en pasos que se puedan fusionar por separado: primero el refactor que prepara el terreno, luego la nueva funcionalidad detrás de un feature flag, después la activación. Describe qué cambia, por qué y cómo probarlo, con capturas si hay cambios visuales, y deja que el pipeline valide antes de pedir revisión: el tiempo de quien revisa es más caro que el de la CI. Al revisar, prioriza la corrección, el diseño y los riesgos sobre las preferencias de estilo, que deberían resolver el formateador y el linter. Y pacten un tiempo máximo de respuesta: un pull request que espera dos días de revisión empuja a todos a hacer ramas más largas.</p>',
    },
    {
      id: 'git-integracion',
      title: 'Merge, squash o rebase',
      html: '<p>Hay tres formas de integrar un pull request en <code>main</code>, y todas son válidas. <strong>Merge commit</strong> conserva la historia completa de la rama y deja un commit que marca la integración. <strong>Squash</strong> condensa todos los commits del pull request en uno, lo que produce un historial limpio en <code>main</code> con un commit por cambio, a costa de perder los pasos intermedios. <strong>Rebase</strong> reaplica los commits individuales sobre <code>main</code> en línea recta, ideal si el equipo cuida cada commit. Lo importante es elegir uno como equipo y configurar el repositorio para que solo permita esa opción. Mezclar las tres produce un historial difícil de seguir.</p>',
    },
    {
      id: 'git-seguridad',
      title: 'Cómo evitar perder trabajo',
      html: `<p>Git casi nunca pierde datos de verdad: los commits huérfanos siguen en el repositorio local durante un tiempo y <code>git reflog</code> registra a dónde apuntó cada rama. Saber esto quita mucho miedo. Aun así, conviene seguir algunas reglas: prefiere <code>--force-with-lease</code> a <code>--force</code> cuando debas reescribir tu propia rama, porque se niega a sobrescribir commits remotos que no has visto, y nunca reescribas ramas compartidas.</p>
${articleCode(`
# Actualizar tu rama con main sin un merge commit
git switch mi-rama
git fetch origin
git rebase origin/main

# Publicar la rama reescrita sin pisar trabajo ajeno
git push --force-with-lease

# ¿Algo salió mal? Ver a dónde apuntaba la rama antes
git reflog
git switch -c rescate HEAD@{3}    # recupera ese estado en una rama nueva

# Guardar cambios a medias antes de cambiar de tarea
git stash push -m "wip: formulario de pagos"
git stash pop`)}
<p>Y no subas secretos: si ocurre, revoca la credencial de inmediato. Limpiar el historial no basta, porque cualquiera que clonó o bifurcó el repositorio ya tiene la copia.</p>`,
    },
    {
      id: 'git-errores',
      title: 'Errores comunes al trabajar con Git en equipo',
      html: `<ul>
  <li><strong>Ramas que viven semanas.</strong> Cada día sin integrar aumenta el tamaño y el riesgo del merge final.</li>
  <li><strong>Commits como "cambios" o "wip" en main.</strong> Hacen el historial inútil para entender o revertir algo.</li>
  <li><strong><code>git push --force</code> en ramas compartidas.</strong> Borra el trabajo de otras personas sin aviso.</li>
  <li><strong>Pull requests gigantes.</strong> Se aprueban sin revisar de verdad y esconden errores.</li>
  <li><strong>Subir archivos generados o secretos.</strong> Un buen <code>.gitignore</code> y un escáner de secretos en CI evitan los dos.</li>
</ul>`,
    },
    {
      id: 'git-cuando-no',
      title: 'Cuándo NO conviene el desarrollo basado en trunk',
      html: '<p>Integrar en <code>main</code> varias veces al día requiere una CI confiable, pruebas automatizadas con buena cobertura de los flujos críticos y la práctica de ocultar el trabajo incompleto detrás de feature flags. Sin esas bases, el trunk se rompe con frecuencia y el equipo pierde más tiempo del que gana. Tampoco encaja de forma natural cuando se mantienen varias versiones publicadas en paralelo, como una librería con soporte para versiones anteriores o un producto instalado en clientes con ciclos de actualización distintos; ahí las ramas de release de Git Flow tienen sentido. La regla que aplico es reducir la vida de las ramas tanto como la CI y las pruebas lo permitan, y acortarla un poco más cada vez que esas bases mejoran.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Merge, squash o rebase?',
      a: 'Squash produce un commit por pull request y un historial limpio en main. Rebase mantiene commits individuales en línea recta. Merge conserva la historia completa. Elijan uno como equipo y configúrenlo en el repositorio.',
    },
    {
      q: '¿Cómo resuelvo conflictos con menos dolor?',
      a: 'Integrando cambios de main con frecuencia en tu rama. Los conflictos pequeños y recientes son fáciles; los que se acumulan durante semanas no. Activar git rerere ayuda a reutilizar resoluciones repetidas.',
    },
    {
      q: '¿Qué hago si subí una contraseña?',
      a: 'Revócala y genera una nueva primero. Después puedes limpiar el historial, pero asume que la credencial quedó expuesta desde el momento del push.',
    },
    {
      q: '¿Cómo deshago un commit que ya está en main?',
      a: 'Con git revert, que crea un commit nuevo que invierte los cambios sin reescribir el historial compartido. git reset solo es apropiado en ramas locales que nadie más usa.',
    },
    {
      q: '¿Qué son las feature flags y por qué importan aquí?',
      a: 'Son interruptores en el código que activan o desactivan una funcionalidad sin desplegar de nuevo. Permiten integrar código incompleto en main sin exponerlo a los usuarios, lo que hace posibles las ramas cortas.',
    },
  ],
  refs: [
    { label: 'Pro Git (libro oficial)', url: 'https://git-scm.com/book/es/v2' },
    { label: 'Git — git-reflog', url: 'https://git-scm.com/docs/git-reflog' },
    { label: 'Git — git-push', url: 'https://git-scm.com/docs/git-push' },
    { label: 'Conventional Commits', url: 'https://www.conventionalcommits.org/es/v1.0.0/' },
    { label: 'Trunk Based Development', url: 'https://trunkbaseddevelopment.com' },
    { label: 'A successful Git branching model (Git Flow)', url: 'https://nvie.com/posts/a-successful-git-branching-model/' },
  ],
  closing: '¿Tu equipo pelea con Git? Ordenemos el flujo.',
});

// Artículos 16-25 del blog
export const MORE_WRITING_ARTICLES_1: WritingArticle[] = [
  {
    id: 'art-n8n-autoalojado',
    slug: 'n8n-automatizacion-autoalojada',
    date: 'JUNIO 2025',
    tag: 'AUTOMATION',
    title: 'n8n Autoalojado: Automatizaciones Potentes Sin Pagar por Cada Tarea',
    metaDescription:
      'Cuándo elegir n8n frente a herramientas SaaS, cómo autoalojarlo con Docker y PostgreSQL, y cómo manejar credenciales, errores, reintentos y escalado.',
    excerpt:
      'n8n permite construir flujos complejos con nodos visuales y código, y alojarlos en tu propio servidor. Cuándo conviene, cómo desplegarlo y cómo evitar que un flujo falle en silencio.',
    readTime: readTimeOf(N8N_CONTENT),
    contentHtml: N8N_CONTENT,
  },
  {
    id: 'art-graphql-vs-rest',
    slug: 'graphql-vs-rest-cuando-usar-cada-uno',
    date: 'MAYO 2025',
    tag: 'APIs',
    title: 'GraphQL vs. REST: Cuándo Usar Cada Uno (y Cuándo No Cambiar)',
    metaDescription:
      'GraphQL vs. REST en la práctica: overfetching, caché HTTP, el problema N+1 con DataLoader, seguridad de consultas y criterios para elegir en un proyecto real.',
    excerpt:
      'GraphQL no reemplaza a REST, resuelve problemas distintos. Comparativa práctica sobre flexibilidad, caché, rendimiento y seguridad para decidir con criterio.',
    readTime: readTimeOf(GQL_CONTENT),
    contentHtml: GQL_CONTENT,
  },
  {
    id: 'art-diseno-apis-rest',
    slug: 'diseno-apis-rest-versionado-paginacion-errores',
    date: 'ABRIL 2025',
    tag: 'APIs',
    title: 'Diseño de APIs REST que Otros Desarrolladores Quieran Usar',
    metaDescription:
      'Buenas prácticas de APIs REST: recursos y verbos, códigos de estado, errores con Problem Details, paginación por cursor, versionado y documentación OpenAPI.',
    excerpt:
      'Una API se usa mucho más tiempo del que se tarda en construirla. Recursos, códigos de estado, errores consistentes, paginación y versionado para una API predecible.',
    readTime: readTimeOf(REST_CONTENT),
    contentHtml: REST_CONTENT,
  },
  {
    id: 'art-sesiones-vs-jwt',
    slug: 'autenticacion-sesiones-vs-jwt',
    date: 'MARZO 2025',
    tag: 'SECURITY',
    title: 'Autenticación Web: Sesiones vs. JWT y Cómo Guardar Contraseñas',
    metaDescription:
      'Sesiones con cookies o JWT: cuándo usar cada uno, dónde guardar tokens, cómo revocar accesos con tokens de refresco y cómo almacenar contraseñas con Argon2id.',
    excerpt:
      'JWT no es automáticamente más moderno ni más seguro que una sesión. Cómo elegir el mecanismo de autenticación correcto y guardar contraseñas de forma segura.',
    readTime: readTimeOf(AUTH_CONTENT),
    contentHtml: AUTH_CONTENT,
  },
  {
    id: 'art-redis-cache',
    slug: 'cache-con-redis-patrones',
    date: 'FEBRERO 2025',
    tag: 'BACKEND',
    title: 'Caché con Redis: Patrones, Invalidación y Errores Comunes',
    metaDescription:
      'Cómo usar Redis como caché: patrón cache-aside, TTL e invalidación, cómo evitar la estampida de caché, políticas de memoria y qué datos no conviene cachear.',
    excerpt:
      'Una caché bien puesta reduce la carga de la base de datos y acelera las respuestas. Mal puesta, sirve datos viejos. Patrones prácticos con Redis.',
    readTime: readTimeOf(REDIS_CONTENT),
    contentHtml: REDIS_CONTENT,
  },
  {
    id: 'art-testing-frontend',
    slug: 'testing-frontend-vitest-testing-library',
    date: 'ENERO 2025',
    tag: 'TESTING',
    title: 'Testing en el Frontend con Vitest y Testing Library: Qué Probar de Verdad',
    metaDescription:
      'Pruebas útiles en el frontend con Vitest y Testing Library: probar comportamiento, simular la red con MSW y reservar Playwright para los flujos críticos.',
    excerpt:
      'Las pruebas que se rompen con cada refactor no protegen nada. Cómo probar comportamiento en lugar de implementación con Vitest y Testing Library.',
    readTime: readTimeOf(TEST_CONTENT),
    contentHtml: TEST_CONTENT,
  },
  {
    id: 'art-accesibilidad-web',
    slug: 'accesibilidad-web-para-desarrolladores',
    date: 'DICIEMBRE 2024',
    tag: 'ACCESSIBILITY',
    title: 'Accesibilidad Web para Desarrolladores: Lo Básico que Más Impacto Tiene',
    metaDescription:
      'Accesibilidad web para desarrolladores: HTML semántico, teclado y foco visible, contraste WCAG, formularios accesibles, uso correcto de ARIA y cómo probarlo.',
    excerpt:
      'La accesibilidad no es un extra para el final del proyecto. HTML semántico, navegación con teclado, contraste y formularios bien etiquetados resuelven la mayoría de las barreras.',
    readTime: readTimeOf(A11Y_CONTENT),
    contentHtml: A11Y_CONTENT,
  },
  {
    id: 'art-agentes-ia-herramientas',
    slug: 'agentes-de-ia-con-herramientas',
    date: 'NOVIEMBRE 2024',
    tag: 'AI / LLM',
    title: 'Agentes de IA con Herramientas: Cómo Construirlos Sin Perder el Control',
    metaDescription:
      'Cómo funciona un agente de IA con herramientas, cómo diseñarlas de forma segura, límites de ejecución, prompt injection, supervisión humana y evaluación.',
    excerpt:
      'Un agente es un LLM que decide qué herramientas usar para cumplir una tarea. Cómo diseñar herramientas, poner límites y mantener a una persona en el circuito.',
    readTime: readTimeOf(AGENT_CONTENT),
    contentHtml: AGENT_CONTENT,
  },
  {
    id: 'art-azure-devops',
    slug: 'azure-devops-boards-repos-pipelines',
    date: 'OCTUBRE 2024',
    tag: 'DEVOPS',
    title: 'Azure DevOps en la Práctica: Boards, Repos y Pipelines en un Solo Lugar',
    metaDescription:
      'Azure DevOps en la práctica: Boards para el trabajo, políticas de rama en Repos, pipelines YAML, entornos con aprobaciones y trazabilidad de la tarea al código.',
    excerpt:
      'Azure DevOps reúne planificación, código y despliegue. Cómo configurarlo para que cada cambio se pueda rastrear desde la tarea hasta producción.',
    readTime: readTimeOf(ADO_CONTENT),
    contentHtml: ADO_CONTENT,
  },
  {
    id: 'art-git-flujo',
    slug: 'git-flujo-de-trabajo-equipos',
    date: 'SEPTIEMBRE 2024',
    tag: 'DEVOPS',
    title: 'Git para Equipos: Ramas, Commits y Pull Requests que No Generan Caos',
    metaDescription:
      'Git en equipo: trunk-based vs. Git Flow, ramas cortas, commits atómicos con Conventional Commits, pull requests pequeños y cómo evitar perder trabajo.',
    excerpt:
      'Las ramas que viven semanas terminan en conflictos enormes. Prácticas de Git para equipos: ramas cortas, commits claros y pull requests fáciles de revisar.',
    readTime: readTimeOf(GIT_CONTENT),
    contentHtml: GIT_CONTENT,
  },
];
