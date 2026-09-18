import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  InspectionDecision,
  JobItem,
} from "@/features/transport-team/types/transport-team.types";
import { DecisionSegmentedControl } from "./DecisionSegmentedControl";

interface InspectionItemCardProps {
  item: JobItem;
  decision: InspectionDecision | undefined;
  comment: string;
  onDecisionChange: (decision: InspectionDecision) => void;
  onCommentChange: (comment: string) => void;
  disabled?: boolean;
}

export function InspectionItemCard({
  item,
  decision,
  comment,
  onDecisionChange,
  onCommentChange,
  disabled,
}: InspectionItemCardProps) {
  return (
    <Card className="gap-2 p-3 shadow-sm m-1">
      <CardHeader className="px-0 pt-0">
        <div>
          <p className="text-sm font-medium">{item.deviceName}</p>
          <p className="text-xs text-muted-foreground">
            {item.deviceCategory}
            {item.deviceSerialNumber ? ` · S/N ${item.deviceSerialNumber}` : ""}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-3">
        <p className="text-sm text-muted-foreground">{item.issueDescription}</p>

        <DecisionSegmentedControl
          value={decision}
          onChange={onDecisionChange}
          disabled={disabled}
        />

        <Textarea
          placeholder="Notes for this item (optional)"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          disabled={disabled}
          className="min-h-14 text-sm"
          maxLength={2000}
        />
      </CardContent>
    </Card>
  );
}
