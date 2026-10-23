import { WritingArticle } from '../types';
import { buildArticle } from './blogArticles';

// Artículos 26-35 del blog (misma estructura que el resto)
export const MORE_WRITING_ARTICLES_2: WritingArticle[] = [
  {
    id: 'art-asistencia-biometrica-slack',
    slug: 'automatizar-asistencia-biometrica-slack-erp',
    date: 'AGOSTO 2024',
    tag: 'AUTOMATION',
    title: 'Caso Práctico: Alertas de Llegada Tarde desde un Reloj Biométrico a Slack y al ERP',
    metaDescription:
      'Cómo diseñar una automatización que toma las marcaciones de un reloj biométrico, detecta llegadas tarde, avisa en Slack y registra todo en un ERP con acceso restringido.',
    excerpt:
      'Del dedo en el lector biométrico a una alerta en Slack en segundos. Arquitectura, reglas de negocio, privacidad y lecciones de una automatización de control de asistencia.',
    readTime: '8 min de lectura',
    contentHtml: buildArticle({
      prefix: 'bio',
      intro:
        'En una cadena de farmacias, saber quién llegó tarde solía depender de revisar reportes del reloj biométrico al final de la semana. Para entonces ya no había nada que corregir. La automatización que construí con Zapier cambia el momento en que la información llega: el jefe se entera cuando ocurre, y Recursos Humanos tiene los indicadores consolidados en el ERP interno. Así está pensada la solución, sin entrar en datos de la empresa.',
      takeaways: [
        'El valor no está en registrar la marcación, sino en que la persona correcta se entere a tiempo.',
        'Las reglas de negocio (hora límite por turno, tolerancia, departamentos) deben vivir en un solo lugar.',
        'Los datos de asistencia son información laboral sensible: el acceso debe limitarse a quien lo necesita.',
        'Cada marcación debe procesarse una sola vez, aunque el flujo se reintente.',
      ],
      sections: [
        {
          id: 'bio-flujo',
          title: 'El flujo de punta a punta',
          html: '<p>El empleado marca su huella en el sistema biométrico. La marcación llega a Zapier, que identifica al empleado, busca su hora esperada según el turno y calcula la diferencia. Si llegó después del límite, publica un mensaje en un canal privado de Slack con el nombre, el departamento, la hora de marcación, el límite y los minutos de retraso. En paralelo, toda marcación, tarde o no, se registra en el módulo de asistencia del ERP.</p>',
        },
        {
          id: 'bio-reglas',
          title: 'Reglas de negocio claras',
          html: '<p>Antes de automatizar hay que acordar las reglas: qué hora límite tiene cada turno, si existe una tolerancia de minutos, qué pasa con los días libres o las horas extra y qué departamentos aplican. Si esas reglas se reparten entre varios pasos del flujo, cualquier cambio se vuelve un riesgo. Centralízalas en una tabla de horarios que el flujo consulte.</p>',
        },
        {
          id: 'bio-privacidad',
          title: 'Privacidad y acceso restringido',
          html: '<p>La puntualidad de una persona es un dato laboral sensible. Por eso el canal de Slack es privado y el módulo del ERP solo lo ven Recursos Humanos y la Gerencia General. Los mensajes incluyen únicamente la información necesaria para actuar, y el registro completo queda en el sistema interno, no disperso en conversaciones.</p>',
        },
        {
          id: 'bio-indicadores',
          title: 'De alertas a indicadores',
          html: '<p>Las alertas resuelven el día a día; los indicadores ayudan a tomar decisiones. En el ERP, el módulo muestra llegadas tarde, empleados con tardanza y minutos acumulados por periodo, con filtros por fecha, nombre y departamento. Así se distinguen los retrasos ocasionales de los patrones que requieren una conversación o un ajuste de turnos.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Por qué Zapier y no un desarrollo a medida?',
          a: 'Permitió poner la solución en marcha rápido y conectar sistemas existentes sin modificar el reloj biométrico. Si el volumen o la lógica crecen, el mismo diseño se puede trasladar a n8n o a un servicio propio.',
        },
        {
          q: '¿Qué pasa si Slack o el ERP no responden?',
          a: 'Los pasos deben tener reintentos y una alerta de error para el responsable técnico. Además, el flujo debe evitar duplicados si una marcación se procesa dos veces.',
        },
        {
          q: '¿Se puede ver una demostración?',
          a: 'Sí. En la sección de proyectos de este portafolio hay una recreación del módulo del ERP y del canal de Slack con datos completamente ficticios.',
        },
      ],
      refs: [
        { label: 'Zapier — Slack integrations', url: 'https://zapier.com/apps/slack/integrations' },
        { label: 'Slack API — Messaging', url: 'https://api.slack.com/messaging' },
      ],
      closing: '¿Quieres automatizar el control de asistencia de tu empresa? Hablemos.',
    }),
  },
  {
    id: 'art-colas-segundo-plano',
    slug: 'colas-y-tareas-en-segundo-plano',
    date: 'JULIO 2024',
    tag: 'BACKEND',
    title: 'Colas y Tareas en Segundo Plano: Respuestas Rápidas Aunque el Trabajo Sea Lento',
    metaDescription:
      'Cuándo mover trabajo a una cola, cómo diseñar jobs idempotentes, reintentos con backoff, colas de mensajes fallidos y monitoreo de workers.',
    excerpt:
      'Enviar correos, generar PDFs o llamar APIs lentas no debería bloquear la respuesta al usuario. Cómo diseñar tareas en segundo plano confiables.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'queue',
      intro:
        'Si una petición tarda diez segundos porque está enviando un correo, generando un reporte y llamando a tres APIs externas, el problema no es el servidor: es que el trabajo está en el lugar equivocado. Una cola permite responder al usuario de inmediato y hacer el trabajo pesado después, con reintentos si algo falla.',
      takeaways: [
        'Todo trabajo lento, frágil o que no necesita resultado inmediato es candidato a una cola.',
        'Los jobs deben ser idempotentes: ejecutarlos dos veces debe producir el mismo resultado.',
        'Los reintentos con espera exponencial evitan saturar un servicio que ya está fallando.',
        'Los jobs que fallan repetidamente van a una cola de fallidos para revisión, no desaparecen.',
      ],
      sections: [
        {
          id: 'queue-cuando',
          title: 'Qué mover a una cola',
          html: '<p>Correos y notificaciones, generación de documentos, procesamiento de imágenes, sincronizaciones con sistemas externos e importaciones masivas. La petición web valida los datos, guarda lo necesario, encola el trabajo y responde. Un worker independiente procesa la cola a su ritmo.</p>',
        },
        {
          id: 'queue-idempotencia',
          title: 'Jobs idempotentes',
          html: '<p>La mayoría de los sistemas de colas garantizan entregar un mensaje al menos una vez, lo que significa que a veces lo entregan dos. Diseña cada job para tolerarlo: usa un identificador único, comprueba si el trabajo ya se hizo y usa operaciones del tipo "crear si no existe" en lugar de "crear siempre".</p>',
        },
        {
          id: 'queue-reintentos',
          title: 'Reintentos y fallidos',
          html: '<p>Reintenta los errores temporales (timeouts, límites de peticiones) con espera exponencial y algo de aleatoriedad. No reintentes errores permanentes, como datos inválidos. Tras un número máximo de intentos, mueve el job a una cola de mensajes fallidos y alerta para que una persona lo revise.</p>',
        },
        {
          id: 'queue-monitoreo',
          title: 'Monitoreo',
          html: '<p>Vigila el tamaño de la cola, el tiempo que esperan los jobs y la tasa de errores. Una cola que crece sin parar indica que faltan workers o que algo está fallando. Herramientas como BullMQ (sobre Redis) o servicios administrados como SQS ofrecen paneles y métricas para esto.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Qué herramienta de colas uso?',
          a: 'En Node.js, BullMQ sobre Redis es una opción popular. En la nube, servicios como AWS SQS o Google Cloud Tasks evitan administrar infraestructura. Para flujos de eventos de gran volumen, Kafka.',
        },
        {
          q: '¿Cómo informo al usuario del resultado?',
          a: 'Guarda el estado del trabajo y consúltalo desde el cliente, o notifica por correo, WebSocket o notificación cuando termine.',
        },
        {
          q: '¿Puedo usar la base de datos como cola?',
          a: 'Para volúmenes bajos, sí, con consultas que bloqueen filas de forma segura. Cuando el volumen crece, una herramienta dedicada es más eficiente.',
        },
      ],
      refs: [
        { label: 'BullMQ', url: 'https://docs.bullmq.io' },
        { label: 'AWS — Exponential backoff and jitter', url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/' },
      ],
      closing: '¿Tu aplicación tarda en responder? Revisemos qué se puede mover a segundo plano.',
    }),
  },
  {
    id: 'art-observabilidad',
    slug: 'observabilidad-logs-metricas-trazas',
    date: 'JUNIO 2024',
    tag: 'DEVOPS',
    title: 'Observabilidad para Equipos Pequeños: Logs, Métricas y Trazas que Sí Sirven',
    metaDescription:
      'Cómo saber qué pasa en producción: logs estructurados con correlation ID, métricas clave, trazas distribuidas con OpenTelemetry y alertas basadas en síntomas.',
    excerpt:
      'Enterarte de un error porque un cliente llama es demasiado tarde. Logs estructurados, métricas clave y alertas útiles sin montar una plataforma enorme.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'obs',
      intro:
        'Cuando algo falla en producción, la pregunta es siempre la misma: qué pasó, a quién afectó y desde cuándo. Sin observabilidad, responderla significa buscar en logs desordenados y adivinar. Un equipo pequeño no necesita una plataforma costosa para empezar, necesita registrar las cosas correctas de la forma correcta.',
      takeaways: [
        'Los logs estructurados en JSON se pueden filtrar y buscar; el texto libre no.',
        'Un identificador de correlación por petición permite seguir un problema a través de servicios.',
        'Pocas métricas bien elegidas (tráfico, errores, latencia, saturación) cubren la mayoría de los casos.',
        'Las alertas deben avisar de síntomas que afectan al usuario, no de cada evento interno.',
      ],
      sections: [
        {
          id: 'obs-logs',
          title: 'Logs estructurados',
          html: '<p>Registra cada evento como un objeto con nivel, mensaje, marca de tiempo, identificador de la petición y datos relevantes. Así puedes buscar todos los errores de un usuario o de un endpoint concreto. Nunca registres contraseñas, tokens ni datos personales innecesarios.</p>',
        },
        {
          id: 'obs-metricas',
          title: 'Las métricas que importan',
          html: '<p>Las cuatro señales de oro (latencia, tráfico, errores y saturación) dan una visión rápida de la salud de un servicio. Mide la latencia por percentiles (p95, p99) y no solo por promedio: un promedio aceptable puede esconder a un porcentaje de usuarios esperando varios segundos.</p>',
        },
        {
          id: 'obs-trazas',
          title: 'Trazas distribuidas',
          html: '<p>Cuando una petición pasa por varios servicios, una traza muestra cuánto tiempo pasó en cada uno. OpenTelemetry es el estándar abierto para instrumentar aplicaciones y enviar trazas, métricas y logs a distintos proveedores sin quedar atado a uno.</p>',
        },
        {
          id: 'obs-alertas',
          title: 'Alertas útiles',
          html: '<p>Alerta cuando la tasa de errores o la latencia superan un umbral durante varios minutos, no ante cada error aislado. Cada alerta debe ser accionable y, idealmente, incluir un enlace a lo que hay que revisar. Demasiadas alertas producen fatiga y terminan ignorándose todas.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Por dónde empiezo con un presupuesto pequeño?',
          a: 'Logs estructurados centralizados, un monitor externo que compruebe que el sitio responde y un servicio de seguimiento de errores en el frontend y backend. Con eso ya detectas la mayoría de los incidentes.',
        },
        {
          q: '¿Qué es un SLO?',
          a: 'Un objetivo de nivel de servicio, por ejemplo que el 99,9 % de las peticiones respondan sin error en un mes. Ayuda a decidir cuándo priorizar estabilidad frente a nuevas funciones.',
        },
        {
          q: '¿Cuánto tiempo guardo los logs?',
          a: 'Depende de requisitos legales y de costos. Un esquema común es retención detallada por pocas semanas y métricas agregadas por más tiempo.',
        },
      ],
      refs: [
        { label: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/' },
        { label: 'Google SRE Book — Monitoring', url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
      ],
      closing: '¿No sabes qué pasa en tu producción? Te ayudo a instrumentarla.',
    }),
  },
  {
    id: 'art-pandas-analisis',
    slug: 'analisis-de-datos-con-python-pandas',
    date: 'MAYO 2024',
    tag: 'DATA / BI',
    title: 'Análisis de Datos con Python y pandas: Del Excel Desordenado a Respuestas Claras',
    metaDescription:
      'Flujo práctico de análisis con pandas: carga de datos, limpieza de tipos y valores nulos, agrupaciones, uniones, detección de errores y cómo hacer el análisis reproducible.',
    excerpt:
      'Cuando el Excel ya no aguanta, pandas permite limpiar, cruzar y resumir datos de forma reproducible. Un flujo práctico con los errores más comunes.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'pd',
      intro:
        'Muchos análisis empiezan en una hoja de cálculo y se vuelven inmanejables cuando hay que repetirlos cada mes, cruzar varios archivos o procesar cientos de miles de filas. pandas convierte ese trabajo manual en un script que se ejecuta de nuevo con un comando y produce siempre el mismo resultado.',
      takeaways: [
        'La mayor parte del tiempo de un análisis se va en limpiar datos: planifícalo.',
        'Revisa tipos de datos y valores nulos antes de calcular cualquier cosa.',
        'groupby y merge resuelven la mayoría de las preguntas de negocio.',
        'Un análisis en script o notebook versionado es reproducible; uno hecho a mano no.',
      ],
      sections: [
        {
          id: 'pd-carga',
          title: 'Cargar y conocer los datos',
          html: '<p>Lee los datos con <code>read_csv</code> o <code>read_excel</code> y revísalos con <code>info()</code>, <code>describe()</code> y <code>head()</code>. Comprueba cuántas filas hay, qué columnas tienen nulos y si los números llegaron como texto. Indicar los tipos y el formato de fechas al cargar evita sorpresas después.</p>',
        },
        {
          id: 'pd-limpieza',
          title: 'Limpieza',
          html: '<p>Normaliza nombres de columnas, elimina espacios, unifica mayúsculas en categorías, convierte fechas con <code>to_datetime</code> y decide qué hacer con los nulos: descartarlos, rellenarlos o marcarlos. Busca duplicados con <code>duplicated()</code>. Documenta cada decisión, porque cambia el resultado del análisis.</p>',
        },
        {
          id: 'pd-agrupar',
          title: 'Agrupar y cruzar',
          html: '<p><code>groupby</code> con <code>agg</code> responde preguntas como ventas por sede y mes. <code>merge</code> une tablas como una consulta SQL; usa el parámetro <code>validate</code> para detectar relaciones inesperadas que dupliquen filas, uno de los errores más frecuentes y silenciosos.</p>',
        },
        {
          id: 'pd-reproducible',
          title: 'Hacerlo reproducible',
          html: '<p>Guarda el análisis en un script o notebook bajo control de versiones, con las dependencias fijadas. Separa la lectura, la limpieza y el cálculo en funciones. Así el reporte del próximo mes es ejecutar el mismo código con datos nuevos, y cualquier persona puede revisar cómo se llegó a cada número.</p>',
        },
      ],
      faqs: [
        {
          q: '¿pandas o Power BI?',
          a: 'Se complementan. pandas es ideal para limpieza y transformaciones complejas; Power BI para explorar y compartir resultados con usuarios de negocio en paneles interactivos.',
        },
        {
          q: '¿Qué hago si los datos no caben en memoria?',
          a: 'Lee por partes con chunksize, usa tipos más eficientes o herramientas como Polars o DuckDB, que manejan grandes volúmenes con mejor rendimiento.',
        },
        {
          q: '¿Notebook o script?',
          a: 'El notebook es cómodo para explorar. Cuando el análisis se repite, conviene pasarlo a un script o módulo que se pueda ejecutar y probar.',
        },
      ],
      refs: [
        { label: 'pandas — User guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html' },
        { label: 'DuckDB', url: 'https://duckdb.org' },
      ],
      closing: '¿Tienes datos que nadie ha logrado ordenar? Hablemos.',
    }),
  },
  {
    id: 'art-pipelines-etl',
    slug: 'pipelines-de-datos-etl-elt',
    date: 'ABRIL 2024',
    tag: 'DATA / BI',
    title: 'Pipelines de Datos: ETL, ELT y Cómo Evitar Reportes con Números Distintos',
    metaDescription:
      'Diferencias entre ETL y ELT, capas de datos crudos y modelados, cargas incrementales, validaciones de calidad y documentación para que todos los reportes cuenten la misma historia.',
    excerpt:
      'Cuando cada área calcula sus indicadores a su manera, nadie confía en los números. Cómo diseñar pipelines de datos con una sola fuente de verdad.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'etl',
      intro:
        'Un síntoma clásico de datos desordenados: dos gerentes llegan a la misma reunión con cifras de ventas diferentes, y ambos tienen razón según su archivo. La solución no es otro reporte, sino un pipeline que extraiga los datos de los sistemas de origen, los transforme con reglas acordadas y los publique en un lugar común.',
      takeaways: [
        'ETL transforma antes de cargar; ELT carga primero y transforma dentro del almacén de datos.',
        'Separar capas (crudo, limpio, modelado) facilita depurar y reprocesar.',
        'Las cargas incrementales evitan reprocesar todo el histórico en cada ejecución.',
        'Las pruebas de calidad detectan datos rotos antes de que lleguen al reporte.',
      ],
      sections: [
        {
          id: 'etl-diferencia',
          title: 'ETL y ELT',
          html: '<p>En ETL los datos se extraen, se transforman en un proceso intermedio y se cargan ya listos. En ELT se cargan casi crudos en el almacén de datos y se transforman allí con SQL, aprovechando la capacidad de procesamiento de plataformas modernas. ELT facilita volver a calcular cuando cambian las reglas, porque los datos originales siguen disponibles.</p>',
        },
        {
          id: 'etl-capas',
          title: 'Capas de datos',
          html: '<p>Una estructura común tiene tres capas: datos crudos tal como llegan del origen, datos limpios con tipos y nombres normalizados, y modelos de negocio listos para análisis, como un esquema en estrella. Si un indicador sale mal, puedes revisar capa por capa dónde se introdujo el error.</p>',
        },
        {
          id: 'etl-incremental',
          title: 'Cargas incrementales',
          html: '<p>En lugar de copiar todas las tablas cada noche, procesa solo los registros nuevos o modificados, usando una fecha de actualización o un identificador creciente. Ten en cuenta los registros eliminados o corregidos en el origen, y conserva la posibilidad de una recarga completa cuando haga falta.</p>',
        },
        {
          id: 'etl-calidad',
          title: 'Calidad y documentación',
          html: '<p>Valida que las claves sean únicas, que los campos obligatorios no estén vacíos y que los totales cuadren con el sistema de origen. Herramientas como dbt permiten escribir estas pruebas junto a las transformaciones y generar documentación con la definición de cada indicador.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Necesito un data warehouse?',
          a: 'Cuando combinas varias fuentes y muchas personas consultan los mismos indicadores, un almacén central ayuda mucho. Para un análisis puntual con una sola fuente, puede ser excesivo.',
        },
        {
          q: '¿Cada cuánto actualizo los datos?',
          a: 'Según la decisión que soportan. Los reportes financieros mensuales toleran cargas diarias; la operación en tiempo real puede requerir actualizaciones cada pocos minutos.',
        },
        {
          q: '¿Puedo conectar Power BI directamente al ERP?',
          a: 'Es posible, pero consultar el sistema transaccional en horario laboral puede afectar su rendimiento. Una copia o almacén intermedio protege la operación.',
        },
      ],
      refs: [
        { label: 'dbt — Documentation', url: 'https://docs.getdbt.com' },
        { label: 'Microsoft Learn — Power BI dataflows', url: 'https://learn.microsoft.com/en-us/power-bi/transform-model/dataflows/dataflows-introduction-self-service' },
      ],
      closing: '¿Tus reportes no coinciden entre áreas? Te ayudo a ordenar los datos.',
    }),
  },
  {
    id: 'art-copilot-studio',
    slug: 'microsoft-copilot-studio-agentes-empresariales',
    date: 'MARZO 2024',
    tag: 'AI / LLM',
    title: 'Microsoft Copilot Studio: Agentes Empresariales sobre los Datos de tu Organización',
    metaDescription:
      'Cómo planificar un agente en Copilot Studio: casos de uso, fuentes de conocimiento como SharePoint, acciones con Power Automate, permisos, seguridad y medición de resultados.',
    excerpt:
      'Copilot Studio permite crear asistentes sobre documentos y procesos de la empresa sin empezar desde cero. Cómo elegir el caso de uso, conectar datos y mantener la seguridad.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'cps',
      intro:
        'En organizaciones que ya trabajan con Microsoft 365, gran parte del conocimiento vive en SharePoint, Teams y documentos de Office. Copilot Studio permite construir agentes que respondan preguntas sobre esa información y ejecuten acciones, con herramientas de bajo código. La tecnología está lista; lo difícil es elegir bien qué resolver y con qué datos.',
      takeaways: [
        'Empieza por un caso de uso concreto y frecuente, no por un asistente que lo sepa todo.',
        'La calidad de las respuestas depende de la calidad y vigencia de los documentos fuente.',
        'Las acciones con Power Automate permiten que el agente haga cosas, como crear solicitudes o consultar sistemas.',
        'Respeta los permisos: el agente no debe mostrar información a la que el usuario no tiene acceso.',
      ],
      sections: [
        {
          id: 'cps-caso',
          title: 'Elegir el caso de uso',
          html: '<p>Buenos candidatos son las preguntas repetitivas con respuesta documentada: políticas de Recursos Humanos, procedimientos internos, soporte de primer nivel o consultas de estado de solicitudes. Mide cuántas consultas hay hoy y cuánto tiempo consumen, para comparar después.</p>',
        },
        {
          id: 'cps-conocimiento',
          title: 'Fuentes de conocimiento',
          html: '<p>Conecta sitios de SharePoint, archivos o páginas web como fuentes. Antes, depura los documentos: elimina versiones obsoletas, unifica criterios contradictorios y asigna un responsable a cada fuente. Un agente sobre documentos desactualizados responde con seguridad cosas incorrectas.</p>',
        },
        {
          id: 'cps-acciones',
          title: 'Acciones y procesos',
          html: '<p>Con flujos de Power Automate y conectores, el agente puede registrar una solicitud, consultar un dato en un sistema o enviar una notificación. Pide confirmación al usuario antes de ejecutar acciones y registra cada operación para auditoría.</p>',
        },
        {
          id: 'cps-seguridad',
          title: 'Seguridad y gobierno',
          html: '<p>Define quién puede crear y publicar agentes, revisa las políticas de datos del entorno de Power Platform y verifica que las fuentes respeten los permisos de cada usuario. Prueba el agente con preguntas fuera de su alcance y con intentos de obtener información restringida antes de publicarlo.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Necesito saber programar?',
          a: 'No para casos básicos, porque la mayor parte se configura de forma visual. Para integraciones complejas ayuda conocer Power Automate, APIs y conceptos de datos.',
        },
        {
          q: '¿En qué canales se puede publicar?',
          a: 'Entre otros, en Microsoft Teams, sitios web y otros canales compatibles. Revisa la documentación actual, porque las opciones y licencias cambian con frecuencia.',
        },
        {
          q: '¿Cómo sé si funciona?',
          a: 'Con métricas de uso, tasa de resolución, escalamientos a personas y una muestra periódica de conversaciones revisadas manualmente.',
        },
      ],
      refs: [
        { label: 'Microsoft Copilot Studio documentation', url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/' },
        { label: 'Power Automate documentation', url: 'https://learn.microsoft.com/en-us/power-automate/' },
      ],
      closing: '¿Quieres un agente de IA sobre los datos de tu empresa? Conversemos.',
    }),
  },
  {
    id: 'art-modelado-relacional',
    slug: 'modelado-bases-de-datos-relacionales',
    date: 'FEBRERO 2024',
    tag: 'DATABASES',
    title: 'Modelado de Bases de Datos Relacionales: Normalización sin Dogmas',
    metaDescription:
      'Cómo diseñar un esquema relacional sólido: entidades y relaciones, claves primarias y foráneas, normalización hasta 3FN, restricciones, y cuándo desnormalizar con criterio.',
    excerpt:
      'Un esquema mal diseñado se paga en cada consulta y cada bug de datos. Entidades, claves, normalización y restricciones para un modelo que aguante el crecimiento.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'db',
      intro:
        'El código se refactoriza en una tarde; un esquema de base de datos con millones de registros, no. Las decisiones de modelado que se toman al inicio del proyecto acompañan al sistema durante años. Vale la pena dedicarles tiempo antes de escribir la primera migración.',
      takeaways: [
        'Modela a partir de las entidades del negocio y sus relaciones, no de las pantallas.',
        'Las claves foráneas y restricciones protegen la integridad mejor que cualquier validación en el código.',
        'Normalizar hasta la tercera forma normal elimina la mayoría de las inconsistencias.',
        'Desnormaliza solo cuando una consulta medida lo justifique, y documenta por qué.',
      ],
      sections: [
        {
          id: 'db-entidades',
          title: 'Entidades y relaciones',
          html: '<p>Identifica las entidades (cliente, pedido, producto, sede) y cómo se relacionan: uno a uno, uno a varios o varios a varios. Las relaciones varios a varios se resuelven con una tabla intermedia, que a menudo termina teniendo atributos propios, como la cantidad y el precio en una línea de pedido.</p>',
        },
        {
          id: 'db-claves',
          title: 'Claves y restricciones',
          html: '<p>Cada tabla necesita una clave primaria estable. Las claves foráneas impiden registros huérfanos; las restricciones <code>NOT NULL</code>, <code>UNIQUE</code> y <code>CHECK</code> garantizan reglas como que un correo no se repita o que una cantidad sea positiva. Estas reglas se cumplen aunque los datos lleguen por un script, una importación o una aplicación distinta.</p>',
        },
        {
          id: 'db-normalizacion',
          title: 'Normalización',
          html: '<p>La idea central es guardar cada dato en un solo lugar. Si el nombre de un cliente aparece repetido en cada pedido, cambiarlo exige actualizar muchas filas y tarde o temprano quedarán inconsistentes. Las tres primeras formas normales eliminan grupos repetidos, dependencias parciales y dependencias transitivas.</p>',
        },
        {
          id: 'db-desnormalizar',
          title: 'Cuándo desnormalizar',
          html: '<p>En sistemas de reportes o consultas muy frecuentes, duplicar algunos datos o precalcular totales puede ser razonable. Hazlo cuando una medición demuestre el problema, define cómo se mantienen sincronizados los datos duplicados y documenta la decisión. Un dato histórico, como el precio al momento de la venta, no es duplicación: es un hecho distinto.</p>',
        },
      ],
      faqs: [
        {
          q: '¿UUID o identificador autoincremental?',
          a: 'Los autoincrementales son compactos y eficientes en índices. Los UUID permiten generar IDs fuera de la base de datos y no revelan volúmenes. Variantes ordenables como UUIDv7 combinan ventajas de ambos.',
        },
        {
          q: '¿Debo borrar registros o marcarlos como inactivos?',
          a: 'Para datos con valor histórico o legal, el borrado lógico con una fecha de eliminación suele ser más seguro. Recuerda filtrarlos en las consultas y en los índices únicos.',
        },
        {
          q: '¿Relacional o NoSQL?',
          a: 'Si los datos tienen relaciones claras y necesitas consistencia, una base relacional es la opción por defecto. NoSQL aporta en casos concretos, como documentos muy variables o volúmenes de escritura masivos.',
        },
      ],
      refs: [
        { label: 'PostgreSQL — Constraints', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
        { label: 'Microsoft Learn — Database normalization', url: 'https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description' },
      ],
      closing: '¿Empiezas un proyecto y quieres un esquema sólido? Revisémoslo juntos.',
    }),
  },
  {
    id: 'art-formularios-react',
    slug: 'formularios-react-validacion-ux',
    date: 'ENERO 2024',
    tag: 'FRONTEND',
    title: 'Formularios en React: Validación, Accesibilidad y Experiencia de Usuario',
    metaDescription:
      'Cómo construir formularios en React que conviertan: validación con esquemas, mensajes de error útiles, accesibilidad, estados de envío y protección contra envíos duplicados.',
    excerpt:
      'Un formulario confuso cuesta reservas, ventas y contactos. Validación con esquemas, errores claros, accesibilidad y estados de envío bien resueltos.',
    readTime: '6 min de lectura',
    contentHtml: buildArticle({
      prefix: 'form',
      intro:
        'En un sitio de servicios, el formulario es el momento en que una visita se convierte en cliente. Cada campo innecesario, error ambiguo o botón que no responde se traduce en personas que abandonan. Construir buenos formularios es una mezcla de técnica y empatía con quien los llena.',
      takeaways: [
        'Pide solo los datos que realmente necesitas en ese momento.',
        'Un esquema de validación compartido evita reglas duplicadas e inconsistentes.',
        'Los errores deben explicar cómo corregir el problema, junto al campo afectado.',
        'Deshabilita el envío mientras se procesa y muestra un resultado claro.',
      ],
      sections: [
        {
          id: 'form-campos',
          title: 'Menos campos, mejores campos',
          html: '<p>Cada campo extra reduce la tasa de conversión. Usa el tipo de input adecuado (<code>email</code>, <code>tel</code>, <code>date</code>) para que los móviles muestren el teclado correcto, el atributo <code>autocomplete</code> para que el navegador rellene datos conocidos y etiquetas visibles en lugar de solo placeholders.</p>',
        },
        {
          id: 'form-validacion',
          title: 'Validación con esquemas',
          html: '<p>Librerías como React Hook Form, combinadas con un esquema de Zod, definen las reglas una sola vez y se pueden reutilizar en el servidor. Valida al salir del campo o al enviar, no con cada tecla, para no mostrar errores mientras la persona todavía escribe. Y recuerda que la validación del cliente es para la experiencia; la del servidor, para la seguridad.</p>',
        },
        {
          id: 'form-errores',
          title: 'Errores comprensibles y accesibles',
          html: '<p>"Ingresa un correo válido, por ejemplo nombre@dominio.com" ayuda; "Campo inválido" no. Muestra el error junto al campo, asócialo con <code>aria-describedby</code>, marca el campo con <code>aria-invalid</code> y, al enviar con errores, lleva el foco al primer campo que falla.</p>',
        },
        {
          id: 'form-envio',
          title: 'Estados de envío',
          html: '<p>Mientras se envía, deshabilita el botón y muestra que está procesando, para evitar envíos duplicados. Si falla, conserva los datos escritos y explica qué hacer. Si funciona, confirma claramente qué ocurrirá después, por ejemplo cuándo recibirá respuesta.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Formularios controlados o no controlados?',
          a: 'Para formularios grandes, un enfoque no controlado como el de React Hook Form evita renders en cada tecla y suele rendir mejor. Para casos simples, cualquiera funciona.',
        },
        {
          q: '¿Cómo evito el spam?',
          a: 'Combinando validación en servidor, límites de envíos por IP, un campo trampa oculto y, si hace falta, un CAPTCHA amigable.',
        },
        {
          q: '¿Formulario en un paso o en varios?',
          a: 'Para procesos largos, como una reserva con varias opciones, dividir en pasos con progreso visible reduce la sensación de esfuerzo. Guarda el avance para no perder datos.',
        },
      ],
      refs: [
        { label: 'React Hook Form', url: 'https://react-hook-form.com' },
        { label: 'WAI — Forms tutorial', url: 'https://www.w3.org/WAI/tutorials/forms/' },
        { label: 'web.dev — Sign-up form best practices', url: 'https://web.dev/articles/sign-up-form-best-practices' },
      ],
      closing: '¿Tus formularios no convierten? Puedo revisarlos.',
    }),
  },
  {
    id: 'art-sitios-bilingues',
    slug: 'sitios-web-bilingues-i18n-seo',
    date: 'DICIEMBRE 2023',
    tag: 'FRONTEND',
    title: 'Sitios Web Bilingües: Internacionalización y SEO en Inglés y Español',
    metaDescription:
      'Cómo construir sitios en varios idiomas: estructura de URLs, hreflang, traducciones gestionadas, formatos de fecha y moneda con Intl, y errores comunes de SEO multilingüe.',
    excerpt:
      'En mercados como Miami, un sitio solo en inglés deja fuera a gran parte de los clientes. Cómo estructurar un sitio bilingüe que funcione para usuarios y buscadores.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'i18n',
      intro:
        'Para un negocio en el sur de Florida, ofrecer el sitio, las reservas y las herramientas en inglés y en español no es un detalle, es una decisión comercial. He trabajado en sitios con ese requisito y la parte técnica es manejable; el reto está en mantener ambos idiomas completos, coherentes e indexables.',
      takeaways: [
        'Cada idioma debe tener su propia URL para poder indexarse por separado.',
        'Las etiquetas hreflang indican a los buscadores qué versión mostrar a cada usuario.',
        'Las traducciones viven en archivos o en un CMS, no mezcladas en los componentes.',
        'Fechas, monedas y números se formatean según el idioma con la API Intl.',
      ],
      sections: [
        {
          id: 'i18n-urls',
          title: 'Estructura de URLs',
          html: '<p>Usa subdirectorios como <code>/es/</code> y <code>/en/</code>, subdominios o dominios distintos. Los subdirectorios suelen ser los más simples de mantener. Evita cambiar el idioma solo con JavaScript o cookies en la misma URL: los buscadores verían una sola versión.</p>',
        },
        {
          id: 'i18n-hreflang',
          title: 'hreflang y metadatos',
          html: '<p>Cada página debe enlazar a sus equivalentes en otros idiomas con <code>&lt;link rel="alternate" hreflang="es"&gt;</code>, incluida una referencia a sí misma y, si aplica, un <code>x-default</code>. Traduce también el title, la meta description, los textos alternativos y los datos estructurados, y define el atributo <code>lang</code> del HTML.</p>',
        },
        {
          id: 'i18n-traducciones',
          title: 'Gestionar las traducciones',
          html: '<p>Centraliza los textos en archivos por idioma o en un CMS con campos por idioma, con claves descriptivas. Configura el sistema para detectar textos faltantes en lugar de mostrar claves vacías. Una traducción profesional o revisada por hablantes nativos es clave en contenidos médicos, legales o de precios.</p>',
        },
        {
          id: 'i18n-formatos',
          title: 'Fechas, números y monedas',
          html: '<p><code>Intl.DateTimeFormat</code> y <code>Intl.NumberFormat</code> formatean según el idioma y región: "October 23, 2026" frente a "23 de octubre de 2026", o separadores decimales distintos. Así evitas escribir funciones de formato a mano para cada idioma.</p>',
        },
      ],
      faqs: [
        {
          q: '¿Puedo usar traducción automática?',
          a: 'Como punto de partida, sí, pero revisa el resultado, sobre todo en textos de venta, salud o legales. Un error de traducción afecta la confianza y puede tener consecuencias.',
        },
        {
          q: '¿Redirijo según el idioma del navegador?',
          a: 'Mejor sugerir el cambio que forzarlo. Las redirecciones automáticas pueden impedir que algunos usuarios o rastreadores accedan a la versión que buscan.',
        },
        {
          q: '¿Necesito un contenido diferente por idioma?',
          a: 'No siempre, pero adaptar ejemplos, términos de búsqueda y llamados a la acción a cada audiencia suele dar mejores resultados que una traducción literal.',
        },
      ],
      refs: [
        { label: 'Google Search Central — Multi-regional and multilingual sites', url: 'https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites' },
        { label: 'MDN — Intl', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl' },
      ],
      closing: '¿Necesitas tu sitio en inglés y español? Puedo ayudarte.',
    }),
  },
  {
    id: 'art-desplegar-vps',
    slug: 'desplegar-aplicacion-en-vps-propio',
    date: 'NOVIEMBRE 2023',
    tag: 'DEVOPS',
    title: 'Desplegar en un Servidor Propio (VPS): Seguridad, HTTPS y Copias de Seguridad',
    metaDescription:
      'Checklist para desplegar en un VPS como DigitalOcean: usuario sin root, claves SSH, firewall, proxy inverso con HTTPS, actualizaciones, monitoreo y copias de seguridad probadas.',
    excerpt:
      'Un VPS da control total y costos predecibles, pero también toda la responsabilidad. Checklist para un servidor seguro, con HTTPS, actualizaciones y copias de seguridad.',
    readTime: '7 min de lectura',
    contentHtml: buildArticle({
      prefix: 'vps',
      intro:
        'Plataformas como Vercel simplifican el despliegue de frontends, pero muchos proyectos necesitan un servidor propio: aplicaciones PHP, bases de datos, paneles de administración o herramientas que deben convivir en la misma máquina. Un VPS ofrece ese control, y con él la responsabilidad de mantenerlo seguro.',
      takeaways: [
        'Desactiva el acceso por contraseña y por root; entra con claves SSH y un usuario con sudo.',
        'Un firewall que solo abra los puertos necesarios reduce drásticamente la superficie de ataque.',
        'HTTPS es obligatorio; los certificados de Let\'s Encrypt son gratuitos y se renuevan solos.',
        'Una copia de seguridad que nunca se ha restaurado no es una copia de seguridad.',
      ],
      sections: [
        {
          id: 'vps-acceso',
          title: 'Acceso seguro',
          html: '<p>Crea un usuario con permisos de sudo, configura el acceso por clave SSH y desactiva el inicio de sesión de root y las contraseñas en la configuración de SSH. Herramientas como Fail2ban bloquean direcciones que intentan adivinar credenciales.</p>',
        },
        {
          id: 'vps-red',
          title: 'Firewall y proxy inverso',
          html: '<p>Abre solo SSH, HTTP y HTTPS. Las bases de datos y paneles internos no deben quedar expuestos a internet; accede a ellos por un túnel SSH o una red privada. Un servidor web como Nginx o LiteSpeed actúa como proxy inverso delante de tus aplicaciones y gestiona los certificados.</p>',
        },
        {
          id: 'vps-mantenimiento',
          title: 'Actualizaciones y monitoreo',
          html: '<p>Activa las actualizaciones automáticas de seguridad del sistema operativo y planifica las de tus aplicaciones y paneles. Monitorea disco, memoria y disponibilidad del sitio con alertas: un disco lleno es una de las causas más comunes y evitables de caídas.</p>',
        },
        {
          id: 'vps-backups',
          title: 'Copias de seguridad',
          html: '<p>Combina las instantáneas del proveedor con copias de las bases de datos y archivos guardadas fuera del servidor. Automatízalas, cífralas si contienen datos sensibles y prueba restaurarlas periódicamente en un entorno aparte. El objetivo es saber cuánto tiempo y datos perderías en el peor caso.</p>',
        },
      ],
      faqs: [
        {
          q: '¿VPS o plataforma administrada?',
          a: 'Una plataforma administrada reduce el trabajo operativo y suele ser mejor para frontends y APIs simples. Un VPS conviene cuando necesitas control del entorno, software específico o costos fijos.',
        },
        {
          q: '¿Paneles como CyberPanel son seguros?',
          a: 'Facilitan la administración, pero son software adicional expuesto: mantenlos actualizados, protege su acceso y no los dejes abiertos a todo internet si no es necesario.',
        },
        {
          q: '¿Cada cuánto hago copias de seguridad?',
          a: 'Según cuántos datos puedes permitirte perder. Para un sistema de reservas, copias diarias de la base de datos son un mínimo razonable.',
        },
      ],
      refs: [
        { label: 'DigitalOcean — Initial server setup with Ubuntu', url: 'https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu' },
        { label: "Let's Encrypt", url: 'https://letsencrypt.org/getting-started/' },
        { label: 'Fail2ban', url: 'https://github.com/fail2ban/fail2ban' },
      ],
      closing: '¿Tu servidor necesita una revisión de seguridad? Hablemos.',
    }),
  },
];
