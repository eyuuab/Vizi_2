'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ListItem {
  label: string;
  description?: string;
}

interface InlineListEditorProps {
  items: ListItem[];
  slotLabel: string;
  onUpdate: (items: ListItem[]) => void;
}

function parseItems(content: unknown): ListItem[] {
  if (Array.isArray(content)) {
    return content.map((item) => {
      if (typeof item === 'string') return { label: item };
      if (typeof item === 'object' && item !== null && 'label' in item) {
        return {
          label: String((item as Record<string, unknown>).label),
          description: (item as Record<string, unknown>).description
            ? String((item as Record<string, unknown>).description)
            : undefined,
        };
      }
      return { label: String(item) };
    });
  }
  if (typeof content === 'string' && content.trim()) {
    return content
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => ({ label: l.trim() }));
  }
  return [];
}

export function InlineListEditor({
  items,
  slotLabel,
  onUpdate,
}: InlineListEditorProps): React.JSX.Element {
  const [newItemText, setNewItemText] = useState('');

  const handleItemLabelChange = useCallback(
    (index: number, label: string) => {
      const updated = [...items];
      updated[index] = { ...updated[index]!, label };
      onUpdate(updated);
    },
    [items, onUpdate],
  );

  const handleItemDescriptionChange = useCallback(
    (index: number, description: string) => {
      const updated = [...items];
      updated[index] = { ...updated[index]!, description: description || undefined };
      onUpdate(updated);
    },
    [items, onUpdate],
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      const updated = items.filter((_, i) => i !== index);
      onUpdate(updated);
    },
    [items, onUpdate],
  );

  const handleAddItem = useCallback(() => {
    const text = newItemText.trim();
    if (!text) return;
    onUpdate([...items, { label: text }]);
    setNewItemText('');
  }, [items, newItemText, onUpdate]);

  const handleMoveItem = useCallback(
    (index: number, direction: -1 | 1) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= items.length) return;
      const updated = [...items];
      const temp = updated[index]!;
      updated[index] = updated[newIndex]!;
      updated[newIndex] = temp;
      onUpdate(updated);
    },
    [items, onUpdate],
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <span className="font-medium">{slotLabel}</span>
        <span className="rounded bg-muted px-1.5 py-0.5">LIST</span>
        <span className="ml-auto">{items.length} items</span>
      </div>

      {/* Existing items */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={`item-${String(index)}`}
            className="group flex items-start gap-1.5 rounded border border-border/50 bg-background p-1.5"
          >
            <div className="flex flex-col gap-0.5 mt-1.5">
              <button
                type="button"
                className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                onClick={() => handleMoveItem(index, -1)}
                disabled={index === 0}
              >
                <GripVertical className="h-3 w-3 rotate-180" />
              </button>
              <button
                type="button"
                className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                onClick={() => handleMoveItem(index, 1)}
                disabled={index === items.length - 1}
              >
                <GripVertical className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1 space-y-1">
              <Input
                value={item.label}
                onChange={(e) => handleItemLabelChange(index, e.target.value)}
                className="h-7 text-xs"
                placeholder="Item text"
              />
              <Input
                value={item.description ?? ''}
                onChange={(e) => handleItemDescriptionChange(index, e.target.value)}
                className="h-6 text-[10px] text-muted-foreground"
                placeholder="Description (optional)"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemoveItem(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new item */}
      <div className="flex gap-1.5">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="h-7 text-xs flex-1"
          placeholder="Add new item..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddItem();
            }
          }}
        />
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={handleAddItem}
          disabled={!newItemText.trim()}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export { parseItems };
export type { ListItem };
