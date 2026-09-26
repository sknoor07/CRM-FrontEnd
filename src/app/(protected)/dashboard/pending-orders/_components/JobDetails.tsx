"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useJobDetailsWithQuote } from "@/features/transport-team/hooks/useJobDetailsWithQuote";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { EstimatedQuoteSummary } from "./EstimatedQuoteSummary";
import { InspectionForm } from "./InspectionForm";
import { JobItemRow } from "./JobItemRow";
import { RepairCompleteCard } from "./RepairCompleteCard";
import { StatusBadge } from "./StatusBadge";
import { getOnsiteRepairPhase } from "@/features/transport-team/utils/onsite-repair-phase";

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
  onInspectionSubmitted: () => void;
}

export function JobDetails({
  jobId,
  onBack,
  onInspectionSubmitted,
}: JobDetailsProps) {
  const { details, isLoading, error, refetch } = useJobDetailsWithQuote(jobId);

  // Onsite items still waiting on the technician's inspection decision
  // vs. onsite items already decided and now mid-repair.
  const { needsInspection, readyForCompletion } = useMemo(
  () => getOnsiteRepairPhase(details?.jobItems ?? []),
  [details],
);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2 md:hidden">
        <Button type="button" variant="ghost" size="icon-sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          Back to jobs
        </span>
      </div>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading job details…</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch(jobId)}
            className="ml-3"
          >
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && details && (
        <ScrollArea className="flex-1 pr-2 sm:pr-4">
          <div className="space-y-4 pb-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-heading text-lg font-semibold">
                {details.job.jobNumber}
              </h2>
              <StatusBadge status={details.jobItems[0].isWarrantyClaim ? "in_warranty_inspection":details.job.currentStatus} />
            </div>

            <CustomerInfoCard customer={details.customer} />

            {!needsInspection && readyForCompletion ? (
              // Inspection is done — the only remaining action is
              // marking the onsite repair complete.
              <RepairCompleteCard
                jobId={details.job.id}
                items={details.jobItems}
                onCompleted={onInspectionSubmitted}
              />
            ) : (
              <>
                <Card className="gap-2 p-3 shadow-sm m-1">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="flex items-center gap-1.5 text-sm">
                      <Package className="h-4 w-4" />
                      Job Items ({details.jobItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 divide-y">
                    {details.jobItems.map((item) => (
                      <JobItemRow
                        key={item.id}
                        item={item}
                        itemQuote={details.quote?.jobItemQuotes.find(
                          (iq) => iq.jobItemId === item.id,
                        )}
                      />
                    ))}
                  </CardContent>
                </Card>

                <EstimatedQuoteSummary quote={details.quote} />

                <InspectionForm
                  jobId={details.job.id}
                  items={details.jobItems}
                  onSubmitted={onInspectionSubmitted}
                />
              </>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}