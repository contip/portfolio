import type { Payload } from 'payload'
import type { Config } from '@/payload-types'

type CollectionSlug = keyof Config['collections']

type SeedResult = {
  message: string
  created: number
  updated: number
  deleted: number
  services: number
  caseStudies: number
  categories: number
  posts: number
  pages: number
}

type SeedCounters = {
  created: number
  updated: number
  deleted: number
}

const SEED_CONTEXT = {
  disableRevalidate: true,
}

const isoDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

type RichTextNode = Record<string, unknown>

const textNode = ({
  text,
  format = 0,
  color,
  background,
}: {
  text: string
  format?: number
  color?: string
  background?: string
}): RichTextNode => {
  const state: Record<string, string> = {}
  if (color) state.color = color
  if (background) state.background = background

  return {
    type: 'text',
    text,
    version: 1,
    detail: 0,
    mode: 'normal',
    style: '',
    format,
    ...(Object.keys(state).length > 0 ? { $: state } : {}),
  }
}

const paragraph = (...children: RichTextNode[]): RichTextNode => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children,
})

const heading = ({
  tag,
  text,
}: {
  tag: 'h1' | 'h2' | 'h3' | 'h4'
  text: string
}): RichTextNode => ({
  type: 'heading',
  tag,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: [textNode({ text })],
})

const richText = (...children: RichTextNode[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children,
  },
})

const link = ({
  label,
  url,
  appearance = 'default',
}: {
  label: string
  url: string
  appearance?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'text'
}) => ({
  type: 'custom' as const,
  url,
  label,
  appearance,
})

const iconSvg = {
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><path d="M7 18h10a4 4 0 0 0 0-8h-.3A6 6 0 1 0 7 18Z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><path d="m13 2-8 11h6l-1 9 9-13h-6l0-7Z"/></svg>`,
  coins: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v5c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 11v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/></svg>`,
  workflow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="M10 6h4a2 2 0 0 1 2 2v6"/><path d="M14 10h5"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><path d="m9 8-4 4 4 4"/><path d="m15 8 4 4-4 4"/><path d="m14 4-4 16"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56A1.95 1.95 0 1 0 5.2 6.88a1.95 1.95 0 0 0 1.96-1.94ZM20.44 13.4c0-3.43-1.83-5.03-4.27-5.03a3.67 3.67 0 0 0-3.3 1.82V8.5H9.5V20h3.37v-6.43c0-1.7.32-3.35 2.42-3.35 2.07 0 2.1 1.93 2.1 3.46V20h3.38v-6.6Z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.25 1.85 1.25 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.37 1.24-3.21-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.43 11.43 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.9 1.24 3.21 0 4.62-2.82 5.64-5.5 5.93.43.37.82 1.1.82 2.23v3.3c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z"/></svg>`,
} as const

const serviceSeed = [
  {
    slug: 'fractional-cto',
    title: 'Fractional CTO',
    blurb: 'Executive technical leadership, on demand.',
    heroTitle: 'Executive Technical Leadership That Ships',
    heroBody:
      'Align product strategy, engineering execution, and cloud architecture to drive measurable business outcomes.',
    bullets: [
      'Technical roadmap and architecture governance',
      'Hiring plans, org design, and engineering process tuning',
      'Stakeholder communication and delivery accountability',
    ],
    code: `interface ExecutionCadence {\n  strategy: 'quarterly';\n  architectureReview: 'bi-weekly';\n  deliveryReview: 'weekly';\n  riskBoard: 'continuous';\n}`,
  },
  {
    slug: 'software-engineering',
    title: 'Software Engineering',
    blurb: 'End-to-end product engineering that ships.',
    heroTitle: 'Production-Grade Web Application Delivery',
    heroBody:
      'Build modern, scalable software with clear ownership, maintainable code, and shipping velocity.',
    bullets: [
      'Full-stack feature delivery with clean architecture',
      'Testing, observability, and performance hardening',
      'Continuous delivery workflows and code quality systems',
    ],
    code: `type DeliveryGuardrails = {\n  ci: ['lint', 'typecheck', 'test'];\n  rollout: 'progressive';\n  errorBudget: 'tracked';\n}`,
  },
  {
    slug: 'cloud-engineering',
    title: 'Cloud Engineering',
    blurb: 'AWS platform engineering for resilient apps.',
    heroTitle: 'Cloud Platforms Built for Reliability and Speed',
    heroBody:
      'Design and operate secure, cost-aware cloud systems that support rapid iteration and growth.',
    bullets: [
      'Reference architecture and account/environment strategy',
      'Operational readiness, incident response, and observability',
      'Automation-first infrastructure and deployment workflows',
    ],
    code: `resource \"aws_cloudwatch_dashboard\" \"ops\" {\n  dashboard_name = \"platform-ops\"\n  dashboard_body = jsonencode({ widgets = [] })\n}`,
  },
  {
    slug: 'cloud-application-migration',
    title: 'Cloud Application Migration',
    blurb: 'Low-risk cloud migration programs.',
    heroTitle: 'Migrate Legacy Workloads Without Business Disruption',
    heroBody:
      'Move applications to cloud-native foundations with phased execution, clear rollback plans, and measurable milestones.',
    bullets: [
      'Workload assessment and migration wave planning',
      'Data, dependency, and integration strategy',
      'Cutover playbooks with validation and rollback',
    ],
    code: `type MigrationWave = {\n  inventory: string[];\n  dependencies: Record<string, string[]>;\n  cutoverWindow: string;\n  rollbackPlan: string;\n}`,
  },
  {
    slug: 'infrastructure-as-code',
    title: 'Infrastructure as Code',
    blurb: 'Modular, auditable Terraform infrastructure.',
    heroTitle: 'Terraform Infrastructure That Your Team Can Trust',
    heroBody:
      'Ship repeatable infrastructure with clear module boundaries, policy controls, and environment consistency.',
    bullets: [
      'Module-driven Terraform architecture',
      'State strategy, policy guardrails, and CI validation',
      'Environment promotion and secrets management patterns',
    ],
    code: `module \"vpc\" {\n  source = \"./modules/vpc\"\n  project = var.project_name\n  environment = var.environment\n}`,
  },
  {
    slug: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization',
    blurb: 'FinOps consulting that cuts waste fast.',
    heroTitle: 'Spend Less on Cloud Without Slowing Delivery',
    heroBody:
      'Build cost visibility and governance into engineering workflows to reduce waste and improve unit economics.',
    bullets: [
      'Cost allocation and workload-level visibility',
      'Rightsizing, storage lifecycle, and commit planning',
      'Engineering-friendly cost governance rituals',
    ],
    code: `interface FinOpsReview {\n  service: string;\n  monthlySpend: number;\n  optimizationActions: string[];\n  owner: string;\n}`,
  },
] as const

const caseStudySeed = [
  {
    slug: 'fines-gallery-digital-platform',
    title: "Fine's Gallery Digital Platform",
    summary:
      "Modernized a legacy gallery operation into a high-performance commerce and content platform with automated catalog, media, and marketing workflows.",
    clientName: "Fine's Gallery",
    industry: 'Art & Commerce',
    engagementDuration: 'Long-term build and optimization',
    keyResults: [
      { label: 'Platform Scope', value: 'Commerce + CMS + Ops Automation' },
      { label: 'Core Stack', value: 'Next.js + Payload + AWS' },
      { label: 'Operational Focus', value: 'Reliability, SEO, and conversion' },
    ],
    serviceSlugs: [
      'software-engineering',
      'cloud-engineering',
      'cloud-application-migration',
      'cloud-cost-optimization',
    ],
    challenge:
      'The business needed one coherent platform that could handle product catalog complexity, media-heavy pages, and marketing distribution without operational drag.',
    solution:
      'Implemented a modular Payload + Next.js architecture, integrated cloud media workflows, and standardized operational processes around repeatable deployment and publishing patterns.',
    impact:
      'The platform supports continuous growth initiatives without constant firefighting, while preserving editorial speed and consistent storefront quality.',
  },
  {
    slug: 'molten-core-services-platform',
    title: 'MoltenCore Services Platform',
    summary:
      'Built a service-led platform architecture that connects brand positioning, content operations, and lead generation for an engineering-focused business.',
    clientName: 'MoltenCore',
    industry: 'Industrial Technology',
    engagementDuration: 'Foundational build',
    keyResults: [
      { label: 'Delivery Model', value: 'Payload + Next.js monorepo workflow' },
      { label: 'Content Surface', value: 'Services + Blog + Conversion flows' },
      { label: 'Engineering Outcome', value: 'Faster publish-to-production cycle' },
    ],
    serviceSlugs: ['software-engineering', 'cloud-engineering', 'infrastructure-as-code'],
    challenge:
      'The team needed a clean technical foundation that could support rapid content iteration and high-confidence deployments without growing complexity.',
    solution:
      'Designed a clear collection model, reusable content blocks, and stable frontend rendering patterns to keep content and implementation aligned.',
    impact:
      'Editorial and engineering workflows became predictable, with clear extensibility for new pages, lead funnels, and campaign-specific content.',
  },
  {
    slug: 'portfolio-consultancy-platform',
    title: 'Portfolio Consultancy Platform',
    summary:
      'Engineered this consultancy platform to unify statically generated marketing surfaces, manual revalidation controls, and Terraform-based AWS infrastructure.',
    clientName: 'Conti Digital',
    industry: 'Software & Cloud Consulting',
    engagementDuration: 'Ongoing',
    keyResults: [
      { label: 'Frontend Runtime', value: 'Next.js 16 Cache Components' },
      { label: 'Infrastructure', value: 'Terraform VPC/ACM/RDS/Secrets/S3' },
      { label: 'Publishing Model', value: 'Static generation + manual revalidation' },
    ],
    serviceSlugs: [
      'fractional-cto',
      'cloud-engineering',
      'infrastructure-as-code',
      'cloud-cost-optimization',
    ],
    challenge:
      'The platform needed to balance high-performance static generation with operationally safe content updates and a maintainable backend/frontend contract.',
    solution:
      'Implemented a strict cache-tag strategy, explicit revalidation pathways, and infrastructure modules that isolate network, data, and secret boundaries.',
    impact:
      'The site now supports SEO-friendly publishing velocity with infrastructure and deployment guardrails suitable for production workloads.',
  },
  {
    slug: 'hcontiart-content-commerce-stack',
    title: 'HContiArt Content and Commerce Stack',
    summary:
      'Delivered a production-ready split backend/frontend architecture with refined rich text authoring, reusable block-driven layouts, and automated seed tooling.',
    clientName: 'HContiArt',
    industry: 'Creative Commerce',
    engagementDuration: 'Platform iteration',
    keyResults: [
      { label: 'Architecture', value: 'Decoupled backend + frontend apps' },
      { label: 'Authoring UX', value: 'Advanced rich text and block system' },
      { label: 'Operations', value: 'Seed endpoint + scripted setup' },
    ],
    serviceSlugs: ['software-engineering', 'cloud-application-migration', 'infrastructure-as-code'],
    challenge:
      'The project required a robust editorial experience and repeatable operational workflows while keeping frontend performance and maintainability high.',
    solution:
      'Implemented mature content modeling, shared type-safe contracts, and reliable build/revalidation behavior across environments.',
    impact:
      'The platform became easier to evolve and faster to operate, with cleaner boundaries between content operations and engineering concerns.',
  },
] as const

const categorySeed = [
  {
    slug: 'cloud-architecture',
    title: 'Cloud Architecture',
    description:
      'Patterns for reliable cloud systems, platform foundations, and environment strategy.',
    featured: true,
    featuredRank: 4,
  },
  {
    slug: 'platform-engineering',
    title: 'Platform Engineering',
    description:
      'Delivery systems, deployment pipelines, and operational design for scaling teams.',
    featured: true,
    featuredRank: 3,
  },
  {
    slug: 'finops',
    title: 'FinOps',
    description: 'Cloud cost strategy, operational controls, and sustainable spend management.',
    featured: true,
    featuredRank: 2,
  },
  {
    slug: 'engineering-leadership',
    title: 'Engineering Leadership',
    description:
      'Technical leadership systems for roadmap execution, team health, and delivery throughput.',
    featured: true,
    featuredRank: 1,
  },
] as const

const postSeed = [
  {
    slug: 'nextjs-16-cache-components-for-consultancy-sites',
    title: 'Next.js 16 Cache Components for Consultancy Sites',
    description:
      'How to combine static generation, cache tags, and manual revalidation for lead-focused websites.',
    categorySlug: 'platform-engineering',
    featured: true,
    featuredRank: 4,
    readingTime: 8,
  },
  {
    slug: 'terraform-foundations-for-modern-web-platforms',
    title: 'Terraform Foundations for Modern Web Platforms',
    description:
      'A pragmatic module strategy for VPC, RDS, certificates, media storage, and secrets.',
    categorySlug: 'cloud-architecture',
    featured: true,
    featuredRank: 3,
    readingTime: 9,
  },
  {
    slug: 'cloud-cost-optimization-without-delivery-regression',
    title: 'Cloud Cost Optimization Without Delivery Regression',
    description:
      'Practical FinOps loops engineering teams can adopt without slowing product velocity.',
    categorySlug: 'finops',
    featured: false,
    featuredRank: 1,
    readingTime: 7,
  },
  {
    slug: 'fractional-cto-operating-system-for-growing-teams',
    title: 'Fractional CTO Operating System for Growing Teams',
    description:
      'A concrete cadence for architecture governance, delivery reviews, and technical risk control.',
    categorySlug: 'engineering-leadership',
    featured: false,
    featuredRank: 0,
    readingTime: 6,
  },
] as const

const countByOperation = (counters: SeedCounters, operation: 'create' | 'update' | 'delete') => {
  if (operation === 'create') counters.created += 1
  if (operation === 'update') counters.updated += 1
  if (operation === 'delete') counters.deleted += 1
}

const findByField = async ({
  payload,
  collection,
  field,
  value,
}: {
  payload: Payload
  collection: CollectionSlug
  field: string
  value: string
}) => {
  const response = await payload.find({
    collection,
    where: {
      [field]: {
        equals: value,
      },
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  return response.docs[0]
}

const upsertByField = async ({
  payload,
  counters,
  collection,
  field,
  value,
  data,
  reset,
}: {
  payload: Payload
  counters: SeedCounters
  collection: CollectionSlug
  field: string
  value: string
  data: Record<string, unknown>
  reset: boolean
}) => {
  const existing = await findByField({ payload, collection, field, value })

  if (existing && reset) {
    await payload.delete({
      collection,
      id: existing.id,
      overrideAccess: true,
      context: SEED_CONTEXT,
    })
    countByOperation(counters, 'delete')
  }

  if (existing && !reset) {
    const updated = await payload.update({
      collection,
      id: existing.id,
      data,
      overrideAccess: true,
      context: SEED_CONTEXT,
    })
    countByOperation(counters, 'update')
    return updated
  }

  const created = await payload.create({
    collection,
    data,
    overrideAccess: true,
    context: SEED_CONTEXT,
  })
  countByOperation(counters, 'create')
  return created
}

const upsertBySlug = async ({
  payload,
  counters,
  collection,
  slug,
  data,
  reset,
}: {
  payload: Payload
  counters: SeedCounters
  collection: CollectionSlug
  slug: string
  data: Record<string, unknown>
  reset: boolean
}) =>
  upsertByField({
    payload,
    counters,
    collection,
    field: 'slug',
    value: slug,
    data,
    reset,
  })

const buildServiceLayout = ({
  title,
  heroBody,
  bullets,
  code,
  iconIds,
}: {
  title: string
  heroBody: string
  bullets: readonly string[]
  code: string
  iconIds: { cloud?: number; workflow?: number; bolt?: number }
}) => [
  {
    blockType: 'featuresBlock',
    tagline: 'Engagement Scope',
    backgroundColor: 'bg-slate-900',
    richText: richText(heading({ tag: 'h2', text: title }), paragraph(textNode({ text: heroBody }))),
    features: [
      {
        name: 'Architecture and direction',
        description: bullets[0],
        hasLink: true,
        icon: iconIds.cloud,
        link: link({ label: 'See case studies', url: '/case-studies', appearance: 'outline' }),
      },
      {
        name: 'Delivery execution',
        description: bullets[1],
        hasLink: true,
        icon: iconIds.workflow,
        link: link({ label: 'Explore services', url: '/services', appearance: 'outline' }),
      },
      {
        name: 'Operational impact',
        description: bullets[2],
        hasLink: true,
        icon: iconIds.bolt,
        link: link({ label: 'Read insights', url: '/blog', appearance: 'outline' }),
      },
    ],
  },
  {
    blockType: 'content',
    columns: [
      {
        size: 'full',
        backgroundColor: 'bg-background',
        richText: richText(
          heading({ tag: 'h3', text: 'What this engagement looks like' }),
          paragraph(
            textNode({ text: 'Every engagement starts with a practical systems view: ' }),
            textNode({ text: 'delivery constraints', color: 'text-blue-600' }),
            textNode({ text: ', platform shape, and business priority.' }),
          ),
          paragraph(textNode({ text: 'The result is a focused execution model, not generic advice.' })),
        ),
      },
    ],
  },
  {
    blockType: 'code',
    language: 'typescript',
    code,
  },
  {
    blockType: 'cta',
    backgroundColor: 'bg-primary',
    richText: richText(
      heading({ tag: 'h3', text: 'Need this capability now?' }),
      paragraph(textNode({ text: 'Let’s scope the shortest path to measurable technical outcomes.' })),
    ),
    link: link({ label: 'Book a strategy call', url: '/contact', appearance: 'default' }),
  },
]

const buildCaseStudyLayout = ({
  challenge,
  solution,
  impact,
}: {
  challenge: string
  solution: string
  impact: string
}) => [
  {
    blockType: 'content',
    columns: [
      {
        size: 'full',
        richText: richText(
          heading({ tag: 'h3', text: 'Challenge' }),
          paragraph(textNode({ text: challenge })),
          heading({ tag: 'h3', text: 'Solution' }),
          paragraph(textNode({ text: solution })),
          heading({ tag: 'h3', text: 'Impact' }),
          paragraph(textNode({ text: impact })),
        ),
      },
    ],
  },
  {
    blockType: 'code',
    language: 'typescript',
    code: `type CaseStudyExecution = {\n  challenge: string;\n  architecture: string[];\n  deliveryCadence: 'weekly';\n  measurableOutcome: string;\n}`,
  },
  {
    blockType: 'cta',
    backgroundColor: 'bg-card',
    richText: richText(
      heading({ tag: 'h3', text: 'Want similar outcomes?' }),
      paragraph(textNode({ text: 'We can map your architecture, delivery workflow, and migration priorities into an executable plan.' })),
    ),
    link: link({ label: 'See all services', url: '/services', appearance: 'outline' }),
  },
]

const buildPostLayout = ({
  title,
}: {
  title: string
}) => [
  {
    blockType: 'content',
    columns: [
      {
        size: 'full',
        richText: richText(
          heading({ tag: 'h2', text: title }),
          paragraph(
            textNode({ text: 'This article captures implementation details from active consulting delivery with an emphasis on ' }),
            textNode({ text: 'clarity', color: 'text-emerald-600' }),
            textNode({ text: ', repeatability, and operational discipline.' }),
          ),
        ),
      },
    ],
  },
  {
    blockType: 'code',
    language: 'typescript',
    code: `export const executionLoop = ['plan', 'ship', 'observe', 'improve'] as const`,
  },
  {
    blockType: 'cta',
    richText: richText(
      heading({ tag: 'h3', text: 'Need help applying this?' }),
      paragraph(textNode({ text: 'Engage directly for a scoped technical delivery plan.' })),
    ),
    link: link({ label: 'View services', url: '/services', appearance: 'default' }),
  },
]

export const runSeed = async ({
  payload,
  reset = false,
}: {
  payload: Payload
  reset?: boolean
}): Promise<SeedResult> => {
  const counters: SeedCounters = {
    created: 0,
    updated: 0,
    deleted: 0,
  }

  const iconMap = new Map<string, number>()
  const serviceMap = new Map<string, number>()
  const caseStudyMap = new Map<string, number>()
  const categoryMap = new Map<string, number>()
  const postMap = new Map<string, number>()

  const iconSeed = [
    { title: 'cloud', svg: iconSvg.cloud },
    { title: 'bolt', svg: iconSvg.bolt },
    { title: 'coins', svg: iconSvg.coins },
    { title: 'workflow', svg: iconSvg.workflow },
    { title: 'code', svg: iconSvg.code },
    { title: 'linkedin', svg: iconSvg.linkedin },
    { title: 'github', svg: iconSvg.github },
  ] as const

  for (const icon of iconSeed) {
    const doc = await upsertByField({
      payload,
      counters,
      collection: 'icons',
      field: 'title',
      value: icon.title,
      reset,
      data: {
        title: icon.title,
        svg: icon.svg,
      },
    })
    iconMap.set(icon.title, doc.id as number)
  }

  const leadForm = await upsertByField({
    payload,
    counters,
    collection: 'forms',
    field: 'title',
    value: 'Lead Discovery Form',
    reset,
    data: {
      title: 'Lead Discovery Form',
      captcha: true,
      honeypot: true,
      submitButtonLabel: 'Request Consultation',
      confirmationType: 'message',
      confirmationMessage: richText(
        heading({ tag: 'h3', text: 'Thanks, request received.' }),
        paragraph(textNode({ text: 'I will review your details and follow up with next steps shortly.' })),
      ),
      fields: [
        {
          blockType: 'text',
          name: 'fullName',
          label: 'Full Name',
          required: true,
          width: 50,
        },
        {
          blockType: 'email',
          name: 'email',
          label: 'Work Email',
          required: true,
          width: 50,
        },
        {
          blockType: 'text',
          name: 'company',
          label: 'Company',
          required: true,
          width: 50,
        },
        {
          blockType: 'select',
          name: 'serviceInterest',
          label: 'Primary Service Need',
          required: true,
          width: 50,
          options: serviceSeed.map((service) => ({
            label: service.title,
            value: service.slug,
          })),
        },
        {
          blockType: 'textarea',
          name: 'projectSummary',
          label: 'Project Summary',
          required: true,
          width: 100,
        },
      ],
    },
  })

  for (const service of serviceSeed) {
    const serviceDoc = await upsertBySlug({
      payload,
      counters,
      collection: 'services',
      slug: service.slug,
      reset,
      data: {
        _status: 'published',
        publishedAt: isoDate(14),
        title: service.title,
        description: service.blurb,
        hero: {
          type: 'mediumImpact',
          bgColor: 'bg-slate-950',
          richText: richText(
            heading({ tag: 'h1', text: service.heroTitle }),
            paragraph(textNode({ text: service.heroBody })),
          ),
          links: [
            { link: link({ label: 'View case studies', url: '/case-studies', appearance: 'default' }) },
            { link: link({ label: 'Contact', url: '/contact', appearance: 'outline' }) },
          ],
        },
        layout: buildServiceLayout({
          title: service.title,
          heroBody: service.heroBody,
          bullets: service.bullets,
          code: service.code,
          iconIds: {
            cloud: iconMap.get('cloud'),
            workflow: iconMap.get('workflow'),
            bolt: iconMap.get('bolt'),
          },
        }),
        meta: {
          title: `${service.title} | Peter Conti Consulting`,
          description: service.heroBody,
        },
      },
    })
    serviceMap.set(service.slug, serviceDoc.id as number)
  }

  for (const category of categorySeed) {
    const categoryDoc = await upsertBySlug({
      payload,
      counters,
      collection: 'categories',
      slug: category.slug,
      reset,
      data: {
        slug: category.slug,
        title: category.title,
        description: category.description,
        featured: category.featured,
        featuredRank: category.featuredRank,
        breadcrumbs: [
          {
            label: category.title,
            url: `/blog/category/${category.slug}`,
          },
        ],
        meta: {
          title: `${category.title} | Engineering Insights`,
          description: category.description,
        },
      },
    })
    categoryMap.set(category.slug, categoryDoc.id as number)
  }

  for (const post of postSeed) {
    const categoryId = categoryMap.get(post.categorySlug)
    if (!categoryId) {
      throw new Error(`Missing category for post "${post.slug}"`)
    }

    const postDoc = await upsertBySlug({
      payload,
      counters,
      collection: 'posts',
      slug: post.slug,
      reset,
      data: {
        _status: 'published',
        publishedAt: isoDate(7),
        title: post.title,
        description: post.description,
        category: categoryId,
        featured: post.featured,
        featuredRank: post.featuredRank,
        readingTime: post.readingTime,
        layout: buildPostLayout({ title: post.title }),
        meta: {
          title: `${post.title} | Peter Conti Consulting`,
          description: post.description,
        },
      },
    })
    postMap.set(post.slug, postDoc.id as number)
  }

  for (const [index, caseStudy] of caseStudySeed.entries()) {
    const services = caseStudy.serviceSlugs
      .map((slug) => serviceMap.get(slug))
      .filter((id): id is number => typeof id === 'number')

    const caseStudyDoc = await upsertBySlug({
      payload,
      counters,
      collection: 'caseStudies',
      slug: caseStudy.slug,
      reset,
      data: {
        _status: 'published',
        publishedAt: isoDate(12 - index),
        title: caseStudy.title,
        summary: caseStudy.summary,
        clientName: caseStudy.clientName,
        industry: caseStudy.industry,
        engagementDuration: caseStudy.engagementDuration,
        services,
        keyResults: caseStudy.keyResults,
        hero: {
          type: 'mediumImpact',
          bgColor: 'bg-slate-950',
          richText: richText(
            heading({ tag: 'h1', text: caseStudy.title }),
            paragraph(textNode({ text: caseStudy.summary })),
          ),
          links: [{ link: link({ label: 'Explore services', url: '/services', appearance: 'default' }) }],
        },
        layout: buildCaseStudyLayout({
          challenge: caseStudy.challenge,
          solution: caseStudy.solution,
          impact: caseStudy.impact,
        }),
        meta: {
          title: `${caseStudy.title} | Case Study`,
          description: caseStudy.summary,
        },
      },
    })
    caseStudyMap.set(caseStudy.slug, caseStudyDoc.id as number)
  }

  for (const [slug, id] of caseStudyMap.entries()) {
    const related = Array.from(caseStudyMap.entries())
      .filter(([candidateSlug]) => candidateSlug !== slug)
      .slice(0, 2)
      .map(([, caseStudyId]) => caseStudyId)

    await payload.update({
      collection: 'caseStudies',
      id,
      overrideAccess: true,
      context: SEED_CONTEXT,
      data: {
        relatedCaseStudies: related,
      },
    })
  }

  const featuredPosts = [
    postMap.get('nextjs-16-cache-components-for-consultancy-sites'),
    postMap.get('terraform-foundations-for-modern-web-platforms'),
    postMap.get('cloud-cost-optimization-without-delivery-regression'),
  ].filter((id): id is number => typeof id === 'number')

  const allCategoryIds = Array.from(categoryMap.values())

  const pagesSeed = [
    {
      slug: 'home',
      title: 'Home',
      description: 'Software and cloud engineering consultancy for high-stakes delivery.',
      hero: {
        type: 'highImpact',
        bgColor: 'bg-slate-950',
        richText: richText(
          heading({ tag: 'h1', text: 'Software and Cloud Engineering That Drives Revenue' }),
          paragraph(
            textNode({ text: 'Partner with a senior engineer and cloud architect to ship faster, reduce risk, and convert technical execution into measurable growth.' }),
          ),
        ),
        links: [
          { link: link({ label: 'View Services', url: '/services', appearance: 'default' }) },
          { link: link({ label: 'See Case Studies', url: '/case-studies', appearance: 'outline' }) },
        ],
      },
      layout: [
        {
          blockType: 'featuresBlock',
          tagline: 'Why Teams Hire Me',
          backgroundColor: 'bg-slate-900',
          richText: richText(
            heading({ tag: 'h2', text: 'Professional execution from architecture to production' }),
            paragraph(textNode({ text: 'I work hands-on across product engineering, cloud systems, and delivery leadership.' })),
          ),
          features: [
            {
              name: 'Senior technical depth',
              description: 'Practical full-stack and cloud engineering experience on real delivery timelines.',
              hasLink: true,
              icon: iconMap.get('code'),
              link: link({
                label: 'Software engineering',
                url: '/services/software-engineering',
                appearance: 'outline',
              }),
            },
            {
              name: 'Cloud and platform rigor',
              description: 'Architecture and operational patterns designed for reliability, performance, and clarity.',
              hasLink: true,
              icon: iconMap.get('cloud'),
              link: link({
                label: 'Cloud engineering',
                url: '/services/cloud-engineering',
                appearance: 'outline',
              }),
            },
            {
              name: 'Business-aligned execution',
              description: 'Delivery plans tied directly to lead generation, conversion, and sustainable growth.',
              hasLink: true,
              icon: iconMap.get('coins'),
              link: link({
                label: 'Fractional CTO',
                url: '/services/fractional-cto',
                appearance: 'outline',
              }),
            },
          ],
        },
        {
          blockType: 'blogHighlight',
          title: 'Engineering Insights',
          subtitle: 'Actionable writing from client delivery, cloud architecture, and platform operations.',
          featuredPosts,
        },
        {
          blockType: 'blogArchive',
          introContent: richText(
            heading({ tag: 'h3', text: 'Latest from the blog' }),
            paragraph(textNode({ text: 'Technical notes designed to help teams execute with fewer surprises.' })),
          ),
          populateBy: 'collection',
          relationTo: 'posts',
          categories: allCategoryIds,
          limit: 6,
        },
        {
          blockType: 'formBlock',
          form: leadForm.id,
          enableIntro: true,
          introContent: richText(
            heading({ tag: 'h3', text: 'Let’s scope your engagement' }),
            paragraph(textNode({ text: 'Share your goals and current constraints. I will propose a practical execution plan.' })),
          ),
        },
      ],
      meta: {
        title: 'Peter Conti | Software & Cloud Engineering Consultancy',
        description:
          'Lead-focused software and cloud engineering consultancy delivering architecture, migrations, IaC, and operational performance.',
      },
    },
    {
      slug: 'about',
      title: 'About',
      description: 'Consulting approach, operating principles, and engagement model.',
      hero: {
        type: 'lowImpact',
        bgColor: 'bg-muted',
        richText: richText(
          heading({ tag: 'h1', text: 'Built for teams that need real technical momentum' }),
          paragraph(textNode({ text: 'I partner with founders, leadership teams, and engineering organizations to solve high-leverage technical problems quickly.' })),
        ),
        links: [{ link: link({ label: 'View Services', url: '/services', appearance: 'default' }) }],
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: richText(
                heading({ tag: 'h2', text: 'How I work' }),
                paragraph(textNode({ text: 'I prioritize clear architecture decisions, rapid implementation, and measurable outcomes.' })),
                paragraph(
                  textNode({ text: 'Engagements are scoped around delivery constraints, business objectives, and platform risk profile.' }),
                ),
              ),
            },
          ],
        },
      ],
      meta: {
        title: 'About | Peter Conti Consulting',
        description: 'Experience, delivery model, and technical consulting approach.',
      },
    },
    {
      slug: 'contact',
      title: 'Contact',
      description: 'Start a new engineering or cloud consulting engagement.',
      hero: {
        type: 'lowImpact',
        bgColor: 'bg-background',
        richText: richText(
          heading({ tag: 'h1', text: 'Start your next technical engagement' }),
          paragraph(textNode({ text: 'Send your project details and I will respond with recommended next steps.' })),
        ),
        links: [{ link: link({ label: 'Explore Case Studies', url: '/case-studies', appearance: 'outline' }) }],
      },
      layout: [
        {
          blockType: 'formBlock',
          form: leadForm.id,
          enableIntro: true,
          introContent: richText(
            heading({ tag: 'h2', text: 'Project intake' }),
            paragraph(textNode({ text: 'Include context on timeline, technical constraints, and goals for best-fit scoping.' })),
          ),
        },
      ],
      meta: {
        title: 'Contact | Peter Conti Consulting',
        description: 'Request software or cloud engineering consulting.',
      },
    },
  ] as const

  for (const page of pagesSeed) {
    await upsertBySlug({
      payload,
      counters,
      collection: 'pages',
      slug: page.slug,
      reset,
      data: {
        _status: 'published',
        publishedAt: isoDate(3),
        title: page.title,
        description: page.description,
        hero: page.hero,
        layout: page.layout,
        meta: page.meta,
      },
    })
  }

  const servicesDropdownLinks = serviceSeed.map((service) => ({
    link: link({
      label: service.title,
      url: `/services/${service.slug}`,
      appearance: 'default',
    }),
    description: service.blurb,
  }))

  const navData = {
    navItems: [
      {
        type: 'link',
        link: link({ label: 'Home', url: '/', appearance: 'default' }),
      },
      {
        type: 'dropdown',
        link: link({ label: 'Services', url: '/services', appearance: 'default' }),
        ddSettings: {
          title: 'Services',
          enableHero: true,
          hero: {
            title: 'High-impact consulting engagements',
            description: 'Strategy, implementation, and cloud operations with senior-level execution.',
            heroLink: link({ label: 'View all services', url: '/services', appearance: 'default' }),
          },
          ddLinks: servicesDropdownLinks,
        },
      },
      {
        type: 'link',
        link: link({ label: 'Case Studies', url: '/case-studies', appearance: 'default' }),
      },
      {
        type: 'dropdown',
        link: link({ label: 'Insights', url: '/blog', appearance: 'default' }),
        ddSettings: {
          title: 'Insights',
          enableHero: false,
          ddLinks: [
            {
              link: link({ label: 'Engineering Blog', url: '/blog', appearance: 'default' }),
              description: 'Delivery notes, cloud architecture patterns, and practical implementation playbooks.',
            },
            {
              link: link({ label: 'Categories', url: '/blog/category', appearance: 'default' }),
              description: 'Browse writing by topic and capability area.',
            },
          ],
        },
      },
      {
        type: 'link',
        link: link({ label: 'Contact', url: '/contact', appearance: 'default' }),
      },
    ],
  }

  const footerData = {
    footerItems: [
      { link: link({ label: 'Services', url: '/services', appearance: 'outline' }) },
      { link: link({ label: 'Case Studies', url: '/case-studies', appearance: 'outline' }) },
      { link: link({ label: 'Blog', url: '/blog', appearance: 'outline' }) },
      { link: link({ label: 'About', url: '/about', appearance: 'outline' }) },
      { link: link({ label: 'Contact', url: '/contact', appearance: 'outline' }) },
    ],
    socials: [
      {
        icon: iconMap.get('linkedin'),
        url: {
          type: 'custom',
          url: 'https://www.linkedin.com/in/peterconti',
          newTab: true,
          appearance: 'default',
        },
      },
      {
        icon: iconMap.get('github'),
        url: {
          type: 'custom',
          url: 'https://github.com/contip',
          newTab: true,
          appearance: 'default',
        },
      },
    ],
  }

  await payload.updateGlobal({
    slug: 'nav',
    data: navData as unknown as Record<string, unknown>,
    overrideAccess: true,
    context: SEED_CONTEXT,
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: footerData as unknown as Record<string, unknown>,
    overrideAccess: true,
    context: SEED_CONTEXT,
  })

  return {
    message: `Seed completed successfully${reset ? ' (with reset enabled)' : ''}.`,
    created: counters.created,
    updated: counters.updated,
    deleted: counters.deleted,
    services: serviceSeed.length,
    caseStudies: caseStudySeed.length,
    categories: categorySeed.length,
    posts: postSeed.length,
    pages: pagesSeed.length,
  }
}
