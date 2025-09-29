
'use client'

import { useEffect, useState } from 'react'
import { useNavigation } from '@/shared/contexts'
import { DataList } from '@/components/ui/datalist'
import { dummySchedules } from '@/data/dummy/hr'
import { Schedule } from '@/shared/types'
import { DataListColumn } from '@/components/ui/datalist/types'
import { ScheduleDetailsDrawer } from '../drawers/ScheduleDetailsDrawer'

// Import cell components
import {
  TextCell,
  ActionsCell
} from '@/components/ui/datalist/cells'

import { SectionHeader } from '@/components/ui/SectionHeader'

import { useDrawer } from '@/shared/hooks/useDrawer'

export default function HRSchedulesSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()
  const { selectedItem: selectedSchedule, isDrawerOpen, openDrawer, closeDrawer } = useDrawer<Schedule>()

  useEffect(() => {
    setSelectedModule('hr')
    setSelectedSection('schedules')
  }, [setSelectedModule, setSelectedSection])

  const columns: DataListColumn<Schedule>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: ({ data }) => <TextCell value={data.name} />,
      sortable: true,
      accessor: 'name'
    },
    {
      id: 'description',
      header: 'Description',
      cell: ({ data }) => <TextCell value={data.description} />,
      sortable: true,
      accessor: 'description'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ data }) => (
        <ActionsCell
          actions={[
            { label: 'View', onClick: () => openDrawer(data), 'aria-label': `View schedule ${data.name}` },
            { label: 'Edit', onClick: () => alert(`Editing ${data.id}`), 'aria-label': `Edit schedule ${data.name}` },
            { label: 'Delete', onClick: () => alert(`Deleting ${data.id}`), 'aria-label': `Delete schedule ${data.name}` }
          ]}
        />
      )
    }
  ]

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader 
            title="Schedules"
            description="Manage work schedules."
          />
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded">
            Add Schedule
          </button>
        </div>
        <DataList
          data={dummySchedules}
          columns={columns}
          onRowClick={openDrawer}
          pageSize={10}
        />
      </div>
      <ScheduleDetailsDrawer
        schedule={selectedSchedule}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </>
  )
}
