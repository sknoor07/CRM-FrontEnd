"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

interface QuoteAdjustmentsProps {
  subtotalPreview: number;
  discount: number;
  gst: number;
  comment: string;
  onDiscountChange: (value: number) => void;
  onGstChange: (value: number) => void;
  onCommentChange: (value: string) => void;
}

export function QuoteAdjustments({
  subtotalPreview,
  discount,
  gst,
  comment,
  onDiscountChange,
  onGstChange,
  onCommentChange,
}: QuoteAdjustmentsProps) {
  const discountPercent =
    subtotalPreview > 0 ? Math.round((discount / subtotalPreview) * 100) : 0;
  const gstPercent =
    subtotalPreview > 0 ? Math.round((gst / subtotalPreview) * 100) : 0;

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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">GST / Tax (₹)</Label>
            <Input
              type="number"
              min={0}
              className="w-24 text-right"
              value={gst}
              onChange={(e) => onGstChange(Number(e.target.value) || 0)}
            />
          </div>
          <Slider
            value={[gstPercent]}
            max={28}
            step={1}
            onValueChange={(value) => {
              const percent = Array.isArray(value) ? value[0] : value;
              onGstChange(Math.round((subtotalPreview * percent) / 100));
            }}
          />
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
