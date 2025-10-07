"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { dummyUsers } from "@/data/dummy/users";
import type { User } from "@/shared/types";
import { dummyVacations, dummyLOAs, dummyClosingDays } from "@/data/dummy/hr";
import type { Timesheet } from "@/shared/types/hr";
import { useDrawer, useAuth } from "@/shared/contexts";
import { type DateRange } from "@/components/ui/DateRangePicker";
import { Pagination } from "@/components/ui/datalist/components/Pagination";
import { usePermissions } from "@/shared/hooks/usePermissions";
import {
  approveTimesheet,
  requestTimesheetChanges,
} from "@/shared/utils/timesheetActions";
import { AttendanceFilters } from "./AttendanceFilters";
import {
  useAttendanceData,
  type AttendanceRecord,
} from "@/shared/hooks/useAttendanceData";
import { TimesheetActionButtons } from "@/components/shared/TimesheetActionButtons";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import {
  isDateInRange,
  isUserEmployedOnDate,
} from "@/shared/utils/employmentUtils";
import {
  ATTENDANCE_STATUS_CONFIG,
  TIMESHEET_STATUS_CONFIG,
  DEFAULT_ITEMS_PER_PAGE,
} from "@/shared/constants/attendance";

// Types
type AttendanceStatus = 'present' | 'absent' | 'vacation' | 'loa' | 'holiday' | 'closed' | 'off_schedule'

interface AttendanceListProps {
  className?: string;
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
  closed: { label: 'Office Closed', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  off_schedule: { label: 'Off Schedule', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/20' }
}

// Timesheet status configuration
const TIMESHEET_STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'text-yellow-700 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  approved: { label: 'Approved', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  requires_modification: { label: 'Needs Changes', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' }
} as const

// Constants
const ITEMS_PER_PAGE = 20

// Helper functions
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const isDateInRange = (date: Date, startDate: Date, endDate?: Date): boolean => {
  const normalizedDate = normalizeDate(date)
  const normalizedStart = normalizeDate(startDate)
  const normalizedEnd = endDate ? normalizeDate(endDate) : normalizedStart

  return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd
}

// Action Button Component
interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void
  className: string
  title: string
  children: React.ReactNode
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, className, title, children }) => (
  <button
    onClick={onClick}
    className={`p-2 btn-small rounded-md cursor-pointer ${className}`}
    title={title}
  >
    {children}
  </button>
)

export function AttendanceList({ className = '' }: AttendanceListProps) {
export function AttendanceList({ className = "" }: AttendanceListProps) {
  // Hooks
  const { open: openDrawer } = useDrawer();
  const { user: currentUser } = useAuth();
  const { hasPermission } = usePermissions();

  // Permission checks
  const canReadOwn = hasPermission("hr-attendance-manage-owns", "read");
  const canReadOthers = hasPermission("hr-attendance-manage-others", "read");

  // State management
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [hasUserManuallyClearedSelection, setHasUserManuallyClearedSelection] =
    useState(false);
  const [dateRange, setDateRange] = useState<DateRange | null>(() => {
    // Default to current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [timesheetToDelete, setTimesheetToDelete] = useState<string | null>(
    null
  );

  // Available users based on permissions
  const availableUsers = useMemo(() => {
    // Filter users based on read permissions (own and/or others)
    if (canReadOthers && canReadOwn) return dummyUsers;
    if (canReadOthers)
      return dummyUsers.filter((user) => user.id !== currentUser?.id);
    if (canReadOwn) return currentUser ? [currentUser] : [];
    return [];
  }, [canReadOthers, canReadOwn, currentUser]);

  // Set current user as default selection (only if user hasn't manually cleared it)
  useEffect(() => {
    if (
      !selectedUser &&
      !hasUserManuallyClearedSelection &&
      availableUsers.length > 0
    ) {
      setSelectedUser(availableUsers[0] ?? null);
    }
    // If user can only read their own attendance, force selection to current user
    if (currentUser && canReadOwn && !canReadOthers && selectedUser?.id !== currentUser.id) {
      setSelectedUser(currentUser)
    }
  }, [currentUser, selectedUser, hasUserManuallyClearedSelection, canReadOwn, canReadOthers])

  // Memoized computations
  const filteredUsers = useMemo(() => {
    // If user can only read their own attendance, only show current user
    const availableUsers = canReadOthers ? dummyUsers : (currentUser ? [currentUser] : [])

    if (!userSearchQuery.trim()) return availableUsers

    const searchTerm = userSearchQuery.toLowerCase().trim()
    return availableUsers.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    )
  }, [userSearchQuery, canReadOthers, currentUser])
    if (
      currentUser &&
      canReadOwn &&
      !hasUserManuallyClearedSelection &&
      (!selectedUser || (!canReadOthers && selectedUser?.id !== currentUser.id))
    ) {
      setSelectedUser(currentUser);
    }
  }, [
    currentUser,
    selectedUser,
    hasUserManuallyClearedSelection,
    canReadOwn,
    canReadOthers,
    availableUsers,
  ]);

  const dateRangeArray = useMemo(() => {
    if (!dateRange) return [];

    const dates: Date[] = [];
    const { start, end } = dateRange;

    // Generate all dates in range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
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

      // Determine status and work expectation (priority order: LOA > off schedule > holiday > closing > vacation)
      const { status, isExpectedWorkDay } = (() => {
        if (loa) return { status: 'loa' as AttendanceStatus, isExpectedWorkDay: false }
        if (!isScheduledWorkDay) return { status: 'off_schedule' as AttendanceStatus, isExpectedWorkDay: false }
        if (holiday) return { status: 'holiday' as AttendanceStatus, isExpectedWorkDay: false }
        if (closing) return { status: 'closed' as AttendanceStatus, isExpectedWorkDay: false }
        if (vacation) return { status: 'vacation' as AttendanceStatus, isExpectedWorkDay: false }

        // This is a scheduled work day with no time-off
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
    return dates;
  }, [dateRange]);

  // Use the new attendance data hook
  const attendanceRecords = useAttendanceData({ selectedUser, dateRangeArray });

  // Determine if pagination should be used
  const isWholeMonth = useMemo(() => {
    if (!dateRange) return false;

    const { start, end } = dateRange;
    const startOfMonth = new Date(start.getFullYear(), start.getMonth(), 1);
    const endOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    // Check if the selected range exactly matches a whole month
    return (
      start.getTime() === startOfMonth.getTime() &&
      end.getTime() === endOfMonth.getTime()
    );
  }, [dateRange]);

  const shouldUsePagination = useMemo(() => {
    return !isWholeMonth && attendanceRecords.length > DEFAULT_ITEMS_PER_PAGE;
  }, [isWholeMonth, attendanceRecords.length]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    if (!shouldUsePagination) {
      return attendanceRecords;
    }

    const startIndex = (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE;
    const endIndex = startIndex + DEFAULT_ITEMS_PER_PAGE;
    return attendanceRecords.slice(startIndex, endIndex);
  }, [attendanceRecords, currentPage, shouldUsePagination]);

  const totalPages = useMemo(() => {
    if (!shouldUsePagination) return 1;
    return Math.ceil(attendanceRecords.length / DEFAULT_ITEMS_PER_PAGE);
  }, [attendanceRecords.length, shouldUsePagination]);

  // Reset pagination when date range or user changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, selectedUser]);

  // Event handlers
  const handleUserSelect = useCallback((user: User) => {
    setSelectedUser(user);
    // Reset the manual clear flag when user actively selects someone
    setHasUserManuallyClearedSelection(false);
  }, []);

  const handleUserRemove = useCallback(() => {
    setSelectedUser(null);
    setHasUserManuallyClearedSelection(true);
  }, []);

  const handleCreateTimesheet = useCallback(() => {
    if (!selectedUser) return;
    console.log("Create new timesheet for user:", selectedUser.id);
    // TODO: Open timesheet creation drawer (Phase 9+)
  }, [selectedUser]);

  const handleTimesheetClick = useCallback(
    (timesheet: Timesheet) => {
      openDrawer(timesheet.id, "timesheets");
    },
    [openDrawer]
  );

  // Action handlers
  const handleApprove = useCallback(
    async (timesheetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUser) return;

      try {
        const result = await approveTimesheet(timesheetId, currentUser.id);
        if (!result.success) {
          console.error("Failed to approve:", result.error);
        }
        // Force re-render by updating dummy data
        window.location.reload(); // In real app, this would be handled by state management
      } catch (error) {
        console.error("Error approving timesheet:", error);
      }
    },
    [currentUser]
  );

  const handleRequestChanges = useCallback(
    async (timesheetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentUser) return;

      try {
        const result = await requestTimesheetChanges(
          timesheetId,
          currentUser.id,
          "Please review and make necessary changes"
        );
        if (!result.success) {
          console.error("Failed to request changes:", result.error);
        }
        // Force re-render by updating dummy data
        window.location.reload(); // In real app, this would be handled by state management
      } catch (error) {
        console.error("Error requesting timesheet changes:", error);
      }
    },
    [currentUser]
  );

  const handleDelete = useCallback(
    (timesheetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setTimesheetToDelete(timesheetId);
      setShowDeleteConfirm(true);
    },
    []
  );

  const handleDeleteTimesheet = useCallback(async () => {
    if (!currentUser || !timesheetToDelete) return;

    try {
      console.log("Delete timesheet:", timesheetToDelete);
      // TODO: Implement actual deletion logic (Phase 9+)
      // Force re-render by updating dummy data
      window.location.reload(); // In real app, this would be handled by state management
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    } finally {
      setShowDeleteConfirm(false);
      setTimesheetToDelete(null);
    }
  }, [currentUser, timesheetToDelete]);

  const handleEdit = useCallback(
    async (timesheetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("Edit timesheet:", timesheetId);
      // TODO: Implement edit functionality (Phase 9+)
    },
    []
  );

  const handleCreateTimesheetForDate = useCallback(
    async (userId: string, date: Date, e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("Create timesheet for user:", userId, "on date:", date);
      // TODO: Implement create timesheet functionality (Phase 9+)
    },
    []
  );

  const handleRequestTimesheet = useCallback(
    async (userId: string, date: Date, e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("Request timesheet for user:", userId, "on date:", date);
      // TODO: Implement request timesheet functionality (Phase 9+)
    },
    []
  );

  // Helper functions
  const getStatusDisplay = useCallback((record: AttendanceRecord) => {
    // If there's a timesheet, prioritize timesheet status
    if (record.timesheet) {
      const timesheetConfig = TIMESHEET_STATUS_CONFIG[record.timesheet.status];

      // If it's a non-expected work day with a timesheet, show both statuses
      if (!record.isExpectedWorkDay) {
        const dayConfig = ATTENDANCE_STATUS_CONFIG[record.status];
        let dayLabel: string = dayConfig.label;
        if (record.status === "holiday" && record.holiday?.name) {
          dayLabel = record.holiday.name;
        }

        return {
          primaryLabel: timesheetConfig.label,
          primaryColor: timesheetConfig.color,
          primaryBgColor: timesheetConfig.bgColor,
          secondaryLabel: dayLabel,
          secondaryColor: dayConfig.color,
          secondaryBgColor: dayConfig.bgColor,
          hasDualStatus: true,
        };
      } else {
        // Expected work day with timesheet - show only timesheet status
        return {
          primaryLabel: timesheetConfig.label,
          primaryColor: timesheetConfig.color,
          primaryBgColor: timesheetConfig.bgColor,
          hasDualStatus: false,
        };
      }
    } else {
      // No timesheet - show day status only
      const config = ATTENDANCE_STATUS_CONFIG[record.status];
      let label: string = config.label;
      const color = config.color;
      const bgColor = config.bgColor;

      if (record.status === "holiday" && record.holiday?.name) {
        // Use the specific holiday name instead of generic "Public Holiday"
        label = record.holiday.name;
      } else if (record.status === "present" && record.isExpectedWorkDay) {
        // Check if this is a future date without timesheet
        const today = new Date();
        const isDateTodayOrFuture =
          record.date >=
          new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (isDateTodayOrFuture) {
          // Future work day without timesheet - show nothing
          return {
            primaryLabel: "",
            primaryColor: "",
            primaryBgColor: "",
            hasDualStatus: false,
            showNothing: true,
          };
        }
      }

      return {
        primaryLabel: label,
        primaryColor: color,
        primaryBgColor: bgColor,
        hasDualStatus: false,
      };
    }
  }, []);

  const formatDateForList = (date: Date) => {
    // Check if all dates are in the same month/year to determine what to show
    const allSameYear = attendanceRecords.every(
      (r) => r.date.getFullYear() === attendanceRecords[0]?.date.getFullYear()
    );
    const allSameMonth = attendanceRecords.every(
      (r) =>
        r.date.getFullYear() === attendanceRecords[0]?.date.getFullYear() &&
        r.date.getMonth() === attendanceRecords[0]?.date.getMonth()
    );

    if (allSameMonth) {
      // Same month and year - show only day number
      return date.getDate().toString();
    } else if (allSameYear) {
      // Same year - show month/day
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      // Different years - show month/day/year
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      });
    }
  };

  const formatDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Filters Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Selection - only show dropdown if user can read others' attendance */}
          {canReadOthers && (
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
          )}

          {/* Date Range Selection */}
          <div>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
            />
          </div>

          {/* Create Timesheet Button */}
          {selectedUser && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  console.log('Create new timesheet for user:', selectedUser.id)
                  // TODO: Open timesheet creation drawer (Phase 9+)
                }}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className='sm:hidden lg:flex ml-2'>New Timesheet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Records */}
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Early return for no permissions
  if (!canReadOwn && !canReadOthers) {
    return null;
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <AttendanceFilters
        selectedUser={selectedUser}
        dateRange={dateRange}
        canReadOthers={canReadOthers}
        currentUser={currentUser}
        availableUsers={availableUsers}
        onUserSelect={handleUserSelect}
        onUserRemove={handleUserRemove}
        onDateRangeChange={setDateRange}
        onCreateTimesheet={handleCreateTimesheet}
      />

      <div className="p-4">
        {!selectedUser ? (
          <div className="text-center py-3">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                No Employee Selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose an employee from the dropdown above to view their
                attendance records
              </p>
            </div>
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="text-center py-3">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                No Records Found
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No attendance records found for the selected date range
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Single Responsive Grid View */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-5 gap-4 px-4 py-3">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-start">
                    Date
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-center">
                    Status
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-center">
                    Entry / Exit
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-center">
                    Hours
                  </div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-end">
                    Actions
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedRecords.map((record, index) => {
                  const statusDisplay = getStatusDisplay(record);
                  const isGrayedOut = !record.isExpectedWorkDay;
                  const today = new Date();
                  const isToday =
                    record.date.toDateString() === today.toDateString();
                  const isNotFutureDate = record.date <= today;

                  // Permission checks for actions and reading
                  const isOwnTimesheet = record.timesheet?.userId === currentUser?.id
                  const permissionType = isOwnTimesheet ? 'hr-attendance-manage-owns' : 'hr-attendance-manage-others'
                  const canReadTimesheet = hasPermission(permissionType, 'read')
                  const isClickable = !!record.timesheet && canReadTimesheet
                  const isApproved = record.timesheet?.status === 'approved'
                  const isChangeRequired = record.timesheet?.status === 'requires_modification'
                  const isPending = record.timesheet?.status === 'pending' || isChangeRequired
                  const isOwnRecord = selectedUser?.id === currentUser?.id;
                  const permissionType = isOwnRecord
                    ? "hr-attendance-manage-owns"
                    : "hr-attendance-manage-others";
                  const canReadTimesheet = hasPermission(
                    permissionType,
                    "read"
                  );

                  // Check if user was employed on this date for action permissions
                  const isUserEmployed = selectedUser
                    ? isUserEmployedOnDate(selectedUser, record.date)
                    : false;

                  const isClickable = !!record.timesheet && canReadTimesheet;
                  const isApproved = record.timesheet?.status === "approved";
                  const isChangeRequired =
                    record.timesheet?.status === "requires_modification";
                  const isPending =
                    record.timesheet?.status === "pending" || isChangeRequired;

                  const canApprove = isPending && hasPermission(permissionType, 'approve')
                  const canRequestChanges = isPending && hasPermission(permissionType, 'request_changes') && !isChangeRequired
                  const canDelete = hasPermission(permissionType, isApproved ? 'delete_approved' : 'delete')
                  const canEdit = canReadTimesheet && hasPermission(permissionType, isApproved ? 'update_approved' : 'update')

                  // Disable actions for non-employed or suspended users
                  const canApprove =
                    isPending &&
                    hasPermission(permissionType, "approve") &&
                    isUserEmployed;
                  const canRequestChanges =
                    isPending &&
                    hasPermission(permissionType, "request_changes") &&
                    !isChangeRequired &&
                    isUserEmployed;
                  const canDelete =
                    hasPermission(
                      permissionType,
                      isApproved ? "delete_approved" : "delete"
                    ) && isUserEmployed;
                  const canEdit =
                    canReadTimesheet &&
                    hasPermission(
                      permissionType,
                      isApproved ? "update_approved" : "update"
                    ) &&
                    isUserEmployed;

                  // For workable days without timesheets - create/request buttons
                  // Optional work days: all days except vacation and LOA (when user is employed)
                  // Use underlying vacation/LOA status, not displayed status (due to priority system)
                  const hasUnderlyingVacation = dummyVacations.find(
                    (v) =>
                      v.userId === selectedUser.id &&
                      v.status === "approved" &&
                      isDateInRange(record.date, v.startDate, v.endDate)
                  );
                  const hasUnderlyingLOA = dummyLOAs.find(
                    (l) =>
                      l.userId === selectedUser.id &&
                      l.status === "approved" &&
                      isDateInRange(record.date, l.startDate, l.endDate)
                  );
                  const hasClosingDay = dummyClosingDays.find((closing) =>
                    isDateInRange(
                      record.date,
                      closing.startDate,
                      closing.endDate
                    )
                  );
                  const isWorkableDay =
                    !record.timesheet &&
                    isUserEmployed &&
                    !hasUnderlyingVacation &&
                    !hasUnderlyingLOA &&
                    !hasClosingDay;
                  const canCreateTimesheet =
                    isWorkableDay &&
                    isNotFutureDate &&
                    hasPermission(permissionType, "create");
                  const canRequestTimesheet =
                    isWorkableDay &&
                    isNotFutureDate &&
                    !isOwnRecord &&
                    hasPermission(
                      "hr-attendance-manage-others",
                      "request_changes"
                    );

                  // Common props for TimesheetActionButtons to avoid duplication
                  const timesheetActionProps = {
                    timesheet: record.timesheet,
                    userId: selectedUser?.id || "",
                    date: record.date,
                    canApprove,
                    canRequestChanges,
                    canEdit,
                    canDelete,
                    canCreate: canCreateTimesheet,
                    canRequestFromOthers: canRequestTimesheet,
                    onApprove: handleApprove,
                    onRequestChanges: handleRequestChanges,
                    onEdit: handleEdit,
                    onDelete: handleDelete,
                    onCreate: handleCreateTimesheetForDate,
                    onRequest: handleRequestTimesheet,
                  };

                  return (
                    <div
                      key={index}
                      onClick={isClickable ? () => handleTimesheetClick(record.timesheet!) : undefined}
                      className={`grid grid-cols-5 gap-4 px-6 py-3 transition-colors ${
                      onClick={
                        isClickable
                          ? () => handleTimesheetClick(record.timesheet!)
                          : undefined
                      }
                      className={`sm:grid sm:grid-cols-[auto_auto_auto_1fr] xl:grid-cols-[auto_auto_auto_auto_1fr] sm:gap-8 flex flex-col gap-2 pl-4 p-3 transition-colors ${
                        isToday
                          ? "bg-blue-200 dark:bg-blue-900/60 relative"
                          : isGrayedOut
                            ? "bg-gray-100 dark:bg-gray-900"
                            : "bg-white dark:bg-gray-800"
                      } ${
                        isClickable
                          ? isToday
                            ? "cursor-pointer [&:not(:has(.pointer-events-auto:hover))]:hover:bg-blue-100 dark:[&:not(:has(.pointer-events-auto:hover))]:hover:bg-blue-900/30"
                            : "cursor-pointer [&:not(:has(.pointer-events-auto:hover))]:hover:bg-gray-50 dark:[&:not(:has(.pointer-events-auto:hover))]:hover:bg-gray-700/50"
                          : ""
                      }`}
                    >
                      {isToday && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      )}
                      {/* Date Column */}
                      <div className="flex flex-col items-start">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {formatDateForList(record.date)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatDayOfWeek(record.date)}
                        </div>
                      </div>

                      {/* Status Column */}
                      <div className="flex flex-col justify-center items-center">
                        <div className="flex items-center space-x-2">
                        {/* Status - stacked on right */}
                        <div className="flex flex-col items-end">
                          {!statusDisplay.showNothing && (
                            <>
                              {statusDisplay.hasDualStatus && (
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusDisplay.secondaryColor} ${statusDisplay.secondaryBgColor} mb-1`}
                                >
                                  {statusDisplay.secondaryLabel}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusDisplay.primaryColor} ${statusDisplay.primaryBgColor}`}
                              >
                                {statusDisplay.primaryLabel}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Date Column - Hidden on small screens, visible sm+ */}
                      <div className="hidden sm:flex flex-col items-start">
                        <div className="font-medium text-gray-900 dark:text-white text-sm whitespace-nowrap">
                          {formatDateForList(record.date)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatDayOfWeek(record.date)}
                        </div>
                      </div>

                      {/* Status Column - Hidden on small screens, visible sm+ */}
                      <div className="hidden sm:flex flex-col justify-center items-center">
                        <div className="flex xl:flex-row flex-col xl:items-center items-center xl:space-x-2 space-y-1 xl:space-y-0">
                          {!statusDisplay.showNothing && (
                            <>
                              {statusDisplay.hasDualStatus && (
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusDisplay.secondaryColor} ${statusDisplay.secondaryBgColor}`}
                                >
                                  {statusDisplay.secondaryLabel}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusDisplay.primaryColor} ${statusDisplay.primaryBgColor}`}
                              >
                                {statusDisplay.primaryLabel}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Entry / Exit Column */}
                      <div className="flex flex-col justify-center items-center">
                      {/* Row 2: Entry/Exit times and Hours (side by side, wrapping when no space) - Only on screens smaller than sm */}
                      {record.timesheet && (
                        <div className="sm:hidden flex flex-wrap justify-center items-center gap-x-5 gap-y-2 w-full mb-3 mt-2">
                          {canReadTimesheet ? (
                            <>
                              {/* Entry/Exit Times */}
                              <div className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {record.timesheet.startTime &&
                                record.timesheet.endTime
                                  ? `${new Date(record.timesheet.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} - ${new Date(record.timesheet.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`
                                  : record.timesheet.startTime
                                    ? `${new Date(record.timesheet.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} - In Progress`
                                    : "Incomplete"}
                              </div>

                              {/* Hours */}
                              {record.hours && (
                                <div className="flex items-center space-x-4">
                                  <div className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <rect
                                        x="4"
                                        y="8"
                                        width="16"
                                        height="12"
                                        rx="2"
                                        strokeWidth={2}
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
                                      />
                                      <line
                                        x1="4"
                                        y1="12"
                                        x2="20"
                                        y2="12"
                                        strokeWidth={1}
                                      />
                                    </svg>
                                    {Math.floor(
                                      record.timesheet.totalMinutes / 60
                                    )}
                                    h {record.timesheet.totalMinutes % 60}m
                                  </div>
                                  {record.breaks !== undefined &&
                                    record.breaks > 0 && (
                                      <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                                        <svg
                                          className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 7h12v12H6z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M18 11h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5v1M12 5v1M15 5v1"
                                          />
                                        </svg>
                                        {Math.floor(
                                          record.timesheet.breakMinutes / 60
                                        )}
                                        h {record.timesheet.breakMinutes % 60}m
                                      </div>
                                    )}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                              Limited access
                            </div>
                          )}
                        </div>
                      )}

                      {/* Entry/Exit & Hours Column - Hidden on small screens, visible sm+ */}
                      <div className="hidden sm:flex flex-col justify-center items-center">
                        {record.timesheet ? (
                          canReadTimesheet ? (
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
                            <div>
                              {/* Entry/Exit Times - Show on xl+, or show with hours below on lg- */}
                              <div className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center whitespace-nowrap xl:justify-center justify-center">
                                <svg
                                  className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {record.timesheet.startTime &&
                                record.timesheet.endTime
                                  ? `${new Date(record.timesheet.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} - ${new Date(record.timesheet.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`
                                  : record.timesheet.startTime
                                    ? `${new Date(record.timesheet.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} - In Progress`
                                    : "Incomplete"}
                              </div>

                              {/* Hours - Show on lg and below, hide on xl+ */}
                              {record.hours && (
                                <div className="xl:hidden flex items-center space-x-4 whitespace-nowrap justify-center mt-2">
                                  <div className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <rect
                                        x="4"
                                        y="8"
                                        width="16"
                                        height="12"
                                        rx="2"
                                        strokeWidth={2}
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
                                      />
                                      <line
                                        x1="4"
                                        y1="12"
                                        x2="20"
                                        y2="12"
                                        strokeWidth={1}
                                      />
                                    </svg>
                                    {Math.floor(
                                      record.timesheet!.totalMinutes / 60
                                    )}
                                    h {record.timesheet!.totalMinutes % 60}m
                                  </div>
                                  {record.breaks !== undefined &&
                                    record.breaks > 0 && (
                                      <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                                        <svg
                                          className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 7h12v12H6z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M18 11h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2"
                                          />
                                        </svg>
                                        {Math.floor(
                                          record.timesheet!.breakMinutes / 60
                                        )}
                                        h {record.timesheet!.breakMinutes % 60}m
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                              Limited access
                            </div>
                          )
                        ) : (
                          <div className="text-base text-gray-400 dark:text-gray-500"></div>
                        )}
                      </div>

                      {/* Hours Column */}
                      <div className="flex flex-col justify-center items-center">
                        {record.timesheet && record.hours ? (
                          canReadTimesheet ? (
                            <div className="flex items-center justify-start space-x-4">
                              <div className="font-medium text-gray-700 dark:text-gray-300 text-lg flex items-center">
                                <svg className="w-5 h-5 mr-1 text-gray-500 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <rect x="4" y="8" width="16" height="12" rx="2" strokeWidth={2} />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                                  <line x1="4" y1="12" x2="20" y2="12" strokeWidth={1} />
                            <div className="flex xl:flex-row flex-col xl:items-center xl:space-x-4 space-y-1 xl:space-y-0 whitespace-nowrap">
                              <div className="font-medium text-gray-700 dark:text-gray-300 text-sm flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <rect
                                    x="4"
                                    y="8"
                                    width="16"
                                    height="12"
                                    rx="2"
                                    strokeWidth={2}
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
                                  />
                                  <line
                                    x1="4"
                                    y1="12"
                                    x2="20"
                                    y2="12"
                                    strokeWidth={1}
                                  />
                                </svg>
                                {Math.floor(
                                  record.timesheet!.totalMinutes / 60
                                )}
                                h {record.timesheet!.totalMinutes % 60}m
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
                              {record.breaks !== undefined &&
                                record.breaks > 0 && (
                                  <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 7h12v12H6z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18 11h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5v1M12 5v1M15 5v1"
                                      />
                                    </svg>
                                    {Math.floor(
                                      record.timesheet!.breakMinutes / 60
                                    )}
                                    h {record.timesheet!.breakMinutes % 60}m
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                              Limited access
                            </div>
                          )
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-500"></div>
                        )}
                      </div>

                      {/* Actions Column */}
                      <div className="flex flex-col justify-center items-end">
                        {record.timesheet && (canApprove || canRequestChanges || canDelete || canEdit) && (
                          <div className="flex items-center space-x-1 justify-end pointer-events-auto">
                            {canApprove && (
                              <ActionButton
                                onClick={(e) => handleApprove(record.timesheet!.id, e)}
                                className="text-white bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                title="Approve timesheet"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </ActionButton>
                            )}
                            {canRequestChanges && (
                              <ActionButton
                                onClick={(e) => handleRequestChanges(record.timesheet!.id, e)}
                                className="text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
                                title="Request changes"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </ActionButton>
                            )}
                            {canEdit && (
                              <ActionButton
                                onClick={(e) => handleEdit(record.timesheet!.id, e)}
                                className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                title="Edit timesheet"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </ActionButton>
                            )}
                            {canDelete && (
                              <ActionButton
                                onClick={(e) => handleDelete(record.timesheet!.id, e)}
                                className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                title="Delete timesheet"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </ActionButton>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                      {/* Action buttons with responsive sizing */}
                      <div className="flex justify-end items-center w-full sm:w-auto">
                        <TimesheetActionButtons
                          {...timesheetActionProps}
                          size="small"
                          className="sm:hidden"
                        />
                        <TimesheetActionButtons
                          {...timesheetActionProps}
                          size="normal"
                          className="hidden sm:flex"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls */}
            {shouldUsePagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                totalItems={attendanceRecords.length}
                pageSize={DEFAULT_ITEMS_PER_PAGE}
              />
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Timesheet"
        message="Are you sure you want to delete this timesheet? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={handleDeleteTimesheet}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
