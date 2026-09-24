"use client";

import { FileText } from "lucide-react";

import { JobQuoteWithItems } from "@/features/cs/types/job-details.types";

import { QuoteCard } from "./QuoteCard";
import { JobDetailsItem } from "@/features/cs/types/job-details.types";

interface QuoteSectionProps {
  quotes: JobQuoteWithItems[];
  items: JobDetailsItem[];
}

export function QuoteSection({
  quotes,
  items,
}: QuoteSectionProps) {
  if (quotes.length === 0) {
    return (
      <section>
        <div className="rounded-lg border border-dashed p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              Quotes
            </h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            No quotes have been created for this job.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FileText className="h-5 w-5" />
          Quotes
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Quote versions and their item-level pricing
        </p>
      </div>

      <div className="space-y-4">
        {quotes.map((quoteData) => (
          <QuoteCard
            key={quoteData.quote.id}
            quoteData={quoteData}
            items={items}
          />
        ))}
      </div>
    </section>
  );
}