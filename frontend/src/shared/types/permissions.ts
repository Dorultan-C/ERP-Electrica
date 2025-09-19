// Generic permission interface
export interface Permission {
  id: string
  name: string
  description?: string
  moduleId: string
  sectionId: string
  actions: string[]
}

// User permission
export interface UserPermission {
  permissionId: string  // Permission ID reference
  actions: string[]     // Subset of permission.options that user has
}

// Permission requirement for checking (used in permission utilities)
export interface PermissionRequirement {
  permissionId: string
  action: string
}