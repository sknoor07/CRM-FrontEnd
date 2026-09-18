"use client";

import { useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { logoutUser } from "@/services/auth.service";

export function DashboardHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userProfile = useAuthStore((s) => s.userProfile);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const desktopOpen = useSidebarStore((s) => s.desktopOpen);
  const toggleDesktop = useSidebarStore((s) => s.toggleDesktop);
  const toggleMobile = useSidebarStore((s) => s.toggleMobile);

  const displayName = userProfile
    ? `${userProfile.firstName ?? ""} ${userProfile.lastName ?? ""}`.trim()
    : (user?.email ?? "User");

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Clear local state even if the call fails.
    } finally {
      clearAuth();
      router.push("/login");
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={toggleMobile}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="hidden md:inline-flex"
          onClick={toggleDesktop}
          aria-label={desktopOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {desktopOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          CS
        </div>
        <span className="hidden text-lg font-semibold tracking-tight sm:inline">
          Crestwave Technology
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
          <User className="h-4 w-4" />
          <span>{displayName || "User"}</span>
          {user?.roles?.map((role) => (
            <span
              key={role}
              className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize"
            >
              {role.replace(/_/g, " ")}
            </span>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="cursor-pointer gap-2 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
