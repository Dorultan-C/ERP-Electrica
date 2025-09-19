/**
 * Data validation utilities for ensuring consistency across data files
 * Used during development to catch data modeling errors early
 */

import { permissions } from '@/data/permissions'
import { modules } from '@/data/modules'
import { sections } from '@/data/sections'
import { dummyUsers } from '@/data/dummy/users'
import { getPermissionById } from './permissions'
import type { UserPermission, PermissionRequirement } from '@/shared/types'

/**
 * Validates permission data to ensure consistent moduleId/sectionId relationships
 * Checks that all referenced modules and sections exist and are properly linked
 */
export const validatePermissionData = (): string[] => {
  const errors: string[] = []

  permissions.forEach(permission => {
    // Check if moduleId exists
    const moduleExists = modules.some(m => m.id === permission.moduleId)
    if (!moduleExists) {
      errors.push(`Permission '${permission.id}' has invalid moduleId '${permission.moduleId}'`)
    }

    // Check if sectionId exists
    const sectionExists = sections.some(s => s.id === permission.sectionId)
    if (!sectionExists) {
      errors.push(`Permission '${permission.id}' has invalid sectionId '${permission.sectionId}'`)
    }

    // Check if section belongs to the module (only if both exist)
    const module = modules.find(m => m.id === permission.moduleId)
    if (module && sectionExists && !module.sectionIds.includes(permission.sectionId)) {
      errors.push(`Permission '${permission.id}': section '${permission.sectionId}' doesn't belong to module '${permission.moduleId}'`)
    }
  })

  if (errors.length > 0) {
    console.error('❌ Permission data validation errors:')
    errors.forEach(error => console.error(`  - ${error}`))
  } else {
    console.log('✅ Permission data validation passed')
  }

  return errors
}

/**
 * Validates that a UserPermission has valid actions according to Permission definitions
 */
export const validateUserPermission = (userPermission: UserPermission): string[] => {
  const errors: string[] = []

  const permissionDef = getPermissionById(userPermission.permissionId)
  if (!permissionDef) {
    errors.push(`UserPermission references non-existent permission '${userPermission.permissionId}'`)
    return errors
  }

  // Check each action in the user permission
  userPermission.actions.forEach(action => {
    if (!permissionDef.actions.includes(action)) {
      errors.push(`UserPermission '${userPermission.permissionId}' has invalid action '${action}'. Valid actions: [${permissionDef.actions.join(', ')}]`)
    }
  })

  return errors
}

/**
 * Validates that a PermissionRequirement has valid action according to Permission definitions
 */
export const validatePermissionRequirement = (requirement: PermissionRequirement): string[] => {
  const errors: string[] = []

  const permissionDef = getPermissionById(requirement.permissionId)
  if (!permissionDef) {
    errors.push(`PermissionRequirement references non-existent permission '${requirement.permissionId}'`)
    return errors
  }

  // Check if the required action exists in the permission definition
  if (!permissionDef.actions.includes(requirement.action)) {
    errors.push(`PermissionRequirement '${requirement.permissionId}' has invalid action '${requirement.action}'. Valid actions: [${permissionDef.actions.join(', ')}]`)
  }

  return errors
}

/**
 * Validates multiple UserPermissions
 */
export const validateUserPermissions = (userPermissions: UserPermission[]): string[] => {
  const errors: string[] = []

  userPermissions.forEach((userPermission, index) => {
    const permissionErrors = validateUserPermission(userPermission)
    permissionErrors.forEach(error => {
      errors.push(`UserPermission[${index}]: ${error}`)
    })
  })

  return errors
}

/**
 * Validates multiple PermissionRequirements
 */
export const validatePermissionRequirements = (requirements: PermissionRequirement[]): string[] => {
  const errors: string[] = []

  requirements.forEach((requirement, index) => {
    const requirementErrors = validatePermissionRequirement(requirement)
    requirementErrors.forEach(error => {
      errors.push(`PermissionRequirement[${index}]: ${error}`)
    })
  })

  return errors
}

/**
 * Runs all data validation checks in development mode
 * Can be extended to include other data validation functions
 */
export const runDataValidation = (): void => {
  if (process.env.NODE_ENV === 'development') {
    // Validate permission data structure
    validatePermissionData()

    // Validate all user permissions in dummy data
    dummyUsers.forEach((user) => {
      if (user.permissions && user.permissions.length > 0) {
        const userPermissionErrors = validateUserPermissions(user.permissions)
        if (userPermissionErrors.length > 0) {
          console.error(`❌ User '${user.username}' has invalid permissions:`)
          userPermissionErrors.forEach(error => console.error(`  - ${error}`))
        }
      }
    })

    console.log('✅ User permission validation completed')
  }
}

// Auto-run validation in development
runDataValidation()