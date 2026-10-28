/* Verifica que los enlaces de "Referencias y Enlaces" de todos los artículos del blog
   respondan. Necesita internet, por eso no corre en `npm run check`: se ejecuta a mano con
   `npm run test:blog-links` cuando se agregan o cambian artículos. */
import { EXTRA_WRITING_ARTICLES } from '../src/data/blogArticles';
import { CORE_WRITING_ARTICLES } from '../src/data/blogArticlesCore';
import { MORE_WRITING_ARTICLES_1 } from '../src/data/blogArticlesMore1';
import { MORE_WRITING_ARTICLES_2 } from '../src/data/blogArticlesMore2';
import { SECURITY_WRITING_ARTICLES } from '../src/data/blogArticlesSecurity';

const articles = [...SECURITY_WRITING_ARTICLES, ...CORE_WRITING_ARTICLES, ...EXTRA_WRITING_ARTICLES, ...MORE_WRITING_ARTICLES_1, ...MORE_WRITING_ARTICLES_2];

// URL única → artículos que la usan
const links = new Map<string, string[]>();
for (const a of articles) {
  for (const m of (a.contentHtml ?? '').matchAll(/<a href="(https?:\/\/[^"]+)"/g)) {
    links.set(m[1], [...(links.get(m[1]) ?? []), a.slug || a.id]);
  }
}

const check = async (url: string): Promise<number | string> => {
  const opts = { redirect: 'follow' as const, signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link check)' } };
  try {
    let res = await fetch(url, { ...opts, method: 'HEAD' });
    // Algunos sitios no aceptan HEAD: se reintenta con GET
    if (res.status >= 400) res = await fetch(url, { ...opts, method: 'GET' });
    return res.status;
  } catch (e) {
    return (e as Error).name;
  }
};

const urls = [...links.keys()];
const results: [string, number | string][] = [];
for (let i = 0; i < urls.length; i += 8) {
  const batch = urls.slice(i, i + 8);
  results.push(...(await Promise.all(batch.map(async (u) => [u, await check(u)] as [string, number | string]))));
}

// 401/403/429 suelen ser bloqueos a robots, no enlaces rotos: se reportan aparte
const broken = results.filter(([, s]) => typeof s !== 'number' || (s >= 400 && ![401, 403, 429].includes(s)));
const blocked = results.filter(([, s]) => typeof s === 'number' && [401, 403, 429].includes(s));
console.log(`${urls.length} enlaces revisados en ${articles.length} artículos.`);
for (const [u, s] of blocked) console.log(`? ${s} ${u} (el sitio bloquea la verificación automática; revisar a mano)`);
for (const [u, s] of broken) console.log(`✗ ${s} ${u}\n    en: ${links.get(u)!.join(', ')}`);
console.log(broken.length ? `\n${broken.length} enlaces rotos.` : '\nNingún enlace roto.');
process.exit(broken.length ? 1 : 0);
