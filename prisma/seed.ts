import { prisma } from '../lib/db/index.js';
import type { Prisma } from '@prisma/client';

// ============================================================
// Theme Presets — 12 built-in themes with full ThemeTokens
// ============================================================

interface ThemePresetSeed {
  name: string;
  tokens: Prisma.InputJsonValue;
}

const THEME_PRESETS: ThemePresetSeed[] = [
  {
    name: 'Minimal Light',
    tokens: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#6b7280',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#f9fafb',
        textPrimary: '#111827',
        textSecondary: '#6b7280',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#e5e7eb',
        shadow: 'rgba(0,0,0,0.08)',
      },
      typography: {
        fontFamily: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'medium',
        lineHeight: '1.6',
        letterSpacing: '-0.01em',
      },
      spacing: { sectionPadding: { top: 48, right: 64, bottom: 48, left: 64 }, slotGap: 24, innerPadding: 16, sectionGap: 32 },
      layout: { maxWidth: 1200, borderRadius: 8, shadowStyle: 'sm', imageStyle: 'rounded' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Minimal Dark',
    tokens: {
      colors: {
        primary: '#ffffff',
        secondary: '#a1a1aa',
        accent: '#60a5fa',
        background: '#18181b',
        surface: '#27272a',
        textPrimary: '#fafafa',
        textSecondary: '#a1a1aa',
        textOnPrimary: '#18181b',
        textOnAccent: '#ffffff',
        border: '#3f3f46',
        shadow: 'rgba(0,0,0,0.3)',
      },
      typography: {
        fontFamily: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'medium',
        lineHeight: '1.6',
        letterSpacing: '-0.01em',
      },
      spacing: { sectionPadding: { top: 48, right: 64, bottom: 48, left: 64 }, slotGap: 24, innerPadding: 16, sectionGap: 32 },
      layout: { maxWidth: 1200, borderRadius: 8, shadowStyle: 'md', imageStyle: 'rounded' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Corporate Blue',
    tokens: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#4a6fa5',
        accent: '#2563eb',
        background: '#ffffff',
        surface: '#f0f4f8',
        textPrimary: '#1e3a5f',
        textSecondary: '#4a6fa5',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#cbd5e1',
        shadow: 'rgba(30,58,95,0.1)',
      },
      typography: {
        fontFamily: { heading: 'Georgia', body: 'Inter', mono: 'Fira Code' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'semibold',
        lineHeight: '1.5',
        letterSpacing: '0em',
      },
      spacing: { sectionPadding: { top: 56, right: 72, bottom: 56, left: 72 }, slotGap: 28, innerPadding: 20, sectionGap: 36 },
      layout: { maxWidth: 1100, borderRadius: 4, shadowStyle: 'sm', imageStyle: 'square' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Startup Bold',
    tokens: {
      colors: {
        primary: '#7c3aed',
        secondary: '#f59e0b',
        accent: '#ec4899',
        background: '#faf5ff',
        surface: '#ffffff',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#e5e7eb',
        shadow: 'rgba(124,58,237,0.12)',
      },
      typography: {
        fontFamily: { heading: 'Plus Jakarta Sans', body: 'Inter', mono: 'Fira Code' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.25rem', xl: '1.5rem', '2xl': '1.875rem', '3xl': '2.25rem', '4xl': '3rem' },
        fontWeight: 'bold',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
      spacing: { sectionPadding: { top: 56, right: 64, bottom: 56, left: 64 }, slotGap: 32, innerPadding: 20, sectionGap: 40 },
      layout: { maxWidth: 1200, borderRadius: 16, shadowStyle: 'lg', imageStyle: 'rounded' },
      effects: { backgroundType: 'gradient', gradientAngle: 135, gradientStops: [{ color: '#faf5ff', position: 0 }, { color: '#fdf2f8', position: 100 }] },
    },
  },
  {
    name: 'Nature Green',
    tokens: {
      colors: {
        primary: '#166534',
        secondary: '#65a30d',
        accent: '#eab308',
        background: '#f7fef3',
        surface: '#ecfccb',
        textPrimary: '#14532d',
        textSecondary: '#4d7c0f',
        textOnPrimary: '#ffffff',
        textOnAccent: '#14532d',
        border: '#bbf7d0',
        shadow: 'rgba(22,101,52,0.1)',
      },
      typography: {
        fontFamily: { heading: 'Lora', body: 'Source Sans Pro', mono: 'Fira Code' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'medium',
        lineHeight: '1.7',
        letterSpacing: '0em',
      },
      spacing: { sectionPadding: { top: 48, right: 64, bottom: 48, left: 64 }, slotGap: 24, innerPadding: 16, sectionGap: 32 },
      layout: { maxWidth: 1100, borderRadius: 12, shadowStyle: 'sm', imageStyle: 'rounded' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Creative Neon',
    tokens: {
      colors: {
        primary: '#a855f7',
        secondary: '#06b6d4',
        accent: '#f43f5e',
        background: '#0f0f23',
        surface: '#1a1a3e',
        textPrimary: '#f0f0f0',
        textSecondary: '#a0a0c0',
        textOnPrimary: '#0f0f23',
        textOnAccent: '#ffffff',
        border: '#2d2d5e',
        shadow: 'rgba(168,85,247,0.2)',
      },
      typography: {
        fontFamily: { heading: 'Space Grotesk', body: 'Inter', mono: 'Fira Code' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.25rem', xl: '1.5rem', '2xl': '1.875rem', '3xl': '2.25rem', '4xl': '3rem' },
        fontWeight: 'bold',
        lineHeight: '1.5',
        letterSpacing: '-0.01em',
      },
      spacing: { sectionPadding: { top: 56, right: 64, bottom: 56, left: 64 }, slotGap: 28, innerPadding: 20, sectionGap: 36 },
      layout: { maxWidth: 1200, borderRadius: 12, shadowStyle: 'lg', imageStyle: 'rounded' },
      effects: { backgroundType: 'gradient', gradientAngle: 160, gradientStops: [{ color: '#0f0f23', position: 0 }, { color: '#1a1a3e', position: 100 }] },
    },
  },
  {
    name: 'Academic',
    tokens: {
      colors: {
        primary: '#92400e',
        secondary: '#78716c',
        accent: '#b45309',
        background: '#fefce8',
        surface: '#fffbeb',
        textPrimary: '#1c1917',
        textSecondary: '#57534e',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#d6d3d1',
        shadow: 'rgba(28,25,23,0.08)',
      },
      typography: {
        fontFamily: { heading: 'Merriweather', body: 'Source Serif Pro', mono: 'Courier Prime' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'regular',
        lineHeight: '1.8',
        letterSpacing: '0em',
      },
      spacing: { sectionPadding: { top: 48, right: 72, bottom: 48, left: 72 }, slotGap: 20, innerPadding: 16, sectionGap: 28 },
      layout: { maxWidth: 960, borderRadius: 4, shadowStyle: 'none', imageStyle: 'square' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Pitch Deck',
    tokens: {
      colors: {
        primary: '#0f172a',
        secondary: '#334155',
        accent: '#0ea5e9',
        background: '#ffffff',
        surface: '#f1f5f9',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#e2e8f0',
        shadow: 'rgba(15,23,42,0.08)',
      },
      typography: {
        fontFamily: { heading: 'DM Sans', body: 'Inter', mono: 'JetBrains Mono' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.25rem', xl: '1.5rem', '2xl': '2rem', '3xl': '2.5rem', '4xl': '3rem' },
        fontWeight: 'bold',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
      spacing: { sectionPadding: { top: 56, right: 64, bottom: 56, left: 64 }, slotGap: 32, innerPadding: 24, sectionGap: 40 },
      layout: { maxWidth: 1200, borderRadius: 12, shadowStyle: 'md', imageStyle: 'rounded' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Pastel Soft',
    tokens: {
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#fdf2f8',
        surface: '#fce7f3',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#f9a8d4',
        shadow: 'rgba(236,72,153,0.1)',
      },
      typography: {
        fontFamily: { heading: 'Nunito', body: 'Nunito', mono: 'Fira Code' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'semibold',
        lineHeight: '1.6',
        letterSpacing: '0em',
      },
      spacing: { sectionPadding: { top: 48, right: 56, bottom: 48, left: 56 }, slotGap: 24, innerPadding: 16, sectionGap: 32 },
      layout: { maxWidth: 1100, borderRadius: 16, shadowStyle: 'sm', imageStyle: 'rounded' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Monochrome',
    tokens: {
      colors: {
        primary: '#000000',
        secondary: '#525252',
        accent: '#000000',
        background: '#ffffff',
        surface: '#fafafa',
        textPrimary: '#000000',
        textSecondary: '#525252',
        textOnPrimary: '#ffffff',
        textOnAccent: '#ffffff',
        border: '#d4d4d4',
        shadow: 'rgba(0,0,0,0.06)',
      },
      typography: {
        fontFamily: { heading: 'Playfair Display', body: 'Inter', mono: 'JetBrains Mono' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.25rem', xl: '1.5rem', '2xl': '2rem', '3xl': '2.5rem', '4xl': '3.5rem' },
        fontWeight: 'bold',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
      spacing: { sectionPadding: { top: 64, right: 80, bottom: 64, left: 80 }, slotGap: 28, innerPadding: 20, sectionGap: 40 },
      layout: { maxWidth: 1000, borderRadius: 0, shadowStyle: 'none', imageStyle: 'square' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Retro Warm',
    tokens: {
      colors: {
        primary: '#c2410c',
        secondary: '#a16207',
        accent: '#b91c1c',
        background: '#fef3c7',
        surface: '#fde68a',
        textPrimary: '#451a03',
        textSecondary: '#78350f',
        textOnPrimary: '#fef3c7',
        textOnAccent: '#ffffff',
        border: '#d97706',
        shadow: 'rgba(194,65,12,0.12)',
      },
      typography: {
        fontFamily: { heading: 'Libre Baskerville', body: 'Lato', mono: 'Courier Prime' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' },
        fontWeight: 'medium',
        lineHeight: '1.7',
        letterSpacing: '0.01em',
      },
      spacing: { sectionPadding: { top: 48, right: 64, bottom: 48, left: 64 }, slotGap: 24, innerPadding: 16, sectionGap: 32 },
      layout: { maxWidth: 1100, borderRadius: 8, shadowStyle: 'md', imageStyle: 'rounded' },
      effects: { backgroundType: 'solid' },
    },
  },
  {
    name: 'Gradient Wave',
    tokens: {
      colors: {
        primary: '#7c3aed',
        secondary: '#2563eb',
        accent: '#06b6d4',
        background: '#0f172a',
        surface: '#1e293b',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        textOnPrimary: '#0f172a',
        textOnAccent: '#ffffff',
        border: '#334155',
        shadow: 'rgba(124,58,237,0.15)',
      },
      typography: {
        fontFamily: { heading: 'Outfit', body: 'Inter', mono: 'Fira Code' },
        fontSize: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.25rem', xl: '1.5rem', '2xl': '2rem', '3xl': '2.5rem', '4xl': '3rem' },
        fontWeight: 'bold',
        lineHeight: '1.4',
        letterSpacing: '-0.01em',
      },
      spacing: { sectionPadding: { top: 56, right: 64, bottom: 56, left: 64 }, slotGap: 28, innerPadding: 20, sectionGap: 36 },
      layout: { maxWidth: 1200, borderRadius: 16, shadowStyle: 'lg', imageStyle: 'rounded' },
      effects: { backgroundType: 'gradient', gradientAngle: 135, gradientStops: [{ color: '#7c3aed', position: 0 }, { color: '#2563eb', position: 50 }, { color: '#06b6d4', position: 100 }], overlayOpacity: 0.85 },
    },
  },
];

// ============================================================
// Starter Template Presentations
// ============================================================

interface TemplateSectionSeed {
  layoutId: string;
  order: number;
  content: Prisma.InputJsonValue;
  notes: string | null;
}

interface TemplatePresentationSeed {
  title: string;
  description: string;
  themeKey: string;
  sections: TemplateSectionSeed[];
}

const TEMPLATE_PRESENTATIONS: TemplatePresentationSeed[] = [
  {
    title: 'Startup Pitch Deck',
    description: 'A compelling investor pitch deck with problem, solution, market, traction, and ask.',
    themeKey: 'pitch-deck',
    sections: [
      { layoutId: 'hero-center', order: 0, content: { title: 'Company Name', subtitle: 'Tagline that captures your vision in one sentence' }, notes: 'Start strong with a memorable opening' },
      { layoutId: 'content-text', order: 1, content: { heading: 'The Problem', body: '<p>Describe the pain point your target market faces. Use specific numbers and real examples to make the problem tangible.</p>' }, notes: null },
      { layoutId: 'content-text-image', order: 2, content: { heading: 'Our Solution', body: '<p>Explain how your product solves the problem. Focus on the unique value proposition.</p>', image: '' }, notes: null },
      { layoutId: 'data-stats', order: 3, content: { heading: 'Market Opportunity', stats: [{ label: 'TAM', value: '$50B' }, { label: 'SAM', value: '$5B' }, { label: 'SOM', value: '$500M' }] }, notes: null },
      { layoutId: 'content-two-column', order: 4, content: { heading: 'Business Model', left: '<p>Revenue streams and pricing strategy</p>', right: '<p>Unit economics and margins</p>' }, notes: null },
      { layoutId: 'data-stats', order: 5, content: { heading: 'Traction', stats: [{ label: 'Users', value: '10K+' }, { label: 'MRR', value: '$50K' }, { label: 'Growth', value: '25% MoM' }] }, notes: null },
      { layoutId: 'comparison-two', order: 6, content: { heading: 'Competitive Landscape', left: { title: 'Us', items: ['AI-first', 'Layout engine', 'One-click export'] }, right: { title: 'Competitors', items: ['Manual design', 'Template only', 'Complex export'] } }, notes: null },
      { layoutId: 'content-text', order: 7, content: { heading: 'The Team', body: '<p>Introduce key team members with relevant experience and expertise.</p>' }, notes: null },
      { layoutId: 'data-chart', order: 8, content: { heading: 'Financial Projections', chartType: 'bar', labels: ['2024', '2025', '2026'], datasets: [{ label: 'Revenue ($M)', data: [0.5, 2, 8] }] }, notes: null },
      { layoutId: 'cta-simple', order: 9, content: { heading: 'The Ask', body: '<p>Raising $2M seed round to scale product and go-to-market.</p>', ctaText: 'Let\'s Talk' }, notes: 'End with clear ask and next steps' },
    ],
  },
  {
    title: 'Quarterly Business Review',
    description: 'Present quarterly results with KPIs, revenue, and next quarter goals.',
    themeKey: 'corporate-blue',
    sections: [
      { layoutId: 'hero-center', order: 0, content: { title: 'Q1 2025 Business Review', subtitle: 'Company Name — Confidential' }, notes: null },
      { layoutId: 'data-stats', order: 1, content: { heading: 'Key Metrics', stats: [{ label: 'Revenue', value: '$2.4M' }, { label: 'Customers', value: '1,250' }, { label: 'NPS', value: '72' }, { label: 'Churn', value: '2.1%' }] }, notes: null },
      { layoutId: 'data-chart', order: 2, content: { heading: 'Revenue Trend', chartType: 'line', labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Revenue ($K)', data: [720, 810, 870] }] }, notes: null },
      { layoutId: 'content-two-column', order: 3, content: { heading: 'Wins & Challenges', left: '<h3>Wins</h3><ul><li>Launched v2.0</li><li>Enterprise deal closed</li><li>Team grew to 25</li></ul>', right: '<h3>Challenges</h3><ul><li>Onboarding delays</li><li>Support ticket backlog</li><li>Hiring pipeline slow</li></ul>' }, notes: null },
      { layoutId: 'content-text', order: 4, content: { heading: 'Product Updates', body: '<ul><li>Shipped AI generation pipeline</li><li>New template library</li><li>Performance improvements (40% faster)</li></ul>' }, notes: null },
      { layoutId: 'content-text', order: 5, content: { heading: 'Q2 Goals', body: '<ol><li>Hit $3M ARR run rate</li><li>Launch team collaboration</li><li>Expand to 3 new markets</li><li>Reduce churn to 1.5%</li></ol>' }, notes: null },
      { layoutId: 'data-stats', order: 6, content: { heading: 'Q2 Targets', stats: [{ label: 'Revenue Target', value: '$3M' }, { label: 'New Customers', value: '200' }, { label: 'NPS Target', value: '75+' }] }, notes: null },
      { layoutId: 'cta-simple', order: 7, content: { heading: 'Questions?', body: '<p>Thank you for your attention. Let\'s discuss.</p>', ctaText: 'Open Discussion' }, notes: null },
    ],
  },
  {
    title: 'Course Lecture: Introduction to AI',
    description: 'Educational lecture with learning objectives, key concepts, and summary.',
    themeKey: 'academic',
    sections: [
      { layoutId: 'hero-center', order: 0, content: { title: 'Introduction to Artificial Intelligence', subtitle: 'CS 301 — Lecture 1' }, notes: null },
      { layoutId: 'content-text', order: 1, content: { heading: 'Learning Objectives', body: '<ul><li>Define artificial intelligence and its subfields</li><li>Understand the history of AI research</li><li>Identify current applications of AI</li><li>Discuss ethical considerations</li></ul>' }, notes: null },
      { layoutId: 'content-text', order: 2, content: { heading: 'What is AI?', body: '<p>Artificial Intelligence is the simulation of human intelligence processes by computer systems. These processes include learning, reasoning, and self-correction.</p>' }, notes: null },
      { layoutId: 'timeline-vertical', order: 3, content: { heading: 'Brief History', items: [{ year: '1956', event: 'Dartmouth Conference — AI coined' }, { year: '1997', event: 'Deep Blue beats Kasparov' }, { year: '2012', event: 'Deep Learning breakthrough' }, { year: '2022', event: 'Large Language Models go mainstream' }] }, notes: null },
      { layoutId: 'comparison-two', order: 4, content: { heading: 'Types of AI', left: { title: 'Narrow AI', items: ['Task-specific', 'Current technology', 'Image recognition, NLP'] }, right: { title: 'General AI', items: ['Human-level reasoning', 'Theoretical', 'Not yet achieved'] } }, notes: null },
      { layoutId: 'content-text', order: 5, content: { heading: 'Key Applications', body: '<ul><li>Natural Language Processing</li><li>Computer Vision</li><li>Robotics</li><li>Recommendation Systems</li><li>Autonomous Vehicles</li></ul>' }, notes: null },
      { layoutId: 'content-text', order: 6, content: { heading: 'Ethical Considerations', body: '<p>AI raises important questions about bias, privacy, job displacement, and autonomous decision-making. Responsible AI development requires diverse teams and robust testing.</p>' }, notes: null },
      { layoutId: 'content-text', order: 7, content: { heading: 'Summary', body: '<ul><li>AI encompasses many subfields and approaches</li><li>We are currently in the era of narrow AI</li><li>Applications are widespread and growing</li><li>Ethics must guide development</li></ul>' }, notes: null },
      { layoutId: 'cta-simple', order: 8, content: { heading: 'Next Lecture', body: '<p>Machine Learning Fundamentals — Supervised vs. Unsupervised Learning</p>', ctaText: 'Reading: Chapter 2' }, notes: null },
    ],
  },
  {
    title: 'Product Launch Announcement',
    description: 'Announce a new product with features, pricing, and launch timeline.',
    themeKey: 'startup-bold',
    sections: [
      { layoutId: 'hero-gradient', order: 0, content: { title: 'Introducing ProductX 2.0', subtitle: 'The future of team collaboration is here' }, notes: null },
      { layoutId: 'content-text', order: 1, content: { heading: 'Why ProductX 2.0?', body: '<p>After listening to thousands of customers, we rebuilt ProductX from the ground up. Faster, smarter, and more intuitive than ever.</p>' }, notes: null },
      { layoutId: 'data-stats', order: 2, content: { heading: 'By the Numbers', stats: [{ label: 'Faster', value: '3x' }, { label: 'New Features', value: '50+' }, { label: 'Integrations', value: '200+' }] }, notes: null },
      { layoutId: 'comparison-three', order: 3, content: { heading: 'Key Features', columns: [{ title: 'AI Assistant', description: 'Smart suggestions powered by GPT-4' }, { title: 'Real-time Sync', description: 'Collaborate with your team instantly' }, { title: 'Analytics', description: 'Deep insights into your workflow' }] }, notes: null },
      { layoutId: 'content-text', order: 4, content: { heading: 'Pricing', body: '<ul><li><strong>Starter:</strong> Free for up to 5 users</li><li><strong>Pro:</strong> $12/user/month — unlimited features</li><li><strong>Enterprise:</strong> Custom pricing — dedicated support</li></ul>' }, notes: null },
      { layoutId: 'timeline-horizontal', order: 5, content: { heading: 'Launch Timeline', items: [{ label: 'Beta', date: 'March 2025' }, { label: 'Public Launch', date: 'April 2025' }, { label: 'Enterprise', date: 'June 2025' }] }, notes: null },
      { layoutId: 'content-text', order: 6, content: { heading: 'What Customers Say', body: '<blockquote>"ProductX 2.0 has transformed how our team works together. The AI features alone save us 10 hours per week."</blockquote><p>— Jane Doe, VP Engineering at TechCorp</p>' }, notes: null },
      { layoutId: 'cta-simple', order: 7, content: { heading: 'Get Early Access', body: '<p>Sign up today and be among the first to experience ProductX 2.0.</p>', ctaText: 'Sign Up Free' }, notes: null },
    ],
  },
  {
    title: 'Technical Architecture Overview',
    description: 'System architecture with tech stack, deployment, and scaling strategy.',
    themeKey: 'creative-neon',
    sections: [
      { layoutId: 'hero-center', order: 0, content: { title: 'System Architecture', subtitle: 'Platform Engineering — Technical Deep Dive' }, notes: null },
      { layoutId: 'content-text', order: 1, content: { heading: 'Architecture Overview', body: '<p>Our platform follows a microservices architecture with event-driven communication. Each service is independently deployable and horizontally scalable.</p>' }, notes: null },
      { layoutId: 'comparison-three', order: 2, content: { heading: 'Tech Stack', columns: [{ title: 'Frontend', description: 'Next.js, TypeScript, Tailwind CSS, Redux' }, { title: 'Backend', description: 'Node.js, Express, PostgreSQL, Redis' }, { title: 'Infrastructure', description: 'AWS, Kubernetes, Terraform, GitHub Actions' }] }, notes: null },
      { layoutId: 'content-two-column', order: 3, content: { heading: 'Data Flow', left: '<h3>Write Path</h3><p>Client -> API Gateway -> Service -> Queue -> DB</p>', right: '<h3>Read Path</h3><p>Client -> CDN -> API Gateway -> Cache -> DB</p>' }, notes: null },
      { layoutId: 'data-stats', order: 4, content: { heading: 'Performance Metrics', stats: [{ label: 'P99 Latency', value: '<200ms' }, { label: 'Uptime', value: '99.99%' }, { label: 'RPS', value: '50K+' }] }, notes: null },
      { layoutId: 'content-text', order: 5, content: { heading: 'Scaling Strategy', body: '<ul><li>Horizontal pod autoscaling via Kubernetes HPA</li><li>Database read replicas for heavy query workloads</li><li>CDN caching for static assets and API responses</li><li>Event sourcing for audit trail and replay</li></ul>' }, notes: null },
      { layoutId: 'content-text', order: 6, content: { heading: 'Security', body: '<ul><li>Zero-trust network architecture</li><li>mTLS between all services</li><li>SOC 2 Type II certified</li><li>Encrypted at rest and in transit</li></ul>' }, notes: null },
      { layoutId: 'cta-simple', order: 7, content: { heading: 'Questions?', body: '<p>Detailed documentation available in our internal wiki.</p>', ctaText: 'View Documentation' }, notes: null },
    ],
  },
];

// ============================================================
// Main seed function
// ============================================================

async function main(): Promise<void> {
  console.log('Starting database seed...');

  // 1. Seed theme presets
  console.log('Seeding theme presets...');
  for (const preset of THEME_PRESETS) {
    const id = preset.name.toLowerCase().replace(/\s+/g, '-');
    await prisma.theme.upsert({
      where: { id },
      update: {
        name: preset.name,
        tokens: preset.tokens,
        isPreset: true,
      },
      create: {
        id,
        name: preset.name,
        tokens: preset.tokens,
        isPreset: true,
        clerkUserId: null,
      },
    });
  }
  console.log(`Seeded ${String(THEME_PRESETS.length)} theme presets.`);

  // 2. Skip demo user creation (using Clerk for auth)
  console.log('Skipping demo user creation (using Clerk authentication)...');
  const demoUser = { id: 'clerk_demo_user_id' }; // Placeholder for template creation

  // 3. Seed template presentations for demo user
  console.log('Seeding template presentations...');
  for (const template of TEMPLATE_PRESENTATIONS) {
    const themeId = template.themeKey;

    // Check if theme exists
    const theme = await prisma.theme.findUnique({ where: { id: themeId } });
    if (!theme) {
      console.warn(`Theme "${themeId}" not found, skipping template "${template.title}"`);
      continue;
    }

    // Skip template presentations (they require a real Clerk user)
    console.log(`  Skipping template "${template.title}" (requires Clerk user)`);
  }

  console.log('Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
