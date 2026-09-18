import api from "@/lib/api-client";
import {
  SubmitTransportJobApproveRequest,
  SubmitTransportJobApproveResponse,
  TMGetAllJobForPickupResponse,
} from "../types/transport.types";

export async function getPendingPickup(): Promise<TMGetAllJobForPickupResponse> {
  const res = await api.get<TMGetAllJobForPickupResponse>("/transport/pending");
  return res.data;
}

export async function assignPickUpPerson(
  payload: SubmitTransportJobApproveRequest,
): Promise<SubmitTransportJobApproveResponse> {
  const result = await api.patch<SubmitTransportJobApproveResponse>(
    "/transport/assign",
    payload,
  );
  return result.data;
}
