import { PlusIcon, GlobeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SiteHeaderProps {
  onAddSite: () => void
}

export default function SiteHeader({ onAddSite }: SiteHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <GlobeIcon size={32} className="text-blue-600" />
          Web Siteleri
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm lg:text-base">
          Takip ettiğiniz web sitelerini yönetin
        </p>
      </div>
      <Button 
        onClick={onAddSite}
        className="flex items-center space-x-2 w-full sm:w-auto"
      >
        <PlusIcon size={16} />
        <span>Yeni Site Ekle</span>
      </Button>
    </div>
  )
} 