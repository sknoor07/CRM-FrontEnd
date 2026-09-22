"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";


interface QuoteAdjustmentsProps {
  subtotalPreview: number;
  discount: number;
  isGstBill: boolean;
  cgst: number;
  sgst: number;
  comment: string;
  onDiscountChange: (value: number) => void;
  onIsGstBillChange: (value: boolean) => void;
  onCgstChange: (value: number) => void;
  onSgstChange: (value: number) => void;
  onCommentChange: (value: string) => void;
}

export function QuoteAdjustments({
  subtotalPreview,
  discount,
  isGstBill,
  cgst,
  sgst,
  comment,
  onDiscountChange,
  onIsGstBillChange,
  onCgstChange,
  onSgstChange,
  onCommentChange,
}: QuoteAdjustmentsProps) {
  const discountPercent =
    subtotalPreview > 0 ? Math.round((discount / subtotalPreview) * 100) : 0;
  const cgstPercent =
    subtotalPreview > 0 ? Math.round((cgst / subtotalPreview) * 100) : 0;
  const sgstPercent =
    subtotalPreview > 0 ? Math.round((sgst / subtotalPreview) * 100) : 0;

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Quote adjustments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-4 pt-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Discount (₹)</Label>
            <Input
              type="number"
              min={0}
              className="w-24 text-right"
              value={discount}
              onChange={(e) => onDiscountChange(Number(e.target.value) || 0)}
            />
          </div>
          <Slider
            value={[discountPercent]}
            max={50}
            step={1}
            onValueChange={(value) => {
              const percent = Array.isArray(value) ? value[0] : value;
              onDiscountChange(Math.round((subtotalPreview * percent) / 100));
            }}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="gst-bill-toggle" className="text-xs font-medium">
              Generate GST bill
            </Label>
            <Checkbox
              id="gst-bill-toggle"
              checked={isGstBill}
              onCheckedChange={(checked) => onIsGstBillChange(Boolean(checked))}
            />
          </div>

          {!isGstBill && (
            <p className="text-xs text-muted-foreground">
              No CGST/SGST will be sent — this will be generated as a non-GST bill.
            </p>
          )}

          {isGstBill && (
            <>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">CGST (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="w-24 text-right"
                    value={cgst}
                    onChange={(e) => onCgstChange(Number(e.target.value) || 0)}
                  />
                </div>
                <Slider
                  value={[cgstPercent]}
                  max={14}
                  step={1}
                  onValueChange={(value) => {
                    const percent = Array.isArray(value) ? value[0] : value;
                    onCgstChange(Math.round((subtotalPreview * percent) / 100));
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">SGST (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    className="w-24 text-right"
                    value={sgst}
                    onChange={(e) => onSgstChange(Number(e.target.value) || 0)}
                  />
                </div>
                <Slider
                  value={[sgstPercent]}
                  max={14}
                  step={1}
                  onValueChange={(value) => {
                    const percent = Array.isArray(value) ? value[0] : value;
                    onSgstChange(Math.round((subtotalPreview * percent) / 100));
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Comment (required)</Label>
          <Textarea
            rows={3}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Summary shown to the customer, e.g. Final quote covers screen replacement and battery."
          />
        </div>
      </CardContent>
    </Card>
  );
}