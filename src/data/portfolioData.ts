import { ProjectItem, WritingArticle, ArticleAuthor } from '../types';
import enhanceOg from '../assets/images/enhance-og.jpg';
import miamiBounceOg from '../assets/images/miami-bounce-og.jpg';
import peptidosOg from '../assets/images/peptidos-og.jpg';
import perfectbOg from '../assets/images/perfectb-og.webp';
import { EXTRA_WRITING_ARTICLES } from './blogArticles';
import { MORE_WRITING_ARTICLES_1 } from './blogArticlesMore1';
import { MORE_WRITING_ARTICLES_2 } from './blogArticlesMore2';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'enhance-work',
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
  bio: 'Juan Fernando Agudelo es desarrollador Fullstack con más de 3 años de experiencia en desarrollo web escalable, análisis de datos y soluciones de IA. Ha construido plataformas en producción para clínicas, e-commerce y empresas del sur de Florida junto a Talent Phi, además de proyectos de automatización, Business Intelligence e IA empresarial. Le apasiona convertir problemas de negocio en sistemas simples, medibles y fáciles de mantener.',
  profileLabel: 'GitHub',
  profileHandle: 'Juan-Fer-Agudelo',
  profileUrl: 'https://github.com/Juan-Fer-Agudelo',
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

const RENDER_PERF_CONTENT = `
<p class="article-intro">Una aplicación React lenta rara vez lo es por "React". Casi siempre es por renders que no deberían ocurrir, trabajo pesado en el hilo principal y datos que viajan sin control entre componentes. Este artículo recorre las causas reales de los cuellos de botella de rendimiento en el frontend y cómo medirlas antes de optimizar a ciegas.</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    <li>Optimizar sin medir es adivinar: el React Profiler y las Performance tabs del navegador te dicen dónde está el costo real.</li>
    <li>La mayoría de los re-renders innecesarios vienen de referencias nuevas en cada render (objetos, funciones, arrays) pasadas como props.</li>
    <li>memo, useMemo y useCallback son herramientas quirúrgicas, no decoradores que se ponen en todos lados.</li>
    <li>El code splitting y la carga diferida reducen el bundle inicial, que suele ser el mayor factor de lentitud percibida.</li>
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    <li><a href="#rp-medir">1. Primero medir, nunca adivinar</a></li>
    <li><a href="#rp-renders">2. Por qué se re-renderiza lo que no debería</a></li>
    <li><a href="#rp-memo">3. memo, useMemo y useCallback sin abusar</a></li>
    <li><a href="#rp-bundle">4. Bundle inicial y code splitting</a></li>
    <li><a href="#rp-faqs">Preguntas Frecuentes</a></li>
    <li><a href="#rp-referencias">Referencias y Enlaces</a></li>
  </ol>
</div>

<h2 id="rp-medir">1. Primero medir, nunca adivinar</h2>
<p>Antes de tocar una sola línea, abre el React DevTools Profiler y graba una interacción típica. Te muestra qué componentes se renderizaron, cuántas veces y cuánto costó cada uno. La pestaña Performance del navegador complementa esto con el panorama completo: layout, paint, scripting y tareas largas que bloquean el hilo principal. Si no tienes un número antes y después, no estás optimizando, estás reorganizando código y esperando suerte.</p>
<p>La métrica que importa al usuario no es cuántos renders ocurren, sino cuánto tarda la interfaz en responder. Un render extra de un componente trivial no se nota; uno de 300 ms en una lista grande sí. Prioriza por impacto medible.</p>

<h2 id="rp-renders">2. Por qué se re-renderiza lo que no debería</h2>
<p>Cuando un componente padre se renderiza, todos sus hijos se renderizan por defecto, aunque sus props no hayan cambiado de valor. El problema se agrava cuando pasas props que son referencias nuevas en cada render: un objeto literal, una función inline o un array recién creado. Para React esas referencias son distintas en cada ciclo, así que rompe cualquier comparación superficial.</p>
<p>La solución no es memoizar todo, sino estabilizar las referencias que realmente se pasan a componentes costosos o memoizados, y mantener el estado lo más cerca posible de donde se usa para que el árbol que se re-renderiza sea pequeño.</p>

<h2 id="rp-memo">3. memo, useMemo y useCallback sin abusar</h2>
<p><code>React.memo</code> evita el re-render de un componente si sus props no cambiaron por comparación superficial. <code>useMemo</code> cachea el resultado de un cálculo costoso y <code>useCallback</code> estabiliza la identidad de una función. La clave: cada uno tiene un costo propio (comparar props, guardar en caché). Aplicarlos a componentes baratos añade complejidad sin beneficio, y a veces empeora el rendimiento.</p>
<p>Regla práctica: memoiza cuando el componente es caro de renderizar, recibe las mismas props con frecuencia, o cuando una referencia inestable rompe la memoización de un hijo. Fuera de esos casos, déjalo simple.</p>

<h2 id="rp-bundle">4. Bundle inicial y code splitting</h2>
<p>El mayor costo de "lentitud" que percibe un usuario nuevo suele ser el tiempo de descarga y parseo del JavaScript inicial. Dividir el bundle con <code>React.lazy</code> y <code>Suspense</code>, cargar rutas bajo demanda y diferir librerías pesadas (editores, gráficos, mapas) hasta que se usen reduce drásticamente el Time To Interactive. Herramientas como el analizador de bundles de Vite o webpack-bundle-analyzer te muestran qué dependencias están inflando el paquete.</p>

<h2 id="rp-faqs">Preguntas Frecuentes</h2>

<details class="article-faq">
  <summary class="article-faq-question">¿Debo envolver todos mis componentes en React.memo?</summary>
  <div class="article-faq-answer"><p>No. memo tiene un costo de comparación de props en cada render. En componentes baratos ese costo no se recupera. Úsalo en componentes costosos o que reciben las mismas props repetidamente.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿useMemo mejora siempre el rendimiento?</summary>
  <div class="article-faq-answer"><p>No. useMemo guarda un valor en caché y compara dependencias en cada render. Para cálculos triviales el overhead es mayor que el ahorro. Resérvalo para cálculos genuinamente costosos o referencias que deben mantenerse estables.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Cómo sé si mi bundle es demasiado grande?</summary>
  <div class="article-faq-answer"><p>Usa un analizador de bundle (Vite tiene rollup-plugin-visualizer). Como referencia, si tu JS inicial supera varios cientos de KB comprimidos, el code splitting suele dar la mayor mejora en tiempo de carga.</p></div>
</details>

<h2 id="rp-referencias">Referencias y Enlaces</h2>
<ul>
  <li><strong>React Docs — Render and Commit</strong>: <a href="https://react.dev/learn/render-and-commit" target="_blank" rel="noopener noreferrer">react.dev/learn/render-and-commit</a></li>
  <li><strong>web.dev — Performance</strong>: <a href="https://web.dev/performance" target="_blank" rel="noopener noreferrer">web.dev/performance</a></li>
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. ¿Dudas sobre el rendimiento de tu frontend? Escríbeme.</p>
`;

const RAG_LLM_CONTENT = `
<p class="article-intro">Conectar un LLM a tus propios datos sin reentrenarlo es, hoy, el patrón más práctico para construir asistentes útiles. Se llama RAG (Retrieval-Augmented Generation) y combina una búsqueda semántica sobre tu información con la capacidad de redacción del modelo. Aquí explico cómo funciona de verdad y los errores que arruinan la calidad de las respuestas.</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    <li>RAG recupera fragmentos relevantes de tus datos y los inyecta en el prompt, en lugar de reentrenar el modelo.</li>
    <li>La calidad del RAG depende más del chunking y los embeddings que del propio modelo de lenguaje.</li>
    <li>Sin citar las fuentes recuperadas, pierdes trazabilidad y abres la puerta a alucinaciones difíciles de detectar.</li>
    <li>Un buen sistema de evaluación (preguntas y respuestas esperadas) es lo que separa un demo de un producto confiable.</li>
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    <li><a href="#rag-que">1. Qué es RAG y por qué no reentrenar</a></li>
    <li><a href="#rag-pipeline">2. El pipeline: chunking, embeddings y recuperación</a></li>
    <li><a href="#rag-errores">3. Errores que arruinan la calidad</a></li>
    <li><a href="#rag-eval">4. Cómo evaluar un sistema RAG</a></li>
    <li><a href="#rag-faqs">Preguntas Frecuentes</a></li>
    <li><a href="#rag-referencias">Referencias y Enlaces</a></li>
  </ol>
</div>

<h2 id="rag-que">1. Qué es RAG y por qué no reentrenar</h2>
<p>Reentrenar o hacer fine-tuning de un modelo para que "aprenda" tus documentos es caro, lento y se queda obsoleto en cuanto cambian los datos. RAG resuelve el problema de otra forma: en el momento de la pregunta, busca los fragmentos más relevantes de tu base de conocimiento y los pasa al modelo como contexto. El modelo no memoriza nada; redacta la respuesta usando lo que le entregaste. Actualizar el conocimiento es tan simple como actualizar los documentos indexados.</p>

<h2 id="rag-pipeline">2. El pipeline: chunking, embeddings y recuperación</h2>
<p>El flujo tiene tres piezas. Primero, el <strong>chunking</strong>: dividir los documentos en fragmentos coherentes, ni tan grandes que diluyan la relevancia ni tan pequeños que pierdan contexto. Segundo, los <strong>embeddings</strong>: convertir cada fragmento en un vector numérico que captura su significado, almacenado en una base vectorial. Tercero, la <strong>recuperación</strong>: convertir la pregunta en un vector y buscar los fragmentos más cercanos, que se inyectan en el prompt final.</p>

<h2 id="rag-errores">3. Errores que arruinan la calidad</h2>
<p>Los fallos más comunes no están en el modelo. Chunks mal cortados que parten una idea a la mitad, embeddings de baja calidad para el idioma de tus datos, recuperar demasiados fragmentos irrelevantes que confunden al modelo, y no incluir instrucciones claras para que responda solo con el contexto dado. Cada uno degrada la respuesta de forma silenciosa.</p>

<h2 id="rag-eval">4. Cómo evaluar un sistema RAG</h2>
<p>Un demo que responde bien a tres preguntas no es un producto. Construye un conjunto de evaluación con preguntas reales y respuestas esperadas, mide si la recuperación trae los fragmentos correctos y si la respuesta final es fiel a esos fragmentos. Sin esta métrica, cualquier cambio que hagas es una apuesta a ciegas.</p>

<h2 id="rag-faqs">Preguntas Frecuentes</h2>

<details class="article-faq">
  <summary class="article-faq-question">¿RAG o fine-tuning?</summary>
  <div class="article-faq-answer"><p>RAG para conocimiento que cambia y necesita trazabilidad. Fine-tuning para ajustar estilo, formato o comportamiento. A menudo se combinan: fine-tuning para el tono, RAG para los datos.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Qué base de datos vectorial elijo?</summary>
  <div class="article-faq-answer"><p>Para empezar, pgvector sobre PostgreSQL es suficiente y evita añadir infraestructura. Para escala alta, opciones dedicadas como Pinecone, Qdrant o Weaviate ofrecen más rendimiento y funciones de filtrado.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Cómo evito que el modelo invente respuestas?</summary>
  <div class="article-faq-answer"><p>Instruye explícitamente al modelo para responder solo con el contexto recuperado y decir "no lo sé" si no está. Y cita siempre las fuentes para que el usuario pueda verificar.</p></div>
</details>

<h2 id="rag-referencias">Referencias y Enlaces</h2>
<ul>
  <li><strong>Paper original de RAG</strong> — Lewis et al.: <a href="https://arxiv.org/abs/2005.11401" target="_blank" rel="noopener noreferrer">arxiv.org/abs/2005.11401</a></li>
  <li><strong>pgvector</strong>: <a href="https://github.com/pgvector/pgvector" target="_blank" rel="noopener noreferrer">github.com/pgvector/pgvector</a></li>
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. ¿Quieres construir un asistente con tus datos? Hablemos.</p>
`;

const POSTGRES_INDEX_CONTENT = `
<p class="article-intro">Una consulta que tarda 2 segundos no siempre necesita una base de datos más grande; casi siempre necesita el índice correcto. Entender cómo PostgreSQL decide ejecutar una consulta, y cómo leer su plan de ejecución, es la diferencia entre adivinar y resolver. Este artículo va directo a lo que importa.</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    <li>EXPLAIN ANALYZE es la herramienta número uno: muestra el plan real y dónde se va el tiempo.</li>
    <li>Un Seq Scan sobre una tabla grande casi siempre indica que falta un índice útil para ese filtro.</li>
    <li>Los índices aceleran lecturas pero ralentizan escrituras y ocupan espacio: no se indexa todo.</li>
    <li>El orden de las columnas en un índice compuesto determina qué consultas puede acelerar.</li>
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    <li><a href="#pg-explain">1. Leer el plan con EXPLAIN ANALYZE</a></li>
    <li><a href="#pg-scans">2. Seq Scan vs. Index Scan</a></li>
    <li><a href="#pg-compuestos">3. Índices compuestos y orden de columnas</a></li>
    <li><a href="#pg-costo">4. El costo oculto de indexar de más</a></li>
    <li><a href="#pg-faqs">Preguntas Frecuentes</a></li>
    <li><a href="#pg-referencias">Referencias y Enlaces</a></li>
  </ol>
</div>

<h2 id="pg-explain">1. Leer el plan con EXPLAIN ANALYZE</h2>
<p>Antes de añadir un índice, ejecuta <code>EXPLAIN ANALYZE</code> sobre la consulta lenta. Esto no solo estima el plan, lo ejecuta y mide tiempos reales. Fíjate en los nodos más costosos, el número de filas estimadas frente a las reales (una gran diferencia indica estadísticas desactualizadas) y si aparece un escaneo secuencial sobre una tabla grande.</p>

<h2 id="pg-scans">2. Seq Scan vs. Index Scan</h2>
<p>Un <strong>Seq Scan</strong> lee toda la tabla fila por fila. Para tablas pequeñas es lo correcto y más rápido. Para tablas grandes filtradas por una columna selectiva, es una señal de que falta un índice. Un <strong>Index Scan</strong> usa un índice para saltar directo a las filas relevantes. El planner elige según sus estadísticas, así que mantener <code>ANALYZE</code> al día es parte del trabajo.</p>

<h2 id="pg-compuestos">3. Índices compuestos y orden de columnas</h2>
<p>Un índice sobre <code>(a, b)</code> acelera filtros por <code>a</code> y por <code>a, b</code>, pero no por <code>b</code> solo. El orden importa: pon primero la columna que más filtra o que aparece en igualdades, y después la de rango. Un índice mal ordenado simplemente no se usa.</p>

<h2 id="pg-costo">4. El costo oculto de indexar de más</h2>
<p>Cada índice debe mantenerse en cada INSERT, UPDATE y DELETE, y ocupa espacio en disco y memoria. Indexar columnas que nunca se filtran, o duplicar índices que se solapan, ralentiza las escrituras sin beneficio. Audita periódicamente los índices no utilizados con las vistas de estadísticas de PostgreSQL.</p>

<h2 id="pg-faqs">Preguntas Frecuentes</h2>

<details class="article-faq">
  <summary class="article-faq-question">¿Por qué mi índice no se usa?</summary>
  <div class="article-faq-answer"><p>Causas típicas: la columna está dentro de una función en el WHERE, hay un cast implícito de tipos, la tabla es tan pequeña que el Seq Scan es más barato, o las estadísticas están desactualizadas. Ejecuta ANALYZE y revisa el WHERE.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Qué tipo de índice uso?</summary>
  <div class="article-faq-answer"><p>B-tree es el predeterminado y cubre la mayoría de los casos (igualdad y rangos). GIN para búsquedas en arrays y JSONB, GiST para datos geométricos y búsquedas por proximidad.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Indexar siempre mejora el rendimiento?</summary>
  <div class="article-faq-answer"><p>No. Mejora las lecturas filtradas pero penaliza las escrituras y consume recursos. En tablas con muchas escrituras y pocas lecturas, un exceso de índices perjudica.</p></div>
</details>

<h2 id="pg-referencias">Referencias y Enlaces</h2>
<ul>
  <li><strong>PostgreSQL Docs — Using EXPLAIN</strong>: <a href="https://www.postgresql.org/docs/current/using-explain.html" target="_blank" rel="noopener noreferrer">postgresql.org/docs/current/using-explain.html</a></li>
  <li><strong>Use The Index, Luke</strong>: <a href="https://use-the-index-luke.com" target="_blank" rel="noopener noreferrer">use-the-index-luke.com</a></li>
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. ¿Consultas lentas en producción? Puedo ayudarte a auditarlas.</p>
`;

const WEB_SECURITY_CONTENT = `
<p class="article-intro">La mayoría de las brechas de seguridad en aplicaciones web no vienen de ataques sofisticados, sino de descuidos básicos: validación que falta, secretos expuestos y confianza ciega en datos del cliente. Este artículo repasa los fundamentos que todo desarrollador fullstack debería aplicar por defecto, sin necesidad de ser experto en seguridad.</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    <li>Nunca confíes en datos del cliente: valida y sanitiza en el servidor, siempre.</li>
    <li>Las consultas parametrizadas eliminan la inyección SQL; concatenar strings la invita.</li>
    <li>Los secretos van en variables de entorno, nunca en el código ni en el repositorio.</li>
    <li>HTTPS, cabeceras de seguridad y cookies con flags adecuados son protección de base, no opcional.</li>
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    <li><a href="#sec-validar">1. Valida en el servidor, no solo en el cliente</a></li>
    <li><a href="#sec-inyeccion">2. Inyección SQL y consultas parametrizadas</a></li>
    <li><a href="#sec-secretos">3. Manejo de secretos y variables de entorno</a></li>
    <li><a href="#sec-headers">4. HTTPS, cabeceras y cookies seguras</a></li>
    <li><a href="#sec-faqs">Preguntas Frecuentes</a></li>
    <li><a href="#sec-referencias">Referencias y Enlaces</a></li>
  </ol>
</div>

<h2 id="sec-validar">1. Valida en el servidor, no solo en el cliente</h2>
<p>La validación en el navegador mejora la experiencia de usuario, pero no es seguridad: cualquiera puede saltarse el frontend y llamar directo a tu API. Toda entrada que llega al servidor debe validarse ahí: tipos, longitudes, formatos y rangos permitidos. Trata cada dato externo como potencialmente malicioso hasta demostrar lo contrario.</p>

<h2 id="sec-inyeccion">2. Inyección SQL y consultas parametrizadas</h2>
<p>La inyección SQL ocurre cuando construyes consultas concatenando entrada del usuario. La defensa es simple y total: usa consultas parametrizadas o un ORM que las use por debajo. Nunca interpoles valores directamente en el string de la consulta. Esta única práctica elimina toda una clase de vulnerabilidades críticas.</p>

<h2 id="sec-secretos">3. Manejo de secretos y variables de entorno</h2>
<p>Claves de API, contraseñas de base de datos y tokens jamás deben vivir en el código ni subirse al repositorio. Van en variables de entorno, fuera del control de versiones (con el <code>.env</code> en el <code>.gitignore</code>). Si un secreto se filtra alguna vez, revócalo de inmediato: una vez en el historial de git, se considera comprometido.</p>

<h2 id="sec-headers">4. HTTPS, cabeceras y cookies seguras</h2>
<p>HTTPS cifra el tráfico y hoy es obligatorio, no opcional. Añade cabeceras de seguridad (Content-Security-Policy, X-Content-Type-Options, Strict-Transport-Security) para reducir la superficie de ataque. Las cookies de sesión deben marcarse <code>HttpOnly</code>, <code>Secure</code> y <code>SameSite</code> para mitigar robo de sesión y CSRF.</p>

<h2 id="sec-faqs">Preguntas Frecuentes</h2>

<details class="article-faq">
  <summary class="article-faq-question">¿Un ORM me protege de la inyección SQL?</summary>
  <div class="article-faq-answer"><p>En sus operaciones normales sí, porque parametriza. Pero si usas consultas crudas (raw queries) concatenando entrada, vuelves a ser vulnerable. Mantén la parametrización incluso en raw queries.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">Subí una clave de API al repositorio por error, ¿qué hago?</summary>
  <div class="article-faq-answer"><p>Revócala y genera una nueva de inmediato. Reescribir el historial de git ayuda, pero debes asumir que la clave quedó comprometida desde el momento en que se subió.</p></div>
</details>

<details class="article-faq">
  <summary class="article-faq-question">¿Necesito un pentest para estar seguro?</summary>
  <div class="article-faq-answer"><p>Un pentest es valioso, pero primero cubre lo básico: validación en servidor, consultas parametrizadas, gestión de secretos, HTTPS y dependencias actualizadas. La mayoría de incidentes explotan fallos básicos, no vulnerabilidades exóticas.</p></div>
</details>

<h2 id="sec-referencias">Referencias y Enlaces</h2>
<ul>
  <li><strong>OWASP Top 10</strong>: <a href="https://owasp.org/www-project-top-ten" target="_blank" rel="noopener noreferrer">owasp.org/www-project-top-ten</a></li>
  <li><strong>OWASP Cheat Sheet Series</strong>: <a href="https://cheatsheetseries.owasp.org" target="_blank" rel="noopener noreferrer">cheatsheetseries.owasp.org</a></li>
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. ¿Quieres una revisión de seguridad de tu app? Contáctame.</p>
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
  {
    id: 'art-rendimiento-react',
    slug: 'optimizar-rendimiento-react-sin-adivinar',
    date: 'AGOSTO 2026',
    tag: 'FRONTEND',
    title: 'Optimizar el Rendimiento de React Sin Adivinar: Renders, Memoización y Bundle',
    metaDescription:
      'Cómo encontrar y resolver cuellos de botella reales en React: medir con el Profiler, evitar re-renders, usar memo/useMemo/useCallback con criterio y reducir el bundle inicial.',
    excerpt:
      'Guía práctica para diagnosticar por qué tu app React va lenta y resolverlo midiendo primero: re-renders innecesarios, memoización con criterio y code splitting para reducir el bundle.',
    readTime: '7 min de lectura',
    contentHtml: RENDER_PERF_CONTENT,
  },
  {
    id: 'art-rag-llm',
    slug: 'rag-conectar-llm-a-tus-datos',
    date: 'JULIO 2026',
    tag: 'AI / LLM',
    title: 'RAG: Cómo Conectar un LLM a Tus Propios Datos Sin Reentrenarlo',
    metaDescription:
      'Qué es Retrieval-Augmented Generation (RAG), cómo funciona el pipeline de chunking, embeddings y recuperación, y los errores que arruinan la calidad de las respuestas.',
    excerpt:
      'El patrón más práctico para construir asistentes con tus datos sin fine-tuning: cómo funciona el pipeline de RAG, los errores que degradan la calidad y cómo evaluarlo de verdad.',
    readTime: '8 min de lectura',
    contentHtml: RAG_LLM_CONTENT,
  },
  {
    id: 'art-postgres-indices',
    slug: 'indices-postgresql-consultas-lentas',
    date: 'JUNIO 2026',
    tag: 'DATABASES',
    title: 'Índices en PostgreSQL: Por Qué Tu Consulta Es Lenta y Cómo Arreglarla',
    metaDescription:
      'Cómo leer EXPLAIN ANALYZE, diferenciar Seq Scan de Index Scan, diseñar índices compuestos con el orden correcto y evitar el costo oculto de indexar de más en PostgreSQL.',
    excerpt:
      'Una consulta lenta rara vez necesita más hardware: necesita el índice correcto. Cómo leer el plan de ejecución, elegir índices y evitar el costo oculto de indexar de más.',
    readTime: '7 min de lectura',
    contentHtml: POSTGRES_INDEX_CONTENT,
  },
  {
    id: 'art-seguridad-web',
    slug: 'fundamentos-seguridad-web-fullstack',
    date: 'MAYO 2026',
    tag: 'SECURITY',
    title: 'Seguridad Web para Fullstack: Los Fundamentos Que Evitan el 90% de las Brechas',
    metaDescription:
      'Validación en servidor, consultas parametrizadas contra inyección SQL, manejo seguro de secretos y configuración de HTTPS, cabeceras y cookies: lo básico que todo fullstack debe aplicar.',
    excerpt:
      'La mayoría de las brechas explotan descuidos básicos, no ataques sofisticados. Validación en servidor, consultas parametrizadas, gestión de secretos y cabeceras seguras aplicadas por defecto.',
    readTime: '7 min de lectura',
    contentHtml: WEB_SECURITY_CONTENT,
  },
  ...EXTRA_WRITING_ARTICLES,
  ...MORE_WRITING_ARTICLES_1,
  ...MORE_WRITING_ARTICLES_2,
];
