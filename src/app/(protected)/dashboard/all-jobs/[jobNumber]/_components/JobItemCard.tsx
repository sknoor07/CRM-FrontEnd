"use client";

import {
  BadgeCheck,
  MapPin,
  Package,
  ReceiptText,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  JobDetailsItem,
} from "@/features/cs/types/job-details.types";

import { ItemTimeline } from "./ItemTimeline";

interface JobItemCardProps {
  itemData: JobDetailsItem;
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatLocation(location: string) {
  if (location === "customer_site") {
    return "Customer Site";
  }

  if (location === "inlab") {
    return "In Lab";
  }

  return formatStatus(location);
}

export function JobItemCard({
  itemData,
}: JobItemCardProps) {
  const { item, statusHistory } = itemData;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-lg">
                {item.deviceName}
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.deviceCategory}
              </p>
            </div>
          </div>

          <Badge variant="outline">
            {formatStatus(item.currentStatus)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic information */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Serial Number
              </p>

              <p className="font-medium">
                {item.deviceSerialNumber || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Repair Location
              </p>

              <p className="font-medium">
                {formatLocation(item.repairLocation)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                CS Approval
              </p>

              <p className="font-medium">
                {item.isApprovedByCS
                  ? "Approved"
                  : "Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Issue */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />

            <h4 className="text-sm font-semibold">
              Reported Issue
            </h4>
          </div>

          <div className="rounded-md bg-muted/50 px-4 py-3">
            <p className="text-sm leading-relaxed">
              {item.issueDescription}
            </p>

            {item.issueCategory && (
              <p className="mt-2 text-xs text-muted-foreground">
                Category: {item.issueCategory}
              </p>
            )}
          </div>
        </div>

        {/* Repair information */}
        {(item.diagnosisNotes ||
          item.repairNotes ||
          item.requestedComponents) && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">
              Repair Information
            </h4>

            {item.diagnosisNotes && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Diagnosis
                </p>

                <p className="mt-1 text-sm">
                  {item.diagnosisNotes}
                </p>
              </div>
            )}

            {item.repairNotes && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Repair Notes
                </p>

                <p className="mt-1 text-sm">
                  {item.repairNotes}
                </p>
              </div>
            )}

            {item.requestedComponents && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Requested Components
                </p>

                <p className="mt-1 text-sm">
                  {item.requestedComponents}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cost information */}
        {(item.estimatedComponentsCost ||
          item.finalComponentsCost ||
          item.serviceChargeApplied ||
          item.baseRepairCost) && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ReceiptText className="h-4 w-4 text-muted-foreground" />

              <h4 className="text-sm font-semibold">
                Repair Cost Information
              </h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {item.baseRepairCost && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Base Repair Cost
                  </p>

                  <p className="font-medium">
                    ₹{item.baseRepairCost}
                  </p>
                </div>
              )}

              {item.estimatedComponentsCost && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Estimated Components
                  </p>

                  <p className="font-medium">
                    ₹{item.estimatedComponentsCost}
                  </p>
                </div>
              )}

              {item.finalComponentsCost && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Final Components
                  </p>

                  <p className="font-medium">
                    ₹{item.finalComponentsCost}
                  </p>
                </div>
              )}

              {item.serviceChargeApplied && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Service Charge
                  </p>

                  <p className="font-medium">
                    ₹{item.serviceChargeApplied}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Flags */}
        <div>
          <h4 className="mb-3 text-sm font-semibold">
            Repair Status
          </h4>

          <div className="flex flex-wrap gap-2">
            {item.onsiteRepairAuthorized && (
              <Badge variant="secondary">
                Onsite Repair Authorized
              </Badge>
            )}

            {item.repairFinishedOnsite && (
              <Badge variant="secondary">
                Finished Onsite
              </Badge>
            )}

            {item.inlabRepairAuthorized && (
              <Badge variant="secondary">
                In-Lab Repair Authorized
              </Badge>
            )}

            {item.inlabRepairRejected && (
              <Badge variant="destructive">
                In-Lab Repair Rejected
              </Badge>
            )}

            {item.vendorOut && (
              <Badge variant="secondary">
                Vendor Out
              </Badge>
            )}

            {item.isFinalQuoteApproved && (
              <Badge variant="secondary">
                Final Quote Approved
              </Badge>
            )}

            {item.isWarrantyClaim && (
              <Badge variant="secondary">
                Warranty Claim
              </Badge>
            )}
          </div>
        </div>

        {/* Item timeline */}
        <div className="border-t pt-6">
          <ItemTimeline history={statusHistory} />
        </div>
      </CardContent>
    </Card>
  );
}