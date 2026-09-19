import api from "@/lib/api-client";
import {
  CloseableJob,
  CloseJobInput,
  CloseJobResponse,
  CustomerDetailsResponse,
  CustomerSearchResult,
  GenerateFinalQuoteRequest,
  GenerateFinalQuoteResponse,
  GetQuoteForJobResponse,
  JobWithItems,
  PendingApprovalsResponse,
  PendingFinalQuoteResponse,
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

//////////////////////////////////////////////////////New JOb Submiited by customer/////////////////////////////////////////

export async function getPendingApprovals(): Promise<PendingApprovalsResponse> {
  const res = await api.get("/cs/pending-approval");
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////getting quote, editing and spending////////////////////////////////////

export async function getJobsWaitngForFinalQuote(): Promise<PendingFinalQuoteResponse> {
  const res = await api.get<PendingFinalQuoteResponse>(
    "/cs/pending-final-quotes",
  );
  return res.data;
}

export async function getQuoteDetailsForAJob(
  jobId: string,
): Promise<GetQuoteForJobResponse> {
  const res = await api.get<GetQuoteForJobResponse>(`/cs/jobs/${jobId}/quote`);
  return res.data;
}

export async function generateFinalQuote(
  payload: GenerateFinalQuoteRequest,
): Promise<GenerateFinalQuoteResponse> {
  const res = await api.patch("/cs/final-quote", payload);
  return res.data;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////-----------------------closing a job -----------------------//////////////////////////////
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Job details API
export async function getJobDetails(jobId: string) {
  const res = await api.get(`/getjobdetails/${jobId}`);
  return res.data;
}

export async function getJobs(query: string = ""): Promise<JobWithItems[]> {
  const res = await api.get<{ jobs: JobWithItems[] }>(`/cs/jobs?q=${query}`);
  return res.data.jobs;
}
