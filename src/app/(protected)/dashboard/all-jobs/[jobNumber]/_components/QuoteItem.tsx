"use client";

import { Package, Wrench } from "lucide-react";

import { JobQuoteItem } from "@/features/cs/types/job-details.types";

interface QuoteItemProps {
  item: JobQuoteItem;
  itemName: string;
}

function formatMoney(value: string | null | undefined) {
  if (!value) return "₹0.00";

  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function QuoteItem({
  item,
  itemName,
}: QuoteItemProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>

          <div>
            <h4 className="text-sm font-semibold">
              {itemName}
            </h4>

            <p className="text-xs text-muted-foreground">
              Repair item
            </p>
          </div>
        </div>

        <p className="font-semibold">
          {formatMoney(item.itemQuote.totalAmount)}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">
            Components
          </p>

          <p className="text-sm font-medium">
            {formatMoney(
              item.itemQuote.componentsCost,
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Service Charge
          </p>

          <p className="text-sm font-medium">
            {formatMoney(
              item.itemQuote.serviceCharge,
            )}
          </p>
        </div>
      </div>

      {item.lines.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />

            <h5 className="text-xs font-semibold">
              Components / Parts
            </h5>
          </div>

          <div className="space-y-2">
            {item.lines.map((line) => (
              <div
                key={line.id}
                className="flex flex-col gap-1 rounded-md bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {line.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Qty: {line.quantity}
                    {line.warrantyMonths > 0 &&
                      ` · Warranty: ${line.warrantyMonths} months`}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(line.unitPrice)} ×{" "}
                    {line.quantity}
                  </p>

                  <p className="text-sm font-medium">
                    {formatMoney(line.lineTotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}