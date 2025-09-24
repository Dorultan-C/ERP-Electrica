'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { dummyUsers } from '@/data/dummy/users'
import type { User } from '@/shared/types'
import { getTimesheetsWithEmployeeNames, dummyVacations, dummyLOAs, dummyPublicHolidays, dummyClosingDays, dummySchedules } from '@/data/dummy/hr'
import type { Timesheet } from '@/shared/types/hr'
import { useDrawer, useAuth } from '@/shared/contexts'
import { Avatar } from '@/components/ui/Avatar'
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker'
import { getUserStatusTextColor, getUserStatusLabel } from '@/shared/utils'

// Types
type AttendanceStatus = 'present' | 'absent' | 'vacation' | 'loa' | 'holiday' | 'closed'

interface AttendanceListProps {
  className?: string
}

interface AttendanceRecord {
  userId: string
  userName: string
  date: Date
  timesheet: Timesheet | undefined
  status: AttendanceStatus
  isExpectedWorkDay: boolean
  hours: number | undefined
  breaks: number | undefined
  holiday?: any // Store holiday object for name access
}

// Status configuration
const STATUS_CONFIG = {
  present: { label: 'Present', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  absent: { label: 'Absent', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' },
  vacation: { label: 'Vacation', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  loa: { label: 'Leave of Absence', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  holiday: { label: 'Public Holiday', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  closed: { label: 'Office Closed', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/20' }
} as const

// Timesheet status configuration
const TIMESHEET_STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  requires_modification: { label: 'Needs Changes', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' }
} as const

export function AttendanceList({ className = '' }: AttendanceListProps) {
  // Hooks
  const { openDrawer } = useDrawer()
  const { user: currentUser } = useAuth()

  // State management
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [hasUserManuallyClearedSelection, setHasUserManuallyClearedSelection] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | null>(() => {
    // Default to current month
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { start, end }
  })
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Set current user as default selection (only if user hasn't manually cleared it)
  useEffect(() => {
    if (currentUser && !selectedUser && !hasUserManuallyClearedSelection) {
      setSelectedUser(currentUser)
    }
  }, [currentUser, selectedUser, hasUserManuallyClearedSelection])

  // Memoized computations
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return dummyUsers

    const searchTerm = userSearchQuery.toLowerCase().trim()
    return dummyUsers.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  }, [userSearchQuery])

  const dateRangeArray = useMemo(() => {
    if (!dateRange) return []

    const dates: Date[] = []
    const { start, end } = dateRange

    // Generate all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }

    return dates
  }, [dateRange])

  const attendanceRecords = useMemo(() => {
    if (!selectedUser) return []

    const records: AttendanceRecord[] = []
    const timesheets = getTimesheetsWithEmployeeNames()

    dateRangeArray.forEach(date => {
      const dateStr = date.toDateString()

      // Find timesheet for this user/date
      const timesheet = timesheets.find(ts =>
        ts.userId === selectedUser.id &&
        new Date(ts.date).toDateString() === dateStr
      )

      // Determine time-off status (priority order: LOA > closing > vacation > holiday)
      const loa = dummyLOAs.find(l =>
        l.userId === selectedUser.id &&
        l.status === 'approved' &&
        new Date(l.startDate) <= date &&
        (!l.endDate || new Date(l.endDate) >= date)
      )

      const closing = dummyClosingDays.find(c =>
        new Date(c.startDate) <= date &&
        new Date(c.endDate) >= date
      )

      const vacation = dummyVacations.find(v =>
        v.userId === selectedUser.id &&
        v.status === 'approved' &&
        new Date(v.startDate) <= date &&
        new Date(v.endDate) >= date
      )

      const holiday = dummyPublicHolidays.find(h =>
        new Date(h.date).toDateString() === dateStr
      )

      // Determine status and work expectation
      let status: AttendanceStatus
      let isExpectedWorkDay = true

      if (loa) {
        status = 'loa'
        isExpectedWorkDay = false
      } else if (closing) {
        status = 'closed'
        isExpectedWorkDay = false
      } else if (vacation) {
        status = 'vacation'
        isExpectedWorkDay = false
      } else if (holiday) {
        status = 'holiday'
        isExpectedWorkDay = false // Optional work day
      } else {
        // Check user's actual schedule to determine if this is a work day
        const userSchedule = dummySchedules.find(schedule => schedule.id === selectedUser.assignedScheduleId)
        const dayOfWeek = date.getDay()

        // Check if this day is in the user's work schedule
        const isScheduledWorkDay = userSchedule?.weekSchedule.some(scheduleDay => scheduleDay.dayOfWeek === dayOfWeek) || false

        if (isScheduledWorkDay) {
          const today = new Date()
          const isDateTodayOrFuture = date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())

          if (timesheet) {
            status = 'present'
          } else if (isDateTodayOrFuture) {
            // Future work days show no status unless there are specific time-off reasons above
            status = 'present' // Will be handled in status display to show nothing
          } else {
            status = 'absent' // Past dates without timesheet are truly absent
          }
          isExpectedWorkDay = true
        } else {
          status = 'absent'
          isExpectedWorkDay = false
        }
      }

      records.push({
        userId: selectedUser.id,
        userName: `${selectedUser.firstName} ${selectedUser.lastName}`,
        date,
        timesheet,
        status,
        isExpectedWorkDay,
        hours: timesheet?.totalMinutes ? Math.round(timesheet.totalMinutes / 60 * 10) / 10 : undefined,
        breaks: timesheet?.breakMinutes ? Math.round(timesheet.breakMinutes / 60 * 10) / 10 : undefined,
        holiday: holiday // Store the holiday object if it exists
      })
    })

    return records.sort((a, b) => a.date.getTime() - b.date.getTime()) // Chronological order
  }, [selectedUser, dateRangeArray])

  // Event handlers
  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user)
    setShowUserDropdown(false)
    setUserSearchQuery('')
    // Reset the manual clear flag when user actively selects someone
    setHasUserManuallyClearedSelection(false)
  }, [])

  const handleUserRemove = useCallback(() => {
    setSelectedUser(null)
    setHasUserManuallyClearedSelection(true)
  }, [])


  const handleTimesheetClick = useCallback((timesheet: Timesheet) => {
    openDrawer(timesheet.id, 'timesheets')
  }, [openDrawer])

  // Helper functions
  const getStatusDisplay = (record: AttendanceRecord) => {
    // If there's a timesheet, prioritize timesheet status
    if (record.timesheet) {
      const timesheetConfig = TIMESHEET_STATUS_CONFIG[record.timesheet.status]

      // If it's a non-expected work day with a timesheet, show both statuses
      if (!record.isExpectedWorkDay) {
        const dayConfig = STATUS_CONFIG[record.status]
        let dayLabel: string = dayConfig.label
        if (record.status === 'absent') {
          dayLabel = 'Off Schedule'
        } else if (record.status === 'holiday' && record.holiday?.name) {
          dayLabel = record.holiday.name
        }

        return {
          primaryLabel: timesheetConfig.label,
          primaryColor: timesheetConfig.color,
          primaryBgColor: timesheetConfig.bgColor,
          secondaryLabel: dayLabel,
          secondaryColor: record.status === 'absent' ? 'text-gray-600 dark:text-gray-400' : dayConfig.color,
          secondaryBgColor: record.status === 'absent' ? 'bg-gray-100 dark:bg-gray-900/20' : dayConfig.bgColor,
          hasDualStatus: true
        }
      } else {
        // Expected work day with timesheet - show only timesheet status
        return {
          primaryLabel: timesheetConfig.label,
          primaryColor: timesheetConfig.color,
          primaryBgColor: timesheetConfig.bgColor,
          hasDualStatus: false
        }
      }
    } else {
      // No timesheet - show day status only
      const config = STATUS_CONFIG[record.status]
      let label: string = config.label
      let color = config.color
      let bgColor = config.bgColor

      if (record.status === 'absent' && !record.isExpectedWorkDay) {
        label = 'Off Schedule'
        color = 'text-gray-600 dark:text-gray-400'
        bgColor = 'bg-gray-100 dark:bg-gray-900/20'
      } else if (record.status === 'holiday' && record.holiday?.name) {
        // Use the specific holiday name instead of generic "Public Holiday"
        label = record.holiday.name
      } else if (record.status === 'present' && record.isExpectedWorkDay) {
        // Check if this is a future date without timesheet
        const today = new Date()
        const isDateTodayOrFuture = record.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())

        if (isDateTodayOrFuture) {
          // Future work day without timesheet - show nothing
          return {
            primaryLabel: '',
            primaryColor: '',
            primaryBgColor: '',
            hasDualStatus: false,
            showNothing: true
          }
        }
      }

      return {
        primaryLabel: label,
        primaryColor: color,
        primaryBgColor: bgColor,
        hasDualStatus: false
      }
    }
  }

  const formatDateForList = (date: Date) => {
    // Check if all dates are in the same month/year to determine what to show
    const allSameYear = attendanceRecords.every(r => r.date.getFullYear() === attendanceRecords[0]?.date.getFullYear())
    const allSameMonth = attendanceRecords.every(r =>
      r.date.getFullYear() === attendanceRecords[0]?.date.getFullYear() &&
      r.date.getMonth() === attendanceRecords[0]?.date.getMonth()
    )

    if (allSameMonth) {
      // Same month and year - show only day number
      return date.getDate().toString()
    } else if (allSameYear) {
      // Same year - show month/day
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      // Different years - show month/day/year
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
    }
  }

  const formatDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Filters Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Selection */}
          <div>
            {/* User Search Dropdown */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : userSearchQuery}
                  onChange={(e) => {
                    if (selectedUser) {
                      // If user is selected and they start typing, clear selection and use their input
                      setSelectedUser(null)
                      setUserSearchQuery(e.target.value)
                    } else {
                      setUserSearchQuery(e.target.value)
                    }
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {selectedUser && (
                  <button
                    onClick={handleUserRemove}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                    aria-label="Clear selected employee"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {showUserDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className={`w-full text-left px-3 py-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between transition-colors ${
                          selectedUser?.id === user.id
                            ? 'bg-blue-50 dark:bg-blue-900/50'
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={user.profileImage}
                            name={`${user.firstName} ${user.lastName}`}
                            size="sm"
                            className="flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center text-xs font-medium ${getUserStatusTextColor(user.status)}`}>
                                {getUserStatusLabel(user.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedUser?.id === user.id && (
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm text-center">
                      No employees found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="p-4">
        {!selectedUser ? (
          <div className="text-center py-3">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium text-gray-900 dark:text-white mb-1">No Employee Selected</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose an employee from the dropdown above to view their attendance records
              </p>
            </div>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="text-center py-3">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium text-gray-900 dark:text-white mb-1">No Records Found</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No attendance records found for the selected date range
              </p>
            </div>
          </div>
        ) : (
          <div>

            {/* Table-style list */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-4 gap-4 px-4 py-3">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Entry / Exit
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Hours
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {attendanceRecords.map((record, index) => {
                  const statusDisplay = getStatusDisplay(record)
                  const isClickable = !!record.timesheet
                  const isGrayedOut = !record.isExpectedWorkDay
                  const isToday = record.date.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={index}
                      onClick={isClickable ? () => handleTimesheetClick(record.timesheet!) : undefined}
                      className={`grid grid-cols-4 gap-4 px-6 py-3 transition-colors ${
                        isToday
                          ? 'bg-blue-200 dark:bg-blue-900/60 relative'
                          : isGrayedOut
                          ? 'bg-gray-100 dark:bg-gray-900'
                          : 'bg-white dark:bg-gray-800'
                      } ${
                        isClickable
                          ? isToday
                            ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30'
                            : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          : ''
                      }`}
                    >
                      {isToday && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      )}
                      {/* Date Column */}
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {formatDateForList(record.date)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDayOfWeek(record.date)}
                        </div>
                      </div>

                      {/* Status Column */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center space-x-2">
                          {!statusDisplay.showNothing && (
                            <>
                              {statusDisplay.hasDualStatus && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.secondaryColor} ${statusDisplay.secondaryBgColor}`}>
                                  {statusDisplay.secondaryLabel}
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.primaryColor} ${statusDisplay.primaryBgColor}`}>
                                {statusDisplay.primaryLabel}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Timesheet Column */}
                      <div className="flex flex-col justify-center">
                        {record.timesheet ? (
                          <div className="font-medium text-lg text-gray-700 dark:text-gray-300 flex items-center">
                            <svg className="w-5 h-5 mr-1 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {record.timesheet.startTime && record.timesheet.endTime ? (
                              `${new Date(record.timesheet.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(record.timesheet.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
                            ) : record.timesheet.startTime ? (
                              `${new Date(record.timesheet.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - In Progress`
                            ) : (
                              'Incomplete'
                            )}
                          </div>
                        ) : (
                          <div className="text-base text-gray-400 dark:text-gray-500"></div>
                        )}
                      </div>

                      {/* Hours Column */}
                      <div className="flex flex-col justify-center">
                        {record.timesheet && record.hours ? (
                          <div className="flex items-center justify-start space-x-4">
                            <div className="font-medium text-gray-700 dark:text-gray-300 text-lg flex items-center">
                              <svg className="w-5 h-5 mr-1 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={2} />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                                <line x1="4" y1="12" x2="20" y2="12" strokeWidth={1} />
                              </svg>
                              {Math.floor(record.timesheet!.totalMinutes / 60)}h {record.timesheet!.totalMinutes % 60}m
                            </div>
                            {record.breaks !== undefined && record.breaks > 0 && (
                              <div className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                                <svg className="w-5 h-5 mr-1 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12v12H6z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 11h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5v1M12 5v1M15 5v1" />
                                </svg>
                                {Math.floor(record.timesheet!.breakMinutes / 60)}h {record.timesheet!.breakMinutes % 60}m
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500"></div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}