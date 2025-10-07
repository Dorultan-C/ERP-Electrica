"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import AccessDenied from "@/components/ui/AccessDenied";
import { useDrawer } from "@/shared/contexts/DrawerContext";
import { useAuth } from "@/shared/contexts";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useTimesheetPermissions } from "@/shared/hooks/useTimesheetPermissions";
import { TimesheetActionButtons } from "@/components/shared/TimesheetActionButtons";
import { DrawerContentProps } from "@/shared/drawer/drawerRegistry";
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

interface TimesheetDetailsDrawerProps extends DrawerContentProps {
  onEdit?: (timesheet: Timesheet) => void;
}

export function TimesheetDetailsDrawer({
  id,
  onEdit,
}: TimesheetDetailsDrawerProps) {
  const { navigateTo } = useDrawer();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const { hasPermission } = usePermissions();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Find the selected timesheet with employee name populated
  const timesheetsWithNames = getTimesheetsWithEmployeeNames();
  const selectedTimesheet = timesheetsWithNames.find(
    (timesheet) => timesheet.id === id
  );

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
  const isOwnTimesheet = selectedTimesheet?.userId === currentUser?.id;
  const canReadOwn = hasPermission("hr-attendance-manage-owns", "read");
  const canReadOthers = hasPermission("hr-attendance-manage-others", "read");
  const shouldShowEmployeeInfo = canReadOthers;

  // Check if user has permission to view this specific timesheet
  const hasReadPermission = isOwnTimesheet ? canReadOwn : canReadOthers;

  // Message permissions logic
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
    currentUserCanMessage &&
    (isOwnTimesheet || timesheetOwnerCanMessage) &&
    !(
      selectedTimesheet?.status === "approved" &&
      (selectedTimesheet?.messages === undefined ||
        selectedTimesheet?.messages?.length <= 0)
    );
  const canSendMessage =
    canViewMessages && selectedTimesheet?.status !== "approved";

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesContainerRef.current && canViewMessages) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [selectedTimesheet?.messages, canViewMessages]);

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

      setNewMessage("");
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
  const dayOfWeek = timesheetDate?.getDay();

  const scheduledDayInfo = userSchedule?.weekSchedule?.find(
    (day) => day.dayOfWeek === dayOfWeek
  );

  const scheduledWorkMinutes = scheduledDayInfo?.labouringMinutes ?? null;
  const scheduledBreakMinutes = scheduledDayInfo?.allowedBrakeMinutes ?? null;

  // Helper function to get color based on time difference with gradient
  const getTimeDifferenceColor = (
    actualMinutes: number,
    scheduledMinutes: number,
    maxDiff: number
  ) => {
    const diff = actualMinutes - scheduledMinutes;
    const ratio = Math.max(-1, Math.min(1, diff / maxDiff));
    const normalized = (ratio + 1) / 2; // 0..1

    // red and green based on triangle wave
    let red: number, green: number;
    if (normalized <= 0.5) {
      // left half: red->orange->green
      red = 255;
      green = Math.round(510 * normalized); // 0->255
    } else {
      // right half: green->orange->red
      red = 255;
      green = Math.round(255 * (2 - 2 * normalized)); // 255->0
    }

    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <>
      {authLoading ? (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : !hasReadPermission ? (
        <AccessDenied
          message="You do not have permission to view this timesheet."
          showGoBack={false}
          showGoHome={false}
        />
      ) : (
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
            <div className="flex flex-col sm:items-start gap-1.5">
              <div className="flex-1">
                <h2 className="mb-0 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {new Date(selectedTimesheet.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </h2>
              </div>

              <div>
                <StatusBadge
                  status={selectedTimesheet.status}
                  type="timesheet"
                />
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

              {/* Schedule Comparison */}
              {hasPermission("hr-schedules-manage", "read") &&
                scheduleName &&
                selectedUser?.assignedScheduleId && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Schedule:{" "}
                      <button
                        onClick={() =>
                          navigateTo(
                            selectedUser.assignedScheduleId!,
                            "schedules"
                          )
                        }
                        className="btn-small text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer bg-transparent border-none p-0"
                      >
                        {scheduleName}
                      </button>
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900">
                  <div
                    ref={messagesContainerRef}
                    className="space-y-3 max-h-100 sm:max-h-70 overflow-y-auto pt-3 px-3 pb-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-transparent dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"
                  >
                    {selectedTimesheet?.messages !== undefined &&
                    selectedTimesheet?.messages?.length > 0 ? (
                      selectedTimesheet.messages
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .map((message) => {
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
                        })
                    ) : (
                      <div className="p-3 min-h-40 flex flex-col gap-3 items-center text-gray-400">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2 10l10-7 10 7v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10z" />
                          <path d="M22 10l-10 7L2 10" />
                        </svg>
                        <span className="text-xs text-gray-400">
                          No messages yet
                        </span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                {canSendMessage && (
                  <form
                    onSubmit={handleSendMessage}
                    className="flex space-x-2 mt-4"
                  >
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
              </div>
            )}

            {/* Review Information */}
            {selectedTimesheet.reviewedBy &&
              selectedTimesheet.reviewedAt &&
              (() => {
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
                        <button
                          onClick={() =>
                            navigateTo(selectedTimesheet.reviewedBy!, "users")
                          }
                          className="btn-small text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer bg-transparent border-none p-0"
                        >
                          {reviewerName}
                        </button>
                      ) : (
                        <span className="text-gray-900 dark:text-white font-medium">
                          {reviewerName}
                        </span>
                      )}{" "}
                      on{" "}
                      {new Date(selectedTimesheet.reviewedAt).toLocaleString()}
                    </div>
                  </div>
                );
              })()}
          </div>
        </div>
      )}
    </>
  );
}
