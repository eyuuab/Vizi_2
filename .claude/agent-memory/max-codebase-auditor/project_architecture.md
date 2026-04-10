---
name: SlideForge AI Architecture Overview
description: Core architecture patterns and key file locations for the SlideForge AI presentation builder
type: project
---

SlideForge AI is a Next.js 16.2 (canary) + Clerk auth + Prisma/PostgreSQL + Redux Toolkit full-stack app for AI-generated presentations.

**Why:** Audit discovered 2026-04-10.
**How to apply:** Use this as baseline knowledge when auditing or working on this codebase.

Key architectural facts:
- Auth: Clerk (migrated from NextAuth, some remnants remain)
- State: Redux Toolkit with slices in store/slices/
- AI Pipeline: Multi-provider (Anthropic/OpenAI/Google) with 5-step pipeline in lib/ai/pipeline/
- Renderer: PPTX via pptxgenjs in lib/renderer/
- Composer: Section resolution + PPTX page splitting in lib/composer/
- 18 layout templates in lib/layouts/templates/
- 12 theme presets in lib/themes/presets/
- Middleware is in proxy.ts (NOT middleware.ts) - this may cause Clerk auth to not function
- PDF export is a stub that returns PPTX
- User preferences and API keys endpoints are stubs (validate but don't persist)
- The prisma schema uses UserMetadata (Clerk-synced) but some routes reference prisma.user (old NextAuth model)
