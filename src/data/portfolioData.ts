import { ProjectItem, WritingArticle, ArticleAuthor } from '../types';
import enhanceOg from '../assets/images/enhance-og.jpg';
import miamiBounceOg from '../assets/images/miami-bounce-og.jpg';
import peptidosOg from '../assets/images/peptidos-og.jpg';
import perfectbOg from '../assets/images/perfectb-og.webp';
import { EXTRA_WRITING_ARTICLES } from './blogArticles';
import { CORE_WRITING_ARTICLES } from './blogArticlesCore';
import { MORE_WRITING_ARTICLES_1 } from './blogArticlesMore1';
import { MORE_WRITING_ARTICLES_2 } from './blogArticlesMore2';
import { SECURITY_WRITING_ARTICLES } from './blogArticlesSecurity';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'enhance-work',
    categories: ['web'],
    role: 'Hice el desarrollo full stack en equipo con Talent Phi y Santiago Loaiza',
    impact: [
      { value: 'B2B + B2C', label: 'una sola plataforma para empleadores y candidatos' },
      { value: 'Suscripciones', label: 'cobros recurrentes integrados con Stripe' },
      { value: 'En producción', label: 'publicada en enhance.work' },
    ],
    number: '01',
    type: 'PLATAFORMA WEB B2B/B2C',
    title: 'Enhance.Work',
    subtitle: 'Plataforma líder de empleos en medicina estética del sur de Florida',
    image: enhanceOg,
    organization: 'Enhance.Work (South Florida, FL)',
    country: 'us',
    date: 'Julio 2026',
    url: 'https://enhance.work',
    description:
      'Plataforma web B2B/B2C líder de empleos en el sur de Florida para el sector de medicina estética. Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza. Todos los derechos reservados son reservados para Talent Phi.',
    details:
      'Plataforma de empleo B2B/B2C de alto rendimiento diseñada especialmente para las personas que viven en el sur de Florida dentro del sector de medicina estética (enhance.work). Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza (todos los derechos reservados son reservados para Talent Phi). Ofrece flujos de trabajo e interfaces completamente adaptadas tanto para empleadores (Employers) como para candidatos (Candidates). Construida en el frontend con Astro 6 en modo SSR y React 19 embebido mediante islas interactivas, estilizada con CSS Vanilla puro. Servidor backend en Express 5 actuando con middleware de Astro SSR. Sistema de autenticación con express-session y bcryptjs, base de datos relacional PostgreSQL (cliente pg) y almacenamiento de archivos e imágenes en Replit Object Storage. Integraciones con Stripe para cobros y suscripciones, Resend para correos transaccionales y Google Sheets API para sincronización de datos.',
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
      role: 'I did the full stack development with Talent Phi and Santiago Loaiza',
      impact: [
        { value: 'B2B + B2C', label: 'one platform for employers and candidates' },
        { value: 'Subscriptions', label: 'recurring payments integrated with Stripe' },
        { value: 'Live', label: 'published at enhance.work' },
      ],
      type: 'B2B/B2C WEB PLATFORM',
      subtitle: 'Leading aesthetic medicine job platform in South Florida',
      date: 'July 2026',
      description:
        'Leading B2B/B2C job platform in South Florida for the aesthetic medicine sector. Developed in partnership with Talent Phi and full stack developer Santiago Loaiza. All rights reserved to Talent Phi.',
      details:
        'High-performance B2B/B2C job platform specially designed for people living in South Florida within the aesthetic medicine sector (enhance.work). Developed in partnership with Talent Phi and full stack developer Santiago Loaiza (all rights reserved to Talent Phi). It offers workflows and interfaces fully tailored for both employers and candidates. Built on the frontend with Astro 6 in SSR mode and React 19 embedded via interactive islands, styled with pure Vanilla CSS. Backend server in Express 5 acting with Astro SSR middleware. Authentication system with express-session and bcryptjs, relational PostgreSQL database (pg client) and file and image storage in Replit Object Storage. Integrations with Stripe for payments and subscriptions, Resend for transactional emails and Google Sheets API for data synchronization.',
    },
  },
  {
    id: 'miami-bounce-company',
    categories: ['web'],
    role: 'Hice el desarrollo full stack en equipo con Talent Phi y Santiago Loaiza',
    impact: [
      { value: 'Reserva directa', label: 'el cliente contacta y reserva con la dueña sin intermediarios' },
      { value: 'GA4 + Meta', label: 'medición de las campañas publicitarias desde el lanzamiento' },
      { value: 'En producción', label: 'publicada en miabounce.com' },
    ],
    number: '02',
    type: 'PLATAFORMA WEB',
    title: 'Miami Bounce Company',
    subtitle: 'Plataforma de reservas para alquiler de casas inflables en South Miami',
    image: miamiBounceOg,
    organization: 'Miami Bounce (South Miami, FL)',
    country: 'us',
    date: 'Junio 2026',
    url: 'https://miabounce.com/',
    description:
      'Plataforma web de contacto directo y reservas para empresa de alquiler de casas inflables (Bounce Houses) ubicada en South Miami, Florida. Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza. Todos los derechos reservados son reservados para Talent Phi.',
    details:
      'Plataforma web moderna y de alto rendimiento para empresa de alquiler de casas inflables (Bounce Houses) en South Miami, Florida. Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza (todos los derechos reservados son reservados para Talent Phi). Diseñada para facilitar el contacto directo y la reserva con la dueña del negocio. Desarrollada en el frontend con React, TypeScript, Vite, Tailwind CSS, componentes Radix UI / shadcn/ui, Framer Motion para animaciones interactivas fluidas, Wouter para enrutamiento y TanStack React Query para la gestión del estado del servidor. Backend impulsado por Node.js con Express ejecutado con tsx. Incluye integración completa de medición y pauta publicitaria mediante Google Tag Manager (GTM), Google Analytics 4 (GA4), Meta Pixel y estructuras SEO Schemas optimizadas.',
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
      role: 'I did the full stack development with Talent Phi and Santiago Loaiza',
      impact: [
        { value: 'Direct booking', label: 'customers contact and book with the owner, no middlemen' },
        { value: 'GA4 + Meta', label: 'ad campaign tracking from day one' },
        { value: 'Live', label: 'published at miabounce.com' },
      ],
      type: 'WEB PLATFORM',
      subtitle: 'Booking platform for bounce house rentals in South Miami',
      date: 'June 2026',
      description:
        'Web platform for direct contact and booking for a bounce house rental company located in South Miami, Florida. Developed in partnership with Talent Phi and full stack developer Santiago Loaiza. All rights reserved to Talent Phi.',
      details:
        'Modern, high-performance web platform for a bounce house rental company in South Miami, Florida. Developed in partnership with Talent Phi and full stack developer Santiago Loaiza (all rights reserved to Talent Phi). Designed to facilitate direct contact and booking with the business owner. Developed on the frontend with React, TypeScript, Vite, Tailwind CSS, Radix UI / shadcn/ui components, Framer Motion for smooth interactive animations, Wouter for routing and TanStack React Query for server state management. Backend powered by Node.js with Express running with tsx. Includes complete measurement and advertising integration through Google Tag Manager (GTM), Google Analytics 4 (GA4), Meta Pixel and optimized SEO Schemas.',
    },
  },
  {
    id: 'peptidos-venezuela',
    categories: ['web'],
    role: 'Hice el desarrollo full stack en equipo con Talent Phi y Santiago Loaiza',
    impact: [
      { value: 'EE. UU. → Caracas', label: 'venta en línea de producto importado con protocolo clínico' },
      { value: '4 herramientas', label: 'de medición: GTM, GA4, Meta Pixel y Clarity' },
      { value: 'En producción', label: 'publicada en peptidosvzla.com' },
    ],
    number: '03',
    type: 'E-COMMERCE',
    title: 'Péptidos Venezuela',
    subtitle: 'E-commerce de péptidos importados con protocolo clínico',
    image: peptidosOg,
    organization: 'Peptidos Venezuela',
    country: 've',
    date: 'Mayo 2026',
    url: 'https://peptidosvzla.com/',
    description:
      'Plataforma de e-commerce especializada en la venta de péptidos importados con protocolo clínico. Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza. Todos los derechos reservados son reservados para Talent Phi.',
    details:
      'Desarrollo e integración integral de plataforma e-commerce para la comercialización de péptidos importados de Estados Unidos a Caracas, con acompañamiento bajo protocolo clínico. Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza (todos los derechos reservados son reservados para Talent Phi). Construido en el frontend con React, TypeScript, Vite, Wouter, Radix UI / shadcn/ui y TanStack Query para una gestión eficiente del estado del servidor. Servidor backend en Node.js con Express y base de datos relacional PostgreSQL. Incluye suite avanzada de rastreo y conversión (Google Tag Manager, GA4, Meta Pixel, Microsoft Clarity) y optimización SEO completa (esquemas SEO estructurados, metadatos Open Graph e imágenes optimizadas) con diseño 100% responsive.',
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
      role: 'I did the full stack development with Talent Phi and Santiago Loaiza',
      impact: [
        { value: 'US → Caracas', label: 'online sales of imported products under clinical protocol' },
        { value: '4 tools', label: 'for tracking: GTM, GA4, Meta Pixel and Clarity' },
        { value: 'Live', label: 'published at peptidosvzla.com' },
      ],
      type: 'E-COMMERCE',
      subtitle: 'E-commerce for imported peptides with clinical protocol',
      date: 'May 2026',
      description:
        'E-commerce platform specialized in the sale of imported peptides with clinical protocol support. Developed in partnership with Talent Phi and full stack developer Santiago Loaiza. All rights reserved to Talent Phi.',
      details:
        'Comprehensive development and integration of an e-commerce platform for the sale of peptides imported from the United States to Caracas, with support under clinical protocol. Developed in partnership with Talent Phi and full stack developer Santiago Loaiza (all rights reserved to Talent Phi). Built on the frontend with React, TypeScript, Vite, Wouter, Radix UI / shadcn/ui and TanStack Query for efficient server state management. Backend server in Node.js with Express and relational PostgreSQL database. Includes an advanced tracking and conversion suite (Google Tag Manager, GA4, Meta Pixel, Microsoft Clarity) and complete SEO optimization (structured SEO schemas, Open Graph metadata and optimized images) with 100% responsive design.',
    },
  },
  {
    id: 'perfect-b-aesthetic',
    categories: ['web'],
    role: 'Hice el desarrollo full stack en equipo con Talent Phi y Santiago Loaiza',
    impact: [
      { value: '24/7', label: 'reservas y pagos en línea, sin llamar a la clínica' },
      { value: '2 idiomas', label: 'sitio y reservas en inglés y español' },
      { value: 'Phorest + Stripe', label: 'agenda y pagos conectados al sistema de la clínica' },
    ],
    number: '04',
    type: 'SITIO WEB CLÍNICO / RESERVAS',
    title: 'Perfect B',
    subtitle: 'Sitio para clínica de medicina estética con reservas y pagos online',
    image: perfectbOg,
    organization: 'Perfect B Aesthetic Medicine (Doral, FL)',
    country: 'us',
    date: 'Abril 2026',
    url: 'https://perfectb.com/',
    description:
      'Sitio web para Perfect B Aesthetic Medicine, clínica de medicina estética en Doral, Florida. Funciona como vitrina de tratamientos y como sistema de reservas online, con pasarela de pagos Stripe, agenda de citas y tratamientos vía la API de Phorest y automatizaciones con Zapier. Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza. Todos los derechos reservados son reservados para Talent Phi.',
    details:
      'Sitio web para Perfect B Aesthetic Medicine, clínica de medicina estética y dermatología cosmética de pago directo ubicada en Doral, Florida (perfectb.com). Desarrollada en conjunto con la empresa Talent Phi y el programador full stack Santiago Loaiza (todos los derechos reservados son reservados para Talent Phi). Funciona como vitrina de los tratamientos (neurotoxina, tightening de piel, eliminación de tatuajes, péptidos, PDRN, acné y otros) y como sistema de reservas online totalmente bilingüe (inglés y español). Sitio principal construido con Astro, con componentes React y TypeScript en las partes interactivas como el buscador "Look it up" y el asistente Tina. El book de reservas es una aplicación PHP con panel de administración propio que gestiona el flujo de pasos, fechas disponibles y búsqueda con IA, guardando los datos en MySQL. Incluye una calculadora de precios de eliminación de tatuajes (PHP + JavaScript) que sirve byetattoo.com y perfectb.com/tattoo-removal-calculator. Integra pasarela de pagos con Stripe, agenda de citas, tratamientos y pagos de la clínica mediante la API de Phorest, y Podium para mensajes y llamadas. Suite completa de tracking y marketing con Google Tag Manager, GA4, Meta Pixel con la API de Conversiones, Microsoft Clarity y Trustindex para reseñas, además de múltiples automatizaciones con Zapier. Desplegado en un servidor propio en DigitalOcean con LiteSpeed y CyberPanel.',
    installCode: 'https://perfectb.com/',
    githubUrl: 'https://perfectb.com/',
    techStack: [
      'Astro',
      'React',
      'TypeScript',
      'PHP',
      'MySQL',
      'Stripe',
      'Phorest API',
      'Zapier',
      'Podium',
      'Google Tag Manager',
      'Google Analytics 4',
      'Meta Pixel (CAPI)',
      'Microsoft Clarity',
      'DigitalOcean',
      'LiteSpeed / CyberPanel',
    ],
    en: {
      role: 'I did the full stack development with Talent Phi and Santiago Loaiza',
      impact: [
        { value: '24/7', label: 'online booking and payments, no phone call needed' },
        { value: '2 languages', label: 'site and booking in English and Spanish' },
        { value: 'Phorest + Stripe', label: 'schedule and payments connected to the clinic system' },
      ],
      type: 'CLINIC WEBSITE / BOOKING',
      subtitle: 'Aesthetic medicine clinic site with online booking and payments',
      date: 'April 2026',
      description:
        'Website for Perfect B Aesthetic Medicine, an aesthetic medicine clinic in Doral, Florida. It works as a showcase of treatments and as an online booking system, with a Stripe payment gateway, appointment and treatment scheduling via the Phorest API, and automations with Zapier. Developed in partnership with Talent Phi and full stack developer Santiago Loaiza. All rights reserved to Talent Phi.',
      details:
        'Website for Perfect B Aesthetic Medicine, a direct-pay aesthetic medicine and cosmetic dermatology clinic located in Doral, Florida (perfectb.com). Developed in partnership with Talent Phi and full stack developer Santiago Loaiza (all rights reserved to Talent Phi). It works as a showcase of treatments (neurotoxin, skin tightening, tattoo removal, peptides, PDRN, acne and others) and as a fully bilingual (English and Spanish) online booking system. The main site is built with Astro, with React and TypeScript components in the interactive parts such as the "Look it up" search and the Tina assistant. The booking app is a PHP application with its own admin panel that manages the step flow, available dates and AI-powered search, storing data in MySQL. It includes a tattoo removal pricing calculator (PHP + JavaScript) serving byetattoo.com and perfectb.com/tattoo-removal-calculator. It integrates a Stripe payment gateway, appointment scheduling, treatments and clinic payments through the Phorest API, and Podium for messages and calls. Complete tracking and marketing suite with Google Tag Manager, GA4, Meta Pixel with the Conversions API, Microsoft Clarity and Trustindex for reviews, plus multiple automations with Zapier. Deployed on a dedicated DigitalOcean server with LiteSpeed and CyberPanel.',
    },
  },
  {
    id: 'massalud-control-asistencia',
    categories: ['automatizacion'],
    role: 'Diseñé y desarrollé la automatización con Talent Phi',
    impact: [
      { value: 'Tiempo real', label: 'el jefe se entera de la llegada tarde al instante, no días después' },
      { value: '0 pasos manuales', label: 'cada marcación queda registrada en el ERP' },
      { value: 'Acceso restringido', label: 'indicadores visibles solo para RR. HH. y la Gerencia' },
    ],
    number: '05',
    type: 'AUTOMATIZACIÓN / RPA',
    title: 'Control de Asistencia MasSalud',
    subtitle: 'Alertas de llegadas tarde en Slack e indicadores de asistencia en el ERP',
    organization: 'Farmacias MasSalud (Santo Domingo, República Dominicana)',
    country: 'do',
    demo: 'massalud-erp',
    description:
      'Automatización RPA con Zapier para Farmacias MasSalud: cada vez que un empleado marca su huella en el sistema biométrico Nteco y llega tarde, el jefe recibe la notificación en Slack y la marcación se registra en el ERP interno "The Efficient Business System", en un módulo de indicadores visible solo para Recursos Humanos y la Gerencia General. Todos los derechos reservados son reservados para Talent Phi.',
    details:
      'Automatización del control de asistencia para Farmacias MasSalud en Santo Domingo, República Dominicana. Cada marcación de huella en el sistema biométrico Nteco dispara un flujo en Zapier que compara la hora de marcación con la hora esperada del turno del empleado. Si la llegada es tarde, envía en tiempo real una notificación al Slack del jefe con el nombre del empleado, la hora y los minutos de retraso. En paralelo, todas las marcaciones se registran en el ERP interno de la compañía, "The Efficient Business System", dentro del módulo Registro Horario: un panel con los indicadores clave (llegadas tarde, empleados con tardanza, minutos acumulados), filtros por fechas, nombre y departamento, y el registro detallado de fichajes. El módulo tiene acceso restringido y solo pueden verlo los usuarios de Recursos Humanos y el gerente general. Como el ERP es de uso empresarial privado, la demostración de este portafolio es una copia con información ficticia. Todos los derechos reservados son reservados para Talent Phi.',
    installCode: '',
    githubUrl: '',
    techStack: [
      'Zapier',
      'Nteco (biométrico)',
      'Slack',
      'Webhooks',
      'APIs REST',
      'ERP The Efficient Business System',
      'RPA / Automation',
    ],
    en: {
      role: 'I designed and built the automation with Talent Phi',
      impact: [
        { value: 'Real time', label: 'managers learn about late arrivals instantly, not days later' },
        { value: '0 manual steps', label: 'every clock-in is recorded in the ERP' },
        { value: 'Restricted access', label: 'metrics visible only to HR and senior management' },
      ],
      type: 'AUTOMATION / RPA',
      subtitle: 'Late-arrival alerts in Slack and attendance KPIs in the ERP',
      description:
        'RPA automation with Zapier for Farmacias MasSalud: every time an employee clocks in with their fingerprint on the Nteco biometric system and arrives late, the manager gets a Slack notification and the punch is recorded in the internal ERP "The Efficient Business System", in a KPI module visible only to Human Resources and the General Manager. All rights reserved to Talent Phi.',
      details:
        'Attendance control automation for Farmacias MasSalud in Santo Domingo, Dominican Republic. Each fingerprint punch on the Nteco biometric system triggers a Zapier flow that compares the punch time with the employee\'s expected shift time. If the arrival is late, it sends a real-time notification to the manager\'s Slack with the employee name, time and minutes late. In parallel, every punch is recorded in the company\'s internal ERP, "The Efficient Business System", in the Time Tracking module: a dashboard with key indicators (late arrivals, employees with lateness, accumulated minutes), filters by date, name and department, and the detailed punch log. The module has restricted access and can only be viewed by Human Resources users and the general manager. Since the ERP is for private business use, the demo in this portfolio is a copy with fictitious data. All rights reserved to Talent Phi.',
    },
  },
  {
    id: 'cambios-estructura-nomina',
    categories: ['automatizacion'],
    role: 'Diseñé y desarrollé la app, con Recursos Humanos como área usuaria',
    impact: [
      { value: '14 h → minutos', label: 'tiempo para aprobar un cambio de estructura' },
      { value: '954', label: 'empleados en 2 turnos cubiertos por la app' },
      { value: '4 departamentos', label: 'Soldadura, Pintura, Ensamble y DLI' },
    ],
    number: '06',
    type: 'APP EMPRESARIAL / POWER APPS',
    title: 'Cambios de Estructura y Nómina',
    subtitle: 'App en Power Apps para aprobar ascensos, traslados y cambios salariales en planta',
    organization: 'Renault Sofasa (Envigado, Colombia)',
    country: 'co',
    demo: 'renault-estructura',
    date: 'Mayo 2025 - Octubre 2025',
    description:
      'App en Power Apps para la planta de Renault Sofasa (954 empleados en 2 turnos): digitaliza las solicitudes de subida de nivel, ascenso, nombramiento como jefe y traslado entre Soldadura, Pintura, Ensamble y DLI, con aprobación de Recursos Humanos, avisos automáticos al jefe actual y al jefe nuevo, y registro del cambio salarial en nómina.',
    details:
      'Aplicación desarrollada en Power Apps para el área de Producción de Renault Sofasa, compuesta por 954 empleados distribuidos en dos turnos y cuatro departamentos principales: Soldadura, Pintura, Ensamble y DLI (Departamento de Logística Industrial). Antes, cada vez que un empleado subía de nivel, ascendía, se convertía en jefe o se trasladaba de departamento (por ejemplo, de Soldadura a Pintura), el cambio se llevaba por escrito a Recursos Humanos, que debía aprobarlo y luego avisar manualmente al jefe anterior que uno de sus empleados se iba y al jefe nuevo que llegaba alguien de otro departamento; el proceso podía tomar hasta 14 horas. En una planta donde sale un vehículo aproximadamente cada 4 minutos bajo estándares de alta calidad, ese tiempo era crítico. La app centraliza la solicitud digital, la aprobación de Recursos Humanos, la aprobación del jefe saliente y del jefe entrante, y el registro de la novedad salarial en nómina, reduciendo el proceso de horas a minutos. Como la app es de uso interno, la demostración de este portafolio es una recreación con información ficticia.',
    installCode: '',
    githubUrl: '',
    techStack: ['Power Apps', 'Power Automate', 'Power Fx', 'Microsoft 365', 'Flujos de aprobación'],
    en: {
      role: 'I designed and built the app, with HR as the user area',
      impact: [
        { value: '14 h → minutes', label: 'time to approve a structure change' },
        { value: '954', label: 'employees across 2 shifts covered by the app' },
        { value: '4 departments', label: 'Welding, Paint, Assembly and DLI' },
      ],
      type: 'ENTERPRISE APP / POWER APPS',
      subtitle: 'Power Apps app to approve promotions, transfers and salary changes on the plant floor',
      date: 'May 2025 - October 2025',
      description:
        'Power Apps app for the Renault Sofasa plant (954 employees across 2 shifts): it digitizes requests for level increases, promotions, appointments as manager and transfers between Welding, Paint, Assembly and DLI, with Human Resources approval, automatic notices to the current and new manager, and the salary change recorded in payroll.',
      details:
        'Application built in Power Apps for the Production area of Renault Sofasa, made up of 954 employees across two shifts and four main departments: Welding, Paint, Assembly and DLI (Industrial Logistics Department). Previously, whenever an employee moved up a level, was promoted, became a manager or transferred between departments (for example, from Welding to Paint), the change was taken in writing to Human Resources, which had to approve it and then manually notify the previous manager that one of their employees was leaving and the new manager that someone was arriving from another department; the process could take up to 14 hours. In a plant where a vehicle rolls off the line roughly every 4 minutes under high quality standards, that time was critical. The app centralizes the digital request, Human Resources approval, approval by the outgoing and incoming managers, and the recording of the salary change in payroll, reducing the process from hours to minutes. Since the app is for internal use, the demo in this portfolio is a recreation with fictitious data.',
    },
  },
  {
    id: 'automatizacion-tasas-cambio',
    categories: ['automatizacion', 'datos'],
    role: 'Diseñé y desarrollé el flujo para el área de Contabilidad',
    impact: [
      { value: '≈130 h', label: 'de trabajo manual ahorradas' },
      { value: '10 tasas', label: 'cada día hábil, sin digitarlas a mano' },
      { value: 'Validación', label: 'alerta automática si falta alguna de las 10 tasas' },
    ],
    number: '07',
    type: 'AUTOMATIZACIÓN / RPA',
    title: 'Automatización de Tasas de Cambio',
    subtitle: 'Flujo en n8n que lleva las tasas de cambio oficiales al correo de Contabilidad',
    organization: 'Simex (Colombia)',
    country: 'co',
    demo: 'simex-tasas',
    date: 'Febrero 2026 - Marzo 2026',
    description:
      'Flujo de n8n para el área de Contabilidad de Simex: de lunes a viernes a las 7:00 p. m. toma 10 tasas de cambio de la web oficial aprobada por el jefe de área, las convierte a pesos colombianos y las envía por Outlook a la persona encargada de cargarlas en el módulo de Epicor.',
    details:
      'Automatización desarrollada en n8n para el área de Contabilidad de Simex en Colombia. Antes, todos los días una persona debía consultar las tasas de cambio en la web oficial aprobada por el jefe del área y pasarlas a mano al módulo de tasas de Epicor. El flujo recrea ese proceso: un Schedule Trigger lo dispara de lunes a viernes a las 7:00 p. m. (hora de Bogotá), un nodo HTTP Request consulta la web oficial, se extrae la tabla de tasas del HTML, se separa por moneda y un nodo Code normaliza cada valor a pesos colombianos (COP). Las 10 monedas son: dólar estadounidense, euro, libra esterlina, yen japonés, yuan chino, real brasileño, peso argentino, sol peruano, corona sueca y peso mexicano. Un nodo If valida que hayan llegado las 10 tasas: si están completas se arma la tabla y se envía por Microsoft Outlook al responsable de las divisas; si falta alguna, se envía una alerta para revisarla manualmente. Este sistema ahorró aproximadamente 130 horas de trabajo manual y eliminó el riesgo de error humano en un reporte contable crítico. Como el flujo es de uso interno, la demostración de este portafolio es una recreación con información ficticia.',
    installCode: '',
    githubUrl: '',
    techStack: ['n8n', 'Schedule Trigger (cron)', 'HTTP Request', 'JavaScript', 'Microsoft Outlook', 'Epicor', 'RPA / Automation'],
    en: {
      role: 'I designed and built the workflow for Accounting',
      impact: [
        { value: '≈130 h', label: 'of manual work saved' },
        { value: '10 rates', label: 'every business day, no manual typing' },
        { value: 'Validation', label: 'automatic alert if any of the 10 rates is missing' },
      ],
      type: 'AUTOMATION / RPA',
      subtitle: 'n8n workflow that delivers the official exchange rates to the Accounting inbox',
      date: 'February 2026 - March 2026',
      description:
        'n8n workflow for the Accounting area at Simex: Monday to Friday at 7:00 p.m. it pulls 10 exchange rates from the official website approved by the area manager, converts them to Colombian pesos and emails them via Outlook to the person in charge of loading them into the Epicor module.',
      details:
        'Automation built in n8n for the Accounting area at Simex in Colombia. Previously, every day someone had to look up the exchange rates on the official website approved by the area manager and type them by hand into the Epicor exchange-rate module. The workflow recreates that process: a Schedule Trigger fires it Monday to Friday at 7:00 p.m. (Bogotá time), an HTTP Request node queries the official website, the rates table is extracted from the HTML, split by currency, and a Code node normalizes each value to Colombian pesos (COP). The 10 currencies are: US dollar, euro, pound sterling, Japanese yen, Chinese yuan, Brazilian real, Argentine peso, Peruvian sol, Swedish krona and Mexican peso. An If node checks that all 10 rates arrived: if complete, the table is built and sent through Microsoft Outlook to the person in charge of currencies; if any is missing, an alert is sent so it can be checked manually. This system saved approximately 130 hours of manual work and eliminated the risk of human error in a critical accounting report. Since the workflow is for internal use, the demo in this portfolio is a recreation with fictitious data.',
    },
  },
  {
    id: 'analisis-datos-estadisticos',
    categories: ['datos'],
    role: 'Analicé los datos y construí el reporte para Pintura y Ensamble',
    impact: [
      { value: '5 KPIs', label: 'de calidad de Pintura, entre ellos DPU y FTT' },
      { value: '4 UET', label: 'de Ensamble en un mapa de calor de defectos' },
      { value: 'Pareto', label: 'para priorizar las acciones de mejora por tipo de defecto' },
    ],
    number: '08',
    type: 'ANÁLISIS DE DATOS / BI',
    title: 'Análisis de Datos Estadísticos',
    subtitle: 'Indicadores de calidad de pintura y mapa de calor de defectos en las UET de Ensamble',
    organization: 'Renault Sofasa (Envigado, Colombia)',
    country: 'co',
    demo: 'renault-calidad',
    date: 'Octubre 2025 - Diciembre 2025',
    description:
      'Reporte en Looker y Looker Studio con los indicadores clave de fábrica del departamento de Pintura para encontrar defectos de calidad en la fabricación de vehículos, y un mapa de calor que muestra dónde se producen los mayores defectos en las 4 UET de Ensamble: Trim, Mecánica, Final y Entregas.',
    details:
      'Proyecto de análisis de datos para Renault Sofasa desarrollado en Looker y Looker Studio. Se construyeron los indicadores clave de fábrica del departamento de Pintura para detectar defectos de calidad en la fabricación de vehículos: vehículos inspeccionados, defectos detectados, DPU (defectos por unidad) frente a la meta, FTT (vehículos que pasan sin retoque) y defectos críticos, con su tendencia diaria y un Pareto por tipo de defecto (rayones, golpes, desconchados, inclusiones, entre otros). Después se creó un mapa de calor de las 4 UET (Unidades Elementales de Trabajo) del departamento de Ensamble, en el orden de la línea: Trim, Mecánica, Final y Entregas, cruzado por zona del vehículo, tipo de defecto y hora del turno, para identificar en qué UET y en qué parte del vehículo se concentran los mayores defectos de calidad y priorizar las acciones de mejora. Como el reporte es de uso interno, la demostración de este portafolio es una recreación con información ficticia.',
    installCode: '',
    githubUrl: '',
    techStack: ['Looker', 'Looker Studio', 'SQL', 'KPIs de calidad (DPU, FTT)', 'Mapas de calor', 'Análisis de Pareto'],
    en: {
      role: 'I analyzed the data and built the report for Paint and Assembly',
      impact: [
        { value: '5 KPIs', label: 'for Paint quality, including DPU and FTT' },
        { value: '4 UETs', label: 'of Assembly in a defect heat map' },
        { value: 'Pareto', label: 'to prioritize improvement actions by defect type' },
      ],
      type: 'DATA ANALYSIS / BI',
      subtitle: 'Paint quality KPIs and a defect heat map across the Assembly UETs',
      date: 'October 2025 - December 2025',
      description:
        'Looker and Looker Studio report with the key factory indicators for the Paint department to find quality defects in vehicle manufacturing, plus a heat map showing where the biggest defects occur across the 4 Assembly UETs: Trim, Mechanical, Final and Deliveries.',
      details:
        'Data analysis project for Renault Sofasa built in Looker and Looker Studio. The key factory indicators for the Paint department were built to detect quality defects in vehicle manufacturing: vehicles inspected, defects detected, DPU (defects per unit) against target, FTT (vehicles passing without rework) and critical defects, with their daily trend and a Pareto by defect type (scratches, dents, chips, inclusions, among others). A heat map was then created for the 4 UETs (Elementary Work Units) of the Assembly department, in line order: Trim, Mechanical, Final and Deliveries, crossed by vehicle zone, defect type and shift hour, to identify in which UET and which part of the vehicle the biggest quality defects concentrate and prioritize improvement actions. Since the report is for internal use, the demo in this portfolio is a recreation with fictitious data.',
    },
  },
  {
    id: 'trazabilidad-agvs',
    categories: ['datos'],
    role: 'Desarrollé el mapa junto con el equipo de fabricación de Ensamble',
    impact: [
      { value: 'Tiempo real', label: 'posición y estado de cada AGV en el mapa de planta' },
      { value: '3 flujos', label: 'puertas, llantas y parabrisas hacia la UET Final' },
      { value: 'Historial', label: 'registro de cada movimiento para analizar retrasos' },
    ],
    number: '09',
    type: 'TRAZABILIDAD / INDUSTRIA 4.0',
    title: 'Trazabilidad de AGVs',
    subtitle: 'Mapa en tiempo real de los AGVs que abastecen la UET Final de Ensamble',
    organization: 'Renault Sofasa (Envigado, Colombia)',
    country: 'co',
    demo: 'agv-trazabilidad',
    date: '2025',
    description:
      'Mapa de trazabilidad en tiempo real, hecho junto con el equipo de fabricación de Ensamble de Renault Sofasa, para seguir a los AGVs que llevan las puertas delanteras y traseras (lado izquierdo y derecho) desde Suministro Ensamble, una UET del DLI, hasta la UET Final, y a los AGVs que llevan las llantas y los parabrisas y lunetas a Final.',
    details:
      'Proyecto desarrollado en el departamento de Ensamble de Renault Sofasa en colaboración con el equipo de fabricación. Se creó un mapa de la planta donde se ven en tiempo real los AGVs (vehículos de guiado automático) que transportan las puertas delanteras y traseras, tanto del lado derecho como del lado izquierdo de los vehículos, desde la UET de Suministro Ensamble, perteneciente al departamento DLI (Logística Industrial), hasta Final, la cuarta UET de Ensamble. Otros AGVs llevan las llantas desde la zona de Llantas, y los parabrisas y lunetas desde la zona de Parabrisas-Lunetas, hasta la UET Final. La trazabilidad en tiempo real era clave porque cualquier retraso de un AGV detiene el abastecimiento de la línea: el mapa muestra la posición de cada AGV sobre los nodos de guiado, si va cargado o vacío, cuándo carga, cuándo entrega en Final, si está esperando paso y el registro de cada movimiento. Como el sistema es de uso interno, la demostración de este portafolio es una recreación con un plano simplificado e información ficticia.',
    installCode: '',
    githubUrl: '',
    techStack: ['Trazabilidad en tiempo real', 'AGVs', 'Mapa de planta', 'Logística interna', 'Industria 4.0'],
    en: {
      role: 'I built the map with the Assembly manufacturing team',
      impact: [
        { value: 'Real time', label: 'position and status of every AGV on the plant map' },
        { value: '3 flows', label: 'doors, tires and windshields to the Final UET' },
        { value: 'History', label: 'log of every movement to analyze delays' },
      ],
      type: 'TRACEABILITY / INDUSTRY 4.0',
      subtitle: 'Real-time map of the AGVs that supply the Final UET in Assembly',
      date: '2025',
      description:
        'Real-time traceability map, built together with the Renault Sofasa Assembly manufacturing team, to track the AGVs that carry the front and rear doors (left and right side) from Assembly Supply, a DLI UET, to the Final UET, and the AGVs that carry the tires and the windshields and rear windows to Final.',
      details:
        'Project developed in the Assembly department of Renault Sofasa in collaboration with the manufacturing team. A plant map was created showing in real time the AGVs (automated guided vehicles) that carry the front and rear doors, for both the right and left side of the vehicles, from the Assembly Supply UET, which belongs to the DLI (Industrial Logistics) department, to Final, the fourth Assembly UET. Other AGVs carry the tires from the Tires area, and the windshields and rear windows from the Windshields area, to the Final UET. Real-time traceability was key because any AGV delay stops the line supply: the map shows each AGV\'s position on the guidance nodes, whether it is loaded or empty, when it loads, when it delivers to Final, whether it is waiting for clearance, and a log of every movement. Since the system is for internal use, the demo in this portfolio is a recreation with a simplified layout and fictitious data.',
    },
  },
  {
    id: 'rechazos-defectos-calidad',
    categories: ['automatizacion', 'datos'],
    role: 'Diseñé la solución y desarrollé el flujo para Calidad, Soldadura y Ensamble',
    impact: [
      { value: '1 escaneo', label: 'reemplaza llevar la pieza a Calidad y calcular su precio' },
      { value: '8 UET', label: 'de Soldadura y Ensamble usan la app' },
      { value: 'Al instante', label: 'el valor del rechazo llega a la base de datos de Calidad' },
    ],
    number: '10',
    type: 'APP EMPRESARIAL / POWER AUTOMATE',
    title: 'Rechazos de Defectos de Calidad',
    subtitle: 'App para rechazar piezas defectuosas escaneando su identificador y registrar su valor al instante',
    organization: 'Renault Sofasa (Envigado, Colombia)',
    country: 'co',
    demo: 'renault-rechazos',
    date: '2025',
    description:
      'App con Power Automate para que las UET de Ensamble y Soldadura rechacen piezas defectuosas escaneando su identificador: el rechazo y el valor de la pieza llegan de inmediato a la base de datos de la UET de Calidad, sin que el operario tenga que llevar la pieza ni calcular su precio.',
    details:
      'Aplicación desarrollada para Renault Sofasa con Power Automate, usada por las UET (Unidades Elementales de Trabajo) de Soldadura (Base rodante, Superestructuras, Ferrage y Ouvrants) y de Ensamble (Trim, Mecánica, Final y Entregas) para rechazar piezas defectuosas que ya no estaban aptas para su ensamble o su fabricación. Pintura, que está entre Soldadura y Ensamble, maneja sus defectos por otro proceso. Cada rechazo tiene un valor real que se carga a la UET que estaba ensamblando o soldando la pieza. Antes, el operario debía llevar la pieza hasta la UET de Calidad y luego calcular su precio, perdiendo tiempo de producción. Con la solución propuesta, basada en el identificador de cada pieza, el operario solo la escanea desde la app, elige el motivo y la cantidad, y el flujo obtiene el precio, calcula el valor del rechazo y lo registra de inmediato en la base de datos de la UET de Calidad. En Renault Sofasa el tiempo es el recurso más valioso porque no regresa: cada minuto de mano de obra perdido es un carro menos fabricado, y un carro menos fabricado son menos ventas e ingresos para la compañía; por eso la app le devuelve ese tiempo a la línea de producción. Como la app es de uso interno, la demostración de este portafolio es una recreación con información ficticia.',
    installCode: '',
    githubUrl: '',
    techStack: ['Power Automate', 'Power Apps', 'Escaneo de códigos', 'Base de datos de Calidad', 'Microsoft 365'],
    en: {
      role: 'I designed the solution and built the workflow for Quality, Welding and Assembly',
      impact: [
        { value: '1 scan', label: 'replaces carrying the part to Quality and pricing it' },
        { value: '8 UETs', label: 'in Welding and Assembly use the app' },
        { value: 'Instantly', label: 'the reject value reaches the Quality database' },
      ],
      type: 'ENTERPRISE APP / POWER AUTOMATE',
      subtitle: 'App to reject defective parts by scanning their identifier and record their value instantly',
      date: '2025',
      description:
        'App built with Power Automate so the Assembly and Welding UETs can reject defective parts by scanning their identifier: the rejection and the part value reach the Quality UET database immediately, without the operator having to carry the part or calculate its price.',
      details:
        'Application built for Renault Sofasa with Power Automate, used by the Welding UETs (Base rodante, Superestructuras, Ferrage and Ouvrants) and the Assembly UETs (Trim, Mechanical, Final and Deliveries) to reject defective parts that were no longer fit for assembly or manufacturing. Paint, which sits between Welding and Assembly, handles its defects through a different process. Each rejection has a real value that is charged to the UET that was assembling or welding the part. Previously, the operator had to carry the part to the Quality UET and then calculate its price, losing production time. With the proposed solution, based on each part\'s identifier, the operator simply scans it from the app, chooses the reason and quantity, and the flow gets the price, calculates the rejection value and records it immediately in the Quality UET database. At Renault Sofasa time is the most valuable resource because it never comes back: every minute of lost labor is one less car built, and one less car built means fewer sales and less revenue for the company; that is why the app gives that time back to the production line. Since the app is for internal use, the demo in this portfolio is a recreation with fictitious data.',
    },
  },
  {
    id: 'seleccion-operarios',
    categories: ['automatizacion'],
    role: 'Desarrollé la app con los maestros de 4 escuelas y las psicólogas de RR. HH.',
    impact: [
      { value: '5 bases', label: '4 escuelas de destreza y la RAC 5 en un mismo sistema' },
      { value: 'Automático', label: 'cálculo de las áreas para las que es apto cada aspirante' },
      { value: 'Semáforo', label: 'verde, amarillo o rojo por área en la base de datos de RR. HH.' },
    ],
    number: '11',
    type: 'APP MÓVIL / REACT NATIVE',
    title: 'Selección de Operarios',
    subtitle: 'App en tablets para calificar a los aspirantes en las escuelas de destreza y la RAC 5',
    organization: 'Renault Sofasa (Envigado, Colombia)',
    country: 'co',
    demo: 'renault-seleccion',
    date: '2025',
    description:
      'App en React Native para el proceso de selección de nuevos operarios de fabricación: los maestros de las escuelas de destreza de Ensamble, DLI, Soldadura y Pintura califican desde sus tablets la calidad y el tiempo de cada aspirante, las psicólogas de RRHH evalúan en la RAC 5, y el sistema calcula en qué áreas queda cada persona en la base de datos de RRHH: verde (apto), amarillo (en espera) o rojo (no apto).',
    details:
      'Aplicación desarrollada en React Native para el proceso de selección de nuevos operarios de las áreas de fabricación de Renault Sofasa. Los aspirantes llegaban en dos jornadas, mañana y tarde, en grupos de 4, y pasaban por 5 bases: las escuelas de destreza de Ensamble, DLI, Soldadura y Pintura, y luego la RAC 5, una oficina donde las psicólogas de Recursos Humanos evaluaban la parte psicológica. En cada escuela de destreza los maestros (Jaime y Daniela en Ensamble, Uriel en DLI, Juan y Robert en Soldadura, y Jota y Gabriel en Pintura) evaluaban las destrezas propias de su área con una calificación del trabajo y requisitos de evaluación como el tiempo y la calidad, y registraban la puntuación desde las tablets que entregó la empresa. Con esas calificaciones el sistema calcula en qué lugar de la fábrica queda cada aspirante: apto para todas las áreas, apto para algunas, medianamente apto (personas que quedan en espera por si se necesita más gente y se les puede llamar) o no apto. Todo se envía a la base de datos de Recursos Humanos, donde cada área aparece en verde si la persona es apta, en amarillo si es medianamente apta y en rojo si no lo es; una misma persona puede estar en verde para un área, en amarillo para otra y en rojo para otra. Como la app es de uso interno, la demostración de este portafolio es una recreación con información ficticia.',
    installCode: '',
    githubUrl: '',
    techStack: ['React Native', 'TypeScript', 'Tablets', 'Base de datos de RRHH', 'Evaluación por criterios'],
    en: {
      role: 'I built the app with the masters of 4 schools and the HR psychologists',
      impact: [
        { value: '5 stations', label: '4 skills schools and RAC 5 in a single system' },
        { value: 'Automatic', label: 'calculation of the areas each applicant is fit for' },
        { value: 'Traffic light', label: 'green, yellow or red per area in the HR database' },
      ],
      type: 'MOBILE APP / REACT NATIVE',
      subtitle: 'Tablet app to grade applicants at the skills schools and the RAC 5',
      date: '2025',
      description:
        'React Native app for the hiring process of new manufacturing operators: the instructors at the Assembly, DLI, Welding and Paint skills schools grade each applicant\'s quality and time from their tablets, the HR psychologists evaluate at the RAC 5, and the system calculates which areas each person qualifies for in the HR database: green (fit), yellow (on hold) or red (not fit).',
      details:
        'Application built in React Native for the hiring process of new operators for the Renault Sofasa manufacturing areas. Applicants arrived in two shifts, morning and afternoon, in groups of 4, and went through 5 stations: the Assembly, DLI, Welding and Paint skills schools, and then the RAC 5, an office where the Human Resources psychologists evaluated the psychological side. At each skills school the instructors (Jaime and Daniela in Assembly, Uriel in DLI, Juan and Robert in Welding, and Jota and Gabriel in Paint) assessed the skills of their area with a grade for the work and evaluation requirements such as time and quality, and recorded the score from tablets provided by the company. With those grades the system calculates where in the plant each applicant fits: fit for all areas, fit for some, partially fit (people kept on hold in case more staff is needed and who can be called later) or not fit. Everything is sent to the Human Resources database, where each area shows in green if the person is fit, yellow if partially fit and red if not; the same person can be green for one area, yellow for another and red for another. Since the app is for internal use, the demo in this portfolio is a recreation with fictitious data.',
    },
  },
  {
    id: 'sitio-contadoras-aq',
    categories: ['web'],
    role: 'Diseñé, desarrollé y desplegué el sitio',
    impact: [
      { value: 'Next.js', label: 'sitio optimizado para rendimiento y SEO' },
      { value: 'Dominio propio', label: 'canal digital central para captar clientes' },
      { value: 'En producción', label: 'desplegado en Vercel' },
    ],
    number: '12',
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
      role: 'I designed, built and deployed the site',
      impact: [
        { value: 'Next.js', label: 'site optimized for performance and SEO' },
        { value: 'Own domain', label: 'main digital channel to win new clients' },
        { value: 'Live', label: 'deployed on Vercel' },
      ],
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
  role: 'Ingeniero de IA, Datos y Full Stack',
  bio: 'Soy desarrollador Fullstack con más de 3 años de experiencia en desarrollo web escalable, análisis de datos y soluciones de IA. He construido plataformas en producción para clínicas, e-commerce y empresas del sur de Florida junto a Talent Phi, además de proyectos de automatización, Business Intelligence e IA empresarial. Me apasiona convertir problemas de negocio en sistemas simples, medibles y fáciles de mantener.',
  profileLabel: 'GitHub',
  profileHandle: 'Juan-Fer-Agudelo',
  profileUrl: 'https://github.com/Juan-Fer-Agudelo',
};

export const WRITING_ARTICLES: WritingArticle[] = [
  ...SECURITY_WRITING_ARTICLES,
  ...CORE_WRITING_ARTICLES,
  ...EXTRA_WRITING_ARTICLES,
  ...MORE_WRITING_ARTICLES_1,
  ...MORE_WRITING_ARTICLES_2,
];
