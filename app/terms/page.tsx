import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">Vizi2</Link>
        </nav>
      </header>
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-extrabold mb-8">Terms of Service</h1>
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          <h2>Welcome to Vizi2</h2>
          <p>By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.</p>
          
          <h2>1. Use of the Service</h2>
          <p>Vizi2 provides an AI-powered platform for generating and downloading presentations. You may generate content for personal and commercial purposes, provided you do not infringe on the rights of others.</p>

          <h2>2. User Content</h2>
          <p>You retain full ownership of any text, images, or other materials you submit to our service. However, by submitting content, you grant Vizi2 a non-exclusive license to use, reproduce, or modify the content for the sole purpose of operating and providing our service.</p>

          <h2>3. Intellectual Property</h2>
          <p>The layout engine, platform design, algorithms, templates, and overarching infrastructure remain the exclusive property of Vizi2 and its licensors.</p>

          <h2>4. Limitation of Liability</h2>
          <p>In no event shall Vizi2, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of the Service.</p>
          
          <div className="mt-16">
            <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
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