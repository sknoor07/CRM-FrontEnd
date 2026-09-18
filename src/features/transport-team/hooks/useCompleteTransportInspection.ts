"use client";

import { useState } from "react";
import { toast } from "sonner";
import { completeTransportInspection } from "../api/transport-team.api";
import {
  CompleteInspectionRequest,
  CompleteInspectionResponse,
} from "../types/transport-team.types";

function getErrorMessage(error: unknown): string {
  const typedError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    typedError.response?.data?.message ??
    typedError.response?.data?.error ??
    typedError.message ??
    "Unable to submit the inspection report."
  );
}

export function useCompleteTransportInspection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(
    input: CompleteInspectionRequest,
  ): Promise<CompleteInspectionResponse> {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeTransportInspection(input);
      return result;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
