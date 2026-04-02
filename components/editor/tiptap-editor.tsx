'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TiptapEditorProps {
  content: string;
  placeholder?: string;
  maxLength?: number;
  isHeading?: boolean;
  className?: string;
  onUpdate: (html: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * Rich text editor using Tiptap. Inline editing with floating toolbar.
 * Supports markdown shortcuts and character limits.
 */
export function TiptapEditor({
  content,
  placeholder = 'Start typing...',
  maxLength,
  isHeading = false,
  className,
  onUpdate,
  onFocus,
  onBlur,
}: TiptapEditorProps): React.JSX.Element {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const [isFocused, setIsFocused] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      ...(maxLength !== undefined
        ? [CharacterCount.configure({ limit: maxLength })]
        : []),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--sf-color-accent)] underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: cn(
          'outline-none min-h-[1em]',
          isHeading && 'text-[var(--sf-text-4xl)] font-bold font-[var(--sf-font-heading)]',
          !isHeading && 'font-[var(--sf-font-body)]',
          className,
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onUpdateRef.current(ed.getHTML());
    },
    onFocus: () => {
      setIsFocused(true);
      onFocus?.();
    },
    onBlur: () => {
      // Delay to allow toolbar clicks
      setTimeout(() => {
        setIsFocused(false);
      }, 200);
      onBlur?.();
    },
  });

  // Update content from external changes (e.g., undo/redo)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link')['href'] as string | undefined;
    const url = window.prompt('Enter URL:', previousUrl ?? '');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className={cn('text-muted-foreground italic', className)}>
        {placeholder}
      </div>
    );
  }

  const characterCount = editor.storage['characterCount'] as
    | { characters: () => number }
    | undefined;
  const currentChars = characterCount?.characters() ?? 0;

  return (
    <div className="relative group">
      {/* Floating toolbar - appears when editor is focused */}
      {isFocused && (
        <div
          ref={toolbarRef}
          className="absolute -top-10 left-0 z-50 flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-md"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link">
            <LinkIcon className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </ToolbarButton>

          <div className="mx-0.5 h-5 w-px bg-border" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} />

      {maxLength !== undefined && (
        <div
          className={cn(
            'absolute bottom-0 right-0 text-xs opacity-0 group-focus-within:opacity-100 transition-opacity',
            currentChars > maxLength * 0.9 ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {currentChars}/{maxLength}
        </div>
      )}
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps): React.JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', active && 'bg-accent text-accent-foreground')}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );
}
