'use client'

import React from 'react'
import { ATTENDANCE_STATUS_CONFIG, TIMESHEET_STATUS_CONFIG } from '@/shared/constants/attendance'
import type { AttendanceStatus, TimesheetStatus } from '@/shared/constants/attendance'

interface StatusBadgeProps {
  status: AttendanceStatus | TimesheetStatus
  label?: string
  type?: 'attendance' | 'timesheet'
  className?: string
}

export function StatusBadge({
  status,
  label,
  type = 'attendance',
  className = ''
}: StatusBadgeProps) {
  const config = type === 'attendance'
    ? ATTENDANCE_STATUS_CONFIG[status as AttendanceStatus]
    : TIMESHEET_STATUS_CONFIG[status as TimesheetStatus]

  if (!config) {
    return null
  }

  const displayLabel = label || config.label

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.color} ${config.bgColor} ${className}`}
    >
      {displayLabel}
    </span>
  )
}

interface DualStatusBadgeProps {
  primaryStatus: AttendanceStatus | TimesheetStatus
  secondaryStatus?: AttendanceStatus
  primaryLabel?: string
  secondaryLabel?: string
  primaryType?: 'attendance' | 'timesheet'
  layout?: 'horizontal' | 'vertical'
  className?: string
}

export function DualStatusBadge({
  primaryStatus,
  secondaryStatus,
  primaryLabel,
  secondaryLabel,
  primaryType = 'timesheet',
  layout = 'horizontal',
  className = ''
}: DualStatusBadgeProps) {
  const containerClass = layout === 'horizontal'
    ? 'flex xl:flex-row flex-col xl:items-center items-center xl:space-x-2 space-y-1 xl:space-y-0'
    : 'flex flex-col items-center space-y-1'

  return (
    <div className={`${containerClass} ${className}`}>
      {secondaryStatus && (
        <StatusBadge
          status={secondaryStatus}
          label={secondaryLabel}
          type="attendance"
        />
      )}
      <StatusBadge
        status={primaryStatus}
        label={primaryLabel}
        type={primaryType}
      />
    </div>
  )
}