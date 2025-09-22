'use client'

import React, { useEffect } from 'react'
import { useNavigation, useDrawer } from '@/shared/contexts'
import { DataList, Cell } from '@/components/ui/datalist'
import type { DataListColumn } from '@/components/ui/datalist'
import { ScheduleDetailsDrawer } from '../drawers/ScheduleDetailsDrawer'
import { dummySchedules } from '@/data/dummy/hr'
import type { Schedule } from '@/shared/types'

export default function HRSchedulesSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()
  const { openDrawer } = useDrawer()

  useEffect(() => {
    setSelectedModule('hr')
    setSelectedSection('schedules')
  }, [setSelectedModule, setSelectedSection])

  const handleScheduleClick = (schedule: Schedule) => {
    openDrawer(schedule.id, 'schedules')
  }

  const handleEditSchedule = (schedule: Schedule) => {
    console.log('Edit schedule:', schedule)
    // TODO: Open edit form/modal (Phase 4.1.3+)
  }

  const columns: DataListColumn<Schedule>[] = [
    {
      id: 'name',
      header: 'Schedule Name',
      accessor: 'name',
      sortable: true,
      searchable: true,
      cell: ({ value, data }) => (
        <Cell.Stack>
          <Cell.Text value={value} className="font-medium" />
          <Cell.Subtitle value={data.description} />
        </Cell.Stack>
      )
    },
    {
      id: 'workingDays',
      header: 'Working Days',
      width: '150px',
      cell: ({ data }) => (
        <Cell.Text value={`${data.weekSchedule.length} days/week`} />
      )
    },
    {
      id: 'dailyHours',
      header: 'Daily Hours',
      width: '120px',
      cell: ({ data }) => {
        if (data.weekSchedule.length === 0) return <Cell.Text value="-" />
        const firstDay = data.weekSchedule[0]
        if (!firstDay) return <Cell.Text value="-" />
        const hours = firstDay.labouringMinutes / 60
        return <Cell.Text value={`${hours}h/day`} />
      }
    },
    {
      id: 'timeRange',
      header: 'Time Range',
      cell: ({ data }) => {
        if (data.weekSchedule.length === 0) return <Cell.Text value="No schedule" />
        const firstDay = data.weekSchedule[0]
        if (!firstDay) return <Cell.Text value="No schedule" />
        return <Cell.Text value={`${firstDay.startTime} - ${firstDay.endTime}`} />
      }
    },
    {
      id: 'breakTime',
      header: 'Break Time',
      width: '120px',
      cell: ({ data }) => {
        if (data.weekSchedule.length === 0) return <Cell.Text value="-" />
        const firstDay = data.weekSchedule[0]
        if (!firstDay) return <Cell.Text value="-" />
        return <Cell.Text value={`${firstDay.allowedBrakeMinutes}min`} />
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Schedules</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Work schedules and shifts
        </p>
      </div>

      <DataList
        data={dummySchedules}
        columns={columns}
        onRowClick={handleScheduleClick}
        pagination={false}
      />

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
          ✅ Mobile Responsive Schedules Section (Phase 4.1.4)
        </h3>
        <p className="text-green-800 dark:text-green-200 text-sm">
          Schedule section optimized for mobile with responsive tables, touch-friendly interactions,
          and adaptive drawer behavior. All layouts scale properly from mobile to desktop.
        </p>
      </div>

      {/* Schedule Details Drawer */}
      <ScheduleDetailsDrawer onEdit={handleEditSchedule} />
    </div>
  )
}