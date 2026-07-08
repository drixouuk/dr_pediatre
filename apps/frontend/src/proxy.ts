import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://dr-pediatre-cms.vercel.app'

const intlMiddleware = createMiddleware(routing)

const tenantCache = new Map<string, { id: string; slug: string; name: string } | null>()

async function resolveTenant(hostname: string): Promise<{ id: string; slug: string; name: string } | null> {
  if (tenantCache.has(hostname)) return tenantCache.get(hostname) ?? null

  try {
    const url = `${CMS_URL}/api/tenants?where[domain][equals]=${encodeURIComponent(hostname)}&depth=0&limit=1`
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })
    if (!res.ok) {
      tenantCache.set(hostname, null)
      return null
    }
    const json = await res.json()
    const doc = json.docs?.[0]
    if (doc) {
      const tenant = { id: doc.id, slug: doc.slug || doc.id, name: doc.name }
      tenantCache.set(hostname, tenant)
      return tenant
    }
    tenantCache.set(hostname, null)
    return null
  } catch {
    tenantCache.set(hostname, null)
    return null
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = intlMiddleware(request)
  const hostname = request.headers.get('host') || ''

  const tenant = await resolveTenant(hostname)

  if (tenant) {
    const headers = new Headers(response.headers)
    headers.set('x-tenant-id', tenant.id)
    headers.set('x-tenant-slug', tenant.slug)

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }

  const newHeaders = new Headers(response.headers)
  newHeaders.set('x-tenant-id', 'default')
  newHeaders.set('x-tenant-slug', 'default')

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
