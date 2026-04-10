'use client';

import * as React from 'react';
import { Sparkles, Image as ImageIcon, Paintbrush, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const ART_STYLES = [
  { id: 'illustration', label: 'Illustration', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop' },
  { id: 'photo', label: 'Photo', thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=100&h=100&fit=crop' },
  { id: 'abstract', label: 'Abstract', thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=100&h=100&fit=crop' },
  { id: '3d', label: '3D', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop' },
  { id: 'line-art', label: 'Line Art', thumbnail: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=100&h=100&fit=crop' },
  { id: 'custom', label: 'Custom', thumbnail: '' },
];

interface ImageGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (imageUrl: string) => void;
  initialQuery?: string;
  aspectRatio?: string;
}

export function ImageGenerationDialog({
  open,
  onOpenChange,
  onGenerate,
  initialQuery = '',
  aspectRatio = '16:9',
}: ImageGenerationDialogProps): React.JSX.Element {
  const [prompt, setPrompt] = React.useState(initialQuery);
  const [artStyle, setArtStyle] = React.useState('illustration');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && initialQuery) {
      setPrompt(initialQuery);
    }
    if (open) {
      setError(null);
    }
  }, [open, initialQuery]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: prompt,
          style: artStyle !== 'custom' ? artStyle : undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.data?.url) {
        onGenerate(data.data.url);
        onOpenChange(false);
      } else {
        setError(data.error?.message ?? 'Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create images with AI
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to see..."
              className="resize-none h-24"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Art style</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {ART_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setArtStyle(style.id)}
                  className={cn(
                    'relative flex flex-col items-center gap-1 rounded-md border-2 p-1 transition-all hover:border-primary/50',
                    artStyle === style.id ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50'
                  )}
                >
                  <div className="w-full aspect-square bg-muted rounded overflow-hidden">
                    {style.thumbnail ? (
                      <img src={style.thumbnail} alt={style.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Paintbrush className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-tight text-center w-full truncate">
                    {style.label}
                  </span>
                  {artStyle === style.id && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">Aspect ratio</Label>
              <Select value={aspectRatio} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={aspectRatio}>{aspectRatio} (Layout)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t">
          <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full sm:w-auto">
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
