'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { ResolvedSection, TransitionConfig } from '@/types/presentation';
import { SectionRenderer } from '@/components/sections/section-renderer';

// ============================================================
// Types
// ============================================================

interface SlideshowViewerProps {
  slides: ResolvedSection[];
  title: string;
  themeVars?: Record<string, string>;
  showNotes?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onExit?: () => void;
  showExitButton?: boolean;
  autoEnterFullscreen?: boolean;
}

// ============================================================
// Transition CSS Classes
// ============================================================

function getTransitionStyle(
  transition: TransitionConfig | undefined,
  direction: 'enter' | 'exit',
): React.CSSProperties {
  if (!transition || transition.type === 'none') {
    return {};
  }

  const duration = transition.duration ?? 300;

  switch (transition.type) {
    case 'fade':
      return {
        transition: `opacity ${String(duration)}ms ease-in-out`,
        opacity: direction === 'enter' ? 1 : 0,
      };
    case 'slide': {
      const dir = transition.direction ?? 'left';
      const translateMap: Record<string, string> = {
        left: direction === 'enter' ? 'translateX(0)' : 'translateX(-100%)',
        right: direction === 'enter' ? 'translateX(0)' : 'translateX(100%)',
        up: direction === 'enter' ? 'translateY(0)' : 'translateY(-100%)',
        down: direction === 'enter' ? 'translateY(0)' : 'translateY(100%)',
      };
      return {
        transition: `transform ${String(duration)}ms ease-in-out, opacity ${String(duration)}ms ease-in-out`,
        transform: translateMap[dir] ?? 'translateX(0)',
        opacity: direction === 'enter' ? 1 : 0,
      };
    }
    case 'zoom':
      return {
        transition: `transform ${String(duration)}ms ease-in-out, opacity ${String(duration)}ms ease-in-out`,
        transform: direction === 'enter' ? 'scale(1)' : 'scale(0.8)',
        opacity: direction === 'enter' ? 1 : 0,
      };
    default:
      return {};
  }
}

// ============================================================
// Component
// ============================================================

export function SlideshowViewer({
  slides,
  title,
  themeVars,
  showNotes: initialShowNotes = false,
  autoPlay = false,
  autoPlayInterval = 5000,
  onExit,
  showExitButton = false,
  autoEnterFullscreen = false,
}: SlideshowViewerProps): React.JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(initialShowNotes);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = slides.length;
  const currentSection = slides[currentSlide];

  // Navigation
  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalSlides || isTransitioning) return;

      setIsTransitioning(true);
      // Brief transition delay
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 150);
    },
    [totalSlides, isTransitioning],
  );

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fullscreen not supported or denied
      });
    } else {
      document.exitFullscreen().catch(() => {
        // Already exited
      });
    }
  }, []);

  // Handle fullscreen change events
  useEffect(() => {
    function handleFullscreenChange(): void {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Optionally auto-enter fullscreen on mount (used by editor Present mode)
  useEffect(() => {
    if (!autoEnterFullscreen || !containerRef.current || document.fullscreenElement) return;
    containerRef.current.requestFullscreen().catch(() => {
      // Fullscreen may fail due to browser policy; continue in windowed mode.
    });
  }, [autoEnterFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          if (isFullscreen) {
            document.exitFullscreen().catch(() => { /* noop */ });
          }
          onExit?.();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'n':
        case 'N':
          setShowNotes((prev) => !prev);
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen, goToSlide, isFullscreen, totalSlides, onExit]);

  // Auto-play
  useEffect(() => {
    if (autoPlay && !isTransitioning) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval);
      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }
    return undefined;
  }, [autoPlay, autoPlayInterval, nextSlide, isTransitioning]);

  if (totalSlides === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-gray-400">No slides to display.</p>
        </div>
      </div>
    );
  }

  const transitionStyle = currentSection
    ? getTransitionStyle(
        currentSection.transitions,
        isTransitioning ? 'exit' : 'enter',
      )
    : {};

  const progressPercent =
    totalSlides > 1 ? ((currentSlide + 1) / totalSlides) * 100 : 100;

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden bg-black select-none"
      style={themeVars as React.CSSProperties}
    >
      {/* Slide Content — render in a 16:9 box that scales to fill the viewport */}
      <div
        className="relative h-full w-full flex items-center justify-center"
        onClick={nextSlide}
        style={transitionStyle}
      >
        {currentSection && (
          <div className="sf-slide-frame relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="sf-slide-surface relative shadow-2xl overflow-hidden flex flex-col justify-center"
              style={{
                aspectRatio: '16 / 9',
                width: '100%',
                maxHeight: '100vh',
                maxWidth: `calc(100vh * 16 / 9)`,
                background:
                  'var(--sf-slide-background, var(--sf-color-background, #fff))',
              }}
            >
              <SectionRenderer section={currentSection} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Overlay — visible on hover */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left arrow zone */}
        {currentSlide > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-0 top-0 h-full w-16 pointer-events-auto flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-r from-black/30 to-transparent"
            aria-label="Previous slide"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Right arrow zone */}
        {currentSlide < totalSlides - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-0 top-0 h-full w-16 pointer-events-auto flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-l from-black/30 to-transparent"
            aria-label="Next slide"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div
          className="h-full bg-white/70 transition-all duration-300 ease-out"
          style={{ width: `${String(progressPercent)}%` }}
        />
      </div>

      {/* Slide Counter & Controls */}
      <div className="absolute bottom-3 right-4 flex items-center gap-3 opacity-0 hover:opacity-100 transition-opacity pointer-events-auto">
        <span className="text-white/70 text-sm font-mono">
          {currentSlide + 1} / {totalSlides}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNotes((prev) => !prev);
          }}
          className={`text-sm px-2 py-1 rounded ${
            showNotes
              ? 'bg-white/20 text-white'
              : 'bg-white/10 text-white/50'
          }`}
          aria-label="Toggle speaker notes"
        >
          Notes
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="text-white/50 hover:text-white text-sm px-2 py-1 rounded bg-white/10"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>

      {showExitButton && onExit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {
                // noop
              });
            }
            onExit();
          }}
          className="absolute top-4 right-4 rounded-md bg-black/55 px-3 py-1.5 text-xs font-medium text-white/95 backdrop-blur-sm hover:bg-black/70"
          aria-label="Exit presentation mode"
        >
          Exit Presentation
        </button>
      )}

      {/* Speaker Notes Panel */}
      {showNotes && currentSection?.notes && (
        <div className="absolute bottom-8 left-4 right-4 max-h-32 overflow-y-auto bg-black/80 text-white/80 rounded-lg p-4 text-sm backdrop-blur-sm">
          <p className="font-semibold text-white/50 text-xs uppercase mb-1">
            Speaker Notes
          </p>
          <p className="whitespace-pre-wrap">{currentSection.notes}</p>
        </div>
      )}

      {/* Keyboard Shortcut Hint (shown briefly on mount) */}
      <KeyboardHint />
    </div>
  );
}

// ============================================================
// Keyboard Hint Component
// ============================================================

function KeyboardHint(): React.JSX.Element | null {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white/60 text-xs px-4 py-2 rounded-full backdrop-blur-sm transition-opacity">
      Arrow keys to navigate &bull; F for fullscreen &bull; N for notes &bull;
      Esc to exit
    </div>
  );
}
