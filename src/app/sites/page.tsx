"use client"

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  GlobeIcon, 
  ExternalLinkIcon, 
  CalendarIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  MenuIcon,
  ActivityIcon,
  ServerIcon,
  GitBranchIcon,
  UsersIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Site {
  id: number
  site_name: string | null
  site_url: string | null
  created_at: string
  _count: {
    issues: number
  }
  issues: Array<{
    id: number
    status: string
    priority: string
  }>
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [newSite, setNewSite] = useState({
    site_name: '',
    site_url: ''
  })
  const [editSite, setEditSite] = useState({
    site_name: '',
    site_url: ''
  })

  // Sites'ları getir
  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites')
      if (response.ok) {
        const data = await response.json()
        setSites(data)
      }
    } catch (error) {
      console.error('Sites getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  // Yeni site ekle
  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newSite.site_name || !newSite.site_url) return

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSite),
      })

      if (response.ok) {
        setNewSite({ site_name: '', site_url: '' })
        setShowAddModal(false)
        fetchSites()
      }
    } catch (error) {
      console.error('Site ekleme hatası:', error)
    }
  }

  // Site düzenle
  const handleEditSite = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSite || !editSite.site_name || !editSite.site_url) return

    try {
      const response = await fetch(`/api/sites/${selectedSite.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editSite),
      })

      if (response.ok) {
        setEditSite({ site_name: '', site_url: '' })
        setSelectedSite(null)
        setShowEditModal(false)
        fetchSites()
      }
    } catch (error) {
      console.error('Site düzenleme hatası:', error)
    }
  }

  // Site sil
  const handleDeleteSite = async (site: Site) => {
    if (!confirm(`"${site.site_name}" adlı siteyi silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSites()
      } else {
        const data = await response.json()
        alert(data.error || 'Site silinemedi')
      }
    } catch (error) {
      console.error('Site silme hatası:', error)
      alert('Site silinemedi')
    }
  }

  // Düzenleme modal'ını aç
  const openEditModal = (site: Site) => {
    setSelectedSite(site)
    setEditSite({
      site_name: site.site_name || '',
      site_url: site.site_url || ''
    })
    setShowEditModal(true)
  }

  useEffect(() => {
    fetchSites()
  }, [])

  // Filtreleme
  const filteredSites = sites.filter(site => 
    site.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.site_url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // İstatistikler
  const totalSites = sites.length
  const totalIssues = sites.reduce((sum, site) => sum + site._count.issues, 0)
  const activeSites = sites.filter(site => site._count.issues > 0).length

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

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800">
          <MenuIcon size={16} />
        </Button>
      </div>

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
          <a href="#" className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2">
            <GitBranchIcon size={16} />
            <span>Deployments</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2">
            <TrendingUpIcon size={16} />
            <span>Analytics</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2">
            <UsersIcon size={16} />
            <span>Team</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
      {/* Header */}
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
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 w-full sm:w-auto"
        >
          <PlusIcon size={16} />
          <span>Yeni Site Ekle</span>
        </Button>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Site ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <FilterIcon size={16} />
          <span>Filtrele</span>
        </Button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {filteredSites.map((site) => (
          <div key={site.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
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
                  <DropdownMenuItem onClick={() => openEditModal(site)}>
                    <EditIcon size={16} className="mr-2" />
                    Düzenle
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDeleteSite(site)}
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
                <span className={`px-2 py-1 text-xs rounded-full ${
                  site._count.issues === 0 
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
                  className="flex-1"
                  onClick={() => window.location.href = `/sites/${site.id}/issues`}
                >
                  Issues Görüntüle
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <GlobeIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Henüz site yok
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            İlk web sitenizi ekleyerek başlayın
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon size={16} className="mr-2" />
            İlk Siteyi Ekle
          </Button>
        </div>
      )}

            {/* Add Site Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Yeni Site Ekle
            </h2>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={newSite.site_name}
                  onChange={(e) => setNewSite({...newSite, site_name: e.target.value})}
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
                  value={newSite.site_url}
                  onChange={(e) => setNewSite({...newSite, site_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ornekwebsite.com"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button type="submit" className="flex-1">
                  Site Ekle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Site Modal */}
      {showEditModal && selectedSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Site Düzenle
            </h2>
            <form onSubmit={handleEditSite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={editSite.site_name}
                  onChange={(e) => setEditSite({...editSite, site_name: e.target.value})}
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
                  value={editSite.site_url}
                  onChange={(e) => setEditSite({...editSite, site_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ornekwebsite.com"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedSite(null)
                    setEditSite({ site_name: '', site_url: '' })
                  }}
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
      )}
      </main>
    </div>
  )
} 