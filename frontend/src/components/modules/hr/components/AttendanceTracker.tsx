"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/shared/contexts";
import { usePermissions } from "@/shared/hooks";
import {
  dummyTimesheets,
  dummyVacations,
  dummyLOAs,
  dummyPublicHolidays,
  dummyClosingDays,
  dummySchedules,
} from "@/data/dummy/hr";
import { approveTimesheet } from "@/shared/utils/timesheetActions";
import {
  getUserEmploymentStatusForDate,
  isDateInRange,
  normalizeDate,
} from "@/shared/utils/employmentUtils";
import { useTimesheetPermissions } from "@/shared/hooks/useTimesheetPermissions";
import { TimesheetActionButtons } from "@/components/shared/TimesheetActionButtons";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { TIMER_INTERVAL } from "@/shared/constants/attendance";
import type { UserStatus } from "@/shared/types";

interface AttendanceState {
  isClocked: boolean;
  clockInTime?: Date;
  onBreak: boolean;
  currentBreakStart?: Date;
  totalWorkedMinutes: number;
  totalBreakMinutes: number;
  breaks: Array<{
    id: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
  }>;
}

export function AttendanceTracker() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [attendanceState, setAttendanceState] = useState<AttendanceState>({
    isClocked: false,
    onBreak: false,
    totalWorkedMinutes: 0,
    totalBreakMinutes: 0,
    breaks: [],
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Early return if user doesn't have clock permission
  if (!hasPermission("hr-attendance-clock", "true")) {
    return null;
  }

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // Date and time calculations
  const today = new Date();
  const todayString = today.toDateString();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const todayDayOfWeek = today.getDay();

  // Get existing data for today
  const existingTimesheet = user
    ? dummyTimesheets.find(
        (timesheet) =>
          timesheet.userId === user.id &&
          new Date(timesheet.date).toDateString() === todayString
      )
    : null;

  const approvedVacation = user
    ? dummyVacations.find(
        (vacation) =>
          vacation.userId === user.id &&
          vacation.status === "approved" &&
          isDateInRange(today, vacation.startDate, vacation.endDate)
      )
    : null;

  const approvedLOA = user
    ? dummyLOAs.find(
        (loa) =>
          loa.userId === user.id &&
          loa.status === "approved" &&
          isDateInRange(today, loa.startDate, loa.endDate)
      )
    : null;

  const publicHoliday = dummyPublicHolidays.find(
    (holiday) => new Date(holiday.date).toDateString() === todayString
  );

  const closingDay = dummyClosingDays.find((closing) =>
    isDateInRange(today, closing.startDate, closing.endDate)
  );

  const userSchedule = user
    ? dummySchedules.find((schedule) => schedule.id === user.assignedScheduleId)
    : null;
  const isScheduledWorkDay =
    userSchedule?.weekSchedule.some(
      (scheduleDay) => scheduleDay.dayOfWeek === todayDayOfWeek
    ) || false;

  // Check employment status for today
  const employmentStatus = user
    ? getUserEmploymentStatusForDate(user, today)
    : null;
  const isUserEmployed =
    employmentStatus &&
    !["pending_start", "terminated", "suspended"].includes(employmentStatus);

  // Determine day type (priority order: Employment status > LOA > off schedule > holiday > closing > vacation)
  const dayType =
    !employmentStatus ||
    ["pending_start", "terminated"].includes(employmentStatus)
      ? "not_employed"
      : employmentStatus === "suspended"
        ? "suspended"
        : approvedLOA
          ? "loa"
          : !isScheduledWorkDay
            ? "off_schedule"
            : publicHoliday
              ? "holiday"
              : closingDay
                ? "closing"
                : approvedVacation
                  ? "vacation"
                  : "normal";

  // Determine if user can work today
  const canWork =
    employmentStatus &&
    !["pending_start", "terminated", "suspended"].includes(employmentStatus) &&
    !approvedLOA &&
    !closingDay &&
    !approvedVacation;

  // Determine if user was employed on the date of existing timesheet
  const wasEmployedForTimesheet =
    existingTimesheet && user
      ? (() => {
          const timesheetEmploymentStatus = getUserEmploymentStatusForDate(
            user,
            new Date(existingTimesheet.date)
          );
          return (
            timesheetEmploymentStatus &&
            !["pending_start", "terminated", "suspended"].includes(
              timesheetEmploymentStatus
            )
          );
        })()
      : false;

  // Only show UI if user can work today OR if they have a timesheet AND were employed when it was created
  const shouldShowUI =
    canWork || (!!existingTimesheet && wasEmployedForTimesheet);

  // Permission checks using the new hook
  const timesheetPermissions = useTimesheetPermissions(
    existingTimesheet || undefined,
    user,
    !!isUserEmployed
  );

  // Time calculation functions
  const calculateWorkedTime = () => {
    if (!attendanceState.clockInTime) return 0;

    const now = new Date();
    const totalMinutes = Math.floor(
      (now.getTime() - attendanceState.clockInTime.getTime()) / (1000 * 60)
    );

    let breakDeduction = attendanceState.totalBreakMinutes;
    if (attendanceState.onBreak && attendanceState.currentBreakStart) {
      breakDeduction += Math.floor(
        (now.getTime() - attendanceState.currentBreakStart.getTime()) /
          (1000 * 60)
      );
    }

    return Math.max(0, totalMinutes - breakDeduction);
  };

  const getCurrentBreakTime = () => {
    let totalBreakTime = attendanceState.totalBreakMinutes;

    if (attendanceState.onBreak && attendanceState.currentBreakStart) {
      const currentBreakDuration = Math.floor(
        (new Date().getTime() - attendanceState.currentBreakStart.getTime()) /
          (1000 * 60)
      );
      totalBreakTime += currentBreakDuration;
    }

    return totalBreakTime;
  };

  const currentWorkedTime = attendanceState.isClocked
    ? calculateWorkedTime()
    : attendanceState.totalWorkedMinutes;

  // Handle clock in
  const handleClockIn = () => {
    setAttendanceState((prev) => ({
      ...prev,
      isClocked: true,
      clockInTime: new Date(),
      totalWorkedMinutes: 0,
      totalBreakMinutes: 0,
      breaks: [],
    }));
  };

  // Handle clock out
  const handleClockOut = () => {
    // End any ongoing break
    if (attendanceState.onBreak) {
      handleEndBreak();
    }

    setAttendanceState({
      isClocked: false,
      onBreak: false,
      totalWorkedMinutes: calculateWorkedTime(),
      totalBreakMinutes: attendanceState.totalBreakMinutes,
      breaks: attendanceState.breaks,
    });
  };

  // Handle start break
  const handleStartBreak = () => {
    setAttendanceState((prev) => ({
      ...prev,
      onBreak: true,
      currentBreakStart: new Date(),
    }));
  };

  // Handle end break
  const handleEndBreak = () => {
    if (!attendanceState.currentBreakStart) return;

    const breakDuration = Math.floor(
      (new Date().getTime() - attendanceState.currentBreakStart.getTime()) /
        (1000 * 60)
    );
    const breakStartTime = attendanceState.currentBreakStart;

    setAttendanceState((prev) => {
      const { currentBreakStart: _, ...rest } = prev;
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
            duration: breakDuration,
          },
        ],
      };
    });
  };

  // Event handlers
  const handleDeleteTimesheet = useCallback(() => {
    if (existingTimesheet) {
      console.log("Delete timesheet:", existingTimesheet.id);
      setShowDeleteConfirm(false);
    }
  }, [existingTimesheet]);

  const handleApprove = useCallback(
    async (timesheetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) return;
      try {
        await approveTimesheet(timesheetId, user.id);
        // Force re-render by reloading (in real app, this would be handled by state management)
        window.location.reload();
      } catch (error) {
        console.error("Error approving timesheet:", error);
      }
    },
    [user]
  );

  const handleEdit = useCallback((timesheetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit timesheet:", timesheetId);
  }, []);

  const handleDelete = useCallback(
    (timesheetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteConfirm(true);
    },
    []
  );

  // Formatting functions
  const formatTime = (date: Date, includeSeconds: boolean = false) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      ...(includeSeconds && { second: "2-digit" }),
      hour12: false,
    });
  };

  const formatLiveTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Display info functions
  const getDayTypeInfo = () => {
    switch (dayType) {
      case "not_employed":
        return {
          label:
            employmentStatus === "pending_start"
              ? "Not Started Yet"
              : "Employment Terminated",
          color: "text-gray-500 dark:text-gray-500",
        };
      case "suspended":
        return {
          label: "Suspended",
          color: "text-orange-600 dark:text-orange-400",
        };
      case "loa":
        return {
          label: `${approvedLOA?.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Leave`,
          color: "text-purple-600 dark:text-purple-400",
        };
      case "closing":
        return {
          label: "Office Closed",
          color: "text-blue-600 dark:text-blue-400",
        };
      case "vacation":
        return {
          label: "Vacation",
          color: "text-blue-600 dark:text-blue-400",
        };
      case "holiday":
        return {
          label: publicHoliday?.name || "Public Holiday",
          color: "text-blue-600 dark:text-blue-400",
        };
      case "off_schedule":
        return {
          label: "Off Schedule",
          color: "text-gray-600 dark:text-gray-400",
        };
      default:
        return null;
    }
  };

  const getWorkingStatus = () => {
    if (existingTimesheet) {
      switch (existingTimesheet.status) {
        case "approved":
          return {
            text: "Approved",
            color: "text-green-600 dark:text-green-400",
          };
        case "pending":
          return {
            text: "Pending",
            color: "text-yellow-600 dark:text-yellow-400",
          };
        case "requires_modification":
          return {
            text: "Requires Modification",
            color: "text-red-600 dark:text-red-400",
          };
        default:
          return {
            text: existingTimesheet.status,
            color: "text-gray-600 dark:text-gray-400",
          };
      }
    }
    if (!attendanceState.isClocked)
      return {
        text: "Not clocked in",
        color: "text-gray-500 dark:text-gray-400",
      };
    if (attendanceState.onBreak)
      return {
        text: "On break",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    return { text: "Working", color: "text-green-600 dark:text-green-400" };
  };

  const getDateRange = () => {
    let startDate, endDate;

    switch (dayType) {
      case "loa":
        if (approvedLOA) {
          startDate = new Date(approvedLOA.startDate);
          endDate = approvedLOA.endDate ? new Date(approvedLOA.endDate) : null;
        }
        break;
      case "closing":
        if (closingDay) {
          startDate = new Date(closingDay.startDate);
          endDate = new Date(closingDay.endDate);
        }
        break;
      case "vacation":
        if (approvedVacation) {
          startDate = new Date(approvedVacation.startDate);
          endDate = new Date(approvedVacation.endDate);
        }
        break;
      default:
        return null;
    }

    if (!startDate) return null;

    if (!endDate) return `${startDate.toLocaleDateString()} - Ongoing`;
    if (startDate.toDateString() === endDate.toDateString()) return null;
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  // Computed values
  const dayTypeInfo = getDayTypeInfo();
  const workingStatus = getWorkingStatus();
  const dateRange = getDateRange();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[auto_auto_auto] xl:space-y-0 items-start">
        <div className="flex justify-between items-start mb-6 xl:mb-0">
          {/* Left Side - Date, Time, Day Type, Status */}
          <div className="flex flex-col space-y-2">
            {/* Current Date */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
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

          {/* > sm, < xl, visible - Right Side - Action Buttons - show edit/delete/approve for any timesheet, clock buttons only for workable days */}
          {shouldShowUI && (
            <div className="hidden sm:flex xl:hidden space-x-2 justify-end">
              {/* Timesheet Action Buttons */}
              <TimesheetActionButtons
                timesheet={existingTimesheet || undefined}
                canApprove={timesheetPermissions.canApprove}
                canRequestChanges={timesheetPermissions.canRequestChanges}
                canEdit={timesheetPermissions.canEdit}
                canDelete={timesheetPermissions.canDelete}
                onApprove={handleApprove}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Clock In Button */}
              {canWork && !attendanceState.isClocked && !existingTimesheet && (
                <button
                  onClick={handleClockIn}
                  className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="hidden md:inline">Clock In</span>
                </button>
              )}

              {/* Break and Clock Out Buttons */}
              {canWork && attendanceState.isClocked && !existingTimesheet && (
                <>
                  {!attendanceState.onBreak ? (
                    <button
                      onClick={handleStartBreak}
                      className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      <span className="hidden md:inline">Start Break</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleEndBreak}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6V4zM14 4l8 8-8 8V4z" />
                      </svg>
                      <span className="hidden md:inline">End Break</span>
                    </button>
                  )}

                  {/* Clock Out button - disabled when on break */}
                  <button
                    onClick={
                      attendanceState.onBreak ? undefined : handleClockOut
                    }
                    disabled={attendanceState.onBreak}
                    className={`px-4 py-3 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 ${
                      attendanceState.onBreak
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    }`}
                    title={
                      attendanceState.onBreak
                        ? "End your break before clocking out"
                        : "Clock Out"
                    }
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 6h12v12H6z" />
                    </svg>
                    <span className="hidden md:inline">Clock Out</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Center - Time Stats with Status Below */}
        {shouldShowUI && (
          <div className="flex flex-col items-stretch space-y-3 mb-6 sm:mb-0">
            {existingTimesheet && !timesheetPermissions.canRead ? (
              /* Limited view for users without read permission */
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Timesheet for Today
                </div>
                <div className={`text-sm font-medium ${workingStatus.color}`}>
                  {workingStatus.text}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Limited view - contact administrator for details
                </div>
              </div>
            ) : (
              <>
                {/* Full Time Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Clock In Time */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Clock In
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {existingTimesheet && existingTimesheet.startTime
                        ? formatTime(existingTimesheet.startTime)
                        : attendanceState.clockInTime
                          ? formatTime(attendanceState.clockInTime)
                          : "--:--"}
                    </div>
                  </div>

                  {/* Clock Out Time */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Clock Out
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {existingTimesheet && existingTimesheet.endTime
                        ? formatTime(existingTimesheet.endTime)
                        : attendanceState.isClocked
                          ? "In Progress"
                          : "--:--"}
                    </div>
                  </div>

                  {/* Worked Time */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Worked Time
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {existingTimesheet
                        ? formatDuration(existingTimesheet.totalMinutes)
                        : formatDuration(currentWorkedTime)}
                    </div>
                  </div>

                  {/* Break Time */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Break Time
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {existingTimesheet && existingTimesheet.breakMinutes
                        ? formatDuration(existingTimesheet.breakMinutes)
                        : formatDuration(getCurrentBreakTime())}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Breaks - part of the timesheet data group - only show if user can read timesheet details */}
            {timesheetPermissions.canRead &&
              ((attendanceState.isClocked &&
                attendanceState.breaks.length > 0) ||
                (existingTimesheet &&
                  existingTimesheet.breaks &&
                  existingTimesheet.breaks.length > 0)) && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {/* Show existing timesheet breaks or current session breaks */}
                    {existingTimesheet &&
                    existingTimesheet.breaks &&
                    existingTimesheet.breaks.length > 0
                      ? existingTimesheet.breaks.map((breakItem) => (
                          <div
                            key={breakItem.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded pr-3 pl-1 py-1 text-sm flex items-center"
                          >
                            <svg
                              className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-500"
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
                            <span className="text-gray-900 dark:text-white font-medium">
                              {formatTime(breakItem.startTime)} -{" "}
                              {formatTime(breakItem.endTime)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              ({formatDuration(breakItem.totalMinutes)})
                            </span>
                          </div>
                        ))
                      : attendanceState.breaks.map((breakItem) => (
                          <div
                            key={breakItem.id}
                            className="bg-gray-50 dark:bg-gray-700 rounded pr-3 pl-1 py-1 text-sm flex items-center"
                          >
                            <svg
                              className="w-6 h-6 mr-2 text-gray-500 dark:text-gray-500"
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
                            <span className="text-gray-900 dark:text-white font-medium">
                              {formatTime(breakItem.startTime)} -{" "}
                              {breakItem.endTime
                                ? formatTime(breakItem.endTime)
                                : "Ongoing"}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              ({formatDuration(breakItem.duration)})
                            </span>
                          </div>
                        ))}
                  </div>
                </div>
              )}

            {/* Working/Timesheet Status - final summary below all timesheet data - only show if can read or actively working */}
            {(timesheetPermissions.canRead || !existingTimesheet) && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p
                  className={`text-sm font-medium ${workingStatus.color} text-center`}
                >
                  {workingStatus.text}
                </p>
              </div>
            )}
          </div>
        )}

        {/* < sm, > xl, visible - Right Side - Action Buttons - show edit/delete/approve for any timesheet, clock buttons only for workable days */}
        {shouldShowUI && (
          <div className="flex sm:hidden xl:flex space-x-2 justify-end">
            {/* Timesheet Action Buttons */}
            <TimesheetActionButtons
              timesheet={existingTimesheet || undefined}
              canApprove={timesheetPermissions.canApprove}
              canRequestChanges={timesheetPermissions.canRequestChanges}
              canEdit={timesheetPermissions.canEdit}
              canDelete={timesheetPermissions.canDelete}
              onApprove={handleApprove}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Clock In Button */}
            {canWork && !attendanceState.isClocked && !existingTimesheet && (
              <button
                onClick={handleClockIn}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="hidden md:inline">Clock In</span>
              </button>
            )}

            {/* Break and Clock Out Buttons */}
            {canWork && attendanceState.isClocked && !existingTimesheet && (
              <>
                {!attendanceState.onBreak ? (
                  <button
                    onClick={handleStartBreak}
                    className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    <span className="hidden md:inline">Start Break</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEndBreak}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zM14 4l8 8-8 8V4z" />
                    </svg>
                    <span className="hidden md:inline">End Break</span>
                  </button>
                )}

                {/* Clock Out button - disabled when on break */}
                <button
                  onClick={attendanceState.onBreak ? undefined : handleClockOut}
                  disabled={attendanceState.onBreak}
                  className={`px-4 py-3 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center md:space-x-2 ${
                    attendanceState.onBreak
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  }`}
                  title={
                    attendanceState.onBreak
                      ? "End your break before clocking out"
                      : "Clock Out"
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h12v12H6z" />
                  </svg>
                  <span className="hidden md:inline">Clock Out</span>
                </button>
              </>
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
        cancelText="Cancel"
        onConfirm={handleDeleteTimesheet}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
