'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/shared/contexts'
import { usePermissions } from '@/shared/hooks'
import { dummyTimesheets, dummyVacations, dummyLOAs, dummyPublicHolidays, dummyClosingDays, dummySchedules } from '@/data/dummy/hr'

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

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check if user has clock permission - if not, don't render the component
  if (!hasPermission('hr-attendance-clock', 'true')) {
    return null
  }

  // Check if there's already a timesheet for today
  const today = new Date()
  const todayString = today.toDateString()
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()) // Normalize to midnight
  const existingTimesheet = user ? dummyTimesheets.find(
    timesheet => timesheet.userId === user.id &&
    new Date(timesheet.date).toDateString() === todayString
  ) : null

  // Check for approved vacation
  const approvedVacation = user ? dummyVacations.find(
    vacation => vacation.userId === user.id &&
    vacation.status === 'approved' &&
    new Date(vacation.startDate.getFullYear(), vacation.startDate.getMonth(), vacation.startDate.getDate()) <= todayDateOnly &&
    new Date(vacation.endDate.getFullYear(), vacation.endDate.getMonth(), vacation.endDate.getDate()) >= todayDateOnly
  ) : null

  // Check for approved LOA
  const approvedLOA = user ? dummyLOAs.find(
    loa => loa.userId === user.id &&
    loa.status === 'approved' &&
    new Date(loa.startDate.getFullYear(), loa.startDate.getMonth(), loa.startDate.getDate()) <= todayDateOnly &&
    (loa.endDate ? new Date(loa.endDate.getFullYear(), loa.endDate.getMonth(), loa.endDate.getDate()) >= todayDateOnly : true)
  ) : null

  // Check for public holiday
  const publicHoliday = dummyPublicHolidays.find(
    holiday => new Date(holiday.date).toDateString() === todayString
  )

  // Check for closing day
  const closingDay = dummyClosingDays.find(
    closing => new Date(closing.startDate.getFullYear(), closing.startDate.getMonth(), closing.startDate.getDate()) <= todayDateOnly &&
    new Date(closing.endDate.getFullYear(), closing.endDate.getMonth(), closing.endDate.getDate()) >= todayDateOnly
  )

  // Check if today is a scheduled work day for the user
  const userSchedule = user ? dummySchedules.find(schedule => schedule.id === user.assignedScheduleId) : null
  const todayDayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const isScheduledWorkDay = userSchedule?.weekSchedule.some(scheduleDay => scheduleDay.dayOfWeek === todayDayOfWeek) || false

  // Display: What day type to show (priority order: LOA > off schedule > holiday > closing > vacation)
  const dayType = approvedLOA ? 'loa' :
                 !isScheduledWorkDay ? 'off_schedule' :
                 publicHoliday ? 'holiday' :
                 closingDay ? 'closing' :
                 approvedVacation ? 'vacation' :
                 'normal'

  // Work permission: Can they work today? (any blocking condition = no)
  const canWork = !approvedLOA && !closingDay && !approvedVacation

  // Show UI elements if can work OR if there's an existing timesheet
  const shouldShowUI = canWork || !!existingTimesheet

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
      const { currentBreakStart: _, ...rest } = prev
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

  // Live current time display
  const formatLiveTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  // Format duration in minutes to hours:minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get day type display info
  const getDayTypeInfo = () => {
    switch (dayType) {
      case 'loa':
        return {
          label: `${approvedLOA?.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Leave`,
          color: 'text-purple-600 dark:text-purple-400'
        }
      case 'closing':
        return {
          label: 'Office Closed',
          color: 'text-blue-600 dark:text-blue-400'
        }
      case 'vacation':
        return {
          label: 'Vacation',
          color: 'text-blue-600 dark:text-blue-400'
        }
      case 'holiday':
        return {
          label: publicHoliday?.name || 'Public Holiday',
          color: 'text-blue-600 dark:text-blue-400'
        }
      case 'off_schedule':
        return {
          label: 'Off Schedule',
          color: 'text-gray-600 dark:text-gray-400'
        }
      default:
        return null
    }
  }

  // Get current status text for workable days
  const getWorkingStatus = () => {
    if (existingTimesheet) {
      switch (existingTimesheet.status) {
        case 'approved': return { text: 'Approved', color: 'text-green-600 dark:text-green-400' }
        case 'pending': return { text: 'Pending', color: 'text-yellow-600 dark:text-yellow-400' }
        case 'requires_modification': return { text: 'Requires Modification', color: 'text-red-600 dark:text-red-400' }
        default: return { text: existingTimesheet.status, color: 'text-gray-600 dark:text-gray-400' }
      }
    }
    if (!attendanceState.isClocked) return { text: 'Not clocked in', color: 'text-gray-500 dark:text-gray-400' }
    if (attendanceState.onBreak) return { text: 'On break', color: 'text-yellow-600 dark:text-yellow-400' }
    return { text: 'Working', color: 'text-green-600 dark:text-green-400' }
  }

  // Get date range for multi-day events
  const getDateRange = () => {
    let startDate, endDate

    switch (dayType) {
      case 'loa':
        if (approvedLOA) {
          startDate = new Date(approvedLOA.startDate)
          endDate = approvedLOA.endDate ? new Date(approvedLOA.endDate) : null
        }
        break
      case 'closing':
        if (closingDay) {
          startDate = new Date(closingDay.startDate)
          endDate = new Date(closingDay.endDate)
        }
        break
      case 'vacation':
        if (approvedVacation) {
          startDate = new Date(approvedVacation.startDate)
          endDate = new Date(approvedVacation.endDate)
        }
        break
      default:
        return null
    }

    if (!startDate) return null

    if (!endDate) return `${startDate.toLocaleDateString()} - Ongoing`
    if (startDate.toDateString() === endDate.toDateString()) return null
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
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

  const dayTypeInfo = getDayTypeInfo()
  const workingStatus = getWorkingStatus()
  const dateRange = getDateRange()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
        {/* Left Side - Date, Time, Day Type, Status */}
        <div className="flex flex-col space-y-2">
          {/* Current Date */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>

          {/* Live Time - only show if no timesheet and can work */}
          {!existingTimesheet && canWork && (
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
              {formatLiveTime(currentTime)}
            </p>
          )}

          {/* Day Type - only show if not normal working day */}
          {dayTypeInfo && (
            <p className={`text-sm font-medium ${dayTypeInfo.color}`}>
              {dayTypeInfo.label}
            </p>
          )}

          {/* Date Range - only show for multi-day events */}
          {dateRange && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dateRange}
            </p>
          )}
        </div>

        {/* Center - Time Stats with Status Below */}
        {shouldShowUI && (
          <div className="flex flex-col items-stretch space-y-3">
            {/* Time Stats Grid */}
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

            {/* Breaks - part of the timesheet data group */}
            {((attendanceState.isClocked && attendanceState.breaks.length > 0) || (existingTimesheet && existingTimesheet.breaks && existingTimesheet.breaks.length > 0)) && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 justify-center">
                  {/* Show existing timesheet breaks or current session breaks */}
                  {existingTimesheet && existingTimesheet.breaks && existingTimesheet.breaks.length > 0 ?
                    existingTimesheet.breaks.map((breakItem) => (
                      <div key={breakItem.id} className="bg-gray-50 dark:bg-gray-700 rounded pr-3 pl-1 py-1 text-sm flex items-center">
                        <svg className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12v12H6z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 11h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5v1M12 5v1M15 5v1" />
                        </svg>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          ({formatDuration(breakItem.totalMinutes)})
                        </span>
                      </div>
                    )) :
                    attendanceState.breaks.map((breakItem) => (
                      <div key={breakItem.id} className="bg-gray-50 dark:bg-gray-700 rounded pr-3 pl-1 py-1 text-sm flex items-center">
                        <svg className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12v12H6z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 11h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5v1M12 5v1M15 5v1" />
                        </svg>
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

            {/* Working/Timesheet Status - final summary below all timesheet data */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className={`text-sm font-medium ${workingStatus.color} text-center`}>
                {workingStatus.text}
              </p>
            </div>
          </div>
        )}

        {/* Right Side - Action Buttons - show edit/delete for any timesheet, clock buttons only for workable days */}
        {shouldShowUI && (
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
            })() : canWork && !attendanceState.isClocked ? (
            <button
              onClick={handleClockIn}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Clock In</span>
            </button>
          ) : canWork ? (
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
          ) : null}
          </div>
        )}
      </div>


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