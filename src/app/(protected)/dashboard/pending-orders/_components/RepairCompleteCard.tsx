// src/app/(protected)/dashboard/pending-orders/_components/RepairCompleteCard.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFinishOnsiteRepair } from "@/features/transport-team/hooks/useFinishOnsiteRepair";
import { JobItem } from "@/features/transport-team/types/transport-team.types";
import { CheckCircle2, Loader2, Wrench } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface RepairCompleteCardProps {
  jobId: string;
  items: JobItem[];
  onCompleted: () => void;
}

export function RepairCompleteCard({
  jobId,
  items,
  onCompleted,
}: RepairCompleteCardProps) {
  const [comment, setComment] = useState("");
  const [confirming, setConfirming] = useState(false);
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { submit, isSubmitting } = useFinishOnsiteRepair();

  const repairingItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.repairLocation === "customer_site" &&
          item.currentStatus === "repair_started",
      ),
    [items],
  );

  const handleCompleteClick = () => {
    if (isSubmitting) return;

    // Two-step confirm: first tap arms the button,
    // second tap (within 4s) actually submits.
    if (!confirming) {
      setConfirming(true);
      confirmTimer.current = setTimeout(() => setConfirming(false), 4000);
      return;
    }

    if (confirmTimer.current) {
      clearTimeout(confirmTimer.current);
      confirmTimer.current = null;
    }

    void (async () => {
      try {
        const result = await submit({
          jobId,
          comment: comment.trim() || undefined,
        });
        toast.success(
          result.message || "Onsite repair completed successfully.",
        );
        onCompleted();
      } catch {
        setConfirming(false);
        // useFinishOnsiteRepair already toasts the error
      }
    })();
  };

  return (
    <Card className="gap-0 overflow-hidden border-emerald-500/30 p-0 shadow-sm m-1">
      {/* Header band */}
      <div className="flex items-center gap-3 border-b border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Repair in progress
          </p>
          <p className="text-xs text-muted-foreground">
            The customer has approved the quote. Finish the onsite repair.
          </p>
        </div>
      </div>

      <CardHeader className="px-4 pt-3">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Wrench className="h-4 w-4" />
          Items being repaired ({repairingItems.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        {repairingItems.length > 0 ? (
          <ul className="divide-y rounded-md border bg-muted/30">
            {repairingItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2.5 px-3 py-2.5"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {item.deviceName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.deviceCategory}
                    {item.deviceSerialNumber
                      ? ` · S/N ${item.deviceSerialNumber}`
                      : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
            No onsite items are currently marked as under repair.
          </p>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Completion note (optional)
          </label>
          <Textarea
            placeholder="e.g. Replaced the power supply unit, tested all outputs…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            className="min-h-16 text-sm"
            maxLength={2000}
          />
        </div>

        <Button
          type="button"
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          disabled={isSubmitting || repairingItems.length === 0}
          onClick={handleCompleteClick}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : confirming ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Wrench className="h-4 w-4" />
          )}
          {isSubmitting
            ? "Completing repair…"
            : confirming
              ? "Tap again to confirm completion"
              : "Repair Complete"}
        </Button>
      </CardContent>
    </Card>
  );
}
