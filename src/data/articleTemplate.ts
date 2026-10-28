/* ==========================================================================
   Plantilla de los artículos del blog. Todos siguen la estructura del artículo
   "Cuándo migrar de un monolito a microservicios": intro, puntos clave, índice
   con subniveles, secciones numeradas (con subsecciones N.M), diagrama, tabla
   comparativa, bloque de código, errores comunes, cuándo NO aplicarlo, 5
   preguntas frecuentes, referencias y firma. scripts/check-blog-structure.ts
   verifica que cada artículo cumpla esa estructura.
   ========================================================================== */

interface ArticleSubsection {
  id: string;
  title: string;
  html: string;
}

interface ArticleSection {
  id: string;
  title: string;
  html: string;
  /** Subsecciones numeradas N.1, N.2… que también aparecen en el índice */
  subsections?: ArticleSubsection[];
  /** HTML que va después de las subsecciones (por ejemplo, un cierre de la sección) */
  after?: string;
}

/** Referencia: con url se enlaza; sin url (libros) se muestra la nota */
interface ArticleRef {
  label: string;
  url?: string;
  note?: string;
}

interface ArticleSpec {
  intro: string;
  takeaways: string[];
  sections: ArticleSection[];
  faqs: { q: string; a: string }[];
  refs: ArticleRef[];
  prefix: string;
  closing: string;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tabla comparativa. El contenedor permite desplazarla en pantallas angostas. */
export const articleTable = (headers: string[], rows: string[][]): string => `<div class="article-table-wrap">
<table class="article-table">
  <thead>
    <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
  </thead>
  <tbody>
${rows.map((r) => `    <tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}
  </tbody>
</table>
</div>`;

/** Bloque de código: el texto se escapa, así que se escribe tal cual (con < y >). */
export const articleCode = (source: string): string =>
  `<pre class="article-code"><code>${escapeHtml(source.replace(/^\n+|\s+$/g, ''))}</code></pre>`;

// Colores de la marca para los diagramas
const NAVY = '#0f1b61';
const TEAL = '#73bbc5';
const PURPLE = '#682ae9';
const MUTED = '#53647f';

/** Texto de varias líneas en SVG (separadas por \n), centrado en (x, y) */
const svgLines = (text: string, x: number, y: number, size: number, color: string, weight = 'bold') => {
  const lines = text.split('\n');
  const start = y - ((lines.length - 1) * size * 1.25) / 2;
  return lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${(start + i * size * 1.25).toFixed(1)}" font-size="${size}" font-weight="${weight}" text-anchor="middle" dominant-baseline="middle" fill="${color}">${escapeHtml(l)}</text>`
    )
    .join('');
};

/** Parte un texto en líneas de hasta `max` caracteres sin cortar palabras */
const wrap = (text: string, max: number) =>
  text.split(' ').reduce<string[]>((lines, word) => {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + word).length <= max) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
    return lines;
  }, []);

/** Identificador único para las flechas de cada diagrama (puede haber varios por página) */
let markerCount = 0;
const arrowMarker = (id: string) =>
  `<defs><marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><polygon points="0 0, 9 3, 0 6" fill="${NAVY}"/></marker></defs>`;

/**
 * Cada diagrama se genera dos veces: horizontal para escritorio y vertical para celular,
 * donde un dibujo de 1000 px de ancho dejaría el texto ilegible. El CSS muestra uno u otro.
 */
const figure = (label: string, wide: string, narrow: string) => `<figure class="article-figure" role="img" aria-label="${escapeHtml(label)}">
<svg class="article-diagram article-diagram--wide" ${wide}</svg>
<svg class="article-diagram article-diagram--narrow" ${narrow}</svg>
</figure>`;

const stepFill = (i: number, n: number) => (i === n - 1 ? PURPLE : i % 2 === 0 ? NAVY : TEAL);

/**
 * Diagrama de flujo: de 2 a 5 pasos unidos por flechas.
 * Cada paso admite hasta 2 líneas cortas separadas por \n (unos 16 caracteres por línea).
 */
export const flowDiagram = (steps: string[], caption?: string): string => {
  const n = steps.length;
  const id = `arr-${++markerCount}`;

  // Escritorio: pasos en fila
  const W = 1000;
  const gap = 46;
  const boxW = (W - 80 - gap * (n - 1)) / n;
  const y = caption ? 70 : 40;
  const boxH = 120;
  const wideBoxes = steps
    .map((s, i) => {
      const x = 40 + i * (boxW + gap);
      const arrow =
        i < n - 1
          ? `<line x1="${x + boxW + 6}" y1="${y + boxH / 2}" x2="${x + boxW + gap - 8}" y2="${y + boxH / 2}" stroke="${NAVY}" stroke-width="2.5" marker-end="url(#${id}w)"/>`
          : '';
      return `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="10" fill="${stepFill(i, n)}"/>${svgLines(s, x + boxW / 2, y + boxH / 2, n > 4 ? 15 : 17, '#ffffff')}${arrow}`;
    })
    .join('\n  ');
  const wide = `viewBox="0 0 ${W} ${y + boxH + 40}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${arrowMarker(`${id}w`)}
  ${caption ? svgLines(caption, W / 2, 34, 22, NAVY) : ''}
  ${wideBoxes}
`;

  // Celular: pasos en columna, con letra grande
  const capLines = caption ? wrap(caption, 30) : [];
  const top = capLines.length ? 24 + capLines.length * 26 + 10 : 20;
  const vH = 84;
  const vGap = 40;
  const narrowBoxes = steps
    .map((s, i) => {
      const by = top + i * (vH + vGap);
      const arrow =
        i < n - 1
          ? `<line x1="210" y1="${by + vH + 4}" x2="210" y2="${by + vH + vGap - 8}" stroke="${NAVY}" stroke-width="2.5" marker-end="url(#${id}n)"/>`
          : '';
      return `<rect x="30" y="${by}" width="360" height="${vH}" rx="10" fill="${stepFill(i, n)}"/>${svgLines(s, 210, by + vH / 2, 20, '#ffffff')}${arrow}`;
    })
    .join('\n  ');
  const narrow = `viewBox="0 0 420 ${top + n * vH + (n - 1) * vGap + 20}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${arrowMarker(`${id}n`)}
  ${svgLines(capLines.join('\n'), 210, 24 + ((capLines.length - 1) * 26) / 2, 21, NAVY)}
  ${narrowBoxes}
`;
  return figure(caption ?? steps.join(' → ').replace(/\n/g, ' '), wide, narrow);
};

/**
 * Diagrama comparativo de dos columnas (por ejemplo, "Antes" vs. "Después"),
 * con hasta 4 puntos por lado. Cada punto debe ser corto (unos 34 caracteres).
 */
export const compareDiagram = (
  left: { title: string; points: string[] },
  right: { title: string; points: string[] },
  caption?: string
): string => {
  const panel = (x: number, y: number, w: number, s: { title: string; points: string[] }, accent: string, size: number) => {
    const pts = s.points.slice(0, 4);
    const h = 78 + pts.length * (size * 2.6) + 10;
    return {
      h,
      svg: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#f0f4f8" stroke="${NAVY}" stroke-width="2"/>
  <rect x="${x}" y="${y}" width="${w}" height="62" rx="12" fill="${accent}"/>
  <rect x="${x}" y="${y + 40}" width="${w}" height="22" fill="${accent}"/>
  ${svgLines(s.title, x + w / 2, y + 32, 22, '#ffffff')}
  ${pts
    .map((p, i) => {
      const cy = y + 100 + i * size * 2.6;
      return `<circle cx="${x + 28}" cy="${cy}" r="6" fill="${accent}"/><text x="${x + 46}" y="${cy}" font-size="${size}" dominant-baseline="middle" fill="${NAVY}">${escapeHtml(p)}</text>`;
    })
    .join('\n  ')}`,
    };
  };

  // Escritorio: dos columnas lado a lado
  const top = caption ? 70 : 30;
  const l = panel(40, top, 420, left, TEAL, 17);
  const r = panel(540, top, 420, right, PURPLE, 17);
  const wide = `viewBox="0 0 1000 ${top + Math.max(l.h, r.h) + 20}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${caption ? svgLines(caption, 500, 34, 22, NAVY) : ''}
  ${l.svg}
  <text x="500" y="${top + 140}" font-size="26" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${MUTED}">vs</text>
  ${r.svg}
`;

  // Celular: un panel debajo del otro
  const capLines = caption ? wrap(caption, 30) : [];
  const nTop = capLines.length ? 24 + capLines.length * 26 + 10 : 20;
  const nl = panel(20, nTop, 380, left, TEAL, 16);
  const nr = panel(20, nTop + nl.h + 46, 380, right, PURPLE, 16);
  const narrow = `viewBox="0 0 420 ${nTop + nl.h + 46 + nr.h + 20}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  ${svgLines(capLines.join('\n'), 210, 24 + ((capLines.length - 1) * 26) / 2, 21, NAVY)}
  ${nl.svg}
  <text x="210" y="${nTop + nl.h + 24}" font-size="22" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${MUTED}">vs</text>
  ${nr.svg}
`;
  return figure(caption ?? `${left.title} frente a ${right.title}`, wide, narrow);
};

/** Minutos de lectura a 200 palabras por minuto (para el campo readTime) */
export const readTimeOf = (html: string): string =>
  `${Math.max(3, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / 200))} min de lectura`;

export const buildArticle = (a: ArticleSpec): string => {
  const index = [
    ...a.sections.map((s, i) => {
      const subs = s.subsections?.length
        ? `\n      <ol>\n${s.subsections
            .map((sub, j) => `        <li><a href="#${sub.id}">${i + 1}.${j + 1} ${sub.title}</a></li>`)
            .join('\n')}\n      </ol>\n    `
        : '';
      return `<li><a href="#${s.id}">${i + 1}. ${s.title}</a>${subs}</li>`;
    }),
    `<li><a href="#${a.prefix}-faqs">Preguntas Frecuentes</a></li>`,
    `<li><a href="#${a.prefix}-referencias">Referencias y Enlaces</a></li>`,
  ].join('\n    ');

  const sections = a.sections
    .map((s, i) => {
      const subs = (s.subsections ?? [])
        .map((sub, j) => `<h3 id="${sub.id}">${i + 1}.${j + 1} ${sub.title}</h3>\n${sub.html}`)
        .join('\n\n');
      return [`<h2 id="${s.id}">${i + 1}. ${s.title}</h2>\n${s.html}`, subs, s.after ?? ''].filter(Boolean).join('\n\n');
    })
    .join('\n\n');

  const faqs = a.faqs
    .map(
      (f) => `<details class="article-faq">
  <summary class="article-faq-question">${f.q}</summary>
  <div class="article-faq-answer"><p>${f.a}</p></div>
</details>`
    )
    .join('\n\n');

  const refs = a.refs
    .map((r) =>
      r.url
        ? `<li><strong>${r.label}</strong>${r.note ? ` — ${r.note}` : ''}: <a href="${r.url}" target="_blank" rel="noopener noreferrer">${r.url.replace(/^https?:\/\//, '')}</a></li>`
        : `<li><strong>${r.label}</strong>${r.note ? ` — ${r.note}` : ''}</li>`
    )
    .join('\n  ');

  return `
<p class="article-intro">${a.intro}</p>

<div class="article-takeaways">
  <span class="article-block-label">Puntos Clave</span>
  <ul>
    ${a.takeaways.map((t) => `<li>${t}</li>`).join('\n    ')}
  </ul>
</div>

<div class="article-index">
  <span class="article-block-label">Índice de Contenidos</span>
  <ol>
    ${index}
  </ol>
</div>

${sections}

<h2 id="${a.prefix}-faqs">Preguntas Frecuentes</h2>

${faqs}

<h2 id="${a.prefix}-referencias">Referencias y Enlaces</h2>
<ul>
  ${refs}
</ul>

<p style="margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--color-border-subtle); font-size: 14px; color: var(--color-muted);">Escrito por <strong>Juan Fernando Agudelo</strong>. ${a.closing}</p>
`;
};
