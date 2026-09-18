import { Job, JobItem } from "@/features/cs/cs.types";

export interface customer {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  billingAddress: string | null;
}
export interface TMGetAllJobForPickup {
  job: Job;
  customer: customer;
  jobItems: JobItem[];
}

export interface TMGetAllJobForPickupResponse {
  count: number;
  jobs: TMGetAllJobForPickup[];
}

export interface TransportPerson {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
}

export interface ListofTransportPerson {
  message: string;
  pickupPersonDetails: TransportPerson[];
}

export interface SubmitTransportJobApproveRequest {
  jobId: string;
  transportPersonId: string;
  comment: string;
}

export interface SubmitTransportJobApproveResponse {
  status: string;
  message: string;
}
