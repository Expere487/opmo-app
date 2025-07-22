import { Button } from '@/components/ui/button'
import { Site, SiteFormData } from '@/types/site'

interface EditSiteModalProps {
  isOpen: boolean
  site: Site | null
  formData: SiteFormData
  onFormChange: (data: SiteFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function EditSiteModal({ 
  isOpen, 
  site, 
  formData, 
  onFormChange, 
  onSubmit, 
  onClose 
}: EditSiteModalProps) {
  if (!isOpen || !site) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Site Düzenle
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Adı
            </label>
            <input
              type="text"
              value={formData.site_name}
              onChange={(e) => onFormChange({...formData, site_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Örn: Benim Websitem"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site URL'si
            </label>
            <input
              type="url"
              value={formData.site_url}
              onChange={(e) => onFormChange({...formData, site_url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ornekwebsite.com"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              İptal
            </Button>
            <Button type="submit" className="flex-1">
              Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 