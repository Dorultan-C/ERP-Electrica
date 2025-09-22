'use client'

import React from 'react'
import { RightDrawer } from '@/components/ui/RightDrawer'
import { Avatar } from '@/components/ui/Avatar'
import { useDrawer } from '@/shared/contexts/DrawerContext'
import { dummyUsers } from '@/data/dummy/users'
import type { User } from '@/shared/types'

interface UserDetailsDrawerProps {
  onEdit?: (user: User) => void
}

export function UserDetailsDrawer({ onEdit }: UserDetailsDrawerProps) {
  const { isOpen, isClosing, isExpanded, selectedId, closeDrawer, toggleExpand } = useDrawer()

  // Find the selected user
  const selectedUser = selectedId ? dummyUsers.find(user => user.id === selectedId) : null

  const handleEdit = () => {
    if (selectedUser && onEdit) {
      onEdit(selectedUser)
    }
  }

  if (!selectedUser) {
    return null
  }

  const displayName = `${selectedUser.firstName} ${selectedUser.lastName}`

  return (
    <RightDrawer
      isOpen={isOpen}
      isClosing={isClosing}
      onClose={closeDrawer}
      title={displayName}
      isExpanded={isExpanded}
      onToggleExpand={toggleExpand}
      {...(onEdit && { onEdit: handleEdit })}
      editLabel="Edit User"
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* User Header */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 pb-6 border-b border-gray-200 dark:border-gray-700">
          <Avatar
            src={selectedUser.profileImage}
            name={displayName}
            size="large"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {displayName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{selectedUser.username}
            </p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedUser.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : selectedUser.status === 'probation'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {selectedUser.status}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Work Email
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.workEmail || 'Not provided'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Personal Email
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Personal Phone
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.phoneNumber}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Work Phone
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.workPhoneNumber || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                National ID
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.nationalID}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Insurance Number
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.insuranceNumber}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.address || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Work Information</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assigned Schedule ID
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.assignedScheduleId}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Join Date
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Vacation Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Vacation & Leave</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Yearly Vacation Days
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {selectedUser.yearlyVacationDays} days ({selectedUser.vacationDaysType})
              </p>
            </div>
          </div>
        </div>

        {/* Employment History */}
        {selectedUser.employmentHistory && selectedUser.employmentHistory.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Employment History</h4>

            <div className="space-y-3">
              {selectedUser.employmentHistory.map((event, _index) => (
                <div key={event.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : event.status === 'probation'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {event.status}
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  {event.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {event.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles & Permissions */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Roles & Permissions</h4>

          <div className="space-y-4">
            {/* Role IDs */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned Roles
              </h5>
              <div className="space-y-2">
                {selectedUser.roleIds && selectedUser.roleIds.length > 0 ? (
                  selectedUser.roleIds.map((roleId, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mr-2"
                    >
                      {roleId}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</p>
                )}
              </div>
            </div>

            {/* Individual Permissions */}
            {selectedUser.permissions && selectedUser.permissions.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Individual Permissions
                </h5>
                <div className="space-y-1">
                  {selectedUser.permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 mr-2 mb-1"
                    >
                      {String(permission)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Account Information</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User ID
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {selectedUser.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUser.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Joined
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </RightDrawer>
  )
}