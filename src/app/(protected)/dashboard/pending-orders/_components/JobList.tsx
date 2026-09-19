import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssignedJobListItem } from "@/features/transport-team/types/transport-team.types";
import { ClipboardList, Loader2 } from "lucide-react";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: AssignedJobListItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

export function JobList({
  jobs,
  isLoading,
  error,
  onRetry,
  selectedJobId,
  onSelectJob,
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading assigned jobs…</span>
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
          onClick={onRetry}
          className="ml-3"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
        <ClipboardList className="h-10 w-10 opacity-40" />
        <p className="text-sm">No jobs assigned to you right now.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-2 sm:pr-4">
      <div className="space-y-3 pb-4">
        {jobs.map((item) => (
          <JobCard
            key={item.job.id}
            item={item}
            isSelected={item.job.id === selectedJobId}
            onSelect={onSelectJob}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
