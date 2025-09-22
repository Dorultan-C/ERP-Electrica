'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/shared/contexts'
import { Avatar } from '@/components/ui/Avatar'
import { dummyTimesheetListItems } from '@/data/dummy/hr'

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
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({
    isClocked: false,
    onBreak: false,
    totalWorkedMinutes: 0,
    totalBreakMinutes: 0,
    breaks: []
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Check if there's already a timesheet for today
  const today = new Date()
  const todayString = today.toDateString()
  const existingTimesheet = user ? dummyTimesheetListItems.find(
    timesheet => timesheet.userId === user.id &&
    new Date(timesheet.date).toDateString() === todayString
  ) : null

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

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
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
    if (existingTimesheet) return 'Timesheet already exists for today'
    if (!attendanceState.isClocked) return 'Not clocked in'
    if (attendanceState.onBreak) return 'On break'
    return 'Working'
  }

  // Get status color
  const getStatusColor = () => {
    if (existingTimesheet) return 'text-blue-600 dark:text-blue-400'
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
        {/* Left Side - User Info & Status */}
        <div className="flex items-center space-x-4">
          <Avatar
            src={user?.profileImage}
            name={user ? `${user.firstName} ${user.lastName}` : 'User'}
            size="large"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Current User'}
            </h3>
            <p className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Center - Time Stats */}
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
              {formatDuration(getCurrentBreakTime())}
            </div>
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {existingTimesheet ? (
            <div className="px-6 py-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200 font-medium rounded-lg flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Timesheet Exists</span>
            </div>
          ) : !attendanceState.isClocked ? (
            <button
              onClick={handleClockIn}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Start Break</span>
                </button>
              ) : (
                <button
                  onClick={handleEndBreak}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Clock Out</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Break History (shown when clocked in and have breaks) */}
      {attendanceState.isClocked && attendanceState.breaks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Today's Breaks
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {attendanceState.breaks.map((breakItem) => (
              <div key={breakItem.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTime(breakItem.startTime)} - {breakItem.endTime ? formatTime(breakItem.endTime) : 'Ongoing'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Duration: {formatDuration(breakItem.duration)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}