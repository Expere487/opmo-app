import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tüm kullanıcıları getir
export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        user_mail: true,
        created_at: true,
        // hashedPassword'u güvenlik için dahil etmiyoruz
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Users getirme hatası:', error)
    return NextResponse.json(
      { error: 'Users getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni kullanıcı oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      username,
      user_mail,
      hashedPassword
    } = body

    if (!username || !user_mail) {
      return NextResponse.json(
        { error: 'username ve user_mail gerekli alanlar' },
        { status: 400 }
      )
    }

    // Email format kontrolü (basit)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user_mail)) {
      return NextResponse.json(
        { error: 'Geçersiz email formatı' },
        { status: 400 }
      )
    }

    // Aynı email veya username var mı kontrol et
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { username },
          { user_mail }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu username veya email zaten kullanımda' },
        { status: 400 }
      )
    }

    const newUser = await prisma.users.create({
      data: {
        username,
        user_mail,
        hashedPassword
      },
      select: {
        id: true,
        username: true,
        user_mail: true,
        created_at: true,
        // hashedPassword'u güvenlik için dahil etmiyoruz
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('User oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'User oluşturulamadı' },
      { status: 500 }
    )
  }
} 