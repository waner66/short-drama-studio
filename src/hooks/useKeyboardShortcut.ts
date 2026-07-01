'use client';

import { useEffect, useCallback } from 'react';

type ModKey = 'ctrl' | 'alt' | 'shift' | 'meta';

interface ShortcutDef {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: () => void;
  description?: string;
  /** Only fire when no input/textarea is focused */
  preventInInput?: boolean;
}

/**
 * Register keyboard shortcuts.
 * Usage:
 *   useKeyboardShortcuts([
 *     { key: 's', ctrl: true, handler: handleSave, description: '保存' },
 *     { key: 'Enter', ctrl: true, handler: handleSaveAndContinue, description: '保存并继续' },
 *   ]);
 *
 * Shortcuts are automatically cleaned up on unmount.
 * When preventInInput is true (default), shortcuts won't fire inside inputs/textareas.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutDef[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        const modMatch =
          (!s.ctrl || (e.ctrlKey || e.metaKey)) &&
          (!s.alt || e.altKey) &&
          (!s.shift || e.shiftKey) &&
          (!s.meta || e.metaKey);

        if (!modMatch) continue;
        if (e.key.toLowerCase() !== s.key.toLowerCase()) continue;

        // Skip if inside input/textarea and preventInInput is true
        if (s.preventInInput !== false) {
          const tag = (e.target as HTMLElement)?.tagName;
          const isEditable =
            tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
            (e.target as HTMLElement)?.isContentEditable;
          if (isEditable) continue;
        }

        e.preventDefault();
        s.handler();
        return; // Only fire the first matching shortcut
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
