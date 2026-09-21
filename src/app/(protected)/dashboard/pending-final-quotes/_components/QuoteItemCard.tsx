"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Pencil } from "lucide-react";
import { FinalQuoteComponentInput, JobItem } from "@/features/cs/types/cs.types";
import { ItemDraft } from "./JobDetailsPanel";
import { ComponentsEditorDialog } from "./ComponentsEditorDialog";

const STATUS_LABEL: Record<string, string> = {
  pending_final_quote: "Repair estimate",
  repair_rejected: "Rejected",
  cancelled: "Cancelled",
};

const STATUS_VARIANT: Record<string, "default" | "destructive" | "secondary"> =
  {
    pending_final_quote: "default",
    repair_rejected: "destructive",
    cancelled: "secondary",
  };

interface QuoteItemCardProps {
  item: JobItem;
  draft: ItemDraft;
  onChange: (patch: Partial<ItemDraft>) => void;
}

export function QuoteItemCard({ item, draft, onChange }: QuoteItemCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const componentsSubtotal = draft.components.reduce(
    (sum, c) => sum + c.quantity * c.unitPrice,
    0,
  );
  const needsManualCharge = item.currentStatus !== "pending_final_quote";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 p-4 pb-2">
        <div>
          <p className="text-sm font-medium">{item.deviceName}</p>
          <p className="text-xs text-muted-foreground">
            {item.deviceCategory} · {item.issueDescription}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[item.currentStatus] ?? "secondary"}>
          {STATUS_LABEL[item.currentStatus] ?? item.currentStatus}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 p-4 pt-2">
        {item.latestComment && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-900 dark:bg-amber-950/30">
            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs text-amber-900 dark:text-amber-200">
              {item.latestComment.comment}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2 rounded-lg border p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              + Components
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
          {draft.components.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No components added yet.
            </p>
          ) : (
            <div className="flex flex-col divide-y">
              {" "}
              {draft.components.map((component, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  {" "}
                  <span>
                    {" "}
                    {component.name}{" "}
                    <span className="text-xs text-muted-foreground">
                      {" "}
                      × {component.quantity}{" "}
                    </span>{" "}
                  </span>{" "}
                  <span className="tabular-nums">
                    {" "}
                    ₹
                    {(component.quantity * component.unitPrice).toFixed(2)}{" "}
                  </span>{" "}
                </div>
              ))}{" "}
            </div>
          )}{" "}
          <div className="flex items-center justify-between border-t pt-1.5 text-sm font-medium">
            {" "}
            <span>Subtotal</span>{" "}
            <span className="tabular-nums">
              {" "}
              ₹{componentsSubtotal.toFixed(2)}{" "}
            </span>{" "}
          </div>{" "}
        </div>

        {needsManualCharge && (
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Inspection / service charge (₹)</Label>
            <Input
              type="number"
              min={0}
              value={draft.serviceCharge ?? 0}
              onChange={(e) =>
                onChange({ serviceCharge: Number(e.target.value) || 0 })
              }
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Note for this item (optional)</Label>
          <Textarea
            rows={2}
            value={draft.comment}
            onChange={(e) => onChange({ comment: e.target.value })}
            placeholder="e.g. Replaced screen assembly, battery still under warranty"
          />
        </div>
      </CardContent>

      <ComponentsEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        components={draft.components}
        onSave={(components: FinalQuoteComponentInput[]) =>
          onChange({ components })
        }
      />
    </Card>
  );
}
