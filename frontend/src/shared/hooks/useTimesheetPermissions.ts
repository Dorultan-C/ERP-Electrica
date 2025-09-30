import { useMemo } from 'react'
import { useAuth } from '@/shared/contexts'
import { usePermissions } from './usePermissions'
import type { Timesheet } from '@/shared/types/hr'
import type { User } from '@/shared/types'

interface TimesheetPermissions {
  canRead: boolean
  canApprove: boolean
  canRequestChanges: boolean
  canDelete: boolean
  canEdit: boolean
  canCreate: boolean
  canRequestFromOthers: boolean
}

export function useTimesheetPermissions(
  timesheet: Timesheet | undefined,
  targetUser: User | null,
  isUserEmployed: boolean = true
): TimesheetPermissions {
  const { user: currentUser } = useAuth()
  const { hasPermission } = usePermissions()

  return useMemo(() => {
    if (!targetUser) {
      return {
        canRead: false,
        canApprove: false,
        canRequestChanges: false,
        canDelete: false,
        canEdit: false,
        canCreate: false,
        canRequestFromOthers: false
      }
    }

    const isOwnTimesheet = timesheet?.userId === currentUser?.id
    const permissionType = isOwnTimesheet ? 'hr-attendance-manage-owns' : 'hr-attendance-manage-others'

    const canRead = hasPermission(permissionType, 'read')
    const isApproved = timesheet?.status === 'approved'
    const isChangeRequired = timesheet?.status === 'requires_modification'
    const isPending = timesheet?.status === 'pending' || isChangeRequired

    // Base permissions
    const basePermissions = {
      canRead,
      canCreate: isUserEmployed && hasPermission(permissionType, 'create'),
      canRequestFromOthers: isUserEmployed && !isOwnTimesheet && hasPermission('hr-attendance-manage-others', 'request_changes')
    }

    // If no timesheet or user not employed, return base permissions only
    if (!timesheet || !isUserEmployed) {
      return {
        ...basePermissions,
        canApprove: false,
        canRequestChanges: false,
        canDelete: false,
        canEdit: false
      }
    }

    // Timesheet-specific permissions
    return {
      ...basePermissions,
      canApprove: isPending && hasPermission(permissionType, 'approve') && isUserEmployed,
      canRequestChanges: isPending && hasPermission(permissionType, 'request_changes') && !isChangeRequired && isUserEmployed,
      canDelete: hasPermission(permissionType, isApproved ? 'delete_approved' : 'delete') && isUserEmployed,
      canEdit: canRead && hasPermission(permissionType, isApproved ? 'update_approved' : 'update') && isUserEmployed
    }
  }, [timesheet, targetUser, currentUser, isUserEmployed, hasPermission])
}