import { useCallback, useEffect, useState } from "react";
import { GetJobsParams, GetJobWithItemsResponse } from "../types/cs.types";
import { getJobs } from "../api/cs.api";



export function useFetchJobDetails({page,limit, search}:GetJobsParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [jobAndItems, setAllJobsAndItems] =useState<GetJobWithItemsResponse|null>(null);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getJobs({page,limit,search});
      setAllJobsAndItems(data);
    } catch (error) {
      setError("Failed to load Jobs that are waiting for Final Quotes");
    } finally {
      setIsLoading(false);
    }
  }, [page,limit,search]);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { jobAndItems, isLoading, error, refetch };
}


