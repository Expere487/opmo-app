import { SearchIcon, FilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SiteFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function SiteFilters({ searchTerm, onSearchChange }: SiteFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Site ara..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <Button variant="outline" className="flex items-center space-x-2">
        <FilterIcon size={16} />
        <span>Filtrele</span>
      </Button>
    </div>
  )
} 