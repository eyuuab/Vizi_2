'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  FileText,
  Loader2,
  ChevronLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type {
  StreamEvent,
  Outline,
  SectionContentGenerated,
  DetailLevel,
} from '@/types/ai';

// ============================================================
// Types
// ============================================================

interface CreatePresentationDialogProps {
  trigger: React.ReactNode;
}

type WizardStep = 'input' | 'generating' | 'complete' | 'error';

type GenerationPhase =
  | 'outline'
  | 'layout'
  | 'content'
  | 'images'
  | 'theme'
  | 'complete';

const PHASE_INFO: Record<GenerationPhase, { label: string; icon: string }> = {
  outline: { label: 'Building outline', icon: '1' },
  layout: { label: 'Assigning layouts', icon: '2' },
  content: { label: 'Generating content', icon: '3' },
  images: { label: 'Finding images', icon: '4' },
  theme: { label: 'Selecting theme', icon: '5' },
  complete: { label: 'Done!', icon: '' },
};

const PHASE_ORDER: GenerationPhase[] = [
  'outline',
  'layout',
  'content',
  'images',
  'theme',
  'complete',
];

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'academic', label: 'Academic' },
  { value: 'creative', label: 'Creative' },
  { value: 'minimal', label: 'Minimal' },
] as const;

const DETAIL_OPTIONS: { value: DetailLevel; label: string; description: string }[] = [
  { value: 'concise', label: 'Concise', description: 'Minimal text, key points only' },
  { value: 'detailed', label: 'Detailed', description: 'Balanced content with context' },
  { value: 'extended', label: 'Extended', description: 'Comprehensive with examples' },
];

// ============================================================
// Component
// ============================================================

export function CreatePresentationDialog({ trigger }: CreatePresentationDialogProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'blank' | 'ai'>('ai');

  // Blank tab state
  const [blankTitle, setBlankTitle] = useState('');
  const [creatingBlank, setCreatingBlank] = useState(false);

  // AI wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep>('input');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [slideCount, setSlideCount] = useState(8);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('detailed');
  const [tone, setTone] = useState('professional');

  // Generation state
  const [phase, setPhase] = useState<GenerationPhase>('outline');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorRetryable, setErrorRetryable] = useState(false);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [sections, setSections] = useState<SectionContentGenerated[]>([]);
  const [themePresetId, setThemePresetId] = useState<string | undefined>();
  const [savingPresentation, setSavingPresentation] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ============================================================
  // Blank creation
  // ============================================================

  async function handleCreateBlank(): Promise<void> {
    if (!blankTitle.trim()) return;
    setCreatingBlank(true);
    try {
      const res = await fetch('/api/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: blankTitle.trim() }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data: { id: string } };
        setOpen(false);
        router.push(`/editor/${json.data.id}`);
      }
    } catch {
      // Silently fail
    } finally {
      setCreatingBlank(false);
    }
  }

  // ============================================================
  // AI Generation
  // ============================================================

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setWizardStep('generating');
    setPhase('outline');
    setProgress(0);
    setProgressMessage('Starting generation...');
    setErrorMessage('');
    setOutline(null);
    setSections([]);
    setThemePresetId(undefined);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          tone,
          sectionCount: slideCount,
          detailLevel,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(
          errorBody?.error?.message ?? `HTTP ${String(response.status)}`,
        );
      }

      if (!response.body) {
        throw new Error('No response body — streaming not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let collectedOutline: Outline | null = null;
      const collectedSections: SectionContentGenerated[] = [];
      let collectedThemeId: string | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          let event: StreamEvent;
          try {
            event = JSON.parse(trimmed) as StreamEvent;
          } catch {
            continue;
          }

          switch (event.type) {
            case 'progress': {
              const data = event.data as {
                step: string;
                progress: number;
                message: string;
              };
              setProgress(data.progress);
              setProgressMessage(data.message);
              if (PHASE_ORDER.includes(data.step as GenerationPhase)) {
                setPhase(data.step as GenerationPhase);
              }
              break;
            }
            case 'outline': {
              collectedOutline = event.data as Outline;
              setOutline(collectedOutline);
              break;
            }
            case 'section': {
              const sectionData = event.data as SectionContentGenerated;
              collectedSections.push(sectionData);
              setSections([...collectedSections]);
              break;
            }
            case 'theme': {
              const themeData = event.data as { presetId?: string };
              collectedThemeId = themeData.presetId;
              setThemePresetId(collectedThemeId);
              break;
            }
            case 'complete': {
              setPhase('complete');
              setProgress(100);
              break;
            }
            case 'error': {
              const errData = event.data as {
                message: string;
                retryable: boolean;
              };
              setWizardStep('error');
              setErrorMessage(errData.message);
              setErrorRetryable(errData.retryable);
              return;
            }
          }
        }
      }

      // Generation complete — now create presentation and save sections
      if (collectedOutline && collectedSections.length > 0) {
        setWizardStep('complete');
        setPhase('complete');
        setProgress(100);

        // Auto-save: create presentation + populate sections
        setSavingPresentation(true);
        try {
          const presTitle = title.trim() || collectedOutline.title || prompt.trim().slice(0, 80);

          // Create the presentation
          const createRes = await fetch('/api/presentations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: presTitle,
              description: prompt.trim(),
            }),
          });

          if (!createRes.ok) throw new Error('Failed to create presentation');

          const createJson = (await createRes.json()) as {
            data: { id: string; themeId: string };
          };
          const presentationId = createJson.data.id;
          const themeId = createJson.data.themeId;

          // Save all generated sections to the presentation
          const sectionPayload = collectedSections.map((sec, idx) => ({
            id: crypto.randomUUID(),
            layoutId: sec.layoutId,
            order: idx,
            content: sec.content,
          }));

          await fetch(`/api/presentations/${presentationId}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: presTitle,
              description: prompt.trim(),
              themeId,
              sections: sectionPayload,
            }),
          });

          // Navigate to editor
          setOpen(false);
          router.push(`/editor/${presentationId}`);
        } catch {
          setWizardStep('error');
          setErrorMessage('Generation succeeded but failed to save. Please try again.');
          setErrorRetryable(true);
        } finally {
          setSavingPresentation(false);
        }
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setWizardStep('input');
        return;
      }
      setWizardStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Generation failed');
      setErrorRetryable(true);
    } finally {
      abortControllerRef.current = null;
    }
  }, [prompt, tone, slideCount, detailLevel, title, router]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setWizardStep('input');
    setProgress(0);
  }, []);

  const handleRetry = useCallback(() => {
    setWizardStep('input');
    setErrorMessage('');
  }, []);

  function resetAll(): void {
    setWizardStep('input');
    setPrompt('');
    setTitle('');
    setSlideCount(8);
    setDetailLevel('detailed');
    setTone('professional');
    setPhase('outline');
    setProgress(0);
    setProgressMessage('');
    setErrorMessage('');
    setOutline(null);
    setSections([]);
    setThemePresetId(undefined);
    setBlankTitle('');
    setActiveTab('ai');
  }

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen);
    if (!nextOpen) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      resetAll();
    }
  }

  if (!mounted) {
    return <>{trigger}</>;
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new presentation</DialogTitle>
          <DialogDescription>
            Start from scratch or let AI generate slides for you.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'blank' | 'ai')} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="blank" className="gap-2" disabled={wizardStep === 'generating'}>
              <FileText className="h-4 w-4" />
              Blank
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2" disabled={wizardStep === 'generating'}>
              <Sparkles className="h-4 w-4" />
              AI Generated
            </TabsTrigger>
          </TabsList>

          {/* ==================== BLANK TAB ==================== */}
          <TabsContent value="blank" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="blank-title">Title</Label>
              <Input
                id="blank-title"
                placeholder="My Presentation"
                value={blankTitle}
                onChange={(e) => setBlankTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleCreateBlank();
                }}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => void handleCreateBlank()}
                disabled={!blankTitle.trim() || creatingBlank}
                className="w-full sm:w-auto"
              >
                {creatingBlank && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Presentation
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* ==================== AI TAB ==================== */}
          <TabsContent value="ai" className="space-y-4 pt-4">
            {/* --- Step 1: Input --- */}
            {wizardStep === 'input' && (
              <div className="space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="ai-title">Title (optional)</Label>
                  <Input
                    id="ai-title"
                    placeholder="Leave blank to auto-generate"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content Description */}
                <div className="space-y-2">
                  <Label htmlFor="ai-prompt">Describe your presentation or paste content</Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder="Describe what your presentation is about, or paste a document/notes to turn into slides..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    You can paste an article, meeting notes, or just describe the topic.
                  </p>
                </div>

                {/* Slide Count */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Number of slides</Label>
                    <span className="text-sm font-medium tabular-nums bg-muted px-2 py-0.5 rounded">
                      {slideCount}
                    </span>
                  </div>
                  <Slider
                    min={3}
                    max={20}
                    step={1}
                    value={[slideCount]}
                    onValueChange={(v) => setSlideCount(v[0] ?? 8)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3 slides</span>
                    <span>20 slides</span>
                  </div>
                </div>

                {/* Detail Level */}
                <div className="space-y-2">
                  <Label>Detail level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {DETAIL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDetailLevel(opt.value)}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-colors',
                          detailLevel === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/30',
                        )}
                      >
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className="text-[11px] text-muted-foreground leading-tight">
                          {opt.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="ai-tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger id="ai-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => void handleGenerate()}
                    disabled={!prompt.trim()}
                    className="w-full sm:w-auto gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Slides
                  </Button>
                </DialogFooter>
              </div>
            )}

            {/* --- Step 2: Generating --- */}
            {wizardStep === 'generating' && (
              <div className="space-y-5 py-2">
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${String(progress)}%` }}
                  />
                </div>

                {/* Phase Steps */}
                <div className="space-y-2">
                  {PHASE_ORDER.filter((p) => p !== 'complete').map((p) => {
                    const status = getPhaseStatus(phase, p);
                    return (
                      <div
                        key={p}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                          status === 'active' && 'bg-primary/5',
                        )}
                      >
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors',
                            status === 'done' &&
                              'bg-primary text-primary-foreground border-primary',
                            status === 'active' &&
                              'border-primary text-primary animate-pulse',
                            status === 'pending' &&
                              'border-muted-foreground/30 text-muted-foreground/50',
                          )}
                        >
                          {status === 'done' ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            PHASE_INFO[p].icon
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-sm',
                            status === 'active' && 'text-foreground font-medium',
                            status === 'done' && 'text-muted-foreground',
                            status === 'pending' && 'text-muted-foreground/50',
                          )}
                        >
                          {PHASE_INFO[p].label}
                          {status === 'active' && '...'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Current status message */}
                <p className="text-sm text-muted-foreground text-center">{progressMessage}</p>

                {/* Outline preview */}
                {outline && (
                  <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border p-3">
                    <p className="text-sm font-medium mb-2">{outline.title}</p>
                    {outline.sections.map((s, i) => {
                      const isGenerated = sections.some(
                        (sec) => sec.sectionIndex === i,
                      );
                      return (
                        <div
                          key={`section-${String(i)}`}
                          className={cn(
                            'flex items-center gap-2 text-xs py-0.5',
                            isGenerated ? 'text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          <span
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] border shrink-0',
                              isGenerated
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-muted-foreground/40',
                            )}
                          >
                            {isGenerated ? <Check className="h-2.5 w-2.5" /> : String(i + 1)}
                          </span>
                          <span className="truncate">{s.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {savingPresentation && (
                  <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving presentation...
                  </p>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={handleCancel} disabled={savingPresentation}>
                    Cancel
                  </Button>
                </DialogFooter>
              </div>
            )}

            {/* --- Step 3: Complete --- */}
            {wizardStep === 'complete' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Presentation created!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {sections.length} slides generated. Redirecting to editor...
                  </p>
                </div>
              </div>
            )}

            {/* --- Error State --- */}
            {wizardStep === 'error' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Something went wrong</p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    {errorMessage}
                  </p>
                </div>
                <DialogFooter className="flex gap-2">
                  {errorRetryable && (
                    <Button onClick={handleRetry} className="gap-2">
                      <ChevronLeft className="h-4 w-4" />
                      Go Back & Retry
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Helpers
// ============================================================

type PhaseStatus = 'pending' | 'active' | 'done';

function getPhaseStatus(
  currentPhase: GenerationPhase,
  targetPhase: GenerationPhase,
): PhaseStatus {
  if (currentPhase === 'complete') return 'done';
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);
  const targetIdx = PHASE_ORDER.indexOf(targetPhase);
  if (targetIdx < currentIdx) return 'done';
  if (targetIdx === currentIdx) return 'active';
  return 'pending';
}
