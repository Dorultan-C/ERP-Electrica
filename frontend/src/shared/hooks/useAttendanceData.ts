import { useMemo } from 'react'
import { getTimesheetsWithEmployeeNames, dummyVacations, dummyLOAs, dummyPublicHolidays, dummyClosingDays, dummySchedules } from '@/data/dummy/hr'
import { getUserEmploymentStatusForDate, isDateInRange, normalizeDate } from '@/shared/utils/employmentUtils'
import type { User } from '@/shared/types'
import type { Timesheet } from '@/shared/types/hr'
import type { AttendanceStatus } from '@/shared/constants/attendance'

export interface AttendanceRecord {
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

interface UseAttendanceDataParams {
  selectedUser: User | null
  dateRangeArray: Date[]
}

export function useAttendanceData({ selectedUser, dateRangeArray }: UseAttendanceDataParams) {
  return useMemo(() => {
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
        isDateInRange(date, l.startDate, l.endDate)
      )

      const closing = dummyClosingDays.find(c =>
        isDateInRange(date, c.startDate, c.endDate)
      )

      const vacation = dummyVacations.find(v =>
        v.userId === selectedUser.id &&
        v.status === 'approved' &&
        isDateInRange(date, v.startDate, v.endDate)
      )

      const holiday = dummyPublicHolidays.find(h =>
        new Date(h.date).toDateString() === dateStr
      )

      // Check user's actual schedule first
      const userSchedule = dummySchedules.find(schedule => schedule.id === selectedUser.assignedScheduleId)
      const dayOfWeek = date.getDay()
      const isScheduledWorkDay = userSchedule?.weekSchedule.some(scheduleDay => scheduleDay.dayOfWeek === dayOfWeek) || false

      // Check employment status for this date first
      const employmentStatus = getUserEmploymentStatusForDate(selectedUser, date)

      // Determine status and work expectation (priority order: Employment status > LOA > off schedule > holiday > closing > vacation)
      const { status, isExpectedWorkDay } = (() => {
        // Handle employment status first
        if (employmentStatus === 'pending_start' || employmentStatus === 'terminated') {
          return { status: 'not_employed' as AttendanceStatus, isExpectedWorkDay: false }
        }
        if (employmentStatus === 'suspended') {
          return { status: 'suspended' as AttendanceStatus, isExpectedWorkDay: false }
        }

        // For active/probation employees, check other statuses
        if (loa) return { status: 'loa' as AttendanceStatus, isExpectedWorkDay: false }
        if (!isScheduledWorkDay) return { status: 'off_schedule' as AttendanceStatus, isExpectedWorkDay: false }
        if (holiday) return { status: 'holiday' as AttendanceStatus, isExpectedWorkDay: false }
        if (closing) return { status: 'closed' as AttendanceStatus, isExpectedWorkDay: false }
        if (vacation) return { status: 'vacation' as AttendanceStatus, isExpectedWorkDay: false }

        // This is a scheduled work day with no time-off for an employed user
        const today = normalizeDate(new Date())
        const currentDate = normalizeDate(date)

        if (timesheet) return { status: 'present' as AttendanceStatus, isExpectedWorkDay: true }
        if (currentDate >= today) return { status: 'present' as AttendanceStatus, isExpectedWorkDay: true } // Future dates
        return { status: 'absent' as AttendanceStatus, isExpectedWorkDay: true } // Past dates without timesheet
      })()

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
}