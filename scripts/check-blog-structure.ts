/* Verifica que todos los artículos del blog tengan la misma estructura que
   "Cuándo migrar de un monolito a microservicios". Se ejecuta con `npm run test:blog`
   y falla (código 1) si algún artículo no la cumple. */
import { EXTRA_WRITING_ARTICLES } from '../src/data/blogArticles';
import { CORE_WRITING_ARTICLES } from '../src/data/blogArticlesCore';
import { MORE_WRITING_ARTICLES_1 } from '../src/data/blogArticlesMore1';
import { MORE_WRITING_ARTICLES_2 } from '../src/data/blogArticlesMore2';
import { SECURITY_WRITING_ARTICLES } from '../src/data/blogArticlesSecurity';
import type { WritingArticle } from '../src/types';

const articles: WritingArticle[] = [...SECURITY_WRITING_ARTICLES, ...CORE_WRITING_ARTICLES, ...EXTRA_WRITING_ARTICLES, ...MORE_WRITING_ARTICLES_1, ...MORE_WRITING_ARTICLES_2];

const count = (html: string, re: RegExp) => (html.match(re) || []).length;
const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const problemsOf = (a: WritingArticle): string[] => {
  const h = a.contentHtml ?? '';
  const p: string[] = [];
  const need = (ok: boolean, msg: string) => !ok && p.push(msg);

  need(/class="article-intro"/.test(h), 'falta la introducción');
  const takeaways = (h.match(/<div class="article-takeaways">[\s\S]*?<\/div>/)?.[0] ?? '').match(/<li>/g)?.length ?? 0;
  need(takeaways >= 4 && takeaways <= 5, `puntos clave: ${takeaways} (deben ser 4 o 5)`);
  need(/class="article-index"/.test(h), 'falta el índice');

  // Secciones numeradas (sin contar Preguntas Frecuentes ni Referencias)
  const numbered = [...h.matchAll(/<h2 id="[^"]+">(\d+)\. ([^<]+)<\/h2>/g)].map((m) => m[2]);
  need(numbered.length >= 6, `secciones numeradas: ${numbered.length} (deben ser al menos 6)`);
  need(numbered.some((t) => /error/i.test(t)), 'falta la sección de errores comunes');
  need(
    numbered.some((t) => /cu[aá]ndo no|no (usar|migrar|aplicar|conviene)|l[ií]mites|qu[eé] no (resuelve|es)/i.test(t)),
    'falta la sección de cuándo NO aplicarlo / límites'
  );
  const subs = count(h, /<h3 id="[^"]+">\d+\.\d+ /g);
  need(subs >= 3, `subsecciones numeradas (N.M): ${subs} (deben ser al menos 3)`);

  need(count(h, /class="article-diagram[ "]/g) >= 1, 'falta un diagrama');
  need(count(h, /class="article-table"/g) >= 1, 'falta una tabla comparativa');
  need(count(h, /class="article-code"/g) >= 1, 'falta un bloque de código o ejemplo');

  const faqs = count(h, /<details class="article-faq">/g);
  need(faqs === 5, `preguntas frecuentes: ${faqs} (deben ser 5)`);
  const refsBlock = h.split(/<h2 id="[^"]+-referencias">/)[1] ?? '';
  const refs = count(refsBlock.split('</ul>')[0], /<li>/g);
  need(refs >= 4, `referencias: ${refs} (deben ser al menos 4)`);
  need(/Escrito por <strong>Juan Fernando Agudelo<\/strong>/.test(h), 'falta la firma');

  // Cada enlace del índice debe apuntar a un encabezado que exista
  const ids = new Set([...h.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of h.matchAll(/<a href="#([^"]+)">/g)) need(ids.has(m[1]), `el índice apunta a #${m[1]}, que no existe`);

  // Etiquetas básicas balanceadas
  for (const tag of ['table', 'pre', 'details', 'ul', 'ol', 'svg']) {
    need(count(h, new RegExp(`<${tag}[\\s>]`, 'g')) === count(h, new RegExp(`</${tag}>`, 'g')), `etiquetas <${tag}> sin cerrar`);
  }

  const words = text(h).split(' ').length;
  need(words >= 1300, `extensión: ${words} palabras (debe tener al menos 1.300, como el artículo modelo)`);
  const meta = a.metaDescription ?? '';
  need(meta.length >= 110 && meta.length <= 160, `metaDescription: ${meta.length} caracteres (debe tener 110–160)`);
  const minutes = Number(a.readTime.match(/\d+/)?.[0]);
  need(Math.abs(minutes - words / 200) <= 2, `readTime "${a.readTime}" no corresponde a ${words} palabras (~${Math.round(words / 200)} min)`);
  return p;
};

let failed = 0;
const seen = new Set<string>();
for (const a of articles) {
  const slug = a.slug || a.id;
  const p = problemsOf(a);
  if (seen.has(slug)) p.push('slug repetido');
  seen.add(slug);
  if (p.length) {
    failed++;
    console.log(`✗ ${slug}\n  - ${p.join('\n  - ')}`);
  } else {
    console.log(`✓ ${slug}`);
  }
}
console.log(`\n${articles.length - failed}/${articles.length} artículos cumplen la estructura del artículo modelo.`);
process.exit(failed ? 1 : 0);
