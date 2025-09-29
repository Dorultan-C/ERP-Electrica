'use client'

import React from 'react'
import { DataListColumn, SortConfig } from '../types'

interface TableHeaderProps<T = any> {
  columns: DataListColumn<T>[]
  sortConfig: SortConfig | null
  setSortConfig: (config: SortConfig | null) => void
  sortable: boolean
}

export function TableHeader<T>({
  columns,
  sortConfig,
  setSortConfig,
  sortable
}: TableHeaderProps<T>) {
  const handleSort = (column: DataListColumn<T>) => {
    if (!sortable || !column.sortable) return

    if (sortConfig?.key === column.id) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key: column.id, direction: 'desc' })
      } else {
        setSortConfig(null)
      }
    } else {
      setSortConfig({ key: column.id, direction: 'asc' })
    }
  }

  return (
    <thead className="bg-gray-50 dark:bg-gray-900">
      <tr>
        {columns.map((column) => {
          const isSorted = sortConfig?.key === column.id
          const canSort = sortable && column.sortable

          return (
            <th
              key={column.id}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                canSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
              } ${
                column.hideOnMobile ? 'hidden sm:table-cell' : ''
              }`}
              style={{ width: column.width }}
              onClick={() => handleSort(column)}
            >
              <div className="flex items-center space-x-1">
                <span>{column.header}</span>
                {canSort && (
                  <div className="flex flex-col">
                    <svg
                      className={`w-3 h-3 ${
                        isSorted && sortConfig?.direction === 'asc'
                          ? 'text-blue-600'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <svg
                      className={`w-3 h-3 -mt-1 ${
                        isSorted && sortConfig?.direction === 'desc'
                          ? 'text-blue-600'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      style={{ transform: 'rotate(180deg)' }}
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}