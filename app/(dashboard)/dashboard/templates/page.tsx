import type { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Browse and use presentation templates.',
};

export default function TemplatesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">
          Browse starter templates and create presentations from pre-built designs
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Templates coming soon</h2>
        <p className="text-muted-foreground max-w-md">
          Pre-built presentation templates covering common use cases will be available here.
          For now, use AI generation or start from a blank presentation.
        </p>
      </div>
    </div>
  );
}
