"use client";

import { ReactNode } from "react";
import { Inbox, Loader2 } from "lucide-react";

interface DashboardSectionProps {
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  error?: string | null;
  children?: ReactNode;
}

export function DashboardSection({
  id,
  title,
  description,
  action,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "Nothing here right now.",
  error,
  children,
}: DashboardSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-xl border bg-white shadow-sm"
    >
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 border-b px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      {/* Body */}
      <div className="px-6 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <Inbox className="h-8 w-8 opacity-40" />
            <span className="text-sm">{emptyMessage}</span>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
