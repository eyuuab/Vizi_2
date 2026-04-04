import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

/**
 * Get the current server session with Clerk.
 * Use this in Server Components and API routes.
 */
export async function getServerSession() {
  const { userId } = await auth();
  if (!userId) return null;

  return { user: { id: userId } };
}

/**
 * Require authentication. Throws if no session.
 * Use this in protected API routes and Server Actions.
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return { user: { id: userId } };
}

/**
 * Get or create user metadata for the current Clerk user.
 * This ensures user metadata exists in the database.
 */
export async function getUserMetadata() {
  const { userId } = await auth();
  if (!userId) return null;

  const metadata = await prisma.userMetadata.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      plan: 'FREE',
      aiCreditsUsed: 0,
    },
    update: {},
  });

  return metadata;
}

/**
 * Get the current Clerk user with full profile data.
 */
export async function getClerkUser() {
  return await currentUser();
}
