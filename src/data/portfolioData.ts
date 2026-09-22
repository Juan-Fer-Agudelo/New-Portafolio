import { ProjectItem, WritingArticle } from '../types';
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

export const WRITING_ARTICLES: WritingArticle[] = [
  {
    id: 'art-1',
    date: 'MARZO 2026',
    tag: 'ENGINEERING',
    title: '60fps Viewport State Tracking in Vanilla JS',
    excerpt:
      'Cómo optimizar listeners pasivos, requestAnimationFrame y cálculos de matrices de transformación sin sobrecargar el hilo principal del navegador.',
    readTime: '5 min de lectura',
  },
  {
    id: 'art-2',
    date: 'ENERO 2026',
    tag: 'TYPOGRAPHY',
    title: 'The Optical Rhythm of Digital Interfaces',
    excerpt:
      'Escalas modulares y contraste óptico en interfaces web contemporáneas: construyendo jerarquías visuales deliberadas sin depender de plantillas industriales.',
    readTime: '7 min de lectura',
  },
  {
    id: 'art-3',
    date: 'OCTUBRE 2025',
    tag: 'PHILOSOPHY',
    title: 'Craft Over Homogeneity in Frontend Development',
    excerpt:
      'Por qué el software interactivo debe sentirse como un trabajo artesanal, respetando el espacio negativo, las transiciones tangibles y el tono propio de cada proyecto.',
    readTime: '6 min de lectura',
  },
];
