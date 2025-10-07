import type { User, UserStatus } from '@/shared/types'

// Helper function to normalize dates for comparison
export const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Helper function to check if a date is in a range
export const isDateInRange = (date: Date, startDate: Date, endDate?: Date): boolean => {
  const normalizedDate = normalizeDate(date)
  const normalizedStart = normalizeDate(startDate)
  const normalizedEnd = endDate ? normalizeDate(endDate) : normalizedStart

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd
}

// Get user employment status for a specific date
export const getUserEmploymentStatusForDate = (user: User, date: Date): UserStatus | null => {
  const normalizedDate = normalizeDate(date)

  // Sort employment history by date (newest first)
  const sortedHistory = [...user.employmentHistory].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Find the most recent employment event on or before the given date
  const relevantEvent = sortedHistory.find(event =>
    normalizeDate(new Date(event.date)) <= normalizedDate
  )

  if (!relevantEvent) {
    // No employment history before this date - user hasn't started yet
    return 'pending_start'
  }

  return relevantEvent.status
}

// Check if user is employed (active or on probation) on a given date
export const isUserEmployedOnDate = (user: User, date: Date): boolean => {
  const employmentStatus = getUserEmploymentStatusForDate(user, date)
  return employmentStatus !== null && !['pending_start', 'terminated', 'suspended'].includes(employmentStatus)
}