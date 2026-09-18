import { Card } from "@/components/ui/card";
import { AssignedJobListItem } from "@/features/transport-team/types/transport-team.types";
import { cn } from "cn";
import { ChevronRight, Package, Phone, User } from "lucide-react";

interface JobCardProps {
  item: AssignedJobListItem;
  isSelected: boolean;
  onSelect: (jobId: string) => void;
}

export function JobCard({ item, isSelected, onSelect }: JobCardProps) {
  const { job, customer, jobItems } = item;
  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`.trim()
    : "Unknown customer";

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(job.id);
      }}
      className={cn(
        "cursor-pointer gap-1.5 p-3 m-1 shadow-sm transition-all hover:shadow-md",
        isSelected
          ? "border-l-4 border-l-primary bg-primary/5 shadow-md"
          : "hover:bg-muted/40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-heading text-sm font-semibold">
          {job.jobNumber}
        </span>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            isSelected && "translate-x-0.5 text-primary",
          )}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{customerName}</span>
        </div>

        {customer?.phone && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>{customer.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Package className="h-3.5 w-3.5 shrink-0" />
          <span>
            {jobItems.length} {jobItems.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </Card>
  );
}
