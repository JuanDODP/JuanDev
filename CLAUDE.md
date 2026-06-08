# Objetivo Principal: Excelencia Visual y Animación Avanzada
El objetivo de este proyecto es desarrollar un portafolio web de nivel "Pro-Max". **El diseño, la personalización y la fluidez de las animaciones son la máxima prioridad.** Debe transmitir un perfil de ingeniería de software de alto nivel corporativo (Tema oscuro Graphite/Midnight Blue con acentos limpios). Se exige un uso magistral de GSAP y View Transitions para crear una experiencia interactiva sin saltos bruscos.

## Fase 1: Entorno y Activación de Skills (Obligatorio)
Claude, antes de planificar o codificar, asegúrate de tener instalados y activados los siguientes *skills*. Ejecuta estos comandos en la terminal si es necesario para habilitarlos en este workspace:

1.  **Skills Base y UI/UX:**
    * `npx impeccable skills install`
    * `npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
    * `npx skills add anthropics/skills` (frontend-design)

2.  **Skills de Ingeniería y Diseño de Interacciones (Vercel & Emil):**
    * `npx skills add emilkowalski/skill` (emil-design-eng)
    * `npx skills add vercel-labs/skills` (find-skills)
    * `npx skills add vercel-labs/agent-skills` (react-best-practices)
    * `npx skills add vercel-labs/agent-skills` (react-view-transitions)

3.  **Dependencias del Proyecto:**
    * `npm install react-router-dom gsap @gsap/react`

## Fase 2: Plan de Acción y Análisis de Recursos (STOP & PLAN)
**Claude, detente aquí.** Antes de escribir código, debes:
1.  **Analizar los Recursos Locales:** 
    * Extrae la información de mi perfil y experiencia leyendo los archivos de CV ubicados en la raíz del proyecto.
    * Para la sección de portafolio, **lee el archivo Markdown de proyectos** que se encuentra en el proyecto. En este archivo encontrarás estructurado el contexto, el link del proyecto, el público dirigido y una breve descripción de cada desarrollo.
    * Identifica la ruta de mi fotografía de perfil, la cual se encuentra dentro de `assets/profile/`.
2.  **Crear un Plan Paso a Paso:** Imprime en la consola tu plan arquitectónico y de diseño para este portafolio basado en las Fases 3 y 4.
3.  **Solicitar Recursos Faltantes:** Pide al usuario cualquier asset extra que necesites para hacer esto posible.

*Espera la confirmación del usuario antes de proceder a la Fase 3.*

## Fase 3: Arquitectura de la Interfaz y Contenido
El diseño debe ser *Mobile-First*, accesible y sin errores de linting. 

**Reglas Estrictas de Contenido:**
* **Cero versionado:** Bajo ninguna circunstancia muestres versiones específicas de tecnologías, lenguajes o frameworks en la interfaz (por ejemplo, escribe "React" en lugar de "React 18", o "Node.js" en lugar de "Node.js 20+").
* **Modalidad de trabajo:** Omite cualquier indicación sobre el tipo de modalidad de trabajo (remoto, presencial o híbrido) en la experiencia profesional, a menos que sea una pieza clave de la descripción de las responsabilidades.

### 1. Hero Section (`/`)
* **Textos:** * "Juan Diego Domínguez Castaño - Full Stack JS Developer"
  * Subtítulo enfocado en soluciones escalables, ecosistema JS/TS, arquitecturas AWS y automatización con IA.
* **Animación:** Uso intensivo pero elegante de GSAP. Implementa un *staggered fade-in* al montar el componente (usando estrictamente `useGSAP` de `@gsap/react`).

### 2. Panel 'Sobre Mí' y Habilidades (Tech Stack)
* **Soft Skills:** Liderazgo, ética técnica, colaboración con mentores, resolución analítica y nivel de inglés técnico.
* **Hard Skills (Grid/Bento Box):** * AWS (EC2, S3, RDS, CloudFront).
  * IA (OpenAI APIs).
  * React, React Native, Angular, NestJS, TypeScript.

### 3. Proyectos Destacados (El núcleo interactivo)
* **Diseño:** Tarjetas corporativas minimalistas de bordes finos.
* **Contenido Dinámico:** La información de las tarjetas (títulos, descripciones, links, público objetivo y contexto) **debe ser extraída exactamente como viene en el archivo Markdown de proyectos** mencionado en la Fase 2. No inventes proyectos que no estén en ese archivo.
* **Interacción:** Las tarjetas deben reaccionar al *hover* mediante `gsap.to`, revelando la información técnica de manera fluida, combinándolo con React View Transitions para navegar a los detalles de cada proyecto.

## Fase 4: Directrices Estrictas de Desarrollo
* **Uso de GSAP:** Todo el control de animaciones complejas debe manejarse con GSAP usando el hook `useGSAP` para evitar memory leaks en React 18+.
* **Calidad de Código:** Aplica todo el conocimiento del skill `vercel-react-best-practices`. Estructura modular, componentes limpios, sin *prop drilling* excesivo.