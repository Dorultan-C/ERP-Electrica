'use client'

import React, { useState } from 'react'
import { DataListColumn } from '../types'

interface FilterBarProps<T = any> {
  columns: DataListColumn<T>[]
  activeFilters: Record<string, any>
  setFilter: (key: string, value: any) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

export function FilterBar<T>({
  columns,
  activeFilters,
  setFilter,
  clearFilters,
  hasActiveFilters
}: FilterBarProps<T>) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-3">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`px-3 py-2 border rounded-md transition-colors duration-200 flex items-center gap-2 ${
            hasActiveFilters || expanded
              ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(activeFilters).filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expandable Filters */}
      {expanded && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {columns.map((column) => (
              <FilterControl
                key={column.id}
                column={column}
                value={activeFilters[column.id] || ''}
                onChange={(value) => setFilter(column.id, value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FilterControlProps<T = any> {
  column: DataListColumn<T>
  value: any
  onChange: (value: any) => void
}

function FilterControl<T>({ column, value, onChange }: FilterControlProps<T>) {
  if (!column.filterable) return null

  if (column.filterable.type === 'select') {
    return (
      <select
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{column.header}</option>
        {column.filterable.options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  if (column.filterable.type === 'text') {
    return (
      <input
        type="text"
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={column.filterable.placeholder || column.header}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  }

  return null
}