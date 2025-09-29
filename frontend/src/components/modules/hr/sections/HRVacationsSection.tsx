
'use client'

import { useEffect, useState } from 'react'
import { useNavigation } from '@/shared/contexts'
import { CollapsibleDataList } from '@/components/ui/datalist/components'
import { dummyVacations } from '@/data/dummy/hr'
import { Vacation } from '@/shared/types'
import { DataListColumn } from '@/components/ui/datalist/types'
import { VacationDetailsDrawer } from '../drawers/VacationDetailsDrawer'
import { VacationRequestDrawer } from '../drawers/VacationRequestDrawer'

// Import cell components
import {
  TextCell,
  BadgeCell,
  ActionsCell
} from '@/components/ui/datalist/cells'

import { SectionHeader } from '@/components/ui/SectionHeader'

import { useDrawer } from '@/shared/hooks/useDrawer'

export default function HRVacationsSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()
  const { selectedItem: selectedVacation, isDrawerOpen, openDrawer, closeDrawer } = useDrawer<Vacation>()
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false)

  useEffect(() => {
    setSelectedModule('hr')
    setSelectedSection('vacations')
  }, [setSelectedModule, setSelectedSection])

  const columns: DataListColumn<Vacation>[] = [
    {
      id: 'user',
      header: 'Employee',
      cell: ({ data }) => <TextCell value={data.userId} />,
      sortable: true,
      accessor: 'userId'
    },
    {
      id: 'startDate',
      header: 'Start Date',
      cell: ({ data }) => <TextCell value={new Date(data.startDate).toLocaleDateString()} />,
      sortable: true,
      accessor: 'startDate'
    },
    {
      id: 'endDate',
      header: 'End Date',
      cell: ({ data }) => <TextCell value={new Date(data.endDate).toLocaleDateString()} />,
      sortable: true,
      accessor: 'endDate'
    },
    {
      id: 'days',
      header: 'Days',
      cell: ({ data }) => <TextCell value={data.days.toString()} />,
      sortable: true,
      accessor: 'days',
      hideOnMobile: true
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ data }) => <BadgeCell value={data.status} />,
      sortable: true,
      accessor: 'status'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ data }) => (
        <ActionsCell
          actions={[
            { label: 'View', onClick: () => openDrawer(data), 'aria-label': `View vacation request from ${data.userId}` },
            { label: 'Approve', onClick: () => alert(`Approving ${data.id}`), 'aria-label': `Approve vacation request from ${data.userId}` },
            { label: 'Reject', onClick: () => alert(`Rejecting ${data.id}`), 'aria-label': `Reject vacation request from ${data.userId}` }
          ]}
        />
      )
    }
  ]

  const now = new Date()

  const futureVacations = dummyVacations.filter(v => new Date(v.startDate) > now)
  const ongoingVacations = dummyVacations.filter(v => new Date(v.startDate) <= now && new Date(v.endDate) >= now)
  const pastVacations = dummyVacations.filter(v => new Date(v.endDate) < now)
  const actionRequiredVacations = dummyVacations.filter(v => v.status === 'pending')

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader 
            title="Vacations"
            description="Manage vacation requests and view upcoming holidays."
          />
          <button 
            onClick={() => setIsRequestDrawerOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
          >
            Request Vacation
          </button>
        </div>

        <CollapsibleDataList
          title="Action Required"
          data={actionRequiredVacations}
          columns={columns}
          onRowClick={openDrawer}
        />
        <CollapsibleDataList
          title="Ongoing"
          data={ongoingVacations}
          columns={columns}
          onRowClick={openDrawer}
        />
        <CollapsibleDataList
          title="Future"
          data={futureVacations}
          columns={columns}
          onRowClick={openDrawer}
        />
        <CollapsibleDataList
          title="Past"
          data={pastVacations}
          columns={columns}
          onRowClick={openDrawer}
          defaultOpen={false}
        />
      </div>
      <VacationDetailsDrawer
        vacation={selectedVacation}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
      <VacationRequestDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
      />
    </>
  )
}
