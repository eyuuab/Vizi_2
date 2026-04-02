import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account settings and preferences.',
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, preferences, and API keys</p>
      </div>

      {/* Profile Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <Separator />
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-sm">{session.user.name ?? 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-sm">{session.user.email}</p>
          </div>
        </div>
      </section>

      {/* AI Provider Section */}
      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold">AI Providers</h2>
        <Separator />
        <p className="text-sm text-muted-foreground">
          Configure your preferred AI provider for presentation generation. You can use the
          built-in credits or provide your own API keys.
        </p>
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          AI provider configuration will be available in a future update.
        </div>
      </section>

      {/* Billing Section */}
      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold">Billing</h2>
        <Separator />
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-muted-foreground">Basic features with limited AI credits</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Current Plan
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
