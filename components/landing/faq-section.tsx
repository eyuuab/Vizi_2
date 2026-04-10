'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How does the AI presentation generation work?',
    answer:
      'Simply describe your presentation topic, audience, and goals in plain English. Our AI analyzes your prompt, builds a structured narrative outline, selects the best layout for each section, generates polished content, and applies a cohesive visual theme — all in under a minute.',
  },
  {
    question: 'Can I edit slides after the AI generates them?',
    answer:
      'Absolutely. The visual editor gives you full control — edit text inline with rich formatting, swap layouts with one click, drag and drop to reorder sections, adjust theme colors and typography, replace images, and override styles per-section. Think of the AI as a first draft that you refine.',
  },
  {
    question: 'What export formats are supported?',
    answer:
      'You can export your presentations as pixel-perfect PowerPoint (.pptx) files that open flawlessly in Microsoft PowerPoint and Google Slides. You can also share presentations via a public link with optional password protection.',
  },
  {
    question: 'Which AI models do you use?',
    answer:
      'Vizi2 supports multiple AI providers including OpenAI (GPT-4o), Anthropic (Claude), and Google (Gemini). Pro users get access to priority models for faster, higher-quality generation. You can also bring your own API keys.',
  },
  {
    question: 'Is my data secure and private?',
    answer:
      'Yes. Your presentations are stored securely and are private by default. We use encrypted connections, and your content is only processed to generate your slides — we never use your data to train AI models or share it with third parties.',
  },
  {
    question: 'How many presentations can I create on the free plan?',
    answer:
      'The free plan includes up to 5 presentations with 20 AI generations per month, access to all 12 built-in themes, and full PPTX export. No credit card required to get started.',
  },
  {
    question: 'Can I use custom themes and branding?',
    answer:
      'Pro and Team plans include full theme customization — adjust colors, fonts, spacing, and create brand-consistent templates. Team plans add custom branding with your logo and company color palette across all presentations.',
  },
  {
    question: 'Do you support team collaboration?',
    answer:
      'Team plans include real-time collaboration features, shared template libraries, an admin dashboard for managing team members, and SSO integration for enterprise security. Contact sales for details on team pricing.',
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="py-24 sm:py-32 border-t section-mesh-2">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-base font-semibold leading-7 text-primary mb-2">
            FAQ
          </h2>
          <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Vizi2
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border/60 px-1"
              >
                <AccordionTrigger className="faq-trigger py-5 text-left text-base font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
