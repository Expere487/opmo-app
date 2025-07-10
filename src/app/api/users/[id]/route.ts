import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Tekil kullanıcı getir
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

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        user_mail: true,
        created_at: true,
        // hashedPassword'u güvenlik için dahil etmiyoruz
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('User getirme hatası:', error)
    return NextResponse.json(
      { error: 'User getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Kullanıcı güncelle
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
      username,
      user_mail,
      hashedPassword
    } = body

    // Mevcut kullanıcıyı kontrol et
    const existingUser = await prisma.users.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User bulunamadı' },
        { status: 404 }
      )
    }

    // Email format kontrolü (eğer user_mail varsa)
    if (user_mail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(user_mail)) {
        return NextResponse.json(
          { error: 'Geçersiz email formatı' },
          { status: 400 }
        )
      }

      // Aynı email başka birinde var mı kontrol et (kendisi hariç)
      const existingEmail = await prisma.users.findFirst({
        where: {
          user_mail,
          NOT: { id }
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Bu email zaten kullanımda' },
          { status: 400 }
        )
      }
    }

    // Username kontrolü (eğer username varsa)
    if (username) {
      const existingUsername = await prisma.users.findFirst({
        where: {
          username,
          NOT: { id }
        }
      })

      if (existingUsername) {
        return NextResponse.json(
          { error: 'Bu username zaten kullanımda' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        ...(username && { username }),
        ...(user_mail && { user_mail }),
        ...(hashedPassword && { hashedPassword })
      },
      select: {
        id: true,
        username: true,
        user_mail: true,
        created_at: true,
        // hashedPassword'u güvenlik için dahil etmiyoruz
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('User güncelleme hatası:', error)
    return NextResponse.json(
      { error: 'User güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Kullanıcı sil
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

    // Mevcut kullanıcıyı kontrol et
    const existingUser = await prisma.users.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User bulunamadı' },
        { status: 404 }
      )
    }

    await prisma.users.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'User başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('User silme hatası:', error)
    return NextResponse.json(
      { error: 'User silinemedi' },
      { status: 500 }
    )
  }
} 