'use client'

import { useState } from 'react'
import { Calendar, Mail, Phone, Video, ChevronDown } from 'lucide-react'
import type { CalBooking } from '@/lib/calcom-api'

type Props = {
  upcoming: CalBooking[]
  past: CalBooking[]
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function statusBadge(status: string) {
  switch (status) {
    case 'accepted':
      return <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Confirmé</span>
    case 'pending':
      return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">En attente</span>
    case 'cancelled':
      return <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500 line-through decoration-stone-400">Annulé</span>
    case 'rejected':
      return <span className="rounded-full bg-error/10 px-2 py-0.5 text-xs font-medium text-error">Refusé</span>
    default:
      return null
  }
}

function BookingCard({ booking, muted }: { booking: CalBooking; muted?: boolean }) {
  const attendee = booking.attendees?.find((a) => !a.absent)
  const isVideo = booking.location?.startsWith('http')

  return (
    <div className={`rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-opacity ${muted ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-semibold text-stone-800">
              {formatTime(booking.start)} — {formatTime(booking.end)}
            </span>
            <span className="text-xs text-stone-400">({booking.duration} min)</span>
            {statusBadge(booking.status)}
          </div>
          <p className="mt-1.5 text-sm font-medium text-stone-700">
            {attendee?.name || booking.attendees?.[0]?.name || '—'}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
            {attendee?.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3" />
                {attendee.email}
              </span>
            )}
            {attendee?.phoneNumber && (
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3" />
                {attendee.phoneNumber}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm text-stone-600">
            {booking.bookingFieldsResponses?.motif || booking.bookingFieldsResponses?.reason || booking.title || '—'}
          </p>
        </div>
        <div className="shrink-0">
          {isVideo && !muted && (
            <a
              href={booking.location}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800 transition-colors duration-200"
            >
              <Video className="size-3.5" />
              Visio
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BookingListView({ upcoming, past }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [page, setPage] = useState(1)
  const perPage = 10

  const items = tab === 'upcoming' ? upcoming : past
  const paginated = items.slice(0, page * perPage)
  const hasMore = paginated.length < items.length

  return (
    <div>
      <div className="mb-6 inline-flex rounded-lg bg-stone-100 p-0.5">
        <button
          onClick={() => { setTab('upcoming'); setPage(1) }}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === 'upcoming' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          À venir ({upcoming.length})
        </button>
        <button
          onClick={() => { setTab('past'); setPage(1) }}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            tab === 'past' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          Passés ({past.length})
        </button>
      </div>

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-stone-400">
          <Calendar className="size-12 mb-3" />
          <p className="text-sm">
            {tab === 'upcoming' ? 'Aucun rendez-vous à venir aujourd\'hui' : 'Aucun rendez-vous passé aujourd\'hui'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((b) => (
            <BookingCard key={b.id} booking={b} muted={tab === 'past'} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            Voir plus
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
