'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TemplateData {
  id: string;
  title: string;
  description: string;
  category: string;
  sectionCount: number;
  themeId: string;
  color: string;
}

interface TemplateCardProps {
  template: TemplateData;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleUseTemplate(): Promise<void> {
    setCreating(true);
    try {
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          themeId: template.themeId,
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data: { id: string } };
        router.push(`/editor/${json.data.id}`);
      }
    } catch {
      // Silently fail
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="group rounded-lg border bg-card shadow-sm transition-all hover:shadow-md overflow-hidden">
      <div
        className="aspect-video flex items-center justify-center relative"
        style={{ backgroundColor: template.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />
        <FileText className="h-10 w-10 text-white/80 relative z-10" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{template.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {template.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {template.sectionCount} slides
          </span>
        </div>
        <Button
          onClick={() => void handleUseTemplate()}
          disabled={creating}
          className="w-full gap-2"
          variant="outline"
          size="sm"
        >
          {creating && <Loader2 className="h-4 w-4 animate-spin" />}
          {creating ? 'Creating...' : 'Use Template'}
        </Button>
      </div>
    </div>
  );
}
