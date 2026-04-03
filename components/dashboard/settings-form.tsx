'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Key,
  CreditCard,
  Settings2,
  Shield,
  Loader2,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plan: string;
  aiCreditsUsed: number;
}

interface SettingsFormProps {
  user: UserProfile;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();

  // Profile
  const [name, setName] = useState(user.name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // API Keys
  const [anthropicKey, setAnthropicKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [keysSaved, setKeysSaved] = useState(false);

  // Preferences
  const [defaultTheme, setDefaultTheme] = useState('minimal-light');
  const [defaultProvider, setDefaultProvider] = useState('anthropic');
  const [autoSaveInterval, setAutoSaveInterval] = useState('30');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Delete account
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile(): Promise<void> {
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        setProfileSaved(true);
        router.refresh();
        setTimeout(() => setProfileSaved(false), 2000);
      }
    } catch {
      // fail silently
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveKeys(): Promise<void> {
    setSavingKeys(true);
    setKeysSaved(false);
    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anthropicKey: anthropicKey.trim() || undefined,
          openaiKey: openaiKey.trim() || undefined,
          googleKey: googleKey.trim() || undefined,
        }),
      });
      if (res.ok) {
        setKeysSaved(true);
        setTimeout(() => setKeysSaved(false), 2000);
      }
    } catch {
      // fail silently
    } finally {
      setSavingKeys(false);
    }
  }

  async function handleSavePreferences(): Promise<void> {
    setSavingPrefs(true);
    setPrefsSaved(false);
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultTheme,
          defaultProvider,
          autoSaveInterval: parseInt(autoSaveInterval, 10),
        }),
      });
      if (res.ok) {
        setPrefsSaved(true);
        setTimeout(() => setPrefsSaved(false), 2000);
      }
    } catch {
      // fail silently
    } finally {
      setSavingPrefs(false);
    }
  }

  async function handleDeleteAccount(): Promise<void> {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      const res = await fetch('/api/user/account', { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/';
      }
    } catch {
      // fail silently
    } finally {
      setDeleting(false);
    }
  }

  const planLabel =
    user.plan === 'TEAM' ? 'Team' : user.plan === 'PRO' ? 'Pro' : 'Free';
  const creditLimit = user.plan === 'TEAM' ? 1000 : user.plan === 'PRO' ? 200 : 20;

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <Separator />
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Name</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>
          <Button
            onClick={() => void handleSaveProfile()}
            disabled={savingProfile || name.trim() === (user.name ?? '')}
            className="w-fit gap-2"
          >
            {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
            {profileSaved && <Check className="h-4 w-4" />}
            {profileSaved ? 'Saved' : 'Save Profile'}
          </Button>
        </div>
      </section>

      {/* AI Provider Keys Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Provider Keys</h2>
        </div>
        <Separator />
        <p className="text-sm text-muted-foreground">
          Provide your own API keys to use your own AI credits. Keys are encrypted
          and stored securely.
        </p>
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="anthropic-key">Anthropic API Key</Label>
            <div className="relative">
              <Input
                id="anthropic-key"
                type={showKeys ? 'text' : 'password'}
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type={showKeys ? 'text' : 'password'}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="google-key">Google AI API Key</Label>
            <Input
              id="google-key"
              type={showKeys ? 'text' : 'password'}
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              placeholder="AIza..."
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              className="gap-2"
              type="button"
            >
              {showKeys ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showKeys ? 'Hide' : 'Show'} Keys
            </Button>
            <Button
              onClick={() => void handleSaveKeys()}
              disabled={savingKeys}
              className="gap-2"
            >
              {savingKeys && <Loader2 className="h-4 w-4 animate-spin" />}
              {keysSaved && <Check className="h-4 w-4" />}
              {keysSaved ? 'Saved' : 'Save Keys'}
            </Button>
          </div>
        </div>
      </section>

      {/* Plan & Usage Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Plan & Usage</h2>
        </div>
        <Separator />
        <div className="rounded-lg border p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-lg">{planLabel} Plan</p>
              <p className="text-sm text-muted-foreground">
                {user.plan === 'FREE'
                  ? 'Basic features with limited AI credits'
                  : user.plan === 'PRO'
                    ? 'Unlimited presentations with expanded AI credits'
                    : 'Full team collaboration with maximum AI credits'}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Current
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">AI Credits Used</span>
              <span className="font-medium">
                {user.aiCreditsUsed} / {creditLimit}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${String(Math.min(100, (user.aiCreditsUsed / creditLimit) * 100))}%`,
                }}
              />
            </div>
          </div>
          {user.plan === 'FREE' && (
            <Button className="w-full mt-4" variant="outline">
              Upgrade to Pro
            </Button>
          )}
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Preferences</h2>
        </div>
        <Separator />
        <div className="grid gap-4 max-w-md">
          <div className="space-y-2">
            <Label>Default Theme</Label>
            <Select value={defaultTheme} onValueChange={setDefaultTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal-light">Minimal Light</SelectItem>
                <SelectItem value="modern-dark">Modern Dark</SelectItem>
                <SelectItem value="corporate-blue">Corporate Blue</SelectItem>
                <SelectItem value="sunset-warm">Sunset Warm</SelectItem>
                <SelectItem value="ocean-breeze">Ocean Breeze</SelectItem>
                <SelectItem value="forest-green">Forest Green</SelectItem>
                <SelectItem value="royal-purple">Royal Purple</SelectItem>
                <SelectItem value="neon-nights">Neon Nights</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default AI Provider</Label>
            <Select value={defaultProvider} onValueChange={setDefaultProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="google">Google (Gemini)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Auto-save Interval</Label>
            <Select value={autoSaveInterval} onValueChange={setAutoSaveInterval}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Every 10 seconds</SelectItem>
                <SelectItem value="30">Every 30 seconds</SelectItem>
                <SelectItem value="60">Every 60 seconds</SelectItem>
                <SelectItem value="120">Every 2 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => void handleSavePreferences()}
            disabled={savingPrefs}
            className="w-fit gap-2"
          >
            {savingPrefs && <Loader2 className="h-4 w-4 animate-spin" />}
            {prefsSaved && <Check className="h-4 w-4" />}
            {prefsSaved ? 'Saved' : 'Save Preferences'}
          </Button>
        </div>
      </section>

      {/* Account Actions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold">Danger Zone</h2>
        </div>
        <Separator />
        <div className="rounded-lg border border-destructive/30 p-6 max-w-md">
          <h3 className="font-semibold text-destructive">Delete Account</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all presentations, and all
              associated data. Type <strong>DELETE</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder='Type "DELETE" to confirm'
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteAccount()}
              disabled={deleteConfirm !== 'DELETE' || deleting}
            >
              {deleting ? 'Deleting...' : 'Permanently Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
