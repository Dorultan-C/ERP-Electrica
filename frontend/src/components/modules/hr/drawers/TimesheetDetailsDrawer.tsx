'use client'

import React from 'react'
import { RightDrawer } from '@/components/ui/RightDrawer'
import { Avatar } from '@/components/ui/Avatar'
import { useDrawer } from '@/shared/contexts/DrawerContext'
import { dummyTimesheetListItems, dummyTimesheets } from '@/data/dummy/hr'
import { dummyUsers } from '@/data/dummy/users'
import type { TimesheetListItem } from '@/shared/types/hr'

interface TimesheetDetailsDrawerProps {
  onEdit?: (timesheet: TimesheetListItem) => void
}

export function TimesheetDetailsDrawer({ onEdit }: TimesheetDetailsDrawerProps) {
  const { isOpen, isClosing, isExpanded, selectedId, closeDrawer, toggleExpand } = useDrawer()

  // Find the selected timesheet from list items first
  const selectedTimesheetListItem = selectedId ? dummyTimesheetListItems.find(timesheet => timesheet.id === selectedId) : null

  // Find the full timesheet data for additional details
  const selectedTimesheet = selectedId ? dummyTimesheets.find(timesheet => timesheet.id === selectedId) : null

  // Find the user associated with this timesheet
  const selectedUser = selectedTimesheetListItem ? dummyUsers.find(user => user.id === selectedTimesheetListItem.userId) : null

  const handleEdit = () => {
    if (selectedTimesheetListItem && onEdit) {
      onEdit(selectedTimesheetListItem)
    }
  }

  if (!selectedTimesheetListItem) {
    return null
  }

  // Format time for display
  const formatTime = (date?: Date) => {
    if (!date) return 'Not set'
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  // Format duration in minutes to hours:minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Calculate worked hours vs scheduled hours
  const scheduledHours = 8 // Default 8 hours, could be from user's schedule
  const workedHours = selectedTimesheetListItem.totalMinutes / 60
  const overtime = Math.max(0, workedHours - scheduledHours)

  return (
    <RightDrawer
      isOpen={isOpen}
      isClosing={isClosing}
      onClose={closeDrawer}
      title={`${selectedTimesheetListItem.employeeName} - ${new Date(selectedTimesheetListItem.date).toLocaleDateString()}`}
      isExpanded={isExpanded}
      onToggleExpand={toggleExpand}
      {...(onEdit && { onEdit: handleEdit })}
      editLabel="Edit Timesheet"
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Employee Header */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 pb-6 border-b border-gray-200 dark:border-gray-700">
          <Avatar
            src={selectedUser?.profileImage}
            name={selectedTimesheetListItem.employeeName}
            size="large"
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedTimesheetListItem.employeeName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(selectedTimesheetListItem.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedTimesheetListItem.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : selectedTimesheetListItem.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : selectedTimesheetListItem.status === 'rejected'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
              }`}>
                {selectedTimesheetListItem.status === 'requires_modification' ? 'Needs Changes' : selectedTimesheetListItem.status}
              </span>
            </div>
          </div>
        </div>

        {/* Time Summary */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Time Summary</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(selectedTimesheetListItem.totalMinutes)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overtime > 0 ? formatDuration(overtime * 60) : '0h 0m'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Overtime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Time Details</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatTime(selectedTimesheetListItem.startTime)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatTime(selectedTimesheetListItem.endTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Break Information */}
        {selectedTimesheet?.breaks && selectedTimesheet.breaks.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Breaks</h4>

            <div className="space-y-3">
              {selectedTimesheet.breaks.map((breakItem, index) => (
                <div key={breakItem.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Break {index + 1}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDuration(breakItem.totalMinutes)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Total Break Time
                  </span>
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {formatDuration(selectedTimesheet.breakMinutes)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information */}
        {selectedTimesheet && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h4>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Regular Hours
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDuration(selectedTimesheet.regularMinutes)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Overtime Hours
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatDuration(selectedTimesheet.overtimeMinutes)}
                </p>
              </div>

              {selectedTimesheet.reviewedBy && selectedTimesheet.reviewedAt && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reviewed By
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedTimesheet.reviewedBy}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reviewed At
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedTimesheet.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Account Information */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Timesheet Information</h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timesheet ID
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {selectedTimesheetListItem.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employee ID
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {selectedTimesheetListItem.userId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </RightDrawer>
  )
}