"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getJobs, getJobDetails } from "@/features/cs/api/cs.api";

interface JobItem {
  id: string;
  deviceCategory: string;
  issueDescription: string;
}

interface JobSummary {
  id: string;
  jobNumber: string;
  customerName: string;
  currentStatus: string;
  items?: Array<JobItem> | null;
}

interface JobDetail {
  id: string;
  jobNumber: string;
  customerName: string;
  currentStatus: string;
  items: any[];
  jobHistory?: any[];
}

export function AllJobsPage() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobDetail | null>(null);
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
        const data = await getJobs(searchQuery);
        // Map JobWithItems to JobSummary
        const mappedJobs = (data || []).map((job: any) => ({
          id: job.id,
          jobNumber: job.job?.jobNumber || job.jobNumber,
          customerName: job.customer?.name || job.customerName,
          currentStatus: job.job?.currentStatus || job.currentStatus,
          items: job.jobItems?.map((item: any) => ({
            id: item.id,
            deviceCategory: item.deviceCategory,
            issueDescription: item.issueDescription,
          })) || [],
        }));
        setJobs(mappedJobs);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs");
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await getJobs(query);
      // Map JobWithItems to JobSummary
      const mappedJobs = (data || []).map((job: any) => ({
        id: job.id,
        jobNumber: job.job?.jobNumber || job.jobNumber,
        customerName: job.customer?.name || job.customerName,
        currentStatus: job.job?.currentStatus || job.currentStatus,
        items: job.jobItems?.map((item: any) => ({
          id: item.id,
          deviceCategory: item.deviceCategory,
          issueDescription: item.issueDescription,
        })) || [],
      }));
      setJobs(mappedJobs);
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
        <Loader2 className="h-5 w-5 animate-spin" />Loading jobs…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Fetch job details when needed
  useEffect(() => {
    if (selectedJobDetail && selectedJobDetail.id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const result = await getJobDetails(selectedJobDetail.id);
          setSelectedJobDetail(result.data);
        } catch (err) {
          console.error("Failed to fetch job details:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [selectedJobDetail]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">All Jobs</h1>
        <p className="text-muted-foreground">
          Search by job number, customer name, email, or ID
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

      {selectedJobDetail && (
        <div className="mt-8">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">
              Job Details: {selectedJobDetail.jobNumber}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Job Number</p>
                <p className="font-medium">{selectedJobDetail.jobNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedJobDetail.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{selectedJobDetail.currentStatus}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Items</h3>
              {selectedJobDetail.items.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {selectedJobDetail.items.map((item) => (
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
            </div>
          </div>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Search className="h-10 w-10 opacity-40" />
          <p className="text-sm">No jobs found</p>
          <Button size="sm" onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-lg border bg-white hover:bg-muted/5 transition-colors cursor-pointer"
              onClick={() => {
                // Trigger fetching job details by ID
                setSelectedJobDetail({
                  id: job.id,
                  jobNumber: job.jobNumber,
                  customerName: job.customerName,
                  currentStatus: job.currentStatus,
                  items: job.items || [],
                });
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{job.jobNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.currentStatus}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {job.items?.length || 0} items
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}