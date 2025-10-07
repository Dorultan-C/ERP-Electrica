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
  const { isLoading: authLoading, user: currentUser } = useAuth();
  const { hasPermission } = usePermissions();

  // Find the selected user
  const selectedUser = dummyUsers.find((user) => user.id === id);

  if (!selectedUser) {
    return null;
  }

  // Check if viewing own profile
  const isOwnProfile = currentUser?.id === selectedUser.id;

  // Permission checks
  const canReadUsers = hasPermission("hr-users-manage", "read");

  // Check permissions for viewing roles & permissions section
  const canViewRolesAndPermissions = isOwnProfile
    ? hasPermission("hr-users-permissions-owns", "read_own") ||
      hasPermission("hr-users-permissions-owns", "read_all")
    : hasPermission("hr-users-permissions-others", "read_own") ||
      hasPermission("hr-users-permissions-others", "read_all");

  // Determine if user can see ALL permissions or only their own
  const canViewAllPermissions = isOwnProfile
    ? hasPermission("hr-users-permissions-owns", "read_all")
    : hasPermission("hr-users-permissions-others", "read_all");

  // Helper function to check if current user can see a specific permission
  const canViewPermission = (permissionId: string): boolean => {
    // If user has read_all, they can see everything
    if (canViewAllPermissions) {
      return true;
    }

    // If user only has read_own, they can only see permissions they themselves have
    // Check if current user has this permission directly
    const hasDirectly = currentUser?.permissions?.some(
      (userPerm) => userPerm.permissionId === permissionId
    );

    // Check if current user has this permission through roles
    const hasViaRole = currentUser?.roleIds?.some((roleId) => {
      const role = dummyRoles.find((r) => r.id === roleId);
      return role?.permissions?.some(
        (rolePerm) => rolePerm.permissionId === permissionId
      );
    });

    return hasDirectly || hasViaRole || false;
  };

  // Helper function to check if current user can see a specific role
  const canViewRole = (roleId: string): boolean => {
    // If user has read_all, they can see everything
    if (canViewAllPermissions) {
      return true;
    }

    // If user only has read_own, they can only see roles they themselves have
    return currentUser?.roleIds?.includes(roleId) || false;
  };

  // Helper function to get visible actions for a permission
  const getVisibleActions = (permissionId: string, actions: string[]): string[] => {
    // If user has read_all, they can see all actions
    if (canViewAllPermissions) {
      return actions;
    }

    // If user only has read_own, filter to only show actions they themselves have
    // Get current user's actions for this permission (directly)
    const directActions = currentUser?.permissions?.find(
      (userPerm) => userPerm.permissionId === permissionId
    )?.actions || [];

    // Get current user's actions for this permission (through roles)
    const roleActions: string[] = [];
    currentUser?.roleIds?.forEach((roleId) => {
      const role = dummyRoles.find((r) => r.id === roleId);
      const rolePerm = role?.permissions?.find(
        (rp) => rp.permissionId === permissionId
      );
      if (rolePerm) {
        roleActions.push(...rolePerm.actions);
      }
    });

    // Combine and deduplicate actions
    const currentUserActions = [...new Set([...directActions, ...roleActions])];

    // Filter to only show actions that the current user also has
    return actions.filter((action) => currentUserActions.includes(action));
  };

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
                    Yearly Vacation Days
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedUser.yearlyVacationDays} days (
                    {selectedUser.vacationDaysType})
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
                        className={`bg-white dark:bg-gray-900 rounded-md px-3 py-2 border-2 ${
                          index === 0
                            ? "!border-blue-500"
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

            {/* Clothing */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                Clothing
              </h4>

              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Sizes
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        d="M3 7L6 4H9C9 4.39397 9.0776 4.78407 9.22836 5.14805C9.37913 5.51203 9.6001 5.84274 9.87868 6.12132C10.1573 6.3999 10.488 6.62087 10.8519 6.77164C11.2159 6.9224 11.606 7 12 7C12.394 7 12.7841 6.9224 13.1481 6.77164C13.512 6.62087 13.8427 6.3999 14.1213 6.12132C14.3999 5.84274 14.6209 5.51203 14.7716 5.14805C14.9224 4.78407 15 4.39397 15 4H18L21 7L20.5 12L18 10.5V20H6V10.5L3.5 12L3 7Z"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Shirt:
                    </span>
                    <span className="font-medium">
                      {selectedUser?.clothingSizes?.shirt ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M28 28.75h-7.54c-.27 0-.52-.14-.65-.38L16 21.68l-3.81 6.69c-.13.24-.38.38-.65.38H4c-.2 0-.4-.08-.55-.24-.14-.15-.22-.36-.2-.57l2-24c.04-.38.36-.69.75-.69h20c.39 0 .71.31.75.69l2 24c.02.21-.06.42-.2.57-.15.16-.35.24-.55.24zm-7.1-1.5h6.29L25.31 4.75H6.69L4.81 27.25H11.1l4.25-7.45c.26-.45.92-.45 1.3 0l4.25 7.45zM26.81 14.46c-.2 0-.39-.08-.54-.23L22 9.75c-.29-.3-.29-.78 0-1.06.29-.29.77-.29 1.06 0l4.29 4.48c.29.29.29.77 0 1.06-.15.14-.34.21-.54.23zM5.19 14.45c-.19 0-.37-.07-.52-.21-.29-.29-.29-.77 0-1.06l4.27-4.47c.3-.3.78-.3 1.08 0 .29.29.29.77 0 1.06L5.73 14.22c-.15.14-.34.21-.54.23zM16 14c-.41 0-.75-.34-.75-.75V4c0-.41.34-.75.75-.75s.75.34.75.75v9.29c0 .41-.34.71-.75.71z" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Trousers:
                    </span>
                    <span className="font-medium">
                      {selectedUser?.clothingSizes?.trousers ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        d="M3 7L6 4H9C9 5 9.5 6 10.5 6.5M15 4H18L21 7L20.5 12L18 10.5V20H13.5M6 10.5L3.5 12L3 7M6 10.5V20H10.5M13.5 6.5C14.5 6 15 5 15 4M10.5 6.5V20M13.5 6.5V20M10.5 6.5C11 7 11.5 7.5 12 7.5C12.5 7.5 13 7 13.5 6.5"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Jumper:
                    </span>
                    <span className="font-medium">
                      {selectedUser?.clothingSizes?.jumper ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        d="M3 7L6 4H9C9 5 9.5 6 10.5 6.5M15 4H18L21 7L20.5 12L18 10.5V20H13.5M6 10.5L3.5 12L3 7M6 10.5V20H10.5M13.5 6.5C14.5 6 15 5 15 4M10.5 6.5V20M13.5 6.5V20M10.5 6.5C11 7 11.5 7.5 12 7.5C12.5 7.5 13 7 13.5 6.5"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Jacket:
                    </span>
                    <span className="font-medium">
                      {selectedUser?.clothingSizes?.jacket ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M10 3C7.8 3 6.2 4.6 5.3 6.5C4.4 8.4 4 10.7 4 12.7C4 15 5.1 17.4 5.1 17.4L5.3 18h8.4l.2-.8s.8-2.9 1-5.8c.1-1.1.1-3-.5-4.8C14.1 5.7 13.7 4.9 12.9 4.2C12.2 3.5 11.2 3 10 3zm12 0c-1.2 0-2.2.5-2.9 1.2-.7.7-1.1 1.6-1.5 2.5-.6 1.8-.6 3.7-.6 4.8.2 2.8 1 5.8 1 5.8l.2.8h8.4l.3-.6s1-2.4 1-4.7c0-2-.4-4.3-1.3-6.2C25.8 4.6 24.2 3 22 3zm-12 2c.7 0 1.1.2 1.5.6.4.4.8 1 1 1.7.5 1.4.5 3.2.5 4-.2 2.2-.7 4-1 4.7H6.7c-.2-.7-.7-2-1-3.3 0-1.7.4-3.8 1.1-5.3C7.8 5.9 8.8 5 10 5zm12 0c1.2 0 2.2.9 2.9 2.4.7 1.5 1.1 3.6 1.1 5.3-.3 1.3-.8 2.6-1 3.3h-5.4c-.2-.6-.7-2.4-.8-4.7 0-.8 0-2.6.5-4 .2-.7.6-1.3 1-1.7.4-.4.8-.6 1.5-.6zM5 21v1c0 1.4.1 3 .8 4.4.7 1.4 2.2 2.6 4.2 2.6 2.3 0 4-2.2 4-5 0-.6 0-1.4-.2-2.2L13.6 21H5zm13.4 0l-.2.8c-.2.8-.2 1.6-.2 2.2 0 2.8 1.7 5 4 5 2 0 3.5-1.2 4.2-2.6.7-1.4.8-3 .8-4.4v-1h-8.6zM7.2 23h4.7c0 .3.1.7 0 1-0 2-1.1 3-2 3-1.4 0-2-.5-2.4-1.5-.3-.7-.3-1.6-.3-2.5zm12.9 0h4.7c-.1.9-.1 1.8-.4 2.5-.5.9-1 1.5-2.4 1.5-.9 0-2-1-2-3 0-.3 0-.7.1-1z" />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Shoe:
                    </span>
                    <span className="font-medium">
                      {selectedUser?.clothingSizes?.shoe ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                      />
                    </svg>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Gloves:
                    </span>
                    <span className="font-medium">
                      {selectedUser?.clothingSizes?.gloves ?? "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles & Permissions */}
            {canViewRolesAndPermissions && (() => {
              // Check if there are any visible roles
              const visibleRoles = selectedUser.roleIds?.filter((roleId) => canViewRole(roleId)) || [];

              // Check if there are any visible permissions with visible actions
              const visiblePermissions = selectedUser.permissions?.filter((permission) => {
                if (!canViewPermission(permission.permissionId)) return false;
                const visibleActions = getVisibleActions(permission.permissionId, permission.actions);
                return visibleActions.length > 0;
              }) || [];

              // If no visible roles and no visible permissions, don't show the section
              if (visibleRoles.length === 0 && visiblePermissions.length === 0) {
                return null;
              }

              return (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                  <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                    Roles & Permissions
                  </h4>

                  <div className="space-y-4">
                    {/* Role IDs */}
                    {visibleRoles.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Assigned Roles
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {visibleRoles.map((roleId, index) => {
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
                          })}
                        </div>
                      </div>
                    )}

                    {/* Individual Permissions */}
                    {visiblePermissions.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Individual Permissions ({visiblePermissions.length})
                        </div>
                        <div className="space-y-2">
                          {visiblePermissions.map((permission, index) => {
                            const permissionDef = permissions.find(
                              (p) => p.id === permission.permissionId
                            );
                            const permissionName =
                              permissionDef?.name || permission.permissionId;

                            // Get only the actions that the current user can see
                            const visibleActions = getVisibleActions(
                              permission.permissionId,
                              permission.actions
                            );

                            // Skip this permission if no visible actions
                            if (visibleActions.length === 0) {
                              return null;
                            }

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
                                    {visibleActions.map(
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
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
