'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { Search, Loader2 } from 'lucide-react'

type Suggestion = {
  id: string
  fullName: string
  nationalId?: string | null
}

export default function PatientSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/cms-proxy/patients?depth=0&limit=8&sort=fullName&where[or][0][fullName][contains]=${encodeURIComponent(query.trim())}&where[or][1][nationalId][contains]=${encodeURIComponent(query.trim())}`,
        )
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.docs ?? [])
          setOpen(true)
        }
      } catch {
        // silent
      }
      setLoading(false)
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setOpen(false)
    if (query.trim()) {
      router.push(`/dashboard/patients?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un patient (nom ou CIN)..."
            className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-stone-400" />
          )}
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-30 mt-1 w-full rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
          {suggestions.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/patients/${p.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2 text-sm text-stone-700 transition-colors duration-200 hover:bg-stone-50"
            >
              <span className="font-medium">{p.fullName}</span>
              {p.nationalId && <span className="text-xs text-stone-400">{p.nationalId}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
