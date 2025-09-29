'use client'

import React from 'react'
import { DataListColumn } from '../types'

interface TableBodyProps<T = any> {
  data: T[]
  columns: DataListColumn<T>[]
  onRowClick?: ((data: T) => void) | undefined
}

export function TableBody<T extends { id: string }>({
  data,
  columns,
  onRowClick
}: TableBodyProps<T>) {
  const getColumnValue = (item: T, column: DataListColumn<T>) => {
    if (!item || !column.accessor) return ''

    if (typeof column.accessor === 'function') {
      return column.accessor(item)
    }

    return item[column.accessor]
  }

  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {data.map((item, index) => (
        <tr
          key={item?.id || index}
          className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
            onRowClick ? 'cursor-pointer' : ''
          }`}
          onClick={() => onRowClick?.(item)}
        >
          {columns.map((column) => {
            const value = getColumnValue(item, column)

            return (
              <td key={column.id} className={`px-6 py-4 whitespace-nowrap text-sm ${
                column.hideOnMobile ? 'hidden sm:table-cell' : ''
              }`}>
                {column.cell({ value, data: item, column })}
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
  )
}