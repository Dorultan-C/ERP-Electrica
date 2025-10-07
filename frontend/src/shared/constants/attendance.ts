// Shared attendance-related constants and configurations

export type AttendanceStatus = 'present' | 'absent' | 'vacation' | 'loa' | 'holiday' | 'closed' | 'off_schedule' | 'not_employed' | 'suspended'

export type TimesheetStatus = 'pending' | 'approved' | 'requires_modification'

// Status configuration for attendance records
export const ATTENDANCE_STATUS_CONFIG = {
  present: { label: 'Present', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  absent: { label: 'Absent', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' },
  vacation: { label: 'Vacation', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  loa: { label: 'Leave of Absence', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  holiday: { label: 'Public Holiday', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  closed: { label: 'Office Closed', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  off_schedule: { label: 'Off Schedule', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/20' },
  not_employed: { label: 'Not Employed', color: 'text-gray-500 dark:text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-900/10' },
  suspended: { label: 'Suspended', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/20' }
} as const

// Timesheet status configuration
export const TIMESHEET_STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'text-yellow-700 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  requires_modification: { label: 'Needs Changes', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' }
} as const

// Constants
export const DEFAULT_ITEMS_PER_PAGE = 20
export const TIMER_INTERVAL = 1000
export const DROPDOWN_BLUR_DELAY = 150