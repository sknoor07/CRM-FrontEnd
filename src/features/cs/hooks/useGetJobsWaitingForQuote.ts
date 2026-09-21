import { useCallback, useEffect, useState } from "react";
import { PendingFinalQuoteResponse } from "../types/cs.types";
import { getJobsWaitngForFinalQuote } from "../api/cs.api";

export function useGetJobsWaitingForQuote() {
  const [isLoading, setIsLoading] = useState(true);
  const [allJobsAndItems, setAllJobsAndItems] =
    useState<PendingFinalQuoteResponse>();
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJobsWaitngForFinalQuote();
      setAllJobsAndItems(data);
    } catch (error) {
      setError("Failed to load Jobs that are waiting for Final Quotes");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { allJobsAndItems, isLoading, error, refetch };
}
