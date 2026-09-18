import { Separator } from "@/components/ui/separator";
import {
  JobItem,
  JobItemQuote,
} from "@/features/transport-team/types/transport-team.types";
import { formatCurrency } from "./format";
import { StatusBadge } from "./StatusBadge";

export function JobItemRow({
  item,
  itemQuote,
}: {
  item: JobItem;
  itemQuote?: JobItemQuote;
}) {
  return (
    <div className="space-y-2 py-3 first:pt-0 last:pb-0 m-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{item.deviceName}</p>
          <p className="text-xs text-muted-foreground">
            {item.deviceCategory}
            {item.deviceSerialNumber ? ` · S/N ${item.deviceSerialNumber}` : ""}
          </p>
        </div>
        <StatusBadge status={item.currentStatus} className="shrink-0" />
      </div>

      <p className="text-sm text-muted-foreground">{item.issueDescription}</p>

      {itemQuote && (
        <>
          <Separator className="my-2" />
          <div className="space-y-1">
            {itemQuote.quoteLines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between text-xs text-muted-foreground"
              >
                <span>
                  {line.name} × {line.quantity}
                </span>
                <span>{formatCurrency(line.lineTotal)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs font-medium">
              <span>Item Total</span>
              <span>{formatCurrency(itemQuote.totalAmount)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
