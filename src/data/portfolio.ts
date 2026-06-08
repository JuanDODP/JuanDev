import type {
  ProfileData,
  ExperienceItem,
  ProjectItem,
  SkillGroup,
  EducationItem,
  SoftSkill,
} from '../types/portfolio.types';

export const profile: ProfileData = {
  name: 'Juan Diego Domínguez Castaño',
  title: 'Full Stack JavaScript Engineer',
  headline: 'Full Stack JS con sistemas en producción.',
  bio: 'Más de 2 años desarrollando con React, Next.js, Node.js y NestJS en producción real. TypeScript en modo estricto como estándar. He desplegado infraestructura completa en AWS de forma independiente. Apps publicadas en Google Play, App Store y Huawei AppGallery. Uso habitual de AI tools como multiplicadores de productividad — reviso lo que generan, soy dueño de lo que shipio.',
  email: 'juand.dominguez.castano.ce23@gmail.com',
  phone: '+52 5612227107',
  linkedin: 'https://www.linkedin.com/in/juan-diego-dom%C3%ADnguez-casta%C3%B1o-2a6a78335/',
  github: 'https://github.com/JuanDODP',
  cvUrl: 'https://drive.google.com/file/d/1YbY9tErXSbtppIGR5xiq_s_arQ_gMKN6/view?usp=sharing',
  photo: '/assets/profile/Juan.png',
};

export const experiences: ExperienceItem[] = [
  {
    id: 'sysranchito',
    company: 'SysBar',
    role: 'Full Stack Developer — Freelance',
    period: 'Abr 2026 – Presente',
    location: 'México',
    isCurrent: true,
    highlights: [
      'Diseñé y desplegué sistema ERP + Punto de Venta completo con responsabilidad total del ciclo de desarrollo.',
      'Implementé sincronización en tiempo real entre caja y administradores — Socket.io sobre WSS, Nginx proxy inverso con SSL/TLS.',
      'Desarrollé lógica de inventario por receta con descuento automático de ingredientes compuestos garantizando consistencia de stock en tiempo real.',
    ],
    tags: ['React', 'NestJS', 'Node.js', 'Socket.io', 'AWS', 'Nginx'],
  },
  {
    id: 'integra-arrenda',
    company: 'Integra Arrenda',
    role: 'Desarrollador Full Stack',
    period: 'Ene 2026 – Abr 2026',
    location: 'CDMX, México',
    highlights: [
      '−30% errores operativos — índices estratégicos, triggers y procedimientos almacenados en PostgreSQL que automatizaron validaciones críticas de negocio.',
      'Desarrollé SGA empresarial completo en 90 días — React, Next.js, TypeScript (frontend) · NestJS, Node.js, PostgreSQL, TypeORM, Clean Architecture con cero regresiones en go-live.',
      'Participé en despliegue en AWS (EC2, RDS, S3, CloudFront) con Docker y pipeline CI/CD para llevar el sistema a producción.',
    ],
    tags: ['React', 'Next.js', 'NestJS', 'PostgreSQL', 'TypeORM', 'AWS', 'Docker'],
  },
  {
    id: 'eduia',
    company: 'EDUIA',
    role: 'Desarrollador Full Stack / DevOps',
    period: 'Sep 2025 – Dic 2025',
    location: 'México',
    highlights: [
      '−40% tiempo de despliegue — pipelines CI/CD con GitHub Actions y Docker sobre AWS (EC2, RDS, S3, CloudFront).',
      'Automaticé publicación de app móvil reduciendo errores en releases y mejorando estabilidad en nuevas versiones.',
      'Estandaricé entornos de despliegue con variables de entorno, control de accesos y documentación técnica en AWS.',
    ],
    tags: ['AWS', 'Docker', 'GitHub Actions', 'CI/CD', 'React Native'],
  },
  {
    id: 'digital-pineapple',
    company: 'Digital Pineapple',
    role: 'Desarrollador de Software',
    period: 'Sep 2023 – Sep 2025',
    location: 'Toluca, EDOMEX',
    highlights: [
      '2 apps móviles publicadas en 3 plataformas — Merry Color y Century 21 · React Native, TypeScript, Redux, Context API · Google Play, App Store, Huawei AppGallery.',
      'Plataforma web de ticketing con integración de OpenPay y Mercado Pago, JWT, custom hooks, Context + Reducer y escaneo QR en producción.',
      'Lideré migración de sistema legacy asegurando compatibilidad y estabilidad; documenté arquitectura y mejores prácticas para el equipo.',
    ],
    tags: ['React', 'React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'JWT'],
  },
];

export const projects: ProjectItem[] = [
  {
    id: 'sysranchito-pos',
    title: 'SysBar',
    subtitle: 'ERP & Punto de Venta',
    targetAudience: 'Dueños de restaurantes/bares, gerentes operativos y personal de servicio.',
    context:
      'Sistema desarrollado end-to-end con responsabilidad total del ciclo de vida del software, operando en producción activa.',
    description:
      'Sistema ERP y Punto de Venta integral diseñado para el sector restaurantero. Incluye sincronización de comandas en tiempo real, gestión de estado de mesas y un motor avanzado de inventario basado en recetas que descuenta ingredientes compuestos automáticamente para asegurar la consistencia del stock. Desplegado en la nube con alta disponibilidad.',
    links: [{ label: 'Ver en producción', url: 'https://develop.di9d99ewoj4ig.amplifyapp.com/', type: 'demo' }],
    tags: ['React', 'NestJS', 'Node.js', 'Socket.io', 'Nginx', 'AWS Amplify', 'EC2'],
    category: 'web',
    status: 'production',
    preview: '/previews/sysbar.png',
  },
  {
    id: 'pos-miscelanea',
    title: 'POS Miscelánea',
    subtitle: 'Smart POS System',
    targetAudience: 'Propietarios de tiendas de abarrotes, misceláneas y comercios minoristas locales.',
    context:
      'Plataforma de punto de venta ágil enfocada en la optimización del inventario y la reposición inteligente.',
    description:
      'Sistema de Punto de Venta automatizado diseñado para agilizar las operaciones de cobro y el control de flujo de caja en comercios minoristas. Su principal diferenciador es un módulo de análisis de inventario que genera reportes automatizados para la reposición urgente de mercancía, categorizando las alertas según el tipo de producto para optimizar las decisiones de compra del negocio.',
    links: [{ label: 'Ver demo', url: 'https://testclaude.d32e29om3ytecc.amplifyapp.com/', type: 'demo' }],
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS Amplify'],
    category: 'web',
    status: 'production',
    preview: '/previews/pos-misc.png',
  },
  {
    id: 'sga-integra',
    title: 'Sistema de Gestión de Asignaciones',
    subtitle: 'SGA Corporativo',
    targetAudience: 'Usuarios corporativos, analistas de operaciones y gerentes del sector financiero/arrendatario.',
    context:
      'Plataforma empresarial para la transformación digital, construida bajo los principios de Clean Architecture para evitar regresiones en despliegues a producción.',
    description:
      'Plataforma corporativa que digitaliza y automatiza validaciones críticas de negocio directamente a nivel de base de datos, logrando una reducción significativa en los errores operativos. Su arquitectura modular y segura garantiza un procesamiento robusto y escalable para las operaciones internas de la empresa.',
    links: [{ label: 'Ver en producción', url: 'https://stable.d2b4kybjjmycs6.amplifyapp.com/', type: 'demo' }],
    tags: ['React', 'Next.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'TypeORM', 'AWS'],
    category: 'web',
    status: 'production',
    preview: '/previews/sga.png',
  },
  {
    id: 'eduia-infra',
    title: 'EDUIA',
    subtitle: 'Cloud & DevOps Infrastructure',
    targetAudience: 'Instituciones educativas, administradores escolares y equipos internos de desarrollo.',
    context:
      'Estandarización de entornos de despliegue y automatización de la infraestructura en la nube para un sistema del sector educativo.',
    description:
      'Configuración e implementación de pipelines de despliegue continuo (CI/CD) e infraestructura en la nube, optimizando los tiempos de lanzamiento y la estabilidad de la plataforma. Se estandarizaron los entornos de producción con estrictos controles de seguridad y variables de acceso, automatizando la publicación de versiones tanto para web como para plataformas móviles.',
    links: [],
    tags: ['AWS', 'Docker', 'GitHub Actions', 'CI/CD', 'EC2', 'RDS', 'S3', 'CloudFront'],
    category: 'infra',
    status: 'internal',
  },
  {
    id: 'merry-color',
    title: 'Distribución Merry Color',
    subtitle: 'Multiplatform App',
    targetAudience: 'Usuarios finales y distribuidores comerciales.',
    context:
      'Aplicación móvil desplegada bajo una arquitectura centralizada y publicada simultáneamente en los tres principales ecosistemas móviles.',
    description:
      'Aplicación móvil multiplataforma orientada al comercio y la distribución. Construida con un manejo robusto del estado global para garantizar una experiencia de usuario fluida, permitiendo un release completo y estable que cumple con los estrictos lineamientos de calidad de las plataformas de Google, Apple y Huawei.',
    links: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.MerryColor.DistribucionMerryColor&pcampaignid=web_share',
        type: 'playstore',
      },
      {
        label: 'App Store',
        url: 'https://apps.apple.com/mx/app/merrycolor/id6569221778',
        type: 'appstore',
      },
    ],
    tags: ['React Native', 'TypeScript', 'Redux', 'Node.js'],
    category: 'mobile',
    status: 'production',
    preview: '/previews/merry-color.png',
  },
  {
    id: 'yo-comparto',
    title: 'Yo Comparto',
    subtitle: 'Social / Community App',
    targetAudience: 'Comunidad de usuarios en búsqueda de interacciones y economía colaborativa.',
    context: 'Desarrollo de aplicación móvil multiplataforma orientada al usuario final.',
    description:
      'Aplicación móvil interactiva diseñada para fomentar la conexión y el intercambio entre los usuarios de su comunidad. Optimizada para ofrecer un rendimiento nativo sobresaliente, interfaces intuitivas y un flujo de navegación ágil en dispositivos iOS y Android.',
    links: [
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.yocomparto&pcampaignid=web_share',
        type: 'playstore',
      },
      {
        label: 'App Store',
        url: 'https://apps.apple.com/us/app/yo-comparto/id6526198061',
        type: 'appstore',
      },
    ],
    tags: ['React Native', 'TypeScript', 'REST APIs'],
    category: 'mobile',
    status: 'production',
    preview: '/previews/yo-comparto.png',
  },
  {
    id: 'merry-boletos',
    title: 'MerryBoletos',
    subtitle: 'Ticketing & Access Control',
    targetAudience: 'Organizadores de eventos, personal de logística y compradores finales de boletos.',
    context: 'Plataforma transaccional de alto tráfico para el manejo de e-commerce y validaciones de accesos en tiempo real.',
    description:
      'Plataforma integral de e-commerce y ticketing que gestiona el ciclo completo de la venta de entradas. Incluye la integración de múltiples pasarelas de pago seguro y un sistema robusto de control de accesos mediante escaneo y validación de códigos QR en producción real, garantizando la seguridad en eventos en vivo.',
    links: [],
    tags: ['React', 'Node.js', 'PostgreSQL', 'OpenPay', 'Mercado Pago', 'JWT'],
    category: 'web',
    status: 'internal',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    icon: '⬡',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Angular', 'Redux', 'Context API', 'Tailwind CSS'],
    accent: '#61DAFB',
  },
  {
    category: 'Backend',
    icon: '◈',
    items: ['Node.js', 'NestJS', 'Express', 'REST APIs', 'JWT', 'Socket.io', 'TypeORM', 'Prisma'],
    accent: '#68A063',
  },
  {
    category: 'Mobile',
    icon: '◻',
    items: ['React Native', 'iOS', 'Android', 'Google Play', 'App Store', 'Huawei AppGallery'],
    accent: '#7C3AED',
  },
  {
    category: 'Bases de Datos',
    icon: '◧',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL Server', 'Migraciones', 'Optimización'],
    accent: '#336791',
  },
  {
    category: 'DevOps & Cloud',
    icon: '◈',
    items: ['AWS', 'EC2', 'S3', 'RDS', 'CloudFront', 'Amplify', 'Docker', 'GitHub Actions', 'CI/CD', 'Nginx', 'PM2'],
    accent: '#FF9900',
  },
  {
    category: 'Testing & AI',
    icon: '◉',
    items: ['Jest', 'React Testing Library', 'Playwright', 'Claude Code', 'GitHub Copilot', 'Cursor'],
    accent: '#4F9EFF',
  },
];

export const softSkills: SoftSkill[] = [
  { label: 'Liderazgo Técnico', description: 'Toma de decisiones arquitectónicas y responsabilidad end-to-end del ciclo de desarrollo.' },
  { label: 'Ética Técnica', description: 'Código limpio, documentación real y transparencia en estimaciones y compromisos.' },
  { label: 'Colaboración y Mentoría', description: 'Trabajo en equipos multidisciplinarios bajo Scrum/Agile con cultura de code review.' },
  { label: 'Resolución Analítica', description: 'Diagnóstico sistemático de problemas complejos en producción con impacto medible.' },
  { label: 'Inglés Técnico', description: 'Nivel intermedio — lectura de documentación, comunicación técnica escrita y APIs.' },
];

export const education: EducationItem[] = [
  {
    institution: 'Universidad Tecnológica del Valle de Toluca',
    degree: 'Ingeniería en Desarrollo y Gestión de Software',
    period: 'Sep 2024 – Abr 2026',
    location: 'México',
  },
  {
    institution: 'Universidad Tecnológica del Valle de Toluca',
    degree: 'T.S.U. Desarrollo de Software Multiplataforma',
    period: 'Sep 2022 – Ago 2024',
    location: 'México',
  },
];
