"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { navItems } from "@/config/nav.config";
import { hasAnyRole } from "@/config/roles";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const visibleItems = navItems.filter((item) =>
    hasAnyRole(user?.roles, item.allowedRoles),
  );

  return (
    <nav className="px-3 py-4">
      <p className="flex justify-center px-3 pb-4 text-xl font-semibold uppercase tracking-wider text-sidebar-foreground/60">
        Menu
      </p>

      <ul className="space-y-1">
        {visibleItems.map((item) => {
          const itemPath = `/${item.href.replace(/^\/?/, "")}`.split("#")[0];

          const isActive =
            itemPath === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(itemPath);

          return (
            <li key={item.href}>
              <Link
                href={itemPath}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function DashboardNav() {
  const user = useAuthStore((state) => state.user);
  const visibleCount = navItems.filter((item) =>
    hasAnyRole(user?.roles, item.allowedRoles),
  ).length;

  const desktopOpen = useSidebarStore((s) => s.desktopOpen);
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const closeMobile = useSidebarStore((s) => s.closeMobile);

  // Lock body scroll + close on Escape while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  if (visibleCount === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop / tablet — pushes content, fully hides when unpinned */}
      <aside
        className={cn(
          "hidden shrink-0 overflow-hidden bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:sticky md:top-16 md:flex md:h-[calc(100vh-4rem)]",
          desktopOpen
            ? "md:w-64 md:border-r md:border-sidebar-border"
            : "md:w-0",
        )}
      >
        <div className="w-64 shrink-0">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile — slide-in drawer with backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeMobile}
        />

        <div
          className={cn(
            "absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <NavLinks onNavigate={closeMobile} />
        </div>
      </div>
    </>
  );
}
