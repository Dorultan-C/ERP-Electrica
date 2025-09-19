/**
 * RequiresPermission Component
 * Conditionally renders children based on user permissions
 * Provides declarative permission checking in JSX
 */

import React from 'react'
import { usePermissions } from '@/shared/hooks'
import { validatePermissionRequirements } from '@/shared/utils'
import type { PermissionRequirement } from '@/shared/types'

interface RequiresPermissionProps {
  children: React.ReactNode
  /** Single permission requirement */
  permissionId?: string
  action?: string
  /** Multiple permission requirements (OR logic) */
  anyOf?: PermissionRequirement[]
  /** Multiple permission requirements (AND logic) */
  allOf?: PermissionRequirement[]
  /** Super user check */
  requireSuperUser?: boolean
  /** Fallback content to render when permission is denied */
  fallback?: React.ReactNode
}

/**
 * Wrapper component that only renders children if user has required permissions
 *
 * @example
 * // Simple permission check
 * <RequiresPermission permissionId="hr-users-manage" action="create">
 *   <CreateUserButton />
 * </RequiresPermission>
 *
 * @example
 * // Multiple permissions (OR logic) - your download button use case
 * <RequiresPermission anyOf={[
 *   { permissionId: "download-permission", action: "pdf" },
 *   { permissionId: "download-permission", action: "docx" },
 *   { permissionId: "super-user", action: "all" }
 * ]}>
 *   <DownloadButton />
 * </RequiresPermission>
 *
 * @example
 * // Multiple permissions (AND logic)
 * <RequiresPermission allOf={[
 *   { permissionId: "hr-users-manage", action: "read" },
 *   { permissionId: "hr-users-manage", action: "update" }
 * ]}>
 *   <EditUserForm />
 * </RequiresPermission>
 *
 * @example
 * // Super user only
 * <RequiresPermission requireSuperUser>
 *   <AdminPanel />
 * </RequiresPermission>
 *
 * @example
 * // With fallback content
 * <RequiresPermission
 *   permissionId="hr-users-manage"
 *   action="create"
 *   fallback={<div>You don't have permission to create users</div>}
 * >
 *   <CreateUserButton />
 * </RequiresPermission>
 */
export function RequiresPermission({
  children,
  permissionId,
  action,
  anyOf,
  allOf,
  requireSuperUser,
  fallback = null
}: RequiresPermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  // Development-time validation of PermissionRequirement arrays
  if (process.env.NODE_ENV === 'development') {
    if (anyOf) {
      const errors = validatePermissionRequirements(anyOf)
      if (errors.length > 0) {
        console.error('❌ RequiresPermission component has invalid anyOf requirements:')
        errors.forEach(error => console.error(`  - ${error}`))
      }
    }

    if (allOf) {
      const errors = validatePermissionRequirements(allOf)
      if (errors.length > 0) {
        console.error('❌ RequiresPermission component has invalid allOf requirements:')
        errors.forEach(error => console.error(`  - ${error}`))
      }
    }
  }

  // Super user check
  if (requireSuperUser) {
    return hasPermission('super-user', 'true') ? <>{children}</> : <>{fallback}</>
  }

  // Single permission check
  if (permissionId && action) {
    return hasPermission(permissionId, action) ? <>{children}</> : <>{fallback}</>
  }

  // Multiple permissions with OR logic
  if (anyOf && anyOf.length > 0) {
    return hasAnyPermission(anyOf) ? <>{children}</> : <>{fallback}</>
  }

  // Multiple permissions with AND logic
  if (allOf && allOf.length > 0) {
    return hasAllPermissions(allOf) ? <>{children}</> : <>{fallback}</>
  }

  // If no permission requirements specified, render children by default
  return <>{children}</>
}