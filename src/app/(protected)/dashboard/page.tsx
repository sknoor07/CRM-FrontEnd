"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [showAnalytics, setShowAnalytics] = useState(true);

  if (showAnalytics) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Customer Service Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="text-3xl font-bold text-primary">5</div>
            <p className="text-sm text-muted-foreground mt-1">
              Jobs Waiting for Approval
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="text-3xl font-bold text-success">2</div>
            <p className="text-sm text-muted-foreground mt-1">Closed Today</p>
          </div>
          <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="text-3xl font-bold text-info">15</div>
            <p className="text-sm text-muted-foreground mt-1">
              Total Quotes Generated
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-4">
        Dashboard modules are now accessed through dedicated pages.
      </p>
      <ul className="space-y-4">
        <li>
          <a
            href="/dashboard/close-job"
            className="text-primary hover:text-primary/90"
          >
            Close Job - Jobs Ready for Closure
          </a>
        </li>
        <li>
          <a
            href="/dashboard/all-jobs"
            className="text-primary hover:text-primary/90"
          >
            All Jobs - Search and View Details
          </a>
        </li>
        <li>
          <a
            href="/dashboard/pending-final-quotes"
            className="text-primary hover:text-primary/90"
          >
            Pending Final Quotes - Generate Quotes
          </a>
        </li>
      </ul>
    </div>
  );
}
