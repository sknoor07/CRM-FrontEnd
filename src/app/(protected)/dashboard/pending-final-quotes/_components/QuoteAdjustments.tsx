"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { GstType } from "@/features/cs/types/cs.types";
import { useEffect } from "react";

interface QuoteAdjustmentsProps {
  subtotalPreview: number;
  serviceChargePreview: number;
  discount: number;
  gstType: GstType;
  comment: string;

  onDiscountChange: (value: number) => void;
  onGstTypeChange: (value: GstType) => void;
  onCommentChange: (value: string) => void;

  onCgstChange: (value: string) => void;
  onSgstChange: (value: string) => void;
  onIgstChange: (value: string) => void;

  cgst: string;
  sgst: string;
  igst: string;
}

export function QuoteAdjustments({
  subtotalPreview,
  serviceChargePreview,
  discount,
  gstType,
  comment,

  onDiscountChange,
  onGstTypeChange,
  onCommentChange,

  onCgstChange,
  onSgstChange,
  onIgstChange,

  cgst,
  sgst,
  igst,
}: QuoteAdjustmentsProps) {
  // ---------------------------------------------
  // Taxable amount
  // ---------------------------------------------

  const taxableAmount = Math.max(
    subtotalPreview +
      serviceChargePreview -
      discount,
    0,
  );

  // ---------------------------------------------
  // GST calculation
  // ---------------------------------------------

  const calculatedCgst =
    gstType === "intra_state"
      ? Math.round(taxableAmount * 0.09 * 100) / 100
      : 0;

  const calculatedSgst =
    gstType === "intra_state"
      ? Math.round(taxableAmount * 0.09 * 100) / 100
      : 0;

  const calculatedIgst =
    gstType === "inter_state"
      ? Math.round(taxableAmount * 0.18 * 100) / 100
      : 0;

  useEffect(() => {
  if (gstType === "intra_state") {
    onCgstChange(calculatedCgst.toFixed(2));
    onSgstChange(calculatedSgst.toFixed(2));
  } else if (gstType === "inter_state") {
    onIgstChange(calculatedIgst.toFixed(2));
  }
}, [gstType, calculatedCgst, calculatedSgst, calculatedIgst]);

  const gstAmount =
    calculatedCgst +
    calculatedSgst +
    calculatedIgst;

  // ---------------------------------------------
  // Final amount
  // ---------------------------------------------

  const totalAmount =
    Math.round(
      (taxableAmount + gstAmount) * 100,
    ) / 100;

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">
          Quote adjustments
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 p-4 pt-2">

        {/* Discount */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">
              Discount (₹)
            </Label>

            <Input
              type="number"
              min={0}
              max={subtotalPreview}
              className="w-24 text-right"
              value={discount}
              onChange={(e) =>
                onDiscountChange(
                  Math.min(
                    Number(e.target.value) || 0,
                    subtotalPreview,
                  ),
                )
              }
            />
          </div>
        </div>

        {/* GST */}
        <div className="flex flex-col gap-3 rounded-lg border p-3">

          <div className="flex items-center justify-between gap-3">
            <Label
              htmlFor="gst-type"
              className="text-xs font-medium"
            >
              GST type
            </Label>

            <Select
              value={gstType}
              onValueChange={(value) => {
                if (value) {
                  onGstTypeChange(
                    value as GstType,
                  );
                }
              }}
            >
              <SelectTrigger
                id="gst-type"
                className="w-40"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">
                  No GST
                </SelectItem>

                <SelectItem value="intra_state">
                  Intra-state GST
                </SelectItem>

                <SelectItem value="inter_state">
                  Inter-state GST
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gstType !== "none" && (
            <div className="rounded-md bg-muted/50 p-3 text-sm">

              {/* Taxable Amount */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Taxable amount before GST
                </span>

                <span>
                  ₹ {taxableAmount.toFixed(2)}
                </span>
              </div>

              {/* CGST */}
              {gstType === "intra_state" && (
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">
                    CGST (9%)
                  </span>

                  <span>
                    ₹ {calculatedCgst.toFixed(2)}
                  </span>
                </div>
              )}

              {/* SGST */}
              {gstType === "intra_state" && (
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">
                    SGST (9%)
                  </span>

                  <span>
                    ₹ {calculatedSgst.toFixed(2)}
                  </span>
                </div>
              )}

              {/* IGST */}
              {gstType === "inter_state" && (
                <div className="mt-2 flex justify-between">
                  <span className="text-muted-foreground">
                    IGST (18%)
                  </span>

                  <span>
                    ₹ {calculatedIgst.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Total GST */}
              <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                <span>Total GST</span>

                <span>
                  ₹ {gstAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {gstType === "none" && (
            <p className="text-xs text-muted-foreground">
              No GST will be charged.
            </p>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-end border-t pt-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total Amount
            </p>

            <p className="text-xl font-semibold">
              ₹ {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Comment */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">
            Comment (required)
          </Label>

          <Textarea
            rows={3}
            value={comment}
            onChange={(e) =>
              onCommentChange(e.target.value)
            }
            placeholder="Summary shown to the customer, e.g. Final quote covers screen replacement and battery."
          />
        </div>

      </CardContent>
    </Card>
  );
}