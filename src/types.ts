export type PageView = 'home' | 'work' | 'about' | 'skills';

export interface ArticleAuthor {
  name: string;
  role: string;
  bio: string;
}

export interface ProjectLocale {
  type: string;
  subtitle: string;
  description: string;
  details: string;
  date?: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  installCode: string;
  githubUrl: string;
  techStack: string[];
  organization?: string;
  date?: string;
  url?: string;
  image?: string;
  // Versión en inglés de los campos de texto traducibles
  en?: ProjectLocale;
}

export interface WritingArticle {
  id: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  /** Slug usado en el deep link #blog-<slug>. Si no se define, se usa `id`. */
  slug?: string;
  /** Meta description SEO mostrada en <meta name="description"> al abrir el artículo. */
  metaDescription?: string;
  /** Cuerpo completo del artículo ya maquetado en HTML (encabezados, tablas, código, etc.). Si no se define, el modal muestra solo el excerpt. */
  contentHtml?: string;
}

export type ActiveModal =
  | 'none'
  | 'enfoque'
  | 'contact'
  | 'project-detail'
  | 'writing-detail'
  | 'email-success';
