// src/features/transport-team/types/transport-team.types.ts

// ---- Shared enums (mirrors backend db/schema/job-status.ts) ----
export type JobSummaryStatus =
  | "created"
  | "in_progress"
  | "assigning_pickup_Engineer"
  | "pending_visit"
  | "repair_started"
  | "going_to_lab"
  | "pending_final_quote"
  | "repair_in_progress"
  | "repair_completed"
  | "waitng_for_delivery"
  | "delivered"
  | "closed"
  | "done"
  | "cancelled";

export type JobItemStatus =
  | "created"
  | "pending_cs_verification"
  | "approved_for_transport"
  | "transport_visit_in_progress"
  | "pending_final_quote"
  | "removed_from_quote"
  | "pending_lab_receipt"
  | "received_at_lab"
  | "repair_started"
  | "assigned_to_repair_manager"
  | "assigned_to_repair_person"
  | "awaiting_customer_approval"
  | "third_party_repair"
  | "pending_repair_manager_inspection"
  | "ready_for_delivery"
  | "out_for_delivery"
  | "delivered"
  | "repair_rejected"
  | "cancelled";

export type RepairLocation = "customer_site" | "inlab";

// ---- Core entities (mirrors db/schema/jobs.ts + job-items.ts) ----
export interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  currentStatus: JobSummaryStatus;
  paymentConfirmed: boolean;
  isApprovedByCS: boolean;
  transportManagerId: string | null;
  assignedTransportTeamPersonId: string | null;
  repairManagerId: string | null;
  assignedDeliveryTechId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobItem {
  id: string;
  jobId: string;
  deviceName: string;
  deviceCategory: string;
  deviceSerialNumber: string | null;
  issueDescription: string;
  issueCategory: string | null;
  repairLocation: RepairLocation;
  currentStatus: JobItemStatus;
  isApprovedByCS: boolean;
  onsiteRepairAuthorized: boolean;
  repairFinishedOnsite: boolean;
  inlabRepairAuthorized: boolean;
  inlabRepairRejected: boolean;
  vendorOut: boolean;
  assignedRepairPersonId: string | null;
  // Decimals come back from the API as strings (e.g. "1500.00") — format with Number(...) in the UI
  estimatedComponentsCost: string | null;
  finalComponentsCost: string | null;
  serviceChargeApplied: string | null;
  isFinalQuoteApproved: boolean;
  requestedComponents: string | null;
  diagnosisNotes: string | null;
  repairNotes: string | null;
  baseRepairCost: string | null;
  isWarrantyClaim: boolean;
  originalJobItemId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  billingAddress: string | null;
}

// ---- GET /technician/assigned-jobs ----
export interface AssignedJobListItem {
  job: Job;
  customer: CustomerProfile | null;
  jobItems: JobItem[];
}

export interface GetAssignedJobsResponse {
  jobs: AssignedJobListItem[];
}

// ---- GET /technician/getjobdetailswithestimated-quote/:id ----
export type JobQuoteStatus = "estimate" | "pending" | "final" | "rejected";

import type { GstType } from "@/features/cs/types/cs.types";

export interface JobQuote {
  id: string;
  jobId: string;
  version: number;
  subtotal: string;
  serviceCharge: string;
  discount: string;
  cgst: string | null;
  sgst: string | null;
  igst: string | null;
  gstType: GstType;
  totalAmount: string;
  createdByUserId: string;
  status: JobQuoteStatus;
  createdAt: string;
}

export interface JobItemQuoteLine {
  id: string;
  quoteId: string;
  name: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  sortOrder: number;
  createdAt: string;
}

export interface JobItemQuote {
  id: string;
  jobQuoteId: string;
  jobItemId: string;
  componentsCost: string;
  serviceCharge: string;
  totalAmount: string;
  createdByUserId: string;
  createdAt: string;
  jobItem: JobItem | null;
  quoteLines: JobItemQuoteLine[];
}

export interface JobQuoteWithItems extends JobQuote {
  jobItemQuotes: JobItemQuote[];
}

export interface GetJobDetailsWithQuoteResponse {
  job: Job;
  customer: CustomerProfile | null;
  jobItems: JobItem[];
  quote: JobQuoteWithItems | null;
}

// ---- POST /technician/complete-inspection ----
export type InspectionDecision = "onsite" | "lab" | "reject";

export interface InspectionItemInput {
  jobItemId: string;
  decision: InspectionDecision;
  comment?: string;
}

export interface CompleteInspectionRequest {
  jobId: string;
  comment?: string;
  items: InspectionItemInput[];
}

export interface CompleteInspectionResponse {
  message: string;
  data: {
    job: Job;
    items: JobItem[];
  };
}

// ---- PATCH /technician/finish-repair ----
export interface FinishOnsiteRepairRequest {
  jobId: string;
  comment?: string;
}

export interface FinishOnsiteRepairResponse {
  message: string;
  data: {
    job: Job;
    items: JobItem[];
  };
}
