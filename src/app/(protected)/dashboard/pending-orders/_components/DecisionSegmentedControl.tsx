import { InspectionDecision } from "@/features/transport-team/types/transport-team.types";
import { cn } from "cn";
import { CheckCircle2, FlaskConical, XCircle } from "lucide-react";

interface DecisionOption {
  value: InspectionDecision;
  label: string;
  icon: React.ElementType;
  activeClass: string;
}

const OPTIONS: DecisionOption[] = [
  {
    value: "onsite",
    label: "Onsite",
    icon: CheckCircle2,
    activeClass:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40",
  },
  {
    value: "lab",
    label: "Send to Lab",
    icon: FlaskConical,
    activeClass:
      "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/40",
  },
  {
    value: "reject",
    label: "Reject",
    icon: XCircle,
    activeClass: "bg-destructive/15 text-destructive border-destructive/40",
  },
];

interface DecisionSegmentedControlProps {
  value: InspectionDecision | undefined;
  onChange: (value: InspectionDecision) => void;
  disabled?: boolean;
}

export function DecisionSegmentedControl({
  value,
  onChange,
  disabled,
}: DecisionSegmentedControlProps) {
  return (
    <div role="radiogroup" className="grid grid-cols-3 gap-1.5 sm:gap-2">
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border border-border px-2 py-2 text-xs font-medium transition-colors",
              "hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? option.activeClass
                : "bg-transparent text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-center leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
