

/* --------------------------------------------------
   Job
-------------------------------------------------- */

import { JobItemStatus, JobSummaryStatus } from "@/features/transport-team/types/transport-team.types";

export interface JobDetailsJob {
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

/* --------------------------------------------------
   Customer
-------------------------------------------------- */

export interface JobDetailsCustomer {
  id: string | null;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  billingAddress: string;
  gstin: string;
}

/* --------------------------------------------------
   Job status history
-------------------------------------------------- */

export interface JobStatusHistory {
  id: string;
  previousStatus: JobSummaryStatus | null;
  newStatus: JobSummaryStatus;
  note: string | null;
  createdAt: string;

  changedBy: {
    id: string;
    name: string | null;
    email: string | null;
    userType: "employee" | "customer" | null;
  } | null;
}

/* --------------------------------------------------
   Job item
-------------------------------------------------- */

export interface JobItem {
  id: string;
  jobId: string;

  deviceName: string;
  deviceCategory: string;
  deviceSerialNumber: string | null;

  issueDescription: string;
  issueCategory: string | null;

  repairLocation: string;
  currentStatus: JobItemStatus;

  isApprovedByCS: boolean;

  onsiteRepairAuthorized: boolean;
  repairFinishedOnsite: boolean;

  inlabRepairAuthorized: boolean;
  inlabRepairRejected: boolean;

  vendorOut: boolean;

  assignedRepairPersonId: string | null;

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

/* --------------------------------------------------
   Job item status history
-------------------------------------------------- */

export interface JobItemStatusHistory {
  id: string;
  jobItemId: string;
  previousStatus: JobItemStatus | null;
  newStatus: JobItemStatus;
  note: string | null;
  createdAt: string;
  changedBy: {
    id: string;
    name: string | null;
    email: string | null;
    userType: "employee" | "customer" | null;
  } | null;
}

/* --------------------------------------------------
   Item + history
-------------------------------------------------- */

export interface JobDetailsItem {
  item: JobItem;
  statusHistory: JobItemStatusHistory[];
}

export interface JobComment {
  id: string;
  jobId: string | null;
  jobItemId: string | null;
  userId: string;
  comment: string;
  createdAt: string;

  user: {
    id: string;
    name: string;
    email: string;
    userType: "employee" | "customer";
  };
}




/////////////////quote

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
  gstType: string;
  totalAmount: string;
  createdByUserId: string;
  status: string;
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
}

export interface JobItemQuoteLine {
  id: string;
  quoteId: string;
  name: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  sortOrder: number;
  warrantyMonths: number;
  createdAt: string;
}

export interface JobQuoteItem {
  itemQuote: JobItemQuote;
  lines: JobItemQuoteLine[];
}

export interface JobQuoteWithItems {
  quote: JobQuote;
  items: JobQuoteItem[];
}




//// invoice

export interface JobInvoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  customerId: string;
  quoteId: string;

  subtotal: string;
  serviceCharge: string;
  discount: string;

  cgst: string | null;
  sgst: string | null;
  igst: string | null;

  gstType: string;
  totalAmount: string;
  currency: string;
  status: string;

  pdfStorageKey: string | null;
  pdfFileName: string | null;
  templateVersion: number;
  pdfGeneratedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface JobInvoiceItem {
  id: string;
  invoiceId: string;
  jobItemId: string;

  name: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  warrantyMonths: number;
  sortOrder: number;

  createdAt: string;
}

export interface JobInvoiceWithItems {
  invoice: JobInvoice;
  items: JobInvoiceItem[];
}

//clousre

export interface JobClosure {
  id: string;
  jobId: string;
  closedByUserId: string;
  closingRemarks: string | null;
  customerConfirmed: boolean;
  notes: string | null;
  closedAt: string | null;
}

export interface JobDetailsData {
  job: JobDetailsJob;
  customer: JobDetailsCustomer;
  statusHistory: JobStatusHistory[];
  items: JobDetailsItem[];

  comments: JobComment[];
  quotes: JobQuoteWithItems[];
  invoice: JobInvoiceWithItems | null;
  closure: JobClosure | null;
}

/* --------------------------------------------------
   Complete response
-------------------------------------------------- */



export interface GetJobDetailsResponse {
  success: boolean;
  message: string;
  data: JobDetailsData;
}
