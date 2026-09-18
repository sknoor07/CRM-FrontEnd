"use client";

import { useCallback, useEffect, useState } from "react";
import { getAssignedJobs } from "../api/transport-team.api";
import { AssignedJobListItem } from "../types/transport-team.types";

export function useAssignedJobs() {
  const [jobs, setJobs] = useState<AssignedJobListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAssignedJobs();
      setJobs(data);
    } catch {
      setError("Failed to load assigned jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { jobs, isLoading, error, refetch };
}
