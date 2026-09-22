"use client";
import { usePendingApprovals } from "@/features/cs/hooks/usePendingApprovals";

import { ClipboardCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

import { Job, JobWithItems } from "@/features/cs/types/cs.types";
import JobCard from "./JobCard";
import OrderDetailedCard from "./OrderDetailedCard";

export default function ApproveJobsPage() {
  const { allJobsPendingVerification, isLoading, error, refetch } =
    usePendingApprovals();
  const [detailedForm, setDetailedForm] = useState(false);
  const [selectedJobWithItems, setSelectedJobWithItems] =
    useState<JobWithItems>();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />

        <span>Loading pending jobs…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <span>{error}</span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          className="ml-3"
        >
          Retry
        </Button>
      </div>
    );
  }
  if (allJobsPendingVerification?.jobs?.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <ClipboardCheck className="h-10 w-10 opacity-40" />

        <p className="text-sm">No jobs waiting for verification.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-150px)] gap-4">
      {/* LEFT - Job List */}
      <div className="w-2/5 min-h-0">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {allJobsPendingVerification?.jobs?.map((jobWithItems) => (
              <div
                key={jobWithItems.job.id}
                className="p-2 rounded-xl cursor-pointer shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl "
                onClick={() => {
                  setSelectedJobWithItems(jobWithItems);
                  setDetailedForm(true);
                }}
              >
                <JobCard
                  allJobsWithItems={jobWithItems}
                  setDetailedForm={setDetailedForm}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT - Details */}
      <div className="flex-1 min-h-0">
        {detailedForm && selectedJobWithItems ? (
          <OrderDetailedCard
            jobWithItems={selectedJobWithItems}
            onSuccess={() => {
              setSelectedJobWithItems(undefined);
              setDetailedForm(false);
              void refetch();
            }}
          />
        ) : (
          <div className="m-2">
            <p>Click on a job to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
