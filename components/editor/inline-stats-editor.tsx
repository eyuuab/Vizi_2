'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

interface InlineStatsEditorProps {
  stats: StatItem[];
  slotLabel: string;
  onUpdate: (stats: StatItem[]) => void;
}

function parseStats(content: unknown): StatItem[] {
  if (!Array.isArray(content)) return [];
  return content.filter(
    (item): item is StatItem =>
      typeof item === 'object' &&
      item !== null &&
      'value' in item &&
      'label' in item &&
      typeof (item as Record<string, unknown>).value === 'string' &&
      typeof (item as Record<string, unknown>).label === 'string',
  );
}

export function InlineStatsEditor({
  stats,
  slotLabel,
  onUpdate,
}: InlineStatsEditorProps): React.JSX.Element {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleStatChange = useCallback(
    (index: number, field: keyof StatItem, value: string) => {
      const updated = [...stats];
      const item = { ...updated[index]! };
      if (field === 'description') {
        item.description = value || undefined;
      } else {
        item[field] = value;
      }
      updated[index] = item;
      onUpdate(updated);
    },
    [stats, onUpdate],
  );

  const handleRemoveStat = useCallback(
    (index: number) => {
      onUpdate(stats.filter((_, i) => i !== index));
    },
    [stats, onUpdate],
  );

  const handleAddStat = useCallback(() => {
    if (!newValue.trim() || !newLabel.trim()) return;
    onUpdate([...stats, { value: newValue.trim(), label: newLabel.trim() }]);
    setNewValue('');
    setNewLabel('');
    setShowAddForm(false);
  }, [stats, newValue, newLabel, onUpdate]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <span className="font-medium">{slotLabel}</span>
        <span className="rounded bg-muted px-1.5 py-0.5">STATS</span>
        <span className="ml-auto">{stats.length} stats</span>
      </div>

      {/* Existing stats */}
      <div className="space-y-2 max-h-56 overflow-y-auto">
        {stats.map((stat, index) => (
          <div
            key={`stat-${String(index)}`}
            className="rounded border border-border/50 bg-background p-2 space-y-1.5"
          >
            <div className="flex items-center gap-1.5">
              <Input
                value={stat.value}
                onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                className="h-7 text-xs font-bold flex-1"
                placeholder="Value (e.g. $10M)"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveStat(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Input
              value={stat.label}
              onChange={(e) => handleStatChange(index, 'label', e.target.value)}
              className="h-6 text-[10px]"
              placeholder="Label (e.g. Revenue)"
            />
            <Input
              value={stat.description ?? ''}
              onChange={(e) => handleStatChange(index, 'description', e.target.value)}
              className="h-6 text-[10px] text-muted-foreground"
              placeholder="Description (optional)"
            />
          </div>
        ))}
      </div>

      {/* Add new stat */}
      {showAddForm ? (
        <div className="rounded border border-dashed border-primary/30 bg-primary/5 p-2 space-y-1.5">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="h-7 text-xs font-bold"
            placeholder="Value (e.g. 99%)"
            autoFocus
          />
          <Input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="h-6 text-[10px]"
            placeholder="Label (e.g. Uptime)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddStat();
              }
            }}
          />
          <div className="flex gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              className="h-6 text-[10px] flex-1"
              onClick={handleAddStat}
              disabled={!newValue.trim() || !newLabel.trim()}
            >
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => {
                setShowAddForm(false);
                setNewValue('');
                setNewLabel('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-xs gap-1.5"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-3 w-3" />
          Add Stat
        </Button>
      )}
    </div>
  );
}

export { parseStats };
export type { StatItem };
