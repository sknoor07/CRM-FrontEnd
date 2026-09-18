import api from "@/lib/api-client";
import {
  AuthUser,
  AuthUserProfile,
  LoginDetails,
  LoginResponse,
} from "../../types";
interface CurrentUserResponse {
  user: AuthUser;
  userProfile: AuthUserProfile;
}
export const loginUser = async (loginDetails: LoginDetails,): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", loginDetails);
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post<{ accessToken: string }>("/auth/refresh");
  return response.data;
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await api.get<CurrentUserResponse>("/auth/me");

  return response.data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
