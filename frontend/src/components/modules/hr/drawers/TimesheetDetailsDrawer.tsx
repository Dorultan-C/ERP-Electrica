"use client";

import React from "react";
import { RightDrawer } from "@/components/ui/RightDrawer";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDrawer } from "@/shared/contexts/DrawerContext";
import { useAuth } from "@/shared/contexts";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useTimesheetPermissions } from "@/shared/hooks/useTimesheetPermissions";
import { TimesheetActionButtons } from "@/components/shared/TimesheetActionButtons";
import { getTimesheetsWithEmployeeNames } from "@/data/dummy/hr";
import { dummyUsers } from "@/data/dummy/users";
import {
  approveTimesheet,
  requestTimesheetChanges,
} from "@/shared/utils/timesheetActions";
import { isUserEmployedOnDate } from "@/shared/utils/employmentUtils";
import type { Timesheet } from "@/shared/types/hr";

interface TimesheetDetailsDrawerProps {
  onEdit?: (timesheet: Timesheet) => void;
}

export function TimesheetDetailsDrawer({
  onEdit,
}: TimesheetDetailsDrawerProps) {
  const {
    isOpen,
    isClosing,
    isExpanded,
    selectedId,
    selectedType,
    closeDrawer,
    toggleExpand,
  } = useDrawer();
  const { user: currentUser } = useAuth();
  const { hasPermission } = usePermissions();

  // Only show this drawer for timesheet-type selections
  if (selectedType !== "timesheets") {
    return null;
  }

  // Find the selected timesheet with employee name populated
  const timesheetsWithNames = getTimesheetsWithEmployeeNames();
  const selectedTimesheet = selectedId
    ? timesheetsWithNames.find((timesheet) => timesheet.id === selectedId)
    : null;

  // Find the user associated with this timesheet
  const selectedUser = selectedTimesheet
    ? dummyUsers.find((user) => user.id === selectedTimesheet.userId)
    : null;

  // Permission checks
  const canReadOthers = hasPermission("hr-attendance-manage-others", "read");
  const shouldShowEmployeeInfo = canReadOthers;

  // Action handlers
  const handleEdit = () => {
    if (selectedTimesheet && onEdit) {
      onEdit(selectedTimesheet);
    }
  };

  const handleApprove = async (timesheetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      await approveTimesheet(timesheetId, currentUser.id);
      // Force re-render by reloading (in real app, this would be handled by state management)
      window.location.reload();
    } catch (error) {
      console.error("Error approving timesheet:", error);
    }
  };

  const handleRequestChanges = async (
    timesheetId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      await requestTimesheetChanges(
        timesheetId,
        currentUser.id,
        "Please review and make necessary changes"
      );
      // Force re-render by reloading (in real app, this would be handled by state management)
      window.location.reload();
    } catch (error) {
      console.error("Error requesting timesheet changes:", error);
    }
  };

  const handleDelete = (timesheetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete timesheet:", timesheetId);
    // TODO: Implement delete functionality (Phase 9+)
  };

  if (!selectedTimesheet) {
    return null;
  }

  // Check if user was employed on this date
  const isUserEmployed = selectedUser
    ? isUserEmployedOnDate(selectedUser, new Date(selectedTimesheet.date))
    : false;

  // Get timesheet permissions
  const timesheetPermissions = useTimesheetPermissions(
    selectedTimesheet,
    currentUser,
    isUserEmployed
  );

  // Format time for display
  const formatTime = (date?: Date) => {
    if (!date) return "Not set";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Format duration in minutes to hours:minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate worked hours vs scheduled hours
  const scheduledHours = 8; // Default 8 hours, could be from user's schedule
  const workedHours = selectedTimesheet.totalMinutes / 60;
  const overtime = Math.max(0, workedHours - scheduledHours);

  return (
    <RightDrawer
      isOpen={isOpen}
      isClosing={isClosing}
      onClose={closeDrawer}
      title={
        shouldShowEmployeeInfo
          ? `${(selectedTimesheet as any).employeeName} - ${new Date(selectedTimesheet.date).toLocaleDateString()}`
          : `Timesheet - ${new Date(selectedTimesheet.date).toLocaleDateString()}`
      }
      isExpanded={isExpanded}
      onToggleExpand={toggleExpand}
      {...(onEdit && { onEdit: handleEdit })}
      editLabel="Edit Timesheet"
    >
      {/* Drawer content - Seconday Header - Main Header - Content Body */}
      <div>
        {/* Secondary Header - Employee Info (when viewing others) */}
        {shouldShowEmployeeInfo && selectedUser && (
          <div className="flex items-center space-x-3 py-2 px-4 bg-blue-400/50 dark:bg-blue-800/50">
            <Avatar
              src={selectedUser.profileImage}
              name={(selectedTimesheet as any).employeeName}
              size="small"
              className="flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Timesheet for:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(selectedTimesheet as any).employeeName}
              </span>
            </div>
          </div>
        )}

        {/* Main Header - Date, Status, and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start space-y-4 sm:space-y-0 p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          {/* Main Header Row - Date and Actions */}
          <div className="flex flex-col sm:items-start gap-1.5">
            <div className="flex-1">
              {/* Primary Date Display */}
              <h2 className="mb-0 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {new Date(selectedTimesheet.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>

            {/* Status Badge */}
            <div>
              <StatusBadge status={selectedTimesheet.status} type="timesheet" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <TimesheetActionButtons
              timesheet={selectedTimesheet}
              canApprove={timesheetPermissions.canApprove}
              canRequestChanges={timesheetPermissions.canRequestChanges}
              canEdit={timesheetPermissions.canEdit}
              canDelete={timesheetPermissions.canDelete}
              onApprove={handleApprove}
              onRequestChanges={handleRequestChanges}
              onEdit={handleEdit}
              onDelete={handleDelete}
              size="normal"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Clock In/Out Times and Breaks Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
              Work Times
            </h4>

            {/* Clock In/Out Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatTime(selectedTimesheet.startTime)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Clock In
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatTime(selectedTimesheet.endTime)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Clock Out
                </div>
              </div>
            </div>

            {/* Breaks */}
            {selectedTimesheet?.breaks &&
              selectedTimesheet.breaks.length > 0 && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Breaks
                    </div>
                    <div className="space-y-2">
                      {selectedTimesheet.breaks.map((breakItem) => (
                        <div
                          key={breakItem.id}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(breakItem.startTime)} -{" "}
                            {formatTime(breakItem.endTime)}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDuration(breakItem.totalMinutes)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </div>

          {/* Time Summary with Schedule Comparison */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                Time Summary
              </h4>
              {/* Schedule Info with Link */}
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule:{" "}
                  {hasPermission("hr-schedules-manage", "read") ? (
                    <a
                      href="/hr/schedules"
                      className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                      Default Schedule
                    </a>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      Default Schedule
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {scheduledHours}h scheduled
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(
                    selectedTimesheet.totalMinutes -
                      selectedTimesheet.breakMinutes
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Worked Time
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(selectedTimesheet.breakMinutes)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Break Time
                </div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {overtime > 0 ? formatDuration(overtime * 60) : "0h 0m"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Overtime
                </div>
              </div>

              <div className="text-center border-l border-gray-300 dark:border-gray-600">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatDuration(selectedTimesheet.totalMinutes)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Time
                </div>
              </div>
            </div>

            {/* Schedule Comparison */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  vs. Scheduled ({scheduledHours}h)
                </span>
                <span
                  className={`font-medium ${
                    workedHours >= scheduledHours
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {workedHours >= scheduledHours ? "+" : ""}
                  {formatDuration((workedHours - scheduledHours) * 60)}
                </span>
              </div>
            </div>
          </div>

          {/* Review Information */}
          {selectedTimesheet.reviewedBy && selectedTimesheet.reviewedAt && (() => {
            // Look up reviewer user by ID
            const reviewerUser = dummyUsers.find(user => user.id === selectedTimesheet.reviewedBy);
            const reviewerName = reviewerUser ? `${reviewerUser.firstName} ${reviewerUser.lastName}` : selectedTimesheet.reviewedBy;

            return (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide mb-3">
                  Review Information
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Reviewed by{" "}
                  {hasPermission("hr-users-manage", "read") ? (
                    <a
                      href="/hr/users"
                      className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    >
                      {reviewerName}
                    </a>
                  ) : (
                    <span className="text-gray-900 dark:text-white font-medium">
                      {reviewerName}
                    </span>
                  )}{" "}
                  on {new Date(selectedTimesheet.reviewedAt).toLocaleString()}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </RightDrawer>
  );
}
