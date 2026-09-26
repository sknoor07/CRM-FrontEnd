import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

type BadgeTone = "neutral" | "info" | "warning" | "success" | "destructive";

/**
 * Maps a raw job / job-item status string to a display label + color tone.
 * Falls back gracefully for any status not explicitly listed, so this
 * never breaks if new statuses get added on the backend later.
 */
function resolveTone(status: string): { label: string; tone: BadgeTone } {
  const map: Record<string, { label: string; tone: BadgeTone }> = {
    pending_visit: { label: "Pending Visit", tone: "warning" },
    transport_visit_in_progress: {
      label: "Inspection In Progress",
      tone: "info",
    },
    pending_final_quote: { label: "Pending Final Quote", tone: "info" },
    pending_lab_receipt: { label: "Sent To Lab", tone: "info" },
    repair_rejected: { label: "Rejected", tone: "destructive" },
    going_to_lab: { label: "Going To Lab", tone: "info" },
    repair_started: { label: "Repair Started", tone: "info" },
    repair_in_progress: { label: "Repair In Progress", tone: "info" },
    repair_completed: { label: "Repair Completed", tone: "success" },
    delivered: { label: "Delivered", tone: "success" },
    closed: { label: "Closed", tone: "success" },
    done: { label: "Done", tone: "success" },
    cancelled: { label: "Cancelled", tone: "destructive" },
    in_warranty_inspection:{label:"In Warranty Inspection",tone:"info"},
  };

  return (
    map[status] ?? {
      label: status.replace(/_/g, " "),
      tone: "neutral",
    }
  );
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: "",
  info: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  warning:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  destructive: "",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const { label, tone } = resolveTone(status);

  return (
    <Badge
      variant={tone === "destructive" ? "destructive" : "secondary"}
      className={cn("capitalize", toneClasses[tone], className)}
    >
      {label}
    </Badge>
  );
}
