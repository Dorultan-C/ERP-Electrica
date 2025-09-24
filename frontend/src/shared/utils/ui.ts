// UI utility functions for the ERP system
// These functions handle UI-related logic and formatting

/**
 * Formats a date into a human-readable "time ago" string
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

/**
 * User status styling configurations
 */
export const USER_STATUS_CONFIG = {
  active: {
    label: 'Active',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    badgeColor: 'green'
  },
  probation: {
    label: 'Probation',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    badgeColor: 'yellow'
  },
  terminated: {
    label: 'Terminated',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    badgeColor: 'red'
  },
  suspended: {
    label: 'Suspended',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    badgeColor: 'red'
  },
  pending_start: {
    label: 'Pending Start',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    badgeColor: 'blue'
  },
  // Legacy support for 'inactive' used in some components
  inactive: {
    label: 'Inactive',
    textColor: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    badgeColor: 'red'
  }
} as const

/**
 * Gets the text color for a user status
 */
export const getUserStatusTextColor = (status: string): string => {
  const config = USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG]
  return config?.textColor || 'text-gray-600 dark:text-gray-400'
}

/**
 * Gets the background color for a user status
 */
export const getUserStatusBgColor = (status: string): string => {
  const config = USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG]
  return config?.bgColor || 'bg-gray-100 dark:bg-gray-900/20'
}

/**
 * Gets the badge color for a user status (for DataList Cell.Badge)
 */
export const getUserStatusBadgeColor = (status: string): string => {
  const config = USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG]
  return config?.badgeColor || 'gray'
}

/**
 * Gets the display label for a user status
 */
export const getUserStatusLabel = (status: string): string => {
  const config = USER_STATUS_CONFIG[status as keyof typeof USER_STATUS_CONFIG]
  return config?.label || status.charAt(0).toUpperCase() + status.slice(1)
}

/**
 * Gets the complete colorMap for all user statuses (for DataList Cell.Badge)
 */
export const getUserStatusColorMap = (): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(USER_STATUS_CONFIG).map(([status, config]) => [status, config.badgeColor])
  )
}