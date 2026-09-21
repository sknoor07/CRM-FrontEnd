"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCloseJobs } from "../../../../../features/cs/hooks/useCloseJobs";
import { CloseableJob } from "../../../../../features/cs/types/cs.types";

function displayJobName(job: CloseableJob): string {
  return job.jobNumber || `Job ${job.id.slice(0, 8)}`;
}

function displayCustomer(job: CloseableJob): string {
  const fullName = [
    job.customer.profile.firstName,
    job.customer.profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    job.customer.user.email ||
    job.customerId ||
    "Customer not available"
  );
}

function getJobItems(job: CloseableJob) {
  return job.items;
}

export function CloseJobForm() {
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
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [closingRemarks, setClosingRemarks] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return jobs;

    return jobs.filter((job) => {
      const customerName = [
        job.customer.profile.firstName,
        job.customer.profile.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      return [
        job.id,
        job.jobNumber,
        job.customerId,
        job.customer.user.email,
        customerName,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query));
    });
  }, [jobs, searchQuery]);

  function selectJob(job: CloseableJob) {
    setSelectedJobId(job.id);
    setCustomerConfirmed(false);
    setPaymentConfirmed(false);
    setClosingRemarks("");
    setValidationError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    if (!selectedJob) {
      setValidationError("Select a job before closing it.");
      return;
    }

    if (!customerConfirmed) {
      setValidationError("Customer confirmation is required.");
      return;
    }

    const remarks = closingRemarks.trim();
    if (!remarks) {
      setValidationError("Closing remarks are required.");
      return;
    }

    if (remarks.length > 2000) {
      setValidationError("Closing remarks cannot exceed 2000 characters.");
      return;  
    }

    await submitClose({
      jobId: selectedJob.id,
      customerConfirmed: true,
      paymentConfirmed,
      closureReason: remarks,
    });

    setSelectedJobId(null);
    setCustomerConfirmed(false);
    setPaymentConfirmed(false);
    setClosingRemarks("");
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
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {jobs.length === 0
            ? "There are no jobs ready for closure."
            : `${jobs.length} job${jobs.length === 1 ? "" : "s"} ready for closure.`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        <label htmlFor="close-job-search" className="text-sm font-medium">
          Search jobs
        </label>
        <input
          id="close-job-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by job number, customer name, email, or ID"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const isSelected = selectedJobId === job.id;
            const items = getJobItems(job);

            return (
              <button
                key={job.id}
                type="button"
                onClick={() => selectJob(job)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{displayJobName(job)}</p>
                    <p className="text-sm text-muted-foreground">
                      {displayCustomer(job)}
                    </p>
                  </div>
                  {job.currentStatus && (
                    <span className="rounded-full bg-muted px-2 py-1 text-xs">
                      {job.currentStatus}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </p>
              </button>
            );
          })}
          {filteredJobs.length === 0 && jobs.length > 0 && (
            <p className="rounded-md border p-4 text-sm text-muted-foreground">
              No jobs match your search.
            </p>
          )}
        </div>

        {selectedJob && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg border p-5"
          >
            <div>
              <h3 className="font-semibold">
                Close {displayJobName(selectedJob)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {displayCustomer(selectedJob)}
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={customerConfirmed}
                  onChange={(event) =>
                    setCustomerConfirmed(event.target.checked)
                  }
                  className="mt-1"
                />
                <span>
                  I confirm that the customer has confirmed completion of the
                  job.
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(event) =>
                    setPaymentConfirmed(event.target.checked)
                  }
                  className="mt-1"
                />
                <span>Payment completed</span>
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="closureReason" className="text-sm font-medium">
                Closing remarks
              </label>
              <textarea
                id="closureReason"
                value={closingRemarks}
                onChange={(event) => setClosingRemarks(event.target.value)}
                maxLength={2000}
                rows={5}
                placeholder="Add the final closure notes…"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              />
              <p className="text-right text-xs text-muted-foreground">
                {closingRemarks.length}/2000
              </p>
            </div>

            {(validationError || error) && (
              <p className="text-sm text-destructive">
                {validationError || error}
              </p>
            )}

            <Button type="submit" disabled={isClosing} className="w-full">
              {isClosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isClosing ? "Closing job…" : "Close job"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
