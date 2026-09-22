import cvParte1 from '../assets/images/cv-parte-1.png';
import cvParte2 from '../assets/images/cv-parte-2.png';
import awsNetworking from '../assets/images/aws-application-networking-demonstrated.png';
import awsDataLakehouse from '../assets/images/aws-data-lakehouse-demonstrated.png';
import awsServerless from '../assets/images/aws-serverless-demonstrated.png';

// Credenciales y medallas. `image` es la insignia/medalla que se muestra.
export interface Credential {
  title: string;
  titleEn: string;
  issuer: string;
  image: string;
  url?: string;
}

export const CREDENTIALS: Credential[] = [
  {
    title: 'AWS Application Networking',
    titleEn: 'AWS Application Networking',
    issuer: 'Amazon Web Services',
    image: awsNetworking,
  },
  {
    title: 'AWS Data Lakehouse',
    titleEn: 'AWS Data Lakehouse',
    issuer: 'Amazon Web Services',
    image: awsDataLakehouse,
  },
  {
    title: 'AWS Serverless',
    titleEn: 'AWS Serverless',
    issuer: 'Amazon Web Services',
    image: awsServerless,
  },
];

// Imágenes PNG de tu CV (2 páginas).
export const CV_IMAGES: string[] = [cvParte1, cvParte2];

// Enlace opcional al PDF de tu CV (déjalo vacío si no tienes)
export const CV_PDF_URL = '';
