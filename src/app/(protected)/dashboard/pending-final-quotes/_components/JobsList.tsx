"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PendingFinalQuoteJob } from "@/features/cs/cs.types";

interface JobsListProps {
  jobs: PendingFinalQuoteJob[];
  isLoading: boolean;
  error: string | null;
  selectedJobId: string | null;
  onSelect: (jobId: string) => void;
}

export function JobsList({
  jobs,
  isLoading,
  error,
  selectedJobId,
  onSelect,
}: JobsListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-3">
        <div className="px-1 pb-1">
          <h2 className="text-sm font-semibold">Pending Final Quotes</h2>
          <p className="text-xs text-muted-foreground">
            {jobs.length} job{jobs.length === 1 ? "" : "s"} awaiting a quote
          </p>
        </div>

        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}

        {error && <p className="p-3 text-sm text-destructive">{error}</p>}

        {!isLoading && !error && jobs.length === 0 && (
          <p className="p-3 text-sm text-muted-foreground">
            No jobs are currently pending a final quote.
          </p>
        )}

        {jobs.map(({ job, customer, items }) => {
          const pendingCount = items.filter(
            (i) => i.currentStatus === "pending_final_quote",
          ).length;

          return (
            <Card
              key={job.id}
              onClick={() => onSelect(job.id)}
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent",
                selectedJobId === job.id && "border-primary bg-accent",
              )}
            >
              <CardContent className="flex flex-col gap-1.5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">#{job.jobNumber}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {pendingCount} item{pendingCount === 1 ? "" : "s"}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {customer.firstName} {customer.lastName}
                </span>
                {customer.phone && (
                  <span className="text-xs text-muted-foreground">
                    {customer.phone}
                  </span>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
