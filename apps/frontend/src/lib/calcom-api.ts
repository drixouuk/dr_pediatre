export type CalAttendee = {
  name: string
  email: string
  displayEmail: string
  timeZone: string
  language?: string
  phoneNumber?: string | null
  absent: boolean
}

export type CalBooking = {
  id: number
  uid: string
  title: string
  description: string
  hosts: { id: number; name: string; email: string; username: string; timeZone: string }[]
  status: 'accepted' | 'pending' | 'cancelled' | 'rejected'
  start: string
  end: string
  duration: number
  eventType: { id: number; slug: string }
  location: string
  absentHost: boolean
  createdAt: string
  updatedAt: string | null
  attendees: CalAttendee[]
  guests: string[]
  bookingFieldsResponses: Record<string, string>
  metadata?: Record<string, unknown>
}

export type CalBookingsResponse = {
  status: 'success' | 'error'
  data: CalBooking[]
  pagination: { nextCursor: string | null; hasMore: boolean }
}

type FetchBookingsParams = {
  baseUrl: string
  apiKey: string
  status?: 'upcoming' | 'past' | 'cancelled' | 'recurring' | 'unconfirmed'
  attendeeEmail?: string
  attendeeName?: string
  eventTypeId?: number | number[]
  afterStart?: string
  beforeEnd?: string
  sortStart?: 'asc' | 'desc'
  sortEnd?: 'asc' | 'desc'
  limit?: number
  cursor?: string
}

export async function fetchCalBookings(params: FetchBookingsParams): Promise<CalBookingsResponse> {
  const url = new URL(`${params.baseUrl}/api/v2/bookings`)

  if (params.status) url.searchParams.set('status', params.status)
  if (params.attendeeEmail) url.searchParams.set('attendeeEmail', params.attendeeEmail)
  if (params.attendeeName) url.searchParams.set('attendeeName', params.attendeeName)
  if (params.afterStart) url.searchParams.set('afterStart', params.afterStart)
  if (params.beforeEnd) url.searchParams.set('beforeEnd', params.beforeEnd)
  if (params.sortStart) url.searchParams.set('sortStart', params.sortStart)
  if (params.sortEnd) url.searchParams.set('sortEnd', params.sortEnd)
  if (params.limit) url.searchParams.set('limit', String(params.limit))
  if (params.cursor) url.searchParams.set('cursor', params.cursor)
  if (Array.isArray(params.eventTypeId) && params.eventTypeId.length > 0) {
    url.searchParams.set('eventTypeIds', params.eventTypeId.join(','))
  } else if (typeof params.eventTypeId === 'number') {
    url.searchParams.set('eventTypeId', String(params.eventTypeId))
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'cal-api-version': '2026-05-01',
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    throw new Error(`Cal.com API error ${res.status}: ${errorBody}`)
  }

  return res.json()
}

export async function healthCheckCalcom(baseUrl: string, apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/api/v2/bookings?limit=1`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'cal-api-version': '2026-05-01',
      },
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}
