/**
 * usePermissions Hook
 * Provides convenient permission checking functions integrated with AuthContext
 * Simplifies permission checks in React components
 */

import { useAuth } from '@/shared/contexts'
import {
  hasPermission as hasPermissionUtil,
  hasAnyPermission as hasAnyPermissionUtil,
  hasAllPermissions as hasAllPermissionsUtil,
  hasAnyActionForPermission as hasAnyActionForPermissionUtil,
  getUserActionsForPermission as getUserActionsForPermissionUtil,
  hasModuleAccess as hasModuleAccessUtil,
  hasSectionAccess as hasSectionAccessUtil
} from '@/shared/utils'
import type { PermissionRequirement } from '@/shared/types'

/**
 * Custom hook that provides permission checking functions with automatic user context
 * All functions automatically use the current authenticated user from AuthContext
 */
export function usePermissions() {
  const { user } = useAuth()

  return {
    /**
     * Check if current user has a specific permission and action
     */
    hasPermission: (permissionId: string, action: string): boolean => {
      return hasPermissionUtil(user, permissionId, action)
    },

    /**
     * Check if current user has ANY of the specified permission requirements (OR logic)
     * Perfect for cases like download buttons with multiple permission options
     */
    hasAnyPermission: (requirements: PermissionRequirement[]): boolean => {
      return hasAnyPermissionUtil(user, requirements)
    },

    /**
     * Check if current user has ALL of the specified permission requirements (AND logic)
     * Useful for complex operations requiring multiple permissions
     */
    hasAllPermissions: (requirements: PermissionRequirement[]): boolean => {
      return hasAllPermissionsUtil(user, requirements)
    },

    /**
     * Check if current user has any action for a specific permission
     * Useful for checking general access to a feature/module
     */
    hasAnyActionForPermission: (permissionId: string): boolean => {
      return hasAnyActionForPermissionUtil(user, permissionId)
    },

    /**
     * Get all actions current user has for a specific permission
     * Useful for UI state management and conditional rendering
     */
    getUserActionsForPermission: (permissionId: string): string[] => {
      return getUserActionsForPermissionUtil(user, permissionId)
    },

    /**
     * Check if current user has access to a module based on having any permission with matching moduleId
     */
    hasModuleAccess: (moduleId: string): boolean => {
      return hasModuleAccessUtil(user, moduleId)
    },

    /**
     * Check if current user has access to a section based on having any permission with matching sectionId
     */
    hasSectionAccess: (sectionId: string): boolean => {
      return hasSectionAccessUtil(user, sectionId)
    },

    /**
     * Get the current user object (for advanced permission logic)
     */
    user
  }
}