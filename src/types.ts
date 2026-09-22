export type PageView = 'home' | 'work' | 'about';

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
}

export type ActiveModal = 'none' | 'enfoque' | 'contact' | 'project-detail' | 'email-success';
