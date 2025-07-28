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
import SiteDetailHeader from '@/components/sites/SiteDetailHeader'
import IssueCard from '@/components/cards/IssueCard'

export interface Issue {
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


  return (
    <div className="flex min-h-screen">

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
      {/* Header */}
      <SiteDetailHeader site={site} />

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
            <IssueCard key={issue.id} issue={issue} siteId={siteId as string} />
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