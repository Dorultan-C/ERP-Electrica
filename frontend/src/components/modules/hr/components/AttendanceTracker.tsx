'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/shared/contexts'
import { usePermissions } from '@/shared/hooks'
import { dummyTimesheets, dummyVacations, dummyLOAs, dummyPublicHolidays, dummyClosingDays } from '@/data/dummy/hr'

interface AttendanceState {
  isClocked: boolean
  clockInTime?: Date
  onBreak: boolean
  currentBreakStart?: Date
  totalWorkedMinutes: number
  totalBreakMinutes: number
  breaks: Array<{
    id: string
    startTime: Date
    endTime?: Date
    duration: number
  }>
}

export function AttendanceTracker() {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({
    isClocked: false,
    onBreak: false,
    totalWorkedMinutes: 0,
    totalBreakMinutes: 0,
    breaks: []
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Check if user has clock permission - if not, don't render the component
  if (!hasPermission('hr-attendance-clock', 'true')) {
    return null
  }

  // Check if there's already a timesheet for today
  const today = new Date()
  const todayString = today.toDateString()
  const existingTimesheet = user ? dummyTimesheets.find(
    timesheet => timesheet.userId === user.id &&
    new Date(timesheet.date).toDateString() === todayString
  ) : null

  // Check for approved vacation
  const approvedVacation = user ? dummyVacations.find(
    vacation => vacation.userId === user.id &&
    vacation.status === 'approved' &&
    new Date(vacation.startDate) <= today &&
    new Date(vacation.endDate) >= today
  ) : null

  // Check for approved LOA
  const approvedLOA = user ? dummyLOAs.find(
    loa => loa.userId === user.id &&
    loa.status === 'approved' &&
    new Date(loa.startDate) <= today &&
    (loa.endDate ? new Date(loa.endDate) >= today : true)
  ) : null

  // Check for public holiday
  const publicHoliday = dummyPublicHolidays.find(
    holiday => new Date(holiday.date).toDateString() === todayString
  )

  // Check for closing day
  const closingDay = dummyClosingDays.find(
    closing => new Date(closing.startDate) <= today &&
    new Date(closing.endDate) >= today
  )

  // Determine if user is off today (priority order: LOA > closing day > vacation)
  // Note: Public holidays allow choice to work, so they don't automatically prevent timesheet creation
  const timeOffReason = approvedLOA ? 'leave' :
                       closingDay ? 'closing' :
                       approvedVacation ? 'vacation' :
                       null

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate worked time
  const calculateWorkedTime = () => {
    if (!attendanceState.clockInTime) return 0

    const now = new Date()
    const totalMinutes = Math.floor((now.getTime() - attendanceState.clockInTime.getTime()) / (1000 * 60))

    // Subtract break time if currently on break
    let breakDeduction = attendanceState.totalBreakMinutes
    if (attendanceState.onBreak && attendanceState.currentBreakStart) {
      breakDeduction += Math.floor((now.getTime() - attendanceState.currentBreakStart.getTime()) / (1000 * 60))
    }

    return Math.max(0, totalMinutes - breakDeduction)
  }

  // Handle clock in
  const handleClockIn = () => {
    setAttendanceState(prev => ({
      ...prev,
      isClocked: true,
      clockInTime: new Date(),
      totalWorkedMinutes: 0,
      totalBreakMinutes: 0,
      breaks: []
    }))
  }

  // Handle clock out
  const handleClockOut = () => {
    // End any ongoing break
    if (attendanceState.onBreak) {
      handleEndBreak()
    }

    setAttendanceState({
      isClocked: false,
      onBreak: false,
      totalWorkedMinutes: calculateWorkedTime(),
      totalBreakMinutes: attendanceState.totalBreakMinutes,
      breaks: attendanceState.breaks
    })
  }

  // Handle start break
  const handleStartBreak = () => {
    setAttendanceState(prev => ({
      ...prev,
      onBreak: true,
      currentBreakStart: new Date()
    }))
  }

  // Handle end break
  const handleEndBreak = () => {
    if (!attendanceState.currentBreakStart) return

    const breakDuration = Math.floor((new Date().getTime() - attendanceState.currentBreakStart.getTime()) / (1000 * 60))
    const breakStartTime = attendanceState.currentBreakStart

    setAttendanceState(prev => {
      const { currentBreakStart, ...rest } = prev
      return {
        ...rest,
        onBreak: false,
        totalBreakMinutes: prev.totalBreakMinutes + breakDuration,
        breaks: [
          ...prev.breaks,
          {
            id: `break-${Date.now()}`,
            startTime: breakStartTime,
            endTime: new Date(),
            duration: breakDuration
          }
        ]
      }
    })
  }

  // Handle delete timesheet
  const handleDeleteTimesheet = () => {
    if (existingTimesheet) {
      console.log('Delete timesheet:', existingTimesheet.id)
      // TODO: Implement actual deletion logic (Phase 9+)
      setShowDeleteConfirm(false)
    }
  }

  // Format time for display
  const formatTime = (date: Date, includeSeconds: boolean = false) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' }),
      hour12: false
    })
  }

  // Format duration in minutes to hours:minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get current status text
  const getStatusText = () => {
    if (timeOffReason) {
      switch (timeOffReason) {
        case 'vacation': return 'On Vacation'
        case 'leave': return `On ${approvedLOA?.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Leave`
        case 'closing': return `${closingDay?.description || 'Office Closed'}`
        default: return 'Off Today'
      }
    }
    // Show public holiday info even when allowing work
    if (publicHoliday && !existingTimesheet && !attendanceState.isClocked) {
      return `${publicHoliday.name} (Optional Work Day)`
    }
    if (existingTimesheet) {
      switch (existingTimesheet.status) {
        case 'approved': return 'Approved'
        case 'pending': return 'Pending'
        case 'requires_modification': return 'Requires Modification'
        default: return existingTimesheet.status
      }
    }
    if (!attendanceState.isClocked) return 'Not clocked in'
    if (attendanceState.onBreak) return 'On break'
    return 'Working'
  }

  // Get status color
  const getStatusColor = () => {
    if (timeOffReason) {
      return 'text-blue-600 dark:text-blue-400'
    }
    // Color for public holiday when allowing work
    if (publicHoliday && !existingTimesheet && !attendanceState.isClocked) {
      return 'text-blue-600 dark:text-blue-400'
    }
    if (existingTimesheet) {
      switch (existingTimesheet.status) {
        case 'approved': return 'text-green-600 dark:text-green-400'
        case 'pending': return 'text-yellow-600 dark:text-yellow-400'
        case 'requires_modification': return 'text-red-600 dark:text-red-400'
        default: return 'text-gray-600 dark:text-gray-400'
      }
    }
    if (!attendanceState.isClocked) return 'text-gray-500 dark:text-gray-400'
    if (attendanceState.onBreak) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const currentWorkedTime = attendanceState.isClocked ? calculateWorkedTime() : attendanceState.totalWorkedMinutes

  // Calculate current break time including ongoing break
  const getCurrentBreakTime = () => {
    let totalBreakTime = attendanceState.totalBreakMinutes

    // Add ongoing break time if currently on break
    if (attendanceState.onBreak && attendanceState.currentBreakStart) {
      const currentBreakDuration = Math.floor((new Date().getTime() - attendanceState.currentBreakStart.getTime()) / (1000 * 60))
      totalBreakTime += currentBreakDuration
    }

    return totalBreakTime
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
        {/* Left Side - Date & Status */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          {!existingTimesheet && !timeOffReason && (
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              {formatTime(currentTime, true)}
            </p>
          )}
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          {timeOffReason && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(() => {
                if (timeOffReason === 'vacation' && approvedVacation) {
                  const start = new Date(approvedVacation.startDate)
                  const end = new Date(approvedVacation.endDate)
                  if (start.toDateString() !== end.toDateString()) {
                    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
                  }
                }
                if (timeOffReason === 'leave' && approvedLOA) {
                  const start = new Date(approvedLOA.startDate)
                  if (approvedLOA.endDate) {
                    const end = new Date(approvedLOA.endDate)
                    if (start.toDateString() !== end.toDateString()) {
                      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
                    }
                  } else {
                    return `${start.toLocaleDateString()} - Ongoing`
                  }
                }
                if (timeOffReason === 'closing' && closingDay) {
                  const start = new Date(closingDay.startDate)
                  const end = new Date(closingDay.endDate)
                  if (start.toDateString() !== end.toDateString()) {
                    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
                  }
                }
                return null
              })()}
            </p>
          )}
        </div>

        {/* Center - Time Stats */}
        {!timeOffReason && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Clock In Time */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Clock In
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingTimesheet && existingTimesheet.startTime ?
                  formatTime(existingTimesheet.startTime) :
                  attendanceState.clockInTime ? formatTime(attendanceState.clockInTime) : '--:--'
                }
              </div>
            </div>

            {/* Clock Out Time */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Clock Out
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingTimesheet && existingTimesheet.endTime ?
                  formatTime(existingTimesheet.endTime) :
                  attendanceState.isClocked ? 'In Progress' : '--:--'
                }
              </div>
            </div>

            {/* Worked Time */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Worked Time
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingTimesheet ?
                  formatDuration(existingTimesheet.totalMinutes) :
                  formatDuration(currentWorkedTime)
                }
              </div>
            </div>

            {/* Break Time */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Break Time
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingTimesheet && existingTimesheet.breakMinutes ?
                  formatDuration(existingTimesheet.breakMinutes) :
                  formatDuration(getCurrentBreakTime())
                }
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Action Buttons */}
        {!timeOffReason && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {existingTimesheet && existingTimesheet.status !== 'approved' ? (() => {
              const canCreate = hasPermission('hr-attendance-manage-owns', 'create')
              const canUpdate = hasPermission('hr-attendance-manage-owns', 'update')
              const canDelete = hasPermission('hr-attendance-manage-owns', 'delete')

              // If only has delete permission, show delete button
              if (canDelete && !canCreate && !canUpdate) {
                return (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )
              }

              // If has create or update permission, show edit button
              if (canCreate || canUpdate) {
                return (
                  <button
                    onClick={() => console.log('Edit timesheet:', existingTimesheet.id)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )
              }

              return null
            })() : !attendanceState.isClocked ? (
            <button
              onClick={handleClockIn}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Clock In</span>
            </button>
          ) : (
            <>
              {!attendanceState.onBreak ? (
                <button
                  onClick={handleStartBreak}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  <span>Start Break</span>
                </button>
              ) : (
                <button
                  onClick={handleEndBreak}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zM14 4l8 8-8 8V4z" />
                  </svg>
                  <span>End Break</span>
                </button>
              )}

              {/* Clock Out button - disabled when on break */}
              <button
                onClick={attendanceState.onBreak ? undefined : handleClockOut}
                disabled={attendanceState.onBreak}
                className={`px-6 py-3 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  attendanceState.onBreak
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                }`}
                title={attendanceState.onBreak ? 'End your break before clocking out' : 'Clock Out'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z" />
                </svg>
                <span>Clock Out</span>
              </button>
            </>
          )}
          </div>
        )}
      </div>

      {/* Break History (shown when clocked in and have breaks OR when existing timesheet has breaks) */}
      {((attendanceState.isClocked && attendanceState.breaks.length > 0) || (existingTimesheet && existingTimesheet.breaks && existingTimesheet.breaks.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Today's Breaks
          </h4>
          <div className="flex flex-wrap gap-2">
            {/* Show existing timesheet breaks or current session breaks */}
            {existingTimesheet && existingTimesheet.breaks && existingTimesheet.breaks.length > 0 ?
              existingTimesheet.breaks.map((breakItem: any) => (
                <div key={breakItem.id} className="bg-gray-50 dark:bg-gray-700 rounded px-4 py-2 text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    ({formatDuration(breakItem.totalMinutes)})
                  </span>
                </div>
              )) :
              attendanceState.breaks.map((breakItem) => (
                <div key={breakItem.id} className="bg-gray-50 dark:bg-gray-700 rounded px-4 py-2 text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatTime(breakItem.startTime)} - {breakItem.endTime ? formatTime(breakItem.endTime) : 'Ongoing'}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    ({formatDuration(breakItem.duration)})
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Timesheet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this timesheet? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTimesheet}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}