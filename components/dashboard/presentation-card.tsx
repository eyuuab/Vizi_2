'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Globe,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface PresentationCardData {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  shareSlug: string | null;
  thumbnail: string | null;
  updatedAt: string;
  sectionCount: number;
}

interface PresentationCardProps {
  presentation: PresentationCardData;
  view: 'grid' | 'list';
}

export function PresentationCard({ presentation, view }: PresentationCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  async function handleDelete(): Promise<void> {
    setDeleting(true);
    try {
      const res = await fetch(`/api/presentations/${presentation.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Silently fail, UI will stay intact
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  async function handleDuplicate(): Promise<void> {
    setDuplicating(true);
    try {
      const res = await fetch(`/api/presentations/${presentation.id}/duplicate`, {
        method: 'POST',
      });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // Silently fail
    } finally {
      setDuplicating(false);
    }
  }

  async function handleTogglePublic(): Promise<void> {
    try {
      const newSlug = !presentation.isPublic
        ? presentation.shareSlug ?? presentation.id.slice(0, 12)
        : presentation.shareSlug;
      await fetch(`/api/presentations/${presentation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublic: !presentation.isPublic,
          shareSlug: newSlug,
        }),
      });
      router.refresh();
    } catch {
      // Silently fail
    }
  }

  const formattedDate = new Date(presentation.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (view === 'list') {
    return (
      <>
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
          <Link
            href={`/editor/${presentation.id}`}
            className="flex flex-1 items-center gap-4 min-w-0"
          >
            <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded bg-muted">
              {presentation.thumbnail ? (
                <img
                  src={presentation.thumbnail}
                  alt=""
                  className="h-full w-full rounded object-cover"
                />
              ) : (
                <FileText className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{presentation.title}</h3>
              {presentation.description && (
                <p className="truncate text-sm text-muted-foreground">
                  {presentation.description}
                </p>
              )}
            </div>
            <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
              <span>{presentation.sectionCount} slides</span>
              <span>{formattedDate}</span>
              {presentation.isPublic ? (
                <Globe className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
          </Link>
          <CardActions
            onEdit={() => router.push(`/editor/${presentation.id}`)}
            onDuplicate={handleDuplicate}
            onDelete={() => setDeleteOpen(true)}
            onTogglePublic={handleTogglePublic}
            isPublic={presentation.isPublic}
            duplicating={duplicating}
            shareSlug={presentation.shareSlug}
          />
        </div>

        <DeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          deleting={deleting}
          title={presentation.title}
        />
      </>
    );
  }

  return (
    <>
      <div className="group relative rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden">
        <Link href={`/editor/${presentation.id}`}>
          <div className="aspect-video bg-muted flex items-center justify-center">
            {presentation.thumbnail ? (
              <img
                src={presentation.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/editor/${presentation.id}`} className="min-w-0 flex-1">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {presentation.title}
              </h3>
              {presentation.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                  {presentation.description}
                </p>
              )}
            </Link>
            <CardActions
              onEdit={() => router.push(`/editor/${presentation.id}`)}
              onDuplicate={handleDuplicate}
              onDelete={() => setDeleteOpen(true)}
              onTogglePublic={handleTogglePublic}
              isPublic={presentation.isPublic}
              duplicating={duplicating}
              shareSlug={presentation.shareSlug}
            />
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span>{presentation.sectionCount} slides</span>
            <span aria-hidden="true">&middot;</span>
            <span>{formattedDate}</span>
            {presentation.isPublic && (
              <>
                <span aria-hidden="true">&middot;</span>
                <Globe className="h-3 w-3 text-green-500" />
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        deleting={deleting}
        title={presentation.title}
      />
    </>
  );
}

function CardActions({
  onEdit,
  onDuplicate,
  onDelete,
  onTogglePublic,
  isPublic,
  duplicating,
  shareSlug,
}: {
  onEdit: () => void;
  onDuplicate: () => Promise<void>;
  onDelete: () => void;
  onTogglePublic: () => Promise<void>;
  isPublic: boolean;
  duplicating: boolean;
  shareSlug: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          aria-label="Presentation actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void onDuplicate()} disabled={duplicating}>
          <Copy className="mr-2 h-4 w-4" />
          {duplicating ? 'Duplicating...' : 'Duplicate'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => void onTogglePublic()}>
          {isPublic ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Make Private
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Make Public
            </>
          )}
        </DropdownMenuItem>
        {isPublic && shareSlug && (
          <DropdownMenuItem asChild>
            <a href={`/share/${shareSlug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Page
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  deleting,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  deleting: boolean;
  title: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete presentation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{title}&quot;? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void onConfirm()}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
