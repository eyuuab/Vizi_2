import type { Metadata } from 'next';
import { Manrope, IBM_Plex_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StoreProvider } from '@/store/provider';
import './globals.css';

const manrope = Manrope({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-geist-mono',
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SlideForge AI — AI-Powered Presentation Builder',
    template: '%s | SlideForge AI',
  },
  description:
    'Create beautiful presentations from natural language prompts with AI-powered layout selection, content generation, and pixel-perfect PPTX export.',
  openGraph: {
    type: 'website',
    siteName: 'SlideForge AI',
    title: 'SlideForge AI — AI-Powered Presentation Builder',
    description:
      'Create beautiful presentations from natural language prompts with AI-powered layout selection, content generation, and pixel-perfect PPTX export.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <StoreProvider>
            <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
