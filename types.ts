import { Role } from "@/config/roles";

export type LoginDetails = {
  email: string;
  password: string;
};

export interface AuthUser {
  id: string;
  email: string;
  userType: string;
  roles: Role[];
  mustChangePassword: boolean;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
  userProfile: AuthUserProfile;
}

export interface AuthUserProfile {
  aadhaarNumber: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankName: string;
  currentAddress: string;
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  firstName: string;
  lastName: string;
  panNumber: string;
  permanentAddress: string;
  phone: string;
  specializations: string[];
  uanNumber: string;
  userId: string;
}
