import { GlobeIcon, AlertTriangleIcon, TrendingUpIcon } from 'lucide-react'

interface SiteStatsCardsProps {
  totalSites: number
  totalIssues: number
  activeSites: number
}

export default function SiteStatsCards({ totalSites, totalIssues, activeSites }: SiteStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Siteler</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSites}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <GlobeIcon size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Issues</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalIssues}</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
            <AlertTriangleIcon size={20} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Siteler</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeSites}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <TrendingUpIcon size={20} className="text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>
  )
} 