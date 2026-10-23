import { WritingArticle } from '../types';

// Generador de HTML para artículos con la misma estructura que los existentes
// (intro, puntos clave, índice, secciones, FAQs, referencias y firma).
interface ArticleSection {
  id: string;
  title: string;
  html: string;
}

interface ArticleSpec {
  intro: string;
  takeaways: string[];
  sections: ArticleSection[];
  faqs: { q: string; a: string }[];
  refs: { label: string; url: string }[];
  prefix: string;
  closing: string;
}

export const buildArticle = (a: ArticleSpec): string => {
  const index = [
    ...a.sections.map((s, i) => `<li><a href="#${s.id}">${i + 1}. ${s.title}</a></li>`),
    `<li><a href="#${a.prefix}-faqs">Preguntas Frecuentes</a></li>`,
    `<li><a href="#${a.prefix}-referencias">Referencias y Enlaces</a></li>`,
  ].join('\n    ');

  const sections = a.sections
    .map((s, i) => `<h2 id="${s.id}">${i + 1}. ${s.title}</h2>\n${s.html}`)
    .join('\n\n');

  const faqs = a.faqs
    .map(
      (f) => `<details class="article-faq">
  <summary class="article-faq-question">${f.q}</summary>
  <div class="article-faq-answer"><p>${f.a}</p></div>
</details>`
    )
    .join('\n\n');

  const refs = a.refs
    .map(
      (r) =>
        `<li><strong>${r.label}</strong>: <a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.url.replace(/^https?:\/\//, '')}</a></li>`
    )
    .join('\n  ');

  return `
<p class="article-intro">${a.intro}</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    ${a.takeaways.map((t) => `<li>${t}</li>`).join('\n    ')}
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    ${index}
  </ol>
</div>

${sections}

<h2 id="${a.prefix}-faqs">Preguntas Frecuentes</h2>

${faqs}

<h2 id="${a.prefix}-referencias">Referencias y Enlaces</h2>
<ul>
  ${refs}
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. ${a.closing}</p>
`;
};

export const EXTRA_WRITING_ARTICLES: WritingArticle[] = [
  {
    id: 'art-typescript-strict',
    slug: 'typescript-strict-tipos-que-evitan-bugs',
    date: 'ABRIL 2026',
    tag: 'TYPESCRIPT',
    title: 'TypeScript en Modo Estricto: Tipos Que Evitan Bugs Antes de Producción',
    metaDescription:
      'Cómo aprovechar strict mode, uniones discriminadas, unknown y validación en runtime para que TypeScript atrape errores reales y no solo decore el código.',
    excerpt:
      'TypeScript solo protege si lo dejas. Strict mode, uniones discriminadas, unknown en vez de any y validación en los bordes del sistema para atrapar bugs antes de producción.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'ts',
      intro:
        'Muchos proyectos usan TypeScript como si fuera JavaScript con anotaciones opcionales: <code>any</code> por todos lados, strict desactivado y tipos que mienten sobre los datos reales. Así se paga el costo de los tipos sin recibir su beneficio. Este artículo muestra las prácticas que hacen que el compilador trabaje a tu favor.',
      takeaways: [
        'Activar <code>strict</code> es la mejora de calidad más barata que puedes hacer en un proyecto TypeScript.',
        'Las uniones discriminadas convierten estados imposibles en errores de compilación.',
        '<code>unknown</code> obliga a validar; <code>any</code> desactiva el sistema de tipos en silencio.',
        'Los tipos no existen en runtime: los datos externos (APIs, formularios) deben validarse con un esquema.',
      ],
      sections: [
        {
          id: 'ts-strict',
          title: 'Por qué strict no es opcional',
          html: '<p>El flag <code>strict</code> activa, entre otros, <code>strictNullChecks</code> y <code>noImplicitAny</code>. El primero obliga a manejar <code>null</code> y <code>undefined</code>, que son la fuente número uno de errores en runtime. El segundo impide que el compilador asuma <code>any</code> cuando no puede inferir un tipo. En un proyecto existente, actívalo de forma incremental por carpeta o con comentarios temporales, pero actívalo.</p>',
        },
        {
          id: 'ts-uniones',
          title: 'Uniones discriminadas para modelar estados',
          html: '<p>En lugar de un objeto con <code>isLoading</code>, <code>error</code> y <code>data</code> opcionales (que permite combinaciones absurdas como cargando y con error a la vez), modela el estado como una unión: <code>{ status: "loading" } | { status: "error"; error: string } | { status: "success"; data: User }</code>. El compilador te obliga a manejar cada caso y solo te deja acceder a <code>data</code> cuando el estado es <code>success</code>.</p>',
        },
        {
          id: 'ts-unknown',
          title: 'unknown en lugar de any',
          html: '<p><code>any</code> apaga la verificación de tipos y se propaga: todo lo que toca también pierde tipos. <code>unknown</code> representa lo mismo (un valor de tipo desconocido) pero no deja usarlo hasta que lo estrechas con una comprobación. Para respuestas de API, <code>JSON.parse</code> y bloques <code>catch</code>, <code>unknown</code> es el tipo honesto.</p>',
        },
        {
          id: 'ts-runtime',
          title: 'Validar en los bordes del sistema',
          html: '<p>Los tipos desaparecen al compilar. Si declaras que una API devuelve <code>User</code> pero el backend cambia, TypeScript no se entera. Valida los datos externos con una librería de esquemas como Zod o Valibot en el punto de entrada, e infiere el tipo desde el esquema. Así el tipo y la validación nunca se desincronizan.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Activar strict en un proyecto grande rompe todo?',
          a: 'Genera muchos errores al principio, pero cada uno suele ser un bug potencial real. Actívalo por módulos y corrige de forma progresiva en lugar de hacerlo de golpe.',
        },
        {
          q: '¿Cuándo está justificado usar any?',
          a: 'Casi nunca. En migraciones temporales desde JavaScript o con librerías sin tipos, y siempre como deuda técnica marcada. Para todo lo demás, unknown o un tipo explícito.',
        },
        {
          q: '¿Zod reemplaza a TypeScript?',
          a: 'No, lo complementa. TypeScript verifica tu código en compilación; Zod verifica los datos externos en runtime. Usar z.infer mantiene ambos alineados.',
        },
      ],
      refs: [
        { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
        { label: 'TSConfig — strict', url: 'https://www.typescriptlang.org/tsconfig#strict' },
        { label: 'Zod', url: 'https://zod.dev' },
      ],
      closing: '¿Migrando un proyecto a TypeScript estricto? Puedo ayudarte.',
    }),
  },
  {
    id: 'art-astro-islas',
    slug: 'astro-arquitectura-de-islas-vs-spa',
    date: 'MARZO 2026',
    tag: 'FRONTEND',
    title: 'Astro y la Arquitectura de Islas: Cuándo Superar a una SPA Tradicional',
    metaDescription:
      'Qué es la arquitectura de islas de Astro, cómo reduce el JavaScript enviado al navegador y cuándo conviene frente a una SPA en React para sitios de contenido y marketing.',
    excerpt:
      'Para sitios de contenido, marketing o clínicas, enviar una SPA entera al navegador es desperdicio. Cómo funcionan las islas de Astro y cuándo elegirlas frente a una SPA en React.',
    readTime: '6 min de lectura',
    contentHtml: buildArticle({
      prefix: 'astro',
      intro:
        'Una landing page o un sitio de servicios no necesita descargar todo un framework para mostrar texto e imágenes. Astro parte de una idea simple: renderizar HTML en el servidor y solo hidratar con JavaScript las partes que de verdad son interactivas. He usado este enfoque en sitios en producción para clínicas y plataformas de empleo, y la diferencia en rendimiento y SEO es medible.',
      takeaways: [
        'Astro envía cero JavaScript por defecto: solo hidrata los componentes que lo necesitan.',
        'Las islas permiten usar React, Vue o Svelte dentro de la misma página sin cargar una SPA completa.',
        'Para sitios de contenido y marketing, menos JavaScript significa mejores Core Web Vitals y mejor SEO.',
        'Para aplicaciones muy interactivas (dashboards, editores), una SPA sigue siendo la mejor opción.',
      ],
      sections: [
        {
          id: 'astro-islas',
          title: 'Qué es una isla',
          html: '<p>Una isla es un componente interactivo aislado dentro de una página de HTML estático. El resto de la página (cabecera, textos, imágenes, footer) llega como HTML puro. Un buscador, un carrusel o un formulario de reservas se marcan como islas y solo ellos cargan su JavaScript.</p>',
        },
        {
          id: 'astro-directivas',
          title: 'Directivas de hidratación',
          html: '<p>Astro controla cuándo se hidrata cada isla: <code>client:load</code> la hidrata al cargar, <code>client:idle</code> cuando el navegador está libre, <code>client:visible</code> cuando entra en pantalla y <code>client:media</code> según un media query. Elegir bien la directiva retrasa el JavaScript que no es urgente y libera el hilo principal en la carga inicial.</p>',
        },
        {
          id: 'astro-cuando',
          title: 'Cuándo elegir Astro y cuándo una SPA',
          html: '<p>Astro brilla en sitios orientados a contenido: marketing, blogs, documentación, catálogos y sitios de servicios donde el SEO y la velocidad de carga mandan. Una SPA en React tiene más sentido cuando casi toda la interfaz es interactiva y el usuario pasa mucho tiempo dentro de la aplicación, como un panel de administración o una herramienta de edición.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Puedo usar mis componentes de React en Astro?',
          a: 'Sí. Con la integración oficial de React, tus componentes funcionan como islas. Solo debes indicar la directiva client: correspondiente si necesitan interactividad.',
        },
        {
          q: '¿Astro sirve para sitios con backend?',
          a: 'Sí. En modo SSR, Astro renderiza en el servidor por petición y puede integrarse con APIs, bases de datos y autenticación mediante adaptadores para Node, Vercel y otros.',
        },
        {
          q: '¿Mejora el SEO realmente?',
          a: 'El HTML llega completo desde el servidor y la página carga más rápido, dos factores que ayudan a la indexación y a las Core Web Vitals. El contenido y la estrategia siguen siendo lo principal.',
        },
      ],
      refs: [
        { label: 'Astro Docs — Islands', url: 'https://docs.astro.build/en/concepts/islands/' },
        { label: 'Astro Docs — Client directives', url: 'https://docs.astro.build/en/reference/directives-reference/' },
      ],
      closing: '¿Tu sitio de marketing carga lento? Hablemos de cómo optimizarlo.',
    }),
  },
  {
    id: 'art-stripe-webhooks',
    slug: 'stripe-webhooks-pagos-confiables',
    date: 'FEBRERO 2026',
    tag: 'PAYMENTS',
    title: 'Pagos con Stripe en Producción: Webhooks, Idempotencia y Errores Comunes',
    metaDescription:
      'Cómo integrar Stripe de forma confiable: confirmar pagos vía webhooks, verificar firmas, manejar reintentos con idempotencia y evitar cobros duplicados o pedidos perdidos.',
    excerpt:
      'Redirigir al usuario tras el checkout no confirma un pago. Cómo usar webhooks firmados, idempotencia y manejo de reintentos para que tu integración con Stripe sea confiable.',
    readTime: '8 min de lectura',
    contentHtml: buildArticle({
      prefix: 'stripe',
      intro:
        'Integrar un botón de pago con Stripe es fácil. Construir un flujo de pagos que no pierda pedidos, no cobre dos veces y sobreviva a caídas de red es otra historia. La diferencia está en tratar los webhooks como la fuente de verdad y diseñar cada paso para que pueda repetirse sin efectos secundarios.',
      takeaways: [
        'La página de éxito no confirma un pago: el webhook firmado de Stripe sí.',
        'Verifica siempre la firma del webhook para evitar eventos falsificados.',
        'Stripe reintenta webhooks: tu handler debe ser idempotente y tolerar eventos duplicados.',
        'Usa claves de idempotencia al crear cobros para evitar pagos duplicados por reintentos del cliente.',
      ],
      sections: [
        {
          id: 'stripe-verdad',
          title: 'El webhook como fuente de verdad',
          html: '<p>El usuario puede cerrar la pestaña justo después de pagar, perder la conexión o nunca llegar a la página de confirmación. Si activas el pedido solo cuando carga esa página, perderás ventas pagadas. Escucha eventos como <code>checkout.session.completed</code> o <code>payment_intent.succeeded</code> en tu servidor y activa el pedido ahí.</p>',
        },
        {
          id: 'stripe-firma',
          title: 'Verificar la firma',
          html: '<p>Tu endpoint de webhook es público, así que cualquiera podría enviarle un evento falso. Stripe firma cada evento con un secreto; usa la función de verificación de la librería oficial con el cuerpo crudo de la petición (sin parsear) y el encabezado <code>Stripe-Signature</code>. Rechaza cualquier evento que no pase la verificación.</p>',
        },
        {
          id: 'stripe-idempotencia',
          title: 'Idempotencia y reintentos',
          html: '<p>Si tu endpoint tarda o falla, Stripe reintenta el evento durante horas. Guarda el ID de cada evento procesado y, si llega uno repetido, responde 200 sin volver a ejecutar la lógica. Del lado de las peticiones a la API, envía una clave de idempotencia al crear cobros: si la petición se repite por un timeout, Stripe devuelve el mismo resultado en lugar de cobrar de nuevo.</p>',
        },
        {
          id: 'stripe-errores',
          title: 'Errores comunes',
          html: '<p>Los más frecuentes: hacer trabajo pesado dentro del handler y provocar timeouts (responde rápido y procesa en segundo plano), usar claves de prueba en producción, no manejar pagos asíncronos que se confirman más tarde, y exponer la clave secreta en el frontend. La clave secreta vive solo en el servidor, en variables de entorno.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Cómo pruebo webhooks en local?',
          a: 'Con el Stripe CLI: stripe listen reenvía los eventos a tu servidor local y stripe trigger simula eventos concretos sin hacer pagos reales.',
        },
        {
          q: '¿Checkout o Payment Element?',
          a: 'Stripe Checkout es una página alojada por Stripe, más rápida de integrar y con menos responsabilidad de cumplimiento. Payment Element se integra en tu propia interfaz y da más control visual.',
        },
        {
          q: '¿Qué código debe devolver mi webhook?',
          a: 'Un 2xx lo antes posible para confirmar la recepción. Cualquier otro código hace que Stripe reintente el envío.',
        },
      ],
      refs: [
        { label: 'Stripe Docs — Webhooks', url: 'https://docs.stripe.com/webhooks' },
        { label: 'Stripe Docs — Idempotent requests', url: 'https://docs.stripe.com/api/idempotent_requests' },
        { label: 'Stripe CLI', url: 'https://docs.stripe.com/stripe-cli' },
      ],
      closing: '¿Necesitas integrar pagos en tu negocio? Escríbeme.',
    }),
  },
  {
    id: 'art-zapier-automatizacion',
    slug: 'automatizar-negocio-zapier-webhooks',
    date: 'ENERO 2026',
    tag: 'AUTOMATION',
    title: 'Automatizar un Negocio con Zapier y Webhooks Sin Crear un Caos de Integraciones',
    metaDescription:
      'Cómo diseñar automatizaciones con Zapier y webhooks que escalen: cuándo usar no-code y cuándo código, manejo de errores, idempotencia y documentación de flujos.',
    excerpt:
      'Zapier conecta miles de apps en minutos, pero sin orden se convierte en una red frágil de flujos que nadie entiende. Cómo diseñar automatizaciones mantenibles y cuándo pasar a código.',
    readTime: '6 min de lectura',
    contentHtml: buildArticle({
      prefix: 'zap',
      intro:
        'Herramientas como Zapier permiten conectar un CRM, una agenda, un formulario y un sistema de mensajería en una tarde. El problema llega meses después, cuando hay decenas de zaps que se disparan entre sí, nadie recuerda qué hace cada uno y un fallo silencioso deja leads sin atender. La automatización necesita el mismo criterio de diseño que el código.',
      takeaways: [
        'Los webhooks en tiempo real son preferibles al polling cuando la app de origen los ofrece.',
        'Cada automatización debe tener un responsable, un nombre claro y documentación mínima.',
        'Configura alertas de error: un zap que falla en silencio es peor que no tener automatización.',
        'Cuando la lógica crece (condiciones complejas, volumen alto), un servicio propio suele ser más barato y confiable.',
      ],
      sections: [
        {
          id: 'zap-webhooks',
          title: 'Webhooks vs. polling',
          html: '<p>Muchos disparadores de Zapier consultan la app de origen cada cierto intervalo (polling), lo que introduce retrasos. Un webhook, en cambio, notifica al instante cuando ocurre el evento. Para flujos sensibles al tiempo, como responder a un lead nuevo o confirmar una cita, usar webhooks reduce la latencia de minutos a segundos.</p>',
        },
        {
          id: 'zap-orden',
          title: 'Orden y nomenclatura',
          html: '<p>Nombra cada zap con un patrón consistente (origen, evento y destino), agrúpalos en carpetas por área de negocio y mantén un documento con qué hace cada uno y de qué depende. Evita cadenas donde un zap dispara otro que dispara otro: son difíciles de depurar y amplifican cualquier error.</p>',
        },
        {
          id: 'zap-errores',
          title: 'Manejo de errores',
          html: '<p>Activa las notificaciones de error, usa pasos de filtro para descartar datos incompletos antes de que lleguen al destino y piensa en qué pasa si un paso se ejecuta dos veces. Si un flujo crea registros, busca primero si ya existen para evitar duplicados.</p>',
        },
        {
          id: 'zap-codigo',
          title: 'Cuándo pasar a código',
          html: '<p>El no-code es ideal para validar procesos rápido. Cuando el volumen de tareas dispara los costos, la lógica requiere muchas ramas o necesitas pruebas y control de versiones, migrar ese flujo a un pequeño servicio propio o a una función serverless suele ser más barato y confiable a largo plazo.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Zapier, Make o n8n?',
          a: 'Zapier tiene el mayor catálogo de integraciones y la curva más suave. Make ofrece flujos visuales más complejos a menor costo. n8n puede autoalojarse y da más control técnico.',
        },
        {
          q: '¿Es seguro pasar datos de clientes por Zapier?',
          a: 'Revisa qué datos realmente necesitas transmitir, limita los permisos de cada conexión y verifica los requisitos de cumplimiento de tu sector antes de enviar datos sensibles.',
        },
        {
          q: '¿Cómo pruebo un zap sin afectar datos reales?',
          a: 'Usa cuentas o registros de prueba en las apps conectadas y la función de prueba de cada paso antes de activar el flujo.',
        },
      ],
      refs: [
        { label: 'Zapier — Webhooks', url: 'https://zapier.com/apps/webhook/integrations' },
        { label: 'Zapier Help Center', url: 'https://help.zapier.com' },
      ],
      closing: '¿Quieres automatizar procesos de tu negocio? Hablemos.',
    }),
  },
  {
    id: 'art-tracking-capi',
    slug: 'tracking-ga4-gtm-meta-conversions-api',
    date: 'DICIEMBRE 2025',
    tag: 'MARKETING TECH',
    title: 'Tracking Confiable con GA4, GTM y la API de Conversiones de Meta',
    metaDescription:
      'Cómo implementar medición fiable con Google Tag Manager, GA4 y Meta Conversions API: data layer, deduplicación de eventos, consentimiento y validación.',
    excerpt:
      'Los bloqueadores y las restricciones de cookies hacen que el píxel del navegador pierda conversiones. Cómo combinar GTM, GA4 y la API de Conversiones de Meta para medir con fiabilidad.',
    readTime: '8 min de lectura',
    contentHtml: buildArticle({
      prefix: 'trk',
      intro:
        'Un negocio que invierte en Google Ads y Meta Ads toma decisiones con los datos de conversión. Si la medición está rota, se optimizan campañas sobre números falsos. Con los bloqueadores de anuncios y las restricciones de privacidad de los navegadores, depender solo del píxel en el cliente ya no es suficiente.',
      takeaways: [
        'Un data layer bien definido es la base: los eventos se describen una vez y GTM los distribuye.',
        'La API de Conversiones envía eventos desde el servidor y recupera conversiones que el píxel pierde.',
        'Píxel y API deben compartir un event_id para que Meta deduplique y no cuente doble.',
        'El consentimiento del usuario debe respetarse en todos los canales, incluido el servidor.',
      ],
      sections: [
        {
          id: 'trk-datalayer',
          title: 'Diseñar el data layer',
          html: '<p>En lugar de configurar etiquetas leyendo clics y textos del DOM (que se rompen con cualquier cambio de diseño), haz que la aplicación empuje eventos explícitos al <code>dataLayer</code>: reserva iniciada, formulario enviado, pago completado, con sus parámetros. GTM escucha esos eventos y los envía a GA4, Meta y cualquier otra plataforma.</p>',
        },
        {
          id: 'trk-capi',
          title: 'La API de Conversiones de Meta',
          html: '<p>La Conversions API (CAPI) envía los eventos directamente desde tu servidor a Meta. No depende del navegador, así que no la afectan los bloqueadores. Incluye parámetros de coincidencia (correo o teléfono con hash, IP, user agent, cookies de clic) para que Meta pueda atribuir la conversión.</p>',
        },
        {
          id: 'trk-dedup',
          title: 'Deduplicación de eventos',
          html: '<p>Si envías el mismo evento por el píxel y por CAPI sin coordinarlos, Meta los contará dos veces. Genera un <code>event_id</code> único por evento, envíalo en ambos canales junto con el mismo nombre de evento, y Meta descartará el duplicado.</p>',
        },
        {
          id: 'trk-validar',
          title: 'Validar antes de confiar',
          html: '<p>Usa el modo de vista previa de GTM, DebugView de GA4 y la herramienta de eventos de prueba de Meta para confirmar que cada evento llega con los parámetros correctos. Revisa la calidad de coincidencia de eventos en el administrador de eventos de Meta y compara periódicamente las conversiones medidas con las reales del negocio.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Necesito GTM del lado del servidor?',
          a: 'No es obligatorio. Puedes enviar eventos a CAPI desde tu propio backend. Server-side GTM centraliza ese envío y facilita gestionar varias plataformas, a cambio de un servidor adicional que mantener.',
        },
        {
          q: '¿Por qué GA4 y mi CRM no muestran las mismas conversiones?',
          a: 'Por bloqueadores, consentimiento rechazado, diferencias de atribución y zonas horarias. Una diferencia moderada es normal; una grande indica un problema de implementación.',
        },
        {
          q: '¿Debo hashear los datos personales?',
          a: 'Sí. Meta exige que correo, teléfono y otros identificadores se envíen normalizados y con hash SHA-256 en la API de Conversiones.',
        },
      ],
      refs: [
        { label: 'Meta — Conversions API', url: 'https://developers.facebook.com/docs/marketing-api/conversions-api' },
        { label: 'Google Tag Manager — Server-side', url: 'https://developers.google.com/tag-platform/tag-manager/server-side' },
        { label: 'GA4 — DebugView', url: 'https://support.google.com/analytics/answer/7201382' },
      ],
      closing: '¿Tus campañas no cuadran con tus ventas? Puedo auditar tu medición.',
    }),
  },
  {
    id: 'art-seo-tecnico',
    slug: 'seo-tecnico-para-desarrolladores',
    date: 'NOVIEMBRE 2025',
    tag: 'SEO',
    title: 'SEO Técnico para Desarrolladores: Metadatos, Schema y Core Web Vitals',
    metaDescription:
      'Lo que un desarrollador controla del SEO: HTML indexable, metadatos y Open Graph, datos estructurados con schema.org, sitemaps y Core Web Vitals.',
    excerpt:
      'El contenido atrae visitas, pero el código decide si Google puede leerlo. Metadatos, Open Graph, datos estructurados, sitemaps y Core Web Vitals desde la perspectiva del desarrollador.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'seo',
      intro:
        'Un equipo de marketing puede escribir el mejor contenido del sector y aun así no posicionar si el sitio entrega HTML vacío, carga lento o no describe sus páginas a los buscadores. Esa parte del SEO es responsabilidad del desarrollador, y casi siempre es la más barata de corregir.',
      takeaways: [
        'Si el contenido solo aparece tras ejecutar JavaScript, la indexación se vuelve más lenta e incierta.',
        'Cada página necesita title, meta description, canonical y metadatos Open Graph propios.',
        'Los datos estructurados (JSON-LD) ayudan a los buscadores a entender negocios, servicios, reseñas y FAQs.',
        'Core Web Vitals (LCP, INP, CLS) son medibles y mejorables desde el código.',
      ],
      sections: [
        {
          id: 'seo-html',
          title: 'HTML que los buscadores pueden leer',
          html: '<p>Renderizar en el servidor o generar páginas estáticas garantiza que el contenido esté en el HTML inicial. Usa encabezados jerárquicos (un solo <code>h1</code>), enlaces reales con <code>href</code> en lugar de botones con JavaScript para navegar, y texto alternativo descriptivo en imágenes.</p>',
        },
        {
          id: 'seo-meta',
          title: 'Metadatos y Open Graph',
          html: '<p>El <code>title</code> y la meta description influyen en cómo aparece tu página en los resultados. La URL canónica evita contenido duplicado. Las etiquetas Open Graph y Twitter Card controlan la tarjeta que se muestra al compartir un enlace: título, descripción e imagen, idealmente de 1200x630 píxeles y con URL absoluta.</p>',
        },
        {
          id: 'seo-schema',
          title: 'Datos estructurados con schema.org',
          html: '<p>Un bloque JSON-LD describe la entidad de la página en un formato que los buscadores entienden: <code>LocalBusiness</code> o <code>MedicalClinic</code> para un negocio físico, <code>Service</code>, <code>FAQPage</code>, <code>Article</code> o <code>Review</code>. Valídalo con la herramienta de resultados enriquecidos de Google.</p>',
        },
        {
          id: 'seo-vitals',
          title: 'Core Web Vitals',
          html: '<p>LCP mide cuánto tarda en aparecer el contenido principal, INP la rapidez de respuesta a la interacción y CLS los saltos visuales del diseño. Optimiza imágenes (formatos modernos, tamaños correctos, carga diferida), reserva espacio para elementos que cargan tarde y reduce el JavaScript que bloquea el hilo principal.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Google indexa sitios hechos con React?',
          a: 'Puede hacerlo, pero el renderizado de JavaScript se procesa en una segunda fase y no siempre de forma completa. Para páginas que deben posicionar, SSR o generación estática es más seguro.',
        },
        {
          q: '¿Las meta keywords sirven?',
          a: 'No. Google las ignora desde hace años. Concéntrate en title, description, contenido y datos estructurados.',
        },
        {
          q: '¿Necesito un sitemap?',
          a: 'Es muy recomendable, sobre todo en sitios con muchas páginas o contenido nuevo frecuente. Envíalo en Google Search Console junto con un robots.txt correcto.',
        },
      ],
      refs: [
        { label: 'Google Search Central', url: 'https://developers.google.com/search/docs' },
        { label: 'schema.org', url: 'https://schema.org' },
        { label: 'web.dev — Core Web Vitals', url: 'https://web.dev/articles/vitals' },
      ],
      closing: '¿Tu sitio no aparece en Google? Puedo revisar su SEO técnico.',
    }),
  },
  {
    id: 'art-docker-dev',
    slug: 'docker-para-desarrolladores-fullstack',
    date: 'OCTUBRE 2025',
    tag: 'DEVOPS',
    title: 'Docker para Desarrolladores Fullstack: Entornos Reproducibles Sin Dolor',
    metaDescription:
      'Cómo usar Docker y Docker Compose para que tu aplicación funcione igual en cualquier máquina: imágenes ligeras, multi-stage builds, volúmenes y buenas prácticas de seguridad.',
    excerpt:
      'El clásico "en mi máquina funciona" se acaba con contenedores. Imágenes ligeras, multi-stage builds, Docker Compose para levantar todo el stack y las prácticas que evitan imágenes inseguras.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'dk',
      intro:
        'Configurar un proyecto nuevo no debería tomar una tarde instalando la versión correcta de Node, PostgreSQL y Redis. Docker empaqueta la aplicación con todo lo que necesita y Docker Compose levanta el stack completo con un solo comando. Bien usado, también hace que desarrollo y producción se parezcan mucho más.',
      takeaways: [
        'Una imagen describe el entorno como código: cualquiera la construye y obtiene el mismo resultado.',
        'Los multi-stage builds separan la compilación de la ejecución y reducen drásticamente el tamaño final.',
        'Docker Compose define base de datos, caché y aplicación en un solo archivo para desarrollo local.',
        'No ejecutes como root, no metas secretos en la imagen y usa imágenes base oficiales y pequeñas.',
      ],
      sections: [
        {
          id: 'dk-imagen',
          title: 'Imágenes y capas',
          html: '<p>Cada instrucción del Dockerfile crea una capa en caché. Copia primero los archivos de dependencias (<code>package.json</code> y el lockfile), instala, y solo después copia el código fuente. Así, cambiar una línea de código no obliga a reinstalar todas las dependencias en cada build.</p>',
        },
        {
          id: 'dk-multistage',
          title: 'Multi-stage builds',
          html: '<p>Una primera etapa instala herramientas de compilación y genera el build; una segunda etapa parte de una imagen mínima y copia solo el resultado. La imagen final no incluye compiladores, dependencias de desarrollo ni código fuente innecesario: es más pequeña, más rápida de desplegar y con menor superficie de ataque.</p>',
        },
        {
          id: 'dk-compose',
          title: 'Docker Compose para desarrollo',
          html: '<p>Un <code>compose.yaml</code> declara los servicios (app, PostgreSQL, Redis), sus puertos, variables de entorno y volúmenes. Los volúmenes persisten los datos de la base entre reinicios y permiten montar el código para recarga en caliente. Un nuevo integrante del equipo solo necesita ejecutar <code>docker compose up</code>.</p>',
        },
        {
          id: 'dk-seguridad',
          title: 'Buenas prácticas de seguridad',
          html: '<p>Define un usuario sin privilegios con la instrucción <code>USER</code>, usa un <code>.dockerignore</code> para no copiar <code>.env</code>, <code>.git</code> ni <code>node_modules</code>, fija versiones de las imágenes base y escanéalas en busca de vulnerabilidades. Los secretos se inyectan en tiempo de ejecución, nunca en la imagen.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Docker reemplaza a una máquina virtual?',
          a: 'No exactamente. Los contenedores comparten el kernel del sistema anfitrión, por eso son mucho más ligeros y rápidos de arrancar, pero ofrecen menos aislamiento que una VM completa.',
        },
        {
          q: '¿Necesito Kubernetes si uso Docker?',
          a: 'No. Muchas aplicaciones funcionan perfectamente con contenedores en un solo servidor o en servicios administrados. Kubernetes tiene sentido cuando orquestas muchos servicios a escala.',
        },
        {
          q: '¿Por qué mi imagen pesa más de 1 GB?',
          a: 'Suele deberse a una imagen base completa, dependencias de desarrollo incluidas o archivos copiados sin .dockerignore. Un multi-stage build con una imagen slim o alpine lo reduce mucho.',
        },
      ],
      refs: [
        { label: 'Docker Docs — Best practices', url: 'https://docs.docker.com/build/building/best-practices/' },
        { label: 'Docker Docs — Multi-stage builds', url: 'https://docs.docker.com/build/building/multi-stage/' },
        { label: 'Docker Compose', url: 'https://docs.docker.com/compose/' },
      ],
      closing: '¿Quieres contenerizar tu proyecto? Puedo ayudarte a configurarlo.',
    }),
  },
  {
    id: 'art-cicd-github-actions',
    slug: 'ci-cd-github-actions-despliegues-seguros',
    date: 'SEPTIEMBRE 2025',
    tag: 'DEVOPS',
    title: 'CI/CD con GitHub Actions: Despliegues Automáticos y Seguros',
    metaDescription:
      'Cómo montar un pipeline de integración y despliegue continuo con GitHub Actions: lint, tests y build en cada PR, caché de dependencias, secretos y despliegues por entorno.',
    excerpt:
      'Desplegar a mano es lento y propenso a errores. Cómo montar un pipeline con GitHub Actions que valide cada cambio, gestione secretos de forma segura y despliegue por entornos.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'ci',
      intro:
        'Si cada despliegue depende de que alguien recuerde ejecutar los tests, compilar y subir archivos al servidor, tarde o temprano algo se rompe en producción. La integración y el despliegue continuos automatizan esos pasos para que cada cambio se valide igual, siempre.',
      takeaways: [
        'CI valida cada pull request (lint, tipos, tests, build) antes de que llegue a la rama principal.',
        'La caché de dependencias reduce el tiempo de cada ejecución de minutos a segundos.',
        'Los secretos se guardan en GitHub Secrets o en entornos protegidos, nunca en el YAML.',
        'Separar entornos (staging y producción) con aprobaciones reduce el riesgo de cada despliegue.',
      ],
      sections: [
        {
          id: 'ci-pipeline',
          title: 'Un pipeline mínimo útil',
          html: '<p>Un workflow en <code>.github/workflows/</code> que se dispare en cada <code>pull_request</code> y ejecute instalación, lint, verificación de tipos, tests y build ya atrapa la mayoría de los errores. Configura la protección de rama para que no se pueda fusionar a <code>main</code> si el pipeline falla.</p>',
        },
        {
          id: 'ci-cache',
          title: 'Velocidad con caché',
          html: '<p>Las acciones oficiales como <code>actions/setup-node</code> permiten cachear dependencias según el lockfile. Usa instalaciones deterministas (<code>npm ci</code>) y ejecuta trabajos independientes en paralelo. Un pipeline rápido es un pipeline que el equipo no intenta saltarse.</p>',
        },
        {
          id: 'ci-secretos',
          title: 'Secretos y permisos',
          html: '<p>Guarda credenciales en GitHub Secrets y limita el <code>GITHUB_TOKEN</code> con la clave <code>permissions</code> al mínimo necesario. Cuando el proveedor lo permita, usa OIDC para autenticarte en la nube sin guardar claves de larga duración. Fija las acciones de terceros a una versión o commit concreto.</p>',
        },
        {
          id: 'ci-entornos',
          title: 'Despliegue por entornos',
          html: '<p>Despliega automáticamente a staging al fusionar en <code>main</code> y a producción tras una aprobación manual o al crear una etiqueta de versión. Los entornos de GitHub permiten exigir revisores y tener secretos distintos por entorno. Ten siempre un camino rápido de rollback.</p>',
        },
      ],
      faqs: [
        {
          q: '¿GitHub Actions es gratis?',
          a: 'Los repositorios públicos tienen minutos gratuitos amplios y los privados incluyen una cuota mensual según el plan. Revisa la página de facturación de GitHub para los límites actuales.',
        },
        {
          q: '¿Necesito Actions si uso Vercel o Netlify?',
          a: 'Esas plataformas ya despliegan en cada push. Actions sigue siendo útil para tests, lint y validaciones que deben pasar antes de fusionar.',
        },
        {
          q: '¿Cómo depuro un workflow que falla?',
          a: 'Revisa los logs de cada paso, reproduce los comandos en local y habilita el registro de depuración del runner si necesitas más detalle.',
        },
      ],
      refs: [
        { label: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions' },
        { label: 'Security hardening for GitHub Actions', url: 'https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions' },
      ],
      closing: '¿Tu equipo sigue desplegando a mano? Automaticémoslo.',
    }),
  },
  {
    id: 'art-powerbi-modelo-estrella',
    slug: 'power-bi-modelo-estrella-dashboards-rapidos',
    date: 'AGOSTO 2025',
    tag: 'DATA / BI',
    title: 'Modelado en Estrella para Power BI: Dashboards Rápidos y Medidas Confiables',
    metaDescription:
      'Por qué el esquema en estrella es la base de un buen modelo en Power BI: tablas de hechos y dimensiones, relaciones, tabla de fechas y medidas DAX consistentes.',
    excerpt:
      'Un dashboard lento o con totales que no cuadran casi siempre tiene un modelo de datos mal diseñado. Cómo aplicar el esquema en estrella en Power BI para ganar velocidad y confianza.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'bi',
      intro:
        'Es tentador cargar en Power BI una gran tabla plana exportada del ERP y empezar a construir gráficos. Funciona hasta que los datos crecen, los filtros dan resultados extraños y cada medida necesita un parche. La solución no está en el DAX, está en el modelo: el esquema en estrella.',
      takeaways: [
        'Las tablas de hechos guardan eventos medibles; las dimensiones describen el contexto (quién, qué, cuándo, dónde).',
        'Relaciones de uno a varios desde las dimensiones hacia los hechos, con filtro en una sola dirección.',
        'Una tabla de fechas dedicada y marcada como tal habilita la inteligencia de tiempo en DAX.',
        'Las medidas explícitas son preferibles a las columnas calculadas para agregaciones.',
      ],
      sections: [
        {
          id: 'bi-estrella',
          title: 'Hechos y dimensiones',
          html: '<p>La tabla de hechos contiene una fila por evento (una venta, un registro de nómina, un movimiento de inventario) con claves y valores numéricos. Las dimensiones (clientes, productos, sedes, fechas) contienen los atributos por los que se filtra y agrupa. Separarlas reduce la duplicación de datos y hace que el motor VertiPaq comprima y consulte mucho mejor.</p>',
        },
        {
          id: 'bi-relaciones',
          title: 'Relaciones bien definidas',
          html: '<p>Cada dimensión se relaciona con la tabla de hechos mediante una relación de uno a varios con filtro unidireccional. Evita las relaciones bidireccionales salvo casos justificados: introducen ambigüedad y resultados difíciles de explicar. Si dos tablas de hechos comparten dimensiones, ambas se conectan a las mismas dimensiones, no entre sí.</p>',
        },
        {
          id: 'bi-fechas',
          title: 'La tabla de fechas',
          html: '<p>Crea una tabla de calendario continua, con año, mes, trimestre y otros atributos, y márcala como tabla de fechas. Funciones como <code>TOTALYTD</code>, <code>SAMEPERIODLASTYEAR</code> o <code>DATEADD</code> dependen de ella para comparar periodos correctamente.</p>',
        },
        {
          id: 'bi-medidas',
          title: 'Medidas explícitas en DAX',
          html: '<p>Define medidas como <code>Ventas Totales = SUM(Ventas[Monto])</code> y construye las demás sobre ellas. Las medidas se calculan según el contexto de filtro y no ocupan memoria por fila, a diferencia de las columnas calculadas. Organízalas en una tabla de medidas y documenta su lógica de negocio.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Una tabla plana es siempre mala?',
          a: 'Para un análisis pequeño y puntual puede bastar. En cuanto crecen los datos o se combinan varias fuentes, el esquema en estrella da mejor rendimiento y medidas más simples.',
        },
        {
          q: '¿Dónde transformo los datos, en Power Query o en la base de datos?',
          a: 'Cuanto más cerca de la fuente, mejor. Si tienes un data warehouse, prepara allí el modelo; si no, Power Query es una buena opción para limpiar y dar forma.',
        },
        {
          q: '¿Por qué mis totales no coinciden con la suma de las filas?',
          a: 'Normalmente por el contexto de filtro de la medida o por relaciones ambiguas. Revisa la dirección de los filtros y prueba la medida en una tabla simple para aislar el problema.',
        },
      ],
      refs: [
        { label: 'Microsoft Learn — Star schema in Power BI', url: 'https://learn.microsoft.com/en-us/power-bi/guidance/star-schema' },
        { label: 'DAX Guide', url: 'https://dax.guide' },
      ],
      closing: '¿Tus reportes tardan o no cuadran? Puedo revisar tu modelo de datos.',
    }),
  },
  {
    id: 'art-prompts-produccion',
    slug: 'prompts-llm-en-produccion',
    date: 'JULIO 2025',
    tag: 'AI / LLM',
    title: 'Prompts para LLM en Producción: Del Experimento a un Sistema Confiable',
    metaDescription:
      'Cómo diseñar prompts para aplicaciones reales: instrucciones claras, salidas estructuradas en JSON, ejemplos, evaluación sistemática, control de costos y mitigación de prompt injection.',
    excerpt:
      'Un prompt que funciona en el chat no está listo para producción. Salidas estructuradas, ejemplos, evaluación sistemática, control de costos y defensa ante prompt injection.',
    readTime: '8 min de lectura',
    contentHtml: buildArticle({
      prefix: 'pr',
      intro:
        'Probar un prompt en una interfaz de chat y obtener una buena respuesta es el inicio, no el final. En una aplicación, ese prompt se ejecutará miles de veces con entradas impredecibles, y cada respuesta debe poder procesarse por código. Pasar del experimento a un sistema confiable exige tratar el prompt como cualquier otra pieza de software.',
      takeaways: [
        'Instrucciones explícitas, contexto delimitado y formato de salida definido reducen la variabilidad.',
        'Las salidas estructuradas en JSON con un esquema permiten validar cada respuesta por código.',
        'Un conjunto de evaluación con casos reales es la única forma de saber si un cambio mejora o empeora.',
        'Todo texto del usuario o de fuentes externas puede intentar manipular el modelo: trátalo como no confiable.',
      ],
      sections: [
        {
          id: 'pr-estructura',
          title: 'Estructura de un buen prompt',
          html: '<p>Define el rol y la tarea, separa claramente las instrucciones de los datos (con etiquetas o delimitadores), especifica qué hacer cuando falta información y describe el formato de salida exacto. Uno o dos ejemplos de entrada y salida esperada suelen mejorar más la consistencia que párrafos extra de instrucciones.</p>',
        },
        {
          id: 'pr-json',
          title: 'Salidas estructuradas',
          html: '<p>Si tu código necesita procesar la respuesta, pide JSON y usa las funciones de salida estructurada o de herramientas que ofrecen los proveedores. Valida siempre la respuesta contra un esquema y define qué hacer si no es válida: reintentar, usar un valor por defecto o escalar a una persona.</p>',
        },
        {
          id: 'pr-eval',
          title: 'Evaluación sistemática',
          html: '<p>Reúne decenas de casos reales, incluidos los difíciles y los ambiguos, con el resultado esperado. Cada vez que cambies el prompt o el modelo, ejecuta el conjunto completo y compara. Versiona los prompts igual que el código para poder volver atrás si la calidad baja.</p>',
        },
        {
          id: 'pr-riesgos',
          title: 'Costos y prompt injection',
          html: '<p>Controla los tokens de entrada (envía solo el contexto necesario), elige el modelo más pequeño que cumpla la tarea y cachea respuestas repetidas. En seguridad, asume que cualquier texto externo puede contener instrucciones maliciosas: limita las acciones que el modelo puede ejecutar, valida sus salidas y pide confirmación humana para operaciones sensibles.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Un prompt más largo es mejor?',
          a: 'No necesariamente. Más texto aumenta el costo y puede diluir las instrucciones importantes. Claridad y buenos ejemplos pesan más que la longitud.',
        },
        {
          q: '¿Cómo reduzco las alucinaciones?',
          a: 'Proporciona el contexto necesario (por ejemplo con RAG), indica que responda solo con esa información y que diga cuando no sabe, y pide que cite sus fuentes.',
        },
        {
          q: '¿Puedo bloquear totalmente el prompt injection?',
          a: 'No existe una defensa perfecta. Se mitiga con permisos mínimos, validación de salidas, separación clara de instrucciones y datos, y supervisión humana en acciones de impacto.',
        },
      ],
      refs: [
        { label: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai' },
        { label: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/' },
      ],
      closing: '¿Quieres llevar un prototipo de IA a producción? Hablemos.',
    }),
  },
];
