import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Kullanıcının team'ine göre site'ları getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      )
    }

    // URL'den team_id parametresini al
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('team_id')

    if (!teamId) {
      return NextResponse.json(
        { error: 'team_id parametresi gerekli' },
        { status: 400 }
      )
    }

    // Kullanıcının bu team'de olup olmadığını kontrol et
    const userTeam = await prisma.team_users.findFirst({
      where: {
        user_id: session.user.id,
        team_id: parseInt(teamId)
      }
    })

    if (!userTeam) {
      return NextResponse.json(
        { error: 'Bu team\'e erişim yetkiniz yok' },
        { status: 403 }
      )
    }

    const sites = await prisma.sites.findMany({
      where: {
        team_id: teamId
      },
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
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const { 
      site_name,
      site_url,
      team_id
    } = body

    if (!site_name || !site_url || !team_id) {
      return NextResponse.json(
        { error: 'site_name, site_url ve team_id gerekli alanlar' },
        { status: 400 }
      )
    }

    // Kullanıcının bu team'de olup olmadığını kontrol et
    const userTeam = await prisma.team_users.findFirst({
      where: {
        user_id: session.user.id,
        team_id: parseInt(team_id)
      }
    })

    if (!userTeam) {
      return NextResponse.json(
        { error: 'Bu team\'e site ekleme yetkiniz yok' },
        { status: 403 }
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
        site_url,
        team_id: team_id
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