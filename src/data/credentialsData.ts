import cvParte1 from '../assets/images/cv-parte-1.png';
import cvParte2 from '../assets/images/cv-parte-2.png';

// Credenciales y certificaciones. Edita esta lista con tus credenciales reales.
export interface Credential {
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export const CREDENTIALS: Credential[] = [
  {
    title: 'Desarrollo Full-Stack Web',
    issuer: 'Universidad Salazar y Herrera',
    date: '2022 - 2025',
  },
  {
    title: 'Inteligencia Artificial y Copilot Studio',
    issuer: 'Microsoft',
    date: '2025',
  },
  {
    title: 'Automatización de Procesos con n8n',
    issuer: 'Certificación Profesional',
    date: '2026',
  },
];

// Imágenes PNG de tu CV (2 páginas).
export const CV_IMAGES: string[] = [cvParte1, cvParte2];

// Enlace opcional al PDF de tu CV (déjalo vacío si no tienes)
export const CV_PDF_URL = '';
