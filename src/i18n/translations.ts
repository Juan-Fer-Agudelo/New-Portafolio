export type Lang = 'en' | 'es';

export const translations = {
  en: {
    // Navbar
    nav: {
      menu: 'MENU',
      hireMe: 'HIRE ME',
      langToggle: 'ESP',
    },

    // Hero
    hero: {
      greeting: 'Hi, my',
      nameLine: 'name is',
      name: 'Robb',
      subtitle: "I'm an",
      role: 'independent creative developer',
      location: 'from Abergavenny, South Wales.',
      scroll: 'SCROLL',
    },

    // Side brand
    sideBrand: '© MMXXVI. Made in Medellin, Colombia.',

    // About
    about: {
      heading: "Let's work together",
      description:
        'From interaction design to scalable design systems, single-page applications to something more experimental with WebGL. I help incredible people build ambitious but accessible web projects — ',
      boldPart: 'the bolder the better',
      btnLabel: 'About my approach',
    },

    // Projects
    projects: {
      heading: 'Selected Projects',
      subtext:
        'A collection of open-source tools, frontend libraries and creative experiments crafted with attention to detail and an artisanal approach.',
      searchPlaceholder: 'Search by technology, name or category...',
      noResults: 'No projects found for "',
      noResultsEnd: '".',
      showAll: 'Show all projects',
      viewDetails: 'View Details & Code',
    },

    // Writing
    writing: {
      heading: 'Writing',
      subtext:
        'Reflections on native frontend engineering, typographic systems, microinteractions and digital craft.',
    },

    // Contact
    contact: {
      heading: 'Got a project in mind',
      subtext:
        "I'm currently available for select freelance projects, frontend technical consulting and creative collaborations. Write to me at ",
      subtextEnd: ' or connect on my socials below.',
      btnSend: 'Send me a message',
    },

    // Footer
    footer: {
      copyright: '© MMXXVI. Portfolio by Juan. Designed and built with artisanal precision in Medellín, Colombia.',
      scrollTop: 'Back to Top',
      about: 'About',
      projects: 'Projects',
      contact: 'Contact',
    },

    // Menu Overlay
    menuOverlay: {
      close: 'CLOSE',
      hireMe: 'HIRE ME',
      home: 'Home',
      homeDesc: 'Back to the home page.',
      work: 'Work',
      workDesc: 'My approach to development.',
      about: 'About',
      aboutDesc: 'A little about me and my background.',
      writing: 'Writing',
      writingDesc: 'My latest writing on tech and language.',
    },

    // Modals
    modals: {
      enfoque: {
        title: 'My Creative Approach',
        body: "I believe web software shouldn't feel like an undifferentiated industrial grid. Every product deserves a distinctive typographic voice, deliberate micro-interactions and an artisanal codebase without excess.",
        point1Title: 'Typography first:',
        point1: 'Strict visual hierarchy and harmonic proportion scales.',
        point2Title: 'Native performance:',
        point2: 'Vanilla JavaScript and pure CSS optimised for 60 frames per second.',
        point3Title: 'Deliberate negative space:',
        point3: 'Allowing the interface to breathe without saturation.',
        btnContinue: 'Continue on Home',
        btnWork: 'See Work section →',
      },
      contact: {
        title: 'Start the conversation',
        labelName: 'Your Name',
        placeholderName: 'e.g. Valentina Rossi',
        labelEmail: 'Your Email',
        placeholderEmail: 'e.g. valentina@studio.co',
        labelMsg: 'Project Details',
        placeholderMsg: 'Tell me about your vision, goals and timeline...',
        btnSend: 'Send Message',
      },
      projectDetail: {
        installLabel: 'INSTALL / ACCESS',
        btnGithub: 'Visit GitHub Repository',
      },
    },

    // Portfolio data
    data: {
      projects: [
        {
          subtitle: 'Retro 80s theme for VS Code with neon & cyberpunk aesthetic',
          description:
            'A retro theme with vibrant colours, 80s poster-inspired typography and optional neon glow effect in the code editor. Over 1.2M global downloads.',
          details:
            '80s retro theme for VS Code with over 1.2M active installs, customisable neon glow effects and a palette inspired by cyberpunk films.',
        },
        {
          subtitle: 'Ultra-lightweight viewport state tracker at 60fps',
          description:
            'Minimalist JavaScript library that subscribes your app to viewport state changes — scroll, window size and pointer position — without overloading the render thread.',
          details:
            'Ultra-minimalist vanilla JavaScript library that tracks browser viewport state (scroll position, pointer velocity, window size) with near-zero resource consumption.',
        },
        {
          subtitle: 'Decoupled SPA router and browser history manager',
          description:
            'Modern navigation and browser history engine built for smooth page transitions, intelligent prefetching and a seamless editorial experience.',
          details:
            'Modern navigation and browser history engine designed for decoupled architectures and editorial experiences with smooth transition support.',
        },
        {
          subtitle: 'Accessible design system with harmonic colour tokens',
          description:
            'Accessible component set that guarantees WCAG AAA contrast ratios, harmonic scales and subtle animations for digital publications.',
          details:
            'Design system and accessible token set with WCAG AAA ratio calculations, harmonic scales and components for refined digital publications.',
        },
      ],
      articles: [
        {
          date: 'MARCH 2026',
          excerpt:
            'How to optimise passive listeners, requestAnimationFrame and transformation matrix calculations without overloading the browser main thread.',
          readTime: '5 min read',
        },
        {
          date: 'JANUARY 2026',
          excerpt:
            'Modular scales and optical contrast in contemporary web interfaces: building deliberate visual hierarchies without relying on industrial templates.',
          readTime: '7 min read',
        },
        {
          date: 'OCTOBER 2025',
          excerpt:
            'Why interactive software should feel like a handcrafted work, respecting negative space, tangible transitions and the unique tone of each project.',
          readTime: '6 min read',
        },
      ],
    },

    // Toast
    toast: {
      emailCopied: 'Email hola@juandev.co copied to clipboard!',
      emailManual: 'Copy manually: hola@juandev.co',
      formSuccess: 'Thanks, {name}! Message sent successfully.',
    },
  },

  es: {
    // Navbar
    nav: {
      menu: 'MENU',
      hireMe: 'HIRE ME',
      langToggle: 'ING',
    },

    // Hero
    hero: {
      greeting: 'Hola, mi',
      nameLine: 'nombre es',
      name: 'Robb',
      subtitle: 'Soy un',
      role: 'desarrollador creativo independiente',
      location: 'de Abergavenny, Gales del Sur.',
      scroll: 'SCROLL',
    },

    // Side brand
    sideBrand: '© MMXXVI. Gwneud yn Ne Cymru.',

    // About
    about: {
      heading: 'Trabajemos juntos',
      description:
        'Desde diseño de interacción hasta sistemas de diseño escalables, aplicaciones de página única hasta algo más experimental con WebGL. Ayudo a personas increíbles a construir proyectos web ambiciosos pero accesibles — ',
      boldPart: 'entre más atrevido, mejor',
      btnLabel: 'Sobre mi enfoque',
    },

    // Projects
    projects: {
      heading: 'Proyectos Seleccionados',
      subtext:
        'Una colección de herramientas de código abierto, librerías frontend y experimentos creativos diseñados con atención al detalle y enfoque artesanal.',
      searchPlaceholder: 'Buscar por tecnología, nombre o categoría...',
      noResults: 'No se encontraron proyectos con el término "',
      noResultsEnd: '".',
      showAll: 'Mostrar todos los proyectos',
      viewDetails: 'Ver Detalles y Código',
    },

    // Writing
    writing: {
      heading: 'Writing',
      subtext:
        'Reflexiones sobre ingeniería frontend nativa, sistemas tipográficos, microinteracciones y artesanía digital.',
    },

    // Contact
    contact: {
      heading: 'Tienes un proyecto en mente',
      subtext:
        'Actualmente estoy disponible para proyectos freelance selectos, consultoría técnica de frontend y colaboraciones creativas. Escríbeme a ',
      subtextEnd: ' o conéctate en mis redes de abajo.',
      btnSend: 'Envíame un mensaje',
    },

    // Footer
    footer: {
      copyright: '© MMXXVI. Portafolio de Juan. Diseñado y construido con precisión artesanal en Medellín, Colombia.',
      scrollTop: 'Subir al Inicio',
      about: 'Sobre Mí',
      projects: 'Proyectos',
      contact: 'Contacto',
    },

    // Menu Overlay
    menuOverlay: {
      close: 'CLOSE',
      hireMe: 'HIRE ME',
      home: 'Home',
      homeDesc: 'Volver a la página de inicio.',
      work: 'Work',
      workDesc: 'Mi enfoque al desarrollo.',
      about: 'About',
      aboutDesc: 'Un poco sobre mí y mi trayectoria.',
      writing: 'Writing',
      writingDesc: 'Mis últimos artículos sobre tecnología y lenguaje.',
    },

    // Modals
    modals: {
      enfoque: {
        title: 'Mi Enfoque Creativo',
        body: 'Creo que el software web no debe sentirse como una cuadrícula industrial indiferenciada. Cada producto merece una voz tipográfica distintiva, micro-interacciones deliberadas y un código base artesanal sin excesos.',
        point1Title: 'Tipografía primero:',
        point1: 'Jerarquía visual estricta y escalas de proporción armónica.',
        point2Title: 'Rendimiento nativo:',
        point2: 'JavaScript vanilla y CSS puro optimizado para 60 cuadros por segundo.',
        point3Title: 'Espacio negativo deliberado:',
        point3: 'Permitir que la interfaz respire sin saturación.',
        btnContinue: 'Continuar en Home',
        btnWork: 'Ver sección Work →',
      },
      contact: {
        title: 'Inicia la conversación',
        labelName: 'Tu Nombre',
        placeholderName: 'ej. Valentina Rossi',
        labelEmail: 'Tu Correo Electrónico',
        placeholderEmail: 'ej. valentina@estudio.co',
        labelMsg: 'Detalles del Proyecto',
        placeholderMsg: 'Cuéntame sobre tu visión, metas y plazos...',
        btnSend: 'Enviar Mensaje',
      },
      projectDetail: {
        installLabel: 'INSTALACIÓN / ACCESO',
        btnGithub: 'Visitar Repositorio en GitHub',
      },
    },

    // Portfolio data
    data: {
      projects: [
        {
          subtitle: 'Tema retro 80s para VS Code con estética neón & cyberpunk',
          description:
            'Un tema retro con colores vibrantes, tipografía inspirada en carteles de los 80s y efecto de brillo neón opcional en el editor de código. Más de 1.2M de descargas globales.',
          details:
            'Tema retro de los años 80 para VS Code con más de 1.2M de instalaciones activas, efectos de brillo neón personalizables y paleta inspirada en películas cyberpunk.',
        },
        {
          subtitle: 'Rastreador de estado del viewport ultraliviano a 60fps',
          description:
            'Librería minimalista de JavaScript que suscribe tu aplicación a los cambios de estado del viewport: scroll, tamaño de ventana y posición del puntero sin sobrecargar el hilo de render.',
          details:
            'Biblioteca ultra minimalista en JavaScript vanilla que rastrea el estado del viewport del navegador (posición de scroll, velocidad del puntero, tamaño de ventana) con un consumo de recursos prácticamente nulo.',
        },
        {
          subtitle: 'Enrutador SPA y gestor de historial de navegador desacoplado',
          description:
            'Motor moderno de navegación e historial del navegador pensado para transiciones de página fluidas, precarga inteligente y una experiencia editorial continua.',
          details:
            'Motor moderno de navegación e historial del navegador diseñado para arquitecturas desacopladas y experiencias editoriales con soporte de transiciones fluidas.',
        },
        {
          subtitle: 'Sistema de diseño accesible con tokens de color armónicos',
          description:
            'Conjunto de componentes accesibles que garantizan contrastes WCAG AAA, escalas armónicas y animaciones sutiles para publicaciones digitales.',
          details:
            'Sistema de diseño y conjunto de tokens accesibles con cálculos de ratio WCAG AAA, escalas armónicas y componentes para publicaciones digitales refinadas.',
        },
      ],
      articles: [
        {
          date: 'MARZO 2026',
          excerpt:
            'Cómo optimizar listeners pasivos, requestAnimationFrame y cálculos de matrices de transformación sin sobrecargar el hilo principal del navegador.',
          readTime: '5 min de lectura',
        },
        {
          date: 'ENERO 2026',
          excerpt:
            'Escalas modulares y contraste óptico en interfaces web contemporáneas: construyendo jerarquías visuales deliberadas sin depender de plantillas industriales.',
          readTime: '7 min de lectura',
        },
        {
          date: 'OCTUBRE 2025',
          excerpt:
            'Por qué el software interactivo debe sentirse como un trabajo artesanal, respetando el espacio negativo, las transiciones tangibles y el tono propio de cada proyecto.',
          readTime: '6 min de lectura',
        },
      ],
    },

    // Toast
    toast: {
      emailCopied: '¡Correo hola@juandev.co copiado al portapapeles!',
      emailManual: 'Copia manual: hola@juandev.co',
      formSuccess: '¡Gracias, {name}! Mensaje enviado con éxito.',
    },
  },
} as const;
