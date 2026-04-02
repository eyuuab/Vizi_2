import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl flex items-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" /> Vizi2
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing"><span className="text-sm text-foreground/80 hover:text-foreground">Pricing</span></Link>
            <Link href="/login"><Button variant="ghost">Sign In</Button></Link>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 py-32 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-extrabold tracking-tight mb-8 text-center text-foreground">About Vizi2</h1>
          
          <div className="prose prose-lg dark:prose-invert mx-auto space-y-8">
            <p className="lead text-2xl text-muted-foreground text-center">
              We started Vizi2 to make beautiful, layout-perfect presentations accessible to everyone through the power of AI.
            </p>
            <div className="h-12"></div>
            <h3>Our Mission</h3>
            <p>
              Presentations have always been a necessary evil. They communicate vital ideas, yet they absorb hours of manual pixel-pushing. We envisioned a tool that understands your story, applies professional design systems automatically, and exports flawlessly to the tools you already use.
            </p>
            <p>
              Vizi2 relies on a sophisticated internal constraint engine and top-of-the-line LLMs to pick layouts, apply content to slots, and align everything perfectly based on modern design principles.
            </p>
            
            <h3>The Team</h3>
            <p>
              Located around the globe, we are a small group of designers, engineers, and creatives who believe in the future of AI-augmented design. We aren't here to replace human creativity, but to accelerate it by removing the friction of the blank slide.
            </p>
            
            <div className="pt-12 text-center">
              <Button size="lg" asChild>
                <Link href="/register">Join us on our journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Vizi2.</span>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
