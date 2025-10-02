'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface AccessDeniedProps {
  title?: string
  message?: string
  showGoBack?: boolean
  showGoHome?: boolean
}

export default function AccessDenied({
  title = "Access Denied",
  message = "You don't have permission to access this page. If you believe this is an error, please contact your administrator.",
  showGoBack = true,
  showGoHome = true
}: AccessDeniedProps) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        {/* Actions */}
        {(showGoHome || showGoBack) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showGoHome && (
              <button
                onClick={handleGoHome}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Homepage
              </button>
            )}
            {showGoBack && (
              <button
                onClick={handleGoBack}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}