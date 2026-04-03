/**
 * Rate limiting for AI operations.
 * Tracks usage via the User model's aiCreditsUsed field.
 */

import { prisma } from '@/lib/db';
import { AI_CREDITS_LIMIT, AI_CREDITS_COST } from '@/types/ai';

export interface RateLimitResult {
  allowed: boolean;
  creditsUsed: number;
  creditsLimit: number;
  creditsRemaining: number;
}

/**
 * Check if a user has enough AI credits for an operation.
 * Does NOT consume credits — call consumeCredits after the operation succeeds.
 */
export async function checkRateLimit(
  userId: string,
  operation: string,
): Promise<RateLimitResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiCreditsUsed: true, plan: true },
  });

  if (!user) {
    return {
      allowed: false,
      creditsUsed: 0,
      creditsLimit: 0,
      creditsRemaining: 0,
    };
  }

  const limit = AI_CREDITS_LIMIT[user.plan] ?? AI_CREDITS_LIMIT['FREE'] ?? 50;
  const cost = AI_CREDITS_COST[operation] ?? 1;
  const remaining = limit - user.aiCreditsUsed;
  const allowed = remaining >= cost;

  return {
    allowed,
    creditsUsed: user.aiCreditsUsed,
    creditsLimit: limit,
    creditsRemaining: remaining,
  };
}

/**
 * Consume AI credits for a completed operation.
 * Should be called after the AI operation succeeds.
 */
export async function consumeCredits(
  userId: string,
  operation: string,
): Promise<void> {
  const cost = AI_CREDITS_COST[operation] ?? 1;

  await prisma.user.update({
    where: { id: userId },
    data: {
      aiCreditsUsed: { increment: cost },
    },
  });
}
