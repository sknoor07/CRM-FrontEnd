"use client";

import { useCallback, useEffect, useState } from "react";
import { getPendingApprovals } from "../cs.api";
import { JobWithItems, PendingApprovalsResponse } from "../cs.types";

export function usePendingApprovals() {
  const [allJobsPendingVerification, setAllJobsPendingVerification] =
    useState<PendingApprovalsResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPendingApprovals();
      setAllJobsPendingVerification(data);
    } catch {
      setError("Failed to load pending jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { allJobsPendingVerification, isLoading, error, refetch };
}
