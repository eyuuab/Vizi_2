'use client';

import { useState } from 'react';
import { TemplateCard, type TemplateData } from '@/components/dashboard/template-card';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'All',
  'Business',
  'Education',
  'Marketing',
  'Creative',
  'Tech',
  'Personal',
] as const;

interface TemplateGridProps {
  templates: TemplateData[];
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No templates in this category yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
