"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/config/nav.config";
import { hasAnyRole } from "@/config/roles";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const visibleItems = navItems.filter((item) =>
    hasAnyRole(user?.roles, item.allowedRoles),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <aside className="w-1/7 shrink-0 border-r bg-white">
      <nav className="sticky top-0 px-3 py-4">
        <p className="flex px-3 text-xl font-semibold uppercase tracking-wider text-muted-foreground justify-center mb-4">
          Menu
        </p>

        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const itemPath = item.href.split("#")[0];

            const isActive =
              itemPath === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(itemPath);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
