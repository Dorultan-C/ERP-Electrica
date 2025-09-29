'use client'

import { useEffect, useState } from 'react'
import { useNavigation } from '@/shared/contexts'
import { CollapsibleDataList } from '@/components/ui/datalist/components/CollapsibleDataList'
import { dummyLOAs } from '@/data/dummy/hr'
import { dummyUsers } from '@/data/dummy/users'
import { LeaveOfAbsence } from '@/shared/types'
import { LeaveOfAbsenceDetailsDrawer } from '../drawers/LeaveOfAbsenceDetailsDrawer'
import { LeaveOfAbsenceRequestDrawer } from '../drawers/LeaveOfAbsenceRequestDrawer'

// Corrected imports for cell components
import { Text, Badge, Actions, ActionButton, IconButton } from '@/components/ui/datalist'
import { ColumnDef } from '@tanstack/react-table'

// Helper to get employee name from userId
const getEmployeeName = (userId: string) => {
  const user = dummyUsers.find(u => u.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
};

export default function HRLeaveOfAbsenceSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()
  const [selectedLOA, setSelectedLOA] = useState<LeaveOfAbsence | null>(null)
  const [isRequestDrawerOpen, setIsRequestDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSelectedModule('hr')
    setSelectedSection('leave')
    const timer = setTimeout(() => setLoading(false), 500) // Simulate loading
    return () => clearTimeout(timer)
  }, [setSelectedModule, setSelectedSection])

  const columns: ColumnDef<LeaveOfAbsence>[] = [
    {
      accessorKey: 'userId',
      header: 'Employee',
      cell: ({ row }) => <Text value={getEmployeeName(row.original.userId)} />,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <Text value={row.original.type} />,
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => <Text value={new Date(row.original.startDate).toLocaleDateString()} />,
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => <Text value={row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : 'N/A'} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          value={row.original.status}
          colorMap={{
            approved: 'green',
            pending: 'yellow',
            rejected: 'red',
            withdrawn: 'gray',
          }}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Actions>
          <ActionButton
            onClick={() => {
              setSelectedLOA(row.original)
            }}
          >
            Details
          </ActionButton>
          <IconButton
            onClick={() => {
              alert(`Editing leave request ${row.original.id}`);
            }}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
            title="Edit Leave Request"
          />
        </Actions>
      ),
    },
  ];

  const now = new Date()

  const futureLOAs = dummyLOAs.filter(l => new Date(l.startDate) > now)
  const ongoingLOAs = dummyLOAs.filter(l => new Date(l.startDate) <= now && (l.endDate ? new Date(l.endDate) >= now : true))
  const pastLOAs = dummyLOAs.filter(l => l.endDate && new Date(l.endDate) < now)
  const actionRequiredLOAs = dummyLOAs.filter(l => l.status === 'pending')

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave of Absence</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage leave of absence requests.
            </p>
          </div>
          <button 
            onClick={() => setIsRequestDrawerOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
          >
            Request LOA
          </button>
        </div>

        <CollapsibleDataList
          title="Action Required"
          data={actionRequiredLOAs}
          columns={columns}
          onRowClick={setSelectedLOA}
          loading={loading}
        />
        <CollapsibleDataList
          title="Ongoing"
          data={ongoingLOAs}
          columns={columns}
          onRowClick={setSelectedLOA}
          loading={loading}
        />
        <CollapsibleDataList
          title="Future"
          data={futureLOAs}
          columns={columns}
          onRowClick={setSelectedLOA}
          loading={loading}
        />
        <CollapsibleDataList
          title="Past"
          data={pastLOAs}
          columns={columns}
          onRowClick={setSelectedLOA}
          defaultOpen={false}
          loading={loading}
        />
      </div>
      <LeaveOfAbsenceDetailsDrawer
        loa={selectedLOA}
        isOpen={!!selectedLOA}
        onClose={() => setSelectedLOA(null)}
      />
      <LeaveOfAbsenceRequestDrawer
        isOpen={isRequestDrawerOpen}
        onClose={() => setIsRequestDrawerOpen(false)}
      />
    </>
  )
}