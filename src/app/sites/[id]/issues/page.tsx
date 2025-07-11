"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  ArrowLeftIcon, 
  AlertTriangleIcon, 
  ExternalLinkIcon, 
  CalendarIcon,
  UserIcon,
  GlobeIcon,
  FilterIcon,
  SearchIcon,
  ActivityIcon,
  ServerIcon,
  EyeIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Issue {
  id: number
  status: string
  priority: string
  description: string
  contact_email?: string
  url: string
  user_agent?: string
  viewport?: string
  created_at: string
}

interface Site {
  id: number
  site_name: string | null
  site_url: string | null
  created_at: string
  issues: Issue[]
  _count: {
    issues: number
  }
}

export default function SiteIssuesPage() {
  const params = useParams()
  const siteId = params.id as string
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Site ve issues'ları getir
  const fetchSite = async () => {
    try {
      const response = await fetch(`/api/sites/${siteId}`)
      if (response.ok) {
        const data = await response.json()
        setSite(data)
      }
    } catch (error) {
      console.error('Site getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (siteId) {
      fetchSite()
    }
  }, [siteId])

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="flex-1 p-4 lg:p-8">
        <div className="text-center py-12">
          <AlertTriangleIcon size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Site bulunamadı
          </h3>
          <Button onClick={() => window.history.back()}>
            <ArrowLeftIcon size={16} className="mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    )
  }

  // Filtreleme
  const filteredIssues = site.issues.filter(issue => {
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Status renkleri
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'wont_fix': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // Priority renkleri
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-6 hidden lg:block">
        <nav className="space-y-2">
          <a href="/" className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2">
            <ActivityIcon size={16} />
            <span>Overview</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2">
            <ServerIcon size={16} />
            <span>Projects</span>
          </a>
          <a href="/sites" className="flex items-center space-x-3 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
            <GlobeIcon size={16} />
            <span>Websites</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Geri Dön
        </Button>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <GlobeIcon size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {site.site_name || 'İsimsiz Site'}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span>{site.site_url}</span>
              <span>•</span>
              <span>{site._count.issues} issue</span>
              <span>•</span>
              <span>Oluşturulma: {new Date(site.created_at).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(site.site_url || '', '_blank')}
          >
            <ExternalLinkIcon size={14} className="mr-1" />
            Siteyi Ziyaret Et
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Issue ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="new">Yeni</option>
          <option value="in_progress">İşlemde</option>
          <option value="resolved">Çözüldü</option>
          <option value="wont_fix">Düzeltilmeyecek</option>
        </select>
      </div>

      {/* Issues List */}
      {filteredIssues.length > 0 ? (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status === 'new' ? 'Yeni' :
                       issue.status === 'in_progress' ? 'İşlemde' :
                       issue.status === 'resolved' ? 'Çözüldü' :
                       issue.status === 'wont_fix' ? 'Düzeltilmeyecek' : issue.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority === 'critical' ? 'Kritik' :
                       issue.priority === 'high' ? 'Yüksek' :
                       issue.priority === 'medium' ? 'Orta' :
                       issue.priority === 'low' ? 'Düşük' : issue.priority}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    {issue.description}
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span>URL: {issue.url}</span>
                      {issue.contact_email && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <UserIcon size={14} className="mr-1" />
                            {issue.contact_email}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <CalendarIcon size={14} className="mr-1" />
                        {new Date(issue.created_at).toLocaleString('tr-TR')}
                      </span>
                      {issue.viewport && (
                        <>
                          <span>•</span>
                          <span>Viewport: {issue.viewport}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.location.href = `/sites/${siteId}/issues/${issue.id}`}
                  >
                    <EyeIcon size={14} className="mr-1" />
                    Detayları Görüntüle
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangleIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedStatus !== 'all' ? 'Filtre kriterleriyle eşleşen issue bulunamadı' : 'Henüz issue yok'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {searchTerm || selectedStatus !== 'all' ? 'Farklı filtreler deneyin' : 'Bu site için henüz herhangi bir issue rapor edilmemiş.'}
          </p>
          {(searchTerm || selectedStatus !== 'all') && (
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedStatus('all')
            }}>
              Filtreleri Temizle
            </Button>
          )}
                 </div>
       )}
      </main>
    </div>
  )
} 