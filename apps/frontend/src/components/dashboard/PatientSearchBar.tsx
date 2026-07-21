'use client'

import { FormEvent } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Search } from 'lucide-react'

export default function PatientSearchBar() {
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const q = form.get('q') as string
    if (q?.trim()) {
      router.push(`/dashboard/patients?q=${encodeURIComponent(q.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <input
          name="q"
          placeholder="Rechercher un patient (nom ou CIN)..."
          className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
        />
      </div>
    </form>
  )
}
