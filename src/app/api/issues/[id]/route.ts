import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { issues_status, issues_priority } from '@/generated/prisma'

// GET - Tekil issue getir
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

    const issue = await prisma.issues.findUnique({
      where: { id },
      include: {
        sites: true
      }
    })

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Issue getirme hatası:', error)
    return NextResponse.json(
      { error: 'Issue getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Issue güncelle
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
      site_id, 
      status,
      priority,
      description,
      contact_email,
      url,
      user_agent,
      viewport,
      diagnostics
    } = body

    // Mevcut issue'yu kontrol et
    const existingIssue = await prisma.issues.findUnique({
      where: { id }
    })

    if (!existingIssue) {
      return NextResponse.json(
        { error: 'Issue bulunamadı' },
        { status: 404 }
      )
    }

    const updatedIssue = await prisma.issues.update({
      where: { id },
      data: {
        ...(site_id && { site_id: parseInt(site_id) }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(description && { description }),
        ...(contact_email !== undefined && { contact_email }),
        ...(url && { url }),
        ...(user_agent !== undefined && { user_agent }),
        ...(viewport !== undefined && { viewport }),
        ...(diagnostics !== undefined && { diagnostics })
      },
      include: {
        sites: true
      }
    })

    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error('Issue güncelleme hatası:', error)
    return NextResponse.json(
      { error: 'Issue güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Issue sil
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

    // Mevcut issue'yu kontrol et
    const existingIssue = await prisma.issues.findUnique({
      where: { id }
    })

    if (!existingIssue) {
      return NextResponse.json(
        { error: 'Issue bulunamadı' },
        { status: 404 }
      )
    }

    await prisma.issues.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Issue başarıyla silindi' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Issue silme hatası:', error)
    return NextResponse.json(
      { error: 'Issue silinemedi' },
      { status: 500 }
    )
  }
} 