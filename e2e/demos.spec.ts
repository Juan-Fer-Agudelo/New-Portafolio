import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/* Pruebas de humo: abren cada demo de "Ver proyecto" como lo haría un visitante,
   la usan un poco y comprueban que no haya errores ni contenido que se salga de la pantalla. */

let errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  await page.goto('/');
});

test.afterEach(async ({ page }, info) => {
  await page.screenshot({ path: info.outputPath('final.png') });
  expect(errors, 'La página no debe tener errores de JavaScript').toEqual([]);
});

const openDemo = async (page: Page, title: string) => {
  const card = page.locator('article.project-card-item', { has: page.locator('h3.open-source-title', { hasText: title }) });
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button', { name: /Ver proyecto/ }).click();
};

/** Ningún elemento que coincida debe tener contenido cortado o desbordado horizontalmente */
const expectNoOverflow = async (page: Page, selector: string) => {
  const overflowing = await page.locator(selector).evaluateAll((els) =>
    els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => (el as HTMLElement).innerText.slice(0, 60))
  );
  expect(overflowing, `Elementos desbordados en ${selector}`).toEqual([]);
};

/** Cada tabla debe caber en el ancho de su contenedor (en celular no debe obligar a deslizar de lado) */
const expectFitsContainer = async (page: Page, selector: string) => {
  const wide = await page.locator(selector).evaluateAll((els) =>
    els
      .filter((el) => el.getBoundingClientRect().width > (el.parentElement?.clientWidth ?? Infinity) + 1)
      .map((el) => `${el.className}: ${Math.round(el.getBoundingClientRect().width)}px`)
  );
  expect(wide, `Tablas más anchas que su contenedor (${selector})`).toEqual([]);
};

const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1000) <= 600;

/** La demo abierta no debe provocar scroll horizontal en la página */
const expectNoPageScrollX = async (page: Page) => {
  const { sw, w } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
  expect(sw).toBeLessThanOrEqual(w + 1);
};

const closeWithEscape = async (page: Page) => {
  await page.keyboard.press('Escape');
  await expect(page.locator('.dn-overlay, .msd-overlay, .rsd-overlay, .sxd-overlay, .cqd-overlay, .agd-overlay')).toHaveCount(0);
};

test('el portafolio carga con los 10 proyectos', async ({ page }) => {
  await expect(page.locator('article.project-card-item')).toHaveCount(10);
  await expect(page.getByRole('button', { name: /Ver proyecto/ })).toHaveCount(5);
});

test('MasSalud: ERP y alertas de Slack', async ({ page }) => {
  await openDemo(page, 'Control de Asistencia MasSalud');
  await expect(page.getByRole('heading', { name: 'ERP de uso empresarial privado' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver demostración del ERP' }).click();
  await expect(page.locator('.msd-table tbody tr').first()).toBeVisible();
  await expectFitsContainer(page, '.msd-table');
  await page.locator('.msd-slack-cta:visible, .msd-slack-link:visible').first().click();
  await page.getByRole('button', { name: 'Entendido, ver Slack' }).click();
  await expectNoPageScrollX(page);
  await closeWithEscape(page);
});

test('Renault: aprobar una solicitud de cambio', async ({ page }) => {
  await openDemo(page, 'Cambios de Estructura y Nómina');
  await page.getByRole('button', { name: 'Abrir la app' }).click();
  await expect(page.locator('.rsd-kpi')).toHaveCount(4);
  const nav = page.locator('.rsd-nav-item:visible, .rsd-tabbar button:visible');
  await nav.filter({ hasText: /Aprobaciones/i }).first().click();
  const before = await page.locator('.rsd-inbox-card').count();
  expect(before).toBeGreaterThan(0);
  await page.locator('.rsd-inbox-card').first().getByRole('button', { name: 'Aprobar' }).click();
  await expect(page.locator('.rsd-toast--show')).toBeVisible();
  await nav.filter({ hasText: 'Solicitudes' }).first().click();
  await expect(page.locator('.rsd-table tbody tr').first()).toBeVisible();
  await expectFitsContainer(page, '.rsd-table');
  await expectNoPageScrollX(page);
  await closeWithEscape(page);
});

test('Simex: ejecutar el flujo de n8n y ver el correo en Outlook', async ({ page }) => {
  await openDemo(page, 'Automatización de Tasas de Cambio');
  await page.getByRole('button', { name: 'Abrir el flujo en n8n' }).click();
  await expect(page.locator('.sxd-node')).toHaveCount(32);
  await page.getByRole('button', { name: /Test workflow/ }).click();
  await expect(page.locator('.sxd-delivered')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.sxd-node--success')).toHaveCount(29);
  await page.getByRole('button', { name: 'Ver en Outlook' }).click();
  await expect(page.locator('.sxd-mail-table tbody tr')).toHaveCount(10);
  // Las tasas deben variar de un día a otro (no todas en 0,00 %)
  const changes = await page.locator('.sxd-mail-table tbody td:last-child').allInnerTexts();
  expect(changes.filter((c) => !/0,00\s*%/.test(c)).length).toBeGreaterThan(5);
  await expectFitsContainer(page, '.sxd-mail-table');
  await expectNoPageScrollX(page);
  await closeWithEscape(page);
});

test('Calidad: indicadores y mapa de calor de las UET', async ({ page }) => {
  await openDemo(page, 'Análisis de Datos Estadísticos');
  await page.getByRole('button', { name: 'Abrir el reporte' }).click();
  await expect(page.locator('.cqd-card')).toHaveCount(5);
  await page.getByRole('button', { name: '90 días' }).click();
  await expectFitsContainer(page, '.cqd-table');
  await page.locator('.cqd-page').filter({ hasText: 'Mapa de calor' }).click();
  const uets = ['Trim', 'Mecánica', 'Final', 'Entregas'];
  if (isNarrow(page)) {
    // En celular la tabla está girada: las UET son las columnas y cada zona es una fila
    await expect(page.locator('.cqd-heat thead th button')).toHaveText(uets);
    await expect(page.locator('.cqd-heat tbody tr')).toHaveCount(10);
  } else {
    await expect(page.locator('.cqd-heat tbody tr')).toHaveCount(4);
    await expect(page.locator('.cqd-heat tbody th')).toHaveText(uets);
  }
  await page.getByRole('button', { name: 'Tipo de defecto' }).click();
  await expectFitsContainer(page, '.cqd-heat');
  await expectNoPageScrollX(page);
  await closeWithEscape(page);
});

test('AGVs: los 9 AGVs se mueven y la flota cabe en el panel', async ({ page }) => {
  await openDemo(page, 'Trazabilidad de AGVs');
  await page.getByRole('button', { name: 'Abrir el mapa' }).click();
  const agvs = page.locator('g.agd-agv');
  await expect(agvs).toHaveCount(9);
  const before = await agvs.evaluateAll((els) => els.map((e) => e.getAttribute('transform')));
  await page.waitForTimeout(1500);
  const after = await agvs.evaluateAll((els) => els.map((e) => e.getAttribute('transform')));
  const moved = before.filter((t, i) => t !== after[i]).length;
  expect(moved, 'La mayoría de los AGVs debe haberse movido').toBeGreaterThanOrEqual(6);
  await expectNoOverflow(page, '.agd-fleet button');
  // El plano debe verse con su altura real (en celular llegó a quedar aplastado)
  const mapHeight = await page.locator('.agd-map').evaluate((el) => el.getBoundingClientRect().height);
  expect(mapHeight).toBeGreaterThan(300);
  await expectNoPageScrollX(page);
  await closeWithEscape(page);
});
