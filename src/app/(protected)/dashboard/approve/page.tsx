"use client";
import { usePendingApprovals } from "@/features/cs/hooks/usePendingApprovals";

import { ClipboardCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "./_cscomponents/JobCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import OrderDetailedCard from "./_cscomponents/OrderDetailedCard";
import { Job, JobWithItems } from "@/features/cs/types/cs.types";
import { useAuthStore } from "@/store/auth.store";
import CsApprovePage from "./_cscomponents/CsApprovePage";
import TransportApprovePage from "./_transportComponents/TransportApprovePage";

export default function ApproveJobsPage() {
  const user = useAuthStore((s) => s.user);

  if (user?.roles.includes("customer_service")) {
    return <CsApprovePage />;
  }

  if (user?.roles.includes("transport_manager")) {
    return <TransportApprovePage />;
  }

  return (
    <div className="p-6">
      <p>You are not authorized to access this page.</p>
    </div>
  );
}
