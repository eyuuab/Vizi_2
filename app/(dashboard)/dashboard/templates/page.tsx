import type { Metadata } from 'next';
import { TemplateGrid } from '@/components/dashboard/template-grid';
import { STARTER_TEMPLATE_SUMMARIES } from '@/lib/templates/starter-templates';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Browse and use presentation templates.',
};

export default function TemplatesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Browse complete templates and create fully populated presentations in one click
        </p>
      </div>

      <TemplateGrid templates={STARTER_TEMPLATE_SUMMARIES} />
    </div>
  );
}
