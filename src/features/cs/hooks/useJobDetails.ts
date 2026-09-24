"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getJobDetails } from "../api/job-details.api";
import {
  JobDetailsData,
} from "../types/job-details.types";

export function useJobDetails(
  jobNumber: string,
) {
  const [data, setData] =
    useState<JobDetailsData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!jobNumber) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getJobDetails(jobNumber);

      setData(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch job details:",
        error,
      );

      setError(
        "Failed to load job details",
      );
    } finally {
      setIsLoading(false);
    }
  }, [jobNumber]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}