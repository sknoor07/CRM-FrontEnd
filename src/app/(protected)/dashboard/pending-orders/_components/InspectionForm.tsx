// src/app/(protected)/dashboard/pending-orders/_components/InspectionForm.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCompleteTransportInspection } from "@/features/transport-team/hooks/useCompleteTransportInspection";
import {
  InspectionDecision,
  JobItem,
} from "@/features/transport-team/types/transport-team.types";
import { Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { InspectionItemCard } from "./InspectionItemCard";

interface InspectionFormProps {
  jobId: string;
  items: JobItem[];
  onSubmitted: () => void;
}

export function InspectionForm({
  jobId,
  items,
  onSubmitted,
}: InspectionFormProps) {
  const [decisions, setDecisions] = useState<
    Record<string, InspectionDecision | undefined>
  >({});
  const [itemComments, setItemComments] = useState<Record<string, string>>({});
  const [jobComment, setJobComment] = useState("");

  const { submit, isSubmitting } = useCompleteTransportInspection();

  const allDecided = useMemo(
    () => items.length > 0 && items.every((item) => decisions[item.id]),
    [items, decisions],
  );

  const handleSubmit = async () => {
    if (!allDecided || isSubmitting) return;

    try {
      const result = await submit({
        jobId,
        comment: jobComment.trim() || undefined,
        items: items.map((item) => ({
          jobItemId: item.id,
          decision: decisions[item.id] as InspectionDecision,
          comment: itemComments[item.id]?.trim() || undefined,
        })),
      });

      toast.success(result.message || "Inspection submitted successfully.");
      onSubmitted();
    } catch {
      // useCompleteTransportInspection already toasts the error
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Inspection Report</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <InspectionItemCard
            key={item.id}
            item={item}
            decision={decisions[item.id]}
            comment={itemComments[item.id] ?? ""}
            onDecisionChange={(decision) =>
              setDecisions((prev) => ({ ...prev, [item.id]: decision }))
            }
            onCommentChange={(comment) =>
              setItemComments((prev) => ({ ...prev, [item.id]: comment }))
            }
            disabled={isSubmitting}
          />
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Job-level comment (optional)
        </label>
        <Textarea
          placeholder="Anything that applies to the whole job…"
          value={jobComment}
          onChange={(e) => setJobComment(e.target.value)}
          disabled={isSubmitting}
          className="min-h-16 text-sm"
          maxLength={2000}
        />
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={!allDecided || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit Inspection
      </Button>
    </div>
  );
}
