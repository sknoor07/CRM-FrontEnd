"use client";

import { useJobDetails } from "@/features/cs/hooks/useJobDetails";
import { Loader2 } from "lucide-react";
import { JobSummary } from "./JobSummary";
import { CustomerInfo } from "./CustomerInfo";
import { JobTimeline } from "./JobTimeline";
import { JobItemsSection } from "./JobItemsSection";
import { ActivityTimeline } from "./ActivityTimeline";
import { QuoteSection } from "./QuoteSection";
import { InvoiceSection } from "./InvoiceSection";
;

interface JobDetailsPageProps {
    jobNumber: string;
}

export function JobDetailsPage({
    jobNumber,
}: JobDetailsPageProps) {
    const {
        data,
        isLoading,
        error,
    } = useJobDetails(jobNumber);

    if (isLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-destructive">
                    {error}
                </p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                <p className="text-muted-foreground">
                    Job not found.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Job Details
                </h1>

                <p className="text-sm text-muted-foreground">
                    {data.job.jobNumber}
                </p>
            </div>

            <JobSummary job={data.job} />
            <CustomerInfo customer={data.customer} />
            <JobTimeline history={data.statusHistory} />
            <JobItemsSection items={data.items} />
            <ActivityTimeline comments={data.comments} />
            <QuoteSection
                quotes={data.quotes}
                items={data.items}
            />
            <InvoiceSection invoice={data.invoice} />
        </div>
    );
}