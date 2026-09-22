"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCloseJobs } from "../../../../../features/cs/hooks/useCloseJobs";
import { CloseableJob } from "../../../../../features/cs/types/cs.types";

import { CloseableJobsList } from "./CloseableJobsList";
import { CloseJobForm } from "./CloseJobForm";

function getCustomerSearchText(job: CloseableJob): string {
  return [
    job.customer.profile.firstName,
    job.customer.profile.lastName,
    job.customer.profile.phone,
  ]
    .filter(Boolean)
    .join(" ");
}

export function CloseJobPage() {
  const {
    jobs,
    isLoading,
    isClosing,
    error,
    successMessage,
    reload,
    submitClose,
  } = useCloseJobs();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ?? null;

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) => {
      const customerName = getCustomerSearchText(job);

      return [
        job.id,
        job.jobNumber,
        job.customerId,
        job.customer.user.email,
        job.customer.profile.phone  ,
        customerName,
      ]
        .filter(Boolean)
        .some((value) =>
          value!.toLowerCase().includes(query)
        );
    });
  }, [jobs, searchQuery]);

  function handleSelectJob(job: CloseableJob) {
    setSelectedJobId(job.id);
  }

  async function handleCloseJob(data: {
    customerConfirmed: boolean;
    paymentConfirmed: boolean;
    closureReason: string;
  }) {
    if (!selectedJob) {
      return;
    }

    await submitClose({
      jobId: selectedJob.id,
      customerConfirmed: data.customerConfirmed,
      paymentConfirmed: data.paymentConfirmed,
      closureReason: data.closureReason,
    });

    setSelectedJobId(null);
  }

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading jobs ready for closure…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {jobs.length === 0
            ? "There are no jobs ready for closure."
            : `${jobs.length} job${
                jobs.length === 1 ? "" : "s"
              } ready for closure.`}
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void reload()}
          disabled={isClosing}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Global error */}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Main content */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CloseableJobsList
          jobs={filteredJobs}
          searchQuery={searchQuery}
          selectedJobId={selectedJobId}
          onSearchChange={setSearchQuery}
          onSelectJob={handleSelectJob}
        />

        {selectedJob && (
          <CloseJobForm
            job={selectedJob}
            isClosing={isClosing}
            error={error}
            onSubmit={handleCloseJob}
          />
        )}
      </div>
    </div>
  );
}