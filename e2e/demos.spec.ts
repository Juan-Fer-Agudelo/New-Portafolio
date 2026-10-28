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

/** En celular la lista de correos está oculta detrás del botón «Correos enviados» */
const openMailList = async (page: Page) => {
  const back = page.locator('.rpf-mail-back');
  if (await back.isVisible()) await back.click();
};

const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1000) <= 600;

/** La demo abierta no debe provocar scroll horizontal en la página */
const expectNoPageScrollX = async (page: Page) => {
  const { sw, w } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
  expect(sw).toBeLessThanOrEqual(w + 1);
};

const closeWithEscape = async (page: Page) => {
  await page.keyboard.press('Escape');
  await expect(page.locator('.dn-overlay, .msd-overlay, .rsd-overlay, .sxd-overlay, .cqd-overlay, .agd-overlay, .rzd-overlay, .sld-overlay')).toHaveCount(0);
};

test('el portafolio carga con los 12 proyectos', async ({ page }) => {
  await expect(page.locator('article.project-card-item')).toHaveCount(12);
  await expect(page.getByRole('button', { name: /Ver proyecto/ })).toHaveCount(7);
});

test('los filtros por categoría muestran los proyectos de cada una', async ({ page }) => {
  const filters = page.getByRole('group', { name: 'Filtrar proyectos por categoría' });
  const cards = page.locator('article.project-card-item');
  await filters.scrollIntoViewIfNeeded();
  await expect(filters.getByRole('button', { pressed: true })).toHaveText(/Todos/);

  for (const [name, count] of [['Desarrollo web', 5], ['Automatización', 5], ['Datos', 4], ['Todos', 12]] as const) {
    const button = filters.getByRole('button', { name: new RegExp(name) });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(button).toContainText(String(count));
    await expect(cards).toHaveCount(count);
    // Las tarjetas que vuelven a aparecer deben verse, no quedarse transparentes por la animación de scroll
    await expect(cards.last()).toHaveCSS('opacity', '1');
  }
  await expectNoPageScrollX(page);
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

test('Renault: flujo de Power Automate envía los correos a RRHH y a los dos jefes', async ({ page }) => {
  await openDemo(page, 'Cambios de Estructura y Nómina');
  await page.getByRole('button', { name: 'Ver el flujo en Power Automate' }).click();
  await expect(page.locator('.rpf-card').first()).toBeVisible();
  // CE-0418: traslado de Soldadura a Pintura (cambia de departamento → avisa a los dos jefes)
  await page.locator('.rpf-select select').selectOption('CE-0418');
  await page.getByRole('button', { name: 'Probar flujo' }).click();
  await expect(page.locator('.rpf-banner--ok')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('tab', { name: /Correos/ }).click();
  const mails = page.locator('.rpf-mail-item');
  await expect(mails).toHaveCount(3);
  await expect(page.locator('.rpf-mail-tag')).toHaveText(['RRHH · Aprobación', 'Jefe actual · Sale', 'Jefe nuevo · Llega']);
  // El jefe actual ve quién se va de su área y el jefe nuevo quién llega
  await openMailList(page);
  await mails.nth(1).click();
  await expect(page.locator('.rpf-letter')).toContainText('sale de tu área');
  await openMailList(page);
  await mails.nth(2).click();
  await expect(page.locator('.rpf-letter')).toContainText('llega a tu área');
  await expectNoPageScrollX(page);

  // Caso de rechazo: solo se avisa al jefe actual
  await page.getByRole('tab', { name: 'Diseñador' }).click();
  await page.getByLabel('Simular rechazo de RRHH').check();
  await page.getByRole('button', { name: 'Probar flujo' }).click();
  await expect(page.locator('.rpf-banner--bad')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('tab', { name: /Correos/ }).click();
  await expect(page.locator('.rpf-mail-tag')).toHaveText(['RRHH · Aprobación', 'Rechazo']);
  await closeWithEscape(page);
});

test('Rechazos: escanear una pieza y registrarla en la base de datos de Calidad', async ({ page }) => {
  await openDemo(page, 'Rechazos de Defectos de Calidad');
  await page.getByRole('button', { name: 'Abrir la app' }).click();
  const rows = page.locator('.rzd-table tbody tr');
  await expect(rows.first()).toBeVisible();
  const before = Number(await page.locator('.rzd-kpi strong').first().innerText());
  await page.getByRole('button', { name: 'Escanear pieza' }).click();
  await expect(page.locator('.rzd-piece')).toBeVisible();
  await page.locator('.rzd-chip').filter({ hasText: 'Deformación' }).click();
  await page.getByRole('button', { name: 'Más' }).click();
  await page.getByRole('button', { name: 'Registrar rechazo' }).click();
  // El flujo termina, el rechazo aparece de primero en la base de datos y sube el contador
  await expect(page.locator('.rzd-toast--show')).toContainText('RC-2055');
  await expect(page.locator('.rzd-step--done')).toHaveCount(5);
  await expect(rows.first()).toContainText('RC-2055');
  await expect(rows.first()).toContainText('Deformación');
  await expect(page.locator('.rzd-kpi strong').first()).toHaveText(String(before + 1));
  await expectFitsContainer(page, '.rzd-table');
  await expectNoPageScrollX(page);
  await closeWithEscape(page);
});

test('Selección: calificar un grupo desde la tablet y verlo en la base de datos de RRHH', async ({ page }) => {
  await openDemo(page, 'Selección de Operarios');
  await page.getByRole('button', { name: 'Abrir la app' }).click();
  await page.getByRole('tab', { name: /Soldadura/ }).click();
  await expect(page.locator('.sld-person')).toHaveCount(4);
  // Cada aspirante muestra su resultado calculado a partir de la calidad y el tiempo
  await expect(page.locator('.sld-person .sld-verdict')).toHaveCount(4);
  await page.getByRole('button', { name: /Subir Calidad/ }).first().click();
  await page.getByRole('button', { name: 'Enviar calificaciones a RRHH' }).click();
  await expect(page.locator('.sld-toast--show')).toContainText('T-3');
  await page.getByRole('button', { name: 'Ver en RRHH' }).click();
  await page.locator('.sld-seg button').filter({ hasText: 'Tarde' }).click();
  // Las 4 personas del grupo T-3 ya tienen resultado en Soldadura (verde, amarillo o rojo)
  const t3 = page.locator('.sld-table tbody tr', { hasText: 'T-3' });
  await expect(t3).toHaveCount(4);
  await expect(t3.locator('td[data-label="Soldadura"]:not(.sld-tone--none)')).toHaveCount(4);
  await expect(page.locator('.sld-table .sld-cell.sld-tone--ok').first()).toBeVisible();
  await expect(page.locator('.sld-table .sld-cell.sld-tone--bad').first()).toBeVisible();
  await expectFitsContainer(page, '.sld-table');
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
