import { NextRequest, NextResponse } from 'next/server'
import { getPayloadInstance } from '../../../src/payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadInstance()
    const locale = request.nextUrl.searchParams.get('locale') ?? undefined
    const depth = parseInt(request.nextUrl.searchParams.get('depth') ?? '1', 10)

    const data = await payload.find({
      collection: 'doctors',
      depth,
      locale: locale as any,
      limit: 10,
    })

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Doctors API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
