'use client'

import { useState, useEffect } from 'react'

export default function AppSettingsForm() {
  const [dateFormat, setDateFormat] = useState('')
  const [timeFormat, setTimeFormat] = useState('')
  const [currency, setCurrency] = useState('')
  const [language, setLanguage] = useState('')

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      const { dateFormat, timeFormat, currency, language } = JSON.parse(savedSettings)
      setDateFormat(dateFormat || 'MM/DD/YYYY')
      setTimeFormat(timeFormat || '12-hour')
      setCurrency(currency || 'USD')
      setLanguage(language || 'English')
    } else {
      setDateFormat('MM/DD/YYYY')
      setTimeFormat('12-hour')
      setCurrency('USD')
      setLanguage('English')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const settings = { dateFormat, timeFormat, currency, language }
    localStorage.setItem('appSettings', JSON.stringify(settings))
    alert('Settings saved!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
            <select
              id="dateFormat"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
            <select
              id="timeFormat"
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>12-hour</option>
              <option>24-hour</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
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
