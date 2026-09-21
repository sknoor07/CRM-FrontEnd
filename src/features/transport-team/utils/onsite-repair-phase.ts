import { JobItem } from "../types/transport-team.types";

/**
 * Onsite items go through two phases while a job sits in
 * `repair_started`: waiting on the technician's inspection
 * decision, then (once the customer approves the quote)
 * actually mid-repair and ready to be marked complete.
 */
export function getOnsiteRepairPhase(items: JobItem[]) {
  const onsiteItems = items.filter(
    (item) => item.repairLocation === "customer_site",
  );

  const needsInspection = onsiteItems.some(
    (item) => item.currentStatus === "transport_visit_in_progress",
  );

  const readyForCompletion =
    !needsInspection &&
    onsiteItems.some((item) => item.currentStatus === "repair_started");

  return { needsInspection, readyForCompletion };
}