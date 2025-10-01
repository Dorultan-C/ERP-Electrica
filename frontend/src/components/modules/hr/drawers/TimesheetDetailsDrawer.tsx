"use client";

import React, { useState, useEffect, useRef } from "react";
import { RightDrawer } from "@/components/ui/RightDrawer";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDrawer } from "@/shared/contexts/DrawerContext";
import { useAuth } from "@/shared/contexts";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useTimesheetPermissions } from "@/shared/hooks/useTimesheetPermissions";
import { TimesheetActionButtons } from "@/components/shared/TimesheetActionButtons";
import {
  getTimesheetsWithEmployeeNames,
  dummySchedules,
} from "@/data/dummy/hr";
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
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Find the selected timesheet with employee name populated
  const timesheetsWithNames = getTimesheetsWithEmployeeNames();
  const selectedTimesheet = selectedId
    ? timesheetsWithNames.find((timesheet) => timesheet.id === selectedId)
    : null;

  // Find the user associated with this timesheet
  const selectedUser = selectedTimesheet
    ? dummyUsers.find((user) => user.id === selectedTimesheet.userId)
    : null;

  // Check if user was employed on this date
  const isUserEmployed =
    selectedUser && selectedTimesheet
      ? isUserEmployedOnDate(selectedUser, new Date(selectedTimesheet.date))
      : false;

  // Get timesheet permissions
  const timesheetPermissions = useTimesheetPermissions(
    selectedTimesheet || undefined,
    currentUser,
    isUserEmployed
  );

  // Permission checks
  const canReadOthers = hasPermission("hr-attendance-manage-others", "read");
  const shouldShowEmployeeInfo = canReadOthers;

  // Message permissions logic
  const isOwnTimesheet = selectedTimesheet?.userId === currentUser?.id;
  const currentUserPermissionType = isOwnTimesheet
    ? "hr-attendance-manage-owns"
    : "hr-attendance-manage-others";
  const currentUserCanMessage = hasPermission(
    currentUserPermissionType,
    "message"
  );

  // For viewing others' messages, check if the timesheet owner also has message permissions
  const timesheetOwner = selectedUser;
  const timesheetOwnerCanMessage = timesheetOwner
    ? timesheetOwner.permissions?.some(
        (p) =>
          p.permissionId === "hr-attendance-manage-owns" &&
          p.actions.includes("message")
      ) || false
    : false;

  // Messages are visible if:
  // 1. Current user has message permission for this timesheet type
  // 2. If viewing others' timesheet, both users must have message permission
  const canViewMessages =
    currentUserCanMessage && (isOwnTimesheet || timesheetOwnerCanMessage);
  const canSendMessage = canViewMessages;

  // Scroll to bottom of messages when messages change or drawer opens
  useEffect(() => {
    if (messagesContainerRef.current && canViewMessages) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [selectedTimesheet?.messages, canViewMessages, isOpen]);

  // Only show this drawer for timesheet-type selections
  if (selectedType !== "timesheets") {
    return null;
  }

  if (!selectedTimesheet) {
    return null;
  }

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedTimesheet) return;

    try {
      // TODO: Implement actual message sending (Phase 9+)
      console.log("Sending message:", {
        timesheetId: selectedTimesheet.id,
        userId: currentUser.id,
        text: newMessage.trim(),
      });

      // Clear the input
      setNewMessage("");

      // Force re-render by reloading (in real app, this would be handled by state management)
      window.location.reload();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
    const isNegative = minutes < 0;
    const absMinutes = Math.abs(minutes);
    const hours = Math.floor(absMinutes / 60);
    const mins = absMinutes % 60;

    // Handle zero case
    if (absMinutes === 0) {
      return "0m";
    }

    if (hours > 0) {
      if (mins > 0) {
        return `${isNegative ? "-" : ""}${hours}h ${mins}m`;
      } else {
        return `${isNegative ? "-" : ""}${hours}h`;
      }
    } else {
      return `${isNegative ? "-" : ""}${mins}m`;
    }
  };

  // Get user's schedule information
  const userSchedule = selectedUser?.assignedScheduleId
    ? dummySchedules.find(
        (schedule) => schedule.id === selectedUser.assignedScheduleId
      )
    : null;
  const scheduleName = userSchedule?.name || null;

  // Calculate scheduled hours from user's schedule for the timesheet date
  const timesheetDate = selectedTimesheet
    ? new Date(selectedTimesheet.date)
    : null;
  const dayOfWeek = timesheetDate?.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const scheduledDayInfo = userSchedule?.weekSchedule?.find(
    (day) => day.dayOfWeek === dayOfWeek
  );

  const scheduledWorkMinutes = scheduledDayInfo?.labouringMinutes ?? null;
  const scheduledBreakMinutes = scheduledDayInfo?.allowedBrakeMinutes ?? null;
  const workedHours = selectedTimesheet.totalMinutes / 60;

  // Helper function to get color based on time difference with gradient
  // Range: red(-maxDiff) -> orange -> yellow -> green(0) -> yellow -> orange -> red(+maxDiff)
  const getTimeDifferenceColor = (
    actualMinutes: number,
    scheduledMinutes: number,
    maxDiff: number
  ) => {
    const diff = actualMinutes - scheduledMinutes;
    const ratio = Math.max(-1, Math.min(1, diff / maxDiff)); // Clamp between -1 and 1

    // Convert ratio to 0-1 scale where 0 = -maxDiff, 0.5 = 0, 1 = +maxDiff
    const normalizedRatio = (ratio + 1) / 2;

    let red,
      green,
      blue = 0;

    if (normalizedRatio <= 0.5) {
      // From red (0) to green (0.5): red -> orange -> yellow -> green
      const phase1Ratio = normalizedRatio * 2; // 0 to 1

      if (phase1Ratio <= 0.5) {
        // Red to Orange: keep red at 255, increase green
        red = 255;
        green = Math.round(165 * (phase1Ratio * 2)); // Orange has ~165 green
      } else {
        // Orange to Yellow to Green: keep components high, shift towards green
        const subPhase = (phase1Ratio - 0.5) * 2; // 0 to 1
        red = Math.round(255 * (1 - subPhase * 0.8)); // Reduce red more gradually
        green = Math.round(165 + 90 * subPhase); // 165 (orange) to 255 (green)
      }
    } else {
      // From green (0.5) to red (1): green -> yellow -> orange -> red
      const phase2Ratio = (normalizedRatio - 0.5) * 2; // 0 to 1

      if (phase2Ratio <= 0.5) {
        // Green to Yellow: keep green at 255, increase red
        green = 255;
        red = Math.round(255 * (phase2Ratio * 2));
      } else {
        // Yellow to Orange to Red: reduce green, keep red high
        const subPhase = (phase2Ratio - 0.5) * 2; // 0 to 1
        red = 255;
        green = Math.round(255 * (1 - subPhase * 0.65)); // Reduce to ~165 (orange) then to 0
      }
    }

    return `rgb(${red}, ${green}, ${blue})`;
  };

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
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Breaks
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {selectedTimesheet.breaks.map((breakItem) => (
                        <div
                          key={breakItem.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-md text-gray-900 dark:text-white">
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
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
              Time Summary
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(selectedTimesheet.regularMinutes)}
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
                  {formatDuration(selectedTimesheet.overtimeMinutes)}
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

            {/* Schedule Comparison - show if user has permission and schedule exists */}
            {hasPermission("hr-schedules-manage", "read") && scheduleName && (
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Schedule:{" "}
                  <a
                    href="/hr/schedules"
                    className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    {scheduleName}
                  </a>
                </div>

                {scheduledWorkMinutes !== null &&
                scheduledBreakMinutes !== null ? (
                  <div className="flex flex-wrap justify-around gap-4">
                    {/* Scheduled Work Time */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-0.5">
                        <span className="text-md font-medium text-gray-900 dark:text-white">
                          {formatDuration(scheduledWorkMinutes)}
                        </span>
                        <span
                          className="text-sm font-base"
                          style={{
                            color: getTimeDifferenceColor(
                              selectedTimesheet.regularMinutes,
                              scheduledWorkMinutes,
                              30
                            ),
                          }}
                        >
                          (
                          {selectedTimesheet.regularMinutes >=
                          scheduledWorkMinutes
                            ? "+"
                            : ""}
                          {formatDuration(
                            selectedTimesheet.regularMinutes -
                              scheduledWorkMinutes
                          )}
                          )
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Scheduled Work
                      </div>
                    </div>

                    {/* Scheduled Break Time */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-0.5">
                        <span className="text-md font-medium text-gray-900 dark:text-white">
                          {formatDuration(scheduledBreakMinutes)}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: getTimeDifferenceColor(
                              selectedTimesheet.breakMinutes,
                              scheduledBreakMinutes,
                              20
                            ),
                          }}
                        >
                          (
                          {selectedTimesheet.breakMinutes >=
                          scheduledBreakMinutes
                            ? "+"
                            : ""}
                          {formatDuration(
                            selectedTimesheet.breakMinutes -
                              scheduledBreakMinutes
                          )}
                          )
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Scheduled Breaks
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    No schedule defined for this day
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Messages Section */}
          {canViewMessages && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide mb-4">
                Messages
              </h4>

              {/* Messages List */}
              {selectedTimesheet?.messages &&
                selectedTimesheet.messages.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 mb-4">
                    <div
                      ref={messagesContainerRef}
                      className="space-y-3 max-h-100 sm:max-h-70 overflow-y-auto pt-3 px-3 pb-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-transparent dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"
                    >
                      {selectedTimesheet.messages
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .map((message) => {
                          // Look up message author
                          const messageUser = dummyUsers.find(
                            (user) => user.id === message.userId
                          );
                          const authorName = messageUser
                            ? `${messageUser.firstName} ${messageUser.lastName}`
                            : message.userId;
                          const isCurrentUser =
                            message.userId === currentUser?.id;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                  isCurrentUser
                                    ? "bg-blue-600 text-white rounded-br-none ml-8"
                                    : "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-bl-none mr-8"
                                }`}
                              >
                                <div className="text-sm">{message.text}</div>
                                <div
                                  className={`text-xs mt-1 ${
                                    isCurrentUser
                                      ? "text-blue-100"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {!isCurrentUser && (
                                    <span className="font-medium">
                                      {authorName} •{" "}
                                    </span>
                                  )}
                                  {new Date(message.date).toLocaleString(
                                    "en-GB",
                                    {
                                      year: "2-digit",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                )}

              {/* Message Input */}
              {canSendMessage && (
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Send message"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              )}

              {/* No messages state */}
              {(!selectedTimesheet?.messages ||
                selectedTimesheet.messages.length === 0) && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  No messages yet
                </div>
              )}
            </div>
          )}

          {/* Review Information */}
          {selectedTimesheet.reviewedBy &&
            selectedTimesheet.reviewedAt &&
            (() => {
              // Look up reviewer user by ID
              const reviewerUser = dummyUsers.find(
                (user) => user.id === selectedTimesheet.reviewedBy
              );
              const reviewerName = reviewerUser
                ? `${reviewerUser.firstName} ${reviewerUser.lastName}`
                : selectedTimesheet.reviewedBy;

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
