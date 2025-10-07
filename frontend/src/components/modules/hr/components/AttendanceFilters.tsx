'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { DateRangePicker, type DateRange } from '@/components/ui/DateRangePicker'
import { Avatar } from '@/components/ui/Avatar'
import { getUserStatusTextColor, getUserStatusLabel } from '@/shared/utils'
import { DROPDOWN_BLUR_DELAY } from '@/shared/constants/attendance'
import type { User } from '@/shared/types'

interface AttendanceFiltersProps {
  selectedUser: User | null
  dateRange: DateRange | null
  canReadOthers: boolean
  currentUser: User | null
  availableUsers: User[]
  onUserSelect: (user: User) => void
  onUserRemove: () => void
  onDateRangeChange: (dateRange: DateRange | null) => void
  onCreateTimesheet?: () => void
}

export function AttendanceFilters({
  selectedUser,
  dateRange,
  canReadOthers,
  currentUser,
  availableUsers,
  onUserSelect,
  onUserRemove,
  onDateRangeChange,
  onCreateTimesheet
}: AttendanceFiltersProps) {
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    let filteredList: User[]
    if (!userSearchQuery.trim()) {
      filteredList = availableUsers
    } else {
      const searchTerm = userSearchQuery.toLowerCase().trim()
      filteredList = availableUsers.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      )
    }

    // Put current user at the top of the list if they're in the filtered results
    if (currentUser && canReadOthers) {
      const currentUserInList = filteredList.find(user => user.id === currentUser.id)
      if (currentUserInList) {
        const otherUsers = filteredList.filter(user => user.id !== currentUser.id)
        return [currentUserInList, ...otherUsers]
      }
    }

    return filteredList
  }, [userSearchQuery, availableUsers, currentUser, canReadOthers])

  const handleUserSelect = useCallback((user: User) => {
    onUserSelect(user)
    setShowUserDropdown(false)
    setUserSearchQuery('')
  }, [onUserSelect])

  const handleUserInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedUser) {
      // If user is selected and they start typing, clear selection and use their input
      onUserRemove()
      setUserSearchQuery(e.target.value)
    } else {
      setUserSearchQuery(e.target.value)
    }
  }, [selectedUser, onUserRemove])

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="grid sm:grid-cols-[1fr_1fr_auto] grid-cols-1 gap-4">
        {/* User Selection - only show dropdown if user can read others' attendance */}
        {canReadOthers && (
          <div>
            {/* User Search Dropdown */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : userSearchQuery}
                  onChange={handleUserInputChange}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), DROPDOWN_BLUR_DELAY)}
                  className="whitespace-nowrap w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {selectedUser && (
                  <button
                    onClick={onUserRemove}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                    aria-label="Clear selected employee"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {showUserDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => {
                      const isCurrentUser = user.id === currentUser?.id
                      const isSelected = selectedUser?.id === user.id

                      return (
                        <button
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className={`w-full text-left px-3 py-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/50'
                              : isCurrentUser
                              ? 'bg-green-50 dark:bg-green-900/20 border-l-2 border-green-500'
                              : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar
                              src={user.profileImage}
                              name={`${user.firstName} ${user.lastName}`}
                              size="sm"
                              className="flex-shrink-0"
                            />
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="flex items-center">
                                <span className={`inline-flex items-center text-xs font-medium ${getUserStatusTextColor(user.status)}`}>
                                  {getUserStatusLabel(user.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isCurrentUser && !isSelected && (
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">(You)</span>
                            )}
                            {isSelected && (
                              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm text-center">
                      No employees found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Date Range Selection */}
        <div>
          <DateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Select date range"
          />
        </div>

        {/* Create Timesheet Button */}
        {selectedUser && onCreateTimesheet && (
          <div className="flex justify-end">
            <button
              onClick={onCreateTimesheet}
              className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className='sm:hidden lg:flex ml-2'>New Timesheet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}