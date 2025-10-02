"use client";

import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import AccessDenied from "@/components/ui/AccessDenied";
import { useDrawer } from "@/shared/contexts/DrawerContext";
import { useAuth } from "@/shared/contexts";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { DrawerContentProps } from "@/shared/drawer/drawerRegistry";
import { dummyUsers } from "@/data/dummy/users";
import { dummySchedules } from "@/data/dummy/hr";
import { dummyRoles } from "@/data/dummy/roles";
import { permissions } from "@/data/permissions";
import type { User } from "@/shared/types";

interface UserDetailsDrawerProps extends DrawerContentProps {
  onEdit?: (user: User) => void;
}

export function UserDetailsDrawer({ id, onEdit }: UserDetailsDrawerProps) {
  const { navigateTo } = useDrawer();
  const { isLoading: authLoading } = useAuth();
  const { hasPermission } = usePermissions();

  // Find the selected user
  const selectedUser = dummyUsers.find((user) => user.id === id);

  if (!selectedUser) {
    return null;
  }

  // Permission checks
  const canReadUsers = hasPermission("hr-users-manage", "read");

  const displayName = `${selectedUser.firstName} ${selectedUser.lastName}`;

  // Get user's schedule information
  const userSchedule = selectedUser.assignedScheduleId
    ? dummySchedules.find(
        (schedule) => schedule.id === selectedUser.assignedScheduleId
      )
    : null;

  // Sort employment history by date (most recent first)
  const sortedEmploymentHistory = [...selectedUser.employmentHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get most recent employment event
  const currentEmploymentStatus = sortedEmploymentHistory[0];

  return (
    <>
      {authLoading ? (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : !canReadUsers ? (
        <AccessDenied
          message="You do not have permission to view user details."
          showGoBack={false}
          showGoHome={false}
        />
      ) : (
        <div>
          {/* Main Header - User Info and Status */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start space-y-4 sm:space-y-0 p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Avatar
                src={selectedUser.profileImage}
                name={displayName}
                size="large"
                className="flex-shrink-0"
              />
              <div className="flex flex-col">
                <h2 className="mb-0 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {displayName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  @{selectedUser.username}
                </p>
                <div>
                  <StatusBadge status={selectedUser.status} type="user" />
                </div>
              </div>
            </div>

            {/* Action Buttons Placeholder */}
            <div className="flex justify-end">
              {/* TODO: Add user action buttons when needed */}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Work Email
                  </div>
                  <div className="text-sm font-medium">
                    {selectedUser.workEmail ? (
                      <a
                        href={`mailto:${selectedUser.workEmail}`}
                        className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{selectedUser.workEmail}</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Personal Email
                  </div>
                  <div className="text-sm font-medium">
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{selectedUser.email}</span>
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Work Phone
                  </div>
                  <div className="text-sm font-medium">
                    {selectedUser.workPhoneNumber ? (
                      <a
                        href={`tel:${selectedUser.workPhoneNumber}`}
                        className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{selectedUser.workPhoneNumber}</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Personal Phone
                  </div>
                  <div className="text-sm font-medium">
                    <a
                      href={`tel:${selectedUser.phoneNumber}`}
                      className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{selectedUser.phoneNumber}</span>
                    </a>
                  </div>
                </div>
              </div>

              {selectedUser.address && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Address
                  </div>
                  <div className="text-sm font-medium">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUser.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{selectedUser.address}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Birth Date
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedUser.birthDate ? (
                      new Date(selectedUser.birthDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    National ID
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedUser.nationalID}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Insurance Number
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedUser.insuranceNumber}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedUser.emergencyContact && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Emergency Contact
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedUser.emergencyContact.firstName}{" "}
                        {selectedUser.emergencyContact.lastName}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {selectedUser.emergencyContact.phoneNumber && (
                        <div>
                          <a
                            href={`tel:${selectedUser.emergencyContact.phoneNumber}`}
                            className="flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            <span>
                              {selectedUser.emergencyContact.phoneNumber}
                            </span>
                          </a>
                        </div>
                      )}
                      {selectedUser.emergencyContact.email && (
                        <div>
                          <a
                            href={`mailto:${selectedUser.emergencyContact.email}`}
                            className="flex items-center gap-1.5 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{selectedUser.emergencyContact.email}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Work Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                Work Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Assigned Schedule
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {hasPermission("hr-schedules-manage", "read") &&
                    userSchedule ? (
                      <button
                        onClick={() =>
                          navigateTo(
                            selectedUser.assignedScheduleId,
                            "schedules"
                          )
                        }
                        className="btn-small text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer bg-transparent border-none p-0"
                      >
                        {userSchedule.name}
                      </button>
                    ) : userSchedule ? (
                      userSchedule.name
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        No schedule assigned
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Current Status Since
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentEmploymentStatus
                      ? new Date(
                          currentEmploymentStatus.date
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : new Date(selectedUser.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Yearly Vacation Days
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedUser.yearlyVacationDays} days (
                    {selectedUser.vacationDaysType})
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Date Joined
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Employment History */}
            {selectedUser.employmentHistory &&
              selectedUser.employmentHistory.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                  <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                    Employment History
                  </h4>

                  <div className="space-y-2">
                    {sortedEmploymentHistory.map((event, index) => (
                      <div
                        key={event.id}
                        className={`bg-white dark:bg-gray-900 rounded-md px-3 py-2 border ${
                          index === 0
                            ? "border-blue-300 dark:border-blue-700"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <StatusBadge status={event.status} type="user" />
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        {event.notes && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Roles & Permissions */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                Roles & Permissions
              </h4>

              <div className="space-y-4">
                {/* Role IDs */}
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assigned Roles
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.roleIds && selectedUser.roleIds.length > 0 ? (
                      selectedUser.roleIds.map((roleId, index) => {
                        const role = dummyRoles.find((r) => r.id === roleId);
                        const roleName = role?.name || roleId;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              console.log("Role clicked:", roleId, roleName);
                              // TODO: Navigate to role details when roles section is implemented
                            }}
                            className="btn-small inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                          >
                            {roleName}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        No roles assigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Individual Permissions */}
                {selectedUser.permissions &&
                  selectedUser.permissions.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Individual Permissions (
                        {selectedUser.permissions.length})
                      </div>
                      <div className="space-y-2">
                        {selectedUser.permissions.map((permission, index) => {
                          const permissionDef = permissions.find(
                            (p) => p.id === permission.permissionId
                          );
                          const permissionName =
                            permissionDef?.name || permission.permissionId;

                          return (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 py-2 px-3"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="text-xs font-medium text-gray-900 dark:text-white min-w-0">
                                  {permissionName}
                                </div>
                                <div className="flex flex-wrap gap-1 justify-start">
                                  {permission.actions.map(
                                    (action, actionIndex) => (
                                      <span
                                        key={actionIndex}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 whitespace-nowrap"
                                      >
                                        {action}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
