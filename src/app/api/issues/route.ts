import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { issues_status, issues_priority } from '@/generated/prisma'

// GET - Tüm issues'ları getir
export async function GET() {
  try {
    const issues = await prisma.issues.findMany({
      include: {
        sites: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return NextResponse.json(issues)
  } catch (error) {
    console.error('Issues getirme hatası:', error)
    return NextResponse.json(
      { error: 'Issues getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni issue oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      site_id, 
      status = issues_status.new, 
      priority = issues_priority.medium,
      description,
      contact_email,
      url,
      user_agent,
      viewport,
      diagnostics
    } = body

    if (!site_id || !description || !url) {
      return NextResponse.json(
        { error: 'site_id, description ve url gerekli alanlar' },
        { status: 400 }
      )
    }

    const newIssue = await prisma.issues.create({
      data: {
        site_id: parseInt(site_id),
        status,
        priority,
        description,
        contact_email,
        url,
        user_agent,
        viewport,
        diagnostics
      },
      include: {
        sites: true
      }
    })

    return NextResponse.json(newIssue, { status: 201 })
  } catch (error) {
    console.error('Issue oluşturma hatası:', error)
    return NextResponse.json(
      { error: 'Issue oluşturulamadı' },
      { status: 500 }
    )
  }
} 