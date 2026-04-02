import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            Vizi2
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link href="/register"><Button>Get Started &rarr;</Button></Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-xl text-muted-foreground">Start for free. Upgrade when you need more.</p>
        </div>

        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="border rounded-2xl p-8 bg-card flex flex-col">
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="mt-4 text-muted-foreground flex-1">Perfect for trying out our AI generation.</p>
            <div className="mt-4 pb-8"><span className="text-4xl font-extrabold">$0</span><span className="text-muted-foreground">/mo</span></div>
            <ul className="space-y-4 mb-8">
              {['3 AI generated presentations per month', 'Basic layouts', 'Standard export', 'Community support'].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full" variant="outline"><Link href="/register">Start for free</Link></Button>
          </div>

          {/* Pro Tier */}
          <div className="border-2 border-primary rounded-2xl p-8 bg-card flex flex-col relative">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Most Popular</div>
            <h3 className="text-2xl font-bold">Pro</h3>
            <p className="mt-4 text-muted-foreground flex-1">For professionals and teams creating lots of content.</p>
            <div className="mt-4 pb-8"><span className="text-4xl font-extrabold">$29</span><span className="text-muted-foreground">/mo</span></div>
            <ul className="space-y-4 mb-8">
              {['Unlimited AI presentations', 'Premium layout library', 'Custom themes and fonts', 'High-res PowerPoint export', 'Priority support'].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full"><Link href="/register">Upgrade to Pro</Link></Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Vizi2. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
