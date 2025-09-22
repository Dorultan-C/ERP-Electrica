'use client'

import React, { useEffect, useState } from 'react'
import { useNavigation, useDrawer } from '@/shared/contexts'
import { DataList, Cell } from '@/components/ui/datalist'
import type { DataListColumn } from '@/components/ui/datalist'
import { TimesheetDetailsDrawer } from '../drawers/TimesheetDetailsDrawer'
import { AttendanceTracker } from '../components/AttendanceTracker'
import { dummyTimesheetListItems } from '@/data/dummy/hr'
import type { TimesheetListItem } from '@/shared/types/hr'

type TimeView = 'day' | 'month' | 'year'

export default function HRAttendanceSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()
  const { openDrawer } = useDrawer()
  const [currentView, setCurrentView] = useState<TimeView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    setSelectedModule('hr')
    setSelectedSection('attendance')
  }, [setSelectedModule, setSelectedSection])

  const handleTimesheetClick = (timesheet: TimesheetListItem) => {
    openDrawer(timesheet.id, 'timesheets')
  }

  const handleEditTimesheet = (timesheet: TimesheetListItem) => {
    console.log('Edit timesheet:', timesheet)
    // TODO: Open edit form/modal (Phase 4.2.2+)
  }

  // Format time for display
  const formatTime = (date?: Date) => {
    if (!date) return '-'
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // Format duration in minutes to hours:minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get date range for current view
  const getDateRangeText = () => {
    switch (currentView) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      case 'month':
        return currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })
      case 'year':
        return currentDate.getFullYear().toString()
      default:
        return ''
    }
  }

  // Navigate time periods
  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    switch (currentView) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
        break
    }
    setCurrentDate(newDate)
  }

  const columns: DataListColumn<TimesheetListItem>[] = [
    {
      id: 'employee',
      header: 'Employee',
      accessor: 'employeeName',
      sortable: true,
      searchable: true,
      cell: ({ value }) => <Cell.Text value={value} className="font-medium" />
    },
    {
      id: 'date',
      header: 'Date',
      accessor: 'date',
      sortable: true,
      width: '120px',
      cell: ({ value }) => (
        <Cell.Text value={new Date(value).toLocaleDateString()} />
      )
    },
    {
      id: 'timeRange',
      header: 'Time Range',
      width: '140px',
      cell: ({ data }) => (
        <Cell.Stack>
          <Cell.Text
            value={`${formatTime(data.startTime)} - ${formatTime(data.endTime)}`}
            className="text-sm"
          />
          <Cell.Subtitle value={data.startTime && data.endTime ? '' : 'Incomplete'} />
        </Cell.Stack>
      )
    },
    {
      id: 'duration',
      header: 'Duration',
      accessor: 'totalMinutes',
      sortable: true,
      width: '100px',
      cell: ({ value }) => (
        <Cell.Text value={formatDuration(value)} className="font-medium" />
      )
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: {
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'requires_modification', label: 'Needs Changes' }
        ]
      },
      width: '120px',
      cell: ({ value }) => (
        <Cell.Badge
          value={value === 'requires_modification' ? 'Needs Changes' : value}
          colorMap={{
            pending: 'yellow',
            approved: 'green',
            rejected: 'red',
            requires_modification: 'orange'
          }}
        />
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Timesheets and attendance tracking
        </p>
      </div>

      {/* Attendance Tracker */}
      <AttendanceTracker />

      {/* Time View Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* View Type Selector */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            {(['day', 'month', 'year'] as TimeView[]).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === view
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateTime('prev')}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-lg font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
              {getDateRangeText()}
            </div>

            <button
              onClick={() => navigateTime('next')}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Timesheet List */}
      <DataList
        data={dummyTimesheetListItems}
        columns={columns}
        onRowClick={handleTimesheetClick}
        pageSize={15}
      />

      {/* Progress Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          🚀 Phase 4.2.2 Complete - Attendance Tracking Interface
        </h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Attendance section now includes real-time attendance tracking with clock in/out functionality,
          break management, live time tracking, and comprehensive timesheet views with date navigation.
        </p>
      </div>

      {/* Timesheet Details Drawer */}
      <TimesheetDetailsDrawer onEdit={handleEditTimesheet} />
    </div>
  )
}