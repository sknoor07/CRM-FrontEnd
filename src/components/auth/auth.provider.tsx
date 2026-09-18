"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { refreshAccessToken, getCurrentUser } from "@/services/auth.service";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setLoading(true);

        const { accessToken } = await refreshAccessToken();

        const { user, userProfile } = await getCurrentUser();

        setAuth(accessToken, user, userProfile);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [setAuth, clearAuth, setLoading]);

  return children;
}
