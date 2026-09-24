"use client";

import { motion } from "framer-motion";
import {
  Check,
  Clock3,
  Mail,
  UserRound,
} from "lucide-react";

import { JobItemStatusHistory } from "@/features/cs/types/job-details.types";

interface ItemTimelineProps {
  history: JobItemStatusHistory[];
}

function formatStatus(status: string | null) {
  if (!status) return "Created";

  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ItemTimeline({
  history,
}: ItemTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-4">
        <p className="text-sm text-muted-foreground">
          No status history recorded for this item.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-muted-foreground" />

        <h4 className="text-sm font-semibold">
          Item Timeline
        </h4>
      </div>

      <div className="relative">
        {history.map((entry, index) => {
          const isLast = index === history.length - 1;

          return (
            <motion.div
              key={entry.id}
              initial={{
                opacity: 0,
                x: -8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.25,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className="relative flex gap-4"
            >
              {!isLast && (
                <div className="absolute left-[11px] top-7 h-[calc(100%-4px)] w-px bg-border" />
              )}

              <div
                className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background ${
                  isLast
                    ? "border-primary"
                    : "border-border"
                }`}
              >
                {isLast ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                  />
                ) : (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1 pb-7">
                <div className="flex flex-col gap-1">
                  <h5 className="text-sm font-semibold">
                    {formatStatus(entry.newStatus)}
                  </h5>

                  {entry.previousStatus && (
                    <p className="text-xs text-muted-foreground">
                      {formatStatus(entry.previousStatus)} →{" "}
                      {formatStatus(entry.newStatus)}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>

                {entry.changedBy && (
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <UserRound className="h-3.5 w-3.5 shrink-0" />

                      <span className="font-medium text-foreground">
                        {entry.changedBy.name ||
                          "Unknown user"}
                      </span>

                      {entry.changedBy.userType && (
                        <span>
                          ·{" "}
                          {entry.changedBy.userType ===
                          "employee"
                            ? "Employee"
                            : "Customer"}
                        </span>
                      )}
                    </div>

                    {entry.changedBy.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />

                        <span className="break-all">
                          {entry.changedBy.email}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {entry.note && (
                  <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                    {entry.note}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}