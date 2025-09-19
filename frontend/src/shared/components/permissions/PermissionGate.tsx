/**
 * PermissionGate Component
 * More flexible permission wrapper with render props pattern
 * Provides access to permission state and user info
 */

import React from 'react'
import { usePermissions } from '@/shared/hooks'
import { validatePermissionRequirements } from '@/shared/utils'
import type { PermissionRequirement } from '@/shared/types'

interface PermissionGateProps {
  children: (props: PermissionGateRenderProps) => React.ReactNode
  /** Single permission requirement */
  permissionId?: string
  action?: string
  /** Multiple permission requirements (OR logic) */
  anyOf?: PermissionRequirement[]
  /** Multiple permission requirements (AND logic) */
  allOf?: PermissionRequirement[]
  /** Super user check */
  requireSuperUser?: boolean
}

interface PermissionGateRenderProps {
  /** Whether the user has the required permission(s) */
  hasAccess: boolean
  /** All permission checking functions */
  permissions: ReturnType<typeof usePermissions>
}

/**
 * Render props permission component that provides more flexibility
 * Useful when you need conditional rendering based on permissions but want more control
 *
 * @example
 * // Basic usage with conditional rendering
 * <PermissionGate permissionId="hr-users-manage" action="create">
 *   {({ hasAccess }) => (
 *     hasAccess ? <CreateButton /> : <div>No permission</div>
 *   )}
 * </PermissionGate>
 *
 * @example
 * // Advanced usage with permission functions
 * <PermissionGate permissionId="hr-users-manage" action="read">
 *   {({ hasAccess, permissions }) => (
 *     <div>
 *       {hasAccess && <UsersList />}
 *       {permissions.hasPermission('hr-users-manage', 'create') && <CreateButton />}
 *       {permissions.hasPermission('super-user', 'true') && <AdminTools />}
 *     </div>
 *   )}
 * </PermissionGate>
 *
 * @example
 * // Multiple permissions check
 * <PermissionGate anyOf={[
 *   { permissionId: "download-permission", action: "pdf" },
 *   { permissionId: "super-user", action: "all" }
 * ]}>
 *   {({ hasAccess, permissions }) => (
 *     <DownloadMenu
 *       canDownloadPdf={permissions.hasPermission('download-permission', 'pdf')}
 *       canDownloadDocx={permissions.hasPermission('download-permission', 'docx')}
 *       isVisible={hasAccess}
 *     />
 *   )}
 * </PermissionGate>
 */
export function PermissionGate({
  children,
  permissionId,
  action,
  anyOf,
  allOf,
  requireSuperUser
}: PermissionGateProps) {
  const permissions = usePermissions()
  const { hasPermission, hasAnyPermission, hasAllPermissions } = permissions

  // Development-time validation of PermissionRequirement arrays
  if (process.env.NODE_ENV === 'development') {
    if (anyOf) {
      const errors = validatePermissionRequirements(anyOf)
      if (errors.length > 0) {
        console.error('❌ PermissionGate component has invalid anyOf requirements:')
        errors.forEach(error => console.error(`  - ${error}`))
      }
    }

    if (allOf) {
      const errors = validatePermissionRequirements(allOf)
      if (errors.length > 0) {
        console.error('❌ PermissionGate component has invalid allOf requirements:')
        errors.forEach(error => console.error(`  - ${error}`))
      }
    }
  }

  let hasAccess = false

  // Super user check
  if (requireSuperUser) {
    hasAccess = hasPermission('super-user', 'true')
  }
  // Single permission check
  else if (permissionId && action) {
    hasAccess = hasPermission(permissionId, action)
  }
  // Multiple permissions with OR logic
  else if (anyOf && anyOf.length > 0) {
    hasAccess = hasAnyPermission(anyOf)
  }
  // Multiple permissions with AND logic
  else if (allOf && allOf.length > 0) {
    hasAccess = hasAllPermissions(allOf)
  }
  // If no permission requirements specified, grant access by default
  else {
    hasAccess = true
  }

  return <>{children({ hasAccess, permissions })}</>
}