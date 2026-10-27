import { expect, test } from '@playwright/test';

/* Pruebas de SEO: metadatos, imagen OG, datos estructurados, robots.txt y sitemap. */

const SITE = 'https://juan-fer-digital.vercel.app';
const OG_IMAGE = `${SITE}/images/og-juan-fernando-agudelo.png`;

const meta = (page: import('@playwright/test').Page, selector: string) =>
  page.locator(selector).first().getAttribute('content');

test('la portada tiene título, descripción y URL canónica para Google', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toContain('Juan Fernando Agudelo');
  expect(title).toMatch(/Ingeniero de IA/);
  expect(title.length).toBeLessThanOrEqual(60);

  const description = (await meta(page, 'meta[name="description"]')) ?? '';
  expect(description).toMatch(/ingeniero de IA/i);
  expect(description).toMatch(/ingeniero de datos/i);
  expect(description).toMatch(/full stack/i);
  expect(description.length).toBeGreaterThan(120);
  expect(description.length).toBeLessThanOrEqual(160);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/`);
  expect(await meta(page, 'meta[name="robots"]')).toContain('index, follow');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('Open Graph y Twitter usan URL absolutas y la imagen OG de 1200×630', async ({ page, request }) => {
  await page.goto('/');
  expect(await meta(page, 'meta[property="og:url"]')).toBe(`${SITE}/`);
  expect(await meta(page, 'meta[property="og:image"]')).toBe(OG_IMAGE);
  expect(await meta(page, 'meta[name="twitter:image"]')).toBe(OG_IMAGE);
  expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
  expect(await meta(page, 'meta[property="og:image:width"]')).toBe('1200');
  expect(await meta(page, 'meta[property="og:image:height"]')).toBe('630');

  // La imagen existe en el sitio publicado y de verdad mide 1200×630 (cabecera PNG)
  const res = await request.get('/images/og-juan-fernando-agudelo.png');
  expect(res.ok()).toBe(true);
  const png = await res.body();
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
});

test('los datos estructurados describen a la persona y sus cargos', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const graph = JSON.parse(raw ?? '{}')['@graph'] as Record<string, unknown>[];
  const person = graph.find((n) => n['@type'] === 'Person')!;
  expect(person.name).toBe('Juan Fernando Agudelo');
  expect(person.jobTitle).toEqual(['Ingeniero de IA', 'Ingeniero de Datos', 'Desarrollador Full Stack']);
  expect(person.url).toBe(`${SITE}/`);
  expect(person.sameAs).toContain('https://www.linkedin.com/in/juan-fernando-agudelo-861b13264/');
  expect(graph.map((n) => n['@type'])).toEqual(expect.arrayContaining(['WebSite', 'ProfilePage', 'Person']));
});

test('robots.txt y sitemap.xml están publicados y apuntan al dominio', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  const robotsText = await robots.text();
  expect(robotsText).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  expect(robotsText).toContain('Disallow: /admin');

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain(`<loc>${SITE}/</loc>`);
  expect(xml).toContain(`<loc>${SITE}/blog</loc>`);
});

test('el archivo de verificación de Google Search Console está publicado', async ({ request }) => {
  const res = await request.get('/google821ca012ba817b86.html');
  expect(res.ok()).toBe(true);
  expect((await res.text()).trim()).toBe('google-site-verification: google821ca012ba817b86.html');
});

test('el panel de administración no se indexa', async ({ page }) => {
  await page.goto('/#admin');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('el texto principal menciona los cargos que se quieren posicionar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-subtitle')).toContainText('ingeniero de IA, ingeniero de datos y desarrollador Full Stack');
});
