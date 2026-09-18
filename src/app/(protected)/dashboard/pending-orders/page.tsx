"use client";

import { useState } from "react";
import { cn } from "cn";
import { ClipboardList } from "lucide-react";
import { useAssignedJobs } from "@/features/transport-team/hooks/useAssignedJobs";
import { JobDetails } from "./_components/JobDetails";
import { JobList } from "./_components/JobList";

function PendingOrders() {
  const { jobs, isLoading, error, refetch } = useAssignedJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleInspectionSubmitted = () => {
    setSelectedJobId(null);
    void refetch();
  };

  return (
    <div className="flex h-[calc(100vh-150px)]  gap-4 w-full justify-between">
      {/* Job list — full width on mobile, fixed column on desktop.
          Hidden on mobile once a job is selected. */}
      <div
        className={cn(
          "  min-h-0  md:w-1/2 md:shrink-0",
          selectedJobId && "hidden md:block",
        )}
      >
        <JobList
          jobs={jobs}
          isLoading={isLoading}
          error={error}
          onRetry={() => void refetch()}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
        />
      </div>

      {/* Details panel — hidden on mobile until a job is selected,
          always visible on desktop (shows a placeholder when empty). */}
      <div
        className={cn(
          "flex-1 min-h-0 justify-center",
          selectedJobId ? "flex" : "hidden md:flex ",
        )}
      >
        {selectedJobId ? (
          <JobDetails
            jobId={selectedJobId}
            onBack={() => setSelectedJobId(null)}
            onInspectionSubmitted={handleInspectionSubmitted}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <ClipboardList className="h-10 w-10 opacity-40" />
            <p className="text-sm">Select a job to view its details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingOrders;
