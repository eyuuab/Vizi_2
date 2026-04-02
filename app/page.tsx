import Link from 'next/link';
import { ArrowRight, Sparkles, Layout, Download, Palette, CheckCircle2, MonitorPlay, Zap, ShieldCheck } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Vizi2</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-semibold rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="container mx-auto px-6 py-24 sm:py-32 lg:px-8 text-center">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm transition-all hover:bg-primary/10 hover:border-primary/30 cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Vizi2 AI Engine v2.0 is Live
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                Presentations that <br className="hidden sm:block" /> write themselves.
              </h1>
              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Describe your presentation in plain English. Vizi2 generates fully-designed, layout-based slides with beautiful themes — ready to customize and export as pixel-perfect PowerPoint files.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                    Start Creating for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-4 sm:mt-0">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card required
                </div>
              </div>
            </div>

            {/* Mockup / Dashboard Preview */}
            <div className="mt-16 sm:mt-24 relative mx-auto max-w-5xl rounded-2xl border border-border/50 bg-background/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4 ring-1 ring-white/10">
              <div className="rounded-xl overflow-hidden border bg-muted/20 aspect-video relative flex items-center justify-center group cursor-pointer">
                {/* Simulated Editor Window */}
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/10"></div>
                
                <div className="z-10 bg-background/90 backdrop-blur-md border rounded-xl p-8 max-w-sm text-left shadow-2xl transition-transform group-hover:scale-105">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Vizi2 AI</p>
                      <p className="text-xs text-muted-foreground">Drafting slides...</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-muted-foreground/20 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary animate-pulse rounded-full"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Applying "Modern Minimal" layout...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 sm:py-32 relative border-t bg-muted/10">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
              <h2 className="text-base font-semibold leading-7 text-primary mb-2">Build faster</h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything you need to build great presentations
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {FEATURES.map((feature, i) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-primary/10"></div>
                  <feature.icon className="h-10 w-10 text-primary mb-6 relative z-10" />
                  <h3 className="text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10"></div>
          <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-foreground">
              Ready to create your next masterpiece?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of professionals who have stopped wasting time on slide design and started focusing on their message.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-base font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                  Create Your First Presentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background pt-16 pb-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold tracking-tight">Vizi2</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                AI-powered presentation builder. Generates fully-designed, layout-based slides ready to export.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground text-sm">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground text-sm">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Vizi2. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
