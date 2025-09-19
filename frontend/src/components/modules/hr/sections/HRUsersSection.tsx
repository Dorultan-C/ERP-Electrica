'use client'

import React, { useEffect } from 'react'
import { useNavigation } from '@/shared/contexts'
import DataList, { DataListColumn, DataListFilter } from '@/components/ui/DataList'
import { dummyUsers } from '@/data/dummy/users'
import type { User } from '@/shared/types'

export default function HRUsersSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation()

  useEffect(() => {
    // Set the module and section when this component mounts
    setSelectedModule('hr')
    setSelectedSection('users')
  }, [setSelectedModule, setSelectedSection])

  // Define columns for the user list
  const userColumns: DataListColumn<User>[] = [
    {
      id: 'profile',
      title: 'Profile',
      accessor: 'profileImage',
      sortable: false,
      width: '80px',
      render: (profileImage, user) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'name',
      title: 'Name',
      accessor: (user) => `${user.firstName} ${user.lastName}`,
      sortable: true,
      searchable: true,
      render: (name, user) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
        </div>
      )
    },
    {
      id: 'email',
      title: 'Email',
      accessor: 'workEmail',
      sortable: true,
      searchable: true,
      render: (email) => (
        <div className="text-gray-900 dark:text-white">{email}</div>
      )
    },
    {
      id: 'status',
      title: 'Status',
      accessor: 'status',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (status) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : status === 'probation'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      id: 'vacationDays',
      title: 'Vacation Days',
      accessor: 'yearlyVacationDays',
      sortable: true,
      width: '140px',
      render: (days, user) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{days} days</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.vacationDaysType}
          </div>
        </div>
      )
    },
    {
      id: 'joinDate',
      title: 'Join Date',
      accessor: 'createdAt',
      sortable: true,
      width: '120px',
      render: (date) => (
        <div className="text-gray-900 dark:text-white">
          {new Date(date).toLocaleDateString()}
        </div>
      )
    }
  ]

  // Define filters
  const userFilters: DataListFilter[] = [
    {
      id: 'status',
      title: 'Filter by Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'probation', label: 'Probation' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]

  const handleUserClick = (user: User) => {
    console.log('User clicked:', user)
    // TODO: Open user details drawer (Phase 4.1.3)
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage users and employee information
        </p>
      </div>

      {/* Users List */}
      <DataList
        data={dummyUsers}
        columns={userColumns}
        filters={userFilters}
        searchPlaceholder="Search users by name, username, or email..."
        emptyMessage="No users found"
        onItemClick={handleUserClick}
        pageSize={10}
      />

      {/* Success Message */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
          ✅ DataList Component Complete (Phase 4.1.2)
        </h3>
        <p className="text-green-800 dark:text-green-200 text-sm">
          The reusable DataList component is now implemented with search, filtering, sorting, and pagination.
          It supports responsive design and works with any data type.
        </p>
      </div>
    </div>
  )
}