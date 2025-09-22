'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/contexts'
import { usePermissions } from '@/shared/hooks'
import MainLayout from '../../../components/layout/MainLayout'
import HRAttendanceSection from '../../../components/modules/hr/sections/HRAttendanceSection'

export default function HRAttendancePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { hasSectionAccess } = usePermissions()

  useEffect(() => {
    // Don't check permissions until auth is loaded
    if (isLoading) return

    // Redirect if not authenticated or no access to attendance section
    if (!user || !hasSectionAccess('attendance')) {
      router.replace('/access-denied')
      return
    }
  }, [user, isLoading, hasSectionAccess, router])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400">
              Loading...
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Show loading while redirecting if no access
  if (!user || !hasSectionAccess('attendance')) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400">
              Redirecting...
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <HRAttendanceSection />
    </MainLayout>
  )
}