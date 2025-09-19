'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/shared/hooks'
import { useNavigation } from '@/shared/contexts'
import { useAuth } from '@/shared/contexts'
import { sections } from '@/data/sections'
import { modules } from '@/data/modules'
import MainLayout from '../../components/layout/MainLayout'

export default function HRModulePage() {
  const router = useRouter()
  const { hasSectionAccess } = usePermissions()
  const { setSelectedModule } = useNavigation()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Don't run permission checks until authentication is loaded
    if (isLoading || !user) {
      return
    }

    // Set the HR module as selected immediately for UI consistency
    setSelectedModule('hr')

    // Get HR module sections
    const hrModule = modules.find(m => m.id === 'hr')
    if (!hrModule) {
      router.replace('/')
      return
    }

    // Get accessible sections for HR module
    const allHrSections = sections.filter(s => hrModule.sectionIds.includes(s.id) && s.isActive)
    const hrSections = allHrSections.filter(s => hasSectionAccess(s.id)).sort((a, b) => a.order - b.order)

    // Redirect immediately to first accessible section
    if (hrSections.length > 0) {
      const targetRoute = hrSections[0]!.route
      router.replace(targetRoute)
    } else {
      // No accessible sections, redirect to access denied
      router.replace('/access-denied')
    }
  }, [router, hasSectionAccess, setSelectedModule, isLoading, user])

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">
            Loading HR module...
          </div>
        </div>
      </div>
    </MainLayout>
  )
}