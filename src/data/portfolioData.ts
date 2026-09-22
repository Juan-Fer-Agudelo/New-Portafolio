import { ProjectItem, WritingArticle, ArticleAuthor } from '../types';
import enhanceOg from '../assets/images/enhance-og.jpg';
import miamiBounceOg from '../assets/images/miami-bounce-og.jpg';
import peptidosOg from '../assets/images/peptidos-og.jpg';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'enhance-work',
    number: '01',
    type: 'PLATAFORMA WEB B2B/B2C',
    title: 'Enhance.Work',
    subtitle: 'Plataforma líder de empleos en medicina estética del sur de Florida',
    image: enhanceOg,
    organization: 'Enhance.Work (South Florida, FL)',
    date: 'Julio 2026',
    url: 'https://enhance.work',
    description:
      'Plataforma web B2B/B2C líder de empleos en el sur de Florida para el sector de medicina estética. Permite a profesionales encontrar empleo y a clínicas contratar talento con paneles independientes para Employers y Candidates.',
    details:
      'Plataforma de empleo B2B/B2C de alto rendimiento diseñada especialmente para las personas que viven en el sur de Florida dentro del sector de medicina estética (enhance.work). Ofrece flujos de trabajo e interfaces completamente adaptadas tanto para empleadores (Employers) como para candidatos (Candidates). Construida en el frontend con Astro 6 en modo SSR y React 19 embebido mediante islas interactivas, estilizada con CSS Vanilla puro. Servidor backend en Express 5 actuando con middleware de Astro SSR. Sistema de autenticación con express-session y bcryptjs, base de datos relacional PostgreSQL (cliente pg) y almacenamiento de archivos e imágenes en Replit Object Storage. Integraciones con Stripe para cobros y suscripciones, Resend para correos transaccionales y Google Sheets API para sincronización de datos.',
    installCode: 'https://enhance.work',
    githubUrl: 'https://enhance.work',
    techStack: [
      'Astro 6 (SSR)',
      'React 19',
      'Express 5',
      'PostgreSQL',
      'CSS Vanilla',
      'Stripe',
      'Resend',
      'Google Sheets API',
      'Replit Object Storage',
      'express-session',
      'bcryptjs',
      'Node.js',
    ],
    en: {
      type: 'B2B/B2C WEB PLATFORM',
      subtitle: 'Leading aesthetic medicine job platform in South Florida',
      date: 'July 2026',
      description:
        'Leading B2B/B2C job platform in South Florida for the aesthetic medicine sector. It allows professionals to find jobs and clinics to hire talent, with independent dashboards for Employers and Candidates.',
      details:
        'High-performance B2B/B2C job platform specially designed for people living in South Florida within the aesthetic medicine sector (enhance.work). It offers workflows and interfaces fully tailored for both employers and candidates. Built on the frontend with Astro 6 in SSR mode and React 19 embedded via interactive islands, styled with pure Vanilla CSS. Backend server in Express 5 acting with Astro SSR middleware. Authentication system with express-session and bcryptjs, relational PostgreSQL database (pg client) and file and image storage in Replit Object Storage. Integrations with Stripe for payments and subscriptions, Resend for transactional emails and Google Sheets API for data synchronization.',
    },
  },
  {
    id: 'miami-bounce-company',
    number: '02',
    type: 'PLATAFORMA WEB',
    title: 'Miami Bounce Company',
    subtitle: 'Plataforma de reservas para alquiler de casas inflables en South Miami',
    image: miamiBounceOg,
    organization: 'Miami Bounce (South Miami, FL)',
    date: 'Junio 2026',
    url: 'https://miabounce.com/',
    description:
      'Plataforma web de contacto directo con la dueña de una empresa de alquiler de casas inflables (Bounce Houses) ubicada en South Miami, Florida.',
    details:
      'Plataforma web moderna y de alto rendimiento para empresa de alquiler de casas inflables (Bounce Houses) en South Miami, Florida. Diseñada para facilitar el contacto directo y la reserva con la dueña del negocio. Desarrollada en el frontend con React, TypeScript, Vite, Tailwind CSS, componentes Radix UI / shadcn/ui, Framer Motion para animaciones interactivas fluidas, Wouter para enrutamiento y TanStack React Query para la gestión del estado del servidor. Backend impulsado por Node.js con Express ejecutado con tsx. Incluye integración completa de medición y pauta publicitaria mediante Google Tag Manager (GTM), Google Analytics 4 (GA4), Meta Pixel y estructuras SEO Schemas optimizadas.',
    installCode: 'https://miabounce.com/',
    githubUrl: 'https://miabounce.com/',
    techStack: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'Radix UI',
      'Framer Motion',
      'Wouter',
      'TanStack Query',
      'Node.js',
      'Express',
      'Google Tag Manager',
      'Google Analytics 4',
      'Meta Pixel',
      'SEO Schemas',
    ],
    en: {
      type: 'WEB PLATFORM',
      subtitle: 'Booking platform for bounce house rentals in South Miami',
      date: 'June 2026',
      description:
        'Web platform for direct contact with the owner of a bounce house rental company located in South Miami, Florida.',
      details:
        'Modern, high-performance web platform for a bounce house rental company in South Miami, Florida. Designed to facilitate direct contact and booking with the business owner. Developed on the frontend with React, TypeScript, Vite, Tailwind CSS, Radix UI / shadcn/ui components, Framer Motion for smooth interactive animations, Wouter for routing and TanStack React Query for server state management. Backend powered by Node.js with Express running with tsx. Includes complete measurement and advertising integration through Google Tag Manager (GTM), Google Analytics 4 (GA4), Meta Pixel and optimized SEO Schemas.',
    },
  },
  {
    id: 'peptidos-venezuela',
    number: '03',
    type: 'E-COMMERCE',
    title: 'Péptidos Venezuela',
    subtitle: 'E-commerce de péptidos importados con protocolo clínico',
    image: peptidosOg,
    organization: 'Peptidos Venezuela',
    date: 'Mayo 2026',
    url: 'https://peptidosvzla.com/',
    description:
      'Plataforma de e-commerce especializada en la venta de péptidos importados de Estados Unidos con entregas en Caracas y acompañamiento bajo protocolo clínico.',
    details:
      'Desarrollo e integración integral de plataforma e-commerce para la comercialización de péptidos importados de Estados Unidos a Caracas, con acompañamiento bajo protocolo clínico. Construido en el frontend con React, TypeScript, Vite, Wouter, Radix UI / shadcn/ui y TanStack Query para una gestión eficiente del estado del servidor. Servidor backend en Node.js con Express y base de datos relacional PostgreSQL. Incluye suite avanzada de rastreo y conversión (Google Tag Manager, GA4, Meta Pixel, Microsoft Clarity) y optimización SEO completa (esquemas SEO estructurados, metadatos Open Graph e imágenes optimizadas) con diseño 100% responsive.',
    installCode: 'https://peptidosvzla.com/',
    githubUrl: 'https://peptidosvzla.com/',
    techStack: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Radix UI / shadcn',
      'Wouter',
      'TanStack Query',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Google Tag Manager',
      'Google Analytics 4',
      'Meta Pixel',
      'Microsoft Clarity',
      'SEO Schemas',
    ],
    en: {
      type: 'E-COMMERCE',
      subtitle: 'E-commerce for imported peptides with clinical protocol',
      date: 'May 2026',
      description:
        'E-commerce platform specialized in the sale of peptides imported from the United States with deliveries in Caracas and support under clinical protocol.',
      details:
        'Comprehensive development and integration of an e-commerce platform for the sale of peptides imported from the United States to Caracas, with support under clinical protocol. Built on the frontend with React, TypeScript, Vite, Wouter, Radix UI / shadcn/ui and TanStack Query for efficient server state management. Backend server in Node.js with Express and relational PostgreSQL database. Includes an advanced tracking and conversion suite (Google Tag Manager, GA4, Meta Pixel, Microsoft Clarity) and complete SEO optimization (structured SEO schemas, Open Graph metadata and optimized images) with 100% responsive design.',
    },
  },
  {
    id: 'ai-support-analyst',
    number: '04',
    type: 'INTELIGENCIA ARTIFICIAL',
    title: 'AI Support Analyst',
    subtitle: 'Sistema de IA para análisis y respuesta de tickets de soporte',
    organization: 'Proyecto Personal',
    date: 'Marzo 2026',
    url: 'https://project-portafolio.vercel.app/',
    description:
      'Sistema de IA para el análisis automatizado, categorización y respuesta sugerida de tickets de soporte.',
    details:
      'Proyecto personal desarrollado para optimizar la gestión de mesas de ayuda. Utiliza modelos de lenguaje de gran escala (LLM) para realizar análisis de sentimiento, categorización automática por urgencia y tema, y generación de borradores de respuesta. Implementado con una arquitectura que permite procesar grandes volúmenes de datos históricos para identificar patrones de fallas recurrentes, reduciendo el tiempo de primera respuesta en un 40%.',
    installCode: 'https://project-portafolio.vercel.app/',
    githubUrl: 'https://project-portafolio.vercel.app/',
    techStack: [
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS 4',
      'shadcn/ui',
      'Motion',
      'Lucide React',
      'Sonner',
      'Radix UI',
      'LLM APIs (Python / Prompt Engineering)',
    ],
    en: {
      type: 'ARTIFICIAL INTELLIGENCE',
      subtitle: 'AI system for support ticket analysis and response',
      date: 'March 2026',
      description:
        'AI system for automated analysis, categorization and suggested responses for support tickets.',
      details:
        'Personal project developed to optimize help desk management. It uses large language models (LLM) to perform sentiment analysis, automatic categorization by urgency and topic, and generation of response drafts. Implemented with an architecture that allows processing large volumes of historical data to identify recurring failure patterns, reducing first response time by 40%.',
    },
  },
  {
    id: 'cambios-estructura-nomina',
    number: '05',
    type: 'APP MÓVIL EMPRESARIAL',
    title: 'Cambios de Estructura y Nómina',
    subtitle: 'Aplicativo móvil para gestión de cambios organizacionales y nómina',
    organization: 'Renault Sofasa',
    date: 'Mayo 2025 - Octubre 2025',
    description:
      'Aplicativo móvil para gestionar cambios organizacionales y novedades de nómina críticos en planta.',
    details:
      'Desarrollo de una solución en React Native para automatizar la gestión de la estructura organizacional y novedades de nómina. Redujo procesos manuales que tomaban hasta 14 horas a tan solo minutos (reducción del 99%), eliminando errores y beneficiando a más de 12 áreas críticas incluyendo Recursos Humanos y Producción.',
    installCode: '',
    githubUrl: '',
    techStack: ['React Native', 'TypeScript', 'Node.js', 'SQL Server'],
    en: {
      type: 'ENTERPRISE MOBILE APP',
      subtitle: 'Mobile app for managing organizational changes and payroll',
      date: 'May 2025 - October 2025',
      description:
        'Mobile app to manage critical organizational changes and payroll updates on the plant floor.',
      details:
        'Development of a React Native solution to automate the management of organizational structure and payroll updates. It reduced manual processes that took up to 14 hours down to just minutes (a 99% reduction), eliminating errors and benefiting more than 12 critical areas including Human Resources and Production.',
    },
  },
  {
    id: 'automatizacion-tasas-cambio',
    number: '06',
    type: 'AUTOMATIZACIÓN / RPA',
    title: 'Automatización de Tasas de Cambio',
    subtitle: 'Sistema RPA para actualización automática de divisas',
    organization: 'Simex',
    date: 'Febrero 2026 - Marzo 2026',
    description:
      'Sistema RPA para la actualización automática de divisas y reportes financieros.',
    details:
      'Implementación de un flujo de automatización con n8n que actualiza diariamente más de 10 tasas de cambio mediante APIs financieras. Este sistema ahorró aproximadamente 130 horas de trabajo manual y eliminó por completo el riesgo de error humano en reportes contables críticos.',
    installCode: '',
    githubUrl: '',
    techStack: ['n8n', 'APIs REST', 'JSON', 'RPA / Automation'],
    en: {
      type: 'AUTOMATION / RPA',
      subtitle: 'RPA system for automatic currency updates',
      date: 'February 2026 - March 2026',
      description: 'RPA system for the automatic updating of currencies and financial reports.',
      details:
        'Implementation of an automation flow with n8n that updates more than 10 exchange rates daily through financial APIs. This system saved approximately 130 hours of manual work and completely eliminated the risk of human error in critical accounting reports.',
    },
  },
  {
    id: 'analisis-datos-estadisticos',
    number: '07',
    type: 'ANÁLISIS DE DATOS / BI',
    title: 'Análisis de Datos Estadísticos',
    subtitle: 'Tableros analíticos para la toma de decisiones estratégicas',
    organization: 'Renault Sofasa',
    date: 'Octubre 2025 - Diciembre 2025',
    description:
      'Estructuración de tableros analíticos comprensibles para la toma de decisiones estratégicas.',
    details:
      'Liderazgo en la reorganización y estructuración de tableros estadísticos y de análisis de datos para transformarlos en herramientas intuitivas y comprensibles, diseñadas específicamente para perfiles no técnicos como psicólogos de selección. Utilización de Power BI, Looker Studio y Dash para presentar métricas complejas de forma clara, facilitando la evaluación de candidatos y el seguimiento de KPIs operativos.',
    installCode: '',
    githubUrl: '',
    techStack: ['Power BI', 'Looker Studio', 'Dash', 'SQL'],
    en: {
      type: 'DATA ANALYSIS / BI',
      subtitle: 'Analytical dashboards for strategic decision-making',
      date: 'October 2025 - December 2025',
      description: 'Structuring understandable analytical dashboards for strategic decision-making.',
      details:
        'Leadership in the reorganization and structuring of statistical and data analysis dashboards to transform them into intuitive and understandable tools, specifically designed for non-technical profiles such as selection psychologists. Use of Power BI, Looker Studio and Dash to present complex metrics clearly, facilitating candidate evaluation and the tracking of operational KPIs.',
    },
  },
  {
    id: 'bi-erp-sap-epicor',
    number: '08',
    type: 'BUSINESS INTELLIGENCE / ERP',
    title: 'Inteligencia de Negocios y ERP',
    subtitle: 'Integración de datos financieros desde SAP y Epicor',
    organization: 'Simex / Renault',
    date: 'Noviembre 2025 - Marzo 2026',
    description:
      'Integración de datos financieros y operativos desde sistemas SAP y Epicor.',
    details:
      'Desarrollo de ecosistemas de reportes avanzados integrando datos provenientes de ERPs corporativos como SAP, SAP Business One y Epicor. Creación de dashboards ejecutivos en Power BI y Looker que permiten una visibilidad completa de la cadena de valor, optimizando los tiempos de respuesta gerenciales mediante datos precisos y visualizaciones analíticas de alto impacto.',
    installCode: '',
    githubUrl: '',
    techStack: ['SAP', 'SAP Business One', 'Epicor', 'Power BI', 'Looker Studio'],
    en: {
      type: 'BUSINESS INTELLIGENCE / ERP',
      subtitle: 'Integration of financial data from SAP and Epicor',
      date: 'November 2025 - March 2026',
      description: 'Integration of financial and operational data from SAP and Epicor systems.',
      details:
        'Development of advanced reporting ecosystems integrating data from corporate ERPs such as SAP, SAP Business One and Epicor. Creation of executive dashboards in Power BI and Looker that provide complete visibility of the value chain, optimizing managerial response times through accurate data and high-impact analytical visualizations.',
    },
  },
  {
    id: 'ia-empresarial-copilot',
    number: '09',
    type: 'IA EMPRESARIAL',
    title: 'IA Empresarial y Copilot',
    subtitle: 'Optimización de procesos con asistentes inteligentes',
    organization: 'Innovación TI',
    date: '2025',
    description:
      'Optimización de procesos mediante asistentes inteligentes y Copilot Studio.',
    details:
      'Liderazgo en la adopción de IA generativa en el entorno corporativo, utilizando Microsoft Copilot Studio para crear agentes y asistentes que optimizan el desarrollo, el análisis de información y la automatización de flujos de trabajo repetitivos, elevando la productividad operativa del equipo.',
    installCode: '',
    githubUrl: '',
    techStack: ['Copilot Studio', 'Generative AI', 'Process Automation'],
    en: {
      type: 'ENTERPRISE AI',
      subtitle: 'Process optimization with intelligent assistants',
      date: '2025',
      description: 'Process optimization through intelligent assistants and Copilot Studio.',
      details:
        'Leadership in the adoption of generative AI in the corporate environment, using Microsoft Copilot Studio to create agents and assistants that optimize development, information analysis and the automation of repetitive workflows, boosting the team\'s operational productivity.',
    },
  },
  {
    id: 'asistente-bambini-van-gogh',
    number: '10',
    type: 'IA / INVESTIGACIÓN',
    title: 'Asistente Bambini (Van Gogh)',
    subtitle: 'Inclusión visual con IA para personas con discapacidad visual',
    organization: 'U. Salazar y Herrera',
    date: 'Mayo 2025 - Julio 2025',
    description:
      'Asistente de voz inteligente para mejorar la experiencia de personas con discapacidad visual en museos.',
    details:
      'Proyecto de investigación desarrollado en la Universidad Salazar y Herrera. Bambini es un asistente de IA diseñado como intérprete visual en museos y sitios turísticos de Colombia. Desarrollado en Python con redes neuronales y visión artificial para describir detalladamente obras de arte, cuadros y lienzos, brindando una experiencia inmersiva, accesible y educativa para personas con discapacidad visual o baja visión.',
    installCode: '',
    githubUrl: '',
    techStack: ['Python', 'Generative AI', 'Computer Vision', 'Voice Synthesis'],
    en: {
      type: 'AI / RESEARCH',
      subtitle: 'Visual inclusion with AI for visually impaired people',
      date: 'May 2025 - July 2025',
      description:
        'Intelligent voice assistant to improve the experience of visually impaired people in museums.',
      details:
        'Research project developed at Universidad Salazar y Herrera. Bambini is an AI assistant designed as a visual interpreter in museums and tourist sites in Colombia. Developed in Python with neural networks and computer vision to describe artworks, paintings and canvases in detail, providing an immersive, accessible and educational experience for people with visual impairment or low vision.',
    },
  },
  {
    id: 'sitio-contadoras-aq',
    number: '11',
    type: 'SITIO WEB CORPORATIVO',
    title: 'Sitio Web Contadoras AQ',
    subtitle: 'Plataforma web oficial para firma de contaduría',
    organization: 'Contadoras AQ',
    date: 'Marzo 2026 - Abril 2026',
    description:
      'Desarrollo y despliegue de la plataforma web oficial para la empresa de contaduría Contadoras AQ.',
    details:
      'Diseño y desarrollo del sitio web oficial para la firma contable Contadoras AQ utilizando React y Next.js para maximizar rendimiento y posicionamiento SEO. Desplegado en Vercel sobre dominio corporativo propio, constituyéndose como el canal digital central para la captación de clientes y presentación de servicios corporativos.',
    installCode: '',
    githubUrl: '',
    techStack: ['React', 'Next.js', 'TypeScript', 'Vercel'],
    en: {
      type: 'CORPORATE WEBSITE',
      subtitle: 'Official web platform for an accounting firm',
      date: 'March 2026 - April 2026',
      description:
        'Development and deployment of the official web platform for the accounting firm Contadoras AQ.',
      details:
        'Design and development of the official website for the accounting firm Contadoras AQ using React and Next.js to maximize performance and SEO ranking. Deployed on Vercel on its own corporate domain, becoming the central digital channel for client acquisition and the presentation of corporate services.',
    },
  },
];

export const ARTICLE_AUTHOR: ArticleAuthor = {
  name: 'Juan Fernando Agudelo',
  role: 'Arquitecto de Software & Consultor Senior',
  bio: 'Diseño sistemas distribuidos y arquitecturas backend escalables desde hace más de 4 años, ayudando a equipos de ingeniería a migrar sistemas legacy sin detener el negocio.',
};

const MONOLITH_TO_MICROSERVICES_CONTENT = `
<p class="article-intro">Migrar a microservicios porque "es lo que hace todo el mundo" es la forma más rápida de convertir un sistema lento en un sistema lento, distribuido y difícil de depurar. La pregunta que de verdad importa no es arquitectónica, es operativa: ¿qué parte de tu monolito te está costando dinero o velocidad de entrega cada semana? Este artículo responde eso con criterios concretos y un plan de migración incremental, sin big bang, sin downtime y sin reescribir el sistema desde cero.</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    <li>Los microservicios no resuelven problemas de diseño: un monolito con módulos acoplados se convierte en microservicios acoplados por red, solo que más lentos y más difíciles de depurar.</li>
    <li>Las señales reales para migrar son de despliegue y de organización de equipos, no de "líneas de código" ni de moda tecnológica.</li>
    <li>El patrón Strangler Fig permite extraer servicios de forma incremental, con rollback inmediato si algo falla en producción.</li>
    <li>La mayoría de los equipos de menos de 15 ingenieros no necesitan microservicios: necesitan un monolito mejor modularizado.</li>
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    <li><a href="#ms-pregunta">1. La pregunta equivocada: "¿Necesito microservicios?"</a></li>
    <li>
      <a href="#ms-senales">2. Las 3 señales reales de que tu monolito necesita cambiar</a>
      <ol>
        <li><a href="#ms-cuellos">2.1 Cuellos de botella de despliegue</a></li>
        <li><a href="#ms-equipos">2.2 Límites de equipo, no solo de código</a></li>
        <li><a href="#ms-escalado">2.3 Escalado desigual de módulos</a></li>
      </ol>
    </li>
    <li><a href="#ms-comparativa">3. Monolito vs. microservicios: comparativa técnica</a></li>
    <li><a href="#ms-strangler">4. La estrategia Strangler Fig: migrar sin romper producción</a></li>
    <li><a href="#ms-errores">5. Errores comunes que convierten la migración en un incendio</a></li>
    <li><a href="#ms-nomigrar">6. Cuándo NO migrar (honestidad técnica)</a></li>
    <li><a href="#ms-faqs">Preguntas Frecuentes</a></li>
    <li><a href="#ms-referencias">Referencias y Enlaces</a></li>
  </ol>
</div>

<h2 id="ms-pregunta">1. La pregunta equivocada: "¿Necesito microservicios?"</h2>
<p>Esa pregunta no tiene una respuesta útil porque está planteada al revés. Ningún sistema "necesita" microservicios por sí mismo; una organización necesita desplegar más rápido, escalar un componente específico o dejar que equipos trabajen sin pisarse. La arquitectura es una consecuencia de esas restricciones, no un objetivo en sí misma. Antes de hablar de servicios, colas o service mesh, hay que identificar en qué parte exacta del ciclo de entrega está el dolor real: ¿en el despliegue, en el escalado, en la coordinación entre equipos, o simplemente en un código mal modularizado que nadie ha ordenado?</p>
<p>La Ley de Conway explica por qué tantas migraciones fallan: los sistemas terminan replicando la estructura de comunicación de la organización que los construye. Si trocear el monolito en servicios no viene acompañado de equipos autónomos con ownership real sobre cada uno, el resultado es un monolito distribuido: la misma falta de límites claros, ahora con la latencia y la complejidad operativa de la red añadidas encima.</p>

<h2 id="ms-senales">2. Las 3 señales reales de que tu monolito necesita cambiar</h2>
<p>Hay señales legítimas para migrar y hay excusas disfrazadas de argumento técnico. Estas tres son las que valido primero en cualquier auditoría de arquitectura, porque son medibles y no dependen de preferencias personales.</p>

<h3 id="ms-cuellos">2.1 Cuellos de botella de despliegue</h3>
<p>Cuando un cambio de una línea en el módulo de facturación obliga a re-testear y desplegar todo el catálogo de productos, el costo de cada release deja de ser proporcional al cambio. Si tu equipo mide el "lead time" de un fix trivial en días en lugar de horas, y la causa es coordinación de despliegue (no falta de pruebas), esa es una señal real.</p>

<h3 id="ms-equipos">2.2 Límites de equipo, no solo de código</h3>
<p>Si tienes tres equipos con ownership de producto claramente distinto pero comparten un único pipeline de despliegue y un único repositorio sin límites de módulo, la arquitectura y la estructura organizacional están en conflicto. Este es el caso donde extraer servicios alineados a esos equipos reduce fricción real, no solo complejidad percibida.</p>

<h3 id="ms-escalado">2.3 Escalado desigual de módulos</h3>
<p>Un módulo de procesamiento de imágenes, generación de reportes o envío masivo de notificaciones puede consumir el 80% de la CPU en picos puntuales, mientras el resto del sistema está prácticamente ocioso. En un monolito, esto obliga a escalar horizontalmente todo el proceso para resolver el cuello de botella de una sola pieza, encareciendo la infraestructura sin necesidad.</p>

<h2 id="ms-comparativa">3. Monolito vs. microservicios: comparativa técnica</h2>
<p>Ninguna de las dos arquitecturas es superior en abstracto; cada una optimiza para restricciones distintas. Esta tabla resume las decisiones que de verdad cambian según el camino que tomes.</p>

<svg class="article-diagram" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; margin: 24px 0;">
  <!-- Monolito -->
  <g>
    <rect x="50" y="50" width="350" height="300" fill="#f0f4f8" stroke="#0f1b61" stroke-width="2" rx="8"/>
    <text x="225" y="85" font-size="24" font-weight="bold" text-anchor="middle" fill="#0f1b61">Monolito</text>
    <circle cx="225" cy="180" r="80" fill="#0f1b61" opacity="0.9"/>
    <text x="225" y="190" font-size="14" font-weight="bold" text-anchor="middle" fill="white">Todo en un</text>
    <text x="225" y="210" font-size="14" font-weight="bold" text-anchor="middle" fill="white">proceso</text>
    <text x="60" y="310" font-size="12" fill="#53647f">✓ Simple al inicio</text>
    <text x="60" y="330" font-size="12" fill="#53647f">✓ Deploy único</text>
  </g>

  <!-- Microservicios -->
  <g>
    <rect x="600" y="50" width="350" height="300" fill="#f0f4f8" stroke="#0f1b61" stroke-width="2" rx="8"/>
    <text x="775" y="85" font-size="24" font-weight="bold" text-anchor="middle" fill="#0f1b61">Microservicios</text>
    <circle cx="700" cy="180" r="40" fill="#73bbc5" opacity="0.9"/>
    <circle cx="775" cy="200" r="40" fill="#682ae9" opacity="0.9"/>
    <circle cx="850" cy="180" r="40" fill="#73bbc5" opacity="0.9"/>
    <text x="775" y="195" font-size="10" font-weight="bold" text-anchor="middle" fill="white">API</text>
    <text x="610" y="310" font-size="12" fill="#53647f">✓ Deploy independiente</text>
    <text x="610" y="330" font-size="12" fill="#53647f">✓ Escalado granular</text>
  </g>

  <!-- Flechas de complejidad -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#682ae9"/>
    </marker>
  </defs>
  <text x="500" y="30" font-size="14" font-weight="bold" text-anchor="middle" fill="#682ae9">Complejidad ➜</text>
</svg>
<table class="article-table">
  <thead>
    <tr>
      <th>Criterio</th>
      <th>Monolito</th>
      <th>Microservicios</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Despliegue</td>
      <td>Un solo pipeline, simple al inicio</td>
      <td>Independiente por servicio, requiere CI/CD maduro</td>
    </tr>
    <tr>
      <td>Escalabilidad</td>
      <td>Vertical; escala todo el sistema junto</td>
      <td>Horizontal; escala solo el servicio con carga</td>
    </tr>
    <tr>
      <td>Complejidad operativa</td>
      <td>Baja: un solo proceso, un solo log</td>
      <td>Alta: orquestación, tracing distribuido, observabilidad</td>
    </tr>
    <tr>
      <td>Consistencia de datos</td>
      <td>Transacciones ACID nativas</td>
      <td>Consistencia eventual; requiere sagas o CDC</td>
    </tr>
    <tr>
      <td>Velocidad inicial</td>
      <td>Alta; ideal para MVP y validación de mercado</td>
      <td>Baja; overhead de infraestructura desde el día uno</td>
    </tr>
    <tr>
      <td>Costo de infraestructura</td>
      <td>Predecible y bajo</td>
      <td>Mayor: red, colas, service mesh, monitoreo</td>
    </tr>
    <tr>
      <td>Ideal para</td>
      <td>Equipos &lt; 15 ingenieros, productos en validación</td>
      <td>Organizaciones con equipos autónomos y dominios definidos</td>
    </tr>
  </tbody>
</table>

<h2 id="ms-strangler">4. La estrategia Strangler Fig: migrar sin romper producción</h2>
<p>El patrón Strangler Fig (popularizado por Martin Fowler) consiste en envolver el monolito con una capa de enrutamiento y extraer funcionalidad hacia servicios nuevos de forma incremental, mientras el sistema legacy sigue operando sin interrupción. Nunca hay un "big bang": en cualquier momento del proceso, el sistema en producción es una combinación funcional de monolito y servicios nuevos.</p>

<h3>Paso 1 — Identificar el "seam" de dominio</h3>
<p>Usando límites de dominio (bounded contexts), se elige el primer candidato a extraer. La regla que aplico: nunca el módulo transaccional core (pagos, inventario crítico); sí un módulo periférico, de alto dolor operativo y bajo acoplamiento de datos, como notificaciones, búsqueda o generación de reportes.</p>

<h3>Paso 2 — Levantar un proxy de enrutamiento</h3>
<p>Antes de mover una sola línea de lógica de negocio, se coloca un proxy o API Gateway delante del monolito. Esto permite decidir, por ruta, qué peticiones siguen yendo al sistema legacy y cuáles empiezan a resolverse en el nuevo servicio, sin que el cliente note el cambio.</p>

<svg class="article-diagram" viewBox="0 0 1000 350" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto; margin: 24px 0;">
  <!-- Cliente -->
  <circle cx="150" cy="100" r="40" fill="#0f1b61"/>
  <text x="150" y="105" font-size="12" font-weight="bold" text-anchor="middle" fill="white">Cliente</text>

  <!-- API Gateway -->
  <rect x="300" y="60" width="120" height="80" fill="#682ae9" rx="4"/>
  <text x="360" y="90" font-size="12" font-weight="bold" text-anchor="middle" fill="white">API</text>
  <text x="360" y="110" font-size="12" font-weight="bold" text-anchor="middle" fill="white">Gateway</text>

  <!-- Monolito Legacy (izquierda) -->
  <rect x="550" y="40" width="130" height="100" fill="#f0f4f8" stroke="#0f1b61" stroke-width="2" rx="4"/>
  <text x="615" y="70" font-size="11" font-weight="bold" text-anchor="middle" fill="#0f1b61">Monolito</text>
  <text x="615" y="90" font-size="11" font-weight="bold" text-anchor="middle" fill="#0f1b61">Legacy</text>
  <text x="615" y="120" font-size="9" text-anchor="middle" fill="#53647f">/api/products</text>

  <!-- Nuevo Servicio (derecha) -->
  <rect x="550" y="180" width="130" height="100" fill="#73bbc5" opacity="0.8" rx="4"/>
  <text x="615" y="210" font-size="11" font-weight="bold" text-anchor="middle" fill="#ffffff">Nuevo</text>
  <text x="615" y="230" font-size="11" font-weight="bold" text-anchor="middle" fill="#ffffff">Servicio</text>
  <text x="615" y="260" font-size="9" text-anchor="middle" fill="rgba(255,255,255,0.9)">/api/notifications</text>

  <!-- Flechas -->
  <defs>
    <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#0f1b61"/>
    </marker>
  </defs>

  <!-- Cliente a Gateway -->
  <line x1="190" y1="100" x2="300" y2="100" stroke="#0f1b61" stroke-width="2" marker-end="url(#arrowhead2)"/>

  <!-- Gateway a Monolito -->
  <path d="M 420 80 Q 480 80 550 90" stroke="#682ae9" stroke-width="2" fill="none" marker-end="url(#arrowhead2)"/>
  <text x="460" y="70" font-size="10" fill="#682ae9">/api/products →</text>

  <!-- Gateway a Nuevo Servicio -->
  <path d="M 420 120 Q 480 150 550 230" stroke="#4ECDC4" stroke-width="2" fill="none" marker-end="url(#arrowhead2)"/>
  <text x="440" y="150" font-size="10" fill="#4ECDC4">← /api/notifications</text>

  <!-- Leyenda -->
  <text x="750" y="100" font-size="11" fill="#53647f">✓ Tráfico redirigido</text>
  <text x="750" y="125" font-size="11" fill="#53647f">✓ Sin downtime</text>
  <text x="750" y="150" font-size="11" fill="#53647f">✓ Rollback inmediato</text>
</svg>
<pre class="article-code"><code># nginx.conf — enrutamiento incremental estilo Strangler Fig
# El módulo de notificaciones ya vive en un servicio nuevo;
# todo lo demás sigue resolviéndose en el monolito.

location /api/notifications/ {
    proxy_pass http://notifications-service:4000;
}

location /api/ {
    proxy_pass http://legacy-monolith:3000;
}</code></pre>

<h3>Paso 3 — Extraer, medir y tener plan de rollback</h3>
<p>La lógica se mueve al nuevo servicio detrás de un feature flag o un rollout por porcentaje de tráfico (canary), comparando métricas de error y latencia contra la ruta legacy. El código antiguo se mantiene desplegable durante varias semanas: si algo falla, el rollback es cambiar una regla de enrutamiento, no un despliegue de emergencia. Solo se elimina el camino legacy cuando el nuevo servicio ha demostrado estabilidad bajo carga real.</p>

<h2 id="ms-errores">5. Errores comunes que convierten la migración en un incendio</h2>
<ul>
  <li><strong>Migrar el módulo core primero.</strong> Empezar por el componente de mayor riesgo (pagos, autenticación) maximiza el blast radius del primer error.</li>
  <li><strong>Partir el sistema sin observabilidad distribuida.</strong> Sin trazabilidad (correlation IDs, tracing) un error 500 se convierte en una cacería a ciegas entre varios servicios.</li>
  <li><strong>Compartir una sola base de datos entre "microservicios".</strong> Eso no es una arquitectura de microservicios: es un monolito distribuido, con toda la complejidad de la red y ninguno de sus beneficios de aislamiento.</li>
  <li><strong>No versionar los contratos de API.</strong> Cambiar un endpoint sin versión rompe a los consumidores en cada despliegue y erosiona la confianza en la migración.</li>
  <li><strong>Subestimar la consistencia eventual.</strong> Migrar operaciones que cruzan varios servicios sin implementar sagas o compensaciones deja transacciones a medio completar cuando algo falla a mitad de camino.</li>
</ul>

<h2 id="ms-nomigrar">6. Cuándo NO migrar (honestidad técnica)</h2>
<p>Si tu equipo tiene menos de 15 ingenieros y un solo pipeline de despliegue les funciona sin fricción notable, migrar a microservicios no resuelve un problema que tienes: crea uno nuevo. Los microservicios multiplican el costo operativo (red, colas, monitoreo distribuido, on-call más complejo) y ese costo solo se justifica cuando el dolor de despliegue, escalado o coordinación de equipos ya es real y medible. Si el problema es que el código está mal organizado dentro del monolito, la solución correcta casi siempre es más barata y menos arriesgada: convertirlo en un monolito modular, con límites de dominio claros dentro del mismo proceso, antes de pagar el costo de distribuirlo.</p>

<h2 id="ms-faqs">Preguntas Frecuentes</h2>

<details class="article-faq">
  <summary class="article-faq-question">¿Cuánto tiempo tarda una migración típica a microservicios?</summary>
  <div class="article-faq-answer"><p>Depende del tamaño del monolito y de la capacidad de tu equipo. El patrón Strangler Fig es incremental, así que es más útil pensar en sprints de 2-4 semanas extrayendo un servicio a la vez, que en un proyecto global. Equipos de 5-10 ingenieros suelen tardar entre 6 y 18 meses en migrar un monolito de mediano tamaño de forma segura y sin pausar la entrega de features.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Necesito Kubernetes para usar microservicios?</summary>
  <div class="article-faq-answer"><p>No obligatoriamente. Kubernetes es una opción cuando tienes 15+ servicios y necesitas orquestación declarativa de recursos. Para un equipo pequeño empezando, Docker + Docker Compose o incluso serverless functions (AWS Lambda, Cloud Functions) pueden ser suficientes y menos complejos de operar.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Qué herramientas recomiendas para tracing distribuido?</summary>
  <div class="article-faq-answer"><p>Jaeger, Zipkin y Datadog son opciones maduras. Si usas AWS, X-Ray es una opción nativa. Para startups o equipos pequeños, comenzar con logging estructurado (ELK stack) y correlation IDs simples puede ser suficiente antes de invertir en APM full.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Es posible hacer rollback de una migración parcial?</summary>
  <div class="article-faq-answer"><p>Sí, ese es el punto del patrón Strangler Fig. Si un servicio nuevo falla bajo carga, cambias el proxy/gateway para que todas las peticiones vuelvan al monolito legacy en minutos. Por eso es crítico que el código antiguo permanezca desplegable durante la transición.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Qué pasa si el equipo no está preparado técnicamente?</summary>
  <div class="article-faq-answer"><p>Es la razón número uno por la que fracasan las migraciones. Antes de empezar, asegúrate de que tu equipo entienda: API versioning, eventual consistency, circuit breakers, distributed tracing y cómo debuggear fallos en la red. Si no, invierte primero en entrenamiento que en infraestructura.</p></div>
</details>

<h2 id="ms-referencias">Referencias y Enlaces</h2>
<ul>
  <li><strong>Strangler Fig Pattern</strong> — Martin Fowler: <a href="https://martinfowler.com/bliki/StranglerFigApplication.html" target="_blank" rel="noopener noreferrer">martinfowler.com/bliki/StranglerFigApplication.html</a></li>
  <li><strong>Building Microservices</strong> — Sam Newman (libro recomendado): Segunda edición cubre patrones modernos de migración incremental</li>
  <li><strong>Microservices Patterns</strong> — Chris Richardson: Referencia sobre sagas, CDC y patrones de datos distribuidos</li>
  <li><strong>The Art of Scalability</strong> — Martin Abbott &amp; Michael Fisher: Decisiones arquitectónicas basadas en escala real</li>
  <li><strong>Conway's Law</strong> — Melvin E. Conway: <a href="https://www.melconway.com/Home/Committees_Paper.html" target="_blank" rel="noopener noreferrer">melconway.com/Home/Committees_Paper.html</a></li>
  <li><strong>Observability Engineering</strong> — Yuri Shkuro: Trazabilidad distribuida en sistemas complejos</li>
  <li><strong>Release It! (2nd Edition)</strong> — Michael T. Nygard: Estabilidad en producción y patrones de resiliencia</li>
  <li><strong>Domain-Driven Design</strong> — Eric Evans: Fundamentación teórica de bounded contexts y agregados</li>
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. Si tienes preguntas específicas sobre tu arquitectura o necesitas auditoría técnica, no dudes en contactarme.</p>
`;

export const WRITING_ARTICLES: WritingArticle[] = [
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
    readTime: '9 min de lectura',
    contentHtml: MONOLITH_TO_MICROSERVICES_CONTENT,
  },
];
