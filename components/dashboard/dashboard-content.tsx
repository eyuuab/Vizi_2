'use client';

import { useState } from 'react';
import { DashboardToolbar, type ViewMode } from '@/components/dashboard/dashboard-toolbar';
import {
  PresentationCard,
  type PresentationCardData,
} from '@/components/dashboard/presentation-card';

interface DashboardContentProps {
  presentations: PresentationCardData[];
  totalPages: number;
  currentPage: number;
}

export function DashboardContent({
  presentations,
  totalPages,
  currentPage,
}: DashboardContentProps) {
  const [view, setView] = useState<ViewMode>('grid');

  return (
    <div className="space-y-6">
      <DashboardToolbar view={view} onViewChange={setView} />

      {presentations.length === 0 ? null : (
        <>
          {view === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {presentations.map((p) => (
                <PresentationCard key={p.id} presentation={p} view="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {presentations.map((p) => (
                <PresentationCard key={p.id} presentation={p} view="list" />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <PaginationBar currentPage={currentPage} totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <a
          key={page}
          href={`?page=${String(page)}`}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-primary text-primary-foreground'
              : 'border bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
          aria-label={`Page ${String(page)}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </a>
      ))}
    </div>
  );
}
