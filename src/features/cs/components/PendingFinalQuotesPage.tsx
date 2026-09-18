"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { getPendingApprovals, getJobDetails } from "@/features/cs/cs.api";
import { JobWithItems } from "@/features/cs/cs.types";

interface JobSummary {
  id: string;
  jobNumber: string;
  customerName: string;
  currentStatus: string;
  repairLocation: string | null;
  totalAmount: string;
}

interface JobDetail {
  id: string;
  jobNumber: string;
  customerName: string;
  currentStatus: string;
  items: any[];
  jobHistory: any[];
}

export function PendingFinalQuotesPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);
  const [isLoadingJobDetail, setIsLoadingJobDetail] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get search query from URL params
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobDetail(true);
      try {
        const data = await getPendingApprovals();
        // Map JobWithItems to JobSummary
        // JobWithItems = { job: Job, jobItems: JobItem[] }
        // Job has: id, jobNumber, customerId, currentStatus
        // JobItem has: repairLocation
        const mappedJobs = data.map((item) => {
          const firstItem = item.jobItems?.[0];
          return {
            id: item.job.id,
            jobNumber: item.job.jobNumber,
            customerName: item.job.customerId ? `Customer ${item.job.customerId}` : "Unknown",
            currentStatus: item.job.currentStatus,
            version: 1,
            repairLocation: firstItem?.repairLocation || null,
            totalAmount: "0.00"
          };
        });
        setJobs(mappedJobs);
        setIsLoadingJobDetail(false);
      } catch (err) {
        console.error("Failed to load pending jobs:", err);
        setIsLoadingJobDetail(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    try {
      const data = await getPendingApprovals();
      // Map JobWithItems to JobSummary
      const mappedJobs = data.map((item) => {
        const firstItem = item.jobItems?.[0];
        return {
          id: item.job.id,
          jobNumber: item.job.jobNumber,
          customerName: item.job.customerId ? `Customer ${item.job.customerId}` : "Unknown",
          currentStatus: item.job.currentStatus,
          version: 1,
          repairLocation: firstItem?.repairLocation || null,
          totalAmount: "0.00"
        };
      });
      setJobs(mappedJobs);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const fetchJobDetails = async (jobId: string) => {
    setIsLoadingJobDetail(true);
    try {
      const result = await getJobDetails(jobId);
      setSelectedJob(result.data);
    } catch (err) {
      console.error("Failed to fetch job details:", err);
    } finally {
      setIsLoadingJobDetail(false);
    }
  };

  const handleCreateFinalQuote = (jobId: string) => {
    // Navigate to FinalQuoteGenerator with jobId
    window.location.href = `/dashboard/final-quote-generator?jobId=${jobId}`;
  };

  if (isLoadingJobDetail) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />Loading job details…
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Search className="h-10 w-10 opacity-40" />
        <p className="text-sm">No jobs pending final quote.</p>
        <Button size="sm" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Pending Final Quotes {jobs.length > 1 ? `(${jobs.length})` : ""}
        </h1>
        <p className="text-muted-foreground">
          Jobs waiting for final quote generation
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {selectedJob && (
        <div className="mt-8 rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">
            Job Details: {selectedJob.jobNumber}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Job Number</p>
              <p className="font-medium">{selectedJob.jobNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium">{selectedJob.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{selectedJob.currentStatus}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">Items</h3>
            {selectedJob.items.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {selectedJob.items.map((item) => (
                  <li key={item.id} className="p-2 rounded bg-muted/5">
                    <p className="font-medium">{item.deviceCategory}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.issueDescription}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No items found</p>
            )}

            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-3">Action</h3>
              <Button
                onClick={() => handleCreateFinalQuote(selectedJob.id)}
                disabled={isLoadingJobDetail}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Create Final Quote
              </Button>
            </div>
          </div>
        </div>
      )}

      {jobs.length > 0 && !selectedJob ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-lg border bg-white hover:bg-muted/5 transition-colors cursor-pointer"
              onClick={() => fetchJobDetails(job.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{job.jobNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.currentStatus}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {job.repairLocation ? `Location: ${job.repairLocation}` : "No location"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Search className="h-10 w-10 opacity-40" />
          <p className="text-sm">No jobs pending final quote.</p>
          <Button size="sm" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
}