import Link from 'next/link';
import { ArrowRight, Sparkles, Layout, Download, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-First Generation',
    description:
      'Describe your presentation in natural language. Our AI produces a structured outline, selects layouts, generates content, and applies a cohesive theme.',
  },
  {
    icon: Layout,
    title: 'Layout-Driven Composition',
    description:
      'Every section maps to a named layout template with defined slots, sizing constraints, and responsive breakpoints for pixel-perfect rendering.',
  },
  {
    icon: Palette,
    title: 'Deep Customizability',
    description:
      'Edit inline with rich text, swap layouts, drag-and-drop sections, adjust theme tokens, and override styles per-section with real-time preview.',
  },
  {
    icon: Download,
    title: 'Pixel-Perfect PPTX Export',
    description:
      'Export to PowerPoint with preserved fonts, colors, positioning, and media. Opens flawlessly in Microsoft PowerPoint and Google Slides.',
  },
] as const;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SlideForge AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Presentation Builder
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Create stunning presentations{' '}
              <span className="text-primary">in seconds</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Describe your presentation in plain English. SlideForge AI generates fully-designed,
              layout-based slides with beautiful themes — ready to customize and export as
              pixel-perfect PowerPoint files.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Creating — Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to build great presentations
              </h2>
              <p className="mt-4 text-muted-foreground">
                From AI generation to pixel-perfect export, SlideForge handles the entire workflow.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of professionals who create beautiful presentations with AI. No design
              skills required.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create Your First Presentation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>SlideForge AI</span>
          </div>
          <p>&copy; {new Date().getFullYear()} SlideForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
