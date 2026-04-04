import Link from 'next/link';
import { Sparkles, LayoutGrid, BookTemplate, Settings, LogOut } from 'lucide-react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Presentations', icon: LayoutGrid },
  { href: '/dashboard/templates', label: 'Templates', icon: BookTemplate },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/login');
  }

  const user = await currentUser();
  const userName = user?.firstName || user?.username || 'User';
  const userEmail = user?.emailAddresses[0]?.emailAddress || '';
  const userImage = user?.imageUrl;

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-card">
        <div className="flex h-16 items-center gap-2 px-6">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">SlideForge</span>
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator />
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
          <form
            action={async () => {
              'use server';
              const { signOut } = await import('@clerk/nextjs/server');
              await signOut({ redirectUrl: '/' });
            }}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8" type="submit">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
