export interface ModuleTheme {
  bg: string
  bgDark: string
  text: string
  textDark: string
  hoverBg: string
  hoverBgDark: string
  border: string
  borderDark: string
}

export const moduleThemes: Record<string, ModuleTheme> = {
  hr: {
    bg: 'bg-green-100',
    bgDark: 'dark:bg-green-900',
    text: 'text-green-600',
    textDark: 'dark:text-green-400',
    hoverBg: 'group-hover:bg-green-200',
    hoverBgDark: 'dark:group-hover:bg-green-800',
    border: 'hover:border-green-300',
    borderDark: 'dark:hover:border-green-600'
  },
  settings: {
    bg: 'bg-purple-100',
    bgDark: 'dark:bg-purple-900',
    text: 'text-purple-600',
    textDark: 'dark:text-purple-400',
    hoverBg: 'group-hover:bg-purple-200',
    hoverBgDark: 'dark:group-hover:bg-purple-800',
    border: 'hover:border-purple-300',
    borderDark: 'dark:hover:border-purple-600'
  }
}

export const defaultTheme: ModuleTheme = {
  bg: 'bg-gray-100',
  bgDark: 'dark:bg-gray-700',
  text: 'text-gray-600',
  textDark: 'dark:text-gray-400',
  hoverBg: 'group-hover:bg-gray-200',
  hoverBgDark: 'dark:group-hover:bg-gray-600',
  border: 'hover:border-gray-300',
  borderDark: 'dark:hover:border-gray-600'
}

export function getModuleTheme(moduleId: string): ModuleTheme {
  return moduleThemes[moduleId] || defaultTheme
}