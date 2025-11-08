"use client";

import { useEffect } from "react";
import { ChatKitPanel } from "./ChatKitPanel";
import type { ColorScheme } from "@/hooks/useColorScheme";

interface ChatKitPopupProps {
  open: boolean;
  objectiveTitle: string;
  onClose: () => void;
  theme: ColorScheme;
  onThemeChange: (scheme: ColorScheme) => void;
}

export function ChatKitPopup({
  open,
  objectiveTitle,
  onClose,
  theme,
  onThemeChange,
}: ChatKitPopupProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6"
    >
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Socratic Discussion
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Objective: {objectiveTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-200 px-4 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Close
          </button>
        </div>
        <div className="flex-1 bg-white p-4 dark:bg-slate-900">
          <ChatKitPanel
            key={objectiveTitle}
            theme={theme}
            onWidgetAction={async () => {}}
            onResponseEnd={() => {}}
            onThemeRequest={onThemeChange}
            objective={objectiveTitle}
          />
        </div>
      </div>
    </div>
  );
}
