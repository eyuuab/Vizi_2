'use client';

import { useState, useCallback } from 'react';
import {
  Undo2,
  Redo2,
  Share2,
  Download,
  Play,
  ChevronLeft,
  Check,
  Loader2,
  CloudOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMode } from '@/store/slices/editor-slice';
import { setTitle } from '@/store/slices/presentation-slice';
import { setExportDialogOpen, setShareDialogOpen } from '@/store/slices/ui-slice';
import { undo, redo, canUndo, canRedo } from '@/store/undo-middleware';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  onSave: () => Promise<void>;
}

export function TopBar({ onSave }: TopBarProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const title = useAppSelector((state) => state.presentation.title);
  const isSaving = useAppSelector((state) => state.editor.isSaving);
  const isDirty = useAppSelector((state) => state.presentation.isDirty);
  const isThemeCustomized = useAppSelector((state) => state.theme.isCustomized);
  const lastSavedAt = useAppSelector((state) => state.editor.lastSavedAt);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);

  const handleBackToDashboard = useCallback(async () => {
    if (isDirty || isSaving || isThemeCustomized) {
      await onSave();
    }
    router.push('/dashboard');
  }, [isDirty, isSaving, isThemeCustomized, onSave, router]);

  const handleTitleSubmit = useCallback(() => {
    const trimmed = titleDraft.trim();
    if (trimmed.length > 0 && trimmed !== title) {
      dispatch(setTitle(trimmed));
    } else {
      setTitleDraft(title);
    }
    setIsEditingTitle(false);
  }, [titleDraft, title, dispatch]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleTitleSubmit();
      } else if (e.key === 'Escape') {
        setTitleDraft(title);
        setIsEditingTitle(false);
      }
    },
    [handleTitleSubmit, title],
  );

  const formatSavedTime = (iso: string): string => {
    try {
      const date = new Date(iso);
      return `Saved at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return 'Saved';
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-3">
      {/* Left section: Back + Title */}
      <div className="flex items-center gap-2 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => void handleBackToDashboard()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Back to Dashboard</TooltipContent>
        </Tooltip>

        {isEditingTitle ? (
          <input
            type="text"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            className="h-8 min-w-[200px] max-w-[400px] rounded border border-input bg-background px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
            maxLength={500}
          />
        ) : (
          <button
            type="button"
            className="truncate text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 transition-colors max-w-[400px]"
            onClick={() => {
              setTitleDraft(title);
              setIsEditingTitle(true);
            }}
            title="Click to edit title"
          >
            {title}
          </button>
        )}

        {/* Save status */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isDirty || isThemeCustomized ? (
            <>
              <CloudOff className="h-3 w-3" />
              <span>Unsaved changes</span>
            </>
          ) : lastSavedAt ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              <span>{formatSavedTime(lastSavedAt)}</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dispatch(undo())}
              disabled={!canUndo()}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => dispatch(redo())}
              disabled={!canRedo()}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-5 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => dispatch(setShareDialogOpen(true))}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Presentation</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Export (Ctrl+E)</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => dispatch(setExportDialogOpen(true))}>
              Export as PPTX
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => dispatch(setExportDialogOpen(true))}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => dispatch(setMode('present'))}
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Present</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Present (Ctrl+Enter)</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
