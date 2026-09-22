"use client";

import { useCallback, useEffect, useState } from "react";
import { closeJob, getJobsReadyForClosure } from "../api/cs.api";
import { CloseJobInput, CloseableJob } from "../types/cs.types";

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error ??
    axiosError.message ??
    fallback
  );
}

export function useCloseJobs() {
  const [jobs, setJobs] = useState<CloseableJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const readyJobs = await getJobsReadyForClosure();
      console.log(`jobs Ready For Closure: ${readyJobs}`)
      setJobs(readyJobs);
    } catch (error) {
      setError(
        getErrorMessage(error, "Unable to load jobs ready for closure."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const submitClose = useCallback(async (input: CloseJobInput) => {
    setIsClosing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await closeJob(input);
      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== input.jobId),
      );
      setSuccessMessage("Job closed successfully.");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return result;
    } catch (error) {
      const message = getErrorMessage(error, "Unable to close the job.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsClosing(false);
    }
  }, []);

  return {
    jobs,
    isLoading,
    isClosing,
    error,
    successMessage,
    reload: loadJobs,
    submitClose,
  };
}
