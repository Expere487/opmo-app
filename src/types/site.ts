export interface Site {
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

export interface SiteFormData {
  site_name: string
  site_url: string
} 