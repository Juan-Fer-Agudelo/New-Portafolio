import type { IconType } from 'react-icons';
import {
  SiReact,
  SiAstro,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiCss,
  SiHtml5,
  SiFramer,
  SiReactquery,
  SiVuedotjs,
  SiNuxt,
  SiAngular,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiDotnet,
  SiSharp,
  SiCplusplus,
  SiOpenjdk,
  SiPhp,
  SiGnubash,
  SiPostgresql,
  SiMongodb,
  SiApachekafka,
  SiApachecassandra,
  SiStripe,
  SiResend,
  SiGooglesheets,
  SiAnthropic,
  SiLooker,
  SiPlotly,
  SiN8N,
  SiZapier,
  SiSap,
  SiGoogletagmanager,
  SiGoogleanalytics,
  SiMeta,
  SiGithub,
  SiDocker,
  SiVercel,
  SiGooglecloud,
  SiFigma,
  SiUbuntu,
  SiCentos,
  SiLinuxmint,
  SiJira,
  SiReplit,
} from 'react-icons/si';
import { FaDatabase, FaMicrosoft, FaWindows, FaCubes, FaRobot } from 'react-icons/fa';

export interface Skill {
  name: string;
  level: string;
  levelEn: string;
  icon: IconType | null;
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
      { name: 'React 19 / React', ...L.adv, icon: SiReact, color: '#61DAFB' },
      { name: 'Astro 6 (SSR & Islands)', ...L.adv, icon: SiAstro, color: '#BC52EE' },
      { name: 'Next.js', ...L.intAdv, icon: SiNextdotjs, color: '#000000' },
      { name: 'React Native', ...L.int, icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', ...L.adv, icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript (ES6+)', ...L.adv, icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS 4', ...L.adv, icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'CSS3 / Vanilla CSS', ...L.adv, icon: SiCss, color: '#1572B6' },
      { name: 'HTML5 semántico', ...L.adv, icon: SiHtml5, color: '#E34F26' },
      { name: 'Framer Motion / Motion', ...L.intAdv, icon: SiFramer, color: '#0055FF' },
      { name: 'TanStack React Query', ...L.intAdv, icon: SiReactquery, color: '#FF4154' },
      { name: 'Vue.js', ...L.int, icon: SiVuedotjs, color: '#4FC08D' },
      { name: 'Nuxt.js', ...L.int, icon: SiNuxt, color: '#00DC82' },
      { name: 'Angular', ...L.int, icon: SiAngular, color: '#DD0031' },
      { name: 'Vite', ...L.adv, icon: SiVite, color: '#646CFF' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    titleEn: 'Backend',
    skills: [
      { name: 'Node.js (v22+)', ...L.adv, icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express 5 / Express', ...L.adv, icon: SiExpress, color: '#000000' },
      { name: 'RESTful APIs Design', ...L.adv, icon: null },
      { name: 'Auth & Sessions (bcryptjs)', ...L.adv, icon: null },
      { name: 'Python', ...L.int, icon: SiPython, color: '#3776AB' },
      { name: 'Astro SSR sobre Express', ...L.adv, icon: SiAstro, color: '#BC52EE' },
      { name: '.NET', ...L.int, icon: SiDotnet, color: '#512BD4' },
      { name: 'C#', ...L.int, icon: SiSharp, color: '#512BD4' },
      { name: 'C++', ...L.int, icon: SiCplusplus, color: '#00599C' },
      { name: 'Java', ...L.int, icon: SiOpenjdk, color: '#437291' },
      { name: 'PHP', ...L.int, icon: SiPhp, color: '#777BB4' },
      { name: 'Bash', ...L.int, icon: SiGnubash, color: '#4EAA25' },
    ],
  },
  {
    id: 'databases',
    title: 'Bases de Datos & Almacenamiento',
    titleEn: 'Databases & Storage',
    skills: [
      { name: 'PostgreSQL (pg client)', ...L.intAdv, icon: SiPostgresql, color: '#4169E1' },
      { name: 'SQL Server (T-SQL)', ...L.int, icon: FaDatabase, color: '#CC2927' },
      { name: 'MongoDB', ...L.int, icon: SiMongodb, color: '#47A248' },
      { name: 'Apache Kafka', ...L.int, icon: SiApachekafka, color: '#231F20' },
      { name: 'Apache Cassandra', ...L.int, icon: SiApachecassandra, color: '#1287B1' },
      { name: 'SQL', ...L.intAdv, icon: FaDatabase, color: '#0f1b61' },
      { name: 'Modelado Relacional', ...L.intAdv, icon: null },
      { name: 'Replit Object Storage', ...L.int, icon: SiReplit, color: '#F26207' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integraciones & APIs',
    titleEn: 'Integrations & APIs',
    skills: [
      { name: 'Stripe API', ...L.intAdv, icon: SiStripe, color: '#635BFF' },
      { name: 'Resend API', ...L.adv, icon: SiResend, color: '#000000' },
      { name: 'Google Sheets API', ...L.adv, icon: SiGooglesheets, color: '#34A853' },
      { name: 'APIs REST & Webhooks', ...L.adv, icon: null },
    ],
  },
  {
    id: 'ai-data',
    title: 'IA & Análisis de Datos',
    titleEn: 'AI & Data Analysis',
    skills: [
      { name: 'LLM Integration & Prompt Engineering', ...L.intAdv, icon: FaRobot, color: '#412991' },
      { name: 'Claude', ...L.intAdv, icon: SiAnthropic, color: '#D97757' },
      { name: 'Microsoft Copilot Studio', ...L.intAdv, icon: FaMicrosoft, color: '#0078D4' },
      { name: 'Computer Vision & Redes Neuronales', ...L.int, icon: SiPython, color: '#3776AB' },
      { name: 'Voice Synthesis / TTS', ...L.int, icon: null },
      { name: 'Power BI', ...L.adv, icon: FaMicrosoft, color: '#F2C811' },
      { name: 'Looker Studio', ...L.adv, icon: SiLooker, color: '#4285F4' },
      { name: 'Dash (Python Analytics)', ...L.int, icon: SiPlotly, color: '#3F4F75' },
    ],
  },
  {
    id: 'automation',
    title: 'Automatización & ERP',
    titleEn: 'Automation & ERP',
    skills: [
      { name: 'n8n (RPA)', ...L.adv, icon: SiN8N, color: '#EA4B71' },
      { name: 'Zapier', ...L.int, icon: SiZapier, color: '#FF4A00' },
      { name: 'Power Automate', ...L.int, icon: FaMicrosoft, color: '#0066FF' },
      { name: 'Power Apps', ...L.int, icon: FaMicrosoft, color: '#742774' },
      { name: 'SAP & SAP Business One', ...L.int, icon: SiSap, color: '#0FAAFF' },
      { name: 'Epicor ERP', ...L.int, icon: FaCubes, color: '#0f1b61' },
      { name: 'Automatización de Procesos', ...L.adv, icon: null },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing, Analytics & SEO',
    titleEn: 'Marketing, Analytics & SEO',
    skills: [
      { name: 'Google Tag Manager', ...L.adv, icon: SiGoogletagmanager, color: '#246FDB' },
      { name: 'Google Analytics 4', ...L.adv, icon: SiGoogleanalytics, color: '#E37400' },
      { name: 'Meta Pixel', ...L.adv, icon: SiMeta, color: '#0467DF' },
      { name: 'Microsoft Clarity', ...L.adv, icon: FaMicrosoft, color: '#0078D4' },
      { name: 'SEO Técnico & Schema.org', ...L.adv, icon: null },
    ],
  },
  {
    id: 'tools',
    title: 'Herramientas & DevOps',
    titleEn: 'Tools & DevOps',
    skills: [
      { name: 'Git & GitHub', ...L.adv, icon: SiGithub, color: '#181717' },
      { name: 'Docker', ...L.int, icon: SiDocker, color: '#2496ED' },
      { name: 'Vercel', ...L.adv, icon: SiVercel, color: '#000000' },
      { name: 'Cloud Run / Contenedores', ...L.int, icon: SiGooglecloud, color: '#4285F4' },
      { name: 'Figma', ...L.intAdv, icon: SiFigma, color: '#F24E1E' },
      { name: 'Visual Studio Code', ...L.adv, icon: FaMicrosoft, color: '#007ACC' },
      { name: 'Visual Studio Community', ...L.int, icon: FaMicrosoft, color: '#5C2D91' },
      { name: 'Excel', ...L.adv, icon: FaMicrosoft, color: '#217346' },
      { name: 'SharePoint', ...L.int, icon: FaMicrosoft, color: '#0078D4' },
      { name: 'Ubuntu', ...L.int, icon: SiUbuntu, color: '#E95420' },
      { name: 'CentOS', ...L.int, icon: SiCentos, color: '#262577' },
      { name: 'Linux Mint', ...L.int, icon: SiLinuxmint, color: '#87CF3E' },
      { name: 'Windows', ...L.int, icon: FaWindows, color: '#0078D4' },
      { name: 'Scrum', ...L.intAdv, icon: null },
      { name: 'Jira', ...L.int, icon: SiJira, color: '#0052CC' },
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
