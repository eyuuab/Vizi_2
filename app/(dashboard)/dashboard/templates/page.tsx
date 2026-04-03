import type { Metadata } from 'next';
import { TemplateGrid } from '@/components/dashboard/template-grid';
import type { TemplateData } from '@/components/dashboard/template-card';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Browse and use presentation templates.',
};

const STARTER_TEMPLATES: TemplateData[] = [
  {
    id: 'tpl-pitch-deck',
    title: 'Startup Pitch Deck',
    description:
      'A compelling investor pitch deck with problem, solution, market size, traction, and ask slides.',
    category: 'Business',
    sectionCount: 10,
    themeId: 'pitch-deck',
    color: '#0f172a',
  },
  {
    id: 'tpl-quarterly-review',
    title: 'Quarterly Business Review',
    description:
      'Present quarterly results with KPIs, revenue charts, team highlights, and next quarter goals.',
    category: 'Business',
    sectionCount: 8,
    themeId: 'corporate-blue',
    color: '#1e3a5f',
  },
  {
    id: 'tpl-project-proposal',
    title: 'Project Proposal',
    description:
      'A structured proposal template with objectives, timeline, budget, and expected outcomes.',
    category: 'Business',
    sectionCount: 7,
    themeId: 'minimal-light',
    color: '#6b7280',
  },
  {
    id: 'tpl-course-lecture',
    title: 'Course Lecture',
    description:
      'An educational lecture format with learning objectives, key concepts, examples, and summary.',
    category: 'Education',
    sectionCount: 9,
    themeId: 'academic',
    color: '#92400e',
  },
  {
    id: 'tpl-workshop',
    title: 'Interactive Workshop',
    description:
      'Hands-on workshop template with agenda, exercises, group activities, and takeaways.',
    category: 'Education',
    sectionCount: 8,
    themeId: 'nature-green',
    color: '#166534',
  },
  {
    id: 'tpl-product-launch',
    title: 'Product Launch',
    description:
      'Announce a new product with features, pricing, competitive advantages, and launch timeline.',
    category: 'Marketing',
    sectionCount: 9,
    themeId: 'startup-bold',
    color: '#7c3aed',
  },
  {
    id: 'tpl-social-media-strategy',
    title: 'Social Media Strategy',
    description:
      'Outline your social media plan with audience analysis, content calendar, and KPI targets.',
    category: 'Marketing',
    sectionCount: 7,
    themeId: 'pastel-soft',
    color: '#ec4899',
  },
  {
    id: 'tpl-creative-portfolio',
    title: 'Creative Portfolio',
    description:
      'Showcase your work with a visually striking portfolio layout featuring project highlights.',
    category: 'Creative',
    sectionCount: 8,
    themeId: 'monochrome',
    color: '#000000',
  },
  {
    id: 'tpl-brand-guidelines',
    title: 'Brand Guidelines',
    description:
      'Define your brand identity with colors, typography, voice, and usage examples.',
    category: 'Creative',
    sectionCount: 10,
    themeId: 'retro-warm',
    color: '#c2410c',
  },
  {
    id: 'tpl-tech-architecture',
    title: 'Technical Architecture',
    description:
      'Present system architecture with diagrams, tech stack overview, and deployment strategy.',
    category: 'Tech',
    sectionCount: 8,
    themeId: 'creative-neon',
    color: '#a855f7',
  },
  {
    id: 'tpl-sprint-retrospective',
    title: 'Sprint Retrospective',
    description:
      'Run an effective retro with what went well, what to improve, and action items.',
    category: 'Tech',
    sectionCount: 6,
    themeId: 'gradient-wave',
    color: '#2563eb',
  },
  {
    id: 'tpl-personal-intro',
    title: 'Personal Introduction',
    description:
      'Introduce yourself with background, skills, experience, and what you are passionate about.',
    category: 'Personal',
    sectionCount: 6,
    themeId: 'minimal-light',
    color: '#374151',
  },
  {
    id: 'tpl-travel-journal',
    title: 'Travel Journal',
    description:
      'Share your travel experiences with photos, itinerary highlights, and favorite moments.',
    category: 'Personal',
    sectionCount: 7,
    themeId: 'sunset-warm',
    color: '#ea580c',
  },
];

export default function TemplatesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Browse starter templates and create presentations from pre-built designs
        </p>
      </div>

      <TemplateGrid templates={STARTER_TEMPLATES} />
    </div>
  );
}
