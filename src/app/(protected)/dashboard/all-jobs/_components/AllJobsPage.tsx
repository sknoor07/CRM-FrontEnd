"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

import { useFetchJobDetails } from "@/features/cs/hooks/useFetchJobDetails";
import { JobCard } from "./JobCard";


export function AllJobsPage() {
  const [page, setPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, SetTotalPages] = useState<Number>(1);
  const [search, setSearch] = useState<string>("");
  const limit = 20;
  const { jobAndItems, isLoading, error, refetch, } = useFetchJobDetails({ page, limit, search, });


  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => {
      clearTimeout(timer);
    }
  }, [searchInput])

  const jobs = jobAndItems?.result ?? [];
  const pagination = jobAndItems?.pagination;

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
        <Button variant="ghost" size="sm" onClick={refetch}>Retry</Button>
      </div>
    );
  }

  // Fetch job details when needed

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          All Jobs
        </h1>

        <p className="text-sm text-muted-foreground">
          Manage all jobs
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4
        -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={searchInput}
          onChange={(e) =>
            setSearchInput(e.target.value)
          }
          placeholder="Search job, customer, email..."
          className="pl-9"
        />
      </div>

      {/* Results information */}
      {pagination && (
        <div className="text-sm text-muted-foreground">
          Showing page {pagination.page} of{" "}
          {pagination.totalPages} ({pagination.total} jobs)
        </div>
      )}

      {/* Jobs */}
      <div className="space-y-4">

        {jobs.map((jobData) => (
          <JobCard
            key={jobData.job.id}
            jobData={jobData}
          />
        ))}

      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">

          <Button
            variant="outline"
            disabled={!pagination.hasPreviousPage}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() =>
              setPage((prev) => prev + 1)
            }
          >
            Next
          </Button>

        </div>
      )}

    </div>
  );
}