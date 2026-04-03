'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type {
  StreamEvent,
  Outline,
  SectionContentGenerated,
} from '@/types/ai';

// ============================================================
// Types
// ============================================================

interface AIGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (result: GenerationResult) => void;
}

export interface GenerationResult {
  outline: Outline;
  sections: SectionContentGenerated[];
  themePresetId?: string;
}

type GenerationStep =
  | 'idle'
  | 'outline'
  | 'layout'
  | 'content'
  | 'images'
  | 'theme'
  | 'complete'
  | 'error';

interface StepInfo {
  label: string;
  description: string;
}

const STEP_INFO: Record<GenerationStep, StepInfo> = {
  idle: { label: 'Ready', description: 'Enter a prompt to generate your presentation' },
  outline: { label: 'Outline', description: 'Generating presentation outline...' },
  layout: { label: 'Layouts', description: 'Selecting slide layouts...' },
  content: { label: 'Content', description: 'Generating slide content...' },
  images: { label: 'Images', description: 'Finding images...' },
  theme: { label: 'Theme', description: 'Selecting theme...' },
  complete: { label: 'Complete', description: 'Presentation generated!' },
  error: { label: 'Error', description: 'Something went wrong' },
};

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'academic', label: 'Academic' },
  { value: 'creative', label: 'Creative' },
  { value: 'minimal', label: 'Minimal' },
] as const;

// ============================================================
// Component
// ============================================================

export function AIGenerationDialog({
  open,
  onOpenChange,
  onComplete,
}: AIGenerationDialogProps): React.JSX.Element {
  const [prompt, setPrompt] = React.useState('');
  const [tone, setTone] = React.useState<string>('professional');
  const [step, setStep] = React.useState<GenerationStep>('idle');
  const [progress, setProgress] = React.useState(0);
  const [progressMessage, setProgressMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [errorRetryable, setErrorRetryable] = React.useState(false);
  const [outline, setOutline] = React.useState<Outline | null>(null);
  const [sections, setSections] = React.useState<SectionContentGenerated[]>([]);
  const [themePresetId, setThemePresetId] = React.useState<string | undefined>();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const isGenerating = step !== 'idle' && step !== 'complete' && step !== 'error';

  const handleGenerate = React.useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setStep('outline');
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
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null) as
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

        // Process complete lines
        const lines = buffer.split('\n');
        // Keep the last potentially incomplete line in the buffer
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
              if (
                data.step === 'outline' ||
                data.step === 'layout' ||
                data.step === 'content' ||
                data.step === 'images' ||
                data.step === 'theme' ||
                data.step === 'complete'
              ) {
                setStep(data.step as GenerationStep);
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
              setStep('complete');
              setProgress(100);
              break;
            }
            case 'error': {
              const errData = event.data as {
                message: string;
                retryable: boolean;
              };
              setStep('error');
              setErrorMessage(errData.message);
              setErrorRetryable(errData.retryable);
              break;
            }
          }
        }
      }

      // If we reached here without error, check if complete
      if (collectedOutline && collectedSections.length > 0) {
        setStep('complete');
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStep('idle');
        return;
      }
      setStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Generation failed');
      setErrorRetryable(true);
    } finally {
      abortControllerRef.current = null;
    }
  }, [prompt, tone, isGenerating]);

  const handleCancel = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStep('idle');
    setProgress(0);
  }, []);

  const handleApply = React.useCallback(() => {
    if (outline && sections.length > 0) {
      onComplete({
        outline,
        sections,
        themePresetId,
      });
      onOpenChange(false);
      // Reset state
      setStep('idle');
      setPrompt('');
      setProgress(0);
      setOutline(null);
      setSections([]);
    }
  }, [outline, sections, themePresetId, onComplete, onOpenChange]);

  const handleRetry = React.useCallback(() => {
    setStep('idle');
    setErrorMessage('');
    void handleGenerate();
  }, [handleGenerate]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
        e.preventDefault();
        void handleGenerate();
      }
    },
    [handleGenerate, isGenerating],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate with AI</DialogTitle>
          <DialogDescription>
            Describe your presentation and AI will generate the content for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="ai-prompt" className="text-sm font-medium">
              What is your presentation about?
            </label>
            <Input
              id="ai-prompt"
              placeholder="e.g., Quarterly business review for Q4 2024..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              className="w-full"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-2">
            <label htmlFor="ai-tone" className="text-sm font-medium">
              Tone
            </label>
            <Select
              value={tone}
              onValueChange={setTone}
              disabled={isGenerating}
            >
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

          {/* Progress Display */}
          {(isGenerating || step === 'complete' || step === 'error') && (
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    step === 'error' ? 'bg-destructive' : 'bg-primary',
                  )}
                  style={{ width: `${String(progress)}%` }}
                />
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {(['outline', 'layout', 'content', 'images', 'theme'] as const).map(
                  (s) => (
                    <div
                      key={s}
                      className={cn(
                        'flex items-center gap-1',
                        step === s && 'text-primary font-medium',
                        getStepStatus(step, s) === 'done' && 'text-primary',
                      )}
                    >
                      <StepDot status={getStepStatus(step, s)} />
                      <span>{STEP_INFO[s].label}</span>
                    </div>
                  ),
                )}
              </div>

              {/* Current Message */}
              <p className="text-sm text-muted-foreground text-center">
                {step === 'error' ? errorMessage : progressMessage}
              </p>

              {/* Section Preview */}
              {outline && (
                <div className="max-h-48 overflow-y-auto space-y-1 rounded-md border p-3">
                  <p className="text-sm font-medium">{outline.title}</p>
                  {outline.sections.map((s, i) => {
                    const isGenerated = sections.some(
                      (sec) => sec.sectionIndex === i,
                    );
                    return (
                      <div
                        key={`section-${String(i)}`}
                        className={cn(
                          'flex items-center gap-2 text-xs py-1',
                          isGenerated
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        <span
                          className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] border',
                            isGenerated
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-muted-foreground',
                          )}
                        >
                          {isGenerated ? '\u2713' : String(i + 1)}
                        </span>
                        <span>{s.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'error' && errorRetryable && (
            <Button variant="outline" onClick={handleRetry}>
              Retry
            </Button>
          )}

          {isGenerating && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}

          {step === 'complete' && (
            <Button onClick={handleApply}>
              Apply to Presentation
            </Button>
          )}

          {step === 'idle' && (
            <Button
              onClick={() => void handleGenerate()}
              disabled={!prompt.trim()}
            >
              Generate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Helper Components
// ============================================================

type StepStatus = 'pending' | 'active' | 'done';

const STEP_ORDER: GenerationStep[] = [
  'outline',
  'layout',
  'content',
  'images',
  'theme',
];

function getStepStatus(
  currentStep: GenerationStep,
  targetStep: GenerationStep,
): StepStatus {
  if (currentStep === 'complete') return 'done';
  if (currentStep === 'error') return 'pending';

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const targetIndex = STEP_ORDER.indexOf(targetStep);

  if (currentIndex === -1) return 'pending';
  if (targetIndex < currentIndex) return 'done';
  if (targetIndex === currentIndex) return 'active';
  return 'pending';
}

function StepDot({ status }: { status: StepStatus }): React.JSX.Element {
  return (
    <div
      className={cn(
        'w-2 h-2 rounded-full',
        status === 'done' && 'bg-primary',
        status === 'active' && 'bg-primary animate-pulse',
        status === 'pending' && 'bg-muted-foreground/30',
      )}
    />
  );
}
