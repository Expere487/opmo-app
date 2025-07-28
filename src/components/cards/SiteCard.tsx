import {
  GlobeIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  Frame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Site } from '@/types/site'

interface SiteCardProps {
  site: Site
  onEdit: (site: Site) => void
  onDelete: (site: Site) => void
}

export default function SiteCard({ site, onEdit, onDelete }: SiteCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <GlobeIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {site.site_name || 'İsimsiz Site'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {site.site_url}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVerticalIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(site)}>
              <EditIcon size={16} className="mr-2" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(site)}
            >
              <TrashIcon size={16} className="mr-2" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Issues</span>
          <span className={`px-2 py-1 text-xs rounded-full ${site._count.issues === 0
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : site._count.issues < 5
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
            {site._count.issues} issue
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Oluşturulma</span>
          <span className="text-gray-900 dark:text-white">
            {new Date(site.created_at).toLocaleDateString('tr-TR')}
          </span>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => window.open(site.site_url || '', '_blank')}
          >
            <ExternalLinkIcon size={14} className="mr-1" />
            Ziyaret Et
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            asChild
          >
            <a href={`sites/${site.id}/design`} className="flex items-center">
              <Frame size={14} className="mr-1" />
              Tasarım
            </a>
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => window.location.href = `/sites/${site.id}/issues`}
          >
            Issues Görüntüle
          </Button>
        </div>
      </div>
    </div>
  )
}
