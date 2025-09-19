'use client'

import React, { useEffect } from 'react'
import { useNavigation } from '@/shared/contexts'
import DataList, { DataListColumn } from '@/components/ui/DataList'
import { dummySchedules } from '@/data/dummy/hr'
import type { Schedule } from '@/shared/types'

export default function HRSchedulesSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()

  useEffect(() => {
    // Set the module and section when this component mounts
    setSelectedModule('hr')
    setSelectedSection('schedules')
  }, [setSelectedModule, setSelectedSection])

  // Define columns for the schedule list
  const scheduleColumns: DataListColumn<Schedule>[] = [
    {
      id: 'name',
      title: 'Schedule Name',
      accessor: 'name',
      sortable: true,
      searchable: true,
      render: (name, schedule) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{name}</div>
          {schedule.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{schedule.description}</div>
          )}
        </div>
      )
    },
    {
      id: 'workingDays',
      title: 'Working Days',
      accessor: 'weekSchedule',
      sortable: false,
      width: '150px',
      render: (weekSchedule) => (
        <div className="text-gray-900 dark:text-white">
          {weekSchedule.length} days/week
        </div>
      )
    },
    {
      id: 'hours',
      title: 'Daily Hours',
      accessor: 'weekSchedule',
      sortable: false,
      width: '120px',
      render: (weekSchedule) => {
        if (weekSchedule.length === 0) return <span className="text-gray-500">-</span>
        const firstDay = weekSchedule[0]
        const hours = firstDay.labouringMinutes / 60
        return (
          <div className="text-gray-900 dark:text-white">
            {hours}h/day
          </div>
        )
      }
    },
    {
      id: 'timeRange',
      title: 'Time Range',
      accessor: 'weekSchedule',
      sortable: false,
      render: (weekSchedule) => {
        if (weekSchedule.length === 0) return <span className="text-gray-500">No schedule</span>
        const firstDay = weekSchedule[0]
        return (
          <div className="text-gray-900 dark:text-white">
            {firstDay.startTime} - {firstDay.endTime}
          </div>
        )
      }
    },
    {
      id: 'breakTime',
      title: 'Break Time',
      accessor: 'weekSchedule',
      sortable: false,
      width: '120px',
      render: (weekSchedule) => {
        if (weekSchedule.length === 0) return <span className="text-gray-500">-</span>
        const firstDay = weekSchedule[0]
        const breakMinutes = firstDay.allowedBrakeMinutes
        return (
          <div className="text-gray-900 dark:text-white">
            {breakMinutes}min
          </div>
        )
      }
    }
  ]

  const handleScheduleClick = (schedule: Schedule) => {
    console.log('Schedule clicked:', schedule)
    // TODO: Open schedule details drawer (Phase 4.1.3)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedules</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Work schedules and shifts
        </p>
      </div>

      {/* Schedules List */}
      <DataList
        data={dummySchedules}
        columns={scheduleColumns}
        searchPlaceholder="Search schedules by name or description..."
        emptyMessage="No schedules found"
        onItemClick={handleScheduleClick}
        pageSize={10}
        pagination={false} // Disable pagination for this smaller dataset
      />

      {/* Success Message */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
          ✅ DataList Component Working (Phase 4.1.2)
        </h3>
        <p className="text-green-800 dark:text-green-200 text-sm">
          The same DataList component is now being used for both Users and Schedules, demonstrating its reusability across different data types.
        </p>
      </div>
    </div>
  )
}