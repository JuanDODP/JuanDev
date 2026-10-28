import type { IconType } from 'react-icons';
import {
  TbActivityHeartbeat,
  TbBucket,
  TbDatabase,
  TbLambda,
  TbRocket,
  TbServer,
  TbShieldLock,
  TbStack2,
  TbWorld,
} from 'react-icons/tb';
import { SiDocker, SiGithub, SiGithubactions, SiNginx, SiPm2, SiSst, SiTerraform, SiExpo } from 'react-icons/si';

export type CloudTool = {
  id: string;
  name: string;
  icon: IconType;
  color: string;
  use: string;
};

/** AWS services, colored by their AWS architecture category. */
export const awsServices: CloudTool[] = [
  {
    id: 'ec2',
    name: 'EC2',
    icon: TbServer,
    color: 'var(--aws-compute)',
    use: 'Servidores para APIs NestJS con Nginx como proxy inverso, SSL y WebSockets.',
  },
  {
    id: 'lambda',
    name: 'Lambda',
    icon: TbLambda,
    color: 'var(--aws-compute)',
    use: 'Funciones serverless orquestadas con SST en un ERP multi-inquilino.',
  },
  {
    id: 's3',
    name: 'S3',
    icon: TbBucket,
    color: 'var(--aws-storage)',
    use: 'Hosting estático de este portafolio y almacenamiento de archivos.',
  },
  {
    id: 'rds',
    name: 'RDS',
    icon: TbDatabase,
    color: 'var(--aws-database)',
    use: 'PostgreSQL administrado para sistemas corporativos en producción.',
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    icon: TbWorld,
    color: 'var(--aws-network)',
    use: 'CDN y HTTPS delante de los frontends para entregar rápido en todo México.',
  },
  {
    id: 'amplify',
    name: 'Amplify',
    icon: TbRocket,
    color: 'var(--aws-security)',
    use: 'Frontends de SysBar, POS y SGA con despliegue automático por rama.',
  },
  {
    id: 'sqs',
    name: 'SQS',
    icon: TbStack2,
    color: 'var(--aws-monitor)',
    use: 'Colas de mensajes con reintentos para procesos que no pueden perderse.',
  },
  {
    id: 'cloudwatch',
    name: 'CloudWatch',
    icon: TbActivityHeartbeat,
    color: 'var(--aws-monitor)',
    use: 'Alarmas y logs para detectar fallas antes que el usuario.',
  },
  {
    id: 'iam',
    name: 'IAM',
    icon: TbShieldLock,
    color: 'var(--aws-security)',
    use: 'Credenciales de mínimo privilegio para los pipelines de CI/CD.',
  },
];

export const devopsTools: CloudTool[] = [
  { id: 'docker', name: 'Docker', icon: SiDocker, color: '#2496ed', use: 'Builds reproducibles y entornos idénticos.' },
  { id: 'actions', name: 'GitHub Actions', icon: SiGithubactions, color: '#2088ff', use: 'Pipelines de build, pruebas y despliegue.' },
  { id: 'nginx', name: 'Nginx', icon: SiNginx, color: '#009639', use: 'Proxy inverso, SSL/TLS y WSS.' },
  { id: 'pm2', name: 'PM2', icon: SiPm2, color: '#a78bfa', use: 'Procesos Node.js con recarga sin caída.' },
  { id: 'terraform', name: 'Terraform', icon: SiTerraform, color: '#844fba', use: 'Infraestructura como código.' },
  { id: 'sst', name: 'SST', icon: SiSst, color: '#e27152', use: 'Infraestructura serverless en TypeScript.' },
];

/* ─── Terminal demo ──────────────────────────────────────────── */

export type PipelineNode = { id: string; label: string; icon: IconType; color: string };

export type TermLine =
  | { kind: 'cmd'; text: string; node: string }
  | { kind: 'out' | 'ok'; text: string; node: string };

export type DeployScenario = {
  id: string;
  label: string;
  summary: string;
  host: string;
  nodes: PipelineNode[];
  lines: TermLine[];
};

const node = {
  github: { id: 'github', label: 'GitHub', icon: SiGithub, color: '#e6eaf2' },
  actions: { id: 'actions', label: 'GitHub Actions', icon: SiGithubactions, color: '#2088ff' },
  docker: { id: 'docker', label: 'Docker build', icon: SiDocker, color: '#2496ed' },
  iam: { id: 'iam', label: 'IAM', icon: TbShieldLock, color: 'var(--aws-security)' },
  s3: { id: 's3', label: 'S3', icon: TbBucket, color: 'var(--aws-storage)' },
  ec2: { id: 'ec2', label: 'EC2', icon: TbServer, color: 'var(--aws-compute)' },
  pm2: { id: 'pm2', label: 'PM2', icon: SiPm2, color: '#a78bfa' },
  nginx: { id: 'nginx', label: 'Nginx', icon: SiNginx, color: '#009639' },
  amplify: { id: 'amplify', label: 'Amplify', icon: TbRocket, color: 'var(--aws-security)' },
  expo: { id: 'expo', label: 'Build móvil', icon: SiExpo, color: '#e6eaf2' },
  sst: { id: 'sst', label: 'SST', icon: SiSst, color: '#e27152' },
  lambda: { id: 'lambda', label: 'Lambda + SQS', icon: TbLambda, color: 'var(--aws-compute)' },
  cloudwatch: { id: 'cloudwatch', label: 'CloudWatch', icon: TbActivityHeartbeat, color: 'var(--aws-monitor)' },
} satisfies Record<string, PipelineNode>;

export const deployScenarios: DeployScenario[] = [
  {
    id: 'portfolio',
    label: 'Este portafolio',
    summary: 'Cada push a main compila el sitio dentro de Docker y lo sincroniza con un bucket S3.',
    host: 'github-actions',
    nodes: [node.github, node.actions, node.docker, node.iam, node.s3],
    lines: [
      { kind: 'cmd', text: 'git push origin main', node: 'github' },
      { kind: 'out', text: 'To github.com:JuanDODP/JuanDev.git  main -> main', node: 'github' },
      { kind: 'ok', text: 'Workflow "Build con Docker y Despliegue a S3" iniciado', node: 'actions' },
      { kind: 'cmd', text: 'docker build -f Dockerfile.prod -t react-app-builder .', node: 'docker' },
      { kind: 'out', text: 'npm ci  ·  tsc -b  ·  vite build', node: 'docker' },
      { kind: 'ok', text: 'Imagen lista, dist/ extraído del contenedor', node: 'docker' },
      { kind: 'ok', text: 'Credenciales de AWS cargadas  ·  región us-east-2', node: 'iam' },
      { kind: 'cmd', text: 'aws s3 sync ./dist s3://site-dominguezdev.duckdns.org --delete', node: 's3' },
      { kind: 'out', text: 'upload: dist/index.html', node: 's3' },
      { kind: 'out', text: 'upload: dist/assets/index.js', node: 's3' },
      { kind: 'ok', text: 'Desplegado en producción', node: 's3' },
    ],
  },
  {
    id: 'sysbar',
    label: 'SysBar',
    summary: 'API NestJS en EC2 detrás de Nginx con SSL y WebSockets; el frontend sale desde Amplify.',
    host: 'ubuntu@ec2',
    nodes: [node.github, node.ec2, node.pm2, node.nginx, node.amplify],
    lines: [
      { kind: 'cmd', text: 'git pull origin main && npm ci && npm run build', node: 'github' },
      { kind: 'ok', text: 'Build de la API NestJS completado', node: 'ec2' },
      { kind: 'cmd', text: 'pm2 reload sysbar-api', node: 'pm2' },
      { kind: 'ok', text: 'Recarga sin caída  ·  2 procesos en línea', node: 'pm2' },
      { kind: 'cmd', text: 'sudo nginx -t && sudo systemctl reload nginx', node: 'nginx' },
      { kind: 'out', text: 'proxy inverso  ·  SSL/TLS  ·  WSS para Socket.io', node: 'nginx' },
      { kind: 'ok', text: 'Configuración válida, Nginx recargado', node: 'nginx' },
      { kind: 'out', text: 'Amplify: build del frontend en la rama main', node: 'amplify' },
      { kind: 'ok', text: 'Comandas en tiempo real operando', node: 'amplify' },
    ],
  },
  {
    id: 'lagrangiano',
    label: 'Lagrangiano',
    summary: 'ERP serverless con SST. Mi parte: CI/CD de las apps móviles y observabilidad.',
    host: 'github-actions',
    nodes: [node.actions, node.expo, node.sst, node.lambda, node.cloudwatch],
    lines: [
      { kind: 'cmd', text: 'gh workflow run mobile-build.yml', node: 'actions' },
      { kind: 'out', text: 'Compilando apps Expo para iOS y Android', node: 'expo' },
      { kind: 'ok', text: 'Builds listos, aviso enviado al equipo', node: 'expo' },
      { kind: 'cmd', text: 'npx sst deploy --stage production', node: 'sst' },
      { kind: 'out', text: 'Funciones Lambda, colas SQS con reintentos', node: 'lambda' },
      { kind: 'ok', text: 'Stack desplegado', node: 'lambda' },
      { kind: 'cmd', text: 'aws cloudwatch describe-alarms --state-value ALARM', node: 'cloudwatch' },
      { kind: 'ok', text: '0 alarmas activas', node: 'cloudwatch' },
    ],
  },
];
