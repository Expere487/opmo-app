import { GlobeIcon, PlusIcon, UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type: 'no-team' | 'no-sites'
  onAddSite?: () => void
}

export default function EmptyState({ type, onAddSite }: EmptyStateProps) {
  if (type === 'no-team') {
    return (
      <div className="text-center py-12">
        <UsersIcon size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Team Seçiniz
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Site listesini görüntülemek için navbar'dan bir team seçin
        </p>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <GlobeIcon size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Henüz site yok
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        İlk web sitenizi ekleyerek başlayın
      </p>
      <Button onClick={onAddSite}>
        <PlusIcon size={16} className="mr-2" />
        İlk Siteyi Ekle
      </Button>
    </div>
  )
} 