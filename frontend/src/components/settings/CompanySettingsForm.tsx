'use client'

import { useState, useEffect } from 'react'

export default function CompanySettingsForm() {
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')

  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings')
    if (savedSettings) {
      const { companyName, companyAddress, companyPhone, companyEmail, companyWebsite } = JSON.parse(savedSettings)
      setCompanyName(companyName || 'J.G. Electrica Industrial S.L.')
      setCompanyAddress(companyAddress || '123 Main St, Anytown, USA')
      setCompanyPhone(companyPhone || '555-123-4567')
      setCompanyEmail(companyEmail || 'contact@jgelectrica.com')
      setCompanyWebsite(companyWebsite || 'https://jgelectrica.com')
    } else {
      setCompanyName('J.G. Electrica Industrial S.L.')
      setCompanyAddress('123 Main St, Anytown, USA')
      setCompanyPhone('555-123-4567')
      setCompanyEmail('contact@jgelectrica.com')
      setCompanyWebsite('https://jgelectrica.com')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const settings = { companyName, companyAddress, companyPhone, companyEmail, companyWebsite }
    localStorage.setItem('companySettings', JSON.stringify(settings))
    alert('Settings saved!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Address</label>
            <input
              type="text"
              id="companyAddress"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Phone</label>
            <input
              type="text"
              id="companyPhone"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Email</label>
            <input
              type="email"
              id="companyEmail"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Website</label>
            <input
              type="url"
              id="companyWebsite"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <svg className="h-full w-full text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <button type="button" className="ml-5 bg-white dark:bg-gray-800 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="button" className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  )
}
