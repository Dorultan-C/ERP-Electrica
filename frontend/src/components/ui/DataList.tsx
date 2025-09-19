'use client'

import React, { useState, useMemo, useCallback } from 'react'

// Generic column definition for flexible data display
export interface DataListColumn<T> {
  id: string
  title: string
  accessor: keyof T | ((item: T) => any)
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: string
  render?: (value: any, item: T) => React.ReactNode
}

// Filter configuration
export interface DataListFilter {
  id: string
  title: string
  type: 'select' | 'text' | 'date' | 'status'
  options?: { value: string; label: string }[]
  placeholder?: string
}

// Sort configuration
export interface DataListSort {
  field: string
  direction: 'asc' | 'desc'
}

// Main component props
export interface DataListProps<T> {
  data: T[]
  columns: DataListColumn<T>[]
  filters?: DataListFilter[]
  searchable?: boolean
  searchPlaceholder?: string
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  emptyMessage?: string
  loading?: boolean
  onItemClick?: (item: T) => void
  onItemSelect?: (items: T[]) => void
  selectable?: boolean
  className?: string
}

export default function DataList<T extends { id: string }>({
  data,
  columns,
  filters = [],
  searchable = true,
  searchPlaceholder = "Search...",
  sortable = true,
  pagination = true,
  pageSize = 20,
  emptyMessage = "No items found",
  loading = false,
  onItemClick,
  onItemSelect,
  selectable = false,
  className = ""
}: DataListProps<T>) {
  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<DataListSort | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Helper function to get value from item using column accessor
  const getValue = useCallback((item: T, column: DataListColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item)
    }
    return item[column.accessor]
  }, [])

  // Search functionality
  const searchableColumns = useMemo(() =>
    columns.filter(col => col.searchable !== false),
    [columns]
  )

  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchQuery.trim() && searchableColumns.length > 0) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(item =>
        searchableColumns.some(column => {
          const value = getValue(item, column)
          return String(value).toLowerCase().includes(query)
        })
      )
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterId, filterValue]) => {
      if (filterValue) {
        const filter = filters.find(f => f.id === filterId)
        if (filter) {
          const column = columns.find(col => col.id === filterId)
          if (column) {
            result = result.filter(item => {
              const value = getValue(item, column)
              return String(value) === filterValue
            })
          }
        }
      }
    })

    return result
  }, [data, searchQuery, activeFilters, searchableColumns, getValue, filters, columns])

  // Sorting functionality
  const sortedData = useMemo(() => {
    if (!sort) return filteredData

    const column = columns.find(col => col.id === sort.field)
    if (!column) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = getValue(a, column)
      const bValue = getValue(b, column)

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return sort.direction === 'desc' ? -comparison : comparison
    })
  }, [filteredData, sort, columns, getValue])

  // Pagination
  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData

  // Sort handler
  const handleSort = useCallback((columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    if (!column?.sortable) return

    setSort(prevSort => {
      if (prevSort?.field === columnId) {
        if (prevSort.direction === 'asc') {
          return { field: columnId, direction: 'desc' }
        } else {
          return null // Remove sort
        }
      }
      return { field: columnId, direction: 'asc' }
    })
  }, [columns])

  // Filter handler
  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  // Selection handlers
  const handleItemSelect = useCallback((item: T, checked: boolean) => {
    const newSelection = new Set(selectedItems)
    if (checked) {
      newSelection.add(item.id)
    } else {
      newSelection.delete(item.id)
    }
    setSelectedItems(newSelection)

    if (onItemSelect) {
      const selectedData = data.filter(d => newSelection.has(d.id))
      onItemSelect(selectedData)
    }
  }, [selectedItems, onItemSelect, data])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(item => item.id))
      setSelectedItems(allIds)
      if (onItemSelect) {
        onItemSelect(paginatedData)
      }
    } else {
      setSelectedItems(new Set())
      if (onItemSelect) {
        onItemSelect([])
      }
    }
  }, [paginatedData, onItemSelect])

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {/* Header with search and filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          {searchable && (
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <div key={filter.id} className="min-w-0">
                  {filter.type === 'select' && filter.options && (
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    >
                      <option value="">{filter.title}</option>
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sort?.field === column.id && sort?.direction === 'asc'
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
                            sort?.field === column.id && sort?.direction === 'desc'
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
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    onItemClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onItemClick?.(item)}
                >
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleItemSelect(item, e.target.checked)
                        }}
                      />
                    </td>
                  )}
                  {columns.map(column => {
                    const value = getValue(item, column)
                    return (
                      <td
                        key={column.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                      >
                        {column.render ? column.render(value, item) : String(value)}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}