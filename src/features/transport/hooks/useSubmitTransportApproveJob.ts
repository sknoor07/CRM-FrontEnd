"use client";

import { useState } from "react";

import { toast } from "sonner";
import {
  SubmitTransportJobApproveRequest,
  SubmitTransportJobApproveResponse,
} from "../types/transport.types";
import { assignPickUpPerson } from "../api/transport.api";

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

export function useSubmitTransportApproveJob() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] =
    useState<SubmitTransportJobApproveResponse | null>(null);

  async function submit(input: SubmitTransportJobApproveRequest) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await assignPickUpPerson(input);
      setSuccess(result);
      return result;
    } catch (error) {
      toast.error("Failed to assign.. please contact IT Team ");
      const message = getErrorMessage(error);
      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error, success };
}
