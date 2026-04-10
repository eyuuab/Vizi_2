import type { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/dashboard/settings-form';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences.',
};

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const user = await currentUser();
  const userName = user?.firstName || user?.username || null;
  const userEmail = user?.emailAddresses[0]?.emailAddress || '';
  const userImage = user?.imageUrl || null;

  let userProfile = {
    id: userId,
    name: userName,
    email: userEmail,
    image: userImage,
    plan: 'FREE' as string,
    aiCreditsUsed: 0,
  };

  try {
    const dbUser = await prisma.userMetadata.findUnique({
      where: { clerkUserId: userId },
      select: {
        plan: true,
        aiCreditsUsed: true,
      },
    });
    if (dbUser) {
      userProfile = {
        ...userProfile,
        plan: dbUser.plan,
        aiCreditsUsed: dbUser.aiCreditsUsed,
      };
    }
  } catch {
    // Database might not be available
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account, preferences, and API keys
        </p>
      </div>
      <SettingsForm user={userProfile} />
    </div>
  );
}
