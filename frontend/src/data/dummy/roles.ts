// DUMMY DATA - EASILY REMOVABLE
// This file contains dummy role data for prototype development
// TODO: Replace with real API calls in Phase 9 (Backend Integration)

import type { Role } from "../../shared/types/index";

export const dummyRoles: Role[] = [
  {
    id: "role-001",
    name: "HR Manager",
    description: "Full access to HR module including user management and attendance",
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["create", "read", "update", "delete"],
      },
      {
        permissionId: "hr-attendance-manage-others",
        actions: ["create", "read", "update", "delete", "approve", "message"],
      },
      {
        permissionId: "hr-schedules-manage",
        actions: ["create", "read", "update", "delete"],
      },
    ],
  },
  {
    id: "role-002",
    name: "Developer",
    description: "Standard developer role with basic HR permissions",
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read", "update", "delete"],
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"],
      },
    ],
  },
  {
    id: "role-003",
    name: "Admin",
    description: "Full system administrator access",
    permissions: [
      {
        permissionId: "hr-users-manage",
        actions: ["create", "read", "update", "delete"],
      },
      {
        permissionId: "hr-attendance-manage-others",
        actions: ["create", "read", "update", "delete", "approve", "message"],
      },
      {
        permissionId: "hr-schedules-manage",
        actions: ["create", "read", "update", "delete"],
      },
      {
        permissionId: "settings-manage",
        actions: ["read", "update"],
      },
    ],
  },
  {
    id: "role-004",
    name: "Team Lead",
    description: "Team leadership with approval permissions",
    permissions: [
      {
        permissionId: "hr-attendance-manage-others",
        actions: ["read", "approve", "message"],
      },
      {
        permissionId: "hr-schedules-manage",
        actions: ["read"],
      },
    ],
  },
  {
    id: "role-005",
    name: "Employee",
    description: "Basic employee access to own data",
    permissions: [
      {
        permissionId: "hr-attendance-manage-owns",
        actions: ["create", "read"],
      },
      {
        permissionId: "hr-attendance-clock",
        actions: ["true"],
      },
    ],
  },
];
