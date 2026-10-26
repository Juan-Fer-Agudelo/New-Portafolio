export type PageView = 'home' | 'work' | 'about' | 'skills' | 'admin';

export interface ArticleAuthor {
  name: string;
  role: string;
  bio: string;
  /** Enlace de perfil público mostrado al pie de la tarjeta de autor. */
  profileLabel?: string;
  profileHandle?: string;
  profileUrl?: string;
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
  /** País donde se realizó el proyecto; muestra su bandera junto a la organización. */
  country?: 'do' | 'us' | 've' | 'co';
  date?: string;
  url?: string;
  image?: string;
  /** Demo interactiva con datos ficticios que se abre con el botón "Ver proyecto". */
  demo?: 'massalud-erp' | 'renault-estructura' | 'simex-tasas';
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
