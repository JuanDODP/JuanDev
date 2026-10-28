import type { IconType } from 'react-icons';
import { SiCursor, SiGithubcopilot, SiGmail, SiGooglechrome, SiGoogledocs, SiGoogledrive, SiGooglegemini } from 'react-icons/si';
import { TbBrandOpenai, TbFileText, TbPlug, TbPuzzle, TbShieldCheck, TbSparkles, TbUserCheck, TbUsers } from 'react-icons/tb';

export type WorkflowChip = { label: string; icon?: IconType; color?: string };

export type WorkflowNode = {
  id: string;
  title: string;
  text: string;
  icon: IconType;
  /** What the Claude Code card prints while this stage is active. */
  status: string;
  chips: WorkflowChip[];
};

/** How I work with Claude Code: left column feeds the agent, right column checks its output. */
export const aiWorkflow: WorkflowNode[] = [
  {
    id: 'context',
    title: 'Contexto del proyecto',
    text: 'Cada repo tiene su CLAUDE.md con reglas, stack y decisiones, y una memoria que persiste entre sesiones.',
    icon: TbFileText,
    status: 'Leyendo CLAUDE.md y memoria del proyecto',
    chips: [{ label: 'CLAUDE.md' }, { label: 'Memoria' }, { label: 'Reglas de contenido' }],
  },
  {
    id: 'skills',
    title: 'Skills',
    text: 'Paquetes de conocimiento experto que instalo según la tarea: diseño, animación, React y arquitectura.',
    icon: TbPuzzle,
    status: 'Cargando skills: frontend-design, animate',
    chips: [
      { label: 'frontend-design' },
      { label: 'emil-design-eng' },
      { label: 'ui-ux-pro-max' },
      { label: 'animate' },
      { label: 'vercel-react-best-practices' },
      { label: 'find-skills' },
    ],
  },
  {
    id: 'mcp',
    title: 'MCPs',
    text: 'Conecto el agente con herramientas reales: navega y captura en Chrome, lee documentos y correos.',
    icon: TbPlug,
    status: 'MCP Chrome: abriendo la página para revisarla',
    chips: [
      { label: 'Chrome', icon: SiGooglechrome, color: '#4285f4' },
      { label: 'Google Drive', icon: SiGoogledrive, color: '#1fa463' },
      { label: 'Google Docs', icon: SiGoogledocs, color: '#4285f4' },
      { label: 'Gmail', icon: SiGmail, color: '#ea4335' },
    ],
  },
  {
    id: 'agents',
    title: 'Subagentes',
    text: 'Delego exploración del código, planeación y revisión a agentes en paralelo mientras sigo construyendo.',
    icon: TbUsers,
    status: 'Subagente Explore: mapeando el código',
    chips: [{ label: 'Explore' }, { label: 'Plan' }, { label: 'Code review' }],
  },
  {
    id: 'verify',
    title: 'Verificación',
    text: 'Nada se entrega sin pasar tipos, lint, build y capturas en escritorio y móvil.',
    icon: TbShieldCheck,
    status: 'tsc · eslint · build · capturas: todo en verde',
    chips: [{ label: 'TypeScript' }, { label: 'ESLint' }, { label: 'Build' }, { label: 'Playwright' }],
  },
  {
    id: 'human',
    title: 'Mi criterio',
    text: 'La IA acelera; la arquitectura, la revisión del diff y el commit final los decido yo.',
    icon: TbUserCheck,
    status: 'Esperando tu revisión antes del commit',
    chips: [{ label: 'Arquitectura' }, { label: 'Revisión del diff' }, { label: 'Commit' }],
  },
];

export const aiTools: WorkflowChip[] = [
  { label: 'ChatGPT', icon: TbBrandOpenai, color: 'var(--text)' },
  { label: 'Gemini', icon: SiGooglegemini, color: '#8e75ff' },
  { label: 'Stitch', icon: TbSparkles, color: '#7cacf8' },
  { label: 'GitHub Copilot', icon: SiGithubcopilot, color: 'var(--text)' },
  { label: 'Cursor', icon: SiCursor, color: 'var(--text)' },
];
