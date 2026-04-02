'use client';

import { cn } from '@/lib/utils';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableSlotProps {
  content: unknown;
  className?: string;
  placeholder?: string;
}

function parseTableData(content: unknown): TableData | null {
  if (typeof content !== 'object' || content === null) return null;
  const record = content as Record<string, unknown>;

  if (!Array.isArray(record['headers']) || !Array.isArray(record['rows'])) {
    return null;
  }

  return {
    headers: record['headers'].filter((h): h is string => typeof h === 'string'),
    rows: (record['rows'] as unknown[])
      .filter((r): r is unknown[] => Array.isArray(r))
      .map((row) => row.map((cell) => String(cell))),
  };
}

export function TableSlot({ content, className, placeholder }: TableSlotProps): React.JSX.Element {
  const tableData = parseTableData(content);

  if (!tableData || tableData.headers.length === 0) {
    return (
      <div className={cn('text-[var(--sf-color-text-secondary)] opacity-50 italic p-4', className)}>
        {placeholder ?? 'Add table data'}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[var(--sf-color-primary)]">
            {tableData.headers.map((header, index) => (
              <th
                key={`header-${String(index)}`}
                className={cn(
                  'px-4 py-3 text-left text-[var(--sf-text-sm)] font-semibold',
                  'text-[var(--sf-color-text-on-primary)]',
                  'border-b border-[var(--sf-color-border)]',
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr
              key={`row-${String(rowIndex)}`}
              className={cn(
                rowIndex % 2 === 0 ? 'bg-[var(--sf-color-background)]' : 'bg-[var(--sf-color-surface)]',
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`cell-${String(rowIndex)}-${String(cellIndex)}`}
                  className={cn(
                    'px-4 py-3 text-[var(--sf-text-sm)]',
                    'text-[var(--sf-color-text-primary)]',
                    'border-b border-[var(--sf-color-border)]',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
