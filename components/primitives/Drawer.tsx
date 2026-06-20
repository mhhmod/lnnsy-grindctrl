"use client";

import { useRef, useEffect, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Close } from "@/components/icons";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
}

/**
 * Order-detail drawer using a native <dialog> element.
 *
 * A11y — native <dialog> provides:
 * - Focus trap: browser keeps focus inside the dialog while open
 * - Escape key: closes the dialog (browser fires a "close" event)
 * - ::backdrop: scrim layered below the dialog via CSS in app/globals.css
 * - aria-modal is set to reinforce the modal role for AT
 *
 * The dialog is pinned to the inline-end edge (inset-inline-end: 0),
 * full-height via CSS, and slides in on open with a CSS transform animation.
 * prefers-reduced-motion: the slide animation is disabled; dialog appears
 * instantly.
 *
 * The dialog's own "close" event (fired by Escape or .close()) calls
 * onOpenChange(false) so React state stays in sync.
 */
export function Drawer({ open, onOpenChange, title, children }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync dialog open/close state with React prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Listen for native close event (Escape key, or dialog.close())
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onOpenChange(false);
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-label={title ?? "Drawer"}
      className={cx(
        // Positioning: full height, pinned to inline-end, paper bg
        "drawer-panel",
        "m-0 h-full max-h-full w-full max-w-md",
        "bg-paper text-ink border-s border-hairline",
        "rounded-none p-0",
        // Focus ring reset inside dialog
        "focus:outline-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
        {title && (
          <h2 className="font-display text-base font-semibold text-ink leading-snug">
            {title}
          </h2>
        )}
        <button
          type="button"
          aria-label="Close drawer"
          onClick={() => {
            dialogRef.current?.close();
          }}
          className={cx(
            "ms-auto flex h-8 w-8 items-center justify-center rounded-sm",
            "text-muted-warm hover:text-ink hover:bg-wash",
            "transition-colors duration-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-warm focus-visible:ring-offset-0"
          )}
        >
          <Close size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {children}
      </div>
    </dialog>
  );
}
