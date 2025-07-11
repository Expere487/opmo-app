import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { issues_status, issues_priority } from '@/generated/prisma'

// CORS header'larını ayarla
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
  return response
}

// OPTIONS - Preflight request'leri handle et
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  return setCorsHeaders(response)
}

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
    
    const response = NextResponse.json(issues)
    return setCorsHeaders(response)
  } catch (error) {
    console.error('Issues getirme hatası:', error)
    const response = NextResponse.json(
      { error: 'Issues getirilemedi' },
      { status: 500 }
    )
    return setCorsHeaders(response)
  }
}

// POST - Yeni issue oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      report,
      context,
      diagnostics,
      visuals,
      timestamp
    } = body

    // Gerekli alanları kontrol et
    if (!report || !context) {
      const response = NextResponse.json(
        { error: 'report ve context gerekli alanlar' },
        { status: 400 }
      )
      return setCorsHeaders(response)
    }

    // report'tan bilgileri çıkar
    const { description, contact_email } = report

    // context'ten bilgileri çıkar
    const {
      site_id,
      url,
      userAgent,
      language,
      platform,
      screenResolution,
      viewport,
      ...otherContextData
    } = context

    if (!site_id || !url || !description) {
      const response = NextResponse.json(
        { error: 'site_id, url ve description gerekli alanlar' },
        { status: 400 }
      )
      return setCorsHeaders(response)
    }

    // Diagnostics verilerini birleştir
    const combinedDiagnostics = {
      console_errors: diagnostics?.console_errors || [],
      breadcrumbs: diagnostics?.breadcrumbs || [],
      screenshot_data: visuals?.screenshot_data || null,
      technical_context: {
        ...otherContextData,
        language,
        platform,
        screenResolution,
        viewport
      },
      timestamp: timestamp || new Date().toISOString()
    }

    const newIssue = await prisma.issues.create({
      data: {
        site_id: parseInt(site_id),
        status: issues_status.new,
        priority: issues_priority.medium,
        description: description,
        contact_email: contact_email || null,
        url,
        user_agent: userAgent || null,
        viewport: viewport || null,
        diagnostics: combinedDiagnostics
      },
      include: {
        sites: true
      }
    })

    const response = NextResponse.json(newIssue, { status: 201 })
    return setCorsHeaders(response)
  } catch (error) {
    console.error('Issue oluşturma hatası:', error)
    const response = NextResponse.json(
      { error: 'Issue oluşturulamadı' },
      { status: 500 }
    )
    return setCorsHeaders(response)
  }
} 