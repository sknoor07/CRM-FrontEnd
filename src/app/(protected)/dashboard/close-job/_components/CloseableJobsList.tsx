"use client";

import { CloseableJob } from "../../../../../features/cs/types/cs.types";

interface CloseableJobsListProps {
    jobs: CloseableJob[];
    searchQuery: string;
    selectedJobId: string | null;
    onSearchChange: (value: string) => void;
    onSelectJob: (job: CloseableJob) => void;
}

function displayCustomerName(job: CloseableJob): string {
    const fullName = [
        job.customer.profile.firstName,
        job.customer.profile.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    return fullName || "Customer not available";
}

function displayCustomerEmail(job: CloseableJob): string {
    return job.customer.user.email || "Email not available";
}

function displayCustomerPhone(job: CloseableJob): string {
    return job.customer.profile.phone || "Phone not available";
}
function displayCustomerAddress(job: CloseableJob): string {
    return job.customer.profile.billingAddress;
}


export function CloseableJobsList({
    jobs,
    searchQuery,
    selectedJobId,
    onSearchChange,
    onSelectJob,
}: CloseableJobsListProps) {
    return (
        <div className="space-y-3">
            {/* Search */}
            <div className="space-y-2">
                <label
                    htmlFor="close-job-search"
                    className="text-sm font-medium"
                >
                    Search Orders
                </label>

                <input
                    id="close-job-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                    placeholder="Search by Order number, customer name, email, or ID"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                />
            </div>

            {/* Jobs */}
            {jobs.map((job) => {
                const isSelected = selectedJobId === job.id;

                return (
                    <button
                        key={job.id}
                        type="button"
                        onClick={() => onSelectJob(job)}
                        className={`w-full rounded-lg border p-4 text-left transition cursor-pointer shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl ${isSelected
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="mt-1 space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        {displayCustomerName(job)}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {displayCustomerEmail(job)}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        {displayCustomerPhone(job)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {displayCustomerAddress(job)}
                                    </p>
                                </div>

                                
                            </div>

                            {job.currentStatus && (
                                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                                    {job.currentStatus}
                                </span>
                            )}
                        </div>

                        <p className="mt-3 text-xs text-muted-foreground">
                            {job.items.length} item
                            {job.items.length === 1 ? "" : "s"}
                        </p>
                    </button>
                );
            })}

            {jobs.length === 0 && (
                <p className="rounded-md border p-4 text-sm text-muted-foreground">
                    No jobs match your search.
                </p>
            )}
        </div>
    );
}