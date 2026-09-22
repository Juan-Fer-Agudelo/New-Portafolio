// Datos de habilidades. `icon` es el slug de Simple Icons (https://simpleicons.org)
// `color` es el color de marca (hex sin #). Si no hay icono de marca, icon es null.

export interface Skill {
  name: string;
  level: string;
  levelEn: string;
  icon: string | null;
  color?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  titleEn: string;
  skills: Skill[];
}

const L = {
  adv: { level: 'Avanzado', levelEn: 'Advanced' },
  intAdv: { level: 'Intermedio - Avanzado', levelEn: 'Intermediate - Advanced' },
  int: { level: 'Intermedio', levelEn: 'Intermediate' },
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    titleEn: 'Frontend',
    skills: [
      { name: 'React 19 / React', ...L.adv, icon: 'react', color: '61DAFB' },
      { name: 'Astro 6 (SSR & Islands)', ...L.adv, icon: 'astro', color: 'BC52EE' },
      { name: 'Next.js', ...L.intAdv, icon: 'nextdotjs', color: '000000' },
      { name: 'React Native', ...L.int, icon: 'react', color: '61DAFB' },
      { name: 'TypeScript', ...L.adv, icon: 'typescript', color: '3178C6' },
      { name: 'JavaScript (ES6+)', ...L.adv, icon: 'javascript', color: 'F7DF1E' },
      { name: 'Tailwind CSS 4', ...L.adv, icon: 'tailwindcss', color: '06B6D4' },
      { name: 'CSS3 / Vanilla CSS', ...L.adv, icon: 'css3', color: '1572B6' },
      { name: 'HTML5 semántico', ...L.adv, icon: 'html5', color: 'E34F26' },
      { name: 'shadcn/ui & Radix UI', ...L.adv, icon: 'radixui', color: '161618' },
      { name: 'Framer Motion / Motion', ...L.intAdv, icon: 'framer', color: '0055FF' },
      { name: 'TanStack React Query', ...L.intAdv, icon: 'reactquery', color: 'FF4154' },
      { name: 'Wouter & SPA Routing', ...L.int, icon: null },
      { name: 'Vue.js', ...L.int, icon: 'vuedotjs', color: '4FC08D' },
      { name: 'Nuxt.js', ...L.int, icon: 'nuxtdotjs', color: '00DC82' },
      { name: 'Angular', ...L.int, icon: 'angular', color: 'DD0031' },
      { name: 'Vite', ...L.adv, icon: 'vite', color: '646CFF' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    titleEn: 'Backend',
    skills: [
      { name: 'Node.js (v22+)', ...L.adv, icon: 'nodedotjs', color: '5FA04E' },
      { name: 'Express 5 / Express', ...L.adv, icon: 'express', color: '000000' },
      { name: 'RESTful APIs Design', ...L.adv, icon: null },
      { name: 'Auth & Sessions (bcryptjs)', ...L.adv, icon: null },
      { name: 'Python', ...L.int, icon: 'python', color: '3776AB' },
      { name: 'Astro SSR sobre Express', ...L.adv, icon: 'astro', color: 'BC52EE' },
      { name: '.NET', ...L.int, icon: 'dotnet', color: '512BD4' },
      { name: 'C#', ...L.int, icon: 'csharp', color: '512BD4' },
      { name: 'C++', ...L.int, icon: 'cplusplus', color: '00599C' },
      { name: 'Java', ...L.int, icon: 'openjdk', color: '437291' },
      { name: 'PHP', ...L.int, icon: 'php', color: '777BB4' },
      { name: 'Bash', ...L.int, icon: 'gnubash', color: '4EAA25' },
    ],
  },
  {
    id: 'databases',
    title: 'Bases de Datos & Almacenamiento',
    titleEn: 'Databases & Storage',
    skills: [
      { name: 'PostgreSQL (pg client)', ...L.intAdv, icon: 'postgresql', color: '4169E1' },
      { name: 'SQL Server (T-SQL)', ...L.int, icon: 'microsoftsqlserver', color: 'CC2927' },
      { name: 'MongoDB', ...L.int, icon: 'mongodb', color: '47A248' },
      { name: 'SQL', ...L.intAdv, icon: null },
      { name: 'Modelado Relacional', ...L.intAdv, icon: null },
      { name: 'Replit Object Storage', ...L.int, icon: 'replit', color: 'F26207' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integraciones & APIs',
    titleEn: 'Integrations & APIs',
    skills: [
      { name: 'Stripe API', ...L.intAdv, icon: 'stripe', color: '635BFF' },
      { name: 'Resend API', ...L.adv, icon: 'resend', color: '000000' },
      { name: 'Google Sheets API', ...L.adv, icon: 'googlesheets', color: '34A853' },
      { name: 'APIs REST & Webhooks', ...L.adv, icon: null },
    ],
  },
  {
    id: 'ai-data',
    title: 'IA & Análisis de Datos',
    titleEn: 'AI & Data Analysis',
    skills: [
      { name: 'LLM Integration & Prompt Engineering', ...L.intAdv, icon: 'openai', color: '412991' },
      { name: 'Claude', ...L.intAdv, icon: 'anthropic', color: 'D97757' },
      { name: 'Microsoft Copilot Studio', ...L.intAdv, icon: null },
      { name: 'Computer Vision & Redes Neuronales', ...L.int, icon: 'python', color: '3776AB' },
      { name: 'Voice Synthesis / TTS', ...L.int, icon: null },
      { name: 'Power BI', ...L.adv, icon: null },
      { name: 'Looker Studio', ...L.adv, icon: 'looker', color: '4285F4' },
      { name: 'Dash (Python Analytics)', ...L.int, icon: 'plotly', color: '3F4F75' },
    ],
  },
  {
    id: 'automation',
    title: 'Automatización & ERP',
    titleEn: 'Automation & ERP',
    skills: [
      { name: 'n8n (RPA)', ...L.adv, icon: 'n8n', color: 'EA4B71' },
      { name: 'Zapier', ...L.int, icon: 'zapier', color: 'FF4A00' },
      { name: 'Power Automate', ...L.int, icon: null },
      { name: 'Power Apps', ...L.int, icon: null },
      { name: 'SAP & SAP Business One', ...L.int, icon: 'sap', color: '0FAAFF' },
      { name: 'Epicor ERP', ...L.int, icon: null },
      { name: 'Automatización de Procesos', ...L.adv, icon: null },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing, Analytics & SEO',
    titleEn: 'Marketing, Analytics & SEO',
    skills: [
      { name: 'Google Tag Manager', ...L.adv, icon: 'googletagmanager', color: '246FDB' },
      { name: 'Google Analytics 4', ...L.adv, icon: 'googleanalytics', color: 'E37400' },
      { name: 'Meta Pixel', ...L.adv, icon: 'meta', color: '0467DF' },
      { name: 'Microsoft Clarity', ...L.adv, icon: null },
      { name: 'SEO Técnico & Schema.org', ...L.adv, icon: null },
    ],
  },
  {
    id: 'tools',
    title: 'Herramientas & DevOps',
    titleEn: 'Tools & DevOps',
    skills: [
      { name: 'Git & GitHub', ...L.adv, icon: 'github', color: '181717' },
      { name: 'Docker', ...L.int, icon: 'docker', color: '2496ED' },
      { name: 'Vercel', ...L.adv, icon: 'vercel', color: '000000' },
      { name: 'Cloud Run / Contenedores', ...L.int, icon: 'googlecloud', color: '4285F4' },
      { name: 'Figma', ...L.intAdv, icon: 'figma', color: 'F24E1E' },
      { name: 'Visual Studio Code', ...L.adv, icon: null },
      { name: 'Visual Studio Community', ...L.int, icon: null },
      { name: 'Excel', ...L.adv, icon: null },
      { name: 'SharePoint', ...L.int, icon: null },
      { name: 'Ubuntu', ...L.int, icon: 'ubuntu', color: 'E95420' },
      { name: 'CentOS', ...L.int, icon: 'centos', color: '262577' },
      { name: 'Linux Mint', ...L.int, icon: 'linuxmint', color: '87CF3E' },
      { name: 'Scrum', ...L.intAdv, icon: null },
      { name: 'Jira', ...L.int, icon: 'jira', color: '0052CC' },
      { name: 'Gestión de Dominios & DNS', ...L.intAdv, icon: null },
    ],
  },
];

export const SOFT_SKILLS = [
  {
    es: 'Capacidad analítica y resolución de problemas técnicos complejos',
    en: 'Analytical skills and complex technical problem-solving',
  },
  {
    es: 'Traducción de requerimientos de negocio a soluciones de software',
    en: 'Translation of business requirements into software solutions',
  },
  {
    es: 'Diseño de interfaces intuitivas orientadas al usuario final (UX/UI)',
    en: 'Design of intuitive, user-focused interfaces (UX/UI)',
  },
  {
    es: 'Trabajo multidisciplinario con equipos no técnicos (RRHH, Médicos, Finanzas, Psicología)',
    en: 'Multidisciplinary work with non-technical teams (HR, Medical, Finance, Psychology)',
  },
  {
    es: 'Optimización de procesos y enfoque en métricas de impacto empresarial',
    en: 'Process optimization and focus on business impact metrics',
  },
  {
    es: 'Autonomía en desarrollo End-to-End (desde arquitectura hasta despliegue)',
    en: 'Autonomy in End-to-End development (from architecture to deployment)',
  },
  {
    es: 'Adaptabilidad rápida a tecnologías de última generación',
    en: 'Rapid adaptability to cutting-edge technologies',
  },
];
