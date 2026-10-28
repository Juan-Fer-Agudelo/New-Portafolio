import { expect, test } from '@playwright/test';
import { EXTRA_WRITING_ARTICLES } from '../src/data/blogArticles';
import { CORE_WRITING_ARTICLES } from '../src/data/blogArticlesCore';
import { MORE_WRITING_ARTICLES_1 } from '../src/data/blogArticlesMore1';
import { MORE_WRITING_ARTICLES_2 } from '../src/data/blogArticlesMore2';
import { SECURITY_WRITING_ARTICLES } from '../src/data/blogArticlesSecurity';

/* Abre cada artículo del blog en el navegador (escritorio y celular) y comprueba que se vea
   completo y sin desbordes. La estructura del HTML la valida scripts/check-blog-structure.ts. */

// Cada artículo con el id de su primera sección, para confirmar que se abrió el artículo correcto
const articles = [...SECURITY_WRITING_ARTICLES, ...CORE_WRITING_ARTICLES, ...EXTRA_WRITING_ARTICLES, ...MORE_WRITING_ARTICLES_1, ...MORE_WRITING_ARTICLES_2].map((a) => ({
  slug: a.slug || a.id,
  firstSection: a.contentHtml?.match(/<h2 id="([^"]+)"/)?.[1] ?? '',
}));

test('los 38 artículos abren completos y sin desbordes', async ({ page }) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  expect(articles).toHaveLength(38);

  for (const { slug, firstSection } of articles) {
    // Se recarga la página en cada artículo para no revisar por error el que ya estaba abierto
    await page.goto('about:blank');
    await page.goto(`/#blog-${slug}`);
    await expect(page.locator(`[id="${firstSection}"]`), `${slug}: no abrió`).toBeVisible();

    const check = await page.evaluate(() => {
      const visible = (el: Element) => (el as HTMLElement).offsetParent !== null || getComputedStyle(el).display !== 'none';
      return {
        figures: document.querySelectorAll('.article-figure').length,
        visibleDiagrams: [...document.querySelectorAll('.article-figure .article-diagram')].filter(
          (el) => getComputedStyle(el).display !== 'none'
        ).length,
        tables: document.querySelectorAll('.article-table').length,
        faqs: document.querySelectorAll('.article-faq').length,
        pageScrollX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        culprits: [...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 5).map((el) => el.tagName + '.' + String((el as HTMLElement).className).slice(0, 40) + ' ' + Math.round(el.getBoundingClientRect().right) + ' pos=' + getComputedStyle(el).position),
        sizes: document.documentElement.scrollWidth + '/' + document.documentElement.clientWidth,
        // Nada del artículo debe salirse del ancho de la ventana (las tablas y el código se desplazan dentro de su caja)
        overflowing: [...document.querySelectorAll('.article-intro ~ *:not(.article-table-wrap):not(pre)')]
          .filter((el) => visible(el) && el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
          .map((el) => el.tagName + '.' + (el.className || '')),
      };
    });
    expect(check.faqs, `${slug}: preguntas frecuentes`).toBe(5);
    expect(check.tables, `${slug}: tablas`).toBeGreaterThanOrEqual(1);
    // Cada diagrama muestra solo una de sus dos versiones (escritorio o celular)
    expect(check.visibleDiagrams, `${slug}: diagramas visibles`).toBe(check.figures);
    expect(check.pageScrollX, `${slug}: scroll horizontal ${check.sizes} ${check.culprits.join(' | ')}`).toBe(false);
    expect(check.overflowing, `${slug}: elementos desbordados`).toEqual([]);
  }
  expect(errors).toEqual([]);
});
