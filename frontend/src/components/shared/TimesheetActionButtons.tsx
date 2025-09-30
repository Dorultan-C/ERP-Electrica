'use client'

import React from 'react'
import type { Timesheet } from '@/shared/types/hr'

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void
  className: string
  title: string
  children: React.ReactNode
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, className, title, children }) => (
  <button
    onClick={onClick}
    className={`p-2 btn-small rounded-md cursor-pointer ${className}`}
    title={title}
  >
    {children}
  </button>
)

interface TimesheetActionButtonsProps {
  timesheet?: Timesheet | undefined
  canApprove?: boolean
  canRequestChanges?: boolean
  canEdit?: boolean
  canDelete?: boolean
  canCreate?: boolean
  canRequestFromOthers?: boolean
  userId?: string
  date?: Date
  onApprove?: (timesheetId: string, e: React.MouseEvent) => void
  onRequestChanges?: (timesheetId: string, e: React.MouseEvent) => void
  onEdit?: (timesheetId: string, e: React.MouseEvent) => void
  onDelete?: (timesheetId: string, e: React.MouseEvent) => void
  onCreate?: (userId: string, date: Date, e: React.MouseEvent) => void
  onRequest?: (userId: string, date: Date, e: React.MouseEvent) => void
  size?: 'small' | 'normal'
  className?: string
}

export function TimesheetActionButtons({
  timesheet,
  canApprove = false,
  canRequestChanges = false,
  canEdit = false,
  canDelete = false,
  canCreate = false,
  canRequestFromOthers = false,
  userId,
  date,
  onApprove,
  onRequestChanges,
  onEdit,
  onDelete,
  onCreate,
  onRequest,
  size = 'normal',
  className = ''
}: TimesheetActionButtonsProps) {
  const hasAnyTimesheetActions = timesheet && (canApprove || canRequestChanges || canEdit || canDelete)
  const hasAnyCreateActions = !timesheet && (canCreate || canRequestFromOthers)
  const iconSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5'

  if (!hasAnyTimesheetActions && !hasAnyCreateActions) {
    return null
  }

  return (
    <div className={`flex items-center space-x-1 pointer-events-auto ${className}`}>
      {/* Timesheet-related actions - only show when timesheet exists */}
      {timesheet && canApprove && onApprove && (
        <ActionButton
          onClick={(e) => onApprove(timesheet.id, e)}
          className="text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          title="Approve timesheet"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </ActionButton>
      )}

      {timesheet && canRequestChanges && onRequestChanges && (
        <ActionButton
          onClick={(e) => onRequestChanges(timesheet.id, e)}
          className="text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
          title="Request changes"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 16c0-2.5 1.8-4 4-4h3m0 0l-2-2m2 2l-2 2" />
          </svg>
        </ActionButton>
      )}

      {timesheet && canEdit && onEdit && (
        <ActionButton
          onClick={(e) => onEdit(timesheet.id, e)}
          className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          title="Edit timesheet"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </ActionButton>
      )}

      {timesheet && canDelete && onDelete && (
        <ActionButton
          onClick={(e) => onDelete(timesheet.id, e)}
          className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          title="Delete timesheet"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </ActionButton>
      )}

      {/* Create/Request actions - only show when no timesheet exists */}
      {canCreate && onCreate && userId && date && (
        <ActionButton
          onClick={(e) => onCreate(userId, date, e)}
          className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          title="Create timesheet"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </ActionButton>
      )}

      {canRequestFromOthers && onRequest && userId && date && (
        <ActionButton
          onClick={(e) => onRequest(userId, date, e)}
          className="text-white bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
          title="Request timesheet"
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 16c0-2.5 1.8-4 4-4h3m0 0l-2-2m2 2l-2 2" />
          </svg>
        </ActionButton>
      )}
    </div>
  )
}