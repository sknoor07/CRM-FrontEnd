"use client";

import {
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  JobQuoteWithItems,
  JobDetailsItem,
} from "@/features/cs/types/job-details.types";

import { QuoteItem } from "./QuoteItem";

interface QuoteCardProps {
  quoteData: JobQuoteWithItems;
  items: JobDetailsItem[];
}

function formatMoney(value: string | null | undefined) {
  if (!value) return "₹0.00";

  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function QuoteCard({
  quoteData,
  items,
}: QuoteCardProps) {
  const { quote, items: quoteItems } = quoteData;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />

              Quote Version {quote.version}
            </CardTitle>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />

                {formatDate(quote.createdAt)}
              </span>
            </div>
          </div>

          <Badge variant="outline">
            {formatStatus(quote.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quote items */}
        {quoteItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">
              Quoted Items
            </h4>

            {quoteItems.map((quoteItem) => {
              const matchingItem = items.find(
                (item) =>
                  item.item.id ===
                  quoteItem.itemQuote.jobItemId,
              );

              return (
                <QuoteItem
                  key={quoteItem.itemQuote.id}
                  item={quoteItem}
                  itemName={
                    matchingItem?.item.deviceName ||
                    "Repair Item"
                  }
                />
              );
            })}
          </div>
        )}

        {/* Financial summary */}
        <div className="border-t pt-5">
          <h4 className="mb-4 text-sm font-semibold">
            Quote Summary
          </h4>

          <div className="ml-auto max-w-md space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span>
                {formatMoney(quote.subtotal)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                Service Charge
              </span>

              <span>
                {formatMoney(quote.serviceCharge)}
              </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                Discount
              </span>

              <span>
                - {formatMoney(quote.discount)}
              </span>
            </div>

            {quote.cgst && (
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  CGST
                </span>

                <span>
                  {formatMoney(quote.cgst)}
                </span>
              </div>
            )}

            {quote.sgst && (
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  SGST
                </span>

                <span>
                  {formatMoney(quote.sgst)}
                </span>
              </div>
            )}

            {quote.igst && (
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  IGST
                </span>

                <span>
                  {formatMoney(quote.igst)}
                </span>
              </div>
            )}

            <div className="border-t pt-3">
              <div className="flex justify-between gap-4">
                <span className="font-semibold">
                  Total
                </span>

                <span className="text-lg font-bold">
                  {formatMoney(quote.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}