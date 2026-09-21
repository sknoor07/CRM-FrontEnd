"use client";

import { Card } from "@/components/ui/card";
import { AssignedJobListItem } from "@/features/transport-team/types/transport-team.types";
import { getOnsiteRepairPhase } from "@/features/transport-team/utils/onsite-repair-phase";
import { cn } from "cn";
import { ChevronRight, Package, Phone, User, Wrench } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface JobCardProps {
  item: AssignedJobListItem;
  isSelected: boolean;
  onSelect: (jobId: string) => void;
}

export function JobCard({ item, isSelected, onSelect }: JobCardProps) {
  const { job, customer, jobItems } = item;
  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`.trim()
    : "Unknown customer";

  const { readyForCompletion } = useMemo(
    () => getOnsiteRepairPhase(jobItems),
    [jobItems],
  );

  // Respect the OS-level "reduce motion" setting — show the same
  // information, just without the looping pulse/glow.
  const reduceMotion = useReducedMotion();

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(job.id);
      }}
      className={cn(
        "relative cursor-pointer gap-1.5 overflow-hidden p-3 m-1 shadow-sm transition-all hover:shadow-md",
        isSelected
          ? "border-l-4 border-l-primary bg-primary/5 shadow-md"
          : readyForCompletion
            ? "border-l-4 border-l-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5"
            : "hover:bg-muted/40",
      )}
    >
      {readyForCompletion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={reduceMotion ? { opacity: 0.15 } : { opacity: [0, 0.45, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            background:
              "radial-gradient(140px 70px at 0% 50%, rgba(16,185,129,0.18), transparent 70%)",
          }}
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="font-heading text-sm font-semibold">
          {job.jobNumber}
        </span>

        <div className="flex items-center gap-1.5">
          {readyForCompletion && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                {!reduceMotion && (
                  <motion.span
                    className="absolute inline-block h-full w-full rounded-full bg-emerald-500"
                    animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              CS Approved
            </motion.span>
          )}

          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              isSelected && "translate-x-0.5 text-primary",
            )}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{customerName}</span>
        </div>

        {customer?.phone && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{customer.phone}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5 shrink-0" />
            <span>
              {jobItems.length} {jobItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {readyForCompletion && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Wrench className="h-3 w-3" />
              Ready to complete
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}