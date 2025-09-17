'use client'

import React from 'react'
import { getModuleTheme } from '@/lib/moduleThemes'
import { type Module } from '@/shared/types'

interface ModuleCardProps {
  module: Module
  onClick: (module: Module) => void
  index?: number
}

export default function ModuleCard({ module, onClick, index }: ModuleCardProps) {
  const theme = getModuleTheme(module.id)

  if (module.isComingSoon) {
    return (
      <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60 w-full h-[180px] justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-gray-400">
              {module.icon}
            </div>
          </div>
          <span className="text-sm font-medium text-gray-500 text-center">{module.title}</span>
          <span className="text-xs text-gray-400">Coming Soon</span>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => onClick(module)}
      className={`relative flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:shadow-blue-500/10 border border-gray-200 dark:border-gray-700 ${theme.border} ${theme.borderDark} transition-all duration-200 hover:scale-105 hover:-translate-y-1 group w-full h-[180px] justify-center ${module.isActive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
      disabled={!module.isActive}
    >
      {/* Number indicator */}
      {typeof index === 'number' && index < 9 && module.isActive && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full flex items-center justify-center opacity-60">
          {index + 1}
        </div>
      )}

      <div className="flex flex-col items-center space-y-3">
        <div className={`w-12 h-12 ${theme.bg} ${theme.bgDark} rounded-lg flex items-center justify-center ${theme.hoverBg} ${theme.hoverBgDark} transition-all duration-200 group-hover:scale-110`}>
          <div className={`${theme.text} ${theme.textDark} transition-transform duration-200 group-hover:scale-110`}>
            {module.icon}
          </div>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200 text-center">{module.title}</span>
        {module.description && (
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300 px-1 leading-relaxed">{module.description}</span>
        )}
      </div>
    </button>
  )
}