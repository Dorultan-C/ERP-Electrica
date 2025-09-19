'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/shared/contexts'
import { getInitials, getAvatarColor, getAvatarTextColor } from '@/shared/utils'

interface ProfileDropdownProps {
  userName?: string
  userEmail?: string
  profileImage?: string
  onPersonalDetails?: () => void
  onSettings?: () => void
  onLogout?: () => void
}

export default function ProfileDropdown({
  userName,
  userEmail,
  profileImage,
  onPersonalDetails,
  onSettings,
  onLogout
}: ProfileDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { user, logout, isLoading } = useAuth()

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [user?.id])

  // If still loading auth, don't render anything yet
  if (isLoading) {
    return (
      <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    )
  }

  // Use auth user data if available, fallback to props
  const displayName = userName || (user ? `${user.firstName} ${user.lastName}` : "Unknown User")
  const displayEmail = userEmail || user?.email || ""
  const displayImage = profileImage || user?.profileImage

  // Don't show image if there's an error
  const shouldShowImage = displayImage && !imageError

  // Avatar utilities
  const initials = getInitials(displayName)
  const avatarColor = getAvatarColor(displayName)
  const avatarTextColor = getAvatarTextColor(displayName)

  // Avatar component for consistent rendering
  const Avatar = ({ size }: { size: 'small' | 'medium' | 'large' }) => {
    const sizeClasses = {
      small: 'w-9 h-9',
      medium: 'w-12 h-12',
      large: 'w-16 h-16'
    }

    const textSizeClasses = {
      small: 'text-xl font-medium',
      medium: 'text-3xl font-medium',
      large: 'text-4xl font-medium'
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}>
        {shouldShowImage ? (
          <img
            src={displayImage}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full ${avatarColor} flex items-center justify-center ${avatarTextColor} ${textSizeClasses[size]}`}>
            {initials}
          </div>
        )}
      </div>
    )
  }

  const handlePersonalDetails = () => {
    onPersonalDetails?.()
    setIsDropdownOpen(false)
  }

  const handleSettings = () => {
    onSettings?.()
    setIsDropdownOpen(false)
  }

  const handleLogout = () => {
    logout() // Use AuthContext logout
    onLogout?.()
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-9 rounded-md flex-shrink-0 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
        aria-label="Profile menu"
      >
        {/* Profile Image */}
        <Avatar size="small" />
      </button>

      {/* Profile Dropdown */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={() => setIsDropdownOpen(false)}
        />

        {/* Mobile Full Screen Overlay */}
        <div className={`fixed inset-0 z-50 bg-white dark:bg-gray-900 sm:hidden transition-opacity duration-300 ${
          isDropdownOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
            {/* Mobile Header */}
            <div className={`flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${
              isDropdownOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile
              </h3>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                aria-label="Close profile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile User Info */}
            <div className={`p-6 border-b border-gray-200 dark:border-gray-700 transition-all duration-400 delay-75 ${
              isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <div className="flex items-center space-x-4">
                <Avatar size="large" />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {displayName}
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className={`flex-1 p-4 transition-all duration-500 delay-150 ${
              isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="space-y-2">
                <button
                  onClick={handlePersonalDetails}
                  className="w-full flex items-center p-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors cursor-pointer touch-manipulation"
                >
                  <svg className="w-6 h-6 mr-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-base font-medium">Personal Details</span>
                </button>

                <button
                  onClick={handleSettings}
                  className="w-full flex items-center p-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors cursor-pointer touch-manipulation"
                >
                  <svg className="w-6 h-6 mr-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-base font-medium">Settings</span>
                </button>

                {/* Mobile Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-4 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 transition-colors cursor-pointer touch-manipulation"
                >
                  <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-base font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

        {/* Desktop Dropdown */}
        <div className={`hidden sm:block absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 origin-top-right ${
          isDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}>
            {/* Desktop User Info Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar size="medium" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Menu Items */}
            <div className="py-2">
              <button
                onClick={handlePersonalDetails}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Details
              </button>

              <button
                onClick={handleSettings}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>

              {/* Desktop Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
      </>
    </div>
  )
}