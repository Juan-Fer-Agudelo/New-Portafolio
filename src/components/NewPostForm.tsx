import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, Settings, Code, Sparkles } from 'lucide-react';

interface NewPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: PostFormData) => void;
}

export interface PostFormData {
  title: string;
  excerpt: string;
  slug: string;
  status: 'Published' | 'Draft';
  date: string;
  category: string;
  featuredImageUrl: string;
  focusKeyword: string;
  seoTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
  schemaJson: string;
  content: string;
}

const emptyForm: PostFormData = {
  title: '',
  excerpt: '',
  slug: '',
  status: 'Published',
  date: new Date().toISOString().split('T')[0],
  category: '',
  featuredImageUrl: '',
  focusKeyword: '',
  seoTitle: '',
  metaDescription: '',
  ogImageUrl: '',
  canonicalUrl: '',
  schemaJson: '',
  content: '',
};

const inputClass =
  'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#9d41e8] focus:ring-4 focus:ring-[#9d41e8]/10 focus:bg-white transition-all';

const labelClass = 'block text-[13px] font-semibold text-slate-700 mb-2';

export const NewPostForm: React.FC<NewPostFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PostFormData>(emptyForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-genera slug desde el título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert('Por favor completa al menos el título y el slug');
      return;
    }
    onSubmit(formData);
    setFormData(emptyForm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-4 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur flex justify-between items-center px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#9d41e8] to-[#7c3aed] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Nuevo Post</h2>
              <p className="text-[12.5px] text-slate-500">Crea un nuevo artículo para tu blog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[calc(100vh-220px)] overflow-y-auto">
          {/* ============ SECCIÓN: DETALLES DEL POST ============ */}
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <FileText className="w-4.5 h-4.5 text-[#9d41e8]" />
              <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
                Detalles del Post
              </h3>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className={labelClass}>
                  Título <span className="text-[#9d41e8]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Peptides for PCOS: Evidence by Peptide"
                  className={inputClass}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className={labelClass}>
                  Resumen / Excerpt{' '}
                  <span className="text-slate-400 font-normal text-[12px]">
                    (se muestra en las tarjetas del blog)
                  </span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Breve resumen del artículo..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Slug & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    Slug (URL) <span className="text-[#9d41e8]">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="peptides-for-pcos"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Date & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Categoría</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Salud, Ciencia, etc..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============ SECCIÓN: IMAGEN DESTACADA ============ */}
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <ImageIcon className="w-4.5 h-4.5 text-[#9d41e8]" />
              <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
                Imagen Destacada
              </h3>
            </div>

            <div>
              <label className={labelClass}>URL o ruta de la imagen</label>
              <input
                type="text"
                name="featuredImageUrl"
                value={formData.featuredImageUrl}
                onChange={handleChange}
                placeholder="https://... o /images/mi-imagen.webp"
                className={inputClass}
              />
              {formData.featuredImageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={formData.featuredImageUrl}
                    alt="Vista previa"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ============ SECCIÓN: SEO ============ */}
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <Settings className="w-4.5 h-4.5 text-[#9d41e8]" />
              <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
                Configuración SEO
              </h3>
            </div>

            <div className="space-y-5">
              {/* Focus Keyword */}
              <div>
                <label className={labelClass}>Palabra clave (Focus keyword)</label>
                <input
                  type="text"
                  name="focusKeyword"
                  value={formData.focusKeyword}
                  onChange={handleChange}
                  placeholder="peptides for pcos"
                  className={inputClass}
                />
              </div>

              {/* SEO Title */}
              <div>
                <label className={labelClass}>
                  SEO Title{' '}
                  <span className="text-slate-400 font-normal text-[12px]">
                    (debe contener la palabra clave)
                  </span>
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  placeholder="Peptides for PCOS: Evidence by Peptide | Portafolio"
                  className={inputClass}
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[13px] font-semibold text-slate-700">
                    Meta Description{' '}
                    <span className="text-slate-400 font-normal text-[12px]">(120-160 caracteres)</span>
                  </label>
                  <span
                    className={`text-[12px] font-medium ${
                      formData.metaDescription.length > 160
                        ? 'text-red-500'
                        : formData.metaDescription.length >= 120
                        ? 'text-emerald-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {formData.metaDescription.length} / 160
                  </span>
                </div>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Descripción que aparecerá en los resultados de búsqueda de Google..."
                  rows={3}
                  maxLength={160}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* OG Image & Canonical URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>OG Image URL (redes sociales)</label>
                  <input
                    type="text"
                    name="ogImageUrl"
                    value={formData.ogImageUrl}
                    onChange={handleChange}
                    placeholder="https://... o /images/..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Canonical URL</label>
                  <input
                    type="text"
                    name="canonicalUrl"
                    value={formData.canonicalUrl}
                    onChange={handleChange}
                    placeholder="https://www.tusitio.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Schema JSON */}
              <div>
                <label className={labelClass}>
                  Schema SEO (JSON-LD){' '}
                  <span className="text-slate-400 font-normal text-[12px]">
                    (Datos estructurados)
                  </span>
                </label>
                <textarea
                  name="schemaJson"
                  value={formData.schemaJson}
                  onChange={handleChange}
                  placeholder='{ "@context": "https://schema.org", "@type": "BlogPosting" ... }'
                  rows={4}
                  className={`${inputClass} font-mono text-[12.5px] bg-slate-900 text-emerald-300 border-slate-700 placeholder:text-slate-500 focus:bg-slate-900 focus:border-[#9d41e8]`}
                />
              </div>
            </div>
          </div>

          {/* ============ SECCIÓN: CONTENIDO ============ */}
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <Code className="w-4.5 h-4.5 text-[#9d41e8]" />
              <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">
                Contenido (HTML)
              </h3>
            </div>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="<p>Escribe aquí el contenido HTML del artículo...</p>"
              rows={8}
              className={`${inputClass} font-mono text-[12.5px] bg-slate-900 text-slate-100 border-slate-700 placeholder:text-slate-500 focus:bg-slate-900 focus:border-[#9d41e8]`}
            />
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur flex justify-end gap-3 px-8 py-5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold text-[14px] rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#9d41e8] hover:bg-[#8a35d1] text-white font-semibold text-[14px] rounded-xl shadow-lg shadow-[#9d41e8]/30 hover:shadow-[#9d41e8]/40 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Crear Post
          </button>
        </div>
      </div>
    </div>
  );
};
