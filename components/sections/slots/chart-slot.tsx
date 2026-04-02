'use client';

import { cn } from '@/lib/utils';

interface ChartData {
  type: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

interface ChartSlotProps {
  content: unknown;
  className?: string;
  placeholder?: string;
}

function parseChartData(content: unknown): ChartData | null {
  if (typeof content !== 'object' || content === null) return null;
  const record = content as Record<string, unknown>;

  if (
    typeof record['type'] !== 'string' ||
    !Array.isArray(record['labels']) ||
    !Array.isArray(record['datasets'])
  ) {
    return null;
  }

  return {
    type: record['type'],
    labels: record['labels'].filter((l): l is string => typeof l === 'string'),
    datasets: (record['datasets'] as unknown[])
      .filter(
        (ds): ds is Record<string, unknown> =>
          typeof ds === 'object' && ds !== null && 'label' in ds && 'data' in ds,
      )
      .map((ds) => ({
        label: String(ds['label']),
        data: (ds['data'] as unknown[]).filter((d): d is number => typeof d === 'number'),
      })),
  };
}

export function ChartSlot({ content, className, placeholder }: ChartSlotProps): React.JSX.Element {
  const chartData = parseChartData(content);

  if (!chartData || chartData.datasets.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'bg-[var(--sf-color-surface)] border-2 border-dashed border-[var(--sf-color-border)]',
          'rounded-[var(--sf-border-radius)]',
          'text-[var(--sf-color-text-secondary)] text-sm',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2 p-8">
          <svg className="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <span>{placeholder ?? 'Add chart data'}</span>
        </div>
      </div>
    );
  }

  // Render a simple visual bar chart representation
  // A full chart library integration (Chart.js, Recharts) would replace this
  const maxValue = Math.max(
    ...chartData.datasets.flatMap((ds) => ds.data),
    1,
  );

  const barColors = [
    'var(--sf-color-primary)',
    'var(--sf-color-secondary)',
    'var(--sf-color-accent)',
  ];

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-end gap-2 h-48">
        {chartData.labels.map((label, labelIndex) => (
          <div key={`${label}-${String(labelIndex)}`} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-end gap-0.5 w-full justify-center h-40">
              {chartData.datasets.map((ds, dsIndex) => {
                const value = ds.data[labelIndex] ?? 0;
                const heightPercent = (value / maxValue) * 100;
                return (
                  <div
                    key={`${ds.label}-${String(dsIndex)}`}
                    className="flex-1 max-w-8 rounded-t-sm transition-all"
                    style={{
                      height: `${String(heightPercent)}%`,
                      backgroundColor: barColors[dsIndex % barColors.length],
                      minHeight: value > 0 ? '4px' : '0px',
                    }}
                    title={`${ds.label}: ${String(value)}`}
                  />
                );
              })}
            </div>
            <span className="text-[var(--sf-text-xs)] text-[var(--sf-color-text-secondary)] text-center truncate w-full">
              {label}
            </span>
          </div>
        ))}
      </div>
      {chartData.datasets.length > 1 && (
        <div className="flex gap-4 justify-center flex-wrap">
          {chartData.datasets.map((ds, dsIndex) => (
            <div key={ds.label} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: barColors[dsIndex % barColors.length] }}
              />
              <span className="text-[var(--sf-text-xs)] text-[var(--sf-color-text-secondary)]">
                {ds.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
