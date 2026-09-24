"use client";

import { Package } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { JobDetailsItem } from "@/features/cs/types/job-details.types";

import { JobItemCard } from "./JobItemCard";

interface JobItemsSectionProps {
  items: JobDetailsItem[];
}

export function JobItemsSection({
  items,
}: JobItemsSectionProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Repair Items
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            No repair items found for this job.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Package className="h-5 w-5" />
            Repair Items
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Devices and their individual repair workflows
          </p>
        </div>

        <span className="text-sm text-muted-foreground">
          {items.length}{" "}
          {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((itemData) => (
          <JobItemCard
            key={itemData.item.id}
            itemData={itemData}
          />
        ))}
      </div>
    </section>
  );
}