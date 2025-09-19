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

  // HR - Attendance: Manage personal attendance
  {
    id: 'hr-attendance-manage-personal',
    name: 'Attendance Management',
    description: 'Permission to create/view/update/delete personal attendance',
    moduleId: 'hr',
    sectionId: 'attendance',
    actions: ["create", "read", "update", "delete"]
  },

  // HR - Attendance: Manage others attendance
  {
    id: 'hr-attendance-manage-others',
    name: 'Attendance Management',
    description: 'Permission to create/view/update/delete others attendance',
    moduleId: 'hr',
    sectionId: 'attendance',
    actions: ["create", "read", "update", "delete"]
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