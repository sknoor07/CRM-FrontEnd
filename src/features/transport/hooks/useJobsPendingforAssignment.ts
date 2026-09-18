"use client";

import { useCallback, useEffect, useState } from "react";
import { TMGetAllJobForPickupResponse } from "../types/transport.types";
import { getPendingPickup } from "../api/transport.api";

export function useJobsPendingForAssignment() {
  const [allJobsPendingPickups, setAllJobsPendingPickups] =
    useState<TMGetAllJobForPickupResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPendingPickup();

      setAllJobsPendingPickups(data);
    } catch {
      setError("Failed to load pending jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { allJobsPendingPickups, isLoading, error, refetch };
}


