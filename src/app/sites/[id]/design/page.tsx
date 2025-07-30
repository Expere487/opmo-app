import Designer from '@/components/sites/Designer'
import SiteDetailHeader from '@/components/sites/SiteDetailHeader'
import React from 'react'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log(id)

  const site = await fetch(`http://localhost:5002/api/sites/${id}`)
  const siteData = await site.json()
  console.log(siteData)

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <SiteDetailHeader site={siteData} />
        <Designer />
      </main>
    </div>
  )
}
