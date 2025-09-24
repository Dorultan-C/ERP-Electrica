'use client'

import React from 'react'
import { DataListProps } from './types'
import { useDataList } from './utils/useDataList'
import { SearchBar } from './components/SearchBar'
import { FilterBar } from './components/FilterBar'
import { TableHeader } from './components/TableHeader'
import { TableBody } from './components/TableBody'
import { Pagination } from './components/Pagination'

export function DataList<T extends { id: string }>({
  data,
  columns,
  className = '',
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 20,
  onRowClick
}: DataListProps<T>) {
  const {
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
  } = useDataList({
    data,
    columns,
    searchable,
    filterable,
    sortable,
    pagination,
    pageSize
  })

  const filterableColumns = columns.filter(col => col.filterable)
  const hasFilters = filterableColumns.length > 0

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {/* Search and Filter Controls */}
      {(searchable || (filterable && hasFilters)) && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
          {searchable && (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {filterable && hasFilters && (
            <FilterBar
              columns={filterableColumns}
              activeFilters={activeFilters}
              setFilter={setFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader
            columns={columns}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            sortable={sortable}
          />
          <TableBody
            data={processedData}
            columns={columns}
            onRowClick={onRowClick}
          />
        </table>

        {/* Empty State */}
        {processedData.length === 0 && (
          <div className="text-center py-3">
            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-base font-medium text-gray-900 dark:text-white mb-1">No data found</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {hasActiveFilters || searchQuery ? 'Try adjusting your search or filters' : 'There are no items to display'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          totalItems={data.length}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}