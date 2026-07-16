'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPatientPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const form = new FormData(e.currentTarget)
    const body = {
      fullName: form.get('fullName') as string,
      gender: form.get('gender') as string,
      nationalId: (form.get('nationalId') as string) || undefined,
    }

    const res = await fetch('/api/cms-proxy/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      setError('Erreur lors de la création')
      setSaving(false)
      return
    }

    router.push('./')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-stone-800">Nouveau patient</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-stone-700">
            Nom complet *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="gender" className="mb-1 block text-sm font-medium text-stone-700">
            Sexe *
          </label>
          <select
            id="gender"
            name="gender"
            required
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          >
            <option value="">Sélectionner…</option>
            <option value="boy">Garçon</option>
            <option value="girl">Fille</option>
          </select>
        </div>

        <div>
          <label htmlFor="nationalId" className="mb-1 block text-sm font-medium text-stone-700">
            CIN (optionnel)
          </label>
          <input
            id="nationalId"
            name="nationalId"
            type="text"
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-lg bg-primary-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50"
        >
          {saving ? 'Création…' : 'Créer le patient'}
        </button>
      </form>
    </div>
  )
}
