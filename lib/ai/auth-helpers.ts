/**
 * Shared auth and rate-limiting helpers for AI API routes.
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkRateLimit, consumeCredits } from '@/lib/ai/rate-limiter';
import type { RateLimitResult } from '@/lib/ai/rate-limiter';

export interface AuthResult {
  userId: string;
}

/**
 * Authenticate the request and return the user ID.
 * Returns a NextResponse error if auth fails.
 */
export async function authenticateRequest(): Promise<
  { ok: true; userId: string } | { ok: false; response: NextResponse }
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        ok: false,
        response: NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 },
        ),
      };
    }
    return { ok: true, userId: session.user.id };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: { code: 'AUTH_ERROR', message: 'Authentication failed' } },
        { status: 401 },
      ),
    };
  }
}

/**
 * Check rate limit and return error response if exceeded.
 */
export async function checkAndEnforceRateLimit(
  userId: string,
  operation: string,
): Promise<
  { ok: true; rateLimit: RateLimitResult } | { ok: false; response: NextResponse }
> {
  try {
    const rateLimit = await checkRateLimit(userId, operation);
    if (!rateLimit.allowed) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: `AI credit limit reached. Used ${String(rateLimit.creditsUsed)}/${String(rateLimit.creditsLimit)} credits.`,
              details: {
                creditsUsed: rateLimit.creditsUsed,
                creditsLimit: rateLimit.creditsLimit,
                creditsRemaining: rateLimit.creditsRemaining,
              },
            },
          },
          { status: 429 },
        ),
      };
    }
    return { ok: true, rateLimit };
  } catch {
    // If rate limit check fails, allow the request (fail open)
    return {
      ok: true,
      rateLimit: { allowed: true, creditsUsed: 0, creditsLimit: 999, creditsRemaining: 999 },
    };
  }
}

/**
 * Consume credits after a successful operation.
 * Silently fails — credit consumption should not block the response.
 */
export async function recordCreditUsage(
  userId: string,
  operation: string,
): Promise<void> {
  try {
    await consumeCredits(userId, operation);
  } catch {
    // Log in production, silently continue
    console.error(`Failed to consume credits for user ${userId}, operation: ${operation}`);
  }
}
