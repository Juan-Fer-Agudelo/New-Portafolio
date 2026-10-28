import type { WritingArticle } from '../types';
import { articleCode, articleTable, buildArticle, compareDiagram, flowDiagram, readTimeOf } from './articleTemplate';

/* Artículos principales del blog. El de monolito a microservicios es el modelo de
   estructura que siguen todos los demás (ver buildArticle en articleTemplate.ts).
   Cada artículo define su contenido en una constante para calcular readTime a partir de él. */

const MONOLITH_TO_MICROSERVICES_CONTENT = buildArticle({
  prefix: 'ms',
  intro:
    'Migrar a microservicios porque "es lo que hace todo el mundo" es la forma más rápida de convertir un sistema lento en un sistema lento, distribuido y difícil de depurar. La pregunta que de verdad importa no es arquitectónica, es operativa: ¿qué parte de tu monolito te está costando dinero o velocidad de entrega cada semana? Este artículo responde eso con criterios concretos y un plan de migración incremental, sin big bang, sin downtime y sin reescribir el sistema desde cero.',
  takeaways: [
    'Los microservicios no resuelven problemas de diseño: un monolito con módulos acoplados se convierte en microservicios acoplados por red, solo que más lentos y más difíciles de depurar.',
    'Las señales reales para migrar son de despliegue y de organización de equipos, no de "líneas de código" ni de moda tecnológica.',
    'El patrón Strangler Fig permite extraer servicios de forma incremental, con rollback inmediato si algo falla en producción.',
    'La mayoría de los equipos de menos de 15 ingenieros no necesitan microservicios: necesitan un monolito mejor modularizado.',
  ],
  sections: [
    {
      id: 'ms-pregunta',
      title: 'La pregunta equivocada: "¿Necesito microservicios?"',
      html: `<p>Esa pregunta no tiene una respuesta útil porque está planteada al revés. Ningún sistema "necesita" microservicios por sí mismo; una organización necesita desplegar más rápido, escalar un componente específico o dejar que equipos trabajen sin pisarse. La arquitectura es una consecuencia de esas restricciones, no un objetivo en sí misma. Antes de hablar de servicios, colas o service mesh, hay que identificar en qué parte exacta del ciclo de entrega está el dolor real: ¿en el despliegue, en el escalado, en la coordinación entre equipos, o simplemente en un código mal modularizado que nadie ha ordenado?</p>
<p>La Ley de Conway explica por qué tantas migraciones fallan: los sistemas terminan replicando la estructura de comunicación de la organización que los construye. Si trocear el monolito en servicios no viene acompañado de equipos autónomos con ownership real sobre cada uno, el resultado es un monolito distribuido: la misma falta de límites claros, ahora con la latencia y la complejidad operativa de la red añadidas encima.</p>`,
    },
    {
      id: 'ms-senales',
      title: 'Las 3 señales reales de que tu monolito necesita cambiar',
      html: '<p>Hay señales legítimas para migrar y hay excusas disfrazadas de argumento técnico. Estas tres son las que valido primero en cualquier auditoría de arquitectura, porque son medibles y no dependen de preferencias personales.</p>',
      subsections: [
        {
          id: 'ms-cuellos',
          title: 'Cuellos de botella de despliegue',
          html: '<p>Cuando un cambio de una línea en el módulo de facturación obliga a re-testear y desplegar todo el catálogo de productos, el costo de cada release deja de ser proporcional al cambio. Si tu equipo mide el "lead time" de un fix trivial en días en lugar de horas, y la causa es coordinación de despliegue (no falta de pruebas), esa es una señal real.</p>',
        },
        {
          id: 'ms-equipos',
          title: 'Límites de equipo, no solo de código',
          html: '<p>Si tienes tres equipos con ownership de producto claramente distinto pero comparten un único pipeline de despliegue y un único repositorio sin límites de módulo, la arquitectura y la estructura organizacional están en conflicto. Este es el caso donde extraer servicios alineados a esos equipos reduce fricción real, no solo complejidad percibida.</p>',
        },
        {
          id: 'ms-escalado',
          title: 'Escalado desigual de módulos',
          html: '<p>Un módulo de procesamiento de imágenes, generación de reportes o envío masivo de notificaciones puede consumir el 80% de la CPU en picos puntuales, mientras el resto del sistema está prácticamente ocioso. En un monolito, esto obliga a escalar horizontalmente todo el proceso para resolver el cuello de botella de una sola pieza, encareciendo la infraestructura sin necesidad.</p>',
        },
      ],
    },
    {
      id: 'ms-comparativa',
      title: 'Monolito vs. microservicios: comparativa técnica',
      html: `<p>Ninguna de las dos arquitecturas es superior en abstracto; cada una optimiza para restricciones distintas. Esta tabla resume las decisiones que de verdad cambian según el camino que tomes.</p>
${compareDiagram(
  {
    title: 'Monolito',
    points: ['Todo en un solo proceso', 'Deploy único, simple al inicio', 'Transacciones ACID nativas', 'Escala todo el sistema junto'],
  },
  {
    title: 'Microservicios',
    points: ['Deploy independiente', 'Escalado granular por servicio', 'Consistencia eventual', 'Más red, colas y observabilidad'],
  },
  'Más autonomía a cambio de más complejidad'
)}
${articleTable(
  ['Criterio', 'Monolito', 'Microservicios'],
  [
    ['Despliegue', 'Un solo pipeline, simple al inicio', 'Independiente por servicio, requiere CI/CD maduro'],
    ['Escalabilidad', 'Vertical; escala todo el sistema junto', 'Horizontal; escala solo el servicio con carga'],
    ['Complejidad operativa', 'Baja: un solo proceso, un solo log', 'Alta: orquestación, tracing distribuido, observabilidad'],
    ['Consistencia de datos', 'Transacciones ACID nativas', 'Consistencia eventual; requiere sagas o CDC'],
    ['Velocidad inicial', 'Alta; ideal para MVP y validación de mercado', 'Baja; overhead de infraestructura desde el día uno'],
    ['Costo de infraestructura', 'Predecible y bajo', 'Mayor: red, colas, service mesh, monitoreo'],
    ['Ideal para', 'Equipos &lt; 15 ingenieros, productos en validación', 'Organizaciones con equipos autónomos y dominios definidos'],
  ]
)}`,
    },
    {
      id: 'ms-strangler',
      title: 'La estrategia Strangler Fig: migrar sin romper producción',
      html: '<p>El patrón Strangler Fig (popularizado por Martin Fowler) consiste en envolver el monolito con una capa de enrutamiento y extraer funcionalidad hacia servicios nuevos de forma incremental, mientras el sistema legacy sigue operando sin interrupción. Nunca hay un "big bang": en cualquier momento del proceso, el sistema en producción es una combinación funcional de monolito y servicios nuevos.</p>',
      subsections: [
        {
          id: 'ms-paso1',
          title: 'Identificar el "seam" de dominio',
          html: '<p>Usando límites de dominio (bounded contexts), se elige el primer candidato a extraer. La regla que aplico: nunca el módulo transaccional core (pagos, inventario crítico); sí un módulo periférico, de alto dolor operativo y bajo acoplamiento de datos, como notificaciones, búsqueda o generación de reportes.</p>',
        },
        {
          id: 'ms-paso2',
          title: 'Levantar un proxy de enrutamiento',
          html: `<p>Antes de mover una sola línea de lógica de negocio, se coloca un proxy o API Gateway delante del monolito. Esto permite decidir, por ruta, qué peticiones siguen yendo al sistema legacy y cuáles empiezan a resolverse en el nuevo servicio, sin que el cliente note el cambio.</p>
${flowDiagram(
  ['Cliente', 'API Gateway\n(proxy)', 'Regla por ruta\no % de tráfico', 'Nuevo servicio\no monolito legacy'],
  'El proxy decide quién responde cada ruta'
)}
${articleCode(`
# nginx.conf — enrutamiento incremental estilo Strangler Fig
# El módulo de notificaciones ya vive en un servicio nuevo;
# todo lo demás sigue resolviéndose en el monolito.

location /api/notifications/ {
    proxy_pass http://notifications-service:4000;
}

location /api/ {
    proxy_pass http://legacy-monolith:3000;
}`)}`,
        },
        {
          id: 'ms-paso3',
          title: 'Extraer, medir y tener plan de rollback',
          html: '<p>La lógica se mueve al nuevo servicio detrás de un feature flag o un rollout por porcentaje de tráfico (canary), comparando métricas de error y latencia contra la ruta legacy. El código antiguo se mantiene desplegable durante varias semanas: si algo falla, el rollback es cambiar una regla de enrutamiento, no un despliegue de emergencia. Solo se elimina el camino legacy cuando el nuevo servicio ha demostrado estabilidad bajo carga real.</p>',
        },
      ],
    },
    {
      id: 'ms-errores',
      title: 'Errores comunes que convierten la migración en un incendio',
      html: `<ul>
  <li><strong>Migrar el módulo core primero.</strong> Empezar por el componente de mayor riesgo (pagos, autenticación) maximiza el blast radius del primer error.</li>
  <li><strong>Partir el sistema sin observabilidad distribuida.</strong> Sin trazabilidad (correlation IDs, tracing) un error 500 se convierte en una cacería a ciegas entre varios servicios.</li>
  <li><strong>Compartir una sola base de datos entre "microservicios".</strong> Eso no es una arquitectura de microservicios: es un monolito distribuido, con toda la complejidad de la red y ninguno de sus beneficios de aislamiento.</li>
  <li><strong>No versionar los contratos de API.</strong> Cambiar un endpoint sin versión rompe a los consumidores en cada despliegue y erosiona la confianza en la migración.</li>
  <li><strong>Subestimar la consistencia eventual.</strong> Migrar operaciones que cruzan varios servicios sin implementar sagas o compensaciones deja transacciones a medio completar cuando algo falla a mitad de camino.</li>
</ul>`,
    },
    {
      id: 'ms-nomigrar',
      title: 'Cuándo NO migrar (honestidad técnica)',
      html: '<p>Si tu equipo tiene menos de 15 ingenieros y un solo pipeline de despliegue les funciona sin fricción notable, migrar a microservicios no resuelve un problema que tienes: crea uno nuevo. Los microservicios multiplican el costo operativo (red, colas, monitoreo distribuido, on-call más complejo) y ese costo solo se justifica cuando el dolor de despliegue, escalado o coordinación de equipos ya es real y medible. Si el problema es que el código está mal organizado dentro del monolito, la solución correcta casi siempre es más barata y menos arriesgada: convertirlo en un monolito modular, con límites de dominio claros dentro del mismo proceso, antes de pagar el costo de distribuirlo.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Cuánto tiempo tarda una migración típica a microservicios?',
      a: 'Depende del tamaño del monolito y de la capacidad de tu equipo. El patrón Strangler Fig es incremental, así que es más útil pensar en sprints de 2-4 semanas extrayendo un servicio a la vez, que en un proyecto global. Equipos de 5-10 ingenieros suelen tardar entre 6 y 18 meses en migrar un monolito de mediano tamaño de forma segura y sin pausar la entrega de features.',
    },
    {
      q: '¿Necesito Kubernetes para usar microservicios?',
      a: 'No obligatoriamente. Kubernetes es una opción cuando tienes 15+ servicios y necesitas orquestación declarativa de recursos. Para un equipo pequeño empezando, Docker + Docker Compose o incluso serverless functions (AWS Lambda, Cloud Functions) pueden ser suficientes y menos complejos de operar.',
    },
    {
      q: '¿Qué herramientas recomiendas para tracing distribuido?',
      a: 'Jaeger, Zipkin y Datadog son opciones maduras. Si usas AWS, X-Ray es una opción nativa. Para startups o equipos pequeños, comenzar con logging estructurado (ELK stack) y correlation IDs simples puede ser suficiente antes de invertir en APM full.',
    },
    {
      q: '¿Es posible hacer rollback de una migración parcial?',
      a: 'Sí, ese es el punto del patrón Strangler Fig. Si un servicio nuevo falla bajo carga, cambias el proxy/gateway para que todas las peticiones vuelvan al monolito legacy en minutos. Por eso es crítico que el código antiguo permanezca desplegable durante la transición.',
    },
    {
      q: '¿Qué pasa si el equipo no está preparado técnicamente?',
      a: 'Es la razón número uno por la que fracasan las migraciones. Antes de empezar, asegúrate de que tu equipo entienda: API versioning, eventual consistency, circuit breakers, distributed tracing y cómo debuggear fallos en la red. Si no, invierte primero en entrenamiento que en infraestructura.',
    },
  ],
  refs: [
    { label: 'Strangler Fig Pattern', note: 'Martin Fowler', url: 'https://martinfowler.com/bliki/StranglerFigApplication.html' },
    { label: 'Building Microservices', note: 'Sam Newman (libro recomendado): Segunda edición cubre patrones modernos de migración incremental' },
    { label: 'Microservices Patterns', note: 'Chris Richardson: Referencia sobre sagas, CDC y patrones de datos distribuidos' },
    { label: 'The Art of Scalability', note: 'Martin Abbott &amp; Michael Fisher: Decisiones arquitectónicas basadas en escala real' },
    { label: "Conway's Law", note: 'Melvin E. Conway', url: 'https://www.melconway.com/Home/Committees_Paper.html' },
    { label: 'Observability Engineering', note: 'Yuri Shkuro: Trazabilidad distribuida en sistemas complejos' },
    { label: 'Release It! (2nd Edition)', note: 'Michael T. Nygard: Estabilidad en producción y patrones de resiliencia' },
    { label: 'Domain-Driven Design', note: 'Eric Evans: Fundamentación teórica de bounded contexts y agregados' },
  ],
  closing: 'Si tienes preguntas específicas sobre tu arquitectura o necesitas auditoría técnica, no dudes en contactarme.',
});

const RENDER_PERF_CONTENT = buildArticle({
  prefix: 'rp',
  intro:
    'Una aplicación React lenta rara vez lo es por "React". Casi siempre es por renders que no deberían ocurrir, trabajo pesado en el hilo principal y datos que viajan sin control entre componentes. La pregunta útil no es "¿cómo hago React más rápido?", sino "¿qué interacción concreta se siente lenta y qué la está bloqueando?". Este artículo recorre las causas reales de los cuellos de botella de rendimiento en el frontend, cómo medirlas antes de optimizar a ciegas y qué herramienta aplicar en cada caso.',
  takeaways: [
    'Optimizar sin medir es adivinar: el React Profiler y la pestaña Performance del navegador te dicen dónde está el costo real.',
    'La mayoría de los re-renders innecesarios vienen de referencias nuevas en cada render (objetos, funciones, arrays) pasadas como props, o de estado ubicado demasiado arriba en el árbol.',
    '<code>memo</code>, <code>useMemo</code> y <code>useCallback</code> son herramientas quirúrgicas, no decoradores que se ponen en todos lados.',
    'El code splitting y la carga diferida reducen el bundle inicial, que suele ser el mayor factor de lentitud percibida en la primera visita.',
  ],
  sections: [
    {
      id: 'rp-medir',
      title: 'Primero medir, nunca adivinar',
      html: '<p>Antes de tocar una sola línea, hay que saber qué se está optimizando. Si no tienes un número antes y después, no estás optimizando: estás reorganizando código y esperando suerte. Estas son las tres fuentes de datos que reviso siempre, en este orden.</p>',
      subsections: [
        {
          id: 'rp-profiler',
          title: 'React DevTools Profiler',
          html: '<p>Graba una interacción típica (escribir en un buscador, abrir un modal, cambiar de pestaña) y el Profiler te muestra qué componentes se renderizaron, cuántas veces y cuánto costó cada uno. La opción "Record why each component rendered while profiling" indica si el render se debió a un cambio de props, de estado o de contexto, que es exactamente la información que necesitas para decidir qué corregir.</p>',
        },
        {
          id: 'rp-performance',
          title: 'La pestaña Performance del navegador',
          html: '<p>El Profiler solo ve React. La pestaña Performance de las DevTools muestra el panorama completo: scripting, layout, paint y, sobre todo, las <strong>tareas largas</strong> (más de 50 ms) que bloquean el hilo principal. Si la lentitud está en un cálculo de layout provocado por CSS o en una librería de terceros, el Profiler de React no la va a mostrar. Graba con el CPU ralentizado (4x o 6x) para acercarte a lo que vive un usuario con un teléfono de gama media.</p>',
        },
        {
          id: 'rp-vitals',
          title: 'Métricas de usuario: LCP e INP',
          html: '<p>La métrica que importa al usuario no es cuántos renders ocurren, sino cuánto tarda la interfaz en mostrarse y en responder. <strong>LCP</strong> (Largest Contentful Paint) mide cuándo aparece el contenido principal; <strong>INP</strong> (Interaction to Next Paint) mide cuánto tarda la página en reaccionar visualmente a clics y teclas. Un render extra de un componente trivial no se nota; uno de 300 ms en una lista grande dispara el INP. Prioriza por impacto medible, y si puedes, recoge estas métricas de usuarios reales con la librería <code>web-vitals</code>.</p>',
        },
      ],
    },
    {
      id: 'rp-renders',
      title: 'Por qué se re-renderiza lo que no debería',
      html: `<p>Cuando un componente cambia su estado, React vuelve a ejecutar esa función y, por defecto, la de todos sus hijos, aunque sus props no hayan cambiado de valor. Un render no implica tocar el DOM: React compara el resultado nuevo con el anterior y solo aplica las diferencias. Pero ejecutar componentes caros cientos de veces sí tiene costo, y ahí está el problema.</p>
${flowDiagram(
  ['Cambia el estado\n(setState)', 'Render del\ncomponente', 'Render de\nsus hijos', 'Reconciliación\n(comparar)', 'Commit: DOM\nsolo lo cambiado'],
  'Renderizar no es lo mismo que pintar'
)}
<p>El problema se agrava cuando pasas props que son referencias nuevas en cada render: un objeto literal, una función inline o un array recién creado. Para React esas referencias son distintas en cada ciclo, así que rompen cualquier comparación superficial, incluida la de <code>React.memo</code>. Otro origen frecuente es el contexto: cualquier componente que lee un contexto se re-renderiza cada vez que cambia su valor, y si ese valor es un objeto creado en cada render del proveedor, cambia siempre.</p>
${articleCode(`
const ProductList = memo(function ProductList({ items, filters, onSelect }: Props) {
  // lista costosa de renderizar
});

function Catalog({ items }: { items: Product[] }) {
  const [query, setQuery] = useState("");

  // ✗ Objeto y función nuevos en cada render: memo nunca se aprovecha
  // <ProductList items={items} filters={{ inStock: true }} onSelect={(id) => track(id)} />

  // ✓ Referencias estables entre renders
  const filters = useMemo(() => ({ inStock: true }), []);
  const onSelect = useCallback((id: string) => track(id), []);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ProductList items={items} filters={filters} onSelect={onSelect} />
    </>
  );
}`)}
<p>La solución no es memoizar todo, sino estabilizar las referencias que realmente se pasan a componentes costosos o memoizados, y mantener el estado lo más cerca posible de donde se usa para que el árbol que se re-renderiza sea pequeño.</p>`,
    },
    {
      id: 'rp-memo',
      title: 'memo, useMemo y useCallback sin abusar',
      html: `<p><code>React.memo</code> evita el re-render de un componente si sus props no cambiaron por comparación superficial. <code>useMemo</code> cachea el resultado de un cálculo costoso y <code>useCallback</code> estabiliza la identidad de una función. La clave: cada uno tiene un costo propio (comparar props o dependencias, guardar en memoria) y añade complejidad al código. Aplicarlos a componentes baratos no se paga, y un array de dependencias mal escrito introduce bugs de datos desactualizados.</p>
${articleTable(
  ['Herramienta', 'Qué evita', 'Cuándo usarla', 'Costo'],
  [
    ['<code>React.memo</code>', 'Re-render de un hijo con las mismas props', 'Componentes caros que reciben props estables', 'Comparar props en cada render del padre'],
    ['<code>useMemo</code>', 'Recalcular un valor derivado', 'Cálculos costosos u objetos pasados a hijos memoizados', 'Guardar el valor y comparar dependencias'],
    ['<code>useCallback</code>', 'Crear una función nueva en cada render', 'Funciones pasadas a hijos memoizados o usadas en efectos', 'Igual que useMemo, sin beneficio si el hijo no está memoizado'],
    ['Mover el estado', 'Re-renders de ramas que no usan ese estado', 'Estado de UI local (inputs, toggles, hover)', 'Prácticamente ninguno: es reorganizar'],
    ['No hacer nada', '—', 'Componentes baratos o que casi no cambian', 'Ninguno'],
  ]
)}
<p>La regla que aplico: memoiza cuando el componente es caro de renderizar, recibe las mismas props con frecuencia, o cuando una referencia inestable rompe la memoización de un hijo. Fuera de esos casos, déjalo simple. Si tu proyecto usa el React Compiler, buena parte de esta memoización se hace de forma automática en tiempo de compilación; aun así, entender por qué se re-renderiza un componente sigue siendo necesario para diagnosticar lo que el compilador no puede resolver, como un estado mal ubicado.</p>`,
    },
    {
      id: 'rp-estado',
      title: 'Ubicar bien el estado antes de memoizar',
      html: `<p>Muchas veces la mejor optimización no usa ningún hook. Si el texto de un buscador vive en el componente raíz de la página, cada tecla re-renderiza la página entera. Si vive en el componente del buscador, solo se re-renderiza el buscador. Bajar el estado al nivel más cercano a donde se usa reduce el árbol afectado sin añadir complejidad.</p>
<p>El patrón complementario es pasar componentes como <code>children</code>: un contenedor con estado que recibe su contenido como <code>children</code> puede re-renderizarse sin volver a ejecutar ese contenido, porque los elementos ya fueron creados por el padre. Con el contexto, la idea es la misma: separa contextos por frecuencia de cambio (el usuario autenticado no debería compartir contexto con el estado de un formulario) y memoiza el objeto que entregas en <code>value</code>.</p>`,
    },
    {
      id: 'rp-pesado',
      title: 'Listas grandes y trabajo pesado en el hilo principal',
      html: `<p>Renderizar miles de filas es lento aunque cada fila sea simple. La <strong>virtualización</strong> (con librerías como TanStack Virtual o react-window) renderiza solo las filas visibles y unas pocas de margen, de modo que el costo deja de depender del tamaño de la lista. Para cálculos pesados que no son de interfaz, como parsear un archivo grande, un Web Worker los saca del hilo principal.</p>
<p>Cuando el problema es que una actualización costosa bloquea la escritura, React ofrece APIs concurrentes. <code>useDeferredValue</code> permite que el input se actualice de inmediato mientras el resultado costoso se recalcula con menor prioridad, y <code>useTransition</code> hace lo mismo con actualizaciones de estado que tú disparas. Para que funcione, el componente que muestra el resultado debe estar memoizado; si no, se re-renderiza igual con cada tecla.</p>
${articleCode(`
import { memo, useDeferredValue, useMemo, useState } from "react";

const ResultList = memo(function ResultList({ results }: { results: Product[] }) {
  return <ul>{results.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
});

function Search({ items }: { items: Product[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // va un paso atrás del input

  const results = useMemo(
    () => items.filter((p) => p.name.toLowerCase().includes(deferredQuery.toLowerCase())),
    [items, deferredQuery]
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ResultList results={results} />
    </>
  );
}`)}`,
    },
    {
      id: 'rp-bundle',
      title: 'Bundle inicial y code splitting',
      html: `<p>El mayor costo de "lentitud" que percibe un usuario nuevo suele ser el tiempo de descarga, parseo y ejecución del JavaScript inicial. Dividir el bundle con <code>React.lazy</code> y <code>Suspense</code>, cargar rutas bajo demanda y diferir librerías pesadas (editores, gráficos, mapas) hasta que se usen reduce el trabajo antes de que la página sea interactiva. Herramientas como <code>rollup-plugin-visualizer</code> en Vite o webpack-bundle-analyzer te muestran qué dependencias están inflando el paquete.</p>
${articleCode(`
import { lazy, Suspense } from "react";

// El código de reportes solo se descarga cuando alguien entra a esa ruta
const ReportsPage = lazy(() => import("./pages/ReportsPage"));

export function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reportes" element={<ReportsPage />} />
      </Routes>
    </Suspense>
  );
}`)}
<p>Revisa también las importaciones: importar una librería completa para usar una función, o una librería de fechas o de iconos sin tree shaking, puede sumar más peso que todo tu código. Las imágenes cuentan para LCP: dimensiones explícitas, formatos modernos y <code>loading="lazy"</code> para las que no están en la primera pantalla.</p>`,
    },
    {
      id: 'rp-errores',
      title: 'Errores comunes al optimizar React',
      html: `<ul>
  <li><strong>Envolver todo en <code>memo</code> por defecto.</strong> Añade comparaciones en cada render y ruido en el código, y casi nunca ayuda si las props siguen siendo referencias nuevas.</li>
  <li><strong>Medir en modo desarrollo.</strong> El build de desarrollo de React hace comprobaciones extra y es más lento; las conclusiones de rendimiento se sacan con un build de producción (o de profiling).</li>
  <li><strong>Usar el índice como <code>key</code> en listas que cambian.</strong> Si los elementos se reordenan o se insertan, React reutiliza el componente equivocado: hay renders de más y bugs de estado.</li>
  <li><strong>Un contexto global con todo dentro.</strong> Cada cambio en cualquier parte del valor re-renderiza a todos los consumidores, aunque no usen lo que cambió.</li>
  <li><strong>Copiar props en estado y sincronizarlas con efectos.</strong> Genera renders dobles y estados desincronizados; los valores derivados se calculan durante el render.</li>
</ul>`,
    },
    {
      id: 'rp-cuandono',
      title: 'Cuándo NO vale la pena optimizar',
      html: '<p>Si el Profiler no muestra renders costosos y las métricas de usuario están dentro de los umbrales recomendados, optimizar es invertir en complejidad sin retorno. Un formulario de cinco campos o un panel interno usado por pocas personas rara vez justifica memoización fina. Tampoco conviene optimizar antes de que la funcionalidad esté estable: el código cambia, la memoización queda obsoleta y las dependencias mal mantenidas se vuelven bugs. La regla práctica es escribir código claro, ubicar bien el estado desde el principio y optimizar solo lo que una medición señale como lento, empezando siempre por el cambio más simple.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Debo envolver todos mis componentes en React.memo?',
      a: 'No. memo tiene un costo de comparación de props en cada render. En componentes baratos ese costo no se recupera. Úsalo en componentes costosos o que reciben las mismas props repetidamente.',
    },
    {
      q: '¿useMemo mejora siempre el rendimiento?',
      a: 'No. useMemo guarda un valor en caché y compara dependencias en cada render. Para cálculos triviales el overhead es mayor que el ahorro. Resérvalo para cálculos genuinamente costosos o referencias que deben mantenerse estables.',
    },
    {
      q: '¿Cómo sé si mi bundle es demasiado grande?',
      a: 'Usa un analizador de bundle (en Vite, rollup-plugin-visualizer) y revisa el impacto en LCP e INP con un perfil de red y CPU lentos. Si el JavaScript inicial supera varios cientos de KB comprimidos, el code splitting suele dar la mayor mejora en tiempo de carga.',
    },
    {
      q: '¿El React Compiler hace innecesario todo esto?',
      a: 'Automatiza gran parte de la memoización manual, pero no reubica estado, no virtualiza listas ni reduce el bundle. Entender por qué se renderiza un componente sigue siendo necesario para diagnosticar problemas reales.',
    },
    {
      q: '¿Next.js o los Server Components resuelven el rendimiento por sí solos?',
      a: 'Ayudan a enviar menos JavaScript al cliente porque parte del trabajo ocurre en el servidor. Pero los componentes interactivos siguen ejecutándose en el navegador y pueden tener los mismos problemas de renders y estado mal ubicado.',
    },
  ],
  refs: [
    { label: 'React Docs — Render and Commit', url: 'https://react.dev/learn/render-and-commit' },
    { label: 'React Docs — memo', url: 'https://react.dev/reference/react/memo' },
    { label: 'React Docs — useMemo', url: 'https://react.dev/reference/react/useMemo' },
    { label: 'React Docs — useDeferredValue', url: 'https://react.dev/reference/react/useDeferredValue' },
    { label: 'React Docs — lazy', url: 'https://react.dev/reference/react/lazy' },
    { label: 'web.dev — Web Vitals', url: 'https://web.dev/articles/vitals' },
    { label: 'web.dev — Interaction to Next Paint (INP)', url: 'https://web.dev/articles/inp' },
  ],
  closing: '¿Dudas sobre el rendimiento de tu frontend? Escríbeme.',
});

const RAG_LLM_CONTENT = buildArticle({
  prefix: 'rag',
  intro:
    'Conectar un LLM a tus propios datos sin reentrenarlo es, hoy, el patrón más práctico para construir asistentes útiles. Se llama RAG (Retrieval-Augmented Generation) y combina una búsqueda sobre tu información con la capacidad de redacción del modelo. La pregunta útil no es "¿qué modelo uso?", sino "¿el sistema encuentra el fragmento correcto cuando el usuario pregunta?". Aquí explico cómo funciona de verdad el pipeline, cómo mejorar la recuperación, cómo evaluarlo y los errores que arruinan la calidad de las respuestas.',
  takeaways: [
    'RAG recupera fragmentos relevantes de tus datos y los inyecta en el prompt, en lugar de reentrenar el modelo: actualizar el conocimiento es actualizar el índice.',
    'La calidad del RAG depende más del chunking, los embeddings y la recuperación que del propio modelo de lenguaje.',
    'Sin citar las fuentes recuperadas, pierdes trazabilidad y abres la puerta a alucinaciones difíciles de detectar.',
    'Un conjunto de evaluación (preguntas reales y respuestas esperadas) es lo que separa un demo de un producto confiable.',
  ],
  sections: [
    {
      id: 'rag-que',
      title: 'Qué es RAG y por qué no reentrenar',
      html: `<p>Reentrenar o hacer fine-tuning de un modelo para que "aprenda" tus documentos es caro, lento y se queda obsoleto en cuanto cambian los datos. Además, el fine-tuning es una mala herramienta para inyectar hechos: el modelo aprende patrones y estilo, pero no garantiza recordar un dato concreto ni decirte de dónde lo sacó.</p>
<p>RAG resuelve el problema de otra forma: en el momento de la pregunta, busca los fragmentos más relevantes de tu base de conocimiento y los pasa al modelo como contexto. El modelo no memoriza nada; redacta la respuesta usando lo que le entregaste. Actualizar el conocimiento es tan simple como actualizar los documentos indexados, y cada respuesta puede citar exactamente qué fragmentos usó. Por eso es el punto de partida razonable para asistentes sobre documentación interna, manuales, políticas o bases de soporte.</p>`,
    },
    {
      id: 'rag-pipeline',
      title: 'El pipeline: indexación y consulta',
      html: `<p>Un sistema RAG tiene dos fases. La <strong>indexación</strong> ocurre por adelantado (y cada vez que cambian los documentos): se dividen en fragmentos, se calcula un embedding de cada uno y se guardan en una base vectorial. La <strong>consulta</strong> ocurre con cada pregunta: se busca lo más parecido y se construye el prompt.</p>
${flowDiagram(
  ['Documentos\nfuente', 'Chunking\n+ metadatos', 'Embeddings en\nbase vectorial', 'Búsqueda por\nsimilitud', 'LLM responde\ncon citas'],
  'Indexar una vez, recuperar en cada pregunta'
)}`,
      subsections: [
        {
          id: 'rag-chunking',
          title: 'Chunking: cortar sin romper ideas',
          html: '<p>Dividir los documentos en fragmentos coherentes es la decisión que más afecta la calidad. Fragmentos muy grandes diluyen la relevancia y gastan contexto; fragmentos muy pequeños pierden el sentido. La regla que aplico: respetar la estructura del documento (títulos, secciones, párrafos) antes que cortar por número fijo de caracteres, usar un pequeño solapamiento entre fragmentos y guardar con cada uno sus metadatos: documento de origen, sección, fecha y permisos. Esos metadatos sirven para filtrar, para citar y para que el fragmento tenga contexto cuando se lee solo.</p>',
        },
        {
          id: 'rag-embeddings',
          title: 'Embeddings: el significado como vector',
          html: '<p>Un modelo de embeddings convierte cada fragmento en un vector numérico de forma que textos con significado parecido quedan cerca. Dos detalles importan: el modelo debe funcionar bien en el idioma de tus datos (muchos están optimizados para inglés; revisa benchmarks multilingües como MTEB), y la pregunta debe convertirse con el <strong>mismo</strong> modelo que se usó al indexar. Cambiar de modelo de embeddings obliga a reindexar todo.</p>',
        },
        {
          id: 'rag-recuperacion',
          title: 'Recuperación: los k fragmentos más cercanos',
          html: '<p>En la consulta, la pregunta se convierte en vector y se buscan los fragmentos más cercanos (normalmente por similitud coseno). Elegir cuántos traer es un equilibrio: pocos fragmentos pueden dejar fuera la respuesta; demasiados meten ruido y encarecen cada llamada. Los filtros por metadatos (por ejemplo, solo documentos que el usuario puede ver, o solo la versión vigente de una política) se aplican aquí, no después.</p>',
        },
      ],
    },
    {
      id: 'rag-implementacion',
      title: 'Una implementación mínima con PostgreSQL y pgvector',
      html: `<p>Para empezar no hace falta una base de datos nueva: la extensión pgvector añade a PostgreSQL un tipo <code>vector</code>, operadores de distancia e índices aproximados (HNSW e IVFFlat). Así los fragmentos viven junto a los datos de tu aplicación, con sus permisos y transacciones.</p>
${articleCode(`
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id        bigserial PRIMARY KEY,
  doc_id    text NOT NULL,
  section   text,
  content   text NOT NULL,
  embedding vector(1024)  -- la dimensión depende del modelo de embeddings
);

-- Índice aproximado para búsqueda por distancia coseno
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);`)}
<p>La consulta recupera los fragmentos más cercanos y arma un prompt que obliga al modelo a responder solo con ese contexto y a citar la fuente. <code>embed</code> y <code>generate</code> representan el cliente del proveedor de modelos que uses.</p>
${articleCode(`
import numpy as np
from pgvector.psycopg import register_vector

def answer(conn, question: str, embed, generate, k: int = 5) -> str:
    register_vector(conn)
    q_vec = np.array(embed(question))  # mismo modelo que en la indexación

    rows = conn.execute(
        "SELECT doc_id, section, content FROM chunks "
        "ORDER BY embedding <=> %s LIMIT %s",
        (q_vec, k),
    ).fetchall()

    context = "\\n\\n".join(f"[{doc} · {sec}] {text}" for doc, sec, text in rows)
    prompt = (
        "Responde solo con la información del contexto. "
        "Cita la fuente entre corchetes después de cada afirmación. "
        "Si el contexto no contiene la respuesta, di que no lo sabes.\\n\\n"
        f"Contexto:\\n{context}\\n\\nPregunta: {question}"
    )
    return generate(prompt)`)}`,
    },
    {
      id: 'rag-mejorar',
      title: 'Mejorar la recuperación: búsqueda híbrida y reranking',
      html: `<p>La búsqueda puramente vectorial es buena con paráfrasis y sinónimos, pero floja con términos exactos: códigos de producto, nombres propios, números de artículo de una norma. La <strong>búsqueda híbrida</strong> combina la vectorial con una búsqueda léxica (BM25 o el full-text search de PostgreSQL) y fusiona ambos rankings, por ejemplo con Reciprocal Rank Fusion. Es de las mejoras con mejor relación costo-beneficio.</p>
<p>El segundo escalón es el <strong>reranking</strong>: recuperar, digamos, 30 candidatos con la búsqueda rápida y reordenarlos con un modelo más preciso (un cross-encoder) que lee pregunta y fragmento juntos, quedándote con los mejores 5. También ayuda enriquecer cada fragmento antes de indexarlo con una frase que lo sitúe en su documento, para que un párrafo suelto como "el plazo es de 30 días" no pierda a qué trámite se refiere. Por último, el orden importa: los modelos tienden a aprovechar peor la información enterrada en la mitad de un contexto largo, así que conviene enviar pocos fragmentos y bien ordenados.</p>`,
    },
    {
      id: 'rag-comparativa',
      title: 'RAG, fine-tuning o contexto largo: comparativa',
      html: `<p>RAG no es la única forma de darle conocimiento a un modelo. Con ventanas de contexto cada vez más grandes, a veces basta con pegar los documentos completos. Esta tabla resume cuándo conviene cada enfoque.</p>
${articleTable(
  ['Criterio', 'RAG', 'Fine-tuning', 'Contexto largo'],
  [
    ['Conocimiento que cambia', 'Se actualiza reindexando', 'Requiere reentrenar', 'Se actualiza en cada llamada'],
    ['Trazabilidad y citas', 'Natural: se sabe qué fragmento se usó', 'Difícil: el dato queda en los pesos', 'Posible, pero menos precisa'],
    ['Volumen de datos', 'Escala a millones de documentos', 'Limitado por el set de entrenamiento', 'Limitado por la ventana de contexto'],
    ['Costo por consulta', 'Bajo: solo los fragmentos relevantes', 'Bajo una vez entrenado', 'Alto: todo el contexto en cada llamada'],
    ['Para qué sirve mejor', 'Responder sobre datos propios', 'Ajustar estilo, formato o tarea', 'Pocos documentos, análisis puntual'],
    ['Control de permisos', 'Filtros por usuario al recuperar', 'No aplica', 'Manual, documento por documento'],
  ]
)}`,
    },
    {
      id: 'rag-eval',
      title: 'Cómo evaluar un sistema RAG',
      html: `<p>Un demo que responde bien a tres preguntas no es un producto. Construye un conjunto de evaluación con preguntas reales (de usuarios, de tickets de soporte, de expertos del dominio) y, para cada una, el documento o fragmento que contiene la respuesta y la respuesta esperada. Con eso se miden dos cosas por separado:</p>
<ul>
  <li><strong>Recuperación:</strong> ¿el fragmento correcto aparece entre los k recuperados? (recall@k, MRR). Si no aparece, ningún modelo podrá responder bien.</li>
  <li><strong>Generación:</strong> ¿la respuesta es fiel a los fragmentos (faithfulness) y responde lo que se preguntó? Esto se revisa con evaluación humana sobre una muestra y, a escala, con un LLM como evaluador calibrado contra esa revisión humana.</li>
</ul>
<p>Separar ambas métricas te dice dónde está el problema: si la recuperación falla, cambia el chunking, los embeddings o añade búsqueda híbrida; si falla la generación, ajusta el prompt o el modelo. Ejecuta la evaluación en cada cambio del pipeline, como harías con las pruebas de regresión de cualquier software. Sin esta métrica, cualquier cambio que hagas es una apuesta a ciegas.</p>`,
    },
    {
      id: 'rag-errores',
      title: 'Errores que arruinan la calidad',
      html: `<ul>
  <li><strong>Chunks mal cortados.</strong> Partir una tabla o una lista de requisitos a la mitad hace que ningún fragmento contenga la respuesta completa.</li>
  <li><strong>Embeddings inadecuados para el idioma o el dominio.</strong> Un modelo débil en español o en vocabulario técnico recupera fragmentos que "suenan" parecidos pero no responden.</li>
  <li><strong>Recuperar demasiado.</strong> Llenar el contexto de fragmentos irrelevantes confunde al modelo y encarece cada consulta.</li>
  <li><strong>No restringir al contexto.</strong> Sin instrucciones claras de responder solo con lo recuperado y admitir cuando no lo sabe, el modelo completa los huecos con conocimiento general o inventado.</li>
  <li><strong>Ignorar permisos.</strong> Indexar todo junto y filtrar después expone información a usuarios que no deberían verla; el filtro va en la recuperación.</li>
</ul>`,
    },
    {
      id: 'rag-cuandono',
      title: 'Cuándo NO usar RAG',
      html: '<p>Si tu base de conocimiento cabe cómodamente en el contexto del modelo y cambia poco, pegar los documentos completos puede ser más simple y más preciso que montar un pipeline de recuperación. Si el problema es que el modelo no sigue un formato o un tono, eso es un tema de prompt o de fine-tuning, no de recuperación. Y si las preguntas son en realidad consultas estructuradas ("¿cuántas ventas hubo en marzo?"), la respuesta correcta está en una consulta SQL sobre tus datos, no en buscar párrafos parecidos. RAG brilla cuando hay mucho texto no estructurado, que cambia y del que necesitas citar la fuente; fuera de ese caso, conviene empezar por la solución más simple.</p>',
    },
  ],
  faqs: [
    {
      q: '¿RAG o fine-tuning?',
      a: 'RAG para conocimiento que cambia y necesita trazabilidad. Fine-tuning para ajustar estilo, formato o comportamiento. A menudo se combinan: fine-tuning para el tono, RAG para los datos.',
    },
    {
      q: '¿Qué base de datos vectorial elijo?',
      a: 'Para empezar, pgvector sobre PostgreSQL es suficiente y evita añadir infraestructura. Para escala alta, opciones dedicadas como Pinecone, Qdrant o Weaviate ofrecen más rendimiento y funciones de filtrado.',
    },
    {
      q: '¿Cómo evito que el modelo invente respuestas?',
      a: 'Instruye explícitamente al modelo para responder solo con el contexto recuperado y decir "no lo sé" si no está. Y cita siempre las fuentes para que el usuario pueda verificar.',
    },
    {
      q: '¿De qué tamaño deben ser los fragmentos?',
      a: 'No hay un número universal. Empieza respetando la estructura del documento (secciones y párrafos), con un tamaño moderado y algo de solapamiento, y ajústalo midiendo recall@k sobre tu conjunto de evaluación.',
    },
    {
      q: '¿Cómo manejo documentos que se actualizan?',
      a: 'Guarda un identificador y un hash de cada documento. Al cambiar, borra sus fragmentos y vuelve a indexarlo; así el índice nunca mezcla versiones viejas y nuevas del mismo contenido.',
    },
  ],
  refs: [
    { label: 'Paper original de RAG', note: 'Lewis et al., 2020', url: 'https://arxiv.org/abs/2005.11401' },
    { label: 'Lost in the Middle', note: 'Liu et al., cómo usan los modelos los contextos largos', url: 'https://arxiv.org/abs/2307.03172' },
    { label: 'pgvector', url: 'https://github.com/pgvector/pgvector' },
    { label: 'Contextual Retrieval', note: 'Anthropic', url: 'https://www.anthropic.com/news/contextual-retrieval' },
    { label: 'Sentence Transformers', note: 'embeddings y cross-encoders para reranking', url: 'https://www.sbert.net' },
    { label: 'Ragas', note: 'métricas de evaluación para RAG', url: 'https://docs.ragas.io' },
  ],
  closing: '¿Quieres construir un asistente con tus datos? Hablemos.',
});

const POSTGRES_INDEX_CONTENT = buildArticle({
  prefix: 'pg',
  intro:
    'Una consulta que tarda 2 segundos no siempre necesita una base de datos más grande; casi siempre necesita el índice correcto. Entender cómo PostgreSQL decide ejecutar una consulta, y cómo leer su plan de ejecución, es la diferencia entre adivinar y resolver. La pregunta útil no es "¿qué columna indexo?", sino "¿qué está haciendo el planner con esta consulta y por qué?". Este artículo va directo a lo que importa: leer el plan, elegir el tipo de índice, ordenar bien las columnas y no pagar de más por índices que nadie usa.',
  takeaways: [
    '<code>EXPLAIN ANALYZE</code> es la herramienta número uno: muestra el plan real y dónde se va el tiempo.',
    'Un Seq Scan sobre una tabla grande filtrada por una columna selectiva casi siempre indica que falta un índice útil para ese filtro.',
    'El orden de las columnas en un índice compuesto determina qué consultas puede acelerar: igualdades primero, rangos y ordenamientos después.',
    'Los índices aceleran lecturas pero ralentizan escrituras y ocupan espacio: no se indexa todo, y los que no se usan se eliminan.',
  ],
  sections: [
    {
      id: 'pg-explain',
      title: 'Leer el plan con EXPLAIN ANALYZE',
      html: `<p>Antes de añadir un índice, ejecuta <code>EXPLAIN ANALYZE</code> sobre la consulta lenta. <code>EXPLAIN</code> solo muestra el plan estimado; con <code>ANALYZE</code> la consulta se ejecuta de verdad y cada nodo reporta tiempos y filas reales. Ojo: si la consulta es un <code>UPDATE</code> o <code>DELETE</code>, envuélvela en una transacción con <code>ROLLBACK</code>, porque se ejecuta.</p>
${articleCode(`
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total, created_at
FROM orders
WHERE customer_id = 4821 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 20;

-- Plan abreviado sin un índice adecuado:
-- Limit  (actual rows=20)
--   ->  Sort  (Sort Key: created_at DESC)
--         ->  Seq Scan on orders
--               Filter: ((customer_id = 4821) AND (status = 'paid'::text))
--               Rows Removed by Filter: (casi toda la tabla)`)}`,
      subsections: [
        {
          id: 'pg-nodos',
          title: 'Los nodos y dónde se va el tiempo',
          html: '<p>El plan es un árbol: se lee de adentro hacia afuera, y cada nodo muestra un costo estimado (en unidades arbitrarias del planner) y, con <code>ANALYZE</code>, el tiempo real. Busca el nodo donde el tiempo salta. Un <code>Sort</code> costoso sobre muchas filas, un <code>Seq Scan</code> con un <code>Rows Removed by Filter</code> enorme o un <code>Nested Loop</code> con muchas iteraciones (<code>loops</code>) son los sospechosos habituales.</p>',
        },
        {
          id: 'pg-estimaciones',
          title: 'Filas estimadas frente a filas reales',
          html: '<p>Cada nodo muestra <code>rows</code> estimadas y, entre paréntesis, las reales. Cuando difieren en órdenes de magnitud, el planner está decidiendo con información equivocada: puede elegir un Nested Loop pensando que vienen 10 filas cuando llegan 100.000. La causa suele ser estadísticas desactualizadas (ejecuta <code>ANALYZE</code> sobre la tabla) o columnas correlacionadas que el planner trata como independientes, que se corrige con <code>CREATE STATISTICS</code>.</p>',
        },
        {
          id: 'pg-buffers',
          title: 'BUFFERS: cuánta lectura cuesta',
          html: '<p>La opción <code>BUFFERS</code> añade cuántas páginas se leyeron de la caché compartida (<code>shared hit</code>) y cuántas tuvieron que venir de disco o del sistema operativo (<code>read</code>). Es una medida más estable que el tiempo, que varía según lo caliente que esté la caché, y deja ver claramente cuando una consulta recorre miles de páginas para devolver veinte filas.</p>',
        },
      ],
    },
    {
      id: 'pg-scans',
      title: 'Seq Scan, Index Scan y sus variantes',
      html: `<p>Un <strong>Seq Scan</strong> lee toda la tabla fila por fila. Para tablas pequeñas, o cuando la consulta devuelve una fracción grande de la tabla, es lo correcto y lo más rápido: leer secuencialmente es barato. Para tablas grandes filtradas por una columna selectiva, es la señal de que falta un índice. El planner elige según sus estadísticas, así que mantener <code>ANALYZE</code> al día (autovacuum lo hace por defecto) es parte del trabajo.</p>
${articleTable(
  ['Nodo', 'Qué hace', 'Cuándo lo elige el planner', 'Señal de alerta'],
  [
    ['Seq Scan', 'Lee toda la tabla', 'Tablas pequeñas o filtros poco selectivos', 'Tabla grande y muchas filas descartadas'],
    ['Index Scan', 'Recorre el índice y va a la tabla por cada fila', 'Pocas filas o lectura en el orden del índice', 'Muchas filas: demasiados accesos aleatorios'],
    ['Index Only Scan', 'Responde solo con el índice', 'El índice cubre todas las columnas pedidas', '<code>Heap Fetches</code> altos: falta VACUUM'],
    ['Bitmap Heap Scan', 'Marca páginas con el índice y luego las lee en orden', 'Volumen intermedio o varios índices combinados', 'Recheck con muchas filas descartadas'],
  ]
)}`,
    },
    {
      id: 'pg-compuestos',
      title: 'Índices compuestos y orden de columnas',
      html: `<p>Un índice B-tree sobre <code>(a, b)</code> está ordenado primero por <code>a</code> y, dentro de cada valor de <code>a</code>, por <code>b</code>. Por eso acelera filtros por <code>a</code> y por <code>a, b</code>, pero en general no por <code>b</code> solo. La regla que aplico: primero las columnas comparadas por igualdad, después la columna de rango o de ordenamiento. Si además la consulta ordena por esa última columna, el índice entrega las filas ya ordenadas y el <code>Sort</code> desaparece.</p>
${articleCode(`
-- Igualdades primero (customer_id, status), orden después (created_at)
CREATE INDEX CONCURRENTLY idx_orders_customer_status_created
  ON orders (customer_id, status, created_at DESC);

-- Plan abreviado con el índice:
-- Limit  (actual rows=20)
--   ->  Index Scan using idx_orders_customer_status_created on orders
--         Index Cond: ((customer_id = 4821) AND (status = 'paid'::text))

-- Si la consulta solo pide columnas del índice (o añadidas con INCLUDE),
-- PostgreSQL puede usar un Index Only Scan sin tocar la tabla:
CREATE INDEX CONCURRENTLY idx_orders_customer_created_total
  ON orders (customer_id, created_at DESC) INCLUDE (total);`)}
<p><code>CONCURRENTLY</code> construye el índice sin bloquear las escrituras de la tabla, a cambio de tardar más; en producción es casi siempre lo que quieres. Si falla a mitad de camino deja un índice marcado como inválido que hay que eliminar y volver a crear.</p>`,
    },
    {
      id: 'pg-tipos',
      title: 'Más allá del B-tree: índices parciales, de expresión y otros tipos',
      html: `<p>B-tree es el tipo predeterminado y cubre la mayoría de los casos: igualdad, rangos y ordenamiento. Pero PostgreSQL ofrece herramientas más finas que conviene conocer:</p>
<ul>
  <li><strong>Índices parciales.</strong> <code>CREATE INDEX ... WHERE status = 'pending'</code> indexa solo las filas que importan. Si consultas a menudo un subconjunto pequeño, el índice es mucho más chico y barato de mantener.</li>
  <li><strong>Índices de expresión.</strong> Si filtras por <code>lower(email)</code>, un índice sobre <code>email</code> no sirve; uno sobre <code>(lower(email))</code> sí.</li>
  <li><strong>GIN.</strong> Para valores que contienen varios elementos: arrays, documentos <code>jsonb</code> consultados con <code>@&gt;</code> y búsqueda de texto completo.</li>
  <li><strong>GiST y SP-GiST.</strong> Para datos geométricos, rangos y búsquedas por proximidad (PostGIS se apoya en GiST).</li>
  <li><strong>BRIN.</strong> Para tablas enormes donde el orden físico sigue a una columna, como logs o eventos insertados por fecha: ocupa una fracción mínima del espacio de un B-tree.</li>
</ul>`,
    },
    {
      id: 'pg-flujo',
      title: 'Un flujo para diagnosticar consultas lentas',
      html: `<p>Optimizar consulta por consulta según quién se queje no escala. El proceso que sigo empieza por los datos agregados: la extensión <code>pg_stat_statements</code> registra cuántas veces se ejecuta cada consulta normalizada y cuánto tiempo total consume. Una consulta de 50 ms que se ejecuta un millón de veces al día pesa más que un reporte de 10 segundos que corre una vez.</p>
${flowDiagram(
  ['Detectar\nconsultas caras', 'EXPLAIN\n(ANALYZE)', 'Hipótesis:\níndice o SQL', 'CREATE INDEX\nCONCURRENTLY', 'Medir y\ncomparar'],
  'Del síntoma a la causa, siempre con medición'
)}
<p>No toda consulta lenta se arregla con un índice. A veces el plan muestra que el problema es un <code>SELECT *</code> que trae columnas pesadas, una paginación con <code>OFFSET</code> enorme (mejor paginar por cursor, con <code>WHERE created_at &lt; ...</code>), o una función aplicada a la columna en el <code>WHERE</code> que impide usar el índice existente.</p>`,
    },
    {
      id: 'pg-costo',
      title: 'El costo oculto de indexar de más',
      html: `<p>Cada índice debe mantenerse en cada INSERT, UPDATE y DELETE, ocupa espacio en disco y compite por memoria de caché con los datos. Además, actualizar una columna indexada impide las actualizaciones HOT (heap-only tuples), que son una de las optimizaciones de escritura de PostgreSQL. Indexar columnas que nunca se filtran, o duplicar índices que se solapan (<code>(a)</code> y <code>(a, b)</code> suelen ser redundantes), ralentiza las escrituras sin beneficio.</p>
${articleCode(`
-- Índices que no se han usado desde el último reinicio de estadísticas
SELECT schemaname, relname AS tabla, indexrelname AS indice,
       pg_size_pretty(pg_relation_size(indexrelid)) AS tamano
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;`)}
<p>Antes de borrar, verifica que el índice no respalde una restricción <code>UNIQUE</code> o una clave primaria, y que las estadísticas cubran un periodo representativo (incluido el cierre de mes, si hay reportes que solo corren entonces). Si tienes réplicas de lectura, revisa también ahí: las estadísticas de uso son por servidor.</p>`,
    },
    {
      id: 'pg-errores',
      title: 'Errores comunes con índices en PostgreSQL',
      html: `<ul>
  <li><strong>Crear índices en producción sin <code>CONCURRENTLY</code>.</strong> Un <code>CREATE INDEX</code> normal bloquea las escrituras de la tabla mientras se construye.</li>
  <li><strong>Indexar cada columna por separado.</strong> Varios índices de una columna rara vez igualan a un índice compuesto bien ordenado para la consulta real.</li>
  <li><strong>Romper el índice con funciones o casts.</strong> <code>WHERE date(created_at) = ...</code> o comparar un texto con un número impiden usar un índice sobre la columna original.</li>
  <li><strong>Olvidar las claves foráneas.</strong> PostgreSQL no indexa automáticamente las columnas de una FK; los joins y los <code>DELETE</code> en la tabla padre pueden volverse lentos.</li>
  <li><strong>Probar con datos de juguete.</strong> Con mil filas el planner elegirá Seq Scan y tendrá razón; el plan solo es representativo con un volumen y una distribución parecidos a producción.</li>
</ul>`,
    },
    {
      id: 'pg-cuandono',
      title: 'Cuándo NO resolverlo con un índice',
      html: '<p>Si la tabla es pequeña, si la consulta devuelve una gran parte de las filas o si la columna tiene muy pocos valores distintos (un booleano repartido casi a la mitad), un índice no ayudará: el planner seguirá prefiriendo el Seq Scan, y con razón. En tablas con escrituras intensas y lecturas esporádicas, el costo de mantener el índice puede superar su beneficio. Y cuando el problema es de diseño (un reporte analítico que agrega millones de filas en cada carga), la solución está en otro nivel: una vista materializada, una tabla de resumen actualizada periódicamente o un almacén analítico separado. El índice es la primera herramienta, no la única.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Por qué mi índice no se usa?',
      a: 'Causas típicas: la columna está dentro de una función en el WHERE, hay un cast implícito de tipos, la tabla es tan pequeña que el Seq Scan es más barato, o las estadísticas están desactualizadas. Ejecuta ANALYZE y revisa el WHERE.',
    },
    {
      q: '¿Qué tipo de índice uso?',
      a: 'B-tree es el predeterminado y cubre la mayoría de los casos (igualdad y rangos). GIN para búsquedas en arrays y JSONB, GiST para datos geométricos y búsquedas por proximidad, BRIN para tablas enormes ordenadas físicamente por fecha.',
    },
    {
      q: '¿Indexar siempre mejora el rendimiento?',
      a: 'No. Mejora las lecturas filtradas pero penaliza las escrituras y consume recursos. En tablas con muchas escrituras y pocas lecturas, un exceso de índices perjudica.',
    },
    {
      q: '¿Cada cuánto debo reconstruir los índices?',
      a: 'En general no hace falta de forma rutinaria: autovacuum mantiene las tablas. Si un índice creció mucho por actualizaciones y borrados masivos, REINDEX CONCURRENTLY lo reconstruye sin bloquear escrituras.',
    },
    {
      q: '¿Sirve el mismo índice para ORDER BY ... DESC?',
      a: 'Un B-tree se puede recorrer en ambos sentidos, así que un índice ascendente sirve para un orden descendente simple. Declarar DESC importa en índices compuestos con direcciones mezcladas, como (a ASC, b DESC).',
    },
  ],
  refs: [
    { label: 'PostgreSQL Docs — Using EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
    { label: 'PostgreSQL Docs — Index Types', url: 'https://www.postgresql.org/docs/current/indexes-types.html' },
    { label: 'PostgreSQL Docs — Multicolumn Indexes', url: 'https://www.postgresql.org/docs/current/indexes-multicolumn.html' },
    { label: 'PostgreSQL Docs — Partial Indexes', url: 'https://www.postgresql.org/docs/current/indexes-partial.html' },
    { label: 'PostgreSQL Docs — pg_stat_statements', url: 'https://www.postgresql.org/docs/current/pgstatstatements.html' },
    { label: 'Use The Index, Luke', note: 'Markus Winand', url: 'https://use-the-index-luke.com' },
  ],
  closing: '¿Consultas lentas en producción? Puedo ayudarte a auditarlas.',
});

const WEB_SECURITY_CONTENT = buildArticle({
  prefix: 'sec',
  intro:
    'La mayoría de las brechas de seguridad en aplicaciones web no vienen de ataques sofisticados, sino de descuidos básicos: validación que falta, permisos que no se comprueban, secretos expuestos y confianza ciega en datos del cliente. La pregunta útil no es "¿somos seguros?", sino "¿qué pasa si alguien llama a esta API saltándose nuestro frontend?". Este artículo repasa los fundamentos que todo desarrollador fullstack debería aplicar por defecto, con código concreto y sin necesidad de ser experto en seguridad.',
  takeaways: [
    'Nunca confíes en datos del cliente: valida y sanitiza en el servidor, siempre.',
    'Autenticar no es autorizar: cada petición debe comprobar que el usuario puede acceder a ese recurso concreto, no solo que inició sesión.',
    'Las consultas parametrizadas eliminan la inyección SQL; concatenar strings la invita. Los secretos van en variables de entorno, nunca en el repositorio.',
    'HTTPS, cabeceras de seguridad y cookies con flags adecuados son protección de base, no opcional.',
  ],
  sections: [
    {
      id: 'sec-basicos',
      title: 'Por qué las brechas suelen ser básicas',
      html: `<p>Las categorías que encabezan el OWASP Top 10 no son exóticas: control de acceso roto, fallos criptográficos, inyección, configuración insegura y componentes vulnerables. Todas tienen en común que se previenen con prácticas conocidas, aplicadas de forma consistente. El problema rara vez es no saber qué hacer; es no hacerlo en cada endpoint, en cada formulario y en cada despliegue.</p>
<p>Por eso la estrategia que funciona es la <strong>defensa en profundidad</strong>: varias capas independientes, de modo que si una falla, la siguiente contiene el daño. Ninguna capa es perfecta, pero un atacante tiene que atravesarlas todas.</p>
${flowDiagram(
  ['Petición\nentrante', 'Autenticación\n¿quién es?', 'Validación\n¿qué envía?', 'Autorización\n¿puede hacerlo?', 'Consulta\nparametrizada'],
  'Cada petición atraviesa varias capas de defensa'
)}`,
    },
    {
      id: 'sec-validar',
      title: 'Valida en el servidor, no solo en el cliente',
      html: `<p>La validación en el navegador mejora la experiencia de usuario, pero no es seguridad: cualquiera puede saltarse el frontend y llamar directo a tu API con curl o con las DevTools. Toda entrada que llega al servidor debe validarse ahí: tipos, longitudes, formatos y rangos permitidos. Trata cada dato externo como potencialmente malicioso hasta demostrar lo contrario.</p>
<p>La forma más robusta es una lista de lo permitido (un esquema) en lugar de una lista de lo prohibido. Un esquema rechaza todo lo que no encaja, incluidos campos extra que el cliente no debería poder enviar, como un <code>role: "admin"</code> colado en el cuerpo de un registro (asignación masiva).</p>
${articleCode(`
import express from "express";
import { z } from "zod";
import { pool } from "./db";
import { requireAuth } from "./auth";

const app = express();
app.use(express.json({ limit: "100kb" })); // también se limita el tamaño

const CreateOrder = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100),
  note: z.string().max(500).optional(),
}).strict(); // rechaza campos que no estén en el esquema

app.post("/api/orders", requireAuth, async (req, res) => {
  const parsed = CreateOrder.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Datos inválidos" });

  const { productId, quantity, note } = parsed.data;
  // El usuario sale de la sesión verificada, nunca del body
  const { rows } = await pool.query(
    "INSERT INTO orders (user_id, product_id, quantity, note) VALUES ($1, $2, $3, $4) RETURNING id",
    [req.user.id, productId, quantity, note ?? null]
  );
  res.status(201).json({ id: rows[0].id });
});`)}`,
    },
    {
      id: 'sec-inyeccion',
      title: 'Inyección SQL y consultas parametrizadas',
      html: `<p>La inyección SQL ocurre cuando construyes consultas concatenando entrada del usuario: el dato deja de ser un valor y pasa a formar parte del código SQL. La defensa es simple y total: usa consultas parametrizadas o un ORM que las use por debajo. Con parámetros, la consulta y los valores viajan por separado hasta la base de datos, y un valor nunca puede cambiar la estructura de la consulta.</p>
${articleCode(`
// ✗ Vulnerable: la entrada se convierte en parte del SQL
const sql = "SELECT * FROM users WHERE email = '" + email + "'";
// Con email = "' OR '1'='1" la consulta devuelve todos los usuarios

// ✓ Seguro: el valor viaja separado de la consulta
const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);`)}
<p>Los parámetros sirven para valores, no para identificadores: si necesitas ordenar por una columna que elige el usuario, compara su valor contra una lista cerrada de columnas permitidas. El mismo principio aplica a otras inyecciones: comandos del sistema operativo, consultas NoSQL y plantillas. Nunca construyas código ejecutable concatenando datos del usuario.</p>`,
    },
    {
      id: 'sec-acceso',
      title: 'Autenticación y control de acceso',
      html: '<p>El control de acceso roto es la categoría que encabeza el OWASP Top 10, y es fácil ver por qué: cada endpoint nuevo es una oportunidad de olvidar una comprobación. Estas son las tres áreas donde más se falla.</p>',
      subsections: [
        {
          id: 'sec-autorizar',
          title: 'Autorizar cada recurso, no solo cada ruta',
          html: `<p>Comprobar que el usuario inició sesión no basta. Si <code>GET /api/invoices/1043</code> devuelve la factura sin verificar que pertenece a quien la pide, cualquier usuario puede leer las de los demás cambiando el número (un IDOR, Insecure Direct Object Reference). La comprobación de propiedad debe ir en el servidor, idealmente en la propia consulta:</p>
${articleCode(`
-- ✗ Cualquier usuario autenticado puede leer cualquier factura
SELECT * FROM invoices WHERE id = $1;

-- ✓ Solo si la factura pertenece al usuario de la sesión
SELECT * FROM invoices WHERE id = $1 AND owner_id = $2;`)}`,
        },
        {
          id: 'sec-contrasenas',
          title: 'Contraseñas: hash lento y con sal',
          html: '<p>Las contraseñas nunca se guardan en texto plano ni con hashes rápidos como MD5 o SHA-256, que permiten probar miles de millones de combinaciones por segundo. Se usan algoritmos diseñados para ser lentos y con sal, como Argon2id, scrypt o bcrypt, a través de una librería mantenida. Añade límite de intentos de inicio de sesión y, para cuentas con privilegios, autenticación de dos factores.</p>',
        },
        {
          id: 'sec-sesiones',
          title: 'Sesiones y tokens',
          html: '<p>Regenera el identificador de sesión al iniciar sesión, define expiraciones razonables e invalida la sesión en el servidor al cerrar sesión. Si usas JWT, valida siempre la firma y el algoritmo esperado, mantén su vida corta y no guardes datos sensibles en el payload: está codificado en base64, no cifrado. Guardar tokens en <code>localStorage</code> los deja al alcance de cualquier script inyectado; una cookie <code>HttpOnly</code> no.</p>',
        },
      ],
    },
    {
      id: 'sec-secretos',
      title: 'Manejo de secretos y variables de entorno',
      html: `<p>Claves de API, contraseñas de base de datos y tokens jamás deben vivir en el código ni subirse al repositorio. Van en variables de entorno o en un gestor de secretos, fuera del control de versiones (con el <code>.env</code> en el <code>.gitignore</code>). Si un secreto se filtra alguna vez, revócalo de inmediato: una vez en el historial de git, se considera comprometido.</p>
<p>Dos detalles que se olvidan a menudo. Primero, en el frontend no existen secretos: todo lo que se incluye en el bundle (incluidas las variables <code>VITE_</code> o <code>NEXT_PUBLIC_</code>) lo puede leer cualquiera; las llamadas que requieren una clave privada pasan por tu backend. Segundo, usa credenciales distintas por entorno y con el mínimo privilegio necesario: el usuario de base de datos de la aplicación no necesita permisos para borrar tablas. Herramientas de escaneo de secretos en el repositorio y en CI atrapan los descuidos antes de que lleguen al remoto.</p>`,
    },
    {
      id: 'sec-headers',
      title: 'HTTPS, cabeceras y cookies seguras',
      html: `<p>HTTPS cifra el tráfico y hoy es obligatorio, no opcional. Encima de él, unas pocas cabeceras de respuesta reducen mucho la superficie de ataque, y las cookies de sesión deben llevar los flags correctos para mitigar robo de sesión y CSRF.</p>
${articleTable(
  ['Cabecera o flag', 'Qué mitiga', 'Valor de partida'],
  [
    ['<code>Strict-Transport-Security</code>', 'Degradación a HTTP y robo de cookies en redes inseguras', '<code>max-age=31536000; includeSubDomains</code>'],
    ['<code>Content-Security-Policy</code>', 'XSS: limita de dónde se cargan y ejecutan scripts', "<code>default-src 'self'</code>, ajustada a la app"],
    ['<code>X-Content-Type-Options</code>', 'Que el navegador interprete archivos con otro tipo', '<code>nosniff</code>'],
    ['<code>frame-ancestors</code> (en CSP)', 'Clickjacking: incrustar tu sitio en un iframe ajeno', "<code>frame-ancestors 'none'</code>"],
    ['Cookie <code>HttpOnly</code>', 'Lectura de la cookie desde JavaScript inyectado', 'Siempre en cookies de sesión'],
    ['Cookie <code>Secure</code> y <code>SameSite</code>', 'Envío por HTTP y peticiones cruzadas (CSRF)', '<code>Secure; SameSite=Lax</code>'],
  ]
)}
<p>En React, Vue o Angular el escape automático de plantillas evita la mayoría de los XSS, siempre que no lo desactives con <code>dangerouslySetInnerHTML</code> o <code>v-html</code> sobre contenido del usuario; si necesitas renderizar HTML externo, sanitízalo con una librería como DOMPurify. La CSP es la red de seguridad para cuando algo se escapa.</p>`,
    },
    {
      id: 'sec-dependencias',
      title: 'Dependencias y configuración: la superficie que no escribiste',
      html: '<p>Una aplicación moderna tiene muchas más líneas de código de terceros que propias. Mantén las dependencias actualizadas con herramientas como Dependabot o Renovate, revisa los avisos de <code>npm audit</code> priorizando lo que de verdad se ejecuta en producción y fija versiones con un lockfile. En la configuración, desactiva los modos de depuración y los mensajes de error detallados en producción (un stack trace revela rutas, versiones y consultas), cambia las credenciales por defecto y no expongas paneles de administración ni puertos de base de datos a internet.</p>',
    },
    {
      id: 'sec-errores',
      title: 'Errores comunes que abren la puerta',
      html: `<ul>
  <li><strong>Confiar en que el frontend oculta un botón.</strong> Ocultar la opción de borrar no impide llamar al endpoint; la autorización va en el servidor.</li>
  <li><strong>Tomar el ID del usuario del body o de la URL.</strong> La identidad sale de la sesión o del token verificado, nunca de un campo que el cliente controla.</li>
  <li><strong>Registrar datos sensibles en los logs.</strong> Contraseñas, tokens y datos de tarjetas en logs terminan en sistemas con muchos más accesos que la base de datos.</li>
  <li><strong>CORS con comodín y credenciales.</strong> Reflejar cualquier origen en <code>Access-Control-Allow-Origin</code> junto con cookies permite que otros sitios lean respuestas en nombre del usuario.</li>
  <li><strong>Mensajes de error que filtran información.</strong> Distinguir "usuario no existe" de "contraseña incorrecta" facilita enumerar cuentas; responde con un mensaje genérico.</li>
</ul>`,
    },
    {
      id: 'sec-limites',
      title: 'Límites: lo que estos fundamentos no resuelven',
      html: '<p>Aplicar todo lo anterior cierra la mayoría de las puertas que se explotan en la práctica, pero no convierte una aplicación en segura por sí solo. No sustituye a un modelado de amenazas cuando manejas datos de salud, pagos o información sensible, ni a una revisión de seguridad o un pentest antes de exponer algo crítico, ni al cumplimiento de normas que pueden aplicar a tu sector. Tampoco cubre la infraestructura (redes, permisos en la nube, copias de seguridad) ni la ingeniería social. La regla práctica es tratar estos fundamentos como el mínimo innegociable de cada proyecto y escalar la inversión en seguridad según lo que estaría en juego si alguien entra.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Un ORM me protege de la inyección SQL?',
      a: 'En sus operaciones normales sí, porque parametriza. Pero si usas consultas crudas (raw queries) concatenando entrada, vuelves a ser vulnerable. Mantén la parametrización incluso en raw queries.',
    },
    {
      q: 'Subí una clave de API al repositorio por error, ¿qué hago?',
      a: 'Revócala y genera una nueva de inmediato. Reescribir el historial de git ayuda, pero debes asumir que la clave quedó comprometida desde el momento en que se subió.',
    },
    {
      q: '¿Necesito un pentest para estar seguro?',
      a: 'Un pentest es valioso, pero primero cubre lo básico: validación en servidor, consultas parametrizadas, gestión de secretos, HTTPS y dependencias actualizadas. La mayoría de incidentes explotan fallos básicos, no vulnerabilidades exóticas.',
    },
    {
      q: '¿Dónde guardo el token de sesión en una SPA?',
      a: 'Preferiblemente en una cookie HttpOnly, Secure y SameSite emitida por tu backend, que el JavaScript no puede leer. localStorage es cómodo, pero cualquier XSS puede robar lo que guardes ahí.',
    },
    {
      q: '¿Sigo necesitando protección CSRF si uso SameSite?',
      a: 'SameSite=Lax mitiga la mayoría de los casos, pero no cubre peticiones desde subdominios del mismo sitio ni acciones que cambian estado mediante GET. Para operaciones sensibles, un token anti-CSRF sigue siendo una capa recomendable.',
    },
  ],
  refs: [
    { label: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
    { label: 'OWASP Cheat Sheet Series', url: 'https://cheatsheetseries.owasp.org' },
    { label: 'OWASP — SQL Injection Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
    { label: 'OWASP — Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
    { label: 'OWASP — Authorization Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html' },
    { label: 'MDN — Content Security Policy (CSP)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
  ],
  closing: '¿Quieres una revisión de seguridad de tu app? Contáctame.',
});

export const CORE_WRITING_ARTICLES: WritingArticle[] = [
  {
    id: 'art-monolito-microservicios',
    slug: 'monolito-a-microservicios-sin-romper-produccion',
    date: 'SEPTIEMBRE 2026',
    tag: 'ARCHITECTURE',
    title: 'Cuándo Migrar de un Monolito a Microservicios (y Cómo Hacerlo Sin Romper Producción)',
    metaDescription:
      'Guía técnica para decidir si tu monolito necesita microservicios y migrar con el patrón Strangler Fig sin downtime ni reescrituras arriesgadas.',
    excerpt:
      'Guía práctica para decidir si tu monolito necesita microservicios de verdad, con el patrón Strangler Fig y un plan de rollback para migrar sin downtime ni reescrituras arriesgadas.',
    readTime: readTimeOf(MONOLITH_TO_MICROSERVICES_CONTENT),
    contentHtml: MONOLITH_TO_MICROSERVICES_CONTENT,
  },
  {
    id: 'art-rendimiento-react',
    slug: 'optimizar-rendimiento-react-sin-adivinar',
    date: 'AGOSTO 2026',
    tag: 'FRONTEND',
    title: 'Optimizar el Rendimiento de React Sin Adivinar: Renders, Memoización y Bundle',
    metaDescription:
      'Cómo encontrar cuellos de botella reales en React: medir con el Profiler, evitar re-renders, memoizar con criterio y reducir el bundle inicial.',
    excerpt:
      'Guía práctica para diagnosticar por qué tu app React va lenta y resolverlo midiendo primero: re-renders innecesarios, memoización con criterio y code splitting para reducir el bundle.',
    readTime: readTimeOf(RENDER_PERF_CONTENT),
    contentHtml: RENDER_PERF_CONTENT,
  },
  {
    id: 'art-rag-llm',
    slug: 'rag-conectar-llm-a-tus-datos',
    date: 'JULIO 2026',
    tag: 'AI / LLM',
    title: 'RAG: Cómo Conectar un LLM a Tus Propios Datos Sin Reentrenarlo',
    metaDescription:
      'Qué es RAG, cómo funciona el pipeline de chunking, embeddings y recuperación, cómo evaluarlo y los errores que arruinan la calidad de las respuestas.',
    excerpt:
      'El patrón más práctico para construir asistentes con tus datos sin fine-tuning: cómo funciona el pipeline de RAG, los errores que degradan la calidad y cómo evaluarlo de verdad.',
    readTime: readTimeOf(RAG_LLM_CONTENT),
    contentHtml: RAG_LLM_CONTENT,
  },
  {
    id: 'art-postgres-indices',
    slug: 'indices-postgresql-consultas-lentas',
    date: 'JUNIO 2026',
    tag: 'DATABASES',
    title: 'Índices en PostgreSQL: Por Qué Tu Consulta Es Lenta y Cómo Arreglarla',
    metaDescription:
      'Cómo leer EXPLAIN ANALYZE, distinguir Seq Scan de Index Scan, ordenar las columnas de un índice compuesto y evitar indexar de más en PostgreSQL.',
    excerpt:
      'Una consulta lenta rara vez necesita más hardware: necesita el índice correcto. Cómo leer el plan de ejecución, elegir índices y evitar el costo oculto de indexar de más.',
    readTime: readTimeOf(POSTGRES_INDEX_CONTENT),
    contentHtml: POSTGRES_INDEX_CONTENT,
  },
  {
    id: 'art-seguridad-web',
    slug: 'fundamentos-seguridad-web-fullstack',
    date: 'MAYO 2026',
    tag: 'SECURITY',
    title: 'Seguridad Web para Fullstack: Los Fundamentos Que Evitan el 90% de las Brechas',
    metaDescription:
      'Validación en servidor, consultas parametrizadas, control de acceso, secretos, HTTPS, cabeceras y cookies: lo básico que todo fullstack debe aplicar.',
    excerpt:
      'La mayoría de las brechas explotan descuidos básicos, no ataques sofisticados. Validación en servidor, consultas parametrizadas, gestión de secretos y cabeceras seguras aplicadas por defecto.',
    readTime: readTimeOf(WEB_SECURITY_CONTENT),
    contentHtml: WEB_SECURITY_CONTENT,
  },
];
