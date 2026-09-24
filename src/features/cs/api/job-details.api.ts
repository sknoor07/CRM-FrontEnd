
import api from "@/lib/api-client";
import {
  GetJobDetailsResponse,
} from "../types/job-details.types";

export async function getJobDetails(
  jobNumber: string,
): Promise<GetJobDetailsResponse> {
  const response = await api.get<GetJobDetailsResponse>(
    `/jobs/${jobNumber}/details`,
  );

  return response.data;
}