/**
 * Permission checking utilities for the ERP system
 * Provides flexible permission validation with logical combinations
 */

import type { User, PermissionRequirement } from '@/shared/types'
import { permissions } from '@/data/permissions'

/**
 * Get permission definition by ID
 */
export function getPermissionById(id: string) {
  return permissions.find(permission => permission.id === id)
}

/**
 * Check if user is a super user (has super-user permission with "true" action)
 * Internal helper function used by other permission checks
 */
function isSuperUser(user: User | null | undefined): boolean {
  if (!user?.permissions) return false

  return user.permissions.some(permission =>
    permission.permissionId === 'super-user' &&
    (permission.actions.includes('true') || permission.actions.includes('*'))
  )
}

/**
 * Check if user has a specific permission and action
 */
export function hasPermission(
  user: User | null | undefined,
  permissionId: string,
  action: string
): boolean {
  if (!user?.permissions) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  return user.permissions.some(permission => {
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
  if (!user?.permissions || requirements.length === 0) return false

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
  if (!user?.permissions || requirements.length === 0) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  return requirements.every(requirement =>
    hasPermission(user, requirement.permissionId, requirement.action)
  )
}

/**
 * Check if user has any action for a specific permission
 * Useful for checking general access to a feature/module
 */
export function hasAnyActionForPermission(
  user: User | null | undefined,
  permissionId: string
): boolean {
  if (!user?.permissions) return false

  // Super users can do everything
  if (isSuperUser(user)) return true

  return user.permissions.some(permission =>
    permission.permissionId === permissionId && permission.actions.length > 0
  )
}

/**
 * Get all actions a user has for a specific permission
 * Useful for UI state management and conditional rendering
 */
export function getUserActionsForPermission(
  user: User | null | undefined,
  permissionId: string
): string[] {
  if (!user?.permissions) return []

  const userPermission = user.permissions.find(
    permission => permission.permissionId === permissionId
  )

  return userPermission?.actions || []
}

/**
 * Check if user has access to a module based on having any permission with matching moduleId
 */
export function hasModuleAccess(
  user: User | null | undefined,
  moduleId: string
): boolean {
  if (!user?.permissions) return false

  // Super users can access everything
  if (isSuperUser(user)) return true

  // Check if user has any permission that belongs to this module
  return user.permissions.some(userPermission => {
    const permissionDef = permissions.find(p => p.id === userPermission.permissionId)
    return permissionDef?.moduleId === moduleId && userPermission.actions.length > 0
  })
}

/**
 * Check if user has access to a section based on having any permission with matching sectionId
 */
export function hasSectionAccess(
  user: User | null | undefined,
  sectionId: string
): boolean {
  if (!user?.permissions) return false

  // Super users can access everything
  if (isSuperUser(user)) return true

  // Check if user has any permission that belongs to this section
  return user.permissions.some(userPermission => {
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