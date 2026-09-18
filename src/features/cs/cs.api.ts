import api from "@/lib/api-client";
import {
  CloseableJob,
  CloseJobInput,
  CloseJobResponse,
  CustomerDetailsResponse,
  CustomerSearchResult,
  JobWithItems,
  PendingApprovalRequest,
  PendingApprovalsResponse,
  ReadyForClosureResponse,
  SubmitCSJobApprovalInput,
  SubmitCSJobApprovalResponse,
} from "./cs.types";

//customer api
export async function searchCustomers(
  query: string,
): Promise<CustomerSearchResult[]> {
  const response = await api.get<{
    status: "success";
    data: CustomerSearchResult[];
  }>("/cs/search", {
    params: { q: query.trim() },
  });

  return response.data.data;
}

export async function getCustomerDetailsWithJobs(
  customerId: string,
): Promise<CustomerDetailsResponse> {
  const response = await api.get<CustomerDetailsResponse>(
    `/cs/getCustomerDetails/${customerId}`,
  );

  return response.data;
}

export async function getPendingApprovals(): Promise<PendingApprovalRequest> {
  const res = await api.get<PendingApprovalRequest>("/cs/pending-approval");
  return res.data;
}

export async function submitCSJobApproval(
  input: SubmitCSJobApprovalInput,
): Promise<SubmitCSJobApprovalResponse> {
  const response = await api.patch<SubmitCSJobApprovalResponse>(
    "/cs/submit-job",
    input,
  );

  return response.data;
}

export async function getJobsReadyForClosure(): Promise<CloseableJob[]> {
  const response = await api.get<ReadyForClosureResponse>(
    "/cs/ready-for-closure",
  );
  console.log(response);

  return response.data.jobs.map(
    ({ job, customer, items }): CloseableJob => ({
      ...job,
      customer,
      items,
    }),
  );
}

export async function closeJob(
  input: CloseJobInput,
): Promise<CloseJobResponse> {
  const response = await api.patch<CloseJobResponse>("/cs/close", input);
  return response.data;
}

// Job details API
export async function getJobDetails(jobId: string) {
  const res = await api.get(`/getjobdetails/${jobId}`);
  return res.data;
}

export async function getJobs(query: string = ""): Promise<JobWithItems[]> {
  const res = await api.get<{ jobs: JobWithItems[] }>(`/cs/jobs?q=${query}`);
  return res.data.jobs;
}
