import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Sparkles,
  Layout,
  Download,
  Palette,
  CheckCircle2,
  MessageSquare,
  Paintbrush,
  FileDown,
  Star,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Vizi2 — AI-Powered Presentation Builder',
  description:
    'Create beautiful presentations from natural language prompts. AI generates fully-designed, layout-based slides with themes — ready to export as pixel-perfect PowerPoint files.',
  openGraph: {
    type: 'website',
    siteName: 'Vizi2',
    title: 'Vizi2 — AI-Powered Presentation Builder',
    description:
      'Create beautiful presentations from natural language prompts.',
  },
};

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

const STEPS = [
  {
    icon: MessageSquare,
    step: '1',
    title: 'Describe',
    description:
      'Tell us about your presentation in plain English. What is it about, who is the audience, what is the goal?',
  },
  {
    icon: Paintbrush,
    step: '2',
    title: 'Customize',
    description:
      'Fine-tune your slides with our visual editor. Swap layouts, edit text inline, change themes, and reorder sections.',
  },
  {
    icon: FileDown,
    step: '3',
    title: 'Export',
    description:
      'Download as a pixel-perfect PowerPoint file, PDF, or share with a public link. Your presentation, your way.',
  },
] as const;

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Scale AI',
    text: 'Vizi2 cut my presentation prep time from 4 hours to 20 minutes. The AI understands context and creates slides that actually look professional.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    text: 'I used Vizi2 for our Series A pitch deck. The layout engine produced slides that impressed our investors. Closed the round in 3 weeks.',
    avatar: 'MJ',
  },
  {
    name: 'Dr. Emily Rivera',
    role: 'Professor of Computer Science',
    text: 'Finally a tool that produces academic-quality slides. My lecture presentations look clean and consistent without hours of manual formatting.',
    avatar: 'ER',
  },
] as const;

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  excluded: string[];
  cta: string;
  highlighted: boolean;
}

const PRICING: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with essential features',
    features: [
      'Up to 5 presentations',
      '20 AI generations per month',
      '12 built-in themes',
      'PPTX export',
      'Community support',
    ],
    excluded: [
      'Custom themes',
      'Team collaboration',
      'Priority AI models',
      'Custom branding',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For professionals who present often',
    features: [
      'Unlimited presentations',
      '200 AI generations per month',
      'All themes + custom themes',
      'PPTX & PDF export',
      'Priority support',
      'Priority AI models',
      'Password-protected sharing',
    ],
    excluded: ['Team collaboration', 'Custom branding'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per user / month',
    description: 'Collaborate with your entire team',
    features: [
      'Everything in Pro',
      '1,000 AI generations per month',
      'Team collaboration',
      'Custom branding',
      'Admin dashboard',
      'SSO integration',
      'Dedicated support',
    ],
    excluded: [],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

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
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="font-semibold rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                'radial-gradient(65% 50% at 50% 0%, hsl(var(--primary) / 0.16), transparent 65%)',
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 hero-grid-mask"
            aria-hidden="true"
          >
            <div className="hero-grid h-full w-full opacity-70" />
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="hero-orb hero-orb-a" />
            <div className="hero-orb hero-orb-b" />
            <div className="hero-orb hero-orb-c" />
          </div>

          <div className="container mx-auto px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/70 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Motion Canvas Engine
                </div>
                <div className="space-y-5">
                  <h1 className="max-w-3xl text-balance text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                    Build deck-ready stories in minutes, not meetings.
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                    Drop in a prompt and Vizi2 drafts a polished narrative with
                    structure, visuals, and brand-ready layouts. You refine what
                    matters, then export in one click.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="h-14 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
                    >
                      Start Creating for Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#pricing">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 rounded-full px-8 text-base font-semibold bg-background/70 backdrop-blur-sm"
                    >
                      See Pricing
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    No credit card required
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="font-medium">4.9/5 from 2,000+ creators</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/70 bg-background/75 p-4 backdrop-blur-sm">
                    <p className="text-2xl font-extrabold tracking-tight">
                      12x
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Faster first draft
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/75 p-4 backdrop-blur-sm">
                    <p className="text-2xl font-extrabold tracking-tight">
                      40+
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Layout patterns
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/75 p-4 backdrop-blur-sm">
                    <p className="text-2xl font-extrabold tracking-tight">
                      99%
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Export fidelity
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl lg:mx-0">
                <div className="hero-glow-ring absolute -right-8 -top-8 h-40 w-40 rounded-full border border-primary/30" />
                <div className="hero-glow-ring hero-glow-ring-delay absolute -bottom-10 left-2 h-28 w-28 rounded-full border border-primary/20" />
                <div className="hero-card-float rounded-3xl border border-border/70 bg-background/90 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                  <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">AI Deck Pilot</p>
                          <p className="text-xs text-muted-foreground">
                            Live composition
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                        Generating
                      </span>
                    </div>
                    <div className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Prompt
                      </p>
                      <p className="text-sm leading-relaxed">
                        Build a 10-slide product launch story for an AI note
                        taking app targeting remote teams.
                      </p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/75 px-3 py-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <p className="text-sm font-medium">
                          Story arc and talking points drafted
                        </p>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/75 px-3 py-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        <p className="text-sm font-medium">
                          Theme and layout system applied
                        </p>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/75 px-3 py-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                        <p className="text-sm font-medium">
                          PPTX export rendering in progress
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-8 w-44 rounded-2xl border border-border/70 bg-background/90 p-3 shadow-xl backdrop-blur-sm sm:w-48">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Slide Balance
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">A+</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Visual rhythm optimized
                  </p>
                </div>

                <div className="absolute -bottom-4 left-6 rounded-2xl border border-border/70 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Export Queue
                  </p>
                  <p className="mt-1 text-sm font-semibold">PowerPoint ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section
          id="features"
          className="py-24 sm:py-32 relative border-t bg-muted/10"
        >
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-24">
              <h2 className="text-base font-semibold leading-7 text-primary mb-2">
                Build faster
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything you need to build great presentations
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:bg-primary/10" />
                  <feature.icon className="h-10 w-10 text-primary mb-6 relative z-10" />
                  <h3 className="text-xl font-semibold mb-3 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 sm:py-32 border-t">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-primary mb-2">
                Simple workflow
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Three steps to a polished presentation
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 sm:py-32 border-t bg-muted/10">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-primary mb-2">
                Trusted by professionals
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                What our users say
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border bg-card p-8 shadow-sm"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 sm:py-32 border-t">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-primary mb-2">
                Pricing
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Plans for every creator
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Start for free. Upgrade as you grow.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-start">
              {PRICING.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-8 shadow-sm ${
                    tier.highlighted
                      ? 'border-primary ring-2 ring-primary/20 relative'
                      : ''
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tier.description}
                    </p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{tier.price}</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      {tier.period}
                    </span>
                  </div>
                  <Link href="/register">
                    <Button
                      className="w-full mb-6"
                      variant={tier.highlighted ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.excluded.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <X className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden border-t">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl relative z-10">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 text-foreground">
              Ready to create your next masterpiece?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of professionals who have stopped wasting time on
              slide design and started focusing on their message.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-semibold rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
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
                AI-powered presentation builder. Generates fully-designed,
                layout-based slides ready to export.
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground text-sm">
                Product
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/templates"
                    className="hover:text-foreground transition-colors"
                  >
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground text-sm">
                Resources
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground text-sm">
                Legal
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
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
