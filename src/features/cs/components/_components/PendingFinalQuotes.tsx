"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, Calendar, Shield } from "lucide-react";
import { getPendingApprovals } from "@/features/cs/cs.api";
import { JobWithItems } from "@/features/cs/cs.types";

interface JobSummary {
  id: string;
  jobNumber: string;
  customerName: string;
  currentStatus: string;
  version: number;
  repairLocation: string | null;
  totalAmount: string;
}

export function PendingFinalQuotes() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await getPendingApprovals();
        console.log(`data:${data}`);
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
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load pending jobs. Please try again.");
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />Loading pending jobs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
        <Button variant="ghost" size="sm" className="ml-3">
          Retry
        </Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Shield className="h-10 w-10 opacity-40" />
        <p className="text-sm">No jobs pending final quote.</p>
        <Button size="sm" onClick={() => setIsLoading(true)}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg mb-4">
        {jobs.length} Job{jobs.length !== 1 ? "s" : ""} Pending Final Quote
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={
              "rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
            }
          >
            <div className="p-4 border-b">
              <h3 className="font-medium">{job.jobNumber}</h3>
              <p className="text-xs text-muted-foreground">
                Customer: {job.customerName}
              </p>
              <p className="text-xs text-muted-foreground">
                Status: {job.currentStatus} · v{job.version}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs text-muted-foreground">
                Repair Location: {job.repairLocation || "N/A"}
              </p>

              <p className="text-xs text-muted-foreground mt-2">
                Items: Pending Final Quote
              </p>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Final Quote
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}