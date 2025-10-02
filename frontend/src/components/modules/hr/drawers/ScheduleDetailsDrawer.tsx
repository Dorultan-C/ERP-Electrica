'use client'

import React from 'react'
import { DrawerContentProps } from '@/shared/drawer/drawerRegistry'
import { dummySchedules } from '@/data/dummy/hr'
import type { Schedule } from '@/shared/types'

interface ScheduleDetailsDrawerProps extends DrawerContentProps {
  onEdit?: (schedule: Schedule) => void
}

export function ScheduleDetailsDrawer({ id, onEdit }: ScheduleDetailsDrawerProps) {
  // Find the selected schedule
  const selectedSchedule = dummySchedules.find(schedule => schedule.id === id)

  if (!selectedSchedule) {
    return null
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Schedule Header */}
      <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {selectedSchedule.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {selectedSchedule.description}
        </p>
      </div>

      {/* Schedule Overview */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Schedule Overview</h4>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Working Days per Week
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {selectedSchedule.weekSchedule.length} days
            </p>
          </div>

          {selectedSchedule.weekSchedule.length > 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Daily Working Hours
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedSchedule.weekSchedule[0]?.labouringMinutes ? (selectedSchedule.weekSchedule[0].labouringMinutes / 60) : 0} hours per day
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Time
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedSchedule.weekSchedule[0]?.startTime || 'N/A'} - {selectedSchedule.weekSchedule[0]?.endTime || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Break Time
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedSchedule.weekSchedule[0]?.allowedBrakeMinutes || 0} minutes
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Weekly Schedule Details */}
      {selectedSchedule.weekSchedule.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Schedule</h4>

          <div className="space-y-3">
            {selectedSchedule.weekSchedule.map((daySchedule, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Day {index + 1}
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {daySchedule.startTime} - {daySchedule.endTime}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Working Hours
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {daySchedule.labouringMinutes / 60}h
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Break Time
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {daySchedule.allowedBrakeMinutes} min
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Net Hours
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {(daySchedule.labouringMinutes - daySchedule.allowedBrakeMinutes) / 60}h
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Weekly Hours */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Totals</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
              Total Working Hours
            </label>
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-300">
              {selectedSchedule.weekSchedule.reduce((total, day) => total + (day.labouringMinutes / 60), 0)}h
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
              Total Break Time
            </label>
            <p className="text-lg font-semibold text-green-900 dark:text-green-300">
              {selectedSchedule.weekSchedule.reduce((total, day) => total + day.allowedBrakeMinutes, 0)} min
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Information */}
      <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Schedule Information</h4>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Schedule ID
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {selectedSchedule.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
