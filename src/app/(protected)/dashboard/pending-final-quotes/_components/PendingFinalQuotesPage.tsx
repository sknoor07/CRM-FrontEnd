"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, Loader2, TrendingUp } from "lucide-react";

import { getPendingApprovals, getJobDetails } from "@/features/cs/cs.api";

import { JobItem } from "@/features/cs/cs.types";

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
  items: JobItem[];
  jobHistory: any[];
}

export function PendingFinalQuotesPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null);

  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingJobDetail, setIsLoadingJobDetail] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);

      try {
        const data = await getPendingApprovals();

        const mappedJobs = data.jobs.map((item) => {
          const firstItem = item.items?.[0];

          return {
            id: item.job.id,
            jobNumber: item.job.jobNumber,
            customerName: item.customer
              ? `${item.customer.firstName} ${item.customer.lastName}`
              : "Unknown",
            currentStatus: item.job.currentStatus,
            repairLocation: firstItem?.repairLocation ?? null,
            totalAmount: "0.00",
          };
        });

        setJobs(mappedJobs);
      } catch (err) {
        console.error("Failed to load pending jobs:", err);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();

    return (
      job.jobNumber.toLowerCase().includes(query) ||
      job.customerName.toLowerCase().includes(query) ||
      job.currentStatus.toLowerCase().includes(query)
    );
  });

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
    window.location.href = `/dashboard/final-quote-generator?jobId=${jobId}`;
  };

  if (isLoadingJobs) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading pending jobs…
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
        <h1 className="mb-2 text-2xl font-bold">
          Pending Final Quotes {jobs.length > 1 ? `(${jobs.length})` : ""}
        </h1>

        <p className="text-muted-foreground">
          Jobs waiting for final quote generation
        </p>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {selectedJob ? (
        <div className="mt-8 rounded-lg border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Job Details: {selectedJob.jobNumber}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="mt-6 border-t pt-6">
            <h3 className="mb-3 font-medium">Items</h3>

            {selectedJob.items.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {selectedJob.items.map((item) => (
                  <li key={item.id} className="rounded bg-muted/5 p-2">
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

            <div className="mt-4 border-t pt-4">
              <h3 className="mb-3 font-medium">Action</h3>

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
      ) : (
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
              <Search className="h-10 w-10 opacity-40" />

              <p className="text-sm">No jobs match your search.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="cursor-pointer rounded-lg border bg-white p-4 transition-colors hover:bg-muted/5"
                onClick={() => fetchJobDetails(job.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{job.jobNumber}</p>

                    <p className="text-sm">{job.customerName}</p>

                    <p className="text-xs text-muted-foreground">
                      {job.currentStatus}
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {job.repairLocation
                      ? `Location: ${job.repairLocation}`
                      : "No location"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isLoadingJobDetail && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading job details…
        </div>
      )}
    </div>
  );
}
