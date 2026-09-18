import {
  LayoutDashboard,
  Search,
  TrendingUp,
  Calendar,
  Shield,
  Folder,
  FileText,
  Users,
  ClipboardCheck,
  LucideIcon,
  Package,
} from "lucide-react";
import { Role, ROLES } from "./roles";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  allowedRoles: Role[];
}

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: [
      ROLES.ADMIN,
      ROLES.CS,
      ROLES.TRANSPORT_MANAGER,
      ROLES.TRANSPORT_STAFF,
      ROLES.REPAIR_MANAGER,
      ROLES.REPAIR_PERSON,
    ],
  },

  {
    href: "/dashboard/approve",
    label: "Approve Jobs",
    icon: ClipboardCheck,
    allowedRoles: [ROLES.CS, ROLES.TRANSPORT_MANAGER],
  },

  {
    href: "/dashboard/close-job",
    label: "Close Job",
    icon: LayoutDashboard,
    allowedRoles: [ROLES.CS],
  },

  {
    href: "/dashboard/pending-final-quotes",
    label: "Pending Final Quotes",
    icon: TrendingUp,
    allowedRoles: [ROLES.CS],
  },

  {
    href: "/dashboard/all-jobs",
    label: "All Jobs",
    icon: Search,
    allowedRoles: [ROLES.CS],
  },
  {
    href: "/dashboard/customers",
    label: "Customers",
    icon: Users,
    allowedRoles: [ROLES.CS],
  },
  {
    href: "dashboard/pending-orders",
    label: "Pending Orders",
    icon: Package,
    allowedRoles: [ROLES.TRANSPORT_STAFF],
  },
];
