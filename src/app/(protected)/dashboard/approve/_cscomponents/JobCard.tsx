import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobWithItems } from "@/features/cs/types/cs.types";
import { useState } from "react";

interface JobCardProps {
  allJobsWithItems: JobWithItems;
  setDetailedForm: (value: boolean) => void;
}
const JobCard = ({ allJobsWithItems, setDetailedForm }: JobCardProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Job Number: {allJobsWithItems.job.jobNumber}</CardTitle>
          <CardDescription>
            Current Status:{" "}
            {allJobsWithItems.job.currentStatus === "in_progress"
              ? "Pending Verification"
              : "In Progress"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className={"cursor-pointer"}
            onClick={() => {
              setDetailedForm(true);
            }}
          >
            View Order Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCard;
