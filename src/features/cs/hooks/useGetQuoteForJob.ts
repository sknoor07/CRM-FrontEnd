import { useCallback, useEffect, useState } from "react";
import { GetQuoteForJobResponse, QuoteDetails } from "../types/cs.types";
import { getQuoteDetailsForAJob } from "../api/cs.api";

export function useGetQuoteForJob(jobId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<QuoteDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!jobId) return;
    setData(null);
    setIsLoading(true);
    setError(null);
    try {
      const res: GetQuoteForJobResponse = await getQuoteDetailsForAJob(jobId);
      setData(res.data);
    } catch {
      setError("Failed to load the existing quote for this job");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId) {
      setData(null);
      return;
    }
    refetch();
  }, [jobId, refetch]);

  return { data, isLoading, error, refetch };
}
