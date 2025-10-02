"use client";

import React, { useState, useRef, useEffect } from "react";
import { DrawerStackItem } from "@/shared/contexts/DrawerContext";

interface BreadcrumbsProps {
  stack: DrawerStackItem[];
  onNavigateToIndex: (index: number) => void;
}

export function Breadcrumbs({ stack, onNavigateToIndex }: BreadcrumbsProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Check if breadcrumbs are overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const isOverflow =
          containerRef.current.scrollWidth > containerRef.current.clientWidth;
        setIsOverflowing(isOverflow || stack.length > 3);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [stack]);

  // Only show breadcrumbs if there are 2+ items in the stack
  if (stack.length <= 1) return null;

  const renderBreadcrumb = (
    item: DrawerStackItem,
    index: number,
    isLast: boolean
  ) => {
    const isClickable = !isLast;

    return (
      <React.Fragment key={`${item.type}-${item.id}-${index}`}>
        {index > 0 && (
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}

        {isClickable ? (
          <button
            onClick={() => onNavigateToIndex(index)}
            className="btn-small text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:underline transition-colors truncate max-w-[120px] sm:max-w-[150px] cursor-pointer"
            title={item.title}
          >
            {item.title}
          </button>
        ) : (
          <span
            className="text-gray-900 dark:text-white font-medium truncate max-w-[120px] sm:max-w-[180px]"
            title={item.title}
          >
            {item.title}
          </span>
        )}
      </React.Fragment>
    );
  };

  // Compact mode: show first, ..., and last 2 items
  if (isOverflowing && stack.length > 3) {
    const first = stack[0]!;
    const lastTwo = stack.slice(-2);
    const hiddenCount = stack.length - 3;
    const hiddenItems = stack.slice(1, -2);

    return (
      <nav className="flex items-center space-x-1 text-sm" ref={containerRef}>
        {/* First item */}
        {renderBreadcrumb(first, 0, false)}

        {/* Separator */}
        <svg
          className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>

        {/* Dropdown for hidden items */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title={`${hiddenCount} more item${hiddenCount > 1 ? "s" : ""}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1 min-w-[200px] max-w-[300px]">
              {hiddenItems.map((item, idx) => (
                <button
                  key={`${item.type}-${item.id}-hidden`}
                  onClick={() => {
                    onNavigateToIndex(idx + 1);
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate"
                  title={item.title}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Last two items */}
        {lastTwo.map((item, idx) =>
          renderBreadcrumb(
            item,
            stack.length - 2 + idx,
            idx === lastTwo.length - 1
          )
        )}
      </nav>
    );
  }

  // Normal mode: show all items
  return (
    <nav
      className="flex items-center space-x-1 text-sm overflow-hidden"
      ref={containerRef}
    >
      {stack.map((item, index) =>
        renderBreadcrumb(item, index, index === stack.length - 1)
      )}
    </nav>
  );
}
