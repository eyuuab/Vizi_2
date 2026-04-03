import { generateTemplateThumbnailDataUrl } from './template-thumbnail';

export type TemplateCategory =
  | 'Business'
  | 'Education'
  | 'Marketing'
  | 'Creative'
  | 'Tech'
  | 'Personal';

export interface TemplateSectionDefinition {
  layoutId: string;
  order: number;
  content: Record<string, unknown>;
  notes?: string | null;
}

export interface StarterTemplateDefinition {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  themeId: string;
  color: string;
  sections: TemplateSectionDefinition[];
}

export interface StarterTemplateSummary {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  sectionCount: number;
  themeId: string;
  color: string;
  thumbnail: string;
}

export const STARTER_TEMPLATES: StarterTemplateDefinition[] = [
  {
    id: 'tpl-pitch-deck',
    title: 'Startup Pitch Deck',
    description:
      'Investor-ready narrative from problem and solution through traction, financials, and the ask.',
    category: 'Business',
    themeId: 'pitch-deck',
    color: '#0f172a',
    sections: [
      {
        layoutId: 'hero-split',
        order: 0,
        content: {
          title: 'Vizi2 Investor Update',
          subtitle: 'AI-native presentation platform for high-performing teams',
          image: '',
        },
      },
      {
        layoutId: 'content-text',
        order: 1,
        content: {
          heading: 'The Problem',
          body: '<p>Teams still spend more time formatting slides than refining strategy. Messaging quality drops when decks are rushed under deadline pressure.</p>',
        },
      },
      {
        layoutId: 'content-text-image',
        order: 2,
        content: {
          heading: 'Our Solution',
          body: '<ul><li>Prompt-to-deck generation in minutes</li><li>Layout-safe editing with real-time previews</li><li>Pixel-accurate PowerPoint export</li></ul>',
          image: '',
        },
      },
      {
        layoutId: 'data-stats',
        order: 3,
        content: {
          heading: 'Market Opportunity',
          stats: [
            { value: '$38B', label: 'Presentation Software TAM' },
            { value: '$7.2B', label: 'AI Content Creation SAM' },
            { value: '$1.1B', label: 'Initial SOM' },
          ],
        },
      },
      {
        layoutId: 'comparison-two',
        order: 4,
        content: {
          heading: 'Why We Win',
          labelLeft: 'Vizi2',
          contentLeft: [
            'Structured layout engine',
            'One-click export fidelity',
            'Collaborative editing roadmap',
          ],
          labelRight: 'Legacy Tools',
          contentRight: [
            'Manual formatting overhead',
            'Inconsistent visual quality',
            'Fragmented export workflows',
          ],
        },
      },
      {
        layoutId: 'data-chart',
        order: 5,
        content: {
          heading: 'ARR Projection',
          chart: {
            type: 'line',
            labels: ['2026', '2027', '2028', '2029'],
            datasets: [{ label: 'ARR ($M)', data: [0.9, 3.4, 9.1, 21.8] }],
          },
          description:
            'Revenue ramps with self-serve growth first, then enterprise expansion.',
        },
      },
      {
        layoutId: 'timeline-horizontal',
        order: 6,
        content: {
          heading: 'Go-To-Market Milestones',
          items: [
            {
              date: 'Q2 2026',
              title: 'Self-Serve Launch',
              description: 'Product-led acquisition for founders and PMs',
            },
            {
              date: 'Q3 2026',
              title: 'Team Plans',
              description: 'Workspace roles, shared libraries, brand controls',
            },
            {
              date: 'Q4 2026',
              title: 'Enterprise Pilot',
              description: 'Security controls and admin analytics',
            },
          ],
        },
      },
      {
        layoutId: 'data-table',
        order: 7,
        content: {
          heading: 'Use of Funds',
          table: {
            headers: ['Area', 'Allocation', 'Objective'],
            rows: [
              ['Engineering', '45%', 'Ship collaboration + governance'],
              ['GTM', '35%', 'Scale inbound and outbound channels'],
              ['Operations', '20%', 'Support, security, and reliability'],
            ],
          },
        },
      },
      {
        layoutId: 'cta-simple',
        order: 8,
        content: {
          heading: 'Raising $2.5M Seed',
          subtext:
            'Funding 18 months of runway to scale adoption, launch enterprise, and reach $1M ARR.',
          ctaUrl: { url: 'https://vizi2.app/contact', label: 'Book Partner Meeting' },
        },
      },
    ],
  },
  {
    id: 'tpl-quarterly-review',
    title: 'Quarterly Business Review',
    description:
      'Clean executive readout covering KPI performance, strategic initiatives, and next-quarter commitments.',
    category: 'Business',
    themeId: 'corporate-blue',
    color: '#1e3a5f',
    sections: [
      {
        layoutId: 'hero-center',
        order: 0,
        content: {
          title: 'Q1 2026 Business Review',
          subtitle: 'Executive summary and strategic outlook',
          backgroundImage: '',
        },
      },
      {
        layoutId: 'data-stats',
        order: 1,
        content: {
          heading: 'Topline KPIs',
          stats: [
            { value: '$4.8M', label: 'Quarterly Revenue' },
            { value: '22%', label: 'QoQ Growth' },
            { value: '74', label: 'NPS' },
            { value: '1.9%', label: 'Logo Churn' },
          ],
        },
      },
      {
        layoutId: 'data-chart',
        order: 2,
        content: {
          heading: 'Revenue Trend',
          chart: {
            type: 'bar',
            labels: ['Jan', 'Feb', 'Mar'],
            datasets: [{ label: 'Revenue ($M)', data: [1.4, 1.6, 1.8] }],
          },
          description: 'Consistent monthly expansion with strong March close.',
        },
      },
      {
        layoutId: 'content-two-column',
        order: 3,
        content: {
          heading: 'Wins and Risks',
          columnLeft:
            '<h3>Wins</h3><ul><li>Enterprise upsell program launched</li><li>Two strategic partnerships signed</li><li>Onboarding cycle reduced by 30%</li></ul>',
          columnRight:
            '<h3>Risks</h3><ul><li>SMB CAC increasing in paid channels</li><li>Support backlog in EMEA timezone</li><li>Hiring pipeline for senior engineers</li></ul>',
        },
      },
      {
        layoutId: 'data-table',
        order: 4,
        content: {
          heading: 'Regional Performance',
          table: {
            headers: ['Region', 'Revenue', 'Growth', 'Pipeline Health'],
            rows: [
              ['North America', '$2.7M', '+24%', 'Strong'],
              ['EMEA', '$1.3M', '+18%', 'Moderate'],
              ['APAC', '$0.8M', '+29%', 'Strong'],
            ],
          },
        },
      },
      {
        layoutId: 'timeline-horizontal',
        order: 5,
        content: {
          heading: 'Q2 Commitments',
          items: [
            {
              date: 'April',
              title: 'Launch Collaboration Beta',
              description: 'Invite top 50 teams into private release',
            },
            {
              date: 'May',
              title: 'Expand EU Sales Pod',
              description: 'Add 3 AEs and 1 solutions engineer',
            },
            {
              date: 'June',
              title: 'Security Milestone',
              description: 'Complete SOC 2 Type II audit window',
            },
          ],
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Decision Requests',
          subtext:
            'Approve Q2 hiring plan and marketing reallocation to accelerate pipeline quality.',
          ctaUrl: { url: 'https://vizi2.app/board', label: 'Open Board Packet' },
        },
      },
    ],
  },
  {
    id: 'tpl-product-launch',
    title: 'Product Launch Narrative',
    description:
      'Go-to-market launch deck with audience narrative, feature positioning, and campaign timeline.',
    category: 'Marketing',
    themeId: 'startup-bold',
    color: '#7c3aed',
    sections: [
      {
        layoutId: 'hero-gradient',
        order: 0,
        content: {
          title: 'Launching Vizi2 Teams',
          subtitle: 'Collaborative deck creation for distributed teams',
        },
      },
      {
        layoutId: 'content-text',
        order: 1,
        content: {
          heading: 'Launch Objective',
          body: '<p>Position Vizi2 Teams as the fastest way for product and sales teams to produce polished, on-brand presentations together.</p>',
        },
      },
      {
        layoutId: 'comparison-three',
        order: 2,
        content: {
          heading: 'Message Architecture',
          label1: 'Pain',
          content1: [
            'Slide creation is too slow',
            'Brand consistency breaks',
            'Handoffs create rework',
          ],
          label2: 'Promise',
          content2: [
            'Prompt to structured deck',
            'Shared theme governance',
            'Fast export and delivery',
          ],
          label3: 'Proof',
          content3: [
            '12x faster first draft',
            '99% export fidelity',
            '4.9/5 creator satisfaction',
          ],
        },
      },
      {
        layoutId: 'data-stats',
        order: 3,
        content: {
          heading: 'Campaign Targets',
          stats: [
            { value: '18K', label: 'Landing Page Visits' },
            { value: '2.2K', label: 'Waitlist Signups' },
            { value: '320', label: 'Trial Activations' },
          ],
        },
      },
      {
        layoutId: 'data-chart',
        order: 4,
        content: {
          heading: 'Funnel Forecast',
          chart: {
            type: 'bar',
            labels: ['Awareness', 'Interest', 'Trial', 'Paid'],
            datasets: [{ label: 'Users', data: [18000, 2200, 320, 95] }],
          },
          description: 'Expected conversion model across the first 45 days.',
        },
      },
      {
        layoutId: 'timeline-horizontal',
        order: 5,
        content: {
          heading: 'Launch Timeline',
          items: [
            {
              date: 'T-14',
              title: 'Teaser Campaign',
              description: 'Email and social countdown starts',
            },
            {
              date: 'T-7',
              title: 'Creator Beta Stories',
              description: 'Customer proof and behind-the-scenes content',
            },
            {
              date: 'T-Day',
              title: 'Public Release',
              description: 'Launch event, paid ads, and partner push',
            },
            {
              date: 'T+14',
              title: 'Optimization Sprint',
              description: 'Message and funnel refinement',
            },
          ],
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Ready for Launch Approval',
          subtext:
            'All campaign assets, playbooks, and owners are locked for execution.',
          ctaUrl: { url: 'https://vizi2.app/launch', label: 'Approve Launch Plan' },
        },
      },
    ],
  },
  {
    id: 'tpl-social-media-strategy',
    title: 'Social Media Strategy',
    description:
      'Practical content strategy deck covering audience segments, channels, and execution calendar.',
    category: 'Marketing',
    themeId: 'pastel-soft',
    color: '#ec4899',
    sections: [
      {
        layoutId: 'hero-center',
        order: 0,
        content: {
          title: '2026 Social Strategy',
          subtitle: 'Audience-first content system for awareness and conversion',
          backgroundImage: '',
        },
      },
      {
        layoutId: 'content-text',
        order: 1,
        content: {
          heading: 'Strategic Goal',
          body: '<p>Increase qualified inbound leads by building a repeatable social publishing engine across LinkedIn, X, and YouTube Shorts.</p>',
        },
      },
      {
        layoutId: 'comparison-two',
        order: 2,
        content: {
          heading: 'Audience Segments',
          labelLeft: 'Primary Audience',
          contentLeft: [
            'Product managers at growth-stage startups',
            'Founders preparing investor updates',
            'Marketing leads running GTM launches',
          ],
          labelRight: 'Secondary Audience',
          contentRight: [
            'Consultants creating client decks',
            'Educators building course content',
            'Operations teams reporting KPIs',
          ],
        },
      },
      {
        layoutId: 'data-chart',
        order: 3,
        content: {
          heading: 'Channel Mix',
          chart: {
            type: 'bar',
            labels: ['LinkedIn', 'X', 'YouTube', 'Newsletter'],
            datasets: [{ label: 'Monthly Posts', data: [18, 30, 8, 4] }],
          },
          description: 'Publishing cadence aligned to platform behavior.',
        },
      },
      {
        layoutId: 'timeline-vertical',
        order: 4,
        content: {
          heading: 'Monthly Production Cadence',
          items: [
            {
              date: 'Week 1',
              title: 'Research and Angle Selection',
              description: 'Pull customer insights and draft key narratives',
            },
            {
              date: 'Week 2',
              title: 'Content Creation',
              description: 'Draft long-form and short-form content assets',
            },
            {
              date: 'Week 3',
              title: 'Distribution',
              description: 'Publish, repurpose, and coordinate amplification',
            },
            {
              date: 'Week 4',
              title: 'Performance Review',
              description: 'Analyze outcomes and adjust the next cycle',
            },
          ],
        },
      },
      {
        layoutId: 'data-table',
        order: 5,
        content: {
          heading: 'Content Pillars',
          table: {
            headers: ['Pillar', 'Purpose', 'Format'],
            rows: [
              ['Product Education', 'Teach workflows', 'Carousel + video clips'],
              ['Customer Stories', 'Build trust', 'Case-study threads'],
              ['Industry POV', 'Differentiate brand', 'Founder commentary'],
            ],
          },
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Execute the Next 90 Days',
          subtext: 'Content calendar and owners are prepared for kickoff.',
          ctaUrl: { url: 'https://vizi2.app/calendar', label: 'Open Content Calendar' },
        },
      },
    ],
  },
  {
    id: 'tpl-course-lecture',
    title: 'Course Lecture Deck',
    description:
      'Structured educational lecture with learning outcomes, concept framing, examples, and recap.',
    category: 'Education',
    themeId: 'academic',
    color: '#92400e',
    sections: [
      {
        layoutId: 'hero-center',
        order: 0,
        content: {
          title: 'Introduction to Applied AI',
          subtitle: 'Week 1 lecture deck',
          backgroundImage: '',
        },
      },
      {
        layoutId: 'content-text',
        order: 1,
        content: {
          heading: 'Learning Outcomes',
          body: '<ul><li>Explain the modern AI lifecycle</li><li>Differentiate models, data, and systems</li><li>Evaluate common deployment tradeoffs</li></ul>',
        },
      },
      {
        layoutId: 'timeline-vertical',
        order: 2,
        content: {
          heading: 'Field Evolution',
          items: [
            {
              date: '2012',
              title: 'Deep Learning Inflection',
              description: 'Breakthrough image model benchmarks',
            },
            {
              date: '2018',
              title: 'Transformer Era',
              description: 'Sequence modeling at new scale',
            },
            {
              date: '2022',
              title: 'Generative Adoption',
              description: 'Mainstream enterprise experimentation',
            },
            {
              date: '2025+',
              title: 'Agentic Workflows',
              description: 'Task orchestration and tool use',
            },
          ],
        },
      },
      {
        layoutId: 'comparison-two',
        order: 3,
        content: {
          heading: 'Supervised vs. Unsupervised',
          labelLeft: 'Supervised',
          contentLeft: [
            'Labeled training data',
            'Targets prediction tasks',
            'Typical for classification/regression',
          ],
          labelRight: 'Unsupervised',
          contentRight: [
            'No explicit labels',
            'Finds hidden structure',
            'Typical for clustering and embeddings',
          ],
        },
      },
      {
        layoutId: 'content-text-image',
        order: 4,
        content: {
          heading: 'Real-World Example',
          body: '<p>A support assistant summarizes tickets, routes by urgency, and drafts response suggestions for human review.</p>',
          image: '',
        },
      },
      {
        layoutId: 'data-table',
        order: 5,
        content: {
          heading: 'Model Selection Cheat Sheet',
          table: {
            headers: ['Use Case', 'Preferred Model Type', 'Primary Metric'],
            rows: [
              ['Ticket classification', 'Fine-tuned classifier', 'F1 score'],
              ['Summarization', 'LLM with guardrails', 'Human quality rating'],
              ['Recommendation', 'Embedding + ranker', 'CTR/Lift'],
            ],
          },
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Next Session Preview',
          subtext: 'We will cover evaluation frameworks and failure analysis.',
          ctaUrl: {
            url: 'https://vizi2.app/course/week2',
            label: 'Open Week 2 Reading',
          },
        },
      },
    ],
  },
  {
    id: 'tpl-workshop',
    title: 'Interactive Workshop',
    description:
      'Facilitator-friendly workshop template with agenda, activities, outputs, and closeout actions.',
    category: 'Education',
    themeId: 'nature-green',
    color: '#166534',
    sections: [
      {
        layoutId: 'hero-split',
        order: 0,
        content: {
          title: 'Design Sprint Workshop',
          subtitle: 'Turning customer insights into executable experiments',
          image: '',
        },
      },
      {
        layoutId: 'timeline-horizontal',
        order: 1,
        content: {
          heading: 'Workshop Agenda',
          items: [
            { date: '09:00', title: 'Context', description: 'Goals and framing' },
            { date: '10:00', title: 'Diverge', description: 'Idea generation' },
            { date: '12:00', title: 'Prioritize', description: 'Vote and narrow scope' },
            { date: '14:00', title: 'Prototype', description: 'Draft solution artifacts' },
          ],
        },
      },
      {
        layoutId: 'comparison-three',
        order: 2,
        content: {
          heading: 'Team Roles',
          label1: 'Facilitator',
          content1: ['Keeps pace', 'Maintains focus', 'Resolves blockers'],
          label2: 'Contributors',
          content2: ['Generate ideas', 'Build artifacts', 'Provide critique'],
          label3: 'Stakeholders',
          content3: ['Validate priorities', 'Approve decisions', 'Support rollout'],
        },
      },
      {
        layoutId: 'content-two-column',
        order: 3,
        content: {
          heading: 'Ground Rules',
          columnLeft:
            '<ul><li>Time-box discussions</li><li>Assume positive intent</li><li>Favor evidence over opinions</li></ul>',
          columnRight:
            '<ul><li>Capture decisions visibly</li><li>Separate ideation from evaluation</li><li>Leave with assigned actions</li></ul>',
        },
      },
      {
        layoutId: 'data-table',
        order: 4,
        content: {
          heading: 'Action Register',
          table: {
            headers: ['Action', 'Owner', 'Due Date', 'Status'],
            rows: [
              ['Draft prototype scope', 'Amina', 'Apr 8', 'In Progress'],
              ['Validate with 5 users', 'Noah', 'Apr 12', 'Planned'],
              ['Finalize rollout brief', 'Sara', 'Apr 15', 'Planned'],
            ],
          },
        },
      },
      {
        layoutId: 'cta-simple',
        order: 5,
        content: {
          heading: 'Workshop Complete',
          subtext: 'Share notes and confirm owners within 24 hours to preserve momentum.',
          ctaUrl: { url: 'https://vizi2.app/workshop-notes', label: 'Open Notes Pack' },
        },
      },
    ],
  },
  {
    id: 'tpl-tech-architecture',
    title: 'Technical Architecture',
    description:
      'Engineering architecture deck for system design reviews, performance posture, and roadmap evolution.',
    category: 'Tech',
    themeId: 'creative-neon',
    color: '#a855f7',
    sections: [
      {
        layoutId: 'hero-center',
        order: 0,
        content: {
          title: 'Platform Architecture Review',
          subtitle: 'Scalable, secure, and observable by default',
          backgroundImage: '',
        },
      },
      {
        layoutId: 'comparison-three',
        order: 1,
        content: {
          heading: 'System Layers',
          label1: 'Experience',
          content1: ['Web app', 'Editor runtime', 'Public share viewer'],
          label2: 'Application',
          content2: ['API routes', 'AI pipeline', 'Job orchestration'],
          label3: 'Platform',
          content3: ['PostgreSQL', 'Object storage', 'Telemetry stack'],
        },
      },
      {
        layoutId: 'content-two-column',
        order: 2,
        content: {
          heading: 'Request Flow',
          columnLeft:
            '<h3>Write Path</h3><p>Client > API > Validation > Transactional save > Event publish</p>',
          columnRight:
            '<h3>Read Path</h3><p>Client > Cached view > API hydration > Render pipeline</p>',
        },
      },
      {
        layoutId: 'data-stats',
        order: 3,
        content: {
          heading: 'Operational Benchmarks',
          stats: [
            { value: '99.95%', label: 'Uptime' },
            { value: '180ms', label: 'P95 API Latency' },
            { value: '12K', label: 'Daily Exports' },
            { value: '<5m', label: 'Rollback Time' },
          ],
        },
      },
      {
        layoutId: 'data-chart',
        order: 4,
        content: {
          heading: 'Traffic Growth',
          chart: {
            type: 'line',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{ label: 'Daily Active Workspaces', data: [240, 410, 690, 1020, 1480] }],
          },
          description: 'Sustained adoption requires horizontal scaling focus.',
        },
      },
      {
        layoutId: 'timeline-horizontal',
        order: 5,
        content: {
          heading: 'Roadmap Sequence',
          items: [
            {
              date: 'Phase 1',
              title: 'Queue Hardening',
              description: 'Retry guarantees and dead-letter handling',
            },
            {
              date: 'Phase 2',
              title: 'Tenant Isolation',
              description: 'Per-workspace resource policies',
            },
            {
              date: 'Phase 3',
              title: 'Global Deployment',
              description: 'Latency-aware region routing',
            },
          ],
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Architecture Sign-Off',
          subtext: 'Proceed to implementation once risks and dependency owners are confirmed.',
          ctaUrl: { url: 'https://vizi2.app/architecture/rfc', label: 'Open RFC Tracker' },
        },
      },
    ],
  },
  {
    id: 'tpl-sprint-retrospective',
    title: 'Sprint Retrospective',
    description:
      'Retrospective template that drives clear reflection, prioritization, and concrete follow-up actions.',
    category: 'Tech',
    themeId: 'gradient-wave',
    color: '#2563eb',
    sections: [
      {
        layoutId: 'hero-gradient',
        order: 0,
        content: {
          title: 'Sprint 18 Retrospective',
          subtitle: 'Inspect, adapt, and improve team execution',
        },
      },
      {
        layoutId: 'data-stats',
        order: 1,
        content: {
          heading: 'Sprint Health Snapshot',
          stats: [
            { value: '31', label: 'Story Points Completed' },
            { value: '87%', label: 'Commitment Reliability' },
            { value: '4', label: 'Escaped Defects' },
          ],
        },
      },
      {
        layoutId: 'comparison-two',
        order: 2,
        content: {
          heading: 'What Helped vs. Hurt',
          labelLeft: 'Worked Well',
          contentLeft: [
            'Daily scope check-ins',
            'Faster PR turnaround',
            'Shared QA checklist',
          ],
          labelRight: 'Needs Improvement',
          contentRight: [
            'Late requirement changes',
            'Cross-team dependency delays',
            'Unclear incident owner rotation',
          ],
        },
      },
      {
        layoutId: 'timeline-vertical',
        order: 3,
        content: {
          heading: 'Incident Timeline',
          items: [
            {
              date: 'Day 3',
              title: 'API Timeout Spike',
              description: 'Triggered by unindexed query path',
            },
            {
              date: 'Day 4',
              title: 'Hotfix Released',
              description: 'Added index and tightened query guardrails',
            },
            {
              date: 'Day 6',
              title: 'Postmortem Complete',
              description: 'Action items assigned across squads',
            },
          ],
        },
      },
      {
        layoutId: 'data-table',
        order: 4,
        content: {
          heading: 'Improvement Actions',
          table: {
            headers: ['Action', 'Owner', 'Target Sprint'],
            rows: [
              ['Define dependency handoff SLA', 'Backend Lead', 'Sprint 19'],
              ['Introduce release checklist gate', 'QA Lead', 'Sprint 19'],
              ['Establish incident commander rota', 'Engineering Manager', 'Sprint 20'],
            ],
          },
        },
      },
      {
        layoutId: 'cta-simple',
        order: 5,
        content: {
          heading: 'Lock Actions for Next Sprint',
          subtext: 'Track progress in standups and review at mid-sprint checkpoint.',
          ctaUrl: { url: 'https://vizi2.app/jira', label: 'Open Sprint Board' },
        },
      },
    ],
  },
  {
    id: 'tpl-creative-portfolio',
    title: 'Creative Portfolio',
    description:
      'Visual-forward portfolio deck to showcase selected work, creative process, and measurable impact.',
    category: 'Creative',
    themeId: 'monochrome',
    color: '#000000',
    sections: [
      {
        layoutId: 'hero-split',
        order: 0,
        content: {
          title: 'Selected Work 2026',
          subtitle: 'Brand systems, campaigns, and digital product storytelling',
          image: '',
        },
      },
      {
        layoutId: 'content-text',
        order: 1,
        content: {
          heading: 'Creative Point of View',
          body: '<p>I build visual systems that make complex ideas feel immediate, memorable, and actionable across channels.</p>',
        },
      },
      {
        layoutId: 'media-gallery',
        order: 2,
        content: {
          heading: 'Project Highlights',
          image1: '',
          image2: '',
          image3: '',
          image4: '',
        },
      },
      {
        layoutId: 'content-image-text',
        order: 3,
        content: {
          image: '',
          heading: 'Case Study: Campaign Rebrand',
          body: '<ul><li>Unified identity across 14 channels</li><li>Reduced design production cycle by 35%</li><li>Improved campaign recall by 22%</li></ul>',
        },
      },
      {
        layoutId: 'comparison-three',
        order: 4,
        content: {
          heading: 'Process Framework',
          label1: 'Discover',
          content1: ['Audience interviews', 'Competitive analysis', 'Narrative framing'],
          label2: 'Design',
          content2: ['Concept exploration', 'System definition', 'Prototype validation'],
          label3: 'Deliver',
          content3: ['Production handoff', 'Launch QA', 'Performance iteration'],
        },
      },
      {
        layoutId: 'data-stats',
        order: 5,
        content: {
          heading: 'Impact Metrics',
          stats: [
            { value: '42%', label: 'Engagement Lift' },
            { value: '30+', label: 'Campaigns Delivered' },
            { value: '12', label: 'Brands Supported' },
          ],
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Open for New Projects',
          subtext: 'Available for brand strategy, campaign design, and product storytelling.',
          ctaUrl: { url: 'https://vizi2.app/portfolio', label: 'View Full Portfolio' },
        },
      },
    ],
  },
  {
    id: 'tpl-travel-journal',
    title: 'Travel Journal Story',
    description:
      'Narrative travel presentation template for itineraries, memorable moments, and practical takeaways.',
    category: 'Personal',
    themeId: 'retro-warm',
    color: '#ea580c',
    sections: [
      {
        layoutId: 'hero-center',
        order: 0,
        content: {
          title: 'North Africa Journey',
          subtitle: 'Cultural notes, routes, and favorite discoveries',
          backgroundImage: '',
        },
      },
      {
        layoutId: 'timeline-vertical',
        order: 1,
        content: {
          heading: 'Trip Timeline',
          items: [
            {
              date: 'Day 1',
              title: 'Arrival in Marrakech',
              description: 'Old medina walk and evening market',
            },
            {
              date: 'Day 3',
              title: 'Atlas Day Tour',
              description: 'Village visits and mountain trails',
            },
            {
              date: 'Day 6',
              title: 'Desert Camp',
              description: 'Sunset dunes and overnight stay',
            },
          ],
        },
      },
      {
        layoutId: 'media-gallery',
        order: 2,
        content: {
          heading: 'Favorite Moments',
          image1: '',
          image2: '',
          image3: '',
          image4: '',
        },
      },
      {
        layoutId: 'content-image-text',
        order: 3,
        content: {
          image: '',
          heading: 'Most Memorable Experience',
          body: '<p>Sharing tea with a local family in the High Atlas was a turning point. It reframed how I think about hospitality and pace.</p>',
        },
      },
      {
        layoutId: 'data-stats',
        order: 4,
        content: {
          heading: 'Trip Snapshot',
          stats: [
            { value: '9', label: 'Days' },
            { value: '6', label: 'Cities and Stops' },
            { value: '1,420km', label: 'Distance Covered' },
          ],
        },
      },
      {
        layoutId: 'data-table',
        order: 5,
        content: {
          heading: 'Budget Summary',
          table: {
            headers: ['Category', 'Planned', 'Actual'],
            rows: [
              ['Transport', '$380', '$410'],
              ['Lodging', '$520', '$495'],
              ['Food', '$260', '$280'],
              ['Activities', '$220', '$210'],
            ],
          },
        },
      },
      {
        layoutId: 'cta-simple',
        order: 6,
        content: {
          heading: 'Plan Your Own Version',
          subtext: 'Use this route as a flexible starting point for your next adventure.',
          ctaUrl: { url: 'https://vizi2.app/travel', label: 'Download Itinerary' },
        },
      },
    ],
  },
];

export const STARTER_TEMPLATE_SUMMARIES: StarterTemplateSummary[] =
  STARTER_TEMPLATES.map((template) => {
    const firstSection = template.sections[0];
    const firstTitle =
      typeof firstSection?.content?.title === 'string'
        ? firstSection.content.title
        : typeof firstSection?.content?.heading === 'string'
          ? (firstSection.content.heading as string)
          : template.title;
    const firstSubtitle =
      typeof firstSection?.content?.subtitle === 'string'
        ? firstSection.content.subtitle
        : '';

    return {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      sectionCount: template.sections.length,
      themeId: template.themeId,
      color: template.color,
      thumbnail: generateTemplateThumbnailDataUrl({
        title: firstTitle,
        subtitle: firstSubtitle,
        color: template.color,
        category: template.category,
        layoutId: firstSection?.layoutId,
      }),
    };
  });

export function getStarterTemplateById(
  templateId: string,
): StarterTemplateDefinition | undefined {
  return STARTER_TEMPLATES.find((template) => template.id === templateId);
}
