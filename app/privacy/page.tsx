import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">Vizi2</Link>
        </nav>
      </header>
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-extrabold mb-8">Privacy Policy</h1>
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Information We Collect</h2>
          <p>We only collect the information necessary to provide you with the best experience on Vizi2. This includes:</p>
          <ul>
            <li>Profile Information: When you create an account, we collect your name and email address.</li>
            <li>Usage Data: We collect analytics on how you use our application to improve its features and performance.</li>
            <li>Content: We store the text you use as inputs, generated drafts, and images to allow for seamless presentation editing.</li>
          </ul>

          <h2>2. How We Use the Information</h2>
          <p>Your information is primarily used to provide, maintain, and improve the Vizi2 services.</p>
          <ul>
            <li>To process your inputs and return generated presentations.</li>
            <li>To communicate with you about your account or relevant updates.</li>
            <li>To manage subscriptions and perform customer support.</li>
          </ul>

          <h2>3. Data Sharing and Protection</h2>
          <p>We do not sell your personal information. We may share anonymized usage statistics to third parties.</p>
          <p>We take appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data.</p>
          
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