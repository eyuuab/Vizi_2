import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { SettingsForm } from '@/components/dashboard/settings-form';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences.',
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  let userProfile = {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? '',
    image: session.user.image ?? null,
    plan: 'FREE' as string,
    aiCreditsUsed: 0,
  };

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        aiCreditsUsed: true,
      },
    });
    if (dbUser) {
      userProfile = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
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
