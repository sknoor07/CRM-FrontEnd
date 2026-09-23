export type RepairLocation = "customer_site" | "inlab";

export type ApprovalDecision = "approved" | "rejected";

export interface LatestComment {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
}
export interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  currentStatus: string;
  paymentConfirmed: boolean;
  isApprovedByCS: boolean | null;
  transportManagerId: string | null;
  assignedTransportTeamPersonId: string | null;
  repairManagerId: string | null;
  assignedDeliveryTechId: string | null;
  createdAt: string;
  updatedAt: string;
  latestComment: LatestComment | null;
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

  currentStatus: string;
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

  requestedComponents: unknown;

  diagnosisNotes: string | null;
  repairNotes: string | null;
  baseRepairCost: string | null;

  isWarrantyClaim: boolean;
  originalJobItemId: string | null;

  createdAt: string;
  updatedAt: string;
  latestComment: LatestComment | null;
}

export interface JobWithItems {
  job: Job;
  jobItems: JobItem[];
}
export interface CustomerSummary {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  billingAddress: unknown;
}
export interface JobWithCustomerAndItems {
  job: Job;
  customer: CustomerSummary;
  items: JobItem[];
}

export interface PendingApprovalsResponse {
  count: number;
  jobs: JobWithItems[];
}

//////////////////get all jobs,items and quote and send to customer for customer approval.//////////////////////////////////

export interface PendingFinalQuoteJob {
  job: Job;
  customer: CustomerSummary;
  items: JobItem[];
}

export interface PendingFinalQuoteResponse {
  status: "success" | "error";
  count: number;
  jobs: PendingFinalQuoteJob[];
}

export type GstType = "none" | "intra_state" | "inter_state";

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
  createdAt: string;
}
export interface JobItemQuoteResponse {
  jobItemId: string;
  quote: JobItemQuote | null;
  lines: JobItemQuoteLine[];
  latestComment: LatestComment | null;
}
export interface QuoteDetails {
  quote: JobQuote | null;
  latestComment: LatestComment | null;
  items: JobItemQuoteResponse[];
}
export interface GetQuoteForJobResponse {
  status: "success" | "error";
  data: QuoteDetails;
}

export interface FinalQuoteComponentInput {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface FinalQuoteItemInput {
  jobItemId: string;
  components?: FinalQuoteComponentInput[];
  serviceCharge?: number;
  comment?: string;
}

export interface GenerateFinalQuoteRequest {
  jobId: string;
  items: FinalQuoteItemInput[];
  comment: string;
  discount: number;
  cgst: number | null;
  sgst: number | null;
  igst: number | null;
  gstType: GstType;
}

export interface GenerateFinalQuoteResponse {
  status: "success" | "error";
  message?: string;
  data: {
    quote: JobQuote;
    latestComment: LatestComment | null;
    items: JobItemQuoteResponse[];
  };
}

///////////////////////////////////////////////////////////////

export type CloseJobInput = {
  jobId: string;
  customerConfirmed: boolean;
  paymentConfirmed: boolean;
  closureReason: string;
};

export type CloseableJobItem = {
  jobItems: JobItem[];
};

export type CloseableCustomer = {
  user: {
    id: string;
    email: string;
    userType: string;
    phone: string | null;
    isActive: boolean;
    mustChangePassword: boolean;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    userId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    billingAddress: string | "Address Not Available";
  };
};

export type CloseableJobSummary = {
  id: string;
  jobNumber?: string | null;
  customerId?: string | null;
  currentStatus?: string | null;
  isApprovedByCS?: boolean;
  transportManagerId?: string | null;
  assignedTransportTeamPersonId?: string | null;
  assignedDeliveryTechId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CloseableJob = CloseableJobSummary & {
  customer: CloseableCustomer;
  items: CloseableJobItem[];
};

export type ReadyForClosureRecord = {
  job: CloseableJobSummary;
  customer: CloseableCustomer;
  items: CloseableJobItem[];
};

export type ReadyForClosureResponse = {
  count: number;
  jobs: ReadyForClosureRecord[];
};

export type CloseJobResponse = {
  message?: string;
  job?: CloseableJobSummary & {
    currentStatus: "closed" | string;
    paymentConfirmed: boolean;
  };
  closure?: {
    id: string;
    jobId: string;
    closedByUserId: string;
    closingRemarks: string | null;
    customerConfirmed: boolean;
    notes: string | null;
    closedAt: string;
  };
  comment?: {
    id: string;
    jobId: string;
    jobItemId: string | null;
    userId: string;
    comment: string;
    createdAt: string;
  };
};

export type QuoteComponentInput = {
  name: string;
  quantity: number;
  unitPrice: number;
};
export type CSApprovalItemInput = {
  jobItemId: string;
  decision: "approved" | "rejected" | "";
  deviceName: string;
  deviceCategory: string;
  deviceSerialNumber: string | null;
  issueDescription: string;
  issueCategory: string | null;
  repairLocation: "customer_site" | "inlab";
  comment: string;
  estimatedComponents: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
};

export type SubmitCSJobApprovalInput = {
  jobId: string;
  comment: string;
  items: CSApprovalItemInput[];
};

export type SubmitCSJobApprovalResponse = {
  status: "success" | "error";
  message: string;
  decision: ApprovalDecision;
  job: Job;
  jobItems: JobItem[];
};

//customer

export type CustomerSearchResult = {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
};

export type CustomerJob = {
  id: string;
  jobNumber: string;
  customerId: string;
  currentStatus: string;
  paymentConfirmed: boolean;
  isApprovedByCS: boolean | null;
  transportManagerId: string | null;
  assignedTransportTeamPersonId: string | null;
  assignedDeliveryTechId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerDetailsResponse = Array<{
  customerProfile: {
    userId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    billingAddress: unknown;
  };
  jobs: CustomerJob[];
}>;

export interface JobDetailsResponse {
  job: {
    id: string;
    jobNumber: string;
    customerId: string;
    currentStatus: string;
    isApprovedByCS: boolean | null;
    transportManagerId: string | null;
    assignedTransportTeamPersonId: string | null;
    assignedDeliveryTechId: string | null;
    repairManagerId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  jobHistory: Array<{
    id: string;
    jobId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  items: Array<{
    id: string;
    jobId: string;
    deviceCategory: string;
    deviceSerialNumber: string | null;
    issueDescription: string;
    issueCategory: string | null;
    repairLocation: string;
    currentStatus: string;
    isApprovedByCS: boolean;
    assignedRepairPersonId: string | null;
    estimatedComponentsCost: string | null;
    finalComponentsCost: string | null;
    serviceChargeApplied: string | null;
    isFinalQuoteApproved: boolean;
    requestedComponents: unknown;
    diagnosisNotes: string | null;
    repairNotes: string | null;
    baseRepairCost: string | null;
    isWarrantyClaim: boolean;
    originalJobItemId: string | null;
    createdAt: string;
    updatedAt: string;
    history: Array<{
      id: string;
      jobItemId: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
}
