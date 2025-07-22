import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Kullanıcının team'lerini getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama gerekli' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id || session.user.email

    const userTeams = await prisma.team_users.findMany({
      where: {
        user_id: session.user.id
      },
      include: {
        teams: true
      },
      orderBy: {
        created_at: 'asc'
      }
    })

    const teams = userTeams.map(userTeam => ({
      id: userTeam.teams.id,
      name: userTeam.teams.team_name,
      role: userTeam.role,
      created_at: userTeam.teams.created_at
    }))
    
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Teams getirme hatası:', error)
    return NextResponse.json(
      { error: 'Teams getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni team oluştur
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
    const { team_name } = body

    if (!team_name || team_name.length < 2) {
      return NextResponse.json(
        { error: 'Team adı en az 2 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Team oluştur ve kullanıcıyı owner olarak ekle
    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.teams.create({
        data: {
          team_name,
        },
      })

      await tx.team_users.create({
        data: {
          team_id: team.id,
          user_id: session.user.id,
          role: 'owner',
        },
      })

      return team
    })

    return NextResponse.json({
      id: result.id,
      name: result.team_name,
      role: 'owner',
      created_at: result.created_at
    }, { status: 201 })

  } catch (error) {
    console.error('Team oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Team oluşturulamadı' },
      { status: 500 }
    )
  }
} 