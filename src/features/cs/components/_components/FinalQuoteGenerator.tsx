"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, Calculator, FileText, CheckCircle } from "lucide-react";

interface QuoteComponent {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface FinalQuoteItem {
  jobItemId: string;
  deviceCategory: string;
  deviceSerialNumber: string | null;
  issueDescription: string;
  issueCategory: string | null;
  repairLocation: string;
  components: QuoteComponent[];
  comment: string;
}

interface JobSummary {
  id: string;
  jobNumber: string;
  customerName: string;
}

export function FinalQuoteGenerator() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [items, setItems] = useState<FinalQuoteItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);

  useEffect(() => {
    const fetchJobs = async () => {
      // TODO: Fetch jobs pending final quote from API
      // const res = await fetch("/api/cs/pending-final-quotes");
      // const data = await res.json();
      // setJobs(data.jobs);
      setIsLoading(false);
    };
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading jobs…
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-10 w-10 opacity-40" />
        <p className="text-sm">No jobs pending final quote.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg mb-4">
        Generate Final Quote
      </h2>

      {/* Job Selection */}
      <div className="rounded-xl border bg-white shadow-sm p-6">
        <h3 className="font-medium mb-4">Select Job</h3>
        <div className="grid gap-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={
                "p-3 rounded-lg bg-muted/5 cursor-pointer hover:bg-muted/10 transition-colors"
              }
              onClick={() => setSelectedJob(job.id)}
            >
              <p className="font-medium">{job.jobNumber}</p>
              <p className="text-xs text-muted-foreground">
                {job.jobNumber}: {selectedJob === job.id ? "Selected" : "Click to select"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Generation Form */}
      {selectedJob && (
        <div className="rounded-xl border bg-white shadow-sm p-6">
          <h3 className="font-medium mb-4">
            Generate Final Quote for {selectedJob}
          </h3>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Discount %"
                type="number"
                step="0.01"
                defaultValue={0}
                disabled
              />
              <Input
                placeholder="Tax %"
                type="number"
                step="0.01"
                defaultValue={0}
                disabled
              />
            </div>

            <div>
              <Label>Comment</Label>
              <Input
                placeholder="Add a comment for the final quote"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isLoading ? "Generating…" : "Generate Quote"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}