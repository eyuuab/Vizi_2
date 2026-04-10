import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
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
  Zap,
  Shield,
  Globe,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaqSection } from '@/components/landing/faq-section';

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
    gradient: 'from-blue-600/20 to-blue-400/20',
    iconBg: 'bg-blue-600/10',
    iconColor: 'text-blue-600',
  },
  {
    icon: Layout,
    title: 'Layout-Driven Composition',
    description:
      'Every section maps to a named layout template with defined slots, sizing constraints, and responsive breakpoints for pixel-perfect rendering.',
    gradient: 'from-sky-500/20 to-cyan-400/20',
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600',
  },
  {
    icon: Palette,
    title: 'Deep Customizability',
    description:
      'Edit inline with rich text, swap layouts, drag-and-drop sections, adjust theme tokens, and override styles per-section with real-time preview.',
    gradient: 'from-blue-700/20 to-blue-500/20',
    iconBg: 'bg-blue-700/10',
    iconColor: 'text-blue-700',
  },
  {
    icon: Download,
    title: 'Pixel-Perfect PPTX Export',
    description:
      'Export to PowerPoint with preserved fonts, colors, positioning, and media. Opens flawlessly in Microsoft PowerPoint and Google Slides.',
    gradient: 'from-emerald-500/20 to-teal-400/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
] as const;

const STEPS = [
  {
    icon: MessageSquare,
    step: '1',
    title: 'Describe',
    description:
      'Tell us about your presentation in plain English. What is it about, who is the audience, what is the goal?',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Paintbrush,
    step: '2',
    title: 'Customize',
    description:
      'Fine-tune your slides with our visual editor. Swap layouts, edit text inline, change themes, and reorder sections.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: FileDown,
    step: '3',
    title: 'Export',
    description:
      'Download as a pixel-perfect PowerPoint file or share with a public link. Your presentation, your way.',
    color: 'from-sky-500 to-blue-600',
  },
] as const;

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Scale AI',
    text: 'Vizi2 cut my presentation prep time from 4 hours to 20 minutes. The AI understands context and creates slides that actually look professional.',
    avatar: 'SC',
    avatarBg: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    text: 'I used Vizi2 for our Series A pitch deck. The layout engine produced slides that impressed our investors. Closed the round in 3 weeks.',
    avatar: 'MJ',
    avatarBg: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Dr. Emily Rivera',
    role: 'Professor of Computer Science',
    text: 'Finally a tool that produces academic-quality slides. My lecture presentations look clean and consistent without hours of manual formatting.',
    avatar: 'ER',
    avatarBg: 'bg-emerald-100 text-emerald-700',
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

const TRUST_BADGES = [
  { icon: Zap, label: '50k+ presentations created' },
  { icon: Shield, label: 'SOC 2 compliant' },
  { icon: Globe, label: 'Used in 120+ countries' },
  { icon: Star, label: '4.9/5 average rating' },
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 rounded-xl shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Vizi2</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="font-semibold">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="font-semibold rounded-full px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all"
              >
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* ============ HERO SECTION ============ */}
        <section className="relative overflow-hidden">
          {/* Background effects */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                'radial-gradient(70% 55% at 50% 0%, hsl(217 91% 60% / 0.12), transparent 70%)',
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 -z-10 hero-grid-mask" aria-hidden="true">
            <div className="hero-grid h-full w-full opacity-50" />
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="hero-orb hero-orb-a" />
            <div className="hero-orb hero-orb-b" />
            <div className="hero-orb hero-orb-c" />
          </div>

          {/* Hero content — centered layout */}
          <div className="container mx-auto px-6 pt-20 sm:pt-24 lg:px-8 lg:pt-28 pb-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/5 px-4 py-1.5 text-sm font-medium text-blue-600 shadow-sm backdrop-blur-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
                </span>
                Powered by GPT-4o, Claude &amp; Gemini
              </div>

              {/* Headline */}
              <h1 className="text-balance text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.5rem]">
                Turn any idea into a{' '}
                <span className="text-gradient">stunning presentation</span>
                {' '}in minutes
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Drop in a prompt and Vizi2 drafts a polished narrative with
                structure, visuals, and brand-ready layouts. You refine what
                matters, then export in one click.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-14 rounded-full px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:-translate-y-0.5"
                  >
                    Start Creating for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full px-8 text-base font-semibold bg-background/70 backdrop-blur-sm border-border/60 hover:bg-accent"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No credit card required
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Free plan available
                </div>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-1.5 font-medium hidden sm:flex">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Set up in 30 seconds
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual — Browser mockup with slide preview */}
          <div className="container mx-auto px-6 lg:px-8 pb-20 sm:pb-24 lg:pb-28">
            <div className="relative mx-auto max-w-5xl">
              {/* Glow behind browser */}
              <div className="absolute inset-0 -z-10 mx-8 rounded-3xl bg-gradient-to-b from-blue-600/15 to-transparent blur-2xl" />

              {/* Browser window */}
              <div className="browser-mockup overflow-hidden">
                {/* Title bar */}
                <div className="browser-mockup-bar">
                  <div className="browser-dot bg-red-400/80" />
                  <div className="browser-dot bg-amber-400/80" />
                  <div className="browser-dot bg-emerald-400/80" />
                  <div className="ml-4 flex-1 flex justify-center">
                    <div className="flex items-center gap-2 rounded-md bg-background/80 border border-border/60 px-3 py-1 text-xs text-muted-foreground max-w-xs w-full justify-center">
                      <span className="truncate">app.vizi2.com/editor/presentation-demo</span>
                    </div>
                  </div>
                </div>

                {/* Editor preview */}
                <div className="relative bg-muted/20 p-4 sm:p-6 min-h-[320px] sm:min-h-[400px]">
                  {/* Left sidebar mockup */}
                  <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-48 border-r border-border/40 bg-background/60 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Sections</p>
                    {['Hero', 'Problem', 'Solution', 'Features', 'Pricing'].map((name, i) => (
                      <div
                        key={name}
                        className={`mb-1.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                          i === 0
                            ? 'bg-blue-600/10 border border-blue-600/20 text-blue-700 font-semibold'
                            : 'text-muted-foreground hover:bg-accent/50'
                        }`}
                      >
                        <div className={`h-5 w-8 rounded-sm ${i === 0 ? 'bg-blue-600/20' : 'bg-muted'}`} />
                        {name}
                      </div>
                    ))}
                  </div>

                  {/* Main slide area */}
                  <div className="lg:ml-48 lg:mr-52 flex items-center justify-center min-h-[280px] sm:min-h-[340px]">
                    <div className="w-full max-w-lg aspect-video rounded-xl border border-border/60 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 shadow-xl shadow-blue-900/20 p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden">
                      {/* Slide decorative elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl" />

                      <div className="relative z-10">
                        <div className="inline-block rounded-full bg-white/10 border border-white/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-200 mb-3">
                          Product Launch
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight mb-2">
                          Introducing NoteSync AI
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-200/80 leading-relaxed max-w-sm">
                          The intelligent note-taking app that transforms meetings into actionable insights for remote teams.
                        </p>
                        <div className="flex gap-2 mt-4">
                          <div className="rounded-md bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white">Get Started</div>
                          <div className="rounded-md border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-blue-200">Learn More</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right sidebar mockup */}
                  <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-52 border-l border-border/40 bg-background/60 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Theme</p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { bg: 'bg-blue-700', label: 'Ocean', active: true },
                        { bg: 'bg-slate-800', label: 'Dark', active: false },
                        { bg: 'bg-amber-50', label: 'Warm', active: false },
                        { bg: 'bg-emerald-700', label: 'Forest', active: false },
                      ].map((theme) => (
                        <div
                          key={theme.label}
                          className={`rounded-lg overflow-hidden border-2 ${
                            theme.active ? 'border-blue-600 shadow-sm' : 'border-border/40'
                          }`}
                        >
                          <div className={`${theme.bg} h-8`} />
                          <div className="px-1.5 py-1 text-[9px] font-medium text-center">
                            {theme.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 mt-4">Colors</p>
                    <div className="flex gap-1.5 mb-4">
                      <div className="h-6 w-6 rounded-full bg-blue-700 border-2 border-blue-400 ring-2 ring-blue-600/20" />
                      <div className="h-6 w-6 rounded-full bg-blue-200 border border-border/40" />
                      <div className="h-6 w-6 rounded-full bg-white border border-border/40" />
                      <div className="h-6 w-6 rounded-full bg-blue-950 border border-border/40" />
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Font</p>
                    <div className="rounded-md border border-border/40 bg-background/80 px-2 py-1.5 text-[11px]">
                      Manrope
                    </div>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute top-3 right-3 lg:hidden flex items-center gap-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                    <Sparkles className="h-3 w-3" />
                    AI Generated
                  </div>
                </div>
              </div>

              {/* Floating stat cards around the browser */}
              <div className="hidden md:block absolute -left-6 top-1/3 slide-float-1">
                <div className="rounded-2xl border border-border/50 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Speed</p>
                  <p className="text-2xl font-extrabold text-gradient mt-0.5">12x</p>
                  <p className="text-[11px] text-muted-foreground">Faster than manual</p>
                </div>
              </div>

              <div className="hidden md:block absolute -right-4 top-1/4 slide-float-2">
                <div className="rounded-2xl border border-border/50 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-600">Export Ready</p>
                  </div>
                  <p className="text-sm font-semibold mt-1">.pptx generated</p>
                </div>
              </div>

              <div className="hidden lg:block absolute -right-8 bottom-20 slide-float-3">
                <div className="rounded-2xl border border-border/50 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layouts</p>
                  <p className="text-2xl font-extrabold text-gradient mt-0.5">40+</p>
                  <p className="text-[11px] text-muted-foreground">Ready to use</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="border-y border-border/40 bg-muted/30 py-8">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <badge.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-24 sm:py-32 relative section-mesh-1">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-base font-semibold leading-7 text-primary mb-3">
                Build faster
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need to build{' '}
                <span className="text-gradient">great presentations</span>
              </p>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                From AI generation to pixel-perfect export, every feature is designed to save you time and elevate your message.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-600/30 overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <div
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl ${feature.iconBg} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 sm:py-32 border-t bg-muted/20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
              <h2 className="text-base font-semibold leading-7 text-primary mb-3">
                Simple workflow
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Three steps to a{' '}
                <span className="text-gradient">polished presentation</span>
              </p>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                Go from idea to finished deck in minutes, not hours.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-20 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-sky-500/30" />

              {STEPS.map((step) => (
                <div key={step.step} className="relative text-center space-y-5">
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} shadow-lg shadow-blue-600/20`}>
                    <step.icon className="h-9 w-9 text-white" />
                  </div>
                  <div className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-background border-2 border-blue-600 text-sm font-bold text-blue-600 shadow-sm">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 sm:py-32 border-t section-mesh-1">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
              <h2 className="text-base font-semibold leading-7 text-primary mb-3">
                Trusted by professionals
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                What our users say
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of creators who build better presentations with Vizi2.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="group rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-600/30 hover:-translate-y-1"
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-foreground/80 leading-relaxed mb-6 text-[15px]">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${testimonial.avatarBg}`}
                    >
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
        <section id="pricing" className="py-24 sm:py-32 border-t bg-muted/20">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
              <h2 className="text-base font-semibold leading-7 text-primary mb-3">
                Pricing
              </h2>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Plans for every{' '}
                <span className="text-gradient">creator</span>
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Start for free. Upgrade as you grow. No hidden fees.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto items-start">
              {PRICING.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${
                    tier.highlighted
                      ? 'relative border-2 border-blue-600 bg-card ring-4 ring-blue-600/10 scale-[1.02] hover:scale-[1.04]'
                      : 'border border-border/60 bg-card hover:-translate-y-1'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-1 text-xs font-bold text-white shadow-lg shadow-blue-600/30">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tier.description}
                    </p>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      {tier.period}
                    </span>
                  </div>
                  <Link href="/register">
                    <Button
                      className={`w-full mb-8 h-11 font-semibold ${
                        tier.highlighted
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-lg shadow-blue-600/25'
                          : ''
                      }`}
                      variant={tier.highlighted ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 mt-0.5">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.excluded.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                          <X className="h-3 w-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection />

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden border-t">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/[0.06] via-sky-500/[0.03] to-blue-600/[0.06]" />
          <div className="pointer-events-none absolute inset-0 -z-10 hero-grid-mask" aria-hidden="true">
            <div className="hero-grid h-full w-full opacity-40" />
          </div>
          <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-600/25">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Ready to create your next{' '}
              <span className="text-gradient">masterpiece</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Join thousands of professionals who have stopped wasting time on
              slide design and started focusing on their message.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-10 text-base font-semibold rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all"
                >
                  Create Your First Presentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free plan available. No credit card required.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background pt-16 pb-8">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 rounded-xl">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">Vizi2</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                AI-powered presentation builder. Generates fully-designed,
                layout-based slides ready to export.
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground text-sm">
                Product
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/templates" className="hover:text-foreground transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-foreground transition-colors">
                    FAQ
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
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
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
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
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
