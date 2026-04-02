'use client';

import { useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Keyboard,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setZoom } from '@/store/slices/editor-slice';

const ZOOM_PRESETS = [25, 50, 75, 100, 125, 150, 200] as const;

export function BottomBar(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const zoom = useAppSelector((state) => state.editor.zoom);
  const aiGenerating = useAppSelector((state) => state.ui.aiGenerating);
  const aiProgress = useAppSelector((state) => state.ui.aiProgress);
  const sections = useAppSelector((state) => state.presentation.sections);

  const handleZoomIn = useCallback(() => {
    const nextPreset = ZOOM_PRESETS.find((z) => z > zoom);
    dispatch(setZoom(nextPreset ?? 200));
  }, [zoom, dispatch]);

  const handleZoomOut = useCallback(() => {
    const prevPreset = [...ZOOM_PRESETS].reverse().find((z) => z < zoom);
    dispatch(setZoom(prevPreset ?? 25));
  }, [zoom, dispatch]);

  const handleZoomReset = useCallback(() => {
    dispatch(setZoom(100));
  }, [dispatch]);

  return (
    <footer className="flex h-8 items-center justify-between border-t bg-card px-3 text-xs text-muted-foreground">
      {/* Left: Section count + AI progress */}
      <div className="flex items-center gap-3">
        <span>
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </span>
        {aiGenerating && (
          <div className="flex items-center gap-1.5">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>AI generating... {aiProgress > 0 ? `${String(aiProgress)}%` : ''}</span>
          </div>
        )}
      </div>

      {/* Center: Keyboard shortcut hint */}
      <div className="flex items-center gap-1">
        <Keyboard className="h-3 w-3" />
        <span>Ctrl+K for commands</span>
      </div>

      {/* Right: Zoom controls */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 min-w-[48px] text-xs px-1.5"
              onClick={handleZoomReset}
            >
              {zoom}%
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Zoom</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleZoomReset}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit to Screen</TooltipContent>
        </Tooltip>
      </div>
    </footer>
  );
}
