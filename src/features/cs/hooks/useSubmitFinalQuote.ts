"use client";

import { useState } from "react";
import {
  GenerateFinalQuoteRequest,
  GenerateFinalQuoteResponse,
} from "../types/cs.types";
import { generateFinalQuote } from "../api/cs.api";
import { toast } from "sonner";

function getErrorMessage(error: unknown): string {
  const typedError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    typedError.response?.data?.message ??
    typedError.response?.data?.error ??
    typedError.message ??
    "Unable to submit the job approval."
  );
}

export function useSubmitFinalQuote() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<GenerateFinalQuoteResponse | null>(
    null,
  );

  async function submit(payload: GenerateFinalQuoteRequest) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await generateFinalQuote(payload);
      setSuccess(result);
      return result;
    } catch (error) {
      toast.error("Failed to approve.. please contact IT Team ");
      const message = getErrorMessage(error);
      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error, success };
}
