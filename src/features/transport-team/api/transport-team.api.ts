import api from "@/lib/api-client";
import {
  AssignedJobListItem,
  CompleteInspectionRequest,
  CompleteInspectionResponse,
  FinishOnsiteRepairRequest,
  FinishOnsiteRepairResponse,
  GetJobDetailsWithQuoteResponse,
} from "../types/transport-team.types";

export async function getAssignedJobs(): Promise<AssignedJobListItem[]> {
  const res = await api.get<{ jobs: AssignedJobListItem[] }>(
    "/technician/assigned-jobs",
  );
  return res.data.jobs;
}

export async function getJobDetailsWithEstimatedQuote(
  jobId: string,
): Promise<GetJobDetailsWithQuoteResponse> {
  const res = await api.get<GetJobDetailsWithQuoteResponse>(
    `/technician/getjobdetailswithestimated-quote/${jobId}`,
  );
  console.log(res);
  return res.data;
}

export async function completeTransportInspection(
  payload: CompleteInspectionRequest,
): Promise<CompleteInspectionResponse> {
  const res = await api.post<CompleteInspectionResponse>(
    "/technician/complete-inspection",
    payload,
  );
  return res.data;
}

export async function finishOnsiteRepair(
  payload: FinishOnsiteRepairRequest,
): Promise<FinishOnsiteRepairResponse> {
  const res = await api.patch<FinishOnsiteRepairResponse>(
    "/technician/finish-repair",
    payload,
  );
  return res.data;
}
