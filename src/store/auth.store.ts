import { create } from "zustand";
import { AuthUser, AuthUserProfile } from "../../types";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: AuthUserProfile | null;

  setAuth: (
    accessToken: string,
    user: AuthUser,
    userProfile: AuthUserProfile,
  ) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: AuthUser, userProfile: AuthUserProfile) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  setUserProfile: (userProfile: AuthUserProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (accessToken, user, userProfile) =>
    set({
      accessToken,
      user,
      userProfile,
      isAuthenticated: true,
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      isAuthenticated: true,
    }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setUserProfile: (userProfile) =>
    set({
      userProfile,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      userProfile: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
