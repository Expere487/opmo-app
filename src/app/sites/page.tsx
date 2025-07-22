"use client"

import { useState, useEffect } from 'react'
import { useTeams } from '@/hooks/use-teams'
import { Site, SiteFormData } from '@/types/site'

// Components
import SiteHeader from '@/components/sites/SiteHeader'
import SiteStatsCards from '@/components/sites/SiteStatsCards'
import SiteFilters from '@/components/sites/SiteFilters'
import SiteCard from '@/components/cards/SiteCard'
import AddSiteModal from '@/components/sites/AddSiteModal'
import EditSiteModal from '@/components/sites/EditSiteModal'
import EmptyState from '@/components/sites/EmptyState'

export default function SitesPage() {
  const { selectedTeam, loading: teamsLoading } = useTeams()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  
  // Form states
  const [newSite, setNewSite] = useState<SiteFormData>({
    site_name: '',
    site_url: ''
  })
  const [editSite, setEditSite] = useState<SiteFormData>({
    site_name: '',
    site_url: ''
  })

  // Sites'ları getir
  const fetchSites = async () => {
    if (!selectedTeam) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/sites?team_id=${selectedTeam.id}`)
      if (response.ok) {
        const data = await response.json()
        setSites(data)
      } else {
        console.error('Sites getirme hatası:', await response.text())
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
    
    if (!newSite.site_name || !newSite.site_url || !selectedTeam) return

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSite,
          team_id: selectedTeam.id.toString()
        }),
      })

      if (response.ok) {
        setNewSite({ site_name: '', site_url: '' })
        setShowAddModal(false)
        fetchSites()
      } else {
        const error = await response.json()
        alert(error.error || 'Site eklenemedi')
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
        handleCloseEditModal()
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

  // Modal handlers
  const handleOpenEditModal = (site: Site) => {
    setSelectedSite(site)
    setEditSite({
      site_name: site.site_name || '',
      site_url: site.site_url || ''
    })
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedSite(null)
    setEditSite({ site_name: '', site_url: '' })
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setNewSite({ site_name: '', site_url: '' })
  }

  useEffect(() => {
    if (selectedTeam && !teamsLoading) {
      fetchSites()
    }
  }, [selectedTeam, teamsLoading])

  // Filtreleme
  const filteredSites = sites.filter(site => 
    site.site_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.site_url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // İstatistikler
  const totalSites = sites.length
  const totalIssues = sites.reduce((sum, site) => sum + site._count.issues, 0)
  const activeSites = sites.filter(site => site._count.issues > 0).length

  // Loading state
  if (loading || teamsLoading) {
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

  // No team selected
  if (!selectedTeam) {
    return (
      <div className="flex-1 p-4 lg:p-8">
        <EmptyState type="no-team" />
      </div>
    )
  }

  return (
    <div className="">
      <main className="p-4 lg:p-8">
        <SiteHeader onAddSite={() => setShowAddModal(true)} />
        
        <SiteStatsCards 
          totalSites={totalSites}
          totalIssues={totalIssues}
          activeSites={activeSites}
        />

        <SiteFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Sites Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteSite}
            />
          ))}
        </div>

        {filteredSites.length === 0 && totalSites > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              Arama kriterlerinizle eşleşen site bulunamadı.
            </p>
          </div>
        )}

        {totalSites === 0 && (
          <EmptyState type="no-sites" onAddSite={() => setShowAddModal(true)} />
        )}

        <AddSiteModal
          isOpen={showAddModal}
          formData={newSite}
          onFormChange={setNewSite}
          onSubmit={handleAddSite}
          onClose={handleCloseAddModal}
        />

        <EditSiteModal
          isOpen={showEditModal}
          site={selectedSite}
          formData={editSite}
          onFormChange={setEditSite}
          onSubmit={handleEditSite}
          onClose={handleCloseEditModal}
        />
      </main>
    </div>
  )
} 