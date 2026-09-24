"use client";

import {
  CalendarDays,
  CreditCard,
  FileCheck2,
  Hash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { JobDetailsJob } from "@/features/cs/types/job-details.types";

interface JobSummaryProps {
  job: JobDetailsJob;
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function JobSummary({ job }: JobSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">
              Job Summary
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Overview of this repair job
            </p>
          </div>

          <Badge variant="outline">
            {formatStatus(job.currentStatus)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Job Number */}
          <div className="flex items-start gap-3">
            <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Job Number
              </p>

              <p className="font-medium">
                {job.jobNumber}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-3">
            <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Payment
              </p>

              <p className="font-medium">
                {job.paymentConfirmed
                  ? "Confirmed"
                  : "Pending"}
              </p>
            </div>
          </div>

          {/* CS Approval */}
          <div className="flex items-start gap-3">
            <FileCheck2 className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                CS Approval
              </p>

              <p className="font-medium">
                {job.isApprovedByCS
                  ? "Approved"
                  : "Pending"}
              </p>
            </div>
          </div>

          {/* Created */}
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created
              </p>

              <p className="font-medium">
                {formatDate(job.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}