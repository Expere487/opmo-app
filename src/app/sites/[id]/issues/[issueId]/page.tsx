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
  MonitorIcon,
  SmartphoneIcon,
  BugIcon,
  CodeIcon,
  ImageIcon,
  ClockIcon,
  ServerIcon,
  ActivityIcon,
  CopyIcon,
  CheckIcon,
  EditIcon,
  SaveIcon,
  XIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectItem,
} from '@/components/ui/select'
import { getPriorityColor, getStatusColor } from '@/lib/utils'

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
  diagnostics?: any
  sites: {
    id: number
    site_name: string | null
    site_url: string | null
  }
}

export default function IssueDetailPage() {
  const params = useParams()
  const siteId = params.id as string
  const issueId = params.issueId as string
  
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ status: '', priority: '' })
  const [copiedText, setCopiedText] = useState('')

  // Issue detaylarını getir
  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/issues/${issueId}`)
      if (response.ok) {
        const data = await response.json()
        setIssue(data)
        setEditForm({ status: data.status, priority: data.priority })
      }
    } catch (error) {
      console.error('Issue getirme hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  // Issue güncelle
  const updateIssue = async () => {
    if (!issue) return
    
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })
      
      if (response.ok) {
        const updatedIssue = await response.json()
        setIssue(updatedIssue)
        setEditing(false)
      }
    } catch (error) {
      console.error('Issue güncelleme hatası:', error)
    }
  }

  // Kopyala fonksiyonu
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(''), 2000)
    } catch (error) {
      console.error('Kopyalama hatası:', error)
    }
  }

  useEffect(() => {
    if (issueId) {
      fetchIssue()
    }
  }, [issueId])
console.log(issue)
  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="flex-1 p-4 lg:p-8">
        <div className="text-center py-12">
          <AlertTriangleIcon size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Issue bulunamadı
          </h3>
          <Button onClick={() => window.history.back()}>
            <ArrowLeftIcon size={16} className="mr-2" />
            Geri Dön
          </Button>
        </div>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen">

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
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BugIcon size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Issue #{issue.id}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>{issue.sites.site_name || 'İsimsiz Site'}</span>
                  <span>•</span>
                  <span>{new Date(issue.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!editing ? (
                <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                  <EditIcon size={14} className="mr-1" />
                  Düzenle
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={updateIssue} size="sm">
                    <SaveIcon size={14} className="mr-1" />
                    Kaydet
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                    <XIcon size={14} className="mr-1" />
                    İptal
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ana İçerik */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Detayları */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Issue Detayları
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Açıklama
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {issue.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Durum
                    </label>
                    {editing ? (
                      <Select 
                        value={editForm.status} 
                        onValueChange={(value: string) => setEditForm({...editForm, status: value})}
                      >
                        <SelectItem value="new">Yeni</SelectItem>
                        <SelectItem value="in_progress">İşlemde</SelectItem>
                        <SelectItem value="resolved">Çözüldü</SelectItem>
                        <SelectItem value="wont_fix">Düzeltilmeyecek</SelectItem>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(issue.status)}`}>
                          {issue.status === 'new' ? 'Yeni' :
                           issue.status === 'in_progress' ? 'İşlemde' :
                           issue.status === 'resolved' ? 'Çözüldü' :
                           issue.status === 'wont_fix' ? 'Düzeltilmeyecek' : issue.status}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Öncelik
                    </label>
                    {editing ? (
                      <Select 
                        value={editForm.priority} 
                        onValueChange={(value: string) => setEditForm({...editForm, priority: value})}
                      >
                        <SelectItem value="low">Düşük</SelectItem>
                        <SelectItem value="medium">Orta</SelectItem>
                        <SelectItem value="high">Yüksek</SelectItem>
                        <SelectItem value="critical">Kritik</SelectItem>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(issue.priority)}`}>
                          {issue.priority === 'critical' ? 'Kritik' :
                           issue.priority === 'high' ? 'Yüksek' :
                           issue.priority === 'medium' ? 'Orta' :
                           issue.priority === 'low' ? 'Düşük' : issue.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ekran Görüntüsü */}
            {issue.diagnostics?.screenshot_data && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ImageIcon size={20} className="mr-2" />
                  Ekran Görüntüsü
                </h2>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={issue.diagnostics.screenshot_data} 
                    alt="Issue Screenshot" 
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Konsol Hataları */}
            {issue.diagnostics?.console_errors && issue.diagnostics.console_errors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CodeIcon size={20} className="mr-2" />
                  Konsol Hataları
                </h2>
                <div className="space-y-3">
                  {issue.diagnostics.console_errors.map((error: any, index: number) => (
                    <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">
                            {error.type || 'JavaScript Error'}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                            {error.message || error.error || 'Bilinmeyen hata'}
                          </p>
                          {error.source && (
                            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                              Kaynak: {error.source}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(JSON.stringify(error, null, 2), `error-${index}`)}
                          className="text-red-600 hover:text-red-700"
                        >
                          {copiedText === `error-${index}` ? (
                            <CheckIcon size={16} />
                          ) : (
                            <CopyIcon size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breadcrumbs (Kullanıcı Aksiyonları) */}
            {issue.diagnostics?.breadcrumbs && issue.diagnostics.breadcrumbs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Kullanıcı Aksiyonları (Breadcrumbs)
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Zaman</th>
                        <th className="px-2 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Aksiyon</th>
                        <th className="px-2 py-1 text-left font-medium text-gray-700 dark:text-gray-300">Selector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issue.diagnostics.breadcrumbs.map((bc: any, idx: number) => (
                        <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                          <td className="px-2 py-1 text-gray-900 dark:text-white">
                            {new Date(bc.timestamp).toLocaleTimeString('tr-TR')}
                          </td>
                          <td className="px-2 py-1 text-gray-900 dark:text-white">{bc.type}</td>
                          <td className="px-2 py-1 text-gray-900 dark:text-white">{bc.selector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Temel Bilgiler */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Temel Bilgiler
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Site
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">
                      {issue.sites.site_name || 'İsimsiz Site'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => window.open(issue.sites.site_url || '', '_blank')}
                      className="h-6 w-6"
                    >
                      <ExternalLinkIcon size={12} />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white text-sm break-all">
                      {issue.url}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyToClipboard(issue.url, 'url')}
                      className="h-6 w-6"
                    >
                      {copiedText === 'url' ? (
                        <CheckIcon size={12} />
                      ) : (
                        <CopyIcon size={12} />
                      )}
                    </Button>
                  </div>
                </div>

                {issue.contact_email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      İletişim E-posta
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <UserIcon size={14} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">
                        {issue.contact_email}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Oluşturulma Tarihi
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <CalendarIcon size={14} className="text-gray-400" />
                    <span className="text-gray-900 dark:text-white text-sm">
                      {new Date(issue.created_at).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teknik Detaylar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Teknik Detaylar
              </h2>
              
              <div className="space-y-4">
                {issue.viewport && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Görüntü Alanı
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <MonitorIcon size={14} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">
                        {issue.viewport}
                      </span>
                    </div>
                  </div>
                )}

                {issue.diagnostics?.technical_context?.screenResolution && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ekran Çözünürlüğü
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <MonitorIcon size={14} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">
                        {issue.diagnostics.technical_context.screenResolution}
                      </span>
                    </div>
                  </div>
                )}

                {issue.diagnostics?.technical_context?.platform && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Platform
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <SmartphoneIcon size={14} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">
                        {issue.diagnostics.technical_context.platform}
                      </span>
                    </div>
                  </div>
                )}

                {issue.diagnostics?.technical_context?.language && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Dil
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <GlobeIcon size={14} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-white text-sm">
                        {issue.diagnostics.technical_context.language}
                      </span>
                    </div>
                  </div>
                )}

                {issue.user_agent && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      User Agent
                    </label>
                    <div className="mt-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-700 dark:text-gray-300 break-all">
                          {issue.user_agent}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(issue.user_agent || '', 'user-agent')}
                        className="mt-2"
                      >
                        {copiedText === 'user-agent' ? (
                          <CheckIcon size={14} className="mr-1" />
                        ) : (
                          <CopyIcon size={14} className="mr-1" />
                        )}
                        Kopyala
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}