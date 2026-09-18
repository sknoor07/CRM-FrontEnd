export const ROLES = {
  ADMIN: "admin",
  CS: "customer_service",
  TRANSPORT_MANAGER: "transport_manager",
  TRANSPORT_STAFF: "transport_team_person",
  REPAIR_MANAGER: "repair_manager",
  REPAIR_PERSON: "repair_person",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function hasAnyRole(
  userRoles: readonly string[] | undefined,
  allowedRoles: readonly Role[],
): boolean {
  return (
    !!userRoles &&
    userRoles.some((r) => (allowedRoles as readonly string[]).includes(r))
  );
}
