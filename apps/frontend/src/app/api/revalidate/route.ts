import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret') || request.nextUrl.searchParams.get('secret')

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const tags: string[] = []

  const collection = body.collection as string | undefined
  const tenantId = (body.tenant as string) || (body.tenantId as string)

  if (collection === 'services' || body.tag === 'services') {
    tags.push('services')
  }
  if (collection === 'reviews') {
    tags.push('reviews', 'published')
  }
  if (collection === 'practice-info') {
    tags.push('practice-info')
  }
  if (tags.length === 0 && body.tag) {
    tags.push(body.tag as string)
  }

  if (tenantId) {
    tags.push(`tenant-${tenantId}`)
  }

  if (tags.length === 0) {
    return NextResponse.json({ revalidated: false, reason: 'No tags to revalidate' }, { status: 200 })
  }

  for (const tag of tags) {
    revalidateTag(tag, 'default')
  }

  return NextResponse.json({ revalidated: true, tags })
}
