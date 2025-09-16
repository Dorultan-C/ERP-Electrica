'use client'

import React, { useState } from 'react'

interface NotificationButtonProps {
  count?: number
  onClick?: () => void
}

export default function NotificationButton({ count = 0, onClick }: NotificationButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
    onClick?.()
  }

  const handleMarkAllAsRead = () => {
    // TODO: Implement mark all as read functionality
    console.log('Mark all notifications as read')
    setIsDropdownOpen(false)
  }

  const handleShowAll = () => {
    // TODO: Navigate to full notifications page
    console.log('Show all notifications')
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={handleClick}
        className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>

        {/* Badge Counter */}
        {count > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px] h-[18px]">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h3>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                aria-label="Mark all as seen"
              >
                Mark all as seen
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {count > 0 ? (
                <>
                  {/* Sample Notifications */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New vacation request
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          John Doe has requested vacation from March 15-20
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Timesheet approved
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your timesheet for week 11 has been approved
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          5 hours ago
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          System maintenance
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Scheduled maintenance on Sunday at 2:00 AM
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    No new notifications
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {count > 3 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleShowAll}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                >
                  Show all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}