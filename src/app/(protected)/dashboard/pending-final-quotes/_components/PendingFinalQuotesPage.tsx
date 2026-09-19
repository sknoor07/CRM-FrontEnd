"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

import { useGetJobsWaitingForQuote } from "@/features/cs/hooks/useGetJobsWaitingForQuote";
import { JobsList } from "./JobsList";
import { JobDetailsPanel } from "./JobDetailsPanel";

export default function PendingFinalQuotesPage() {
  const { allJobsAndItems, isLoading, error, refetch } =
    useGetJobsWaitingForQuote();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const jobs = allJobsAndItems?.jobs ?? [];

  const handleSubmitted = () => {
    setSelectedJobId(null);
    refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden">
      {/* Jobs list — full width on mobile until a job is picked, fixed column on desktop */}
      <div
        className={cn(
          "w-full shrink-0 border-r md:block md:w-80 lg:w-96",
          selectedJobId && "hidden",
        )}
      >
        <JobsList
          jobs={jobs}
          isLoading={isLoading}
          error={error}
          selectedJobId={selectedJobId}
          onSelect={setSelectedJobId}
        />
      </div>

      {/* Details panel */}
      <div
        className={cn(
          "flex-1 overflow-hidden md:block min-h-0",
          !selectedJobId && "hidden",
        )}
      >
        {selectedJobId ? (
          <JobDetailsPanel
            jobId={selectedJobId}
            job={jobs.find((j) => j.job.id === selectedJobId) ?? null}
            onBack={() => setSelectedJobId(null)}
            onSubmitted={handleSubmitted}
          />
        ) : (
          <div className="hidden h-full flex-col items-center justify-center gap-2 text-muted-foreground md:flex">
            <FileText className="h-8 w-8" />
            <p className="text-sm">Select a job to review its final quote</p>
          </div>
        )}
      </div>
    </div>
  );
}
