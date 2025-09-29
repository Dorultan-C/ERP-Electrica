'use client'

import MainLayout from '@/components/layout/MainLayout'
import AppSettingsForm from '@/components/settings/AppSettingsForm'

export default function AppSettingsPage() {
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">App Settings</h1>
        <AppSettingsForm />
      </div>
    </MainLayout>
  )
}
