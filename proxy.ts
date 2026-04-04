import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/editor(.*)',
  '/api/presentations(.*)',
  '/api/sections(.*)',
  '/api/export(.*)',
  '/api/ai(.*)',
  '/api/user(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/pricing',
  '/privacy',
  '/terms',
  '/login(.*)',
  '/register(.*)',
  '/share/(.*)',
  '/present/(.*)',
  '/api/themes',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
