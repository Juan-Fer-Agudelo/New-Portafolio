import React, { useState, useEffect } from 'react';
import { Plus, LogOut, FileText, ChevronLeft, ChevronRight, FileEdit, Trash2 } from 'lucide-react';
import faviconLogo from '../assets/images/favicon-32x32.png';
import { NewPostForm, PostFormData } from './NewPostForm';
import {
  getStoredPosts,
  addStoredPost,
  deleteStoredPost,
  StoredBlogPost,
} from '../data/blogStore';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const POSTS_PER_PAGE = 10;

/** Estima el tiempo de lectura a partir del contenido HTML. */
function estimateReadTime(html?: string): string {
  if (!html) return '1 min de lectura';
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lectura`;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [posts, setPosts] = useState<StoredBlogPost[]>([]);
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cargar posts guardados al montar
  useEffect(() => {
    setPosts(getStoredPosts());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  const handleNewPost = () => setIsNewPostFormOpen(true);

  const handlePostSubmit = (postData: PostFormData) => {
    const newPost: StoredBlogPost = {
      id: Date.now().toString(),
      slug: postData.slug,
      title: postData.title,
      excerpt: postData.excerpt,
      date: postData.date,
      tag: postData.category || 'BLOG',
      readTime: estimateReadTime(postData.content),
      status: postData.status,
      metaDescription: postData.metaDescription,
      contentHtml: postData.content,
      featuredImageUrl: postData.featuredImageUrl,
      focusKeyword: postData.focusKeyword,
      seoTitle: postData.seoTitle,
      ogImageUrl: postData.ogImageUrl,
      canonicalUrl: postData.canonicalUrl,
      schemaJson: postData.schemaJson,
      createdAt: Date.now(),
    };
    addStoredPost(newPost);
    setPosts(getStoredPosts());
    setIsNewPostFormOpen(false);
    setSelectedPostId(newPost.id);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este post?')) {
      deleteStoredPost(id);
      setPosts(getStoredPosts());
      if (selectedPostId === id) setSelectedPostId(null);
    }
  };

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="h-screen w-full bg-slate-50 flex font-sans overflow-hidden text-slate-900">
      {/* ============ SIDEBAR NAVEGACIÓN ============ */}
      <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-[72px] border-b border-slate-100">
          <img src={faviconLogo} alt="Logo" className="w-8 h-8 rounded-lg" />
          <div className="leading-tight">
            <p className="text-[14px] font-bold text-slate-900">Portafolio</p>
            <p className="text-[11px] text-slate-400">Panel de administración</p>
          </div>
        </div>

        {/* Time */}
        <div className="px-6 py-5">
          <p className="text-[24px] font-bold text-slate-900 tracking-tight leading-none">
            {formattedTime}
          </p>
          <p className="text-[12px] text-slate-400 mt-1.5 capitalize">{formattedDate}</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4">
          <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Contenido
          </p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] bg-[#9d41e8] text-white shadow-sm shadow-[#9d41e8]/25 transition-all">
            <FileText className="w-[18px] h-[18px]" />
            <span>Posts del Blog</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ============ LISTA DE POSTS ============ */}
      <section className="w-[360px] h-full bg-white border-r border-slate-200/80 flex flex-col shrink-0">
        {/* Header */}
        <div className="px-6 h-[72px] flex items-center border-b border-slate-100">
          <h1 className="text-[20px] font-bold text-slate-900">Blog</h1>
        </div>

        {/* New Post Button */}
        <div className="px-6 pt-5">
          <button
            onClick={handleNewPost}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#9d41e8] hover:bg-[#8a35d1] text-white font-semibold text-[14px] rounded-xl shadow-sm shadow-[#9d41e8]/25 transition-all"
          >
            <Plus className="w-[18px] h-[18px]" />
            <span>Nuevo Post</span>
          </button>
        </div>

        {/* Posts Counter */}
        <div className="px-6 pt-5 pb-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {posts.length} {posts.length === 1 ? 'Publicación' : 'Publicaciones'}
          </p>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {paginatedPosts.length > 0 ? (
            <div className="space-y-2">
              {paginatedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`group w-full text-left p-4 rounded-xl transition-all border cursor-pointer ${
                    selectedPostId === post.id
                      ? 'bg-[#faf5ff] border-[#9d41e8]/40 shadow-sm'
                      : 'bg-white border-slate-200/70 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <button
                      onClick={(e) => handleDeletePost(post.id, e)}
                      className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                        post.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {post.status === 'Published' ? 'Publicado' : 'Borrador'}
                    </span>
                    <span className="text-[11px] text-slate-400">{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-[13px] text-slate-400">Aún no hay publicaciones</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <span className="text-[12px] font-medium text-slate-500">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        )}
      </section>

      {/* ============ DETALLE / VISTA PREVIA ============ */}
      <main className="flex-1 h-full overflow-y-auto">
        {selectedPost ? (
          <div className="max-w-3xl mx-auto px-12 py-12">
            <div className="mb-6 flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 text-[12px] font-semibold rounded-md ${
                  selectedPost.status === 'Published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {selectedPost.status === 'Published' ? 'Publicado' : 'Borrador'}
              </span>
              <span className="text-[13px] text-slate-400">{selectedPost.date}</span>
            </div>
            <h1 className="text-[34px] font-bold text-slate-900 leading-tight mb-5">
              {selectedPost.title}
            </h1>
            {selectedPost.excerpt && (
              <p className="text-[17px] text-slate-500 leading-relaxed mb-8">
                {selectedPost.excerpt}
              </p>
            )}
            {selectedPost.featuredImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 mb-8">
                <img
                  src={selectedPost.featuredImageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="border-t border-slate-200 pt-8">
              {selectedPost.contentHtml ? (
                <div
                  className="prose prose-slate max-w-none text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml }}
                />
              ) : (
                <p className="text-[14px] text-slate-400 italic">Este post no tiene contenido.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-5">
              <FileEdit className="w-8 h-8 text-[#9d41e8]" />
            </div>
            <h2 className="text-[18px] font-semibold text-slate-800 mb-1.5">
              Selecciona una publicación
            </h2>
            <p className="text-[14px] text-slate-400 max-w-xs">
              Elige un post de la lista para ver su contenido, o crea uno nuevo.
            </p>
          </div>
        )}
      </main>

      {/* New Post Form Modal */}
      <NewPostForm
        isOpen={isNewPostFormOpen}
        onClose={() => setIsNewPostFormOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
};
