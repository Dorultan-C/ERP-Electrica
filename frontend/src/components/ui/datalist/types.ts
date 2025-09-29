import { ReactNode } from 'react'

export interface DataListCellProps<T = any> {
  value: any
  data: T
  column: DataListColumn<T>
}

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  type: 'text' | 'select' | 'daterange'
  options?: FilterOption[]
  placeholder?: string
}

export interface DataListColumn<T = any> {
  id: string
  header: string
  accessor?: keyof T | ((data: T) => any)
  width?: string
  sortable?: boolean
  searchable?: boolean
  filterable?: FilterConfig
  cell: (props: DataListCellProps<T>) => ReactNode
  hideOnMobile?: boolean
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface DataListProps<T = any> {
  data: T[]
  columns: DataListColumn<T>[]
  className?: string
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  onRowClick?: (data: T) => void
  loading?: boolean
}

export interface UseDataListOptions<T = any> {
  data: T[]
  columns: DataListColumn<T>[]
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
}

export interface UseDataListReturn<T = any> {
  processedData: T[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeFilters: Record<string, any>
  setFilter: (key: string, value: any) => void
  clearFilters: () => void
  sortConfig: SortConfig | null
  setSortConfig: (config: SortConfig | null) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  hasActiveFilters: boolean
}