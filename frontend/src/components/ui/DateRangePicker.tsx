'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

export interface DateRange {
  start: Date
  end: Date
}

export interface DateRangePickerProps {
  value?: DateRange | null
  onChange: (dateRange: DateRange | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const WEEKDAYS = [
  { short: 'M', full: 'Monday' },
  { short: 'T', full: 'Tuesday' },
  { short: 'W', full: 'Wednesday' },
  { short: 'T', full: 'Thursday' },
  { short: 'F', full: 'Friday' },
  { short: 'S', full: 'Saturday' },
  { short: 'S', full: 'Sunday' }
]

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select date range",
  className = "",
  disabled = false
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth())
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear())
  const [selectionStart, setSelectionStart] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectionStart(null)
        setHoverDate(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Format display text
  const getDisplayText = useCallback(() => {
    if (!value) return placeholder

    const { start, end } = value
    const valueWithToPresent = value as DateRange & { isToPresent?: boolean }

    // Check for "to present" selection
    if (valueWithToPresent.isToPresent) {
      const formatDate = (date: Date) =>
        `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      return `${formatDate(start)} - present`
    }

    // Check if it's a full month
    const startOfMonth = new Date(start.getFullYear(), start.getMonth(), 1)
    const endOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0)

    if (start.getTime() === startOfMonth.getTime() &&
        end.getTime() === endOfMonth.getTime()) {
      return `${MONTHS[start.getMonth()]} ${start.getFullYear()}`
    }

    // Custom range format
    const formatDate = (date: Date) =>
      `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`

    if (start.getTime() === end.getTime()) {
      return formatDate(start)
    }

    return `${formatDate(start)} - ${formatDate(end)}`
  }, [value, placeholder])

  // Get days in month
  const getDaysInMonth = useCallback(() => {
    const year = displayYear
    const month = displayMonth
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Convert Sunday=0 to Monday=0 format
    // Sunday (0) becomes 6, Monday (1) becomes 0, etc.
    const startDayOfWeek = (firstDay.getDay() + 6) % 7

    const days: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [displayYear, displayMonth])

  // Handle date click
  const handleDateClick = useCallback((date: Date) => {
    if (!selectionStart) {
      // First click - set start date
      setSelectionStart(date)
      setHoverDate(null)
    } else {
      // Second click - complete selection
      const start = selectionStart < date ? selectionStart : date
      const end = selectionStart < date ? date : selectionStart

      onChange({ start, end })
      setSelectionStart(null)
      setHoverDate(null)
      setIsOpen(false)
    }
  }, [selectionStart, onChange])

  // Clear selection when dropdown opens if there's an existing range
  useEffect(() => {
    if (isOpen && value) {
      // Reset selection state when opening with existing value
      setSelectionStart(null)
      setHoverDate(null)
    }
  }, [isOpen, value])

  // Handle whole month selection
  const handleWholeMonth = useCallback(() => {
    const start = new Date(displayYear, displayMonth, 1)
    const end = new Date(displayYear, displayMonth + 1, 0)

    onChange({ start, end })
    setSelectionStart(null)
    setHoverDate(null)
    setIsOpen(false)
  }, [displayYear, displayMonth, onChange])

  // Handle "To Present" selection
  const handleToToday = useCallback(() => {
    if (!selectionStart) return

    const today = new Date()
    const start = selectionStart
    const end = start <= today ? today : start

    // Mark this as a "to present" selection
    const rangeWithToPresent = {
      start,
      end,
      isToPresent: true
    } as DateRange & { isToPresent?: boolean }

    onChange(rangeWithToPresent)
    setSelectionStart(null)
    setHoverDate(null)
    setIsOpen(false)
  }, [selectionStart, onChange])

  // Handle today button
  const handleToday = useCallback(() => {
    const today = new Date()
    setDisplayYear(today.getFullYear())
    setDisplayMonth(today.getMonth())
  }, [])

  // Handle clear
  const handleClear = useCallback(() => {
    onChange(null)
    setSelectionStart(null)
    setHoverDate(null)
  }, [onChange])

  // Navigation handlers
  const handlePrevYear = () => setDisplayYear(prev => prev - 1)
  const handleNextYear = () => setDisplayYear(prev => prev + 1)
  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(prev => prev - 1)
    } else {
      setDisplayMonth(prev => prev - 1)
    }
  }
  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(prev => prev + 1)
    } else {
      setDisplayMonth(prev => prev + 1)
    }
  }

  // Check if date is in range (only show existing range if not actively selecting)
  const isDateInRange = useCallback((date: Date) => {
    if (selectionStart || !value) return false
    return date >= value.start && date <= value.end
  }, [value, selectionStart])

  // Check if date is start or end
  const isDateStart = useCallback((date: Date) => {
    // Check if it's the current selection start
    if (selectionStart && date.getTime() === selectionStart.getTime()) return true
    // Check if it's the existing value start (only when not actively selecting)
    if (!selectionStart && value && date.getTime() === value.start.getTime()) return true
    return false
  }, [value, selectionStart])

  const isDateEnd = useCallback((date: Date) => {
    // Only show existing value end when not actively selecting
    if (selectionStart) return false
    return value && date.getTime() === value.end.getTime()
  }, [value, selectionStart])

  // Check if date is in hover range
  const isDateInHoverRange = useCallback((date: Date) => {
    if (!selectionStart || !hoverDate) return false
    const start = selectionStart < hoverDate ? selectionStart : hoverDate
    const end = selectionStart < hoverDate ? hoverDate : selectionStart
    return date >= start && date <= end
  }, [selectionStart, hoverDate])

  // Check if date is today
  const isToday = useCallback((date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer'
        }`}
      >
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {getDisplayText()}
          </span>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 sm:p-4 w-[calc(100vw-2rem)] max-w-80 sm:w-80 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevYear} className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-medium text-gray-900 dark:text-white min-w-[4rem] text-center">
                {displayYear}
              </span>
              <button onClick={handleNextYear} className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={handlePrevMonth} className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="font-medium text-gray-900 dark:text-white min-w-[5rem] text-center">
                {MONTHS[displayMonth]}
              </span>
              <button onClick={handleNextMonth} className="p-1.5 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {/* Weekday headers */}
            {WEEKDAYS.map((day, index) => (
              <div key={`${day.full}-${index}`} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                {day.short}
              </div>
            ))}

            {/* Calendar days */}
            {getDaysInMonth().map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8" />
              }

              const isSelected = isDateStart(date) || isDateEnd(date)
              const isInRange = isDateInRange(date)
              const isInHoverRange = isDateInHoverRange(date)
              const isTodayDate = isToday(date)
              const isDisabled = selectionStart ? date < selectionStart : false

              return (
                <button
                  key={date.getTime()}
                  onClick={() => !isDisabled && handleDateClick(date)}
                  onMouseEnter={() => selectionStart && !isDisabled && setHoverDate(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={isDisabled}
                  className={`h-8 sm:h-8 min-h-[2.5rem] sm:min-h-0 flex items-center justify-center text-sm rounded transition-colors touch-manipulation ${
                    isDisabled
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer active:bg-blue-800'
                      : isInRange || isInHoverRange
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer active:bg-blue-300'
                      : isTodayDate
                      ? 'border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer active:bg-blue-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer active:bg-gray-200'
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Action Button */}
          {selectionStart ? (
            <button
              onClick={handleToToday}
              disabled={selectionStart > new Date()}
              className={`w-full py-2 mb-3 text-sm font-medium rounded transition-colors ${
                selectionStart > new Date()
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer'
              }`}
            >
              To Present
            </button>
          ) : (
            <button
              onClick={handleWholeMonth}
              className="w-full py-2 mb-3 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Select Whole Month
            </button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
              <button
                onClick={handleToday}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
              >
                Today
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClear}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}