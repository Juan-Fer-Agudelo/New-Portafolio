import React from 'react';
import { PageView } from '../types';
import { useLang } from '../i18n/LangContext';

interface WorkViewProps {
  onNavigate: (view: PageView, hash?: string) => void;
  onOpenContactModal: () => void;
}

export const WorkView: React.FC<WorkViewProps> = ({ onNavigate, onOpenContactModal }) => {
  const { t } = useLang();
  const w = t.work;
  return (
    <div id="view-work" className="page-view">
      <section id="work" className="work-section">
        {/* WORK HERO: About my work. */}
        <div className="work-hero animate-on-scroll">
          <h1 className="work-hero-title">
            {w.heroTitle}<span className="pink-dot">.</span>
          </h1>
          <div className="work-pink-bar" aria-hidden="true"></div>
          <p className="work-intro-text">
            {w.heroText1}<strong>{w.heroTextBold1}</strong>{w.heroText2}
            <span className="work-dashed">{w.heroTextDash1}</span>{w.heroText3}
            <span className="work-dashed">{w.heroTextDash2}</span>{w.heroText4}
            <strong>{w.heroTextBold2}</strong>.
          </p>

          <div className="work-scroll-indicator" aria-hidden="true">
            <span className="work-scroll-label">{w.scroll}</span>
            <div className="work-scroll-line"></div>
          </div>
        </div>

        {/* SUB-SECCIÓN 1: Considered development. */}
        <div className="work-block-grid animate-on-scroll">
          <div className="work-block-text">
            <h2 className="work-sub-title">
              {w.sub1Title}<span className="pink-dot">.</span>
            </h2>
            <p>{w.sub1Text1}</p>
            <p>{w.sub1Text2}</p>
          </div>

          <div className="work-illustration-wrap">
            <div className="work-hatched-circle">
              {/* SVG de Whiteboard, wireframes, libros, taza de café y planta */}
              <svg
                className="work-svg-art"
                viewBox="0 0 340 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cuerda y clavija para el pizarrón */}
                <circle cx="170" cy="35" r="4" fill="#aadcec" stroke="#2D1B69" strokeWidth="2.2" />
                <line x1="170" y1="39" x2="85" y2="85" stroke="#2D1B69" strokeWidth="2" strokeLinecap="round" />
                <line x1="170" y1="39" x2="255" y2="85" stroke="#2D1B69" strokeWidth="2" strokeLinecap="round" />

                {/* Pizarrón / Pantalla de wireframe */}
                <rect x="75" y="85" width="190" height="135" rx="7" fill="#ffffff" stroke="#2D1B69" strokeWidth="2.4" />
                {/* Cabecera del pizarrón */}
                <line x1="75" y1="102" x2="265" y2="102" stroke="#2D1B69" strokeWidth="1.8" />
                <circle cx="87" cy="94" r="2.5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.2" />
                <circle cx="95" cy="94" r="2.5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.2" />
                <circle cx="103" cy="94" r="2.5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.2" />

                {/* Wireframe: tarjeta izquierda con flecha punteada */}
                <rect x="88" y="112" width="34" height="32" rx="3" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.8" />
                <line x1="94" y1="120" x2="114" y2="120" stroke="#2D1B69" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="94" y1="127" x2="110" y2="127" stroke="#2D1B69" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M105,145 L105,160" stroke="#2D1B69" strokeWidth="1.8" strokeDasharray="2.5,2.5" strokeLinecap="round" />
                <rect x="88" y="162" width="34" height="24" rx="3" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.8" />
                <line x1="94" y1="170" x2="116" y2="170" stroke="#2D1B69" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="94" y1="176" x2="108" y2="176" stroke="#2D1B69" strokeWidth="1.5" strokeLinecap="round" />

                {/* Wireframe: tarjeta central principal con placeholder X */}
                <rect x="130" y="112" width="80" height="85" rx="4" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" />
                <rect x="130" y="112" width="80" height="36" rx="4" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.6" />
                <line x1="130" y1="112" x2="210" y2="148" stroke="#2D1B69" strokeWidth="1.5" />
                <line x1="130" y1="148" x2="210" y2="112" stroke="#2D1B69" strokeWidth="1.5" />
                <line x1="138" y1="158" x2="202" y2="158" stroke="#2D1B69" strokeWidth="2" strokeLinecap="round" />
                <line x1="138" y1="168" x2="185" y2="168" stroke="#2D1B69" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="138" y1="178" x2="172" y2="178" stroke="#2D1B69" strokeWidth="1.8" strokeLinecap="round" />

                {/* Wireframe: controles derechos (sliders, buttons, toggle) */}
                <rect x="218" y="116" width="36" height="6" rx="3" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.5" />
                <circle cx="238" cy="119" r="4.5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.6" />
                <rect x="218" y="130" width="36" height="6" rx="3" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.5" />
                <circle cx="226" cy="133" r="4.5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.6" />

                <circle cx="226" cy="150" r="5.5" stroke="#2D1B69" strokeWidth="1.6" fill="none" />
                <polygon points="224,147 229,150 224,153" fill="#2D1B69" />
                <circle cx="244" cy="150" r="5.5" stroke="#2D1B69" strokeWidth="1.6" fill="#aadcec" />

                {/* Toggle switch */}
                <rect x="220" y="164" width="24" height="11" rx="5.5" fill="#2D1B69" stroke="#2D1B69" strokeWidth="1.5" />
                <circle cx="226" cy="169.5" r="3.5" fill="#ffffff" />

                {/* Línea de superficie/mesa */}
                <line x1="35" y1="262" x2="305" y2="262" stroke="#2D1B69" strokeWidth="2.5" strokeLinecap="round" />

                {/* Pila de libros a la izquierda con taza de café */}
                <rect x="55" y="248" width="58" height="14" rx="2" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" />
                <rect x="52" y="234" width="62" height="14" rx="2" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" />
                <rect x="58" y="222" width="50" height="12" rx="2" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.8" />

                {/* Taza de café con vapor */}
                <path d="M72,204 L88,204 L86,222 L74,222 Z" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                <path d="M88,208 C93,208 95,212 95,215 C95,218 92,219 86,219" fill="none" stroke="#2D1B69" strokeWidth="1.8" />
                <path d="M77,196 Q80,190 77,184" fill="none" stroke="#73bbc5" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M83,197 Q86,191 83,185" fill="none" stroke="#73bbc5" strokeWidth="1.6" strokeLinecap="round" />

                {/* Libro horizontal en el centro-derecha */}
                <rect x="165" y="248" width="55" height="14" rx="2" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" />
                <line x1="170" y1="255" x2="210" y2="255" stroke="#aadcec" strokeWidth="2" />

                {/* Maceta con planta aloe/suculenta a la derecha */}
                <path d="M235,234 L265,234 L260,262 L240,262 Z" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                <line x1="237" y1="245" x2="263" y2="245" stroke="#73bbc5" strokeWidth="2" />
                {/* Hojas de suculenta */}
                <path d="M250,234 Q250,195 250,188 Q250,195 250,234" fill="#aadcec" stroke="#2D1B69" strokeWidth="2.2" strokeLinejoin="round" />
                <path d="M247,234 Q235,212 228,205 Q239,215 248,234" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                <path d="M253,234 Q265,212 272,205 Q261,215 252,234" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                <path d="M244,234 Q226,225 218,218 Q234,225 246,234" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                <path d="M256,234 Q274,225 282,218 Q266,225 254,234" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* SUB-SECCIÓN 2: Code Choreography. (Reversed) */}
        <div className="work-block-grid reversed animate-on-scroll">
          <div className="work-illustration-wrap">
            <div className="work-hatched-circle">
              {/* SVG de Laptop con código, monstera deliciosa y taza */}
              <svg
                className="work-svg-art"
                viewBox="0 0 340 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="40" y1="262" x2="300" y2="262" stroke="#2D1B69" strokeWidth="2.5" strokeLinecap="round" />

                <path d="M232,228 L262,228 L257,262 L237,262 Z" fill="#aadcec" stroke="#2D1B69" strokeWidth="2.2" strokeLinejoin="round" />
                <line x1="235" y1="240" x2="259" y2="240" stroke="#73bbc5" strokeWidth="2" />
                <path d="M247,228 Q250,180 265,130" stroke="#2D1B69" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M245,210 Q225,185 210,170" stroke="#2D1B69" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M265,130 C290,105 310,135 295,165 C285,185 260,180 255,160 C250,140 255,135 265,130 Z" fill="#ffffff" stroke="#2D1B69" strokeWidth="2.2" strokeLinejoin="round" />
                <circle cx="282" cy="142" r="3" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.2" />
                <ellipse cx="275" cy="155" rx="3.5" ry="2" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.2" />

                <path d="M210,170 C195,145 220,130 235,148 C245,160 235,180 220,185 Z" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="218" cy="156" r="2.5" fill="#ffffff" stroke="#2D1B69" strokeWidth="1" />

                <polygon points="65,257 205,257 215,262 55,262" fill="#ffffff" stroke="#2D1B69" strokeWidth="2.2" strokeLinejoin="round" />
                <rect x="120" y="258" width="30" height="2" fill="#2D1B69" rx="1" />

                <rect x="70" y="142" width="130" height="115" rx="7" fill="#ffffff" stroke="#2D1B69" strokeWidth="2.4" />
                <rect x="78" y="150" width="114" height="98" rx="4" fill="#fafbfd" stroke="#2D1B69" strokeWidth="1.6" />

                <line x1="86" y1="162" x2="114" y2="162" stroke="#2D1B69" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="92" y1="172" x2="140" y2="172" stroke="#682ae9" strokeWidth="2" strokeLinecap="round" />
                <line x1="92" y1="182" x2="128" y2="182" stroke="#73bbc5" strokeWidth="2" strokeLinecap="round" />
                <line x1="100" y1="192" x2="152" y2="192" stroke="#2D1B69" strokeWidth="2" strokeLinecap="round" />
                <line x1="100" y1="202" x2="138" y2="202" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" />
                <line x1="86" y1="214" x2="108" y2="214" stroke="#2D1B69" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="86" y1="226" x2="130" y2="226" stroke="#73bbc5" strokeWidth="2" strokeLinecap="round" />
                <line x1="86" y1="236" x2="145" y2="236" stroke="#682ae9" strokeWidth="2" strokeLinecap="round" />

                <polygon points="126,180 126,196 131,191 138,200 141,197 135,189 142,189" fill="#2D1B69" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" />

                <rect x="175" y="188" width="65" height="48" rx="5" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" />
                <rect x="175" y="188" width="65" height="14" rx="5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.6" />
                <circle cx="183" cy="195" r="2" fill="#2D1B69" />
                <circle cx="189" cy="195" r="2" fill="#2D1B69" />
                <line x1="182" y1="210" x2="228" y2="210" stroke="#2D1B69" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="182" y1="218" x2="218" y2="218" stroke="#73bbc5" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="182" y1="226" x2="205" y2="226" stroke="#682ae9" strokeWidth="1.6" strokeLinecap="round" />

                <path d="M280,244 L294,244 L292,262 L282,262 Z" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.8" />
                <path d="M294,248 C298,248 299,251 299,254 C299,257 296,258 292,258" fill="none" stroke="#2D1B69" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="work-block-text">
            <h2 className="work-sub-title">
              {w.sub2Title}<span className="pink-dot">.</span>
            </h2>
            <p>
              {w.sub2Text1Pre}<strong>{w.sub2Text1Bold}</strong>{w.sub2Text1Post}
            </p>
            <p>{w.sub2Text2}</p>
          </div>
        </div>

        {/* SUB-SECCIÓN 3: Server-side is my jam(stack). */}
        <div className="work-block-grid animate-on-scroll">
          <div className="work-block-text">
            <h2 className="work-sub-title">
              {w.sub3Title}<span className="pink-dot">.</span>
            </h2>
            <p>
              {w.sub3Text1Pre}<strong>{w.sub3Text1Bold}</strong>{w.sub3Text1Post}
            </p>
            <p>
              {w.sub3Text2Pre}<strong>{w.sub3Text2Bold1}</strong>{w.sub3Text2Mid}
              <strong>{w.sub3Text2Bold2}</strong>{w.sub3Text2Mid2}
              <strong>{w.sub3Text2Bold3}</strong>{w.sub3Text2Post}
            </p>
          </div>

          <div className="work-illustration-wrap">
            <div className="work-hatched-circle">
              {/* SVG de Constelación tecnológica */}
              <svg
                className="work-svg-art"
                viewBox="0 0 340 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* AWS Lambda (arriba centro) */}
                <g transform="translate(150, 45)">
                  <circle cx="20" cy="20" r="24" fill="#ffffff" stroke="#2D1B69" strokeWidth="2.2" />
                  <path d="M12,28 L21,10 L28,28 M22,20 L30,28" fill="none" stroke="#2D1B69" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* Cubo 3D Isométrico (arriba izquierda) */}
                <g transform="translate(65, 80)">
                  <polygon points="25,5 48,18 48,46 25,33" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points="25,5 48,18 25,31 2,18" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points="2,18 25,31 25,59 2,46" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                </g>

                {/* React Atom (centro izquierda) */}
                <g transform="translate(75, 175)">
                  <circle cx="25" cy="25" r="5.5" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" />
                  <ellipse cx="25" cy="25" rx="24" ry="9" transform="rotate(30 25 25)" fill="none" stroke="#2D1B69" strokeWidth="1.8" />
                  <ellipse cx="25" cy="25" rx="24" ry="9" transform="rotate(-30 25 25)" fill="none" stroke="#2D1B69" strokeWidth="1.8" />
                  <ellipse cx="25" cy="25" rx="24" ry="9" transform="rotate(90 25 25)" fill="none" stroke="#2D1B69" strokeWidth="1.8" />
                </g>

                {/* Vue V Logo (centro derecha) */}
                <g transform="translate(225, 160)">
                  <polygon points="5,5 25,40 45,5 35,5 25,23 15,5" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                  <polygon points="15,5 25,23 35,5 29,5 25,12 21,5" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.8" strokeLinejoin="round" />
                </g>

                {/* Gota de agua / llama (arriba derecha) */}
                <g transform="translate(235, 75)">
                  <path d="M20,5 C20,5 34,22 34,34 C34,43 28,50 20,50 C12,50 6,43 6,34 C6,22 20,5 20,5 Z" fill="#aadcec" stroke="#2D1B69" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M20,18 C20,18 26,28 26,35 C26,40 23,43 20,43 C17,43 14,40 14,35 C14,28 20,18 20,18 Z" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.5" strokeLinejoin="round" />
                </g>

                {/* Svelte estilizado (abajo derecha) */}
                <g transform="translate(210, 230)">
                  <rect x="0" y="0" width="46" height="46" rx="12" fill="#ffffff" stroke="#2D1B69" strokeWidth="2" />
                  <path d="M14,32 C12,27 16,23 23,22 C30,21 34,18 32,14 C30,10 24,10 20,13" fill="none" stroke="#73bbc5" strokeWidth="2.6" strokeLinecap="round" />
                  <path d="M32,14 C34,19 30,23 23,24 C16,25 12,28 14,32 C16,36 22,36 26,33" fill="none" stroke="#2D1B69" strokeWidth="2.6" strokeLinecap="round" />
                </g>

                {/* Python logo esquemático (abajo centro) */}
                <g transform="translate(145, 235)">
                  <path d="M12,8 C6,8 6,14 6,14 L6,20 L18,20 L18,22 L4,22 C4,22 0,22 0,28 C0,34 5,34 5,34 L10,34 L10,30 C10,26 14,26 14,26 L22,26 C22,26 26,26 26,22 L26,14 C26,8 20,8 12,8 Z" fill="#ffffff" stroke="#2D1B69" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="10" cy="12" r="1.5" fill="#2D1B69" />
                  <path d="M22,38 C28,38 28,32 28,32 L28,26 L16,26 L16,24 L30,24 C30,24 34,24 34,18 C34,12 29,12 29,12 L24,12 L24,16 C24,20 20,20 20,20 L12,20 C12,20 8,20 8,24 L8,32 C8,38 14,38 22,38 Z" fill="#aadcec" stroke="#2D1B69" strokeWidth="1.8" strokeLinejoin="round" />
                  <circle cx="24" cy="34" r="1.5" fill="#2D1B69" />
                </g>

                {/* Tokens de sintaxis y operadores flotantes */}
                <text x="135" y="140" fontFamily="monospace" fontSize="22" fontWeight="bold" fill="#2D1B69">{}</text>
                <text x="175" y="175" fontFamily="monospace" fontSize="20" fontWeight="bold" fill="#73bbc5">==</text>
                <text x="130" y="200" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="#682ae9">!==</text>
                <text x="265" y="130" fontFamily="monospace" fontSize="20" fontWeight="bold" fill="#2D1B69">=&gt;</text>
                <text x="45" y="160" fontFamily="monospace" fontSize="19" fontWeight="bold" fill="#73bbc5">++</text>
                <text x="85" y="255" fontFamily="monospace" fontSize="20" fontWeight="bold" fill="#2D1B69">[]</text>
                <text x="155" y="105" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="#682ae9">#</text>
                <text x="45" y="225" fontFamily="monospace" fontSize="19" fontWeight="bold" fill="#2D1B69">&lt;/&gt;</text>
                <text x="270" y="215" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="#73bbc5">--</text>
              </svg>
            </div>
          </div>
        </div>

        {/* SUB-SECCIÓN 4: Let's build something better. (Manifiesto ético) */}
        <div className="work-manifesto-block animate-on-scroll">
          <div className="work-dots-backdrop" aria-hidden="true"></div>
          <div className="work-manifesto-content">
            <h2 className="work-manifesto-title">
              {w.manifestoTitle}<span className="pink-dot">.</span>
            </h2>
            <p>{w.manifestoText1}</p>
            <p>
              {w.manifestoText2Pre}
              <u className="work-dashed">
                <strong>{w.manifestoText2Bold}</strong>
              </u>
              {w.manifestoText2Post}
            </p>
            <p>{w.manifestoText3}</p>

            <button
              className="work-touch-btn"
              id="work-touch-btn"
              type="button"
              onClick={onOpenContactModal}
            >
              {w.btnContact}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER ESPECÍFICO DE LA SECCIÓN WORK */}
      <footer
        className="site-footer"
        style={{
          borderTop: '1px solid #aadcec',
          backgroundColor: '#f4f9fc',
          marginTop: '60px',
        }}
      >
        <div className="footer-inner">
          <p className="footer-copyright" style={{ color: '#6d5b7b' }}>
            {w.footerCopyright}
          </p>
          <div className="footer-links">
            <a
              href="#hero"
              className="nav-return-home-btn"
              style={{ color: '#682ae9', fontWeight: 700, textDecoration: 'none' }}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home', '#hero');
              }}
            >
              &larr; {w.backHome}
            </a>
            <span style={{ color: '#73bbc5' }}>&bull;</span>
            <a
              href="#contacto"
              className="work-footer-contact-btn"
              style={{ color: '#682ae9', textDecoration: 'none' }}
              onClick={(e) => {
                e.preventDefault();
                onOpenContactModal();
              }}
            >
              {w.btnContact}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
