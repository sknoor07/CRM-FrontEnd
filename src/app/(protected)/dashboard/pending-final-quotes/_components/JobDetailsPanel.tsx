"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  FinalQuoteComponentInput,
  FinalQuoteItemInput,
  PendingFinalQuoteJob,
} from "@/features/cs/types/cs.types";

import { useGetQuoteForJob } from "@/features/cs/hooks/useGetQuoteForJob";
import { useSubmitFinalQuote } from "@/features/cs/hooks/useSubmitFinalQuote";
import { QuoteAdjustments } from "./QuoteAdjustments";
import { QuoteItemCard } from "./QuoteItemCard";

export interface ItemDraft {
  jobItemId: string;
  components: FinalQuoteComponentInput[];
  serviceCharge?: number;
  comment: string;
}

interface JobDetailsPanelProps {
  jobId: string;
  job: PendingFinalQuoteJob | null;
  onBack: () => void;
  onSubmitted: () => void;
}

export function JobDetailsPanel({
  jobId,
  job,
  onBack,
  onSubmitted,
}: JobDetailsPanelProps) {
  const { data: quoteDetails, isLoading: isQuoteLoading } =
    useGetQuoteForJob(jobId);
  const { submit, isSubmitting } = useSubmitFinalQuote();

  const [drafts, setDrafts] = useState<Record<string, ItemDraft>>({});
  const [jobComment, setJobComment] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);

  // Pre-fill drafts once we know both the job items and any previous quote lines
  useEffect(() => {
    if (!job) return;

    const next: Record<string, ItemDraft> = {};
    for (const item of job.items) {
      const previous = quoteDetails?.items.find((i) => i.jobItemId === item.id);
      const previousComponents: FinalQuoteComponentInput[] =
        previous?.lines.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          unitPrice: Number(line.unitPrice),
        })) ?? [];

      next[item.id] = {
        jobItemId: item.id,
        components: previousComponents,
        serviceCharge:
          item.currentStatus !== "pending_final_quote"
            ? Number(item.serviceChargeApplied ?? 0)
            : undefined,
        comment: "",
      };
    }
    setDrafts(next);

    if (quoteDetails?.quote) {
      setDiscount(Number(quoteDetails.quote.discount));
      setGst(Number(quoteDetails.quote.tax));
    }
  }, [job, quoteDetails]);

  const subtotalPreview = useMemo(
    () =>
      Object.values(drafts).reduce(
        (sum, draft) =>
          sum +
          draft.components.reduce((s, c) => s + c.quantity * c.unitPrice, 0),
        0,
      ),
    [drafts],
  );

  if (!job) return null;

  const updateDraft = (jobItemId: string, patch: Partial<ItemDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [jobItemId]: { ...prev[jobItemId], ...patch },
    }));
  };

  const handleSubmit = async () => {
    if (!jobComment.trim()) {
      toast.error("Please add a comment before submitting.");
      return;
    }

    const items: FinalQuoteItemInput[] = job.items.map((item) => {
      const draft = drafts[item.id];
      return {
        jobItemId: item.id,
        components: draft.components,
        serviceCharge:
          item.currentStatus !== "pending_final_quote"
            ? (draft.serviceCharge ?? 0)
            : undefined,
        comment: draft.comment.trim() || undefined,
      };
    });

    try {
      await submit({
        jobId: job.job.id,
        items,
        comment: jobComment.trim(),
        discount,
        gst,
      });
      toast.success("Final quote sent for customer approval.");
      onSubmitted();
    } catch {
      // useSubmitFinalQuote already toasts the error
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div>
            <h2 className="text-sm font-semibold">Job #{job.job.jobNumber}</h2>
            <p className="text-xs text-muted-foreground">
              {job.customer.firstName} {job.customer.lastName}
            </p>
          </div>
          <div>
            
          </div>
        </div>
      </div>
      {job.job.latestComment && (
        <div className="flex items-start gap-2 border-b bg-amber-50 p-3 dark:bg-amber-950/30">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {job.job.latestComment.comment}
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-3 p-3">
          {job.items.map((item) =>
            drafts[item.id] ? (
              <QuoteItemCard
                key={item.id}
                item={item}
                draft={drafts[item.id]}
                onChange={(patch) => updateDraft(item.id, patch)}
              />
            ) : null,
          )}

          <Separator className="my-1" />

          <QuoteAdjustments
            subtotalPreview={subtotalPreview}
            discount={discount}
            gst={gst}
            comment={jobComment}
            onDiscountChange={setDiscount}
            onGstChange={setGst}
            onCommentChange={setJobComment}
          />
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end gap-2 border-t p-3">
        {isQuoteLoading && (
          <span className="mr-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading previous quote…
          </span>
        )}
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send for customer approval
        </Button>
      </div>
    </div>
  );
}
