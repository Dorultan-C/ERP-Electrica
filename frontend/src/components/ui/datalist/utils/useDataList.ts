import { useMemo, useState } from 'react'
import { UseDataListOptions, UseDataListReturn, SortConfig } from '../types'

export function useDataList<T extends { id: string }>({
  data,
  columns,
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 20
}: UseDataListOptions<T>): UseDataListReturn<T> {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const setFilter = (key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setActiveFilters({})
    setCurrentPage(1)
  }

  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchable && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const searchableColumns = columns.filter(col => col.searchable)

      result = result.filter(item =>
        searchableColumns.some(column => {
          const value = getColumnValue(item, column)
          return String(value).toLowerCase().includes(query)
        })
      )
    }

    // Apply filters
    if (filterable) {
      Object.entries(activeFilters).forEach(([key, filterValue]) => {
        if (filterValue) {
          const column = columns.find(col => col.id === key)
          if (column) {
            result = result.filter(item => {
              const value = getColumnValue(item, column)
              return String(value) === String(filterValue)
            })
          }
        }
      })
    }

    // Apply sorting
    if (sortable && sortConfig) {
      const column = columns.find(col => col.id === sortConfig.key)
      if (column) {
        result.sort((a, b) => {
          const aValue = getColumnValue(a, column)
          const bValue = getColumnValue(b, column)

          let comparison = 0
          if (aValue < bValue) comparison = -1
          if (aValue > bValue) comparison = 1

          return sortConfig.direction === 'desc' ? -comparison : comparison
        })
      }
    }

    // Apply pagination
    if (pagination) {
      const startIndex = (currentPage - 1) * pageSize
      result = result.slice(startIndex, startIndex + pageSize)
    }

    return result
  }, [data, columns, searchQuery, activeFilters, sortConfig, currentPage, pageSize, searchable, filterable, sortable, pagination])

  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1
  const hasActiveFilters = Object.values(activeFilters).some(value => value)

  return {
    processedData,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    clearFilters,
    sortConfig,
    setSortConfig,
    currentPage,
    setCurrentPage,
    totalPages,
    hasActiveFilters
  }
}

function getColumnValue<T>(item: T, column: { accessor?: keyof T | ((data: T) => any) }) {
  if (!column.accessor) return ''

  if (typeof column.accessor === 'function') {
    return column.accessor(item)
  }

  return item[column.accessor]
}