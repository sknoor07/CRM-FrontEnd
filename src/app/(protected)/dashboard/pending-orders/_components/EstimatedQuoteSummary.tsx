import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobQuoteWithItems } from "@/features/transport-team/types/transport-team.types";
import { FileText } from "lucide-react";
import { formatCurrency } from "./format";

export function EstimatedQuoteSummary({
  quote,
}: {
  quote: JobQuoteWithItems | null;
}) {
  if (!quote) {
    return (
      <Card className="p-3 shadow-sm">
        <CardContent className="px-0 text-sm text-muted-foreground">
          No estimated quote has been generated for this job yet.
        </CardContent>
      </Card>
    );
  }

  const rows: Array<[string, string]> = [
    ["Subtotal", formatCurrency(quote.subtotal)],
    ["Service Charge", formatCurrency(quote.serviceCharge)],
    ["Discount", formatCurrency(quote.discount)],
    ["Tax", formatCurrency(quote.tax)],
  ];

  return (
    <Card className="gap-2 p-3 shadow-sm m-1 ">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <FileText className="h-4 w-4" />
          Estimated Quote{" "}
          <span className="font-normal text-muted-foreground">
            (v{quote.version})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between text-sm text-muted-foreground"
          >
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}

        <Separator className="my-1" />

        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Total</span>
          <span>{formatCurrency(quote.totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
