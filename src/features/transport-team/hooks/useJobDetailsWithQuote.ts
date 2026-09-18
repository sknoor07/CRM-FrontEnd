"use client";

import { useCallback, useEffect, useState } from "react";
import { getJobDetailsWithEstimatedQuote } from "../api/transport-team.api";
import { GetJobDetailsWithQuoteResponse } from "../types/transport-team.types";

/**
 * Fetches the full job details (with estimated quote)
 * whenever `jobId` changes. Pass `null` to reset/clear.
 */
export function useJobDetailsWithQuote(jobId: string | null) {
  const [details, setDetails] = useState<GetJobDetailsWithQuoteResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJobDetailsWithEstimatedQuote(id);
      setDetails(data);
    } catch {
      setError("Failed to load job details. Please try again.");
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!jobId) {
      setDetails(null);
      setError(null);
      return;
    }
    fetchDetails(jobId);
  }, [jobId, fetchDetails]);

  return { details, isLoading, error, refetch: fetchDetails };
}
