"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getJobsReadyForClosure } from "@/features/cs/api/cs.api";
import { CloseableJob } from "@/features/cs/types/cs.types";
import { Loader2 } from "lucide-react";

interface CloseableJobSummary {
  id: string;
  jobNumber: string;
  currentStatus: string | null;
  customerId?: string | null;
}

export default function CloseJobPage() {
  const [jobs, setJobs] = useState<CloseableJobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get search query from URL params
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const result = await getJobsReadyForClosure();
        // Map CloseableJob to CloseableJobSummary
        const summaries = result.map((job) => ({
          id: job.id,
          jobNumber: job.jobNumber || job.id,
          currentStatus: job.currentStatus || null,
          customerId: job.customerId,
        }));
        setJobs(summaries);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch jobs ready for closure:", err);
        setError("Failed to load jobs");
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await getJobsReadyForClosure();
      // Map to summaries first, then filter
      const summaries = result.map((job) => ({
        id: job.id,
        jobNumber: job.jobNumber || job.id,
        currentStatus: job.currentStatus || null,
        customerId: job.customerId,
      }));
      const queryLower = query.trim().toLowerCase();
      const filtered = summaries.filter((job) => {
        return (
          job.jobNumber?.toLowerCase().includes(queryLower) ||
          (job.customerId?.toString().includes(queryLower) ?? false)
        );
      });
      setJobs(filtered);
      setIsLoading(false);
      
      // Update URL with search query
      router.push(`?q=${encodeURIComponent(query)}`);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading jobs ready for closure…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Close Job</h1>
        <p className="text-muted-foreground">
          Jobs ready for closure - all items delivered or rejected
        </p>
        
        <div className="relative">
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-10 w-10 opacity-40" />
          <p className="text-sm">No jobs ready for closure</p>
          <Button size="sm" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-lg border bg-white hover:bg-muted/5 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{job.jobNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.currentStatus || "No status"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  Ready for closure
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}