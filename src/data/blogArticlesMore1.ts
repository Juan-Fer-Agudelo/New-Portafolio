import { WritingArticle } from '../types';
import { buildArticle } from './blogArticles';

// Artículos 16-25 del blog (misma estructura que el resto: intro, puntos clave, índice, secciones, FAQs y referencias)
export const MORE_WRITING_ARTICLES_1: WritingArticle[] = [
  {
    id: 'art-n8n-autoalojado',
    slug: 'n8n-automatizacion-autoalojada',
    date: 'JUNIO 2025',
    tag: 'AUTOMATION',
    title: 'n8n Autoalojado: Automatizaciones Potentes Sin Pagar por Cada Tarea',
    metaDescription:
      'Cuándo elegir n8n frente a herramientas SaaS, cómo autoalojarlo con Docker, manejar credenciales, errores y reintentos, y usar nodos de código para lógica compleja.',
    excerpt:
      'n8n permite construir flujos complejos con nodos visuales y código, y alojarlos en tu propio servidor. Cuándo conviene, cómo desplegarlo y cómo evitar que un flujo falle en silencio.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'n8n',
      intro:
        'Las plataformas de automatización SaaS cobran por tarea ejecutada, y cuando un proceso pasa de cientos a decenas de miles de ejecuciones al mes, la factura crece rápido. n8n ofrece otro modelo: un editor visual de flujos que puedes alojar en tu propio servidor, con la opción de escribir código cuando los nodos visuales no alcanzan. Lo he usado para procesos como la actualización diaria de tasas de cambio, y estas son las lecciones prácticas.',
      takeaways: [
        'n8n combina nodos visuales con nodos de código en JavaScript o Python para la lógica que no cabe en un formulario.',
        'Autoalojado, el costo depende del servidor y no del número de ejecuciones.',
        'Autoalojar implica responsabilidad: actualizaciones, copias de seguridad, HTTPS y control de acceso son tuyos.',
        'Un workflow de errores dedicado evita que una automatización crítica falle sin que nadie se entere.',
      ],
      sections: [
        {
          id: 'n8n-cuando',
          title: 'Cuándo elegir n8n',
          html: '<p>n8n encaja cuando el volumen de ejecuciones es alto, los datos no deben salir de tu infraestructura o la lógica necesita transformaciones que serían incómodas en una herramienta puramente visual. Si el equipo no tiene a nadie que mantenga un servidor y el volumen es bajo, una plataforma SaaS sigue siendo la opción más simple.</p>',
        },
        {
          id: 'n8n-despliegue',
          title: 'Despliegue con Docker',
          html: '<p>La forma más directa de autoalojar n8n es con su imagen oficial de Docker, un volumen persistente para los datos y una base de datos PostgreSQL en lugar de la SQLite por defecto cuando el uso es serio. Colócalo detrás de un proxy inverso con HTTPS, protege el acceso al editor y define una clave de cifrado propia para las credenciales guardadas.</p>',
        },
        {
          id: 'n8n-errores',
          title: 'Errores y reintentos',
          html: '<p>Configura un workflow de errores que reciba cualquier fallo y envíe una alerta por correo o Slack con el nombre del flujo y el mensaje. En los nodos que llaman APIs externas activa los reintentos con espera, y diseña los pasos para que repetirlos no duplique registros.</p>',
        },
        {
          id: 'n8n-codigo',
          title: 'Nodos de código con criterio',
          html: '<p>El nodo de código es muy útil para mapear datos o aplicar reglas de negocio, pero si un flujo se convierte en un gran bloque de código, pierdes la ventaja visual. Mantén cada nodo de código pequeño, con una responsabilidad clara, y documenta qué espera recibir y qué devuelve.</p>',
        },
      ],
      faqs: [
        {
          q: '¿n8n es gratis?',
          a: 'Tiene una edición comunitaria que puedes autoalojar y una versión en la nube de pago. Revisa la licencia y los planes actuales en su sitio, porque algunas funciones empresariales requieren licencia.',
        },
        {
          q: '¿Puedo migrar mis zaps a n8n?',
          a: 'No hay una conversión automática, pero la lógica suele trasladarse bien: el disparador se convierte en un nodo trigger o webhook y cada acción en un nodo de la integración correspondiente.',
        },
        {
          q: '¿Qué servidor necesito?',
          a: 'Para cargas moderadas basta un VPS pequeño. Si el volumen crece, n8n admite un modo con colas y workers para repartir las ejecuciones.',
        },
      ],
      refs: [
        { label: 'n8n Docs', url: 'https://docs.n8n.io' },
        { label: 'n8n — Docker installation', url: 'https://docs.n8n.io/hosting/installation/docker/' },
      ],
      closing: '¿Quieres llevar tus automatizaciones a tu propio servidor? Puedo ayudarte.',
    }),
  },
  {
    id: 'art-graphql-vs-rest',
    slug: 'graphql-vs-rest-cuando-usar-cada-uno',
    date: 'MAYO 2025',
    tag: 'APIs',
    title: 'GraphQL vs. REST: Cuándo Usar Cada Uno (y Cuándo No Cambiar)',
    metaDescription:
      'Diferencias prácticas entre GraphQL y REST: overfetching, esquemas tipados, caché, el problema N+1, seguridad de consultas y criterios para elegir en un proyecto real.',
    excerpt:
      'GraphQL no reemplaza a REST, resuelve problemas distintos. Comparativa práctica sobre flexibilidad, caché, rendimiento y seguridad para decidir con criterio.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'gql',
      intro:
        'La discusión entre GraphQL y REST suele plantearse como una guerra, cuando en realidad son herramientas con fortalezas diferentes. REST aprovecha la infraestructura de HTTP de forma natural; GraphQL da al cliente control sobre la forma exacta de los datos. Elegir bien depende de quién consume la API y de cómo cambian sus necesidades.',
      takeaways: [
        'GraphQL evita pedir datos de más o de menos: el cliente declara exactamente los campos que necesita.',
        'REST aprovecha la caché HTTP de forma nativa; en GraphQL la caché requiere más trabajo.',
        'Los resolvers ingenuos generan el problema N+1; DataLoader o técnicas de batching lo resuelven.',
        'Una API GraphQL pública necesita límites de profundidad y complejidad para evitar consultas abusivas.',
      ],
      sections: [
        {
          id: 'gql-diferencia',
          title: 'La diferencia de fondo',
          html: '<p>En REST cada recurso tiene su URL y el servidor decide qué devuelve. En GraphQL hay un único endpoint y un esquema tipado; el cliente escribe una consulta con los campos que quiere, incluso de recursos relacionados, y recibe exactamente esa forma. Esto brilla cuando varias interfaces (web, móvil, paneles) consumen los mismos datos con necesidades distintas.</p>',
        },
        {
          id: 'gql-cache',
          title: 'Caché y rendimiento',
          html: '<p>Las respuestas REST con GET se cachean en navegadores, CDN y proxies usando cabeceras estándar. GraphQL suele usar POST a un solo endpoint, así que la caché se traslada al cliente (Apollo, urql, Relay) o a consultas persistidas. Si tu API es mayormente pública y de lectura, REST con buena caché HTTP es difícil de superar.</p>',
        },
        {
          id: 'gql-n1',
          title: 'El problema N+1',
          html: '<p>Si pides 50 pedidos con su cliente y cada resolver de cliente hace una consulta, terminas con 51 consultas a la base de datos. La solución estándar es agrupar las cargas por petición con un patrón como DataLoader, que junta los IDs solicitados y los resuelve en una sola consulta.</p>',
        },
        {
          id: 'gql-elegir',
          title: 'Cómo elegir',
          html: '<p>REST es buena opción para APIs públicas, integraciones con terceros, webhooks y servicios simples. GraphQL aporta más cuando hay muchos clientes con necesidades distintas, datos muy relacionados y un equipo frontend que itera rápido. Si ya tienes una API REST que funciona, no la reescribas por moda: puedes añadir GraphQL como capa sobre servicios existentes cuando el caso lo justifique.</p>',
        },
      ],
      faqs: [
        {
          q: '¿GraphQL es más rápido que REST?',
          a: 'No por sí mismo. Puede reducir el número de peticiones y el tamaño de las respuestas, pero un resolver mal escrito puede ser más lento que un endpoint REST bien diseñado.',
        },
        {
          q: '¿Cómo protejo una API GraphQL?',
          a: 'Con autenticación y autorización por campo o resolver, límites de profundidad y complejidad, timeouts y, en APIs privadas, consultas persistidas que solo permitan operaciones conocidas.',
        },
        {
          q: '¿Puedo usar ambos en el mismo proyecto?',
          a: 'Sí, es común. Por ejemplo, GraphQL para la aplicación propia y REST para webhooks e integraciones con servicios externos.',
        },
      ],
      refs: [
        { label: 'GraphQL — Learn', url: 'https://graphql.org/learn/' },
        { label: 'DataLoader', url: 'https://github.com/graphql/dataloader' },
      ],
      closing: '¿Dudas sobre la arquitectura de tu API? Hablemos.',
    }),
  },
  {
    id: 'art-diseno-apis-rest',
    slug: 'diseno-apis-rest-versionado-paginacion-errores',
    date: 'ABRIL 2025',
    tag: 'APIs',
    title: 'Diseño de APIs REST que Otros Desarrolladores Quieran Usar',
    metaDescription:
      'Buenas prácticas para diseñar APIs REST: recursos y verbos HTTP, códigos de estado, formato de errores, paginación, filtrado, versionado y documentación con OpenAPI.',
    excerpt:
      'Una API se usa mucho más tiempo del que se tarda en construirla. Recursos, códigos de estado, errores consistentes, paginación y versionado para una API predecible.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'rest',
      intro:
        'Una API es un contrato. Cada decisión de nombres, formatos y códigos de estado se convierte en algo que otros equipos, integraciones y aplicaciones móviles dan por sentado. Una API predecible ahorra horas de soporte; una inconsistente obliga a leer el código del servidor para entenderla.',
      takeaways: [
        'Modela recursos con sustantivos y usa los verbos HTTP para las acciones.',
        'Los códigos de estado deben significar lo que dicen: 201 al crear, 404 si no existe, 422 si los datos no son válidos.',
        'Un formato de error único y documentado facilita el manejo de errores en todos los clientes.',
        'Pagina siempre las colecciones y versiona antes de romper el contrato.',
      ],
      sections: [
        {
          id: 'rest-recursos',
          title: 'Recursos y verbos',
          html: '<p>Usa rutas como <code>/clientes</code> y <code>/clientes/42/pedidos</code>, en plural y sin verbos en la URL. <code>GET</code> lee, <code>POST</code> crea, <code>PUT</code> o <code>PATCH</code> actualizan y <code>DELETE</code> elimina. <code>GET</code> nunca debe modificar datos, porque navegadores, proxies y rastreadores asumen que es seguro repetirlo.</p>',
        },
        {
          id: 'rest-errores',
          title: 'Códigos de estado y errores',
          html: '<p>Responde con el código correcto y un cuerpo de error consistente, por ejemplo con el formato estándar Problem Details (RFC 9457): un tipo, un título, el detalle y, en errores de validación, la lista de campos con su mensaje. Nunca devuelvas un 200 con un mensaje de error dentro: rompe el manejo de errores de cualquier cliente HTTP.</p>',
        },
        {
          id: 'rest-paginacion',
          title: 'Paginación y filtrado',
          html: '<p>Una colección sin paginar funciona con 100 registros y tumba el servidor con un millón. La paginación por cursor es más estable que la de offset cuando los datos cambian con frecuencia. Ofrece filtros y orden por parámetros de consulta (<code>?estado=activo&amp;orden=-fecha</code>) y devuelve la información necesaria para pedir la página siguiente.</p>',
        },
        {
          id: 'rest-versionado',
          title: 'Versionado y documentación',
          html: '<p>Añadir campos no rompe a nadie; eliminar o renombrar sí. Cuando un cambio rompa el contrato, publícalo como una nueva versión (por ejemplo <code>/v2</code>) y anuncia una fecha de retiro para la anterior. Documenta la API con OpenAPI: sirve de referencia, permite generar clientes y probar endpoints desde el navegador.</p>',
        },
      ],
      faqs: [
        {
          q: '¿PUT o PATCH?',
          a: 'PUT reemplaza el recurso completo; PATCH modifica solo los campos enviados. Para formularios que editan algunos campos, PATCH suele ser más práctico.',
        },
        {
          q: '¿Versión en la URL o en una cabecera?',
          a: 'Ambas funcionan. La versión en la URL es más visible y fácil de probar; en cabecera mantiene las URLs limpias. Lo importante es elegir una y ser consistente.',
        },
        {
          q: '¿Cómo manejo operaciones que no son CRUD?',
          a: 'Modélalas como un recurso o sub-recurso, por ejemplo POST /pedidos/42/cancelacion, en lugar de rutas con verbos como /cancelarPedido.',
        },
      ],
      refs: [
        { label: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
        { label: 'RFC 9457 — Problem Details for HTTP APIs', url: 'https://www.rfc-editor.org/rfc/rfc9457' },
        { label: 'MDN — HTTP response status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
      ],
      closing: '¿Estás diseñando una API? Puedo revisar el contrato contigo.',
    }),
  },
  {
    id: 'art-sesiones-vs-jwt',
    slug: 'autenticacion-sesiones-vs-jwt',
    date: 'MARZO 2025',
    tag: 'SECURITY',
    title: 'Autenticación Web: Sesiones vs. JWT y Cómo Guardar Contraseñas',
    metaDescription:
      'Cuándo usar sesiones con cookies y cuándo JWT, dónde guardar tokens, cómo revocar accesos y cómo almacenar contraseñas con bcrypt o Argon2.',
    excerpt:
      'JWT no es automáticamente más moderno ni más seguro que una sesión. Cómo elegir el mecanismo de autenticación correcto y guardar contraseñas de forma segura.',
    readTime: '8 min de lectura',
    contentHtml: buildArticle({
      prefix: 'auth',
      intro:
        'La autenticación es de las piezas en las que un error pequeño tiene consecuencias grandes. Muchos proyectos eligen JWT por inercia y terminan reimplementando, peor, lo que una sesión clásica ya resolvía. Este artículo compara ambos enfoques y cubre lo que nunca se debe hacer con las contraseñas.',
      takeaways: [
        'Para una aplicación web con su propio backend, las sesiones con cookies HttpOnly suelen ser la opción más simple y segura.',
        'Los JWT son útiles entre servicios o con varios clientes, pero son difíciles de revocar antes de que expiren.',
        'Guardar tokens en localStorage los expone a cualquier script inyectado por XSS.',
        'Las contraseñas se guardan con un hash lento y con sal (bcrypt, Argon2), nunca cifradas ni en texto plano.',
      ],
      sections: [
        {
          id: 'auth-sesiones',
          title: 'Sesiones con cookies',
          html: '<p>El servidor crea una sesión, guarda su estado (en memoria, Redis o base de datos) y envía al navegador una cookie con un identificador aleatorio. Con los flags <code>HttpOnly</code>, <code>Secure</code> y <code>SameSite</code>, el JavaScript de la página no puede leerla y se reduce el riesgo de CSRF. Cerrar sesión o revocar un acceso es tan simple como borrar la sesión en el servidor.</p>',
        },
        {
          id: 'auth-jwt',
          title: 'JWT: ventajas y trampas',
          html: '<p>Un JWT es un token firmado que contiene los datos del usuario y su fecha de expiración; cualquier servicio con la clave puede validarlo sin consultar una base de datos. Esa misma ventaja es su problema: un token robado sigue siendo válido hasta que expira. Si usas JWT, mantén una vida corta, usa tokens de refresco que sí puedas revocar y valida siempre el algoritmo esperado.</p>',
        },
        {
          id: 'auth-almacenar',
          title: 'Dónde guardar el token',
          html: '<p>En el navegador, una cookie HttpOnly es más segura que <code>localStorage</code>, porque un ataque XSS no puede leerla. En aplicaciones móviles nativas, usa el almacenamiento seguro del sistema (Keychain en iOS, Keystore en Android).</p>',
        },
        {
          id: 'auth-passwords',
          title: 'Contraseñas',
          html: '<p>Usa un algoritmo diseñado para contraseñas, como Argon2id o bcrypt, que es deliberadamente lento y aplica sal automáticamente. Nunca uses MD5 ni SHA-256 a secas. Añade límites de intentos de inicio de sesión, mensajes de error que no revelen si el usuario existe y la opción de un segundo factor para cuentas con privilegios.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Puedo usar JWT dentro de una cookie?',
          a: 'Sí, y es una combinación razonable: el token viaja en una cookie HttpOnly, protegido de XSS, y el servidor lo valida sin estado.',
        },
        {
          q: '¿Debo construir mi propio sistema de login?',
          a: 'Para muchos proyectos es mejor usar una librería o proveedor probado, sobre todo si necesitas OAuth, recuperación de cuentas o MFA. Si lo construyes, sigue las guías de OWASP.',
        },
        {
          q: '¿Cada cuánto debo expirar las sesiones?',
          a: 'Depende del riesgo. Aplicaciones con datos sensibles usan expiración por inactividad corta; aplicaciones de consumo suelen mantener sesiones más largas con reautenticación para acciones críticas.',
        },
      ],
      refs: [
        { label: 'OWASP — Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
        { label: 'OWASP — Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
        { label: 'RFC 7519 — JSON Web Token', url: 'https://www.rfc-editor.org/rfc/rfc7519' },
      ],
      closing: '¿Necesitas revisar la autenticación de tu app? Escríbeme.',
    }),
  },
  {
    id: 'art-redis-cache',
    slug: 'cache-con-redis-patrones',
    date: 'FEBRERO 2025',
    tag: 'BACKEND',
    title: 'Caché con Redis: Patrones, Invalidación y Errores Comunes',
    metaDescription:
      'Cómo usar Redis como caché: patrón cache-aside, TTL, invalidación, evitar estampidas de caché y qué datos no conviene cachear.',
    excerpt:
      'Una caché bien puesta reduce la carga de la base de datos y acelera las respuestas. Mal puesta, sirve datos viejos. Patrones prácticos con Redis.',
    readTime: '6 min de lectura',
    contentHtml: buildArticle({
      prefix: 'redis',
      intro:
        'Cuando una consulta costosa se repite cientos de veces por minuto con el mismo resultado, guardarla en memoria es la optimización más rentable. Redis es la herramienta más común para eso, pero la caché introduce una pregunta que no existía antes: cuándo un dato guardado deja de ser válido.',
      takeaways: [
        'El patrón cache-aside es el más simple: leer de caché, y si no está, leer de la base y guardarlo.',
        'Todo dato en caché debe tener un TTL; los datos sin expiración terminan siendo datos falsos.',
        'Invalida o actualiza la caché cuando cambia el dato de origen.',
        'Cuando muchas peticiones fallan la caché a la vez, pueden saturar la base de datos: protégete de la estampida.',
      ],
      sections: [
        {
          id: 'redis-aside',
          title: 'Cache-aside',
          html: '<p>La aplicación busca la clave en Redis. Si existe, la usa. Si no, consulta la base de datos, guarda el resultado con un TTL y lo devuelve. Es fácil de entender y, si Redis falla, la aplicación puede seguir leyendo de la base de datos con más lentitud.</p>',
        },
        {
          id: 'redis-invalidacion',
          title: 'Invalidación',
          html: '<p>Cuando se actualiza un registro, borra o reescribe su clave en caché en el mismo flujo de la escritura. Usa claves con un esquema predecible (<code>producto:42</code>, <code>usuario:7:perfil</code>) para poder invalidarlas con precisión. Para datos que toleran algo de retraso, un TTL corto puede ser suficiente sin invalidación explícita.</p>',
        },
        {
          id: 'redis-estampida',
          title: 'Estampida de caché',
          html: '<p>Si una clave muy consultada expira, cientos de peticiones pueden ir a la base de datos al mismo tiempo para regenerarla. Se mitiga con un bloqueo para que solo una petición recalcule el valor, añadiendo una variación aleatoria al TTL o refrescando la clave antes de que expire.</p>',
        },
        {
          id: 'redis-que',
          title: 'Qué cachear y qué no',
          html: '<p>Buenos candidatos: resultados de consultas costosas, respuestas de APIs externas lentas, configuraciones y catálogos que cambian poco. Malos candidatos: saldos, inventario en tiempo real o cualquier dato donde un valor desactualizado cause un error de negocio. Ante la duda, mide primero si la consulta realmente es un cuello de botella.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Redis sirve solo como caché?',
          a: 'No. También se usa para sesiones, colas, límites de peticiones, contadores y pub/sub. Para datos que no puedes perder, configura persistencia o usa una base de datos principal.',
        },
        {
          q: '¿Qué TTL debo usar?',
          a: 'Depende de cuánto tiempo es aceptable que el dato esté desactualizado. Empieza con un valor conservador y ajústalo según la tasa de aciertos y el impacto en la base de datos.',
        },
        {
          q: '¿Y si Redis se cae?',
          a: 'Diseña la aplicación para degradarse: si la caché no responde, lee de la base de datos y registra el error, en lugar de devolver un fallo al usuario.',
        },
      ],
      refs: [
        { label: 'Redis Docs', url: 'https://redis.io/docs/latest/' },
        { label: 'AWS — Caching strategies', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html' },
      ],
      closing: '¿Tu backend necesita responder más rápido? Hablemos.',
    }),
  },
  {
    id: 'art-testing-frontend',
    slug: 'testing-frontend-vitest-testing-library',
    date: 'ENERO 2025',
    tag: 'TESTING',
    title: 'Testing en el Frontend con Vitest y Testing Library: Qué Probar de Verdad',
    metaDescription:
      'Cómo escribir pruebas útiles en el frontend: pirámide de testing, pruebas de comportamiento con Testing Library, mocks de red y pruebas end-to-end para flujos críticos.',
    excerpt:
      'Las pruebas que se rompen con cada refactor no protegen nada. Cómo probar comportamiento en lugar de implementación con Vitest y Testing Library.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'test',
      intro:
        'Muchos equipos abandonan las pruebas del frontend porque se vuelven frágiles: cambia el nombre de un estado interno y fallan veinte tests aunque la aplicación funcione igual. El problema no es probar, es probar detalles de implementación. Las pruebas útiles verifican lo que el usuario ve y hace.',
      takeaways: [
        'Prueba comportamiento observable (texto, roles, interacciones), no estados internos ni nombres de funciones.',
        'Testing Library fomenta buscar elementos por rol y texto, igual que un usuario o un lector de pantalla.',
        'Simula la red en el borde (por ejemplo con MSW) en lugar de mockear cada función interna.',
        'Reserva las pruebas end-to-end para los flujos críticos: login, compra, reserva.',
      ],
      sections: [
        {
          id: 'test-piramide',
          title: 'Una pirámide práctica',
          html: '<p>Muchas pruebas unitarias para funciones puras (formateo, cálculos, validaciones), un buen número de pruebas de integración de componentes y pocas pruebas end-to-end que recorran la aplicación completa en un navegador real. Cada nivel es más lento y más costoso de mantener que el anterior.</p>',
        },
        {
          id: 'test-comportamiento',
          title: 'Probar comportamiento',
          html: '<p>Con Testing Library renderizas el componente, buscas elementos con <code>getByRole</code> o <code>getByText</code> y simulas interacciones con <code>user-event</code>. Si la prueba encuentra el botón "Enviar" por su rol y nombre, sigue pasando aunque cambies su clase CSS o la estructura interna. Como beneficio extra, si no puedes encontrar un elemento por su rol, probablemente tienes un problema de accesibilidad.</p>',
        },
        {
          id: 'test-red',
          title: 'Simular la red',
          html: '<p>En lugar de mockear el módulo que hace <code>fetch</code>, intercepta las peticiones HTTP con una herramienta como Mock Service Worker. El componente ejecuta su código real y solo la respuesta del servidor es simulada. Puedes probar fácilmente estados de carga, errores y respuestas vacías.</p>',
        },
        {
          id: 'test-e2e',
          title: 'End-to-end para lo crítico',
          html: '<p>Herramientas como Playwright ejecutan la aplicación en navegadores reales. Úsalas para los recorridos que no pueden fallar en producción y ejecútalas en CI antes de desplegar. Mantenlas pocas y estables: una suite e2e lenta y con fallos intermitentes termina ignorada.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Vitest o Jest?',
          a: 'Vitest se integra de forma natural con proyectos Vite y su API es compatible con la de Jest. En proyectos existentes con Jest, migrar solo vale la pena si hay un problema concreto.',
        },
        {
          q: '¿Qué cobertura debería tener?',
          a: 'La cobertura es una señal, no un objetivo. Es mejor un 60 % que cubra los flujos y reglas de negocio importantes que un 95 % de pruebas que solo ejecutan código.',
        },
        {
          q: '¿Debo usar snapshots?',
          a: 'Con moderación. Los snapshots grandes se aprueban sin revisar y detectan cambios irrelevantes. Son más útiles para salidas pequeñas y estables.',
        },
      ],
      refs: [
        { label: 'Vitest', url: 'https://vitest.dev' },
        { label: 'Testing Library — Guiding principles', url: 'https://testing-library.com/docs/guiding-principles' },
        { label: 'Mock Service Worker', url: 'https://mswjs.io' },
        { label: 'Playwright', url: 'https://playwright.dev' },
      ],
      closing: '¿Quieres empezar a probar tu frontend sin frenar al equipo? Te ayudo.',
    }),
  },
  {
    id: 'art-accesibilidad-web',
    slug: 'accesibilidad-web-para-desarrolladores',
    date: 'DICIEMBRE 2024',
    tag: 'ACCESSIBILITY',
    title: 'Accesibilidad Web para Desarrolladores: Lo Básico que Más Impacto Tiene',
    metaDescription:
      'Prácticas de accesibilidad que todo desarrollador puede aplicar: HTML semántico, teclado y foco, contraste, textos alternativos, formularios accesibles y uso correcto de ARIA.',
    excerpt:
      'La accesibilidad no es un extra para el final del proyecto. HTML semántico, navegación con teclado, contraste y formularios bien etiquetados resuelven la mayoría de las barreras.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'a11y',
      intro:
        'Una parte importante de los usuarios navega con teclado, lectores de pantalla, ampliación o en condiciones como luz solar directa o una mano ocupada. La mayoría de las barreras de accesibilidad no requieren soluciones complejas, sino usar bien lo que HTML ya ofrece y probar la interfaz sin el ratón.',
      takeaways: [
        'Un botón debe ser un <button> y un enlace un <a>: el HTML semántico trae accesibilidad gratis.',
        'Todo lo que se hace con el ratón debe poder hacerse con el teclado, con un foco siempre visible.',
        'Cada campo de formulario necesita una etiqueta asociada y mensajes de error comprensibles.',
        'ARIA complementa al HTML, no lo reemplaza: un ARIA incorrecto es peor que no tenerlo.',
      ],
      sections: [
        {
          id: 'a11y-semantica',
          title: 'HTML semántico',
          html: '<p>Los elementos nativos ya comunican su función a las tecnologías de asistencia y funcionan con teclado. Un <code>div</code> con <code>onClick</code> no recibe foco ni responde a Enter sin trabajo adicional; un <code>button</code> sí. Usa encabezados en orden, regiones como <code>header</code>, <code>nav</code>, <code>main</code> y <code>footer</code>, y listas para conjuntos de elementos.</p>',
        },
        {
          id: 'a11y-teclado',
          title: 'Teclado y foco',
          html: '<p>Recorre tu página solo con Tab, Shift+Tab, Enter, Espacio y Escape. El orden debe ser lógico y el foco siempre visible; nunca elimines el contorno de foco sin reemplazarlo. En los modales, mueve el foco al abrir, mantenlo dentro mientras estén abiertos y devuélvelo al elemento que los abrió al cerrar.</p>',
        },
        {
          id: 'a11y-contenido',
          title: 'Contraste, imágenes y formularios',
          html: '<p>El texto debe tener suficiente contraste con el fondo (WCAG pide al menos 4.5:1 para texto normal). Las imágenes informativas necesitan un <code>alt</code> que describa su función; las decorativas, un <code>alt</code> vacío. En formularios, asocia cada <code>label</code> a su campo, no uses el placeholder como única etiqueta y conecta los mensajes de error con el campo afectado.</p>',
        },
        {
          id: 'a11y-aria',
          title: 'ARIA con cuidado',
          html: '<p>ARIA sirve para describir componentes que HTML no cubre, como pestañas o menús complejos, y para anunciar cambios dinámicos. La primera regla de ARIA es no usarlo si un elemento nativo ya hace lo mismo. Atributos mal aplicados pueden ocultar contenido o anunciar roles falsos al lector de pantalla.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Una herramienta automática garantiza que mi sitio es accesible?',
          a: 'No. Herramientas como Lighthouse o axe detectan una parte de los problemas. La validación completa requiere pruebas manuales con teclado y lectores de pantalla, idealmente con revisión experta y usuarios reales.',
        },
        {
          q: '¿Qué lector de pantalla uso para probar?',
          a: 'NVDA en Windows es gratuito, VoiceOver viene incluido en macOS e iOS y TalkBack en Android. Probar con al menos uno ya revela muchos problemas.',
        },
        {
          q: '¿La accesibilidad afecta al SEO?',
          a: 'Hay solapamiento: HTML semántico, textos alternativos y una estructura clara de encabezados ayudan tanto a los lectores de pantalla como a los buscadores.',
        },
      ],
      refs: [
        { label: 'WCAG 2.2 — Quick Reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/' },
        { label: 'MDN — Accessibility', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' },
        { label: 'WAI-ARIA Authoring Practices', url: 'https://www.w3.org/WAI/ARIA/apg/' },
      ],
      closing: '¿Quieres hacer tu sitio más accesible? Puedo hacer una revisión inicial.',
    }),
  },
  {
    id: 'art-agentes-ia-herramientas',
    slug: 'agentes-de-ia-con-herramientas',
    date: 'NOVIEMBRE 2024',
    tag: 'AI / LLM',
    title: 'Agentes de IA con Herramientas: Cómo Construirlos Sin Perder el Control',
    metaDescription:
      'Qué es un agente de IA, cómo funciona el uso de herramientas (function calling), cómo diseñar herramientas seguras, límites de ejecución, supervisión humana y evaluación.',
    excerpt:
      'Un agente es un LLM que decide qué herramientas usar para cumplir una tarea. Cómo diseñar herramientas, poner límites y mantener a una persona en el circuito.',
    readTime: '8 min de lectura',
    contentHtml: buildArticle({
      prefix: 'agent',
      intro:
        'Un chatbot responde preguntas; un agente actúa. Cuando un modelo de lenguaje puede consultar una base de datos, buscar en documentos, crear una cita o enviar un mensaje, deja de ser un asistente de texto y se convierte en un sistema que toca datos reales. Esa capacidad es potente y exige el mismo rigor que cualquier software con permisos de escritura.',
      takeaways: [
        'Un agente es un ciclo: el modelo razona, elige una herramienta, recibe el resultado y decide el siguiente paso.',
        'Las herramientas deben ser pequeñas, con nombres y descripciones claras y parámetros validados.',
        'Limita pasos, tiempo y costo por tarea, y concede solo los permisos mínimos.',
        'Las acciones irreversibles o sensibles deben pasar por confirmación humana.',
      ],
      sections: [
        {
          id: 'agent-ciclo',
          title: 'Cómo funciona un agente',
          html: '<p>Defines un conjunto de herramientas con su esquema de entrada. El modelo recibe la tarea y, en lugar de responder directamente, puede solicitar una llamada a una herramienta con argumentos concretos. Tu código ejecuta la herramienta, devuelve el resultado al modelo y el ciclo continúa hasta que el modelo tiene suficiente información para responder o completar la tarea.</p>',
        },
        {
          id: 'agent-herramientas',
          title: 'Diseñar buenas herramientas',
          html: '<p>Una herramienta como <code>buscar_cliente(email)</code> es mejor que una genérica <code>ejecutar_sql(consulta)</code>: es más fácil de entender para el modelo y mucho más segura. Valida los argumentos en tu código, devuelve resultados compactos y mensajes de error que el modelo pueda usar para corregirse.</p>',
        },
        {
          id: 'agent-limites',
          title: 'Límites y permisos',
          html: '<p>Fija un número máximo de iteraciones, un tiempo límite y un presupuesto de tokens por tarea. Ejecuta las herramientas con credenciales de mínimo privilegio y trata como no confiable cualquier contenido externo que el agente lea, porque puede contener instrucciones maliciosas (prompt injection).</p>',
        },
        {
          id: 'agent-humano',
          title: 'Supervisión humana y evaluación',
          html: '<p>Separa las herramientas de lectura de las de escritura y exige confirmación antes de acciones como enviar correos, modificar registros o hacer pagos. Registra cada paso del agente para poder auditar qué decidió y por qué, y evalúalo con un conjunto de tareas reales antes de ampliar su autonomía.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Necesito un framework de agentes?',
          a: 'No siempre. Para casos simples, el soporte nativo de herramientas de los proveedores de modelos y un ciclo bien escrito son suficientes y más fáciles de depurar.',
        },
        {
          q: '¿Qué es MCP?',
          a: 'El Model Context Protocol es un estándar abierto para exponer herramientas y datos a aplicaciones de IA de forma uniforme, de modo que una misma integración sirva para distintos clientes.',
        },
        {
          q: '¿Los agentes reemplazan a las automatizaciones tradicionales?',
          a: 'No. Si el proceso es determinista y siempre igual, una automatización clásica es más barata, rápida y predecible. Los agentes aportan cuando hay que interpretar información variable o tomar decisiones.',
        },
      ],
      refs: [
        { label: 'Anthropic — Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
        { label: 'Model Context Protocol', url: 'https://modelcontextprotocol.io' },
        { label: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/' },
      ],
      closing: '¿Quieres construir un agente de IA para tu negocio? Hablemos.',
    }),
  },
  {
    id: 'art-azure-devops',
    slug: 'azure-devops-boards-repos-pipelines',
    date: 'OCTUBRE 2024',
    tag: 'DEVOPS',
    title: 'Azure DevOps en la Práctica: Boards, Repos y Pipelines en un Solo Lugar',
    metaDescription:
      'Cómo organizar un equipo con Azure DevOps: Boards para el trabajo, Repos con políticas de rama, Pipelines en YAML, entornos con aprobaciones y conexión entre tareas y código.',
    excerpt:
      'Azure DevOps reúne planificación, código y despliegue. Cómo configurarlo para que cada cambio se pueda rastrear desde la tarea hasta producción.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'ado',
      intro:
        'En empresas que ya trabajan con el ecosistema Microsoft, Azure DevOps suele ser la plataforma que conecta la planificación del trabajo con el código y los despliegues. Su valor real aparece cuando esas piezas están enlazadas: cada historia de usuario lleva a sus commits, sus pull requests y la versión en la que llegó a producción.',
      takeaways: [
        'Boards organiza el trabajo en épicas, historias y tareas, con tableros y sprints.',
        'Las políticas de rama obligan a revisar código y a pasar el build antes de fusionar.',
        'Los pipelines en YAML viven en el repositorio y se versionan junto al código.',
        'Los entornos con aprobaciones controlan quién y cuándo se despliega a producción.',
      ],
      sections: [
        {
          id: 'ado-boards',
          title: 'Boards: el trabajo visible',
          html: '<p>Define un proceso (Agile, Scrum o Basic) y úsalo de forma consistente: épicas para objetivos grandes, historias para valor entregable y tareas para el trabajo técnico. Mantén el tablero actualizado y usa consultas y paneles para ver el avance del sprint sin reuniones extra.</p>',
        },
        {
          id: 'ado-repos',
          title: 'Repos y políticas de rama',
          html: '<p>Protege la rama principal con políticas: número mínimo de revisores, elementos de trabajo vinculados, resolución de comentarios y validación de build obligatoria. Menciona el ID del elemento de trabajo en los commits o pull requests (por ejemplo <code>AB#123</code> o <code>#123</code>) para crear el enlace automático entre tarea y código.</p>',
        },
        {
          id: 'ado-pipelines',
          title: 'Pipelines en YAML',
          html: '<p>Un archivo <code>azure-pipelines.yml</code> define etapas de build, pruebas y despliegue. Usa plantillas para reutilizar pasos entre proyectos, grupos de variables y Azure Key Vault para los secretos, y caché de dependencias para acelerar las ejecuciones.</p>',
        },
        {
          id: 'ado-entornos',
          title: 'Entornos y aprobaciones',
          html: '<p>Crea entornos como desarrollo, pruebas y producción, y añade comprobaciones: aprobaciones manuales, horarios permitidos o validaciones automáticas. Así el mismo pipeline despliega a todos los entornos, pero producción solo avanza cuando las personas responsables lo autorizan.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Azure DevOps o GitHub?',
          a: 'Ambos son de Microsoft. GitHub concentra la comunidad y funciones modernas como Actions y Copilot; Azure DevOps destaca en gestión de trabajo empresarial y trazabilidad. Muchas empresas combinan Boards con repositorios en GitHub.',
        },
        {
          q: '¿Puedo desplegar fuera de Azure?',
          a: 'Sí. Los pipelines pueden desplegar a otras nubes, servidores propios o servicios externos mediante tareas, scripts y conexiones de servicio.',
        },
        {
          q: '¿Classic o YAML?',
          a: 'YAML es la opción recomendada para proyectos nuevos: se versiona con el código, se revisa en pull requests y es más fácil de reutilizar.',
        },
      ],
      refs: [
        { label: 'Azure DevOps documentation', url: 'https://learn.microsoft.com/en-us/azure/devops/' },
        { label: 'Azure Pipelines — YAML schema', url: 'https://learn.microsoft.com/en-us/azure/devops/pipelines/yaml-schema/' },
      ],
      closing: '¿Quieres ordenar el flujo de trabajo de tu equipo? Puedo ayudarte.',
    }),
  },
  {
    id: 'art-git-flujo',
    slug: 'git-flujo-de-trabajo-equipos',
    date: 'SEPTIEMBRE 2024',
    tag: 'DEVOPS',
    title: 'Git para Equipos: Ramas, Commits y Pull Requests que No Generan Caos',
    metaDescription:
      'Cómo trabajar en equipo con Git: trunk-based vs. Git Flow, ramas cortas, commits atómicos con Conventional Commits, pull requests pequeños y cómo evitar perder trabajo.',
    excerpt:
      'Las ramas que viven semanas terminan en conflictos enormes. Prácticas de Git para equipos: ramas cortas, commits claros y pull requests fáciles de revisar.',
    readTime: '6 min de lectura',
    contentHtml: buildArticle({
      prefix: 'git',
      intro:
        'Git permite casi cualquier flujo de trabajo, y por eso muchos equipos terminan con uno complicado: ramas que duran semanas, merges con cientos de conflictos y un historial que nadie puede leer. Un buen flujo no depende de comandos avanzados, sino de acuerdos simples que el equipo cumple.',
      takeaways: [
        'Las ramas de vida corta reducen conflictos y aceleran la integración.',
        'Los commits atómicos con mensajes claros convierten el historial en documentación útil.',
        'Un pull request pequeño se revisa mejor y más rápido que uno gigante.',
        'Nunca reescribas el historial de una rama compartida sin acuerdo del equipo.',
      ],
      sections: [
        {
          id: 'git-estrategia',
          title: 'Trunk-based o Git Flow',
          html: '<p>Git Flow usa ramas de desarrollo, release y hotfix, útil cuando se publican versiones planificadas. El desarrollo basado en trunk integra cambios pequeños en la rama principal con frecuencia, apoyado en CI y feature flags, y encaja mejor con despliegues continuos. Para la mayoría de aplicaciones web, ramas cortas sobre <code>main</code> son más simples.</p>',
        },
        {
          id: 'git-commits',
          title: 'Commits atómicos y mensajes',
          html: '<p>Cada commit debe representar un cambio coherente que compile. Convenciones como Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>docs:</code>) hacen el historial legible y permiten generar changelogs automáticamente. El mensaje explica el porqué del cambio; el diff ya muestra el qué.</p>',
        },
        {
          id: 'git-prs',
          title: 'Pull requests revisables',
          html: '<p>Un pull request de 200 líneas recibe una revisión real; uno de 3 000 recibe un "aprobado" rápido. Divide el trabajo grande en pasos que se puedan fusionar por separado, describe qué cambia y cómo probarlo, y deja que el pipeline valide antes de pedir revisión.</p>',
        },
        {
          id: 'git-seguridad',
          title: 'Evitar perder trabajo',
          html: '<p>Prefiere <code>git push --force-with-lease</code> a <code>--force</code> cuando debas reescribir tu propia rama, y nunca en ramas compartidas. Si algo sale mal, <code>git reflog</code> suele permitir recuperar commits que parecían perdidos. Y no subas secretos: si ocurre, revoca la credencial de inmediato.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Merge, squash o rebase?',
          a: 'Squash produce un commit por pull request y un historial limpio en main. Rebase mantiene commits individuales en línea recta. Merge conserva la historia completa. Elijan uno como equipo y configúrenlo en el repositorio.',
        },
        {
          q: '¿Cómo resuelvo conflictos con menos dolor?',
          a: 'Integrando cambios de main con frecuencia en tu rama. Los conflictos pequeños y recientes son fáciles; los que se acumulan durante semanas no.',
        },
        {
          q: '¿Qué hago si subí una contraseña?',
          a: 'Revócala y genera una nueva primero. Después puedes limpiar el historial, pero asume que la credencial quedó expuesta desde el momento del push.',
        },
      ],
      refs: [
        { label: 'Pro Git (libro oficial)', url: 'https://git-scm.com/book/es/v2' },
        { label: 'Conventional Commits', url: 'https://www.conventionalcommits.org/es/v1.0.0/' },
        { label: 'Trunk Based Development', url: 'https://trunkbaseddevelopment.com' },
      ],
      closing: '¿Tu equipo pelea con Git? Ordenemos el flujo.',
    }),
  },
];
