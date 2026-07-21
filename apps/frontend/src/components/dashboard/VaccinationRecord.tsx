'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

type ScheduleEntry = {
  id: string
  vaccineName: string
  doseLabel: string
  ageMonths: number
  order?: number | null
  notes?: string | null
}

type Vaccination = {
  id: string
  vaccineName: string
  doseLabel: string
  dateAdministered: string
}

type Props = {
  patientId: string
  schedule: ScheduleEntry[]
  vaccinations: Vaccination[]
  patientGender?: string | null
  patientBirthDate?: string | null
}

function computeAgeMonths(birthDate: string): number {
  const now = new Date()
  const birth = new Date(birthDate)
  return (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR')
}

export default function VaccinationRecord({
  patientId,
  schedule,
  vaccinations,
  patientGender,
  patientBirthDate,
}: Props) {
  const router = useRouter()
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [dateValue, setDateValue] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)

  if (!patientBirthDate) {
    return (
      <div className="mb-8">
        <h3 className="mb-2 font-heading text-lg font-semibold text-stone-800">Carnet vaccinal</h3>
        <p className="text-sm text-stone-400">Date de naissance manquante — impossible d&apos;évaluer le calendrier vaccinal.</p>
      </div>
    )
  }

  const ageMonths = computeAgeMonths(patientBirthDate)
  const isBoy = patientGender === 'boy'

  const sorted = [...schedule]
    .filter((s) => !(s.notes?.includes('Filles uniquement') && isBoy))
    .sort((a, b) => (a.ageMonths ?? 0) - (b.ageMonths ?? 0) || (a.order ?? 0) - (b.order ?? 0))

  const vaccinationDone = (entry: ScheduleEntry): Vaccination | undefined =>
    vaccinations.find((v) => v.vaccineName === entry.vaccineName && v.doseLabel === entry.doseLabel)

  const handleSubmit = async (entry: ScheduleEntry) => {
    setSaving(true)
    const body = {
      patient: patientId,
      vaccineName: entry.vaccineName,
      doseLabel: entry.doseLabel,
      dateAdministered: dateValue,
    }

    try {
      const res = await fetch('/api/cms-proxy/vaccinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setActiveForm(null)
        router.refresh()
      }
    } catch {
      // silent
    }
    setSaving(false)
  }

  if (sorted.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="mb-2 font-heading text-lg font-semibold text-stone-800">Carnet vaccinal</h3>
        <p className="text-sm text-stone-400">Aucun vaccin dans le calendrier de référence.</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="mb-3 font-heading text-lg font-semibold text-stone-800">Carnet vaccinal</h3>
      <p className="mb-3 text-xs text-stone-400">
        Âge du patient : {Math.floor(ageMonths / 12)} ans {ageMonths % 12} mois
      </p>
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Vaccin</th>
              <th className="px-4 py-2.5 font-medium">Dose</th>
              <th className="px-4 py-2.5 font-medium">Âge recommandé</th>
              <th className="px-4 py-2.5 font-medium">Statut</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sorted.map((entry, idx) => {
              const done = vaccinationDone(entry)
              const isFuture = entry.ageMonths > ageMonths
              const isOverdue = !done && !isFuture
              const key = `${entry.vaccineName}-${entry.doseLabel}-${idx}`
              const showForm = activeForm === key

              let statusIcon: React.ReactNode
              let statusText: string
              let statusColor: string

              if (done) {
                statusIcon = <CheckCircle2 className="size-4 text-green-500" />
                statusText = `Administré le ${formatDate(done.dateAdministered)}`
                statusColor = 'text-green-600'
              } else if (isFuture) {
                statusIcon = <Clock className="size-4 text-stone-300" />
                statusText = 'À venir'
                statusColor = 'text-stone-300'
              } else {
                statusIcon = <AlertCircle className="size-4 text-red-500" />
                statusText = 'En retard'
                statusColor = 'text-red-600'
              }

              return (
                <tr key={key} className={`hover:bg-stone-50 ${done ? 'bg-green-50/30' : ''}`}>
                  <td className="px-4 py-2.5 font-medium text-stone-800">{entry.vaccineName}</td>
                  <td className="px-4 py-2.5 text-stone-600">
                    {entry.doseLabel}
                    {entry.notes && (
                      <span className="ml-1 text-xs text-stone-400">({entry.notes})</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-stone-500">
                    {entry.ageMonths < 1
                      ? 'Naissance'
                      : entry.ageMonths >= 12
                        ? `${Math.floor(entry.ageMonths / 12)} ans`
                        : `${entry.ageMonths} mois`}
                  </td>
                  <td className={`px-4 py-2.5 ${statusColor}`}>
                    <span className="flex items-center gap-1.5">
                      {statusIcon}
                      {statusText}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {(isOverdue || (isFuture && !done)) && !showForm && (
                      <button
                        onClick={() => { setActiveForm(key); setDateValue(new Date().toISOString().slice(0, 10)) }}
                        className="rounded bg-primary-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-primary-800"
                      >
                        Marquer comme administré
                      </button>
                    )}
                    {showForm && (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={dateValue}
                          onChange={(e) => setDateValue(e.target.value)}
                          className="w-36 rounded border border-stone-300 px-2 py-1 text-xs focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSubmit(entry)}
                          disabled={saving}
                          className="rounded bg-primary-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-primary-800 disabled:opacity-50"
                        >
                          {saving ? '…' : 'Enregistrer'}
                        </button>
                        <button
                          onClick={() => setActiveForm(null)}
                          className="text-xs text-stone-400 hover:text-stone-600"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
