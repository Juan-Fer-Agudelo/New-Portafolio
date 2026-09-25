import { WritingArticle } from '../types';

const STORAGE_KEY = 'portfolio_blog_posts';

/** Post creado desde el panel de administración. Extiende WritingArticle con campos SEO adicionales. */
export interface StoredBlogPost extends WritingArticle {
  status: 'Published' | 'Draft';
  featuredImageUrl?: string;
  focusKeyword?: string;
  seoTitle?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  schemaJson?: string;
  createdAt: number;
}

/** Lee todos los posts guardados en localStorage. */
export function getStoredPosts(): StoredBlogPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredBlogPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Guarda la lista completa de posts en localStorage. */
export function saveStoredPosts(posts: StoredBlogPost[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  // Notifica a otras pestañas / vistas que los posts cambiaron
  window.dispatchEvent(new Event('blog-posts-updated'));
}

/** Agrega un nuevo post al inicio de la lista. */
export function addStoredPost(post: StoredBlogPost): void {
  const posts = getStoredPosts();
  saveStoredPosts([post, ...posts]);
}

/** Elimina un post por id. */
export function deleteStoredPost(id: string): void {
  const posts = getStoredPosts().filter((p) => p.id !== id);
  saveStoredPosts(posts);
}

/** Devuelve solo los posts publicados como WritingArticle (para el blog público). */
export function getPublishedArticles(): WritingArticle[] {
  return getStoredPosts()
    .filter((p) => p.status === 'Published')
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      date: p.date,
      tag: p.tag,
      title: p.title,
      excerpt: p.excerpt,
      readTime: p.readTime,
      metaDescription: p.metaDescription,
      contentHtml: p.contentHtml,
    }));
}
