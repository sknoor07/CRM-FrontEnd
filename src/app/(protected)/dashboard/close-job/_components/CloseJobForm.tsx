"use client";

import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CloseableJob } from "../../../../../features/cs/types/cs.types";

interface CloseJobFormProps {
  job: CloseableJob;
  isClosing: boolean;
  error: string | null;
  onSubmit: (data: {
    customerConfirmed: boolean;
    paymentConfirmed: boolean;
    closureReason: string;
  }) => Promise<void>;
}

function displayJobName(job: CloseableJob): string {
  return job.jobNumber || `Job ${job.id.slice(0, 8)}`;
}

function displayCustomer(job: CloseableJob): string {
  const fullName = [
    job.customer.profile.firstName,
    job.customer.profile.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    job.customer.user.email ||
    job.customerId ||
    "Customer not available"
  );
}

export function CloseJobForm({
  job,
  isClosing,
  error,
  onSubmit,
}: CloseJobFormProps) {
  const [customerConfirmed, setCustomerConfirmed] =
    useState(false);

  const [paymentConfirmed, setPaymentConfirmed] =
    useState(false);

  const [closingRemarks, setClosingRemarks] =
    useState("");

  const [validationError, setValidationError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setValidationError(null);

    // Customer confirmation
    if (!customerConfirmed) {
      setValidationError(
        "Customer confirmation is required."
      );
      return;
    }

    // Payment confirmation
    if (!paymentConfirmed) {
      setValidationError(
        "Payment confirmation is required."
      );
      return;
    }

    // Closing remarks
    const remarks = closingRemarks.trim();

    if (!remarks) {
      setValidationError(
        "Closing remarks are required."
      );
      return;
    }

    if (remarks.length > 2000) {
      setValidationError(
        "Closing remarks cannot exceed 2000 characters."
      );
      return;
    }

    // Send data to parent
    await onSubmit({
      customerConfirmed,
      paymentConfirmed,
      closureReason: remarks,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border p-5"
    >
      {/* Job information */}
      <div>
        <h3 className="font-semibold">
          Close {displayJobName(job)}
        </h3>

        <p className="text-sm text-muted-foreground">
          {displayCustomer(job)}
        </p>
      </div>

      {/* Confirmations */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={customerConfirmed}
            onChange={(event) =>
              setCustomerConfirmed(event.target.checked)
            }
            className="mt-1"
          />

          <span>
            I confirm that the customer has confirmed
            completion of the Order.
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={paymentConfirmed}
            onChange={(event) =>
              setPaymentConfirmed(event.target.checked)
            }
            className="mt-1"
          />

          <span>
            Payment completed
          </span>
        </label>
      </div>

      {/* Closing remarks */}
      <div className="space-y-2">
        <label
          htmlFor="closureReason"
          className="text-sm font-medium"
        >
          Closing remarks
        </label>

        <textarea
          id="closureReason"
          value={closingRemarks}
          onChange={(event) =>
            setClosingRemarks(event.target.value)
          }
          maxLength={2000}
          rows={5}
          placeholder="Add the final closure notes…"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
        />

        <p className="text-right text-xs text-muted-foreground">
          {closingRemarks.length}/2000
        </p>
      </div>

      {/* Error */}
      {(validationError || error) && (
        <p className="text-sm text-destructive">
          {validationError || error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isClosing}
        className="w-full"
      >
        {isClosing && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}

        {isClosing
          ? "Closing job…"
          : "Close job"}
      </Button>
    </form>
  );
}