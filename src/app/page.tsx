"use client";
import { useRouter } from "next/navigation";
import LogIn from "./(auth)/login/page";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  // While session restore is in flight, or redirect is happening,
  // render nothing (avoids a flash of the login form).
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <LogIn />
    </div>
  );
}
