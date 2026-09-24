import { Button } from "@/components/ui/button";
import { JobWithItemsResult } from "@/features/cs/types/cs.types";
import Link from "next/link";
import { memo } from "react";


interface JobCardProps {
    jobData: JobWithItemsResult;
}

export const JobCard = memo(function JobCard({
    jobData,
}: JobCardProps) {
    return (
        <div className="rounded-lg border p-5">

            <h2 className="font-semibold">
                {jobData.job.jobNumber}
            </h2>

            <p>
                Customer:{" "}
                {jobData.customer.firstName}{" "}
                {jobData.customer.lastName}
            </p>

            <p>
                Email: {jobData.customer.email}
            </p>

            <p>
                Phone: {jobData.customer.phone}
            </p>

            <div className="mt-4">
                <h3 className="font-medium">
                    Items ({jobData.jobItems.length})
                </h3>

                {jobData.jobItems.map((item) => (
                    <div
                        key={item.id}
                        className="mt-2 rounded border p-3"
                    >
                        <p>{item.deviceName}</p>
                        <p>{item.deviceCategory}</p>
                        <p>{item.currentStatus}</p>
                    </div>
                ))}
            </div>
             <div className="mt-4">
        <Button>
          <Link
            href={`/dashboard/all-jobs/${jobData.job.jobNumber}`}
          >
            View Details
          </Link>
        </Button>
      </div>
        </div>
    );
});