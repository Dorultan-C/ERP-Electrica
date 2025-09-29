'use client'

import MainLayout from '@/components/layout/MainLayout'
import CompanySettingsForm from '@/components/settings/CompanySettingsForm'

export default function CompanySettingsPage() {
  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Company Settings</h1>
        <CompanySettingsForm />
      </div>
    </MainLayout>
  )
}
