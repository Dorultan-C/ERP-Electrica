
interface SectionHeaderProps {
  title: string
  description: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  )
}
