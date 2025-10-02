/**
 * Permission checking utilities for the ERP system
 * Provides flexible permission validation with logical combinations
 */

import type { User, PermissionRequirement, UserPermission } from '@/shared/types'
import { permissions } from '@/data/permissions'
import { dummyRoles } from '@/data/dummy/roles'

/**
 * Get permission definition by ID
 */
export function getPermissionById(id: string) {
  return permissions.find(permission => permission.id === id)
}

/**
 * Get all permissions for a user (combines individual permissions and role permissions)
 * @param user - The user object
 * @returns Array of all permissions (role permissions + individual permissions)
 */
function getAllUserPermissions(user: User | null | undefined): UserPermission[] {
  if (!user) return []

  const allPermissions: UserPermission[] = []
  const permissionMap = new Map<string, Set<string>>()

  // First, collect permissions from roles
  if (user.roleIds && user.roleIds.length > 0) {
    user.roleIds.forEach(roleId => {
      const role = dummyRoles.find(r => r.id === roleId)
      if (role?.permissions) {
        role.permissions.forEach(perm => {
          if (!permissionMap.has(perm.permissionId)) {
            permissionMap.set(perm.permissionId, new Set())
          }
          perm.actions.forEach(action =>
            permissionMap.get(perm.permissionId)!.add(action)
          )
        })
      }
    })
  }

  // Then, add/merge individual permissions
  if (user.permissions) {
    user.permissions.forEach(perm => {
      if (!permissionMap.has(perm.permissionId)) {
        permissionMap.set(perm.permissionId, new Set())
      }
      perm.actions.forEach(action =>
        permissionMap.get(perm.permissionId)!.add(action)
      )
    })
  }

  // Convert map to array of UserPermission objects
  permissionMap.forEach((actions, permissionId) => {
    allPermissions.push({
      permissionId,
      actions: Array.from(actions)
    })
  })

  return allPermissions
}

/**
 * Check if user is a super user (has super-user permission with "true" action)
 * Internal helper function used by other permission checks
 */
function isSuperUser(user: User | null | undefined): boolean {
  if (!user) return false

  const allPermissions = getAllUserPermissions(user)
  return allPermissions.some(permission =>
    permission.permissionId === 'super-user' &&
    (permission.actions.includes('true') || permission.actions.includes('*'))
  )
}

/**
 * Check if user has a specific permission and action
 * Checks both individual permissions and role-based permissions
 */
export function hasPermission(
  user: User | null | undefined,
  permissionId: string,
  action: string
): boolean {
  if (!user) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  const allPermissions = getAllUserPermissions(user)

  return allPermissions.some(permission => {
    // Check if permission ID matches
    if (permission.permissionId !== permissionId) return false

    // Check for "all" action (grants everything)
    if (permission.actions.includes('all') || permission.actions.includes('*')) {
      return true
    }

    // Check for specific action
    return permission.actions.includes(action)
  })
}

/**
 * Check if user has ANY of the specified permission requirements (OR logic)
 * Perfect for cases like download buttons with multiple permission options
 */
export function hasAnyPermission(
  user: User | null | undefined,
  requirements: PermissionRequirement[]
): boolean {
  if (!user || requirements.length === 0) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  return requirements.some(requirement =>
    hasPermission(user, requirement.permissionId, requirement.action)
  )
}

/**
 * Check if user has ALL of the specified permission requirements (AND logic)
 * Useful for complex operations requiring multiple permissions
 */
export function hasAllPermissions(
  user: User | null | undefined,
  requirements: PermissionRequirement[]
): boolean {
  if (!user || requirements.length === 0) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  return requirements.every(requirement =>
    hasPermission(user, requirement.permissionId, requirement.action)
  )
}

/**
 * Check if user has any action for a specific permission
 * Useful for checking general access to a feature/module
 * Checks both role permissions and individual permissions
 */
export function hasAnyActionForPermission(
  user: User | null | undefined,
  permissionId: string
): boolean {
  if (!user) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  const allPermissions = getAllUserPermissions(user)
  return allPermissions.some(permission =>
    permission.permissionId === permissionId && permission.actions.length > 0
  )
}

/**
 * Get all actions a user has for a specific permission
 * Useful for UI state management and conditional rendering
 * Merges actions from both role permissions and individual permissions
 */
export function getUserActionsForPermission(
  user: User | null | undefined,
  permissionId: string
): string[] {
  if (!user) return []

  const allPermissions = getAllUserPermissions(user)
  const userPermission = allPermissions.find(
    permission => permission.permissionId === permissionId
  )

  return userPermission?.actions || []
}

/**
 * Check if user has access to a module based on having any permission with matching moduleId
 * Checks both role permissions and individual permissions
 */
export function hasModuleAccess(
  user: User | null | undefined,
  moduleId: string
): boolean {
  if (!user) return false

  // Super users can access everything
  if (isSuperUser(user)) return true

  const allPermissions = getAllUserPermissions(user)

  // Check if user has any permission that belongs to this module
  return allPermissions.some(userPermission => {
    const permissionDef = permissions.find(p => p.id === userPermission.permissionId)
    return permissionDef?.moduleId === moduleId && userPermission.actions.length > 0
  })
}

/**
 * Check if user has access to a section based on having any permission with matching sectionId
 * Checks both role permissions and individual permissions
 */
export function hasSectionAccess(
  user: User | null | undefined,
  sectionId: string
): boolean {
  if (!user) return false

  // Super users can access everything
  if (isSuperUser(user)) return true

  const allPermissions = getAllUserPermissions(user)

  // Check if user has any permission that belongs to this section
  return allPermissions.some(userPermission => {
    const permissionDef = permissions.find(p => p.id === userPermission.permissionId)
    return permissionDef?.sectionId === sectionId && userPermission.actions.length > 0
  })
}


// Permission checking hook-like functions for easier component integration
export const PermissionUtils = {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasAnyActionForPermission,
  getUserActionsForPermission,
  hasModuleAccess,
  hasSectionAccess
} as const