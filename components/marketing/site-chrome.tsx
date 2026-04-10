import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiteHeaderProps {
  showMarketingLinks?: boolean;
}

export function SiteHeader({ showMarketingLinks = true }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
          </span>
          <span className="text-lg">Vizi2</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {showMarketingLinks && (
            <>
              <Link href="/#features" className="transition-colors hover:text-foreground">
                Features
              </Link>
              <Link href="/#workflow" className="transition-colors hover:text-foreground">
                Workflow
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="rounded-full px-5 font-semibold shadow-lg shadow-primary/20">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/80 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>&copy; {new Date().getFullYear()} Vizi2. Professional AI presentation builder.</p>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function SiteBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-180px] top-[-140px] h-[420px] w-[420px] rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute right-[-220px] top-[12%] h-[460px] w-[460px] rounded-full bg-slate-500/10 blur-3xl" />
      <div className="absolute bottom-[-220px] left-[26%] h-[380px] w-[380px] rounded-full bg-zinc-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.035)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
    </div>
  );
}
