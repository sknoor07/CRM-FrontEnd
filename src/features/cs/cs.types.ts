export type RepairLocation = "customer_site" | "inlab";

export type ApprovalDecision = "approved" | "rejected";

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
}

export interface JobWithItems {
  job: Job;
  jobItems: JobItem[];
}
export interface PendingApprovalRequest {
  count: number;
  jobs: JobWithItems[];
}

export interface PendingApprovalsResponse {
  count: number;
  jobs: JobWithItems[];
}

export type CloseJobInput = {
  jobId: string;
  customerConfirmed: true;
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
    billingAddress: unknown;
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

//customer
