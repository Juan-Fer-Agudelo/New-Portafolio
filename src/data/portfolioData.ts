import { ProjectItem, WritingArticle } from '../types';

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'synthwave',
    number: '01',
    type: 'THEME',
    title: "SynthWave '84",
    subtitle: 'Tema retro 80s para VS Code con estética neón & cyberpunk',
    description:
      'Un tema retro con colores vibrantes, tipografía inspirada en carteles de los 80s y efecto de brillo neón opcional en el editor de código. Más de 1.2M de descargas globales.',
    details:
      "Tema retro de los años 80 para VS Code con más de 1.2M de instalaciones activas, efectos de brillo neón personalizables y paleta inspirada en películas cyberpunk.",
    installCode: 'ext install robb0wen.synthwave-vscode',
    githubUrl: 'https://github.com/robb0wen/synthwave-vscode',
    techStack: ['VS Code API', 'CSS Grid', 'JSON Tokens', 'Custom Themes'],
  },
  {
    id: 'tornis',
    number: '02',
    type: 'JAVASCRIPT LIBRARY',
    title: 'Tornis',
    subtitle: 'Rastreador de estado del viewport ultraliviano a 60fps',
    description:
      'Librería minimalista de JavaScript que suscribe tu aplicación a los cambios de estado del viewport: scroll, tamaño de ventana y posición del puntero sin sobrecargar el hilo de render.',
    details:
      'Biblioteca ultra minimalista en JavaScript vanilla que rastrea el estado del viewport del navegador (posición de scroll, velocidad del puntero, tamaño de ventana) con un consumo de recursos prácticamente nulo.',
    installCode: 'npm install tornis',
    githubUrl: 'https://github.com/robb0wen/tornis',
    techStack: ['TypeScript', 'RAF Loop', 'Viewport Observer', 'Zero Deps'],
  },
  {
    id: 'rekishi',
    number: '03',
    type: 'ENGINEERING',
    title: 'Rekishi',
    subtitle: 'Enrutador SPA y gestor de historial de navegador desacoplado',
    description:
      'Motor moderno de navegación e historial del navegador pensado para transiciones de página fluidas, precarga inteligente y una experiencia editorial continua.',
    details:
      'Motor moderno de navegación e historial del navegador diseñado para arquitecturas desacopladas y experiencias editoriales con soporte de transiciones fluidas.',
    installCode: 'npm install rekishi',
    githubUrl: 'https://github.com/robb0wen',
    techStack: ['History API', 'Fetch API', 'DOM Diffing', 'Lifecycle Hooks'],
  },
  {
    id: 'kroma',
    number: '04',
    type: 'DESIGN SYSTEM',
    title: 'Kroma UI',
    subtitle: 'Sistema de diseño accesible con tokens de color armónicos',
    description:
      'Conjunto de componentes accesibles que garantizan contrastes WCAG AAA, escalas armónicas y animaciones sutiles para publicaciones digitales.',
    details:
      'Sistema de diseño y conjunto de tokens accesibles con cálculos de ratio WCAG AAA, escalas armónicas y componentes para publicaciones digitales refinadas.',
    installCode: 'npm install @kroma/ui-core',
    githubUrl: 'https://github.com',
    techStack: ['Tokens', 'CSS Variables', 'Web Components', 'WCAG AAA'],
  },
];

export const WRITING_ARTICLES: WritingArticle[] = [
  {
    id: 'art-1',
    date: 'MARZO 2026',
    tag: 'ENGINEERING',
    title: '60fps Viewport State Tracking in Vanilla JS',
    excerpt:
      'Cómo optimizar listeners pasivos, requestAnimationFrame y cálculos de matrices de transformación sin sobrecargar el hilo principal del navegador.',
    readTime: '5 min de lectura',
  },
  {
    id: 'art-2',
    date: 'ENERO 2026',
    tag: 'TYPOGRAPHY',
    title: 'The Optical Rhythm of Digital Interfaces',
    excerpt:
      'Escalas modulares y contraste óptico en interfaces web contemporáneas: construyendo jerarquías visuales deliberadas sin depender de plantillas industriales.',
    readTime: '7 min de lectura',
  },
  {
    id: 'art-3',
    date: 'OCTUBRE 2025',
    tag: 'PHILOSOPHY',
    title: 'Craft Over Homogeneity in Frontend Development',
    excerpt:
      'Por qué el software interactivo debe sentirse como un trabajo artesanal, respetando el espacio negativo, las transiciones tangibles y el tono propio de cada proyecto.',
    readTime: '6 min de lectura',
  },
];
