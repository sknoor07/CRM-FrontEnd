"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, Shield, TrendingUp } from "lucide-react";

interface JobItem {
  id: string;
  deviceCategory: string;
  deviceSerialNumber: string | null;
  issueDescription: string;
  repairLocation: string;
  currentStatus: string;
  isApprovedByCs: boolean;
  estimatedComponentsCost: string | null;
}

interface OnsiteConfirmationProps {
  jobId?: string;
}

export function OnsiteConfirmation({ jobId }: OnsiteConfirmationProps = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobItem, setJobItem] = useState<JobItem | null>(null);
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  const [repairConfirmed, setRepairConfirmed] = useState(false);

  useEffect(() => {
    const fetchJobItem = async () => {
      // TODO: Fetch job item from API
      // const res = await fetch(`/api/jobs/${jobId}/item`);
      // const data = await res.json();
      // setJobItem(data.item);
      setIsLoading(false);
    };
    fetchJobItem();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading onsite confirmation…
      </div>
    );
  }

  if (!jobItem) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
        <Shield className="h-10 w-10 opacity-40" />
        <p className="text-sm">Job item not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg mb-4">
        Onsite Confirmation - {jobItem.deviceCategory}
      </h2>

      <div className="rounded-xl border bg-white shadow-sm p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Device Category</Label>
            <p className="font-medium mt-1">{jobItem.deviceCategory}</p>
          </div>
          <div>
            <Label>Serial Number</Label>
            <p className="font-medium mt-1">
              {jobItem.deviceSerialNumber || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-lg bg-muted/5">
          <Label>Issue Description</Label>
          <p className="mt-1">{jobItem.issueDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <Label>Repair Location</Label>
            <p className="font-medium mt-1">
              {jobItem.repairLocation === "customer_site"
                ? "Customer Site (Onsite)"
                : "Lab"}
            </p>
          </div>
          <div>
            <Label>CS Approved</Label>
            <p className="font-medium mt-1">
              {jobItem.isApprovedByCs ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 border-t rounded-l bg-primary/5">
          <h3 className="font-semibold mb-3">Confirmation</h3>

          <div className="space-y-3">
            <div>
              <Label>
                <input
                  type="checkbox"
                  checked={customerConfirmed}
                  onChange={(e) => setCustomerConfirmed(e.target.checked)}
                  className="mt-1"
                />
                Customer has confirmed onsite completion
              </Label>
            </div>

            <div>
              <Label>
                <input
                  type="checkbox"
                  checked={repairConfirmed}
                  onChange={(e) => setRepairConfirmed(e.target.checked)}
                  className="mt-1"
                />
                Repair work confirmed complete
              </Label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => {}}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => {}}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}