// Timesheet action utility functions
// These simulate API calls with dummy data manipulation

import { dummyTimesheets } from '@/data/dummy/hr'
import type { TimesheetStatus } from '@/shared/types/hr'

export interface TimesheetActionResult {
  success: boolean
  error?: string
  timesheet?: any
}

// Simulate approving a timesheet
export const approveTimesheet = async (timesheetId: string, reviewerId: string, comment?: string): Promise<TimesheetActionResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const timesheetIndex = dummyTimesheets.findIndex(ts => ts.id === timesheetId)
    if (timesheetIndex === -1) {
      return { success: false, error: 'Timesheet not found' }
    }

    // Update timesheet status
    dummyTimesheets[timesheetIndex] = {
      ...dummyTimesheets[timesheetIndex]!,
      status: 'approved' as TimesheetStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      ...(comment && { messages: [...(dummyTimesheets[timesheetIndex]!.messages || []), {
        id: `msg-${Date.now()}`,
        userId: reviewerId,
        text: comment,
        date: new Date(),
        isAnswered: false
      }]})
    }

    return { success: true, timesheet: dummyTimesheets[timesheetIndex] }
  } catch (error) {
    return { success: false, error: 'Failed to approve timesheet' }
  }
}

// Simulate rejecting a timesheet
export const rejectTimesheet = async (timesheetId: string, reviewerId: string, comment?: string): Promise<TimesheetActionResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const timesheetIndex = dummyTimesheets.findIndex(ts => ts.id === timesheetId)
    if (timesheetIndex === -1) {
      return { success: false, error: 'Timesheet not found' }
    }

    // Update timesheet status
    dummyTimesheets[timesheetIndex] = {
      ...dummyTimesheets[timesheetIndex]!,
      status: 'requires_modification' as TimesheetStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      ...(comment && { messages: [...(dummyTimesheets[timesheetIndex]!.messages || []), {
        id: `msg-${Date.now()}`,
        userId: reviewerId,
        text: comment,
        date: new Date(),
        isAnswered: false
      }]})
    }

    return { success: true, timesheet: dummyTimesheets[timesheetIndex] }
  } catch (error) {
    return { success: false, error: 'Failed to reject timesheet' }
  }
}

// Simulate requesting changes to a timesheet
export const requestTimesheetChanges = async (timesheetId: string, reviewerId: string, comment: string): Promise<TimesheetActionResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const timesheetIndex = dummyTimesheets.findIndex(ts => ts.id === timesheetId)
    if (timesheetIndex === -1) {
      return { success: false, error: 'Timesheet not found' }
    }

    // Update timesheet status
    dummyTimesheets[timesheetIndex] = {
      ...dummyTimesheets[timesheetIndex]!,
      status: 'requires_modification' as TimesheetStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      messages: [...(dummyTimesheets[timesheetIndex]!.messages || []), {
        id: `msg-${Date.now()}`,
        userId: reviewerId,
        text: comment,
        date: new Date(),
        isAnswered: false
      }]
    }

    return { success: true, timesheet: dummyTimesheets[timesheetIndex] }
  } catch (error) {
    return { success: false, error: 'Failed to request timesheet changes' }
  }
}

// Simulate resubmitting a timesheet (for employees)
export const resubmitTimesheet = async (timesheetId: string, userId: string): Promise<TimesheetActionResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const timesheetIndex = dummyTimesheets.findIndex(ts => ts.id === timesheetId)
    if (timesheetIndex === -1) {
      return { success: false, error: 'Timesheet not found' }
    }

    // Only allow if user owns the timesheet and it requires modification
    if (dummyTimesheets[timesheetIndex]!.userId !== userId) {
      return { success: false, error: 'Not authorized' }
    }

    if (dummyTimesheets[timesheetIndex]!.status !== 'requires_modification') {
      return { success: false, error: 'Timesheet is not in a state that allows resubmission' }
    }

    // Update timesheet status back to pending
    const { reviewedBy, reviewedAt, ...timesheetWithoutReview } = dummyTimesheets[timesheetIndex]!
    dummyTimesheets[timesheetIndex] = {
      ...timesheetWithoutReview,
      status: 'pending' as TimesheetStatus
    }

    return { success: true, timesheet: dummyTimesheets[timesheetIndex] }
  } catch (error) {
    return { success: false, error: 'Failed to resubmit timesheet' }
  }
}