import { z } from "zod";
import type { GstType } from "../types/cs.types";

export const finalQuoteGstSchema = z
  .object({
    gstType: z.enum(["none", "intra_state", "inter_state"]),
    cgst: z.string(),
    sgst: z.string(),
    igst: z.string(),
  })
  .superRefine((values, context) => {
    const validateAmount = (field: "cgst" | "sgst" | "igst") => {
      const value = values[field].trim();
      if (!value) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field.toUpperCase()} is required`,
        });
        return;
      }

      const amount = Number(value);
      if (!Number.isFinite(amount) || amount < 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field.toUpperCase()} must be a non-negative amount`,
        });
      }
    };

    if (values.gstType === "intra_state") {
      validateAmount("cgst");
      validateAmount("sgst");
    }

    if (values.gstType === "inter_state") {
      validateAmount("igst");
    }
  });

export type FinalQuoteGstInput = z.infer<typeof finalQuoteGstSchema>;

export interface QuoteGstFields {
  gstType?: GstType;
  cgst?: string | null;
  sgst?: string | null;
  igst?: string | null;
}

export function getQuoteGstDefaults(quote?: QuoteGstFields | null) {
  const gstType: GstType =
    quote?.gstType ??
    (quote?.igst != null
      ? "inter_state"
      : quote?.cgst != null || quote?.sgst != null
        ? "intra_state"
        : "none");

  return {
    gstType,
    cgst: gstType === "intra_state" ? quote?.cgst ?? "" : "",
    sgst: gstType === "intra_state" ? quote?.sgst ?? "" : "",
    igst: gstType === "inter_state" ? quote?.igst ?? "" : "",
  };
}
