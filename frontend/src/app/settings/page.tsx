'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/shared/hooks'
import { useNavigation } from '@/shared/contexts'
import { useAuth } from '@/shared/contexts'
import { sections } from '@/data/sections'
import { modules } from '@/data/modules'
import MainLayout from '../../components/layout/MainLayout'

export default function SettingsModulePage() {
  const router = useRouter()
  const { hasSectionAccess } = usePermissions()
  const { setSelectedModule } = useNavigation()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading || !user) {
      return
    }

    setSelectedModule('settings')

    const settingsModule = modules.find(m => m.id === 'settings')
    if (!settingsModule) {
      router.replace('/')
      return
    }

    const allSettingsSections = sections.filter(s => settingsModule.sectionIds.includes(s.id) && s.isActive)
    const settingsSections = allSettingsSections.filter(s => hasSectionAccess(s.id)).sort((a, b) => a.order - b.order)

    if (settingsSections.length > 0) {
      const targetRoute = settingsSections[0]!.route
      router.replace(targetRoute)
    } else {
      router.replace('/access-denied')
    }
  }, [router, hasSectionAccess, setSelectedModule, isLoading, user])

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">
            Loading Settings module...
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
