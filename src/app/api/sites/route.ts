import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tüm site'ları getir
export async function GET() {
  try {
    const sites = await prisma.sites.findMany({
      include: {
        issues: true,
        _count: {
          select: {
            issues: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return NextResponse.json(sites)
  } catch (error) {
    console.error('Sites getirme hatası:', error)
    return NextResponse.json(
      { error: 'Sites getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni site oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      site_name,
      site_url
    } = body

    if (!site_name || !site_url) {
      return NextResponse.json(
        { error: 'site_name ve site_url gerekli alanlar' },
        { status: 400 }
      )
    }

    // URL format kontrolü
    try {
      new URL(site_url)
    } catch {
      return NextResponse.json(
        { error: 'Geçersiz URL formatı' },
        { status: 400 }
      )
    }

    const newSite = await prisma.sites.create({
      data: {
        site_name,
        site_url
      },
      include: {
        issues: true,
        _count: {
          select: {
            issues: true
          }
        }
      }
    })

    return NextResponse.json(newSite, { status: 201 })
  } catch (error) {
    console.error('Site oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Site oluşturulamadı' },
      { status: 500 }
    )
  }
} 