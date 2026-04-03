'use client';

import { useState, useCallback } from 'react';
import {
  Globe,
  Lock,
  Copy,
  Check,
  Code,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ShareDialogProps {
  presentationId: string;
  isPublic: boolean;
  shareSlug: string | null;
  trigger: React.ReactNode;
}

export function ShareDialog({
  presentationId,
  isPublic: initialPublic,
  shareSlug: initialSlug,
  trigger,
}: ShareDialogProps) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [shareSlug, setShareSlug] = useState(
    initialSlug ?? presentationId.slice(0, 12),
  );
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/share/${shareSlug}`
      : `/share/${shareSlug}`;

  const embedCode = `<iframe src="${shareUrl}?embed=true" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;

  const handleTogglePublic = useCallback(
    async (checked: boolean) => {
      setIsPublic(checked);
      setSaving(true);
      try {
        await fetch(`/api/presentations/${presentationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isPublic: checked,
            shareSlug: checked ? shareSlug : shareSlug,
          }),
        });
      } catch {
        setIsPublic(!checked);
      } finally {
        setSaving(false);
      }
    },
    [presentationId, shareSlug],
  );

  async function handleSavePassword(): Promise<void> {
    if (!password.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/presentations/${presentationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: { sharePassword: password.trim() },
        }),
      });
      setPassword('');
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  }

  function handleCopy(text: string, type: 'link' | 'embed'): void {
    void navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share presentation</DialogTitle>
          <DialogDescription>
            Control who can see your presentation and how they access it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Public toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <Globe className="h-5 w-5 text-green-500" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {isPublic ? 'Public' : 'Private'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isPublic
                    ? 'Anyone with the link can view'
                    : 'Only you can access'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => void handleTogglePublic(checked)}
                disabled={saving}
                aria-label="Toggle public access"
              />
            </div>
          </div>

          {isPublic && (
            <>
              <Separator />

              {/* Share link */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Share Link
                </Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(shareUrl, 'link')}
                    aria-label="Copy share link"
                  >
                    {copied === 'link' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password protection */}
              <div className="space-y-2">
                <Label>Password Protection (optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Set a password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleSavePassword()}
                    disabled={!password.trim() || saving}
                  >
                    Set
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Visitors will need this password to view the presentation.
                </p>
              </div>

              <Separator />

              {/* Embed code */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Embed Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={embedCode}
                    readOnly
                    className="text-xs font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(embedCode, 'embed')}
                    aria-label="Copy embed code"
                  >
                    {copied === 'embed' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
