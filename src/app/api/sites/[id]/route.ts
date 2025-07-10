import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tekil site getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz ID' },
        { status: 400 }
      )
    }

    const site = await prisma.sites.findUnique({
      where: { id },
      include: {
        issues: {
          orderBy: {
            created_at: 'desc'
          }
        },
        _count: {
          select: {
            issues: true
          }
        }
      }
    })

    if (!site) {
      return NextResponse.json(
        { error: 'Site bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error('Site getirme hatası:', error)
    return NextResponse.json(
      { error: 'Site getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Site güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    const { 
      site_name,
      site_url
    } = body

    // Mevcut site'ı kontrol et
    const existingSite = await prisma.sites.findUnique({
      where: { id }
    })

    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site bulunamadı' },
        { status: 404 }
      )
    }

    // URL format kontrolü (eğer site_url varsa)
    if (site_url) {
      try {
        new URL(site_url)
      } catch {
        return NextResponse.json(
          { error: 'Geçersiz URL formatı' },
          { status: 400 }
        )
      }
    }

    const updatedSite = await prisma.sites.update({
      where: { id },
      data: {
        ...(site_name && { site_name }),
        ...(site_url && { site_url })
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

    return NextResponse.json(updatedSite)
  } catch (error) {
    console.error('Site güncelleme hatası:', error)
    return NextResponse.json(
      { error: 'Site güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Site sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz ID' },
        { status: 400 }
      )
    }

    // Mevcut site'ı kontrol et
    const existingSite = await prisma.sites.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            issues: true
          }
        }
      }
    })

    if (!existingSite) {
      return NextResponse.json(
        { error: 'Site bulunamadı' },
        { status: 404 }
      )
    }

    // Site'a bağlı issue'lar olup olmadığını kontrol et
    if (existingSite._count.issues > 0) {
      return NextResponse.json(
        { error: 'Bu site\'e bağlı issue\'lar bulunuyor. Önce issue\'ları silin.' },
        { status: 400 }
      )
    }

    await prisma.sites.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Site başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Site silme hatası:', error)
    return NextResponse.json(
      { error: 'Site silinemedi' },
      { status: 500 }
    )
  }
} 