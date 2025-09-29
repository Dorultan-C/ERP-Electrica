'use client'

import { useState, useEffect } from 'react'
import { DataList } from '@/components/ui/datalist'
import { dummyUsers } from '@/data/dummy/users'
import { User } from '@/shared/types'
import { UserDetailsDrawer } from '../drawers/UserDetailsDrawer'
import { useNavigation } from '@/shared/contexts'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useDrawer } from '@/shared/hooks/useDrawer'
import { ColumnDef } from '@tanstack/react-table'

// Corrected imports for cell components
import { Avatar } from '@/components/ui/datalist/cells/Avatar'
import { Text, Subtitle } from '@/components/ui/datalist/cells/Text'
import { Badge } from '@/components/ui/datalist/cells/Badge'
import { Actions, ActionButton } from '@/components/ui/datalist/cells/Actions'
import { Group, Stack } from '@/components/ui/datalist/cells/Layout'

export default function HRUsersSection() {
  const { selectedItem: selectedUser, isDrawerOpen, openDrawer, closeDrawer } = useDrawer<User>()
  const { setSelectedModule, setSelectedSection } = useNavigation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSelectedModule('hr')
    setSelectedSection('users')
    const timer = setTimeout(() => setLoading(false), 500) // Simulate loading
    return () => clearTimeout(timer)
  }, [setSelectedModule, setSelectedSection])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'firstName',
      header: 'Employee',
      cell: ({ row }) => (
        <Group spacing="md">
          <Avatar
            src={row.original.profileImage}
            name={`${row.original.firstName} ${row.original.lastName}`}
          />
          <Stack spacing="sm">
            <Text value={`${row.original.firstName} ${row.original.lastName}`} />
            <Subtitle value={row.original.workEmail || ''} />
          </Stack>
        </Group>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          value={row.original.status}
          colorMap={{
            active: 'green',
            probation: 'yellow',
            inactive: 'red',
          }}
        />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'roleIds',
      header: 'Role',
      cell: ({ row }) => <Text value={row.original.roleIds.join(', ')} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Actions>
          <ActionButton onClick={() => openDrawer(row.original)}>Edit</ActionButton>
          <ActionButton onClick={() => alert(`Deactivating ${row.original.firstName}`)} variant="danger">
            Deactivate
          </ActionButton>
        </Actions>
      ),
    },
  ]

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionHeader 
            title="Users"
            description="Manage all users in the system."
          />
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded">
            Add User
          </button>
        </div>
        <DataList
          data={dummyUsers}
          columns={columns}
          onRowClick={openDrawer}
          pageSize={10}
          loading={loading}
          filterableColumns={[
            {
              id: 'status',
              title: 'Status',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'probation', label: 'Probation' },
                { value: 'inactive', label: 'Inactive' },
              ],
            },
          ]}
        />
      </div>
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </>
  )
}
