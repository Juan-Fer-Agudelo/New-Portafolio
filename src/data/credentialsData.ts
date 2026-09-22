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

// Imágenes PNG de tu CV. Sube tus imágenes a src/assets/images/ y agrega las rutas aquí.
// Ejemplo: '/src/assets/images/cv-pagina-1.png'
export const CV_IMAGES: string[] = [
  // '/src/assets/images/cv-pagina-1.png',
  // '/src/assets/images/cv-pagina-2.png',
];

// Enlace opcional al PDF de tu CV (déjalo vacío si no tienes)
export const CV_PDF_URL = '';
