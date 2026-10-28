import type { WritingArticle } from '../types';
import { articleCode, articleTable, buildArticle, compareDiagram, flowDiagram, readTimeOf } from './articleTemplate';

/* Cada artículo define su contenido en una constante para calcular readTime a partir de él. */
const TS_STRICT_CONTENT = buildArticle({
  prefix: 'ts',
  intro:
    'Muchos proyectos usan TypeScript como si fuera JavaScript con anotaciones opcionales: <code>any</code> por todos lados, <code>strict</code> desactivado y tipos que mienten sobre los datos reales. Así se paga el costo de escribir tipos sin recibir su beneficio. La pregunta útil no es "¿usamos TypeScript?", sino "¿qué errores atrapa hoy nuestro compilador que antes llegaban a producción?". Este artículo responde eso con configuraciones concretas, patrones de modelado y un plan para endurecer un proyecto existente sin frenar al equipo.',
  takeaways: [
    'Activar <code>strict</code> es la mejora de calidad más barata que puedes hacer en un proyecto TypeScript: la mayoría de errores que revela son bugs reales, no ruido.',
    'Las uniones discriminadas convierten estados imposibles (cargando y con error a la vez) en errores de compilación.',
    '<code>unknown</code> obliga a validar antes de usar un valor; <code>any</code> desactiva el sistema de tipos en silencio y se contagia.',
    'Los tipos no existen en runtime: los datos externos (APIs, formularios, variables de entorno) deben validarse con un esquema del que se infiere el tipo.',
  ],
  sections: [
    {
      id: 'ts-problema',
      title: 'TypeScript sin strict es JavaScript con comentarios',
      html: `<p>Cuando <code>strict</code> está apagado, el compilador acepta código que sabe que puede fallar: permite acceder a propiedades de valores que pueden ser <code>undefined</code>, asume <code>any</code> cuando no puede inferir un tipo y deja pasar funciones que no devuelven lo que prometen. El editor sigue mostrando autocompletado, así que todo parece tipado, pero las garantías reales son mínimas.</p>
<p>El costo aparece en producción: el clásico <code>Cannot read properties of undefined</code>, respuestas de API que cambiaron de forma sin que nadie se enterara, o estados de interfaz contradictorios. Ninguno de esos errores es exótico; casi todos son detectables en compilación si el compilador tiene permiso para quejarse. La meta de este artículo es dárselo.</p>`,
    },
    {
      id: 'ts-flags',
      title: 'Las opciones del compilador que más bugs evitan',
      html: '<p>El flag <code>strict</code> es un atajo que activa una familia de comprobaciones. No todas pesan igual: estas tres son las que más errores reales atrapan en los proyectos que audito.</p>',
      subsections: [
        {
          id: 'ts-null',
          title: 'strictNullChecks: null y undefined dejan de ser invisibles',
          html: '<p>Sin esta opción, <code>null</code> y <code>undefined</code> son asignables a cualquier tipo, así que <code>user.name</code> compila aunque <code>user</code> venga de un <code>find()</code> que puede no encontrar nada. Con ella, el tipo pasa a ser <code>User | undefined</code> y el compilador exige comprobarlo antes de usarlo. Es, por mucho, la comprobación que más fallos de runtime previene.</p>',
        },
        {
          id: 'ts-implicit',
          title: 'noImplicitAny: ningún tipo se pierde en silencio',
          html: '<p>Cuando TypeScript no puede inferir el tipo de un parámetro, sin esta opción lo trata como <code>any</code> sin avisar. Con ella, te obliga a declararlo. Parece burocracia, pero es lo que impide que un parámetro mal tipado desactive la verificación de todo lo que toca después.</p>',
        },
        {
          id: 'ts-indexed',
          title: 'noUncheckedIndexedAccess: los arreglos también pueden estar vacíos',
          html: '<p>No forma parte de <code>strict</code>, pero vale la pena activarla. Hace que <code>items[0]</code> o <code>record[key]</code> tengan tipo <code>T | undefined</code>, porque en runtime el índice puede no existir. Es especialmente útil en código que procesa listas de una API o diccionarios construidos a partir de datos externos.</p>',
        },
      ],
      after: articleCode(`
// tsconfig.json — configuración base recomendada
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false
  }
}`),
    },
    {
      id: 'ts-uniones',
      title: 'Uniones discriminadas: hacer imposibles los estados imposibles',
      html: `<p>Un patrón muy común es modelar una petición con tres campos opcionales: <code>isLoading</code>, <code>error</code> y <code>data</code>. El problema es que el tipo permite combinaciones absurdas, como estar cargando y con error al mismo tiempo, y obliga a cada componente a defenderse de casos que nunca deberían existir.</p>
<p>Una unión discriminada describe solo los estados válidos, cada uno con su propia forma. El campo común (<code>status</code>) le dice al compilador en qué caso estás, y dentro de cada rama solo están disponibles los datos que tienen sentido. Si mañana agregas un estado nuevo, la comprobación exhaustiva con <code>never</code> marca cada lugar del código que olvidó manejarlo.</p>
${articleCode(`
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

function render(state: RequestState<User>) {
  switch (state.status) {
    case "loading":
      return "Cargando…";
    case "error":
      return "Error: " + state.error;        // error solo existe aquí
    case "success":
      return "Hola, " + state.data.name;     // data solo existe aquí
    case "idle":
      return "";
    default: {
      const exhaustive: never = state;       // falla si falta un caso
      return exhaustive;
    }
  }
}`)}`,
    },
    {
      id: 'ts-unknown',
      title: 'any, unknown o un tipo explícito: comparativa',
      html: `<p><code>any</code> y <code>unknown</code> representan lo mismo, "no sé qué es esto", pero se comportan de forma opuesta. <code>any</code> permite hacer cualquier cosa con el valor y además contagia: todo lo que se deriva de él también pierde tipos. <code>unknown</code> no deja usar el valor hasta que lo estrechas con una comprobación (<code>typeof</code>, <code>instanceof</code>, una guarda de tipo o un esquema). Para respuestas de API, <code>JSON.parse</code> y el error de un bloque <code>catch</code>, <code>unknown</code> es el tipo honesto.</p>
${articleTable(
  ['Criterio', 'any', 'unknown', 'Tipo explícito'],
  [
    ['Verificación del compilador', 'Ninguna', 'Obliga a estrechar antes de usar', 'Completa'],
    ['Se propaga a otros valores', 'Sí, en silencio', 'No', 'No'],
    ['Uso recomendado', 'Migraciones temporales, marcadas como deuda', 'Datos externos y errores de catch', 'Todo el código propio'],
    ['Riesgo en producción', 'Alto: oculta errores', 'Bajo: fuerza la validación', 'Bajo, si el tipo es verdad'],
    ['Autocompletado del editor', 'Engañoso', 'Solo después de validar', 'Preciso'],
  ]
)}`,
    },
    {
      id: 'ts-bordes',
      title: 'Validar en los bordes del sistema',
      html: `<p>Los tipos desaparecen al compilar. Si declaras que una API devuelve <code>User</code> pero el backend cambia el formato, TypeScript no se entera y el error aparece lejos de su causa. La solución es validar los datos en el punto donde entran al sistema y derivar el tipo del propio esquema, para que tipo y validación nunca se desincronicen.</p>
${flowDiagram(['Dato externo\n(API, formulario)', 'Esquema Zod\nsafeParse', 'Tipo inferido\nz.infer', 'Código interno\nconfiable'], 'Validar una vez en la entrada, confiar en los tipos adentro')}
${articleCode(`
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;   // el tipo sale del esquema

async function getUser(id: number): Promise<User> {
  const res = await fetch("/api/users/" + id);
  const json: unknown = await res.json();
  const parsed = UserSchema.safeParse(json);
  if (!parsed.success) throw new Error("Respuesta inválida de /api/users");
  return parsed.data;
}`)}
<p>El mismo principio aplica a variables de entorno, parámetros de URL, mensajes de colas y archivos subidos: todo lo que no nace en tu código es <code>unknown</code> hasta que se demuestre lo contrario.</p>`,
    },
    {
      id: 'ts-migrar',
      title: 'Cómo activar strict en un proyecto existente sin frenar al equipo',
      html: '<p>Encender <code>strict</code> de golpe en un proyecto grande puede generar cientos de errores y bloquear al equipo durante días. Un enfoque incremental da el mismo resultado sin detener la entrega de funcionalidades.</p>',
      subsections: [
        {
          id: 'ts-medir',
          title: 'Medir antes de cambiar',
          html: '<p>Activa <code>strict</code> en una rama y cuenta los errores por carpeta con <code>tsc --noEmit</code>. Esa lista es tu mapa: empieza por los módulos con menos errores y mayor tráfico, donde el beneficio es inmediato.</p>',
        },
        {
          id: 'ts-incremental',
          title: 'Avanzar por módulos',
          html: '<p>Mantén un <code>tsconfig</code> estricto para el código nuevo y migra carpeta por carpeta. Herramientas como el plugin <code>typescript-strict-plugin</code> permiten exigir strict solo en archivos marcados, de modo que nada nuevo nace sin tipos.</p>',
        },
        {
          id: 'ts-ci',
          title: 'Proteger el avance en CI',
          html: '<p>Agrega <code>tsc --noEmit</code> al pipeline y una regla de lint que prohíba <code>any</code> explícito en código nuevo. Así el número de errores solo puede bajar y la migración no retrocede con cada pull request.</p>',
        },
      ],
    },
    {
      id: 'ts-errores',
      title: 'Errores comunes que anulan los beneficios de TypeScript',
      html: `<ul>
  <li><strong>Silenciar errores con <code>as</code>.</strong> Una aserción como <code>data as User</code> no valida nada: solo le pide al compilador que confíe. Úsala solo cuando de verdad sabes más que él, nunca con datos externos.</li>
  <li><strong>Abusar del operador <code>!</code>.</strong> <code>user!.name</code> desactiva la comprobación de nulos justo donde podía evitar un error. Si necesitas <code>!</code> a menudo, el tipo está mal modelado.</li>
  <li><strong>Tipar respuestas de API sin validarlas.</strong> Declarar <code>fetch() as Promise&lt;User&gt;</code> crea una mentira tipada que falla lejos de su origen cuando el backend cambia.</li>
  <li><strong>Desactivar reglas en lugar de corregir el diseño.</strong> Un <code>@ts-ignore</code> sin explicación es deuda invisible; si es inevitable, usa <code>@ts-expect-error</code> con un comentario del motivo.</li>
  <li><strong>Copiar tipos en lugar de derivarlos.</strong> Duplicar a mano el tipo de un esquema o de una respuesta garantiza que tarde o temprano se desincronicen; usa <code>z.infer</code>, <code>ReturnType</code> o tipos generados.</li>
</ul>`,
    },
    {
      id: 'ts-limites',
      title: 'Cuándo NO vale la pena endurecer más los tipos',
      html: '<p>Los tipos son una herramienta, no un fin. En un script de un solo uso, un prototipo para validar una idea o un archivo de configuración pequeño, invertir horas en tipos avanzados no se paga. Tampoco conviene construir tipos condicionales y genéricos tan sofisticados que nadie del equipo los entiende: un tipo que solo su autor puede mantener se convierte en un riesgo. La regla práctica es estricto en la configuración, simple en los tipos y riguroso en los bordes del sistema. Esa combinación atrapa la gran mayoría de errores con un costo de mantenimiento bajo.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Activar strict en un proyecto grande rompe todo?',
      a: 'Genera muchos errores al principio, pero cada uno suele señalar un bug potencial real. Actívalo por módulos, mide el avance en CI y corrige de forma progresiva en lugar de hacerlo de golpe.',
    },
    {
      q: '¿Cuándo está justificado usar any?',
      a: 'Casi nunca. En migraciones temporales desde JavaScript o con librerías sin tipos, y siempre como deuda técnica marcada y con fecha. Para todo lo demás, unknown o un tipo explícito.',
    },
    {
      q: '¿Zod reemplaza a TypeScript?',
      a: 'No, lo complementa. TypeScript verifica tu código en compilación; Zod verifica los datos externos en runtime. Usar z.infer mantiene ambos alineados sin duplicar definiciones.',
    },
    {
      q: '¿Strict hace más lenta la compilación o la aplicación?',
      a: 'No afecta la aplicación: los tipos desaparecen al compilar y el JavaScript resultante es el mismo. En compilación el impacto es mínimo; lo que sí cambia es que el compilador reporta más problemas.',
    },
    {
      q: '¿Qué hago con librerías que no tienen tipos?',
      a: 'Busca primero el paquete @types correspondiente. Si no existe, declara un módulo mínimo con solo las funciones que usas y valida sus resultados como si fueran datos externos.',
    },
  ],
  refs: [
    { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
    { label: 'TSConfig — strict', url: 'https://www.typescriptlang.org/tsconfig#strict' },
    { label: 'TSConfig — noUncheckedIndexedAccess', url: 'https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess' },
    { label: 'Narrowing (estrechamiento de tipos)', url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html' },
    { label: 'Zod', url: 'https://zod.dev' },
    { label: 'Effective TypeScript', note: 'Dan Vanderkam (libro): 83 formas concretas de usar mejor los tipos' },
  ],
  closing: '¿Migrando un proyecto a TypeScript estricto o diseñando tipos para una API? Puedo ayudarte.',
});

const ASTRO_ISLAS_CONTENT = buildArticle({
  prefix: 'astro',
  intro:
    'Una landing page o un sitio de servicios no necesita descargar todo un framework para mostrar texto e imágenes. Sin embargo, muchos sitios de contenido se construyen como una SPA completa: el navegador recibe un HTML casi vacío, descarga cientos de kilobytes de JavaScript y solo entonces pinta la página. Astro parte de una idea distinta: renderizar HTML en el servidor y solo hidratar con JavaScript las partes que de verdad son interactivas. La pregunta útil no es "¿React o Astro?", sino "¿cuánto de mi página necesita realmente JavaScript para funcionar?". He usado este enfoque en sitios en producción para clínicas y plataformas de empleo. Este artículo explica cómo funcionan las islas, cómo elegir las directivas de hidratación y cuándo una SPA sigue siendo la mejor opción.',
  takeaways: [
    'Astro envía cero JavaScript por defecto: solo hidrata los componentes que marcas explícitamente como interactivos.',
    'Las islas permiten usar React, Vue o Svelte dentro de la misma página sin cargar una SPA completa.',
    'Las directivas <code>client:*</code> deciden cuándo se hidrata cada isla; elegirlas bien libera el hilo principal en la carga inicial.',
    'Para sitios de contenido y marketing, menos JavaScript suele traducirse en mejores Core Web Vitals y un HTML más fácil de indexar.',
    'Para aplicaciones muy interactivas (dashboards, editores, herramientas internas), una SPA sigue siendo la mejor opción.',
  ],
  sections: [
    {
      id: 'astro-problema',
      title: 'El problema: enviar una aplicación para mostrar un documento',
      html: `<p>Una SPA tradicional en React resuelve muy bien un problema concreto: interfaces donde el usuario pasa mucho tiempo, cambia de vista sin recargar y casi todo en pantalla reacciona a sus acciones. El costo de ese modelo es que el navegador debe descargar, interpretar y ejecutar el JavaScript de toda la aplicación antes de que la página sea útil, incluso si el 90 % de ella es texto que nunca cambia.</p>
<p>En un sitio de marketing, un blog o la página de una clínica, ese costo no compra nada. El visitante llega desde un buscador o un anuncio, lee, quizá llena un formulario y se va. Cada kilobyte de JavaScript que no aporta interactividad retrasa el contenido principal, ocupa el hilo principal en teléfonos de gama media y hace más frágil la indexación. El renderizado en servidor de frameworks como Next.js mejora la primera pintura, pero la hidratación sigue procesando el árbol completo de componentes. Astro ataca el problema desde la raíz: si un componente no necesita interactividad, no envía su JavaScript.</p>`,
    },
    {
      id: 'astro-islas',
      title: 'Qué es una isla y cómo funciona',
      html: '<p>El término "arquitectura de islas" describe una página de HTML estático en la que aparecen zonas interactivas aisladas, como islas en un mar de contenido. Cada isla se hidrata de forma independiente: si una falla o tarda, el resto de la página sigue funcionando.</p>',
      subsections: [
        {
          id: 'astro-html',
          title: 'HTML estático por defecto',
          html: '<p>Los componentes <code>.astro</code> se ejecutan solo en el servidor (o en el build) y producen HTML. Incluso un componente de React usado sin directiva se renderiza a HTML y no envía nada de JavaScript al cliente. Cabeceras, textos, imágenes, tarjetas de servicios y pies de página llegan como HTML puro, listos para mostrarse e indexarse.</p>',
        },
        {
          id: 'astro-componentes',
          title: 'Islas de cliente',
          html: '<p>Cuando un componente necesita estado o eventos del navegador (un buscador, un carrusel, un formulario de reservas con validación), se le agrega una directiva <code>client:*</code>. Astro lo renderiza primero a HTML en el servidor y luego carga solo el JavaScript de ese componente y de su framework para hidratarlo. Puedes tener una isla en React y otra en Svelte en la misma página, aunque por mantenimiento conviene limitarse a un framework.</p>',
        },
        {
          id: 'astro-servidor',
          title: 'Islas de servidor',
          html: '<p>Las versiones recientes de Astro agregaron la directiva <code>server:defer</code>, que aplica la misma idea al servidor: la página se sirve rápido (incluso desde caché) y un fragmento personalizado, como el avatar del usuario o un carrito, se renderiza aparte y se inserta cuando está listo. Es útil para combinar páginas cacheables con pequeñas partes dinámicas.</p>',
        },
      ],
      after: flowDiagram(
        ['Petición\ndel visitante', 'HTML completo\nen servidor', 'Página visible\nsin JavaScript', 'Se hidratan\nsolo las islas'],
        'Primero el contenido, después la interactividad'
      ),
    },
    {
      id: 'astro-directivas',
      title: 'Directivas de hidratación: cuándo cargar cada isla',
      html: `<p>La directiva le dice a Astro en qué momento hidratar la isla. Es la decisión de rendimiento más importante en un proyecto con islas, porque determina cuánto JavaScript compite con el contenido principal durante la carga.</p>
${articleTable(
  ['Directiva', 'Cuándo hidrata', 'Caso típico'],
  [
    ['<code>client:load</code>', 'Inmediatamente al cargar la página', 'Elementos críticos visibles arriba: menú móvil, formulario principal'],
    ['<code>client:idle</code>', 'Cuando el navegador queda libre (requestIdleCallback)', 'Widgets de prioridad media: chat, banners de cookies'],
    ['<code>client:visible</code>', 'Cuando el componente entra en pantalla (IntersectionObserver)', 'Contenido bajo el pliegue: carruseles, mapas, reseñas'],
    ['<code>client:media</code>', 'Cuando se cumple un media query', 'Componentes que solo existen en ciertos tamaños de pantalla'],
    ['<code>client:only</code>', 'Solo en el cliente, sin HTML de servidor', 'Componentes que dependen de APIs del navegador, como window o localStorage'],
  ]
)}
${articleCode(`
---
// src/pages/agenda.astro — el frontmatter se ejecuta solo en el servidor
import Layout from "../layouts/Layout.astro";
import Servicios from "../components/Servicios.astro";   // HTML puro
import FormularioCita from "../components/FormularioCita.tsx";
import Resenas from "../components/Resenas.tsx";
import ChatSoporte from "../components/ChatSoporte.tsx";

const servicios = await fetch("https://api.ejemplo.com/servicios").then((r) => r.json());
---
<Layout title="Agenda tu cita">
  <h1>Agenda tu cita</h1>
  <Servicios items={servicios} />           <!-- sin JavaScript -->
  <FormularioCita client:load />             <!-- crítico: hidrata ya -->
  <Resenas client:visible />                 <!-- bajo el pliegue -->
  <ChatSoporte client:idle />                <!-- cuando haya tiempo libre -->
</Layout>`)}
<p>La regla que aplico es empezar sin directivas y agregar la menos agresiva que funcione. <code>client:load</code> debería ser la excepción, reservada para lo que el usuario necesita usar en los primeros segundos.</p>`,
    },
    {
      id: 'astro-vs-spa',
      title: 'Astro frente a una SPA en React',
      html: `<p>Ninguno de los dos modelos es superior en abstracto: optimizan para tipos de producto distintos. Una SPA amortiza su carga inicial porque el usuario se queda mucho tiempo y navega sin recargar. Un sitio de contenido no tiene esa sesión larga que amortice nada; cada visita suele ser corta y empieza en frío.</p>
${compareDiagram(
  { title: 'SPA en React', points: ['Carga el JS de toda la aplicación', 'HTML inicial casi vacío (sin SSR)', 'Navegación sin recargar', 'Ideal para apps de uso prolongado'] },
  { title: 'Astro con islas', points: ['Cero JS por defecto', 'HTML completo desde el servidor', 'JS solo en componentes marcados', 'Ideal para contenido y marketing'] },
  'Dos modelos para dos tipos de producto'
)}
<p>Hay un punto intermedio que conviene conocer: Astro también puede simular transiciones de página con su API de View Transitions, lo que da una sensación de navegación fluida sin convertir el sitio en una SPA. Y si una sección del sitio sí es una aplicación (por ejemplo, un portal de clientes), puede vivir como una gran isla con <code>client:only</code> o como un proyecto separado.</p>`,
    },
    {
      id: 'astro-estado',
      title: 'Compartir estado entre islas',
      html: `<p>Como cada isla se hidrata de forma independiente, no comparten un árbol de componentes ni un contexto de React común. Si el botón "agregar al carrito" vive en una isla y el contador del carrito en otra, necesitas un estado que exista fuera de ambas.</p>
<p>La documentación de Astro recomienda <strong>nanostores</strong>, una librería muy pequeña e independiente del framework: cada isla se suscribe al mismo store y reacciona a sus cambios. Para casos simples, un evento personalizado del DOM o la URL (parámetros de búsqueda) también funcionan. Si descubres que casi todas tus islas necesitan compartir mucho estado, es una señal de que esa parte del sitio quizá debería ser una sola isla más grande o una aplicación aparte.</p>`,
    },
    {
      id: 'astro-errores',
      title: 'Errores comunes al adoptar Astro',
      html: `<ul>
  <li><strong>Poner <code>client:load</code> en todo.</strong> Es la forma más rápida de reconstruir una SPA con pasos extra. Cada directiva debe justificarse.</li>
  <li><strong>Islas demasiado grandes.</strong> Envolver toda la página en un componente de React hidratado anula el beneficio. Las islas deben ser lo más pequeñas posible.</li>
  <li><strong>Esperar que el contexto de React cruce islas.</strong> Un <code>Provider</code> en una isla no llega a otra; usa un store compartido o replantea los límites.</li>
  <li><strong>Usar <code>client:only</code> sin necesidad.</strong> Omite el HTML de servidor, así que ese contenido no se ve hasta que carga el JavaScript y no aporta al SEO.</li>
  <li><strong>Ignorar el modo de renderizado.</strong> Una página que debe mostrar datos por usuario necesita SSR o islas de servidor; generarla estática en el build mostrará datos viejos o de otra persona.</li>
</ul>`,
    },
    {
      id: 'astro-cuando-no',
      title: 'Cuándo NO elegir Astro',
      html: `<p>Astro no es la respuesta para todo. Si casi toda la interfaz es interactiva y el usuario pasa largas sesiones dentro de ella (un panel de administración, un CRM, un editor visual, una herramienta de análisis con filtros que se combinan), el modelo de islas añade fricción: terminarías con una sola isla gigante y sin ninguno de los beneficios. En esos casos, una SPA con React y un buen sistema de rutas, o un framework como Next.js, es más natural.</p>
<p>Tampoco conviene migrar un sitio que ya funciona bien y cumple sus métricas solo por moda. La pregunta útil es si el JavaScript que envías hoy está frenando a tus visitantes: si las Core Web Vitals son buenas y el equipo es productivo, el beneficio de cambiar será marginal. Donde Astro realmente brilla es en sitios nuevos de contenido, marketing, documentación y servicios, o en sitios existentes con métricas de carga deficientes por exceso de JavaScript.</p>`,
    },
  ],
  faqs: [
    {
      q: '¿Puedo usar mis componentes de React en Astro?',
      a: 'Sí. Con la integración oficial de React tus componentes funcionan dentro de Astro. Sin directiva se renderizan a HTML estático; con una directiva client: se convierten en islas interactivas.',
    },
    {
      q: '¿Astro sirve para sitios con backend?',
      a: 'Sí. En modo de renderizado en servidor, Astro genera las páginas por petición y puede consultar APIs, bases de datos y manejar autenticación mediante adaptadores para Node, Vercel, Netlify y otros proveedores.',
    },
    {
      q: '¿Mejora el SEO realmente?',
      a: 'Ayuda en lo técnico: el HTML llega completo desde el servidor y la página carga más rápido, dos factores que facilitan la indexación y las Core Web Vitals. El contenido y la estrategia siguen siendo lo principal.',
    },
    {
      q: '¿Qué pasa si una isla falla al cargar?',
      a: 'El resto de la página sigue funcionando, porque cada isla se hidrata de forma independiente y el HTML de servidor ya está visible. Es una ventaja frente a una SPA, donde un error de JavaScript puede dejar la página en blanco.',
    },
    {
      q: '¿Cómo comparten datos dos islas?',
      a: 'Con un estado externo a ambas, como nanostores, eventos del DOM o parámetros de la URL. El contexto de React no cruza los límites de una isla.',
    },
  ],
  refs: [
    { label: 'Astro Docs — Islands architecture', url: 'https://docs.astro.build/en/concepts/islands/' },
    { label: 'Astro Docs — Template directives reference', url: 'https://docs.astro.build/en/reference/directives-reference/' },
    { label: 'Astro Docs — Integración con React', url: 'https://docs.astro.build/en/guides/integrations-guide/react/' },
    { label: 'Astro Docs — Share state between islands', url: 'https://docs.astro.build/en/recipes/sharing-state-islands/' },
    { label: 'Islands Architecture', note: 'artículo de Jason Miller que popularizó el término', url: 'https://jasonformat.com/islands-architecture/' },
  ],
  closing: '¿Tu sitio de marketing carga lento? Hablemos de cómo optimizarlo.',
});

const STRIPE_WEBHOOKS_CONTENT = buildArticle({
  prefix: 'stripe',
  intro:
    'Integrar un botón de pago con Stripe es fácil. Construir un flujo de pagos que no pierda pedidos, no cobre dos veces y sobreviva a caídas de red es otra historia. La mayoría de los problemas que aparecen en producción no vienen de Stripe, sino de suposiciones del lado de la aplicación: que el usuario siempre vuelve a la página de éxito, que cada evento llega una sola vez y en orden, o que una petición que dio timeout no se ejecutó. Este artículo explica cómo tratar los webhooks como fuente de verdad, cómo verificarlos y cómo diseñar cada paso para que pueda repetirse sin efectos secundarios.',
  takeaways: [
    'La página de éxito no confirma un pago: el webhook firmado de Stripe sí.',
    'Verifica siempre la firma del webhook con el cuerpo crudo de la petición para rechazar eventos falsificados.',
    'Stripe reintenta los webhooks y no garantiza el orden: tu handler debe ser idempotente y tolerar duplicados.',
    'Envía claves de idempotencia al crear objetos en la API para que un reintento del cliente no genere un segundo cobro.',
    'Responde rápido con un 2xx y procesa el trabajo pesado en segundo plano.',
  ],
  sections: [
    {
      id: 'stripe-redireccion',
      title: 'Por qué la redirección no confirma un pago',
      html: `<p>El flujo ingenuo es así: el usuario paga en Stripe Checkout, Stripe lo redirige a <code>/gracias</code> y esa página marca el pedido como pagado. Funciona en las pruebas, pero en producción falla de varias maneras. El usuario puede cerrar la pestaña justo después de pagar, perder la conexión en el móvil o nunca llegar a la página de confirmación. Además, cualquiera puede visitar <code>/gracias</code> manualmente si la lógica no verifica nada.</p>
<p>Hay otro caso menos obvio: algunos métodos de pago no se confirman al instante. Débitos bancarios y ciertos métodos locales pueden tardar horas o días en confirmarse o fallar. Si tu sistema decide en la redirección, entregarás productos por pagos que luego fallan, o dejarás sin atender pagos que se confirmaron más tarde. La redirección sirve para mostrar un mensaje al usuario; la confirmación tiene que venir de otro lado.</p>`,
    },
    {
      id: 'stripe-verdad',
      title: 'El webhook como fuente de verdad',
      html: '<p>Un webhook es una petición HTTP que Stripe envía a tu servidor cuando ocurre algo en tu cuenta. A diferencia de la redirección, no depende del navegador del usuario: si tu servidor está disponible, el evento llega, y si no lo está, Stripe lo reintenta.</p>',
      subsections: [
        {
          id: 'stripe-eventos',
          title: 'Los eventos que importan',
          html: '<p>Con Stripe Checkout, el evento central es <code>checkout.session.completed</code>. Si integras directamente con PaymentIntents, escucha <code>payment_intent.succeeded</code> y <code>payment_intent.payment_failed</code>. Para suscripciones, eventos como <code>invoice.paid</code> e <code>invoice.payment_failed</code> determinan si el cliente mantiene el acceso. Suscríbete solo a los eventos que tu sistema usa: cada evento extra es tráfico y lógica que mantener.</p>',
        },
        {
          id: 'stripe-asincronos',
          title: 'Pagos que se confirman más tarde',
          html: '<p>Con métodos de pago asíncronos, <code>checkout.session.completed</code> llega con <code>payment_status</code> distinto de <code>paid</code>. La confirmación real llega después con <code>checkout.session.async_payment_succeeded</code> o <code>checkout.session.async_payment_failed</code>. Tu lógica de entrega debe revisar ese estado en lugar de asumir que "sesión completada" significa "dinero recibido".</p>',
        },
        {
          id: 'stripe-orden',
          title: 'El orden no está garantizado',
          html: '<p>Stripe no garantiza que los eventos lleguen en el orden en que ocurrieron. Puedes recibir una actualización de suscripción antes que su creación. Diseña los handlers para que no dependan del orden: consulta el estado actual del objeto en la API cuando lo necesites, o guarda la marca de tiempo del evento y descarta actualizaciones más antiguas que la que ya aplicaste.</p>',
        },
      ],
      after: flowDiagram(
        ['Cliente paga\nen Checkout', 'Stripe envía\nel evento', 'Verificar\nfirma', 'Registrar\nevent.id', 'Procesar en\nsegundo plano'],
        'Del pago confirmado al pedido entregado'
      ),
    },
    {
      id: 'stripe-firma',
      title: 'Verificar la firma del webhook',
      html: `<p>Tu endpoint de webhook es una URL pública: cualquiera que la descubra podría enviarle un evento falso que diga "pago completado". Stripe firma cada evento con un secreto propio del endpoint y envía la firma en el encabezado <code>Stripe-Signature</code>, junto con una marca de tiempo que protege contra ataques de repetición. La librería oficial verifica ambas cosas.</p>
<p>El detalle que más integraciones rompe es que la verificación necesita el <strong>cuerpo crudo</strong> de la petición, exactamente como llegó. Si un middleware lo parsea como JSON antes, la firma deja de coincidir. En Express eso significa usar <code>express.raw</code> solo en esa ruta.</p>
${articleCode(`
import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.post("/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,                               // cuerpo crudo (Buffer)
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send("Firma inválida");
  }

  // Idempotencia: si el evento ya se registró, no se procesa de nuevo
  const isNew = await db.processedEvents.insertIfAbsent(event.id);
  if (!isNew) return res.sendStatus(200);

  if (event.type === "checkout.session.completed") {
    await queue.add("fulfill-order", { sessionId: event.data.object.id });
  }
  return res.sendStatus(200);                 // responder rápido
});`)}
<p>Fíjate en que el handler no entrega el pedido: solo registra el evento y encola el trabajo. Así responde en milisegundos y el procesamiento puede reintentarse por separado si algo falla.</p>`,
    },
    {
      id: 'stripe-idempotencia',
      title: 'Idempotencia en las dos direcciones',
      html: `<p>Una operación idempotente produce el mismo resultado si se ejecuta una o varias veces. En pagos hay que garantizarla en dos sentidos: los eventos que entran desde Stripe y las peticiones que tu sistema envía a Stripe.</p>
<p>Hacia adentro, Stripe puede entregar el mismo evento más de una vez, y si tu endpoint falla o tarda demasiado, reintenta durante un periodo de hasta varios días con espera exponencial. La solución es guardar el <code>id</code> de cada evento procesado con una restricción de unicidad en la base de datos y, si llega uno repetido, responder 200 sin ejecutar nada. Mejor aún, haz idempotente la propia lógica de negocio: "marcar el pedido 123 como pagado" puede repetirse sin daño; "sumar 1 al inventario vendido" no.</p>
<p>Hacia afuera, si tu servidor crea un PaymentIntent y la respuesta se pierde por un timeout, no sabes si el cobro se creó. Reintentar sin protección puede duplicarlo. Las claves de idempotencia resuelven esto: envías un identificador único por operación y, si la petición se repite con la misma clave, Stripe devuelve el resultado original en lugar de ejecutarla otra vez. Stripe conserva las claves al menos 24 horas.</p>
${articleCode(`
// La clave se deriva del pedido: un reintento nunca crea un segundo cobro
const paymentIntent = await stripe.paymentIntents.create(
  { amount: 2500, currency: "usd", customer: customerId, metadata: { orderId } },
  { idempotencyKey: "order-" + orderId + "-payment" }
);`)}
${articleTable(
  ['Riesgo', 'Dónde ocurre', 'Mecanismo de defensa'],
  [
    ['Evento entregado dos veces', 'Webhook entrante', 'Registrar <code>event.id</code> con restricción única'],
    ['Eventos fuera de orden', 'Webhook entrante', 'Consultar el estado actual del objeto o comparar marcas de tiempo'],
    ['Cobro duplicado por timeout', 'Petición saliente a la API', 'Clave de idempotencia por operación'],
    ['Evento falsificado', 'Endpoint público', 'Verificar <code>Stripe-Signature</code> con el secreto del endpoint'],
    ['Pedido perdido si el usuario cierra la pestaña', 'Redirección del navegador', 'Entregar solo a partir del webhook'],
  ]
)}`,
    },
    {
      id: 'stripe-errores',
      title: 'Errores comunes en integraciones de Stripe',
      html: `<ul>
  <li><strong>Hacer trabajo pesado dentro del handler.</strong> Enviar correos, generar facturas en PDF o llamar a otros servicios dentro del webhook provoca timeouts y reintentos. Responde rápido y procesa en segundo plano.</li>
  <li><strong>Parsear el cuerpo antes de verificar la firma.</strong> Un <code>express.json()</code> global rompe la verificación; la ruta del webhook necesita el cuerpo crudo.</li>
  <li><strong>Confundir los secretos.</strong> El secreto del webhook (<code>whsec_…</code>) no es la clave de API, y el endpoint de pruebas tiene un secreto distinto al de producción.</li>
  <li><strong>Exponer la clave secreta.</strong> La clave <code>sk_…</code> vive solo en el servidor, en variables de entorno. En el frontend solo va la clave publicable.</li>
  <li><strong>Confiar en montos enviados por el cliente.</strong> El precio se calcula en el servidor a partir del producto; nunca se toma de un campo del formulario.</li>
  <li><strong>No monitorear las entregas fallidas.</strong> El panel de Stripe muestra los webhooks que fallan; si nadie lo revisa, un endpoint roto puede pasar días sin detectarse.</li>
</ul>`,
    },
    {
      id: 'stripe-cuando-no',
      title: 'Cuándo NO necesitas construir todo esto',
      html: `<p>No todo negocio necesita un backend con colas y tablas de eventos. Si vendes pocos productos y la entrega es manual (un servicio que se agenda por teléfono, una consultoría), herramientas como Payment Links o las notificaciones por correo de Stripe pueden bastar: alguien revisa el panel y actúa. Agregar infraestructura que nadie va a mantener es un riesgo en sí mismo.</p>
<p>Del mismo modo, si usas una plataforma que ya integra Stripe (una tienda en Shopify, un sistema de membresías existente), esa plataforma se encarga de los webhooks y tu trabajo es configurarla bien, no reimplementarla. La regla que aplico es simple: en cuanto un pago dispara algo automático (dar acceso, crear un pedido, emitir una factura), ese algo debe colgar de un webhook verificado e idempotente. Antes de ese punto, la simplicidad gana.</p>`,
    },
  ],
  faqs: [
    {
      q: '¿Cómo pruebo webhooks en local?',
      a: 'Con el Stripe CLI: stripe listen reenvía los eventos de tu cuenta de pruebas a tu servidor local y te entrega un secreto de firma temporal, y stripe trigger simula eventos concretos sin hacer pagos reales.',
    },
    {
      q: '¿Checkout o Payment Element?',
      a: 'Stripe Checkout es una página alojada por Stripe, más rápida de integrar y con menos responsabilidad de cumplimiento. Payment Element se integra en tu propia interfaz y da más control visual a cambio de más trabajo.',
    },
    {
      q: '¿Qué código debe devolver mi webhook?',
      a: 'Un 2xx lo antes posible para confirmar la recepción. Cualquier otro código, o una respuesta demasiado lenta, hace que Stripe considere fallida la entrega y la reintente.',
    },
    {
      q: '¿Qué pasa si mi servidor estuvo caído varias horas?',
      a: 'Stripe sigue reintentando las entregas fallidas durante un tiempo con espera exponencial. Cuando el servidor vuelve, los eventos llegan; por eso el handler debe tolerar duplicados y eventos fuera de orden.',
    },
    {
      q: '¿Dónde guardo los IDs de eventos procesados?',
      a: 'En la misma base de datos del negocio, en una tabla con el ID del evento como clave única. Así el registro del evento y la actualización del pedido pueden ir en la misma transacción.',
    },
  ],
  refs: [
    { label: 'Stripe Docs — Webhooks', url: 'https://docs.stripe.com/webhooks' },
    { label: 'Stripe Docs — Idempotent requests', url: 'https://docs.stripe.com/api/idempotent_requests' },
    { label: 'Stripe Docs — Fulfill orders (Checkout)', url: 'https://docs.stripe.com/checkout/fulfillment' },
    { label: 'Stripe Docs — Payment Intents', url: 'https://docs.stripe.com/payments/payment-intents' },
    { label: 'Stripe CLI', url: 'https://docs.stripe.com/stripe-cli' },
  ],
  closing: '¿Necesitas integrar pagos en tu negocio? Escríbeme.',
});

const ZAPIER_CONTENT = buildArticle({
  prefix: 'zap',
  intro:
    'Herramientas como Zapier permiten conectar un CRM, una agenda, un formulario y un sistema de mensajería en una tarde. Esa velocidad es su gran ventaja y también su trampa. Meses después aparecen decenas de zaps que se disparan entre sí, nadie recuerda qué hace cada uno, una contraseña cambiada rompe tres flujos a la vez y un fallo silencioso deja leads sin atender durante días. La pregunta útil no es "¿se puede automatizar esto con Zapier?", casi siempre se puede, sino "¿quién se entera cuando falla y quién sabe arreglarlo?". Este artículo propone criterios de diseño para automatizaciones mantenibles y señales claras de cuándo pasar a código.',
  takeaways: [
    'Los disparadores instantáneos basados en webhooks son preferibles al polling cuando la app de origen los ofrece.',
    'Cada automatización debe tener un responsable, un nombre que explique qué hace y documentación mínima.',
    'Diseña cada flujo para tolerar datos incompletos y ejecuciones repetidas: filtrar en la entrada y buscar antes de crear.',
    'Configura alertas de error: un zap que falla en silencio es peor que no tener automatización.',
    'Cuando la lógica crece o el volumen dispara el costo por tarea, un servicio propio suele ser más barato y confiable.',
  ],
  sections: [
    {
      id: 'zap-problema',
      title: 'El problema: automatizaciones que nadie entiende',
      html: `<p>El no-code democratizó la integración de sistemas: una persona de operaciones puede conectar el formulario de la web con el CRM sin esperar al equipo técnico. Pero esa facilidad también elimina las barreras que en el software tradicional obligan a pensar el diseño: no hay revisión de código, ni pruebas automáticas, ni control de versiones obligatorio. Cada zap se crea para resolver un problema puntual y el sistema completo nunca se diseña.</p>
<p>Los síntomas son reconocibles: registros duplicados en el CRM, mensajes de WhatsApp enviados dos veces, campos vacíos que rompen pasos posteriores, flujos desactivados que nadie notó y una factura mensual que crece sin que nadie sepa qué zap consume más tareas. Nada de esto es culpa de la herramienta. Es la consecuencia de tratar la automatización como configuración y no como lo que es: lógica de negocio en producción.</p>`,
    },
    {
      id: 'zap-webhooks',
      title: 'Webhooks frente a polling',
      html: `<p>Muchos disparadores de Zapier funcionan por <strong>polling</strong>: cada cierto intervalo, que depende del plan contratado, consultan la app de origen para ver si hay datos nuevos. Eso introduce minutos de retraso. Los disparadores <strong>instantáneos</strong> se basan en webhooks: la app de origen notifica a Zapier en el momento en que ocurre el evento. Y si la app no tiene integración nativa, <em>Webhooks by Zapier</em> ofrece una URL propia (Catch Hook) a la que tu sistema puede enviar eventos directamente.</p>
${articleTable(
  ['Tipo de disparador', 'Latencia', 'Cuándo usarlo', 'Limitación'],
  [
    ['Polling de una integración', 'Minutos, según el plan', 'Procesos que toleran retraso: reportes, sincronizaciones', 'Retraso variable y consultas constantes'],
    ['Instantáneo (webhook nativo)', 'Segundos', 'Leads nuevos, citas, pagos', 'Solo si la app de origen lo soporta'],
    ['Catch Hook de Webhooks by Zapier', 'Segundos', 'Sistemas propios que pueden enviar HTTP', 'Debes definir y documentar el formato del payload'],
    ['Programado (Schedule)', 'El intervalo que definas', 'Tareas periódicas: resúmenes diarios, limpiezas', 'No reacciona a eventos'],
  ]
)}
<p>Para flujos sensibles al tiempo, como responder a un lead nuevo o confirmar una cita, la diferencia entre segundos y minutos se nota en la conversión. Para un reporte semanal, el polling es perfectamente aceptable.</p>`,
    },
    {
      id: 'zap-diseno',
      title: 'Diseñar un flujo robusto',
      html: '<p>Un flujo robusto asume que los datos llegarán incompletos, que algún paso fallará y que, en algún momento, el mismo evento llegará dos veces. Tres prácticas cubren la mayoría de esos casos.</p>',
      subsections: [
        {
          id: 'zap-filtrar',
          title: 'Validar y normalizar en la entrada',
          html: `<p>Coloca un paso de filtro inmediatamente después del disparador para descartar registros sin los datos mínimos (por ejemplo, un lead sin correo ni teléfono). Normaliza formatos antes de que lleguen al destino: correos en minúsculas, teléfonos solo con dígitos, nombres sin espacios sobrantes. Un paso de <em>Code by Zapier</em> resuelve esto en pocas líneas.</p>
${articleCode(`
// Code by Zapier (JavaScript): normalizar un lead antes de enviarlo al CRM
const email = (inputData.email || "").trim().toLowerCase();
const phone = (inputData.phone || "").replace(/\\D/g, "");

if (!email && !phone) {
  // Detener el flujo con un error visible en el historial de Zapier
  throw new Error("Lead sin email ni teléfono: no se envía al CRM");
}

output = {
  email,
  phone,
  source: inputData.source || "desconocido",
};`)}`,
        },
        {
          id: 'zap-buscar',
          title: 'Buscar antes de crear',
          html: '<p>Si un flujo crea registros, usa primero una acción de búsqueda (o la opción "find or create" que ofrecen muchas integraciones) para comprobar si el contacto o el pedido ya existe. Es la forma no-code de la idempotencia: si el disparador se ejecuta dos veces, el segundo intento actualiza en lugar de duplicar. Cuando tu sistema envía eventos a un Catch Hook, incluye un identificador único del evento para poder detectar repeticiones.</p>',
        },
        {
          id: 'zap-alertas',
          title: 'Alertas y responsables',
          html: '<p>Activa las notificaciones de error de la cuenta y asegúrate de que lleguen a alguien que pueda actuar, no a un buzón que nadie lee. Para flujos críticos, agrega una ruta de error que avise en el canal del equipo con el dato que falló. Y asigna un responsable a cada flujo: si nadie es dueño de una automatización, nadie la arregla.</p>',
        },
      ],
      after: flowDiagram(
        ['Evento\n(webhook)', 'Filtro y\nnormalización', 'Buscar\no crear', 'Acción en\nel destino', 'Alerta si\nalgo falla'],
        'Anatomía de una automatización mantenible'
      ),
    },
    {
      id: 'zap-orden',
      title: 'Orden, nombres y documentación',
      html: `<p>Nombra cada zap con un patrón consistente que diga origen, evento y destino, por ejemplo <code>[Ventas] Formulario web → Lead en CRM + aviso por WhatsApp</code>. Agrúpalos en carpetas por área de negocio y mantén un inventario simple (una hoja de cálculo basta) con qué hace cada flujo, quién es su responsable, qué cuentas usa y de qué otros flujos depende.</p>
<p>Evita las cadenas donde un zap dispara otro que dispara otro: son difíciles de depurar, multiplican el consumo de tareas y amplifican cualquier error. Si un proceso necesita varias ramas, es preferible un solo flujo con <em>Paths</em> o un paso de código que tres zaps encadenados. Y usa cuentas de servicio para las conexiones críticas en lugar de la cuenta personal de un empleado: cuando esa persona deja la empresa o cambia su contraseña, los flujos no deberían romperse con ella.</p>`,
    },
    {
      id: 'zap-codigo',
      title: 'Cuándo pasar a código',
      html: `<p>El no-code es ideal para validar un proceso rápido y para flujos lineales de bajo volumen. Hay señales claras de que un flujo ya superó a la herramienta: el costo por tarea crece con el volumen hasta superar lo que costaría un servicio propio, la lógica tiene tantas ramas y pasos de código que nadie la entiende en el editor visual, necesitas pruebas automáticas y control de versiones, o el proceso maneja datos sensibles que preferirías no pasar por un tercero.</p>
${compareDiagram(
  { title: 'Zapier (no-code)', points: ['Listo en horas', 'Sin servidores que mantener', 'Costo crece con cada tarea', 'Difícil de probar y versionar'] },
  { title: 'Servicio propio', points: ['Días de desarrollo inicial', 'Requiere despliegue y monitoreo', 'Costo casi fijo con el volumen', 'Pruebas, Git y revisión de código'] },
  'El mismo flujo, dos formas de operarlo'
)}
<p>Migrar no tiene que ser todo o nada. Un patrón que funciona bien es mover la lógica compleja a una función serverless o a un endpoint propio y dejar en Zapier solo las conexiones con apps que no tienen buena API. Así cada herramienta hace lo que mejor sabe hacer.</p>`,
    },
    {
      id: 'zap-errores',
      title: 'Errores comunes al automatizar con no-code',
      html: `<ul>
  <li><strong>No probar con datos reales y extremos.</strong> Un flujo probado solo con el registro de ejemplo falla con el primer nombre con tilde, el primer campo vacío o el primer teléfono con prefijo internacional.</li>
  <li><strong>Encadenar zaps.</strong> Cada eslabón es un punto de fallo y un consumo extra de tareas; un error al inicio se propaga sin control.</li>
  <li><strong>Ignorar el historial de ejecuciones.</strong> Zapier registra cada ejecución y su error; revisarlo periódicamente detecta fallos antes que los clientes.</li>
  <li><strong>Conectar con cuentas personales.</strong> Cuando el empleado se va o cambia su contraseña, todos los flujos que dependen de su sesión se rompen.</li>
  <li><strong>Enviar más datos de los necesarios.</strong> Cada campo que pasa por un tercero es un riesgo de privacidad; transmite solo lo que el destino necesita.</li>
</ul>`,
    },
    {
      id: 'zap-cuando-no',
      title: 'Cuándo NO automatizar',
      html: `<p>Automatizar un proceso que todavía cambia cada semana solo congela el desorden. Si el equipo aún no está de acuerdo en cómo se califica un lead o qué pasa después de una cita, primero hay que definir el proceso a mano; la automatización viene después. Tampoco conviene automatizar tareas que ocurren pocas veces al mes y requieren criterio humano: el tiempo de construir y mantener el flujo supera el ahorro.</p>
<p>Por último, hay procesos donde un error automático cuesta más que la demora manual: reembolsos, cambios en datos médicos o financieros, mensajes masivos a clientes. En esos casos, una automatización que prepara el trabajo y deja la aprobación final a una persona suele ser el equilibrio correcto.</p>`,
    },
  ],
  faqs: [
    {
      q: '¿Zapier, Make o n8n?',
      a: 'Zapier tiene el catálogo de integraciones más amplio y la curva de aprendizaje más suave. Make permite flujos visuales más complejos, a menudo a menor costo. n8n puede autoalojarse y da más control técnico, a cambio de operar el servidor.',
    },
    {
      q: '¿Es seguro pasar datos de clientes por Zapier?',
      a: 'Revisa qué datos realmente necesitas transmitir, limita los permisos de cada conexión y verifica los requisitos de cumplimiento de tu sector, por ejemplo en salud o finanzas, antes de enviar datos sensibles.',
    },
    {
      q: '¿Cómo pruebo un zap sin afectar datos reales?',
      a: 'Usa cuentas o registros de prueba en las apps conectadas y la función de prueba de cada paso antes de activar el flujo. Para flujos críticos, mantén una copia desactivada como entorno de pruebas.',
    },
    {
      q: '¿Cómo evito registros duplicados?',
      a: 'Busca antes de crear, usa acciones de tipo find or create cuando existan y, si el origen es tu propio sistema, envía un identificador único por evento para detectar repeticiones.',
    },
    {
      q: '¿Cómo sé qué zap consume más tareas?',
      a: 'El historial y el panel de uso de la cuenta muestran el consumo por flujo. Revisarlo cada mes ayuda a detectar flujos mal filtrados o encadenados que gastan tareas sin aportar valor.',
    },
  ],
  refs: [
    { label: 'Zapier — Webhooks by Zapier', url: 'https://zapier.com/apps/webhook/integrations' },
    { label: 'Zapier — Code by Zapier', url: 'https://zapier.com/apps/code/integrations' },
    { label: 'Zapier Help Center', url: 'https://help.zapier.com' },
    { label: 'n8n Docs', url: 'https://docs.n8n.io' },
    { label: 'Enterprise Integration Patterns', note: 'Gregor Hohpe y Bobby Woolf (libro): patrones clásicos de integración entre sistemas' },
  ],
  closing: '¿Quieres automatizar procesos de tu negocio? Hablemos.',
});

const TRACKING_CONTENT = buildArticle({
  prefix: 'trk',
  intro:
    'Un negocio que invierte en Google Ads y Meta Ads toma decisiones con los datos de conversión: qué campaña escalar, qué anuncio apagar, cuánto pagar por un cliente. Si la medición está rota, se optimizan campañas sobre números falsos, y los algoritmos de las plataformas aprenden de señales incompletas. Con los bloqueadores de anuncios, las restricciones de cookies de los navegadores y los banners de consentimiento, depender solo del píxel en el navegador ya no es suficiente. Este artículo explica cómo combinar un data layer bien diseñado, Google Tag Manager, GA4 y la API de Conversiones de Meta para medir con fiabilidad, sin contar doble y respetando el consentimiento.',
  takeaways: [
    'Un data layer bien definido es la base: la aplicación describe los eventos una vez y GTM los distribuye a cada plataforma.',
    'La API de Conversiones envía eventos desde el servidor y recupera conversiones que el píxel del navegador pierde.',
    'Píxel y API deben compartir el mismo nombre de evento y un <code>event_id</code> para que Meta deduplique y no cuente doble.',
    'El consentimiento del usuario debe respetarse en todos los canales, incluido el envío desde el servidor.',
    'Ninguna implementación está terminada hasta validarla con las herramientas de depuración y compararla con los datos reales del negocio.',
  ],
  sections: [
    {
      id: 'trk-problema',
      title: 'Por qué el píxel del navegador ya no es suficiente',
      html: `<p>El modelo clásico de medición consiste en cargar en la página los scripts de cada plataforma (la etiqueta de Google, el píxel de Meta) y dejar que cada uno registre lo que ocurre. Ese modelo depende por completo del navegador del usuario, y el navegador es cada vez menos confiable como fuente de datos: los bloqueadores impiden que los scripts carguen, Safari limita la vida de las cookies de primera parte creadas por JavaScript, y los usuarios que rechazan el consentimiento no deben ser rastreados con cookies publicitarias.</p>
<p>El resultado es que una parte de las conversiones reales nunca llega a las plataformas. Para el reporte eso ya es un problema, pero el daño mayor está en la optimización: Meta y Google usan esas conversiones para decidir a quién mostrar los anuncios. Menos señales significa un algoritmo que aprende peor y un costo por adquisición más alto.</p>`,
    },
    {
      id: 'trk-datalayer',
      title: 'Diseñar el data layer',
      html: `<p>El error más común en medición es configurar las etiquetas leyendo el DOM: "cuando se haga clic en un botón con el texto Reservar". Ese tipo de reglas se rompe con cualquier cambio de diseño o de copy, y nadie se entera hasta que los números caen. La alternativa es que la aplicación empuje eventos explícitos al <code>dataLayer</code>, con nombres y parámetros acordados, en el momento exacto en que ocurren.</p>
${articleCode(`
// Al confirmar una compra, la aplicación describe el evento una sola vez
const eventId = crypto.randomUUID();   // se comparte con el servidor

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ ecommerce: null });   // limpia el objeto anterior
window.dataLayer.push({
  event: "purchase",
  event_id: eventId,
  ecommerce: {
    transaction_id: "PED-10482",
    value: 120.0,
    currency: "USD",
    items: [{ item_id: "SKU-22", item_name: "Plan anual", price: 120.0, quantity: 1 }],
  },
});`)}
<p>Usar los nombres de eventos recomendados por GA4 (<code>purchase</code>, <code>generate_lead</code>, <code>sign_up</code>) ahorra trabajo, porque los informes de la plataforma los reconocen. El data layer se convierte así en un contrato entre desarrollo y marketing: desarrollo garantiza que los eventos existen con sus parámetros; marketing decide en GTM a qué plataformas enviarlos.</p>`,
    },
    {
      id: 'trk-arquitectura',
      title: 'Arquitectura: navegador y servidor',
      html: '<p>Una implementación robusta combina dos canales que se complementan: el navegador, que captura el contexto de la sesión, y el servidor, que captura los hechos del negocio con certeza.</p>',
      subsections: [
        {
          id: 'trk-gtm',
          title: 'Google Tag Manager en el navegador',
          html: '<p>GTM escucha los eventos del data layer y dispara las etiquetas correspondientes: el evento de GA4, el píxel de Meta, la conversión de Google Ads. Centralizar todo ahí evita scripts sueltos en el código y permite cambiar la configuración sin desplegar la aplicación.</p>',
        },
        {
          id: 'trk-capi',
          title: 'La API de Conversiones de Meta',
          html: '<p>La Conversions API (CAPI) envía los eventos directamente desde tu servidor a Meta. No depende del navegador, así que no la afectan los bloqueadores. Para que Meta pueda atribuir la conversión a una persona, el evento incluye parámetros de coincidencia: correo y teléfono normalizados y con hash SHA-256, dirección IP, user agent y los identificadores de las cookies <code>_fbp</code> y <code>_fbc</code> cuando existen.</p>',
        },
        {
          id: 'trk-sgtm',
          title: 'GTM del lado del servidor (opcional)',
          html: '<p>Un contenedor de server-side GTM recibe los eventos del navegador en un subdominio propio y los reenvía a cada plataforma. Centraliza el envío desde servidor y da más control sobre qué datos salen, a cambio de operar y pagar un servidor adicional. No es obligatorio: tu propio backend puede llamar a CAPI directamente.</p>',
        },
      ],
      after: flowDiagram(
        ['Acción del\nusuario', 'dataLayer\n+ event_id', 'Píxel (GTM)\ny servidor', 'Meta recibe\nambos eventos', 'Deduplica\npor event_id'],
        'Un evento, dos canales, una sola conversión'
      ),
    },
    {
      id: 'trk-dedup',
      title: 'Deduplicación de eventos',
      html: `<p>Si envías la misma compra por el píxel y por CAPI sin coordinarlos, Meta la contará dos veces. La deduplicación funciona cuando ambos eventos comparten el mismo nombre (<code>Purchase</code>) y el mismo identificador: <code>eventID</code> en el píxel y <code>event_id</code> en la API. Por eso el identificador se genera una sola vez y viaja por ambos caminos.</p>
${articleCode(`
// Servidor (Node): envío del mismo evento a la API de Conversiones
import { createHash } from "node:crypto";

const sha256 = (value) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

const payload = {
  data: [{
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,                       // el mismo que recibió el píxel
    action_source: "website",
    event_source_url: "https://www.ejemplo.com/checkout/gracias",
    user_data: {
      em: [sha256(order.email)],
      client_ip_address: req.ip,
      client_user_agent: req.headers["user-agent"],
      fbp: req.cookies._fbp,
      fbc: req.cookies._fbc,
    },
    custom_data: { currency: "USD", value: 120.0 },
  }],
};

await fetch("https://graph.facebook.com/" + API_VERSION + "/" + PIXEL_ID + "/events?access_token=" + TOKEN, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});`)}
${articleTable(
  ['Canal', 'Afectado por bloqueadores', 'Fortaleza', 'Debilidad'],
  [
    ['Píxel de Meta en el navegador', 'Sí', 'Contexto de la sesión y cookies', 'Pierde eventos con bloqueadores y restricciones'],
    ['API de Conversiones', 'No', 'Hechos confirmados por el negocio', 'Requiere backend y buenos datos de coincidencia'],
    ['GA4 en el navegador', 'Sí', 'Análisis de comportamiento y embudos', 'Subestima conversiones si hay bloqueo o rechazo'],
    ['Server-side GTM', 'Parcialmente', 'Control centralizado de lo que se envía', 'Servidor adicional que operar y pagar'],
  ]
)}`,
    },
    {
      id: 'trk-consentimiento',
      title: 'Consentimiento y privacidad',
      html: `<p>Enviar eventos desde el servidor no es una forma de saltarse el consentimiento. Si el usuario rechazó las cookies publicitarias, esa decisión aplica también a lo que tu backend envía a Meta. La implementación correcta guarda el estado de consentimiento y lo consulta antes de cada envío.</p>
<p>En el ecosistema de Google, el modo de consentimiento (Consent Mode) ajusta el comportamiento de las etiquetas según las señales <code>ad_storage</code>, <code>analytics_storage</code>, <code>ad_user_data</code> y <code>ad_personalization</code>, y se integra con las plataformas de gestión de consentimiento más comunes. Además, los datos personales nunca viajan en claro: correo y teléfono se normalizan y se hashean antes de enviarse, y conviene revisar con el área legal qué exige la normativa aplicable, como la Ley 1581 de 2012 en Colombia o el RGPD en Europa.</p>`,
    },
    {
      id: 'trk-validar',
      title: 'Validar antes de confiar',
      html: '<p>Usa el modo de vista previa de GTM para confirmar que cada etiqueta se dispara con los parámetros correctos, DebugView de GA4 para ver los eventos en tiempo real y la herramienta de eventos de prueba del administrador de eventos de Meta para comprobar que llegan los eventos del navegador y del servidor y que se deduplican. Revisa también la calidad de coincidencia de eventos que reporta Meta: si es baja, faltan parámetros de usuario. Y, sobre todo, compara cada cierto tiempo las conversiones medidas con las reales del negocio (pedidos en la base de datos, leads en el CRM). Una diferencia moderada es normal; una grande indica un problema de implementación.</p>',
    },
    {
      id: 'trk-errores',
      title: 'Errores comunes en la medición',
      html: `<ul>
  <li><strong>Etiquetas que dependen de textos o clases CSS.</strong> Se rompen en silencio con cualquier rediseño; usa eventos explícitos del data layer.</li>
  <li><strong>Enviar el evento por ambos canales sin <code>event_id</code>.</strong> Meta cuenta doble y las campañas parecen rendir mejor de lo que rinden.</li>
  <li><strong>Hashear datos sin normalizarlos.</strong> Un correo con mayúsculas o espacios produce otro hash y no coincide con ningún usuario.</li>
  <li><strong>Disparar la compra en la página de gracias.</strong> Recargarla vuelve a contar la conversión; deduplica por ID de transacción o envía desde el servidor al confirmar el pago.</li>
  <li><strong>Ignorar el consentimiento en el servidor.</strong> Es un riesgo legal y de reputación, no un truco de medición.</li>
</ul>`,
    },
    {
      id: 'trk-limites',
      title: 'Límites: lo que la API de Conversiones no resuelve',
      html: '<p>CAPI recupera señales, pero no convierte la medición en una verdad absoluta. La atribución sigue siendo un modelo: cada plataforma se atribuye conversiones con sus propias reglas y ventanas, y la suma de lo que reportan Google y Meta casi siempre supera las ventas reales. Tampoco compensa un sitio con problemas de producto o de oferta. Y si tu negocio tiene pocas conversiones, el esfuerzo de un backend de medición puede no justificarse frente a una implementación de navegador limpia más la comparación periódica con el CRM. La regla práctica es invertir en medición en proporción al presupuesto publicitario que esa medición va a dirigir.</p>',
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
      a: 'Sí. Meta exige que correo, teléfono y otros identificadores se envíen normalizados y con hash SHA-256 en la API de Conversiones. La IP y el user agent se envían sin hash.',
    },
    {
      q: '¿Qué es la calidad de coincidencia de eventos?',
      a: 'Es una puntuación del administrador de eventos de Meta que indica qué tan bien puede asociar tus eventos de servidor con personas. Mejora al enviar más parámetros de usuario válidos, como correo, teléfono, fbp y fbc.',
    },
    {
      q: '¿Puedo enviar solo por CAPI y quitar el píxel?',
      a: 'Es posible, pero se pierde contexto del navegador que ayuda a la atribución. La configuración recomendada por Meta es usar ambos canales con deduplicación.',
    },
  ],
  refs: [
    { label: 'Meta — Conversions API', url: 'https://developers.facebook.com/docs/marketing-api/conversions-api' },
    { label: 'Meta — Deduplicación de eventos del píxel y del servidor', url: 'https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events' },
    { label: 'GA4 — Eventos recomendados', url: 'https://developers.google.com/analytics/devguides/collection/ga4/reference/events' },
    { label: 'Google Tag Manager — Server-side', url: 'https://developers.google.com/tag-platform/tag-manager/server-side' },
    { label: 'Google — Modo de consentimiento', url: 'https://developers.google.com/tag-platform/security/guides/consent' },
    { label: 'GA4 — DebugView', url: 'https://support.google.com/analytics/answer/7201382' },
  ],
  closing: '¿Tus campañas no cuadran con tus ventas? Puedo auditar tu medición.',
});

const SEO_CONTENT = buildArticle({
  prefix: 'seo',
  intro:
    'Un equipo de marketing puede escribir el mejor contenido del sector y aun así no posicionar si el sitio entrega HTML vacío, carga lento o no describe sus páginas a los buscadores. Esa parte del SEO es responsabilidad del desarrollador, y casi siempre es la más barata de corregir: no requiere producir contenido nuevo, solo dejar de esconder el que ya existe. La pregunta útil no es "¿qué palabras clave usamos?", sino "¿puede Google rastrear, renderizar y entender cada página importante del sitio?". Este artículo recorre lo que un desarrollador controla: renderizado, rastreo, metadatos, datos estructurados y Core Web Vitals.',
  takeaways: [
    'Si el contenido solo aparece tras ejecutar JavaScript, la indexación se vuelve más lenta e incierta; SSR o generación estática eliminan ese riesgo.',
    'Cada página necesita su propio title, meta description, URL canónica y metadatos Open Graph.',
    'Los datos estructurados en JSON-LD ayudan a los buscadores a entender negocios, productos, artículos y eventos.',
    'Core Web Vitals (LCP, INP y CLS) son medibles con datos reales de usuarios y mejorables desde el código.',
    'El SEO técnico es condición necesaria, no suficiente: sin contenido útil y enlaces, ningún ajuste de código posiciona una página.',
  ],
  sections: [
    {
      id: 'seo-problema',
      title: 'La parte del SEO que vive en el código',
      html: `<p>Para aparecer en los resultados, una página atraviesa tres etapas en Google: rastreo (el bot descubre y descarga la URL), renderizado (procesa el HTML y, si hace falta, ejecuta el JavaScript) e indexación (analiza el contenido y decide si lo guarda y para qué búsquedas es relevante). El ranking ocurre después, cuando alguien busca. Las tres primeras etapas dependen casi por completo de decisiones técnicas.</p>
${flowDiagram(['Rastreo\n(Googlebot)', 'Renderizado\ndel HTML y JS', 'Indexación\ndel contenido', 'Ranking en\ncada búsqueda'], 'El camino de una URL hasta los resultados')}
<p>Un sitio puede fallar en cualquiera de ellas sin que nadie lo note: un <code>robots.txt</code> que bloquea una carpeta importante, una SPA que entrega un <code>div</code> vacío, una etiqueta canonical que apunta a la portada desde todas las páginas, o un servidor que responde 200 a páginas inexistentes. Ninguno de estos errores se ve en el navegador del equipo, pero todos se ven en Search Console.</p>`,
    },
    {
      id: 'seo-rastreo',
      title: 'Rastreo, renderizado e indexación',
      html: '<p>Antes de pensar en metadatos, hay que asegurar que el buscador puede llegar a cada página y ver su contenido. Estas son las decisiones que más pesan.</p>',
      subsections: [
        {
          id: 'seo-render',
          title: 'Elegir la estrategia de renderizado',
          html: `<p>Google puede ejecutar JavaScript, pero el renderizado se procesa en una fase posterior al rastreo, consume más recursos y no todos los buscadores ni las redes sociales lo hacen. Si el contenido importante está en el HTML inicial, eliminas esa incertidumbre.</p>
${articleTable(
  ['Estrategia', 'HTML inicial', 'Riesgo para SEO', 'Caso típico'],
  [
    ['CSR (SPA pura)', 'Casi vacío', 'Alto: depende del renderizado de JavaScript', 'Paneles privados que no deben indexarse'],
    ['SSR (renderizado por petición)', 'Completo', 'Bajo', 'Contenido dinámico o personalizado: catálogos, búsquedas'],
    ['SSG (generación estática)', 'Completo', 'Muy bajo', 'Blogs, landing pages, documentación'],
    ['ISR o regeneración incremental', 'Completo', 'Bajo', 'Sitios grandes con contenido que cambia de vez en cuando'],
  ]
)}`,
        },
        {
          id: 'seo-robots',
          title: 'robots.txt, sitemap y canonical',
          html: '<p>El <code>robots.txt</code> controla qué puede rastrearse, no qué se indexa: para excluir una página del índice se usa <code>noindex</code>, y la página debe poder rastrearse para que el bot vea esa instrucción. El sitemap XML lista las URLs que quieres indexar, con fechas de modificación reales. La etiqueta canonical indica cuál es la versión principal cuando la misma página existe con varias URLs (con y sin parámetros, con y sin barra final).</p>',
        },
        {
          id: 'seo-estados',
          title: 'Códigos de estado y redirecciones',
          html: '<p>Una página inexistente debe responder 404, no 200 con un mensaje de "no encontrado" (lo que Google llama soft 404). Los cambios de URL permanentes usan redirecciones 301 directas, sin cadenas de varios saltos. En una SPA esto exige configurar el servidor o el framework para que devuelva el código correcto, porque el enrutador del cliente siempre responde 200.</p>',
        },
      ],
    },
    {
      id: 'seo-meta',
      title: 'Metadatos y Open Graph',
      html: `<p>El <code>title</code> y la meta description influyen en cómo aparece la página en los resultados y, por tanto, en cuántas personas hacen clic. Cada página necesita los suyos, únicos y descriptivos; un mismo título repetido en todo el sitio desperdicia la oportunidad. Las etiquetas Open Graph controlan la tarjeta que se muestra al compartir un enlace en redes y mensajería: título, descripción e imagen, idealmente de 1200 × 630 píxeles y con URL absoluta.</p>
${articleCode(`
<head>
  <title>Odontología estética en Medellín | Clínica Ejemplo</title>
  <meta name="description" content="Diseño de sonrisa, blanqueamiento y ortodoncia invisible. Agenda tu valoración en línea." />
  <link rel="canonical" href="https://www.ejemplo.com/servicios/odontologia-estetica" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Odontología estética en Medellín" />
  <meta property="og:description" content="Diseño de sonrisa, blanqueamiento y ortodoncia invisible." />
  <meta property="og:url" content="https://www.ejemplo.com/servicios/odontologia-estetica" />
  <meta property="og:image" content="https://www.ejemplo.com/og/odontologia-estetica.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
</head>`)}
<p>En aplicaciones con React, estos metadatos deben generarse en el servidor junto con el HTML. Si se inyectan desde el cliente, las redes sociales, que no ejecutan JavaScript al generar la vista previa, mostrarán los valores por defecto de la plantilla.</p>`,
    },
    {
      id: 'seo-schema',
      title: 'Datos estructurados con schema.org',
      html: `<p>Un bloque JSON-LD describe la entidad principal de la página en un vocabulario que los buscadores entienden: <code>LocalBusiness</code> o subtipos como <code>Dentist</code> para un negocio físico, <code>Product</code>, <code>Article</code>, <code>Event</code> o <code>BreadcrumbList</code>. No garantiza resultados enriquecidos, pero es requisito para optar a ellos y ayuda a desambiguar la información del negocio.</p>
${articleCode(`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Clínica Ejemplo",
  "url": "https://www.ejemplo.com",
  "telephone": "+57-604-000-0000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle 10 # 40-20",
    "addressLocality": "Medellín",
    "addressCountry": "CO"
  },
  "openingHours": "Mo-Fr 08:00-18:00"
}
</script>`)}
<p>Dos reglas: los datos estructurados deben describir contenido que el usuario ve en la página, y conviene validarlos con la prueba de resultados enriquecidos de Google. También vale la pena seguir los cambios de Google: desde 2023, por ejemplo, los resultados enriquecidos de preguntas frecuentes se muestran solo para un grupo reducido de sitios gubernamentales y de salud con autoridad reconocida.</p>`,
    },
    {
      id: 'seo-vitals',
      title: 'Core Web Vitals desde el código',
      html: `<p>Las Core Web Vitals miden la experiencia real de los usuarios con tres métricas, evaluadas en el percentil 75 de las visitas. <strong>LCP</strong> (Largest Contentful Paint) mide cuánto tarda en aparecer el contenido principal; el umbral "bueno" es 2,5 segundos o menos. <strong>INP</strong> (Interaction to Next Paint), que reemplazó a FID en 2024, mide la rapidez de respuesta a las interacciones; bueno es 200 ms o menos. <strong>CLS</strong> (Cumulative Layout Shift) mide los saltos visuales; bueno es 0,1 o menos.</p>
<p>Las correcciones más rentables suelen ser las mismas: servir la imagen principal en formato moderno, con dimensiones correctas y sin carga diferida (la carga diferida es para lo que está bajo el pliegue); declarar <code>width</code> y <code>height</code> en imágenes y reservar espacio para anuncios o banners que cargan tarde; y reducir el JavaScript que bloquea el hilo principal, dividiendo el código y retrasando scripts de terceros. Mide con datos de campo (el informe de Search Console o PageSpeed Insights) y no solo con una ejecución de Lighthouse en tu computador.</p>`,
    },
    {
      id: 'seo-errores',
      title: 'Errores comunes de SEO técnico',
      html: `<ul>
  <li><strong>Bloquear recursos en robots.txt.</strong> Si el bot no puede descargar el CSS o el JavaScript, no puede renderizar la página como la ve el usuario.</li>
  <li><strong>Canonical mal configurada.</strong> Apuntar todas las páginas a la portada, o a URLs que redirigen, le dice a Google que ignore el contenido.</li>
  <li><strong>Navegación con botones en lugar de enlaces.</strong> Los bots siguen <code>&lt;a href&gt;</code>; un <code>onClick</code> que cambia de ruta no es un enlace rastreable.</li>
  <li><strong>Olvidar el <code>noindex</code> del entorno de pruebas.</strong> Publicar producción con la etiqueta de staging, o indexar staging por no tenerla, son dos caras del mismo error.</li>
  <li><strong>Lazy loading en la imagen principal.</strong> Retrasa justo el elemento que mide el LCP.</li>
  <li><strong>Migrar sin redirecciones.</strong> Cambiar la estructura de URLs sin 301 descarta la autoridad acumulada de cada página.</li>
</ul>`,
    },
    {
      id: 'seo-limites',
      title: 'Límites: lo que el SEO técnico no resuelve',
      html: '<p>Un sitio técnicamente impecable no posiciona si su contenido no responde lo que la gente busca o si nadie lo enlaza. El SEO técnico elimina obstáculos; no crea demanda ni autoridad. Tampoco conviene obsesionarse con llevar Lighthouse a 100: pasar de 92 a 100 rara vez cambia algo en el negocio, mientras que corregir una canonical rota o un LCP de cinco segundos sí. La regla que aplico es priorizar por impacto: primero que todo lo importante sea rastreable e indexable, después que cumpla los umbrales de Core Web Vitals, y solo entonces pulir detalles. Lo demás es trabajo de contenido, producto y marca.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Google indexa sitios hechos con React?',
      a: 'Puede hacerlo, pero el renderizado de JavaScript se procesa en una fase posterior y no siempre de forma completa. Para páginas que deben posicionar, SSR o generación estática es más seguro.',
    },
    {
      q: '¿Las meta keywords sirven?',
      a: 'No. Google las ignora desde hace años. Concéntrate en title, description, contenido útil y datos estructurados.',
    },
    {
      q: '¿Necesito un sitemap?',
      a: 'Es muy recomendable, sobre todo en sitios con muchas páginas o contenido nuevo frecuente. Envíalo en Google Search Console junto con un robots.txt correcto.',
    },
    {
      q: '¿Los datos estructurados mejoran el ranking?',
      a: 'No son un factor de ranking directo. Ayudan a que el buscador entienda la página y la hacen elegible para resultados enriquecidos, que pueden mejorar la tasa de clics.',
    },
    {
      q: '¿Qué herramienta uso para empezar?',
      a: 'Google Search Console: muestra qué páginas están indexadas, cuáles tienen problemas, el informe de Core Web Vitals con datos reales y las búsquedas que traen tráfico.',
    },
  ],
  refs: [
    { label: 'Google Search Central — Documentación', url: 'https://developers.google.com/search/docs' },
    { label: 'Google — Conceptos básicos de JavaScript SEO', url: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics' },
    { label: 'web.dev — Core Web Vitals', url: 'https://web.dev/articles/vitals' },
    { label: 'schema.org', url: 'https://schema.org' },
    { label: 'Prueba de resultados enriquecidos', url: 'https://search.google.com/test/rich-results' },
    { label: 'The Open Graph protocol', url: 'https://ogp.me' },
  ],
  closing: '¿Tu sitio no aparece en Google? Puedo revisar su SEO técnico.',
});

const DOCKER_CONTENT = buildArticle({
  prefix: 'dk',
  intro:
    'Configurar un proyecto nuevo no debería tomar una tarde instalando la versión correcta de Node, PostgreSQL y Redis, ni depender de que el sistema operativo de cada desarrollador se comporte igual. Docker empaqueta la aplicación con todo lo que necesita y Docker Compose levanta el stack completo con un solo comando. Bien usado, también hace que desarrollo y producción se parezcan mucho más. Mal usado, produce imágenes de varios gigabytes, builds lentos y contenedores que corren como root con secretos adentro. La pregunta útil no es "¿usamos Docker?", sino "¿puede una persona nueva levantar el proyecto con un comando y obtener lo mismo que corre en producción?". Este artículo explica cómo lograrlo.',
  takeaways: [
    'Una imagen describe el entorno como código: cualquiera la construye y obtiene el mismo resultado.',
    'El orden de las instrucciones del Dockerfile determina cuánto se reutiliza la caché de capas en cada build.',
    'Los multi-stage builds separan la compilación de la ejecución y reducen drásticamente el tamaño de la imagen final.',
    'Docker Compose define base de datos, caché y aplicación en un solo archivo para desarrollo local.',
    'No ejecutes como root, no metas secretos en la imagen y usa imágenes base oficiales, pequeñas y con versión fija.',
  ],
  sections: [
    {
      id: 'dk-problema',
      title: 'El problema: "en mi máquina funciona"',
      html: `<p>La mayoría de los problemas de entorno no son bugs del código, sino diferencias invisibles: una versión distinta de Node, una librería del sistema que falta, una base de datos local configurada con otra codificación, variables de entorno que alguien definió hace meses y olvidó documentar. Cada diferencia es pequeña, pero juntas hacen que incorporar a una persona nueva tome días y que algunos errores solo aparezcan en el servidor.</p>
<p>Un contenedor resuelve esto empaquetando la aplicación con su sistema de archivos, sus dependencias y su configuración en una imagen inmutable. Esa imagen se construye a partir de un Dockerfile versionado junto al código, así que el entorno deja de ser conocimiento tribal y pasa a ser código revisable.</p>
${flowDiagram(['Dockerfile\nversionado', 'docker build', 'Imagen\ninmutable', 'Registro de\nimágenes', 'Contenedor en\ncualquier host'], 'Del código a un entorno reproducible')}`,
    },
    {
      id: 'dk-capas',
      title: 'Imágenes, capas y caché',
      html: `<p>Cada instrucción del Dockerfile crea una capa, y Docker reutiliza las capas cuyo contenido de entrada no cambió. En cuanto una capa cambia, todas las posteriores se reconstruyen. Por eso el orden importa: lo que cambia poco va primero y lo que cambia mucho, al final.</p>
<p>En un proyecto de Node, eso significa copiar primero <code>package.json</code> y el lockfile, instalar dependencias y solo después copiar el código fuente. Así, editar una línea de código reutiliza la capa de dependencias y el build tarda segundos en lugar de minutos. El mismo principio aplica a Python con <code>requirements.txt</code> o a cualquier gestor de paquetes. Un <code>.dockerignore</code> bien escrito completa la estrategia: excluir <code>node_modules</code>, <code>.git</code>, archivos <code>.env</code> y artefactos de build reduce el contexto que se envía al builder y evita invalidar la caché por archivos irrelevantes.</p>`,
    },
    {
      id: 'dk-multistage',
      title: 'Multi-stage builds',
      html: `<p>Compilar una aplicación requiere herramientas que no hacen falta para ejecutarla: compiladores, dependencias de desarrollo, el código fuente de TypeScript. Un multi-stage build usa varias etapas en el mismo Dockerfile: las primeras compilan y la última parte de una imagen limpia y copia solo el resultado.</p>
${articleCode(`
# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`)}
${compareDiagram(
  { title: 'Una sola etapa', points: ['Incluye compiladores y devDeps', 'Copia todo el código fuente', 'Imagen grande y lenta de mover', 'Mayor superficie de ataque'] },
  { title: 'Multi-stage', points: ['Solo dependencias de producción', 'Copia únicamente el build', 'Imagen pequeña y rápida', 'Menos paquetes que parchear'] },
  'Qué termina dentro de la imagen final'
)}
<p>La imagen oficial de Node incluye un usuario sin privilegios llamado <code>node</code>; la instrucción <code>USER node</code> hace que el proceso no corra como root.</p>`,
    },
    {
      id: 'dk-compose',
      title: 'Docker Compose para desarrollo local',
      html: '<p>Un archivo <code>compose.yaml</code> declara todos los servicios que la aplicación necesita y cómo se conectan. Una persona nueva clona el repositorio, copia el archivo de variables de ejemplo y ejecuta <code>docker compose up</code>.</p>',
      subsections: [
        {
          id: 'dk-servicios',
          title: 'Servicios y red',
          html: `<p>Compose crea una red privada en la que cada servicio es accesible por su nombre: la aplicación se conecta a la base de datos en <code>db:5432</code>, no en <code>localhost</code>. Con <code>depends_on</code> y un <code>healthcheck</code>, la aplicación espera a que PostgreSQL esté realmente listo para aceptar conexiones, no solo a que su contenedor haya arrancado.</p>
${articleCode(`
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 5

  redis:
    image: redis:7-alpine

volumes:
  db-data:`)}`,
        },
        {
          id: 'dk-volumenes',
          title: 'Volúmenes: datos que sobreviven',
          html: '<p>Un contenedor es efímero: al eliminarlo, se pierde lo que escribió en su sistema de archivos. Los volúmenes con nombre, como <code>db-data</code>, persisten los datos de la base entre reinicios. Los bind mounts, que montan una carpeta del host, sirven en desarrollo para que los cambios en el código se reflejen sin reconstruir la imagen.</p>',
        },
        {
          id: 'dk-variables',
          title: 'Variables de entorno',
          html: '<p>La configuración que cambia entre entornos (URLs, credenciales, banderas) se inyecta al ejecutar el contenedor, nunca se escribe en la imagen. Versiona un <code>.env.example</code> con valores ficticios y deja el <code>.env</code> real fuera de Git y del contexto de build.</p>',
        },
      ],
    },
    {
      id: 'dk-seguridad',
      title: 'Buenas prácticas de seguridad',
      html: `<p>Un contenedor no es una caja fuerte: comparte el kernel del host y hereda las vulnerabilidades de todo lo que contiene la imagen. Estas prácticas reducen el riesgo con poco esfuerzo.</p>
${articleTable(
  ['Práctica', 'Riesgo que evita', 'Cómo aplicarla'],
  [
    ['Usuario sin privilegios', 'Que un fallo en la app dé acceso root dentro del contenedor', 'Instrucción <code>USER</code> en la etapa final'],
    ['Secretos fuera de la imagen', 'Credenciales expuestas en capas que cualquiera puede inspeccionar', 'Variables en tiempo de ejecución o secretos del orquestador'],
    ['Imagen base mínima y oficial', 'Paquetes innecesarios con vulnerabilidades conocidas', 'Variantes <code>slim</code> o <code>alpine</code> de imágenes oficiales'],
    ['Versiones fijas', 'Builds que cambian sin aviso al publicarse una nueva versión', 'Etiquetas concretas, como <code>node:22-alpine</code>, o digest'],
    ['Escaneo de vulnerabilidades', 'Desplegar dependencias con fallos conocidos', 'Docker Scout, Trivy o el escáner del registro en CI'],
  ]
)}`,
    },
    {
      id: 'dk-errores',
      title: 'Errores comunes con Docker',
      html: `<ul>
  <li><strong>Copiar todo antes de instalar dependencias.</strong> Cualquier cambio de código invalida la caché y reinstala todo en cada build.</li>
  <li><strong>No tener <code>.dockerignore</code>.</strong> El <code>node_modules</code> del host, el historial de Git y los <code>.env</code> terminan dentro de la imagen.</li>
  <li><strong>Usar <code>latest</code> como versión.</strong> El mismo Dockerfile produce imágenes distintas según el día en que se construya.</li>
  <li><strong>Conectarse a <code>localhost</code> desde un contenedor.</strong> Dentro del contenedor, localhost es el propio contenedor; los demás servicios se alcanzan por su nombre.</li>
  <li><strong>Guardar datos sin volumen.</strong> Al recrear el contenedor de la base de datos, los datos desaparecen.</li>
  <li><strong>Pasar secretos como <code>ARG</code> o <code>ENV</code> en el build.</strong> Quedan registrados en el historial de la imagen.</li>
</ul>`,
    },
    {
      id: 'dk-cuando-no',
      title: 'Cuándo NO usar Docker',
      html: '<p>Docker añade una capa de abstracción que no siempre se paga. Si despliegas en una plataforma que ya construye tu aplicación a partir del código (Vercel, Netlify o servicios similares para sitios estáticos y funciones serverless), un Dockerfile es trabajo duplicado. En macOS y Windows, los contenedores corren dentro de una máquina virtual, y los bind mounts con muchos archivos pueden hacer lento el desarrollo; a veces es más productivo correr la aplicación nativa y usar Docker solo para la base de datos y la caché. Y en un script personal o un prototipo de una tarde, el costo de contenerizar supera el beneficio. La regla práctica es contenerizar lo que otras personas deben levantar o lo que se despliega en servidores propios, y no forzarlo donde la plataforma ya resuelve el problema.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Docker reemplaza a una máquina virtual?',
      a: 'No exactamente. Los contenedores comparten el kernel del sistema anfitrión, por eso son mucho más ligeros y rápidos de arrancar, pero ofrecen menos aislamiento que una VM completa.',
    },
    {
      q: '¿Necesito Kubernetes si uso Docker?',
      a: 'No. Muchas aplicaciones funcionan perfectamente con contenedores en un solo servidor o en servicios administrados de contenedores. Kubernetes tiene sentido cuando orquestas muchos servicios a escala.',
    },
    {
      q: '¿Por qué mi imagen pesa más de 1 GB?',
      a: 'Suele deberse a una imagen base completa, dependencias de desarrollo incluidas o archivos copiados sin .dockerignore. Un multi-stage build con una imagen slim o alpine lo reduce mucho.',
    },
    {
      q: '¿Alpine siempre es la mejor base?',
      a: 'No siempre. Alpine usa musl en lugar de glibc, y algunas dependencias nativas, sobre todo en Python, compilan peor o se comportan distinto. Las variantes slim basadas en Debian son una alternativa pequeña y más compatible.',
    },
    {
      q: '¿Uso el mismo Dockerfile en desarrollo y producción?',
      a: 'Puede ser el mismo archivo con etapas distintas: una etapa de desarrollo con herramientas y recarga en caliente, y una etapa final de producción mínima. Compose puede apuntar a la etapa de desarrollo con la opción target.',
    },
  ],
  refs: [
    { label: 'Docker Docs — Building best practices', url: 'https://docs.docker.com/build/building/best-practices/' },
    { label: 'Docker Docs — Multi-stage builds', url: 'https://docs.docker.com/build/building/multi-stage/' },
    { label: 'Docker Docs — Dockerfile reference', url: 'https://docs.docker.com/reference/dockerfile/' },
    { label: 'Docker Compose', url: 'https://docs.docker.com/compose/' },
    { label: 'Docker Engine — Security', url: 'https://docs.docker.com/engine/security/' },
  ],
  closing: '¿Quieres contenerizar tu proyecto? Puedo ayudarte a configurarlo.',
});

const CICD_CONTENT = buildArticle({
  prefix: 'ci',
  intro:
    'Si cada despliegue depende de que alguien recuerde ejecutar los tests, compilar y subir archivos al servidor, tarde o temprano algo se rompe en producción. No por falta de cuidado, sino porque los procesos manuales se ejecutan distinto cada vez y se saltan pasos cuando hay prisa. La integración continua (CI) valida automáticamente cada cambio; el despliegue continuo (CD) lo lleva a los entornos de forma repetible. La pregunta útil no es "¿tenemos un pipeline?", sino "¿puede llegar a producción un cambio que no compila o que rompe los tests?". Este artículo muestra cómo construir con GitHub Actions un pipeline que responda "no" a esa pregunta, sin volverse lento ni inseguro.',
  takeaways: [
    'CI valida cada pull request (lint, tipos, tests y build) antes de que llegue a la rama principal, y la protección de rama lo hace obligatorio.',
    'La caché de dependencias, los trabajos en paralelo y la cancelación de ejecuciones obsoletas mantienen el pipeline rápido.',
    'Los secretos viven en GitHub Secrets o en entornos protegidos, nunca en el YAML, y el <code>GITHUB_TOKEN</code> recibe solo los permisos que necesita.',
    'OIDC permite autenticarse en la nube sin guardar credenciales de larga duración.',
    'Separar staging y producción con aprobaciones y tener un rollback rápido reduce el riesgo de cada despliegue.',
  ],
  sections: [
    {
      id: 'ci-problema',
      title: 'Por qué automatizar la integración y el despliegue',
      html: `<p>Un despliegue manual concentra riesgo en el peor momento: al final del día, con presión por entregar y con una sola persona que sabe los pasos. Si esa persona no está, nadie despliega; si se equivoca, el error llega directo a los usuarios. Además, cuando los tests solo se corren "cuando alguien se acuerda", su valor cae rápidamente: nadie confía en una suite que lleva semanas en rojo.</p>
<p>Un pipeline automatizado cambia la dinámica. Cada cambio pasa por los mismos pasos, en el mismo orden, en una máquina limpia. Los errores aparecen en el pull request, minutos después de escribirlos, cuando todavía es barato corregirlos. Y el despliegue deja de ser un evento para convertirse en una consecuencia de fusionar código revisado.</p>
${flowDiagram(['Pull request', 'CI: lint, tipos,\ntests y build', 'Merge a main', 'Despliegue\na staging', 'Aprobación y\nproducción'], 'Cada cambio recorre el mismo camino')}`,
    },
    {
      id: 'ci-pipeline',
      title: 'Un pipeline mínimo útil',
      html: '<p>Un workflow es un archivo YAML en <code>.github/workflows/</code>. Define cuándo se ejecuta (los disparadores), en qué máquina (el runner) y qué pasos sigue. Este es un punto de partida sólido para un proyecto de Node:</p>',
      subsections: [
        {
          id: 'ci-disparadores',
          title: 'Disparadores y trabajos',
          html: `${articleCode(`
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test
      - run: npm run build`)}
<p>El workflow corre en cada pull request y en cada push a <code>main</code>. El bloque <code>permissions</code> limita el token automático a solo lectura, y <code>concurrency</code> cancela la ejecución anterior de la misma rama cuando llega un commit nuevo, así no se gastan minutos validando código que ya cambió.</p>`,
        },
        {
          id: 'ci-orden',
          title: 'El orden de los pasos',
          html: '<p>Ordena los pasos de más rápido a más lento: el lint y la verificación de tipos fallan en segundos y ahorran esperar la suite de tests completa. Usa <code>npm ci</code> en lugar de <code>npm install</code>: instala exactamente lo que dice el lockfile y falla si no coincide con <code>package.json</code>, lo que hace el build determinista.</p>',
        },
        {
          id: 'ci-proteccion',
          title: 'Protección de rama',
          html: '<p>Un pipeline que se puede ignorar no protege nada. Configura la protección de la rama <code>main</code> (o un ruleset del repositorio) para exigir que el workflow pase y que haya al menos una revisión aprobada antes de fusionar. Desde ese momento, el pipeline deja de ser una sugerencia.</p>',
        },
      ],
    },
    {
      id: 'ci-velocidad',
      title: 'Velocidad: caché, paralelismo y concurrencia',
      html: `<p>Un pipeline lento es un pipeline que el equipo intenta saltarse. La opción <code>cache</code> de <code>actions/setup-node</code> guarda la caché del gestor de paquetes usando el lockfile como clave, de modo que las ejecuciones siguientes descargan mucho menos. Para otros lenguajes existen opciones equivalentes en sus acciones de setup o la acción genérica <code>actions/cache</code>.</p>
<p>Si los tests tardan, divide el trabajo en jobs independientes que corren en paralelo (por ejemplo, lint y tipos en uno, tests unitarios en otro, tests end-to-end en un tercero) o usa una matriz para repartir la suite. Y ejecuta solo lo necesario: los filtros <code>paths</code> evitan correr el pipeline del backend cuando solo cambió la documentación.</p>`,
    },
    {
      id: 'ci-secretos',
      title: 'Secretos y permisos',
      html: `<p>Las credenciales nunca se escriben en el YAML: se guardan como secretos del repositorio, de la organización o de un entorno, y se referencian con <code>\${{ secrets.NOMBRE }}</code>. GitHub las oculta en los logs, pero eso no reemplaza el criterio: no imprimas secretos ni los pases a scripts que no controlas.</p>
${articleTable(
  ['Mecanismo', 'Vida de la credencial', 'Alcance', 'Cuándo usarlo'],
  [
    ['Secreto de repositorio', 'Larga, hasta que se rote', 'Todos los workflows del repositorio', 'Tokens de servicios sin soporte OIDC'],
    ['Secreto de entorno', 'Larga, hasta que se rote', 'Solo jobs que usan ese entorno', 'Credenciales de producción con aprobación previa'],
    ['OIDC (federación de identidad)', 'Minutos, emitida por ejecución', 'Definido por la política del proveedor de nube', 'Despliegues a AWS, Azure o Google Cloud'],
    ['<code>GITHUB_TOKEN</code>', 'Solo durante el job', 'El repositorio, según <code>permissions</code>', 'Operaciones sobre el propio repositorio'],
  ]
)}
<p>Dos prácticas más cierran los huecos habituales: fijar las acciones de terceros a un SHA de commit completo (una etiqueta puede moverse a otro código) y declarar <code>permissions</code> explícitos en cada workflow para que el token automático tenga el mínimo privilegio.</p>`,
    },
    {
      id: 'ci-entornos',
      title: 'Despliegue por entornos',
      html: `<p>Un esquema que funciona para la mayoría de equipos: desplegar automáticamente a staging al fusionar en <code>main</code> y a producción tras una aprobación manual o al crear una etiqueta de versión. Los entornos de GitHub permiten exigir revisores, limitar qué ramas pueden desplegar y tener secretos distintos por entorno.</p>
${articleCode(`
  deploy-production:
    needs: verify
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production        # exige aprobación si el entorno la tiene configurada
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}`)}
<p>Ten siempre un camino rápido de rollback: volver a desplegar la versión anterior debe ser un botón o un comando, no una investigación. Si el artefacto de cada versión (una imagen de contenedor, un build) se guarda con su etiqueta, revertir es cuestión de minutos.</p>`,
    },
    {
      id: 'ci-errores',
      title: 'Errores comunes en pipelines de CI/CD',
      html: `<ul>
  <li><strong>Permisos por defecto amplios.</strong> Sin un bloque <code>permissions</code>, el token puede tener más acceso del necesario según la configuración de la organización.</li>
  <li><strong>Usar <code>pull_request_target</code> sin entenderlo.</strong> Corre con acceso a secretos; combinarlo con el checkout del código de un fork permite que código externo los lea.</li>
  <li><strong>Acciones de terceros sin fijar.</strong> Referenciar <code>@main</code> o una etiqueta mutable ejecuta código que puede cambiar sin aviso.</li>
  <li><strong>Tests inestables tolerados.</strong> Un test que falla "a veces" entrena al equipo a reintentar sin leer; arréglalo o ponlo en cuarentena.</li>
  <li><strong>Desplegar desde la máquina de alguien.</strong> Si existe un camino manual que se salta el pipeline, tarde o temprano se usará en una urgencia.</li>
</ul>`,
    },
    {
      id: 'ci-cuando-no',
      title: 'Cuándo NO hace falta un pipeline complejo',
      html: '<p>Un pipeline es software y también se mantiene. En un proyecto personal, un prototipo o un sitio estático que una plataforma como Vercel o Netlify ya despliega en cada push, basta con un workflow corto que corra lint y build en los pull requests. Matrices de versiones, despliegues multientorno y aprobaciones tienen sentido cuando hay usuarios reales, varias personas fusionando código o requisitos de auditoría. La regla que aplico es empezar con lo mínimo que bloquee errores evidentes (que compile, que pasen los tests) y agregar etapas solo cuando un incidente real o el tamaño del equipo las justifique.</p>',
    },
  ],
  faqs: [
    {
      q: '¿GitHub Actions es gratis?',
      a: 'Los repositorios públicos tienen uso gratuito de los runners estándar y los privados incluyen una cuota mensual de minutos según el plan. Revisa la página de facturación de GitHub para los límites actuales.',
    },
    {
      q: '¿Necesito Actions si uso Vercel o Netlify?',
      a: 'Esas plataformas ya despliegan en cada push. Actions sigue siendo útil para tests, lint y validaciones que deben pasar antes de fusionar.',
    },
    {
      q: '¿Cómo depuro un workflow que falla?',
      a: 'Revisa los logs de cada paso, reproduce los comandos en local y habilita el registro de depuración del runner con los secretos ACTIONS_STEP_DEBUG o ACTIONS_RUNNER_DEBUG si necesitas más detalle.',
    },
    {
      q: '¿Qué es OIDC y por qué es más seguro?',
      a: 'Es un mecanismo en el que GitHub emite un token de identidad por ejecución y el proveedor de nube lo intercambia por credenciales temporales. No hay claves de larga duración guardadas que puedan filtrarse.',
    },
    {
      q: '¿Runners de GitHub o runners propios?',
      a: 'Los alojados por GitHub son la opción por defecto: limpios en cada ejecución y sin mantenimiento. Los propios tienen sentido para hardware especial o acceso a redes privadas, pero no deben usarse con repositorios públicos.',
    },
  ],
  refs: [
    { label: 'GitHub Actions — Documentación', url: 'https://docs.github.com/en/actions' },
    { label: 'Security hardening for GitHub Actions', url: 'https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions' },
    { label: 'About protected branches', url: 'https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches' },
    { label: 'actions/setup-node', url: 'https://github.com/actions/setup-node' },
    { label: 'Continuous Delivery', note: 'Jez Humble y David Farley (libro): fundamentos de pipelines de despliegue' },
  ],
  closing: '¿Tu equipo sigue desplegando a mano? Automaticémoslo.',
});

const POWERBI_CONTENT = buildArticle({
  prefix: 'bi',
  intro:
    'Es tentador cargar en Power BI una gran tabla plana exportada del ERP y empezar a construir gráficos. Funciona hasta que los datos crecen, los filtros dan resultados extraños, los totales no cuadran con contabilidad y cada medida nueva necesita un parche. En ese punto el equipo suele culpar al DAX, pero el problema casi nunca está en las fórmulas: está en el modelo. La pregunta útil no es "¿qué fórmula arregla este total?", sino "¿qué representa cada fila de cada tabla?". Este artículo explica cómo aplicar el esquema en estrella en Power BI para ganar velocidad, simplificar las medidas y conseguir números en los que el negocio confíe.',
  takeaways: [
    'Las tablas de hechos guardan eventos medibles a una granularidad definida; las dimensiones describen el contexto: quién, qué, cuándo y dónde.',
    'Relaciones de uno a varios desde las dimensiones hacia los hechos, con filtro en una sola dirección, hacen el modelo predecible.',
    'Una tabla de fechas dedicada y marcada como tal habilita la inteligencia de tiempo en DAX.',
    'Las medidas explícitas son preferibles a las columnas calculadas para agregaciones: se evalúan según el contexto y no ocupan memoria por fila.',
    'Transforma los datos lo más cerca posible de la fuente y deja a DAX solo la lógica analítica.',
  ],
  sections: [
    {
      id: 'bi-problema',
      title: 'El problema de la tabla plana',
      html: `<p>Una tabla plana mezcla en cada fila el evento (una venta) con todos sus atributos descriptivos (nombre del cliente, ciudad, categoría del producto, vendedor). Parece cómodo porque todo está a mano, pero tiene costos que crecen con los datos: los atributos se repiten millones de veces, el archivo pesa más, y combinar una segunda fuente (por ejemplo, presupuestos o devoluciones) obliga a fusionar tablas planas con granularidades distintas, que es exactamente donde nacen los totales inflados.</p>
<p>El esquema en estrella, propuesto por Ralph Kimball para los data warehouses, separa los hechos de sus descripciones. Power BI está optimizado para ese diseño: su motor columnar (VertiPaq) comprime mucho mejor columnas con pocos valores distintos, y el modelo de filtros de DAX funciona de forma natural cuando los filtros fluyen de las dimensiones hacia los hechos.</p>
${compareDiagram(
  { title: 'Tabla plana', points: ['Atributos repetidos en cada fila', 'Difícil combinar varias fuentes', 'Medidas llenas de excepciones', 'Archivo pesado y lento'] },
  { title: 'Esquema en estrella', points: ['Hechos delgados, dimensiones aparte', 'Dimensiones compartidas', 'Medidas simples y reutilizables', 'Mejor compresión en VertiPaq'] },
  'El mismo dato, dos formas de modelarlo'
)}`,
    },
    {
      id: 'bi-estrella',
      title: 'Hechos y dimensiones',
      html: '<p>Una tabla de hechos contiene una fila por evento del negocio, con claves hacia las dimensiones y valores numéricos que se suman o promedian. Las dimensiones contienen los atributos por los que se filtra y agrupa. El diseño correcto empieza por tres decisiones.</p>',
      subsections: [
        {
          id: 'bi-granularidad',
          title: 'Definir la granularidad',
          html: '<p>La granularidad es la respuesta a "¿qué representa exactamente una fila?": una línea de factura, una factura completa, el saldo diario de inventario por producto y bodega. Debe definirse antes que nada y ser la misma para toda la tabla. Mezclar granularidades, como líneas de factura con costos de envío por factura, es la causa más frecuente de totales duplicados.</p>',
        },
        {
          id: 'bi-dimensiones',
          title: 'Dimensiones anchas y descriptivas',
          html: '<p>Una buena dimensión tiene una fila por entidad (un cliente, un producto) y todas las columnas que el negocio usa para analizar: segmento, ciudad, categoría, subcategoría. Desnormalizar jerarquías dentro de la dimensión (categoría y subcategoría en la misma tabla de productos) es preferible a encadenar varias tablas pequeñas en un esquema de copo de nieve, que complica el modelo sin mejorar el rendimiento.</p>',
        },
        {
          id: 'bi-claves',
          title: 'Claves y dimensiones de rol',
          html: '<p>Cada dimensión necesita una clave única, idealmente un entero. Cuando una tabla de hechos tiene varias fechas (pedido, envío, entrega), la misma dimensión de fecha cumple varios roles: una relación queda activa y las demás se activan en medidas concretas con <code>USERELATIONSHIP</code>, o se crean copias de la dimensión para cada rol.</p>',
        },
      ],
    },
    {
      id: 'bi-relaciones',
      title: 'Relaciones bien definidas',
      html: `<p>Cada dimensión se relaciona con la tabla de hechos mediante una relación de uno a varios, con el filtro propagándose en una sola dirección: de la dimensión hacia los hechos. Si dos tablas de hechos comparten dimensiones (ventas y presupuesto, por ejemplo), ambas se conectan a las mismas dimensiones, nunca directamente entre sí.</p>
${articleTable(
  ['Tipo de relación', 'Cuándo usarla', 'Riesgo'],
  [
    ['Uno a varios, filtro único', 'Siempre como opción por defecto: dimensión → hechos', 'Ninguno relevante: es el diseño esperado'],
    ['Uno a varios, filtro bidireccional', 'Casos puntuales, como filtrar una dimensión por los hechos existentes', 'Ambigüedad y resultados difíciles de explicar; peor rendimiento'],
    ['Varios a varios', 'Granularidades distintas, como presupuesto mensual frente a ventas diarias', 'Totales inesperados si no se entiende la propagación'],
    ['Uno a uno', 'Rara vez justificada', 'Suele indicar que dos tablas deberían ser una sola'],
  ]
)}
<p>Si necesitas filtrar en la dirección contraria solo en un cálculo, es mejor hacerlo dentro de la medida con <code>CROSSFILTER</code> que dejar la relación bidireccional para todo el modelo.</p>`,
    },
    {
      id: 'bi-fechas-medidas',
      title: 'Tabla de fechas y medidas explícitas',
      html: `<p>La inteligencia de tiempo de DAX (<code>TOTALYTD</code>, <code>SAMEPERIODLASTYEAR</code>, <code>DATEADD</code>) necesita una tabla de calendario continua, sin huecos, que cubra todo el rango de los datos y esté marcada como tabla de fechas. Sobre ella se construyen medidas base sencillas y, a partir de ellas, las comparaciones.</p>
${articleCode(`
Calendario =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2022, 1, 1 ), DATE ( 2026, 12, 31 ) ),
    "Año", YEAR ( [Date] ),
    "Mes Num", MONTH ( [Date] ),
    "Mes", FORMAT ( [Date], "MMMM" ),
    "Trimestre", "T" & QUARTER ( [Date] )
)

Ventas Totales = SUM ( Ventas[Monto] )

Ventas Año Anterior =
CALCULATE ( [Ventas Totales], SAMEPERIODLASTYEAR ( Calendario[Date] ) )

Variación % =
DIVIDE ( [Ventas Totales] - [Ventas Año Anterior], [Ventas Año Anterior] )`)}
<p>Las medidas se evalúan según el contexto de filtro de cada visual y no ocupan memoria por fila, a diferencia de las columnas calculadas. Construir medidas sobre otras medidas, como <code>Variación %</code> sobre <code>Ventas Totales</code>, garantiza que una corrección en la base se propague a todo. <code>DIVIDE</code> maneja la división por cero sin errores. Organiza las medidas en una tabla dedicada y documenta en su descripción la regla de negocio que implementan.</p>`,
    },
    {
      id: 'bi-transformar',
      title: 'Dónde transformar los datos',
      html: `<p>Una máxima muy citada en la comunidad de Power BI, atribuida a Matthew Roche, lo resume bien: los datos deben transformarse tan arriba como sea posible y tan abajo como sea necesario. Si existe un data warehouse o una base de datos analítica, ese es el lugar para construir hechos y dimensiones. Si no, Power Query es la siguiente opción: limpieza, tipos de datos y combinación de fuentes antes de cargar el modelo. DAX debería quedar para la lógica que depende del contexto del usuario, no para arreglar datos.</p>
${flowDiagram(['Fuentes\n(ERP, CRM)', 'Warehouse o\nPower Query', 'Modelo en\nestrella', 'Medidas\nDAX', 'Reportes'], 'Cada capa con una sola responsabilidad')}`,
    },
    {
      id: 'bi-errores',
      title: 'Errores comunes en modelos de Power BI',
      html: `<ul>
  <li><strong>Relaciones bidireccionales por defecto.</strong> Resuelven un visual y rompen otros tres de formas difíciles de rastrear.</li>
  <li><strong>Usar la jerarquía automática de fechas.</strong> Crea tablas ocultas por cada columna de fecha, infla el modelo y no sirve para análisis entre años fiscales.</li>
  <li><strong>Columnas calculadas para agregaciones.</strong> Aumentan el tamaño del modelo y no responden a los filtros como una medida.</li>
  <li><strong>Medidas implícitas.</strong> Arrastrar una columna numérica a un visual crea una suma automática sin nombre ni documentación; las medidas explícitas son reutilizables y auditables.</li>
  <li><strong>Cargar columnas que nadie usa.</strong> Cada columna de texto con muchos valores distintos, como identificadores o descripciones largas, cuesta memoria y tiempo de actualización.</li>
</ul>`,
    },
    {
      id: 'bi-cuando-no',
      title: 'Cuándo NO hace falta un modelo en estrella',
      html: '<p>Para un análisis exploratorio puntual sobre una sola tabla pequeña, construir dimensiones es sobreingeniería: una tabla plana y unas cuantas medidas bastan para responder la pregunta y seguir adelante. Tampoco tiene sentido modelar en Power BI lo que ya está bien modelado aguas arriba: si el data warehouse expone hechos y dimensiones, el trabajo es conectarse a ellos, no rehacerlos. Y si el reporte necesita datos en tiempo real o volúmenes enormes, la conversación pasa por el modo DirectQuery, agregaciones o la propia base de datos, más allá del diseño del modelo. La regla práctica es que en cuanto un reporte combina más de una fuente, se comparte con otras áreas o se actualiza de forma recurrente, el modelo en estrella deja de ser opcional.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Una tabla plana es siempre mala?',
      a: 'Para un análisis pequeño y puntual puede bastar. En cuanto crecen los datos o se combinan varias fuentes, el esquema en estrella da mejor rendimiento y medidas más simples.',
    },
    {
      q: '¿Dónde transformo los datos, en Power Query o en la base de datos?',
      a: 'Cuanto más cerca de la fuente, mejor. Si tienes un data warehouse, prepara allí el modelo; si no, Power Query es una buena opción para limpiar y dar forma antes de cargar.',
    },
    {
      q: '¿Por qué mis totales no coinciden con la suma de las filas?',
      a: 'Normalmente por el contexto de filtro de la medida, por granularidades mezcladas o por relaciones ambiguas. Revisa la dirección de los filtros y prueba la medida en una tabla simple para aislar el problema.',
    },
    {
      q: '¿Copo de nieve o estrella?',
      a: 'En Power BI, estrella casi siempre. Desnormalizar las jerarquías dentro de cada dimensión reduce relaciones, simplifica el DAX y facilita a los usuarios encontrar los campos.',
    },
    {
      q: '¿Cómo creo la tabla de fechas?',
      a: 'Con DAX, usando CALENDAR o CALENDARAUTO, o en Power Query, o desde el data warehouse. Lo importante es que sea continua, cubra todo el rango de datos y esté marcada como tabla de fechas.',
    },
  ],
  refs: [
    { label: 'Microsoft Learn — Understand star schema and the importance for Power BI', url: 'https://learn.microsoft.com/en-us/power-bi/guidance/star-schema' },
    { label: 'Microsoft Learn — Model relationships in Power BI Desktop', url: 'https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-relationships-understand' },
    { label: 'Microsoft Learn — Date tables in Power BI Desktop', url: 'https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-date-tables' },
    { label: 'DAX Guide', url: 'https://dax.guide' },
    { label: 'The Data Warehouse Toolkit', note: 'Ralph Kimball y Margy Ross (libro): la referencia clásica del modelado dimensional' },
  ],
  closing: '¿Tus reportes tardan o no cuadran? Puedo revisar tu modelo de datos.',
});

const PROMPTS_CONTENT = buildArticle({
  prefix: 'pr',
  intro:
    'Probar un prompt en una interfaz de chat y obtener una buena respuesta es el inicio, no el final. En una aplicación, ese prompt se ejecutará miles de veces con entradas que nadie anticipó, cada respuesta debe poder procesarse por código, y cada llamada cuesta dinero y tiempo. Además, el texto que llega de usuarios o de documentos externos puede intentar cambiar el comportamiento del modelo. La pregunta útil no es "¿funciona este prompt?", sino "¿cómo sé que sigue funcionando después del próximo cambio?". Este artículo trata el prompt como lo que es en producción: una pieza de software que se diseña, se valida, se evalúa, se versiona y se protege.',
  takeaways: [
    'Instrucciones explícitas, datos delimitados y un formato de salida definido reducen la variabilidad de las respuestas.',
    'Las salidas estructuradas en JSON, validadas contra un esquema, permiten procesar cada respuesta por código y detectar fallos.',
    'Un conjunto de evaluación con casos reales es la única forma de saber si un cambio de prompt o de modelo mejora o empeora.',
    'El costo y la latencia se controlan con el tamaño del contexto, la elección del modelo y la caché, no con prompts más cortos a ciegas.',
    'Todo texto del usuario o de fuentes externas puede intentar manipular el modelo: trátalo como no confiable y limita lo que el modelo puede hacer.',
  ],
  sections: [
    {
      id: 'pr-problema',
      title: 'Del chat a producción: qué cambia',
      html: `<p>En el chat, una persona lee la respuesta, la interpreta y corrige el rumbo con un segundo mensaje. En producción no hay nadie en medio: la respuesta va directo a una base de datos, a una interfaz o a otro sistema. Un modelo que en el 95 % de los casos responde perfecto y en el 5 % agrega una frase de cortesía antes del JSON rompe el parser cientos de veces al día.</p>
<p>También cambian las entradas. En las pruebas usamos ejemplos limpios; los usuarios reales escriben con errores, en otros idiomas, pegan documentos enormes o intentan deliberadamente que el sistema haga otra cosa. Y cambian las consecuencias: una respuesta inventada en un chat de prueba es una anécdota; en un sistema que responde a clientes, es un problema de reputación. Por eso el trabajo serio con LLM se parece más a la ingeniería de software que a la redacción.</p>`,
    },
    {
      id: 'pr-estructura',
      title: 'Estructura de un buen prompt',
      html: '<p>Un prompt de producción no es un párrafo inspirado, es una especificación. Estas son sus partes y por qué importa cada una.</p>',
      subsections: [
        {
          id: 'pr-rol',
          title: 'Tarea, contexto y criterios',
          html: '<p>Define qué debe hacer el modelo, para quién y con qué criterio de calidad. "Clasifica este mensaje" es ambiguo; "clasifica el mensaje de un cliente de una clínica en una de estas cuatro categorías, según el motivo principal, aunque mencione varios" deja menos espacio a la interpretación. Explica el porqué de las reglas importantes: los modelos generalizan mejor cuando entienden la intención.</p>',
        },
        {
          id: 'pr-delimitar',
          title: 'Separar instrucciones de datos',
          html: '<p>El texto que viene del usuario o de un documento debe ir claramente delimitado, por ejemplo con etiquetas XML, para que el modelo distinga entre lo que debe obedecer y lo que debe procesar. Indica también qué hacer cuando falta información: responder "desconocido", pedir un dato o abstenerse. Sin esa instrucción, el modelo tiende a rellenar los huecos.</p>',
        },
        {
          id: 'pr-ejemplos',
          title: 'Ejemplos (few-shot)',
          html: '<p>Dos o tres ejemplos de entrada y salida esperada suelen mejorar más la consistencia que párrafos extra de instrucciones. Elige ejemplos variados, que incluyan al menos un caso difícil, y cuida que no compartan un patrón accidental (como que todos sean de la misma categoría) que el modelo pueda copiar.</p>',
        },
      ],
      after: articleCode(`
Eres un asistente que clasifica mensajes de clientes de una clínica odontológica.

Tarea: asigna al mensaje UNA categoría según su motivo principal.
Categorías: "agendar", "facturacion", "queja", "otro".
Si el mensaje menciona varios temas, elige el que requiere acción primero.
Si no puedes determinarlo, usa "otro". No inventes datos que no estén en el mensaje.

Responde solo con JSON válido con esta forma:
{"categoria": "...", "urgencia": "baja" | "media" | "alta", "resumen": "máximo 20 palabras"}

<ejemplo>
Mensaje: "Me cobraron dos veces la limpieza del martes"
Respuesta: {"categoria": "facturacion", "urgencia": "media", "resumen": "Cobro duplicado de una limpieza"}
</ejemplo>

<mensaje>
{{texto_del_cliente}}
</mensaje>`),
    },
    {
      id: 'pr-json',
      title: 'Salidas estructuradas y validación',
      html: `<p>Si tu código necesita procesar la respuesta, pide JSON y, cuando el proveedor lo ofrezca, usa sus funciones de salida estructurada o de herramientas (tool calling), que restringen la respuesta a un esquema. Aun así, valida siempre: el esquema garantiza la forma, no que el contenido tenga sentido. Define también qué ocurre cuando la validación falla: reintentar, usar un valor por defecto o enviar el caso a una persona.</p>
${articleCode(`
from typing import Literal
from pydantic import BaseModel, Field, ValidationError

class Clasificacion(BaseModel):
    categoria: Literal["agendar", "facturacion", "queja", "otro"]
    urgencia: Literal["baja", "media", "alta"]
    resumen: str = Field(max_length=200)

def clasificar(texto: str, intentos: int = 2) -> Clasificacion | None:
    for _ in range(intentos):
        respuesta = llamar_modelo(PROMPT, texto)   # devuelve el JSON como texto
        try:
            return Clasificacion.model_validate_json(respuesta)
        except ValidationError:
            continue                                # reintento acotado
    return None                                     # se envía a revisión humana`)}
<p>El esquema cumple una segunda función: documenta el contrato entre el modelo y el resto del sistema. Si mañana alguien agrega una categoría, el cambio se ve en el código, se revisa y se evalúa.</p>`,
    },
    {
      id: 'pr-eval',
      title: 'Evaluación sistemática',
      html: `<p>Sin evaluación, cada cambio de prompt es una apuesta: arreglas el caso que te reportaron y rompes otros cinco sin saberlo. La base es un conjunto de evaluación con decenas o cientos de casos reales, incluidos los difíciles, los ambiguos y los adversarios, cada uno con el resultado esperado o un criterio para juzgarlo. Cada vez que cambias el prompt o el modelo, ejecutas el conjunto completo y comparas con la versión anterior.</p>
${flowDiagram(['Cambio de\nprompt o modelo', 'Conjunto de\nevaluación', 'Métricas por\ncaso y totales', 'Comparar con\nla versión previa', 'Desplegar o\ndescartar'], 'Ningún cambio llega a producción sin medirse')}
${articleTable(
  ['Método', 'Cuándo usarlo', 'Costo', 'Limitación'],
  [
    ['Comparación exacta', 'Clasificación y extracción con respuesta única', 'Muy bajo', 'No sirve para texto libre'],
    ['Validación de esquema y reglas', 'Toda salida estructurada', 'Muy bajo', 'Verifica la forma, no la calidad'],
    ['LLM como evaluador', 'Resúmenes, respuestas abiertas, tono', 'Medio', 'Tiene sesgos; hay que calibrarlo con juicios humanos'],
    ['Revisión humana', 'Calibración inicial y casos críticos', 'Alto', 'Lenta y difícil de escalar'],
  ]
)}
<p>Versiona los prompts igual que el código, junto con el modelo y los parámetros con los que se evaluaron. Así puedes volver atrás si la calidad baja y explicar qué cambió entre una versión y otra.</p>`,
    },
    {
      id: 'pr-costos',
      title: 'Costos y latencia',
      html: '<p>El costo de un LLM es proporcional a los tokens de entrada y de salida, y la latencia crece sobre todo con los de salida. Las palancas efectivas son concretas: enviar solo el contexto necesario (recuperar los fragmentos relevantes en lugar de documentos completos), limitar la longitud de la respuesta, elegir el modelo más pequeño que supere la evaluación y aprovechar la caché de prompts que ofrecen varios proveedores para prefijos largos que se repiten, como instrucciones y ejemplos. Para tareas que no necesitan respuesta inmediata, las APIs de procesamiento por lotes suelen ser más económicas. La evaluación del apartado anterior es lo que permite bajar de modelo con seguridad: si el modelo pequeño iguala al grande en tu conjunto de casos, la decisión está tomada con datos.</p>',
    },
    {
      id: 'pr-injection',
      title: 'Seguridad: prompt injection',
      html: '<p>La inyección de prompts encabeza el OWASP Top 10 para aplicaciones con LLM. Ocurre cuando un texto que el modelo procesa, ya sea el mensaje del usuario o un documento, una página web o un correo recuperado, contiene instrucciones que el modelo termina obedeciendo. No existe una defensa perfecta, así que la estrategia es limitar el daño: dar al modelo solo las herramientas y permisos que necesita, validar sus salidas antes de ejecutar cualquier acción, no exponer secretos en el prompt, separar claramente instrucciones de datos y exigir confirmación humana para operaciones con impacto, como enviar dinero, borrar datos o escribir a clientes. La pregunta de diseño es: si el modelo fuera manipulado por completo, ¿qué es lo peor que podría hacer? Esa respuesta define los controles.</p>',
    },
    {
      id: 'pr-errores',
      title: 'Errores comunes al llevar prompts a producción',
      html: `<ul>
  <li><strong>Evaluar con tres ejemplos a ojo.</strong> La sensación de que "ahora funciona mejor" no sustituye un conjunto de evaluación.</li>
  <li><strong>Parsear la respuesta sin validarla.</strong> Un <code>json.loads</code> sin esquema ni manejo de errores convierte cada respuesta rara en una excepción en producción.</li>
  <li><strong>Mezclar instrucciones y datos del usuario.</strong> Concatenar el texto del usuario dentro de las instrucciones facilita la inyección y confunde al modelo.</li>
  <li><strong>Cambiar de modelo sin reevaluar.</strong> Un prompt optimizado para un modelo puede comportarse distinto en otro, incluso en una versión nueva del mismo.</li>
  <li><strong>No registrar entradas y salidas.</strong> Sin logs, con la debida protección de datos personales, es imposible depurar un fallo o construir casos de evaluación nuevos.</li>
</ul>`,
    },
    {
      id: 'pr-cuando-no',
      title: 'Cuándo NO usar un LLM',
      html: '<p>Un LLM es la herramienta equivocada cuando el problema tiene una solución determinista: validar un correo, calcular un impuesto, aplicar una regla de negocio fija o buscar un registro exacto. Una expresión regular, una consulta SQL o un árbol de decisiones son más baratos, más rápidos y siempre dan la misma respuesta. Tampoco conviene usarlo como única barrera en decisiones de alto impacto sin supervisión, ni cuando no puedes construir un conjunto de evaluación porque nadie sabe definir qué es una buena respuesta. La regla que aplico es usar el LLM donde aporta algo que el código tradicional no puede, como entender lenguaje natural, resumir o extraer información de texto desordenado, y rodearlo de código determinista para todo lo demás.</p>',
    },
  ],
  faqs: [
    {
      q: '¿Un prompt más largo es mejor?',
      a: 'No necesariamente. Más texto aumenta el costo y puede diluir las instrucciones importantes. Claridad, estructura y buenos ejemplos pesan más que la longitud.',
    },
    {
      q: '¿Cómo reduzco las alucinaciones?',
      a: 'Proporciona el contexto necesario (por ejemplo con RAG), indica que responda solo con esa información y que diga cuando no sabe, y pide que cite el fragmento en que se basa para poder verificarlo.',
    },
    {
      q: '¿Puedo bloquear totalmente el prompt injection?',
      a: 'No existe una defensa perfecta. Se mitiga con permisos mínimos, validación de salidas, separación clara de instrucciones y datos, y supervisión humana en acciones de impacto.',
    },
    {
      q: '¿Cuántos casos necesita un conjunto de evaluación?',
      a: 'Para empezar, unas decenas de casos reales y variados ya detectan regresiones evidentes. Crece con el tiempo: cada fallo reportado en producción debería convertirse en un caso nuevo.',
    },
    {
      q: '¿Temperatura cero garantiza respuestas idénticas?',
      a: 'Reduce mucho la variabilidad, pero no garantiza determinismo absoluto en todos los proveedores. Por eso la validación de la salida sigue siendo necesaria.',
    },
  ],
  refs: [
    { label: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/' },
    { label: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai' },
    { label: 'OpenAI — Structured Outputs', url: 'https://platform.openai.com/docs/guides/structured-outputs' },
    { label: 'Pydantic — Documentación', url: 'https://docs.pydantic.dev' },
    { label: 'Language Models are Few-Shot Learners', note: 'Brown et al., 2020 (artículo que presentó GPT-3 y el aprendizaje few-shot)', url: 'https://arxiv.org/abs/2005.14165' },
  ],
  closing: '¿Quieres llevar un prototipo de IA a producción? Hablemos.',
});

export const EXTRA_WRITING_ARTICLES: WritingArticle[] = [
  {
    id: 'art-typescript-strict',
    slug: 'typescript-strict-tipos-que-evitan-bugs',
    date: 'ABRIL 2026',
    tag: 'TYPESCRIPT',
    title: 'TypeScript en Modo Estricto: Tipos Que Evitan Bugs Antes de Producción',
    metaDescription:
      'Cómo usar strict mode, uniones discriminadas, unknown y validación con Zod para que TypeScript atrape errores reales antes de llegar a producción.',
    excerpt:
      'TypeScript solo protege si lo dejas. Strict mode, uniones discriminadas, unknown en vez de any y validación en los bordes del sistema para atrapar bugs antes de producción.',
    readTime: readTimeOf(TS_STRICT_CONTENT),
    contentHtml: TS_STRICT_CONTENT,
  },
  {
    id: 'art-astro-islas',
    slug: 'astro-arquitectura-de-islas-vs-spa',
    date: 'MARZO 2026',
    tag: 'FRONTEND',
    title: 'Astro y la Arquitectura de Islas: Cuándo Superar a una SPA Tradicional',
    metaDescription:
      'Qué es la arquitectura de islas de Astro, cómo reduce el JavaScript enviado al navegador y cuándo conviene frente a una SPA en React.',
    excerpt:
      'Para sitios de contenido, marketing o clínicas, enviar una SPA entera al navegador es desperdicio. Cómo funcionan las islas de Astro y cuándo elegirlas frente a una SPA en React.',
    readTime: readTimeOf(ASTRO_ISLAS_CONTENT),
    contentHtml: ASTRO_ISLAS_CONTENT,
  },
  {
    id: 'art-stripe-webhooks',
    slug: 'stripe-webhooks-pagos-confiables',
    date: 'FEBRERO 2026',
    tag: 'PAYMENTS',
    title: 'Pagos con Stripe en Producción: Webhooks, Idempotencia y Errores Comunes',
    metaDescription:
      'Cómo integrar Stripe de forma confiable: webhooks como fuente de verdad, verificación de firmas e idempotencia para evitar cobros duplicados.',
    excerpt:
      'Redirigir al usuario tras el checkout no confirma un pago. Cómo usar webhooks firmados, idempotencia y manejo de reintentos para que tu integración con Stripe sea confiable.',
    readTime: readTimeOf(STRIPE_WEBHOOKS_CONTENT),
    contentHtml: STRIPE_WEBHOOKS_CONTENT,
  },
  {
    id: 'art-zapier-automatizacion',
    slug: 'automatizar-negocio-zapier-webhooks',
    date: 'ENERO 2026',
    tag: 'AUTOMATION',
    title: 'Automatizar un Negocio con Zapier y Webhooks Sin Crear un Caos de Integraciones',
    metaDescription:
      'Cómo diseñar automatizaciones con Zapier y webhooks que escalen: cuándo usar no-code y cuándo código, manejo de errores, idempotencia y documentación.',
    excerpt:
      'Zapier conecta miles de apps en minutos, pero sin orden se convierte en una red frágil de flujos que nadie entiende. Cómo diseñar automatizaciones mantenibles y cuándo pasar a código.',
    readTime: readTimeOf(ZAPIER_CONTENT),
    contentHtml: ZAPIER_CONTENT,
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
    readTime: readTimeOf(TRACKING_CONTENT),
    contentHtml: TRACKING_CONTENT,
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
    readTime: readTimeOf(SEO_CONTENT),
    contentHtml: SEO_CONTENT,
  },
  {
    id: 'art-docker-dev',
    slug: 'docker-para-desarrolladores-fullstack',
    date: 'OCTUBRE 2025',
    tag: 'DEVOPS',
    title: 'Docker para Desarrolladores Fullstack: Entornos Reproducibles Sin Dolor',
    metaDescription:
      'Docker y Docker Compose para que tu aplicación funcione igual en cualquier máquina: caché de capas, multi-stage builds, volúmenes y seguridad.',
    excerpt:
      'El clásico "en mi máquina funciona" se acaba con contenedores. Imágenes ligeras, multi-stage builds, Docker Compose para levantar todo el stack y las prácticas que evitan imágenes inseguras.',
    readTime: readTimeOf(DOCKER_CONTENT),
    contentHtml: DOCKER_CONTENT,
  },
  {
    id: 'art-cicd-github-actions',
    slug: 'ci-cd-github-actions-despliegues-seguros',
    date: 'SEPTIEMBRE 2025',
    tag: 'DEVOPS',
    title: 'CI/CD con GitHub Actions: Despliegues Automáticos y Seguros',
    metaDescription:
      'Cómo montar un pipeline de CI/CD con GitHub Actions: lint, tests y build en cada PR, caché de dependencias, secretos, OIDC y despliegues por entorno.',
    excerpt:
      'Desplegar a mano es lento y propenso a errores. Cómo montar un pipeline con GitHub Actions que valide cada cambio, gestione secretos de forma segura y despliegue por entornos.',
    readTime: readTimeOf(CICD_CONTENT),
    contentHtml: CICD_CONTENT,
  },
  {
    id: 'art-powerbi-modelo-estrella',
    slug: 'power-bi-modelo-estrella-dashboards-rapidos',
    date: 'AGOSTO 2025',
    tag: 'DATA / BI',
    title: 'Modelado en Estrella para Power BI: Dashboards Rápidos y Medidas Confiables',
    metaDescription:
      'Por qué el esquema en estrella es la base de un buen modelo en Power BI: tablas de hechos y dimensiones, relaciones, tabla de fechas y medidas DAX.',
    excerpt:
      'Un dashboard lento o con totales que no cuadran casi siempre tiene un modelo de datos mal diseñado. Cómo aplicar el esquema en estrella en Power BI para ganar velocidad y confianza.',
    readTime: readTimeOf(POWERBI_CONTENT),
    contentHtml: POWERBI_CONTENT,
  },
  {
    id: 'art-prompts-produccion',
    slug: 'prompts-llm-en-produccion',
    date: 'JULIO 2025',
    tag: 'AI / LLM',
    title: 'Prompts para LLM en Producción: Del Experimento a un Sistema Confiable',
    metaDescription:
      'Cómo diseñar prompts para aplicaciones reales: salidas estructuradas en JSON, evaluación sistemática, control de costos y defensa ante prompt injection.',
    excerpt:
      'Un prompt que funciona en el chat no está listo para producción. Salidas estructuradas, ejemplos, evaluación sistemática, control de costos y defensa ante prompt injection.',
    readTime: readTimeOf(PROMPTS_CONTENT),
    contentHtml: PROMPTS_CONTENT,
  },
];
