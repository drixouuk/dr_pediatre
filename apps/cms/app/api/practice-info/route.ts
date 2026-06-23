import { NextRequest, NextResponse } from 'next/server'
import { getPayloadInstance } from '../../../src/payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadInstance()
    const locale = request.nextUrl.searchParams.get('locale') ?? undefined
    const depth = parseInt(request.nextUrl.searchParams.get('depth') ?? '1', 10)

    const data = await payload.findGlobal({
      slug: 'practice-info',
      depth,
      locale: locale as any,
    })

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('PracticeInfo API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
