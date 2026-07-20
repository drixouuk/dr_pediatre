'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'

type Props = {
  patient: {
    id: string
    fullName: string
    gender?: string | null
    birthDate?: string | null
    nationalId?: string | null
  }
}

export default function EditPatientForm({ patient }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState(patient.fullName)
  const [gender, setGender] = useState(patient.gender || '')
  const [birthDate, setBirthDate] = useState(
    patient.birthDate ? patient.birthDate.slice(0, 10) : '',
  )
  const [nationalId, setNationalId] = useState(patient.nationalId || '')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const body: Record<string, unknown> = {
      fullName,
      gender,
      nationalId: nationalId || undefined,
      birthDate: birthDate || undefined,
    }

    const res = await fetch(`/api/cms-proxy/patients/${patient.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error || 'Erreur lors de la modification')
      setSaving(false)
      return
    }

    router.push(`/dashboard/patients/${patient.id}`)
    router.refresh()
  }

  const inputClass =
    'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-stone-700">
          Nom complet *
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="gender" className="mb-1 block text-sm font-medium text-stone-700">
          Sexe *
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className={inputClass}
        >
          <option value="">Sélectionner…</option>
          <option value="boy">Garçon</option>
          <option value="girl">Fille</option>
        </select>
      </div>

      <div>
        <label htmlFor="birthDate" className="mb-1 block text-sm font-medium text-stone-700">
          Date de naissance
        </label>
        <input
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          type="date"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="nationalId" className="mb-1 block text-sm font-medium text-stone-700">
          CIN (optionnel)
        </label>
        <input
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          type="text"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
        <Link
          href={`/dashboard/patients/${patient.id}`}
          className="text-sm font-medium text-stone-500 hover:text-stone-700"
        >
          Annuler
        </Link>
      </div>
    </form>
  )
}
