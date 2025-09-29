
'use client'

import { useState, ReactNode } from 'react'
import { DataList } from '@/components/ui/datalist'
import { DataListProps } from '@/components/ui/datalist/types'

interface CollapsibleDataListProps<T extends { id: string }> extends DataListProps<T> {
  title: string
  defaultOpen?: boolean
}

export function CollapsibleDataList<T extends { id: string }>({
  title,
  defaultOpen = true,
  ...dataListProps
}: CollapsibleDataListProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        className="w-full flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <svg
          className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <DataList {...dataListProps} />}
    </div>
  )
}
