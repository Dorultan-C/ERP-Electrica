// Permission definitions for the ERP system
// Following the pattern of modules.tsx and sections.tsx

import type { Permission } from '@/shared/types'

export const permissions: Permission[] = [
  // Super user permission (example for "all" access)
  {
    id: 'super-user',
    name: 'Super User',
    description: 'Full system access',
    moduleId: 'settings',
    sectionId: 'app',
    actions: ["true"]
  },
  
  // HR - Users: Manage users
  {
    id: 'hr-users-manage',
    name: 'User Management',
    description: 'Permission to create/view/update/delete Users',
    moduleId: 'hr',
    sectionId: 'users',
    actions: ["create", "read", "update", "delete"]
  },

  // HR - Attendance: Timesheet clock
  {
    id: 'hr-attendance-clock',
    name: "Attendance clock in/out",
    description: "Permission to clock in/out",
    moduleId: 'hr',
    sectionId: 'attendance',
    actions: ["true"]
  },

  // HR - Attendance: Manage own's attendance
  {
    id: 'hr-attendance-manage-owns',
    name: "Attendance Management: Own's",
    description: "Permission to create/view/update/delete own's attendance",
    moduleId: 'hr',
    sectionId: 'attendance',
    actions: ["create", "read", "update", "delete", "approve", "request_changes", "update_approved", "delete_approved"]
  },

  // HR - Attendance: Manage other's attendance
  {
    id: 'hr-attendance-manage-others',
    name: 'Attendance Management: Others',
    description: "Permission to create/view/update/delete other's attendance",
    moduleId: 'hr',
    sectionId: 'attendance',
    actions: ["create", "read", "update", "delete", "approve", "request_changes", "update_approved", "delete_approved"]
  },

  // HR - Users: View own's permissions
  {
    id: 'hr-users-permissions-owns',
    name: "Permissions Management: Own's",
    description: "Permission to view/request own's permissions",
    moduleId: 'hr',
    sectionId: 'users',
    actions: ["read_own", "read_all", "request"]
  },

  // HR - Users: Manage other's permissions
  {
    id: 'hr-users-permissions-others',
    name: 'Permissions Management: Others',
    description: "Permission to assign/revoke other's permissions",
    moduleId: 'hr',
    sectionId: 'users',
    actions: ["assign_all", "assign_own", "revoke_all", "revoke_own", "read_all", "read_own"]
  },

  // Download permission (for testing)
  {
    id: 'files-downloads-download',
    name: 'Download Files',
    description: 'Permission to download files in various formats',
    moduleId: 'files',
    sectionId: 'downloads',
    actions: ["pdf", "docx", "csv", "xlsx"]
  }
]