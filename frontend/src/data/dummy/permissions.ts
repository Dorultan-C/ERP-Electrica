// DUMMY DATA - EASILY REMOVABLE
// This file contains dummy permissions and roles data for prototype development
// TODO: Replace with real API calls in Phase 9 (Backend Integration)

import type { Permission, Role, PermissionAction } from "../../shared/types/index";

// Dummy Permissions organized by module and section
export const dummyPermissions: Permission[] = [
  // Dashboard permissions
  {
    id: "perm-001",
    name: "dashboard.view",
    description: "View dashboard",
    moduleId: "module-dashboard",
    sectionId: "section-dashboard-main",
    action: "read"
  },
  {
    id: "perm-002",
    name: "dashboard.widgets.manage",
    description: "Manage dashboard widgets",
    moduleId: "module-dashboard",
    sectionId: "section-dashboard-main",
    action: "manage"
  },

  // Settings permissions
  {
    id: "perm-003",
    name: "settings.company.view",
    description: "View company settings",
    moduleId: "module-settings",
    sectionId: "section-settings-company",
    action: "read"
  },
  {
    id: "perm-004",
    name: "settings.company.manage",
    description: "Manage company settings",
    moduleId: "module-settings",
    sectionId: "section-settings-company",
    action: "manage"
  },
  {
    id: "perm-005",
    name: "settings.app.view",
    description: "View app settings",
    moduleId: "module-settings",
    sectionId: "section-settings-app",
    action: "read"
  },
  {
    id: "perm-006",
    name: "settings.app.manage",
    description: "Manage app settings",
    moduleId: "module-settings",
    sectionId: "section-settings-app",
    action: "manage"
  },

  // HR Users permissions
  {
    id: "perm-007",
    name: "hr.users.view",
    description: "View users list",
    moduleId: "module-hr",
    sectionId: "section-hr-users",
    action: "read"
  },
  {
    id: "perm-008",
    name: "hr.users.create",
    description: "Add new users",
    moduleId: "module-hr",
    sectionId: "section-hr-users",
    action: "create"
  },
  {
    id: "perm-009",
    name: "hr.users.edit",
    description: "Edit user information",
    moduleId: "module-hr",
    sectionId: "section-hr-users",
    action: "update"
  },
  {
    id: "perm-010",
    name: "hr.users.delete",
    description: "Delete users",
    moduleId: "module-hr",
    sectionId: "section-hr-users",
    action: "delete"
  },

  // HR Vacations permissions
  {
    id: "perm-011",
    name: "hr.vacations.view",
    description: "View vacation requests",
    moduleId: "module-hr",
    sectionId: "section-hr-vacations",
    action: "read"
  },
  {
    id: "perm-012",
    name: "hr.vacations.request",
    description: "Request vacation time",
    moduleId: "module-hr",
    sectionId: "section-hr-vacations",
    action: "create"
  },
  {
    id: "perm-013",
    name: "hr.vacations.approve",
    description: "Approve/reject vacation requests",
    moduleId: "module-hr",
    sectionId: "section-hr-vacations",
    action: "approve"
  },
  {
    id: "perm-014",
    name: "hr.vacations.manage_holidays",
    description: "Manage public holidays and closing days",
    moduleId: "module-hr",
    sectionId: "section-hr-vacations",
    action: "manage"
  },

  // HR Leave of Absence permissions
  {
    id: "perm-015",
    name: "hr.loa.view",
    description: "View leave of absence requests",
    moduleId: "module-hr",
    sectionId: "section-hr-loa",
    action: "read"
  },
  {
    id: "perm-016",
    name: "hr.loa.request",
    description: "Request leave of absence",
    moduleId: "module-hr",
    sectionId: "section-hr-loa",
    action: "create"
  },
  {
    id: "perm-017",
    name: "hr.loa.approve",
    description: "Approve/reject LOA requests",
    moduleId: "module-hr",
    sectionId: "section-hr-loa",
    action: "approve"
  },

  // HR Attendance permissions
  {
    id: "perm-018",
    name: "hr.attendance.view",
    description: "View attendance and timesheets",
    moduleId: "module-hr",
    sectionId: "section-hr-attendance",
    action: "read"
  },
  {
    id: "perm-019",
    name: "hr.attendance.edit_own",
    description: "Edit own timesheets",
    moduleId: "module-hr",
    sectionId: "section-hr-attendance",
    action: "update",
    resource: "own"
  },
  {
    id: "perm-020",
    name: "hr.attendance.edit_all",
    description: "Edit all employee timesheets",
    moduleId: "module-hr",
    sectionId: "section-hr-attendance",
    action: "update",
    resource: "all"
  },
  {
    id: "perm-021",
    name: "hr.attendance.approve",
    description: "Approve timesheets",
    moduleId: "module-hr",
    sectionId: "section-hr-attendance",
    action: "approve"
  },

  // HR Schedules permissions
  {
    id: "perm-022",
    name: "hr.schedules.view",
    description: "View work schedules",
    moduleId: "module-hr",
    sectionId: "section-hr-schedules",
    action: "read"
  },
  {
    id: "perm-023",
    name: "hr.schedules.create",
    description: "Create new schedules",
    moduleId: "module-hr",
    sectionId: "section-hr-schedules",
    action: "create"
  },
  {
    id: "perm-024",
    name: "hr.schedules.edit",
    description: "Edit work schedules",
    moduleId: "module-hr",
    sectionId: "section-hr-schedules",
    action: "update"
  },
  {
    id: "perm-025",
    name: "hr.schedules.assign",
    description: "Assign schedules to employees",
    moduleId: "module-hr",
    sectionId: "section-hr-schedules",
    action: "manage"
  }
];

// Dummy Roles with different permission sets
export const dummyRoles: Role[] = [
  {
    id: "role-001",
    name: "Employee",
    description: "Basic employee role with self-service capabilities",
    permissionIds: [
      "perm-001", // dashboard.view
      "perm-011", // hr.vacations.view
      "perm-012", // hr.vacations.request
      "perm-015", // hr.loa.view
      "perm-016", // hr.loa.request
      "perm-018", // hr.attendance.view
      "perm-019", // hr.attendance.edit_own
      "perm-022"  // hr.schedules.view
    ]
  },
  {
    id: "role-002",
    name: "HR Manager",
    description: "Human Resources manager with full HR module access",
    permissionIds: [
      "perm-001", // dashboard.view
      "perm-002", // dashboard.widgets.manage
      "perm-007", // hr.users.view
      "perm-008", // hr.users.create
      "perm-009", // hr.users.edit
      "perm-010", // hr.users.delete
      "perm-011", // hr.vacations.view
      "perm-012", // hr.vacations.request
      "perm-013", // hr.vacations.approve
      "perm-014", // hr.vacations.manage_holidays
      "perm-015", // hr.loa.view
      "perm-016", // hr.loa.request
      "perm-017", // hr.loa.approve
      "perm-018", // hr.attendance.view
      "perm-019", // hr.attendance.edit_own
      "perm-020", // hr.attendance.edit_all
      "perm-021", // hr.attendance.approve
      "perm-022", // hr.schedules.view
      "perm-023", // hr.schedules.create
      "perm-024", // hr.schedules.edit
      "perm-025"  // hr.schedules.assign
    ]
  },
  {
    id: "role-003",
    name: "System Admin",
    description: "Full system administrator with all permissions",
    permissionIds: [
      // All permissions
      ...dummyPermissions.map(p => p.id)
    ]
  },
  {
    id: "role-004",
    name: "Team Lead",
    description: "Team leader with approval permissions for their team",
    permissionIds: [
      "perm-001", // dashboard.view
      "perm-002", // dashboard.widgets.manage
      "perm-007", // hr.users.view
      "perm-011", // hr.vacations.view
      "perm-012", // hr.vacations.request
      "perm-013", // hr.vacations.approve
      "perm-015", // hr.loa.view
      "perm-016", // hr.loa.request
      "perm-017", // hr.loa.approve
      "perm-018", // hr.attendance.view
      "perm-019", // hr.attendance.edit_own
      "perm-021", // hr.attendance.approve
      "perm-022"  // hr.schedules.view
    ]
  },
  {
    id: "role-005",
    name: "Intern",
    description: "Limited access role for interns",
    permissionIds: [
      "perm-001", // dashboard.view
      "perm-011", // hr.vacations.view (own only)
      "perm-018", // hr.attendance.view (own only)
      "perm-022"  // hr.schedules.view
    ]
  }
];

// Helper functions for dummy permissions and roles
export const getDummyPermissionById = (id: string): Permission | undefined => {
  return dummyPermissions.find(permission => permission.id === id);
};

export const getDummyPermissionsByIds = (ids: string[]): Permission[] => {
  return dummyPermissions.filter(permission => ids.includes(permission.id));
};

export const getDummyPermissionsByModule = (moduleId: string): Permission[] => {
  return dummyPermissions.filter(permission => permission.moduleId === moduleId);
};

export const getDummyPermissionsBySection = (sectionId: string): Permission[] => {
  return dummyPermissions.filter(permission => permission.sectionId === sectionId);
};

export const getDummyPermissionsByAction = (action: PermissionAction): Permission[] => {
  return dummyPermissions.filter(permission => permission.action === action);
};

export const getDummyRoleById = (id: string): Role | undefined => {
  return dummyRoles.find(role => role.id === id);
};

export const getDummyRolesByIds = (ids: string[]): Role[] => {
  return dummyRoles.filter(role => ids.includes(role.id));
};

export const getDummyRolePermissions = (roleId: string): Permission[] => {
  const role = getDummyRoleById(roleId);
  if (!role) return [];
  return getDummyPermissionsByIds(role.permissionIds);
};

export const checkDummyUserPermission = (userPermissionIds: string[], requiredPermissionId: string): boolean => {
  return userPermissionIds.includes(requiredPermissionId);
};

export const checkDummyUserPermissions = (userPermissionIds: string[], requiredPermissionIds: string[]): boolean => {
  return requiredPermissionIds.every(permId => userPermissionIds.includes(permId));
};