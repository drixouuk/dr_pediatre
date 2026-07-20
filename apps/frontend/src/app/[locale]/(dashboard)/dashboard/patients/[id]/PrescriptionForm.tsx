'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Medication = {
  nom: string
  dci: string
  posologie: string
  duree: string
}

type Prescription = {
  id: string
  date: string
  medications: Medication[]
  notes?: string | null
  practitioner: { email?: string; name?: string }
}

type ConsultationOption = {
  id: string
  date: string
  motif?: string | null
}

type Props = {
  patientId: string
  prescriptions: Prescription[]
  consultations: ConsultationOption[]
}

export default function PrescriptionForm({ patientId, prescriptions, consultations }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([
    { nom: '', dci: '', posologie: '', duree: '' },
  ])
  const [notes, setNotes] = useState('')
  const [consultationId, setConsultationId] = useState(
    consultations.length > 0 ? consultations[0].id : '',
  )

  const updateMed = (i: number, field: keyof Medication, value: string) => {
    setMedications(prev => prev.map((m, j) => (j === i ? { ...m, [field]: value } : m)))
  }

  const addMedication = () => {
    setMedications(prev => [...prev, { nom: '', dci: '', posologie: '', duree: '' }])
  }

  const removeMedication = (i: number) => {
    setMedications(prev => prev.filter((_, j) => j !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const body: Record<string, unknown> = {
      patient: patientId,
      medications: medications.filter(m => m.nom.trim()),
      notes: notes || undefined,
    }
    if (consultationId) {
      body.consultation = consultationId
    }

    const res = await fetch('/api/cms-proxy/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setShowForm(false)
      setMedications([{ nom: '', dci: '', posologie: '', duree: '' }])
      setNotes('')
      router.refresh()
    }
    setSaving(false)
  }

  const inputClass = 'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none'

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <h2 className="font-heading text-lg font-semibold text-stone-800">Ordonnances</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800"
          >
            Nouvelle ordonnance
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          {medications.map((med, i) => (
            <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500">Médicament {i + 1}</span>
                {medications.length > 1 && (
                  <button type="button" onClick={() => removeMedication(i)} className="text-xs text-red-500 hover:text-red-700">Retirer</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-0.5 block text-xs text-stone-600">Nom *</label>
                  <input value={med.nom} onChange={e => updateMed(i, 'nom', e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs text-stone-600">DCI</label>
                  <input value={med.dci} onChange={e => updateMed(i, 'dci', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs text-stone-600">Posologie *</label>
                  <input value={med.posologie} onChange={e => updateMed(i, 'posologie', e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label className="mb-0.5 block text-xs text-stone-600">Durée *</label>
                  <input value={med.duree} onChange={e => updateMed(i, 'duree', e.target.value)} required className={inputClass} />
                </div>
              </div>
            </div>
          ))}

          <button type="button" onClick={addMedication} className="self-start text-sm font-medium text-primary-600 hover:text-primary-700">
            + Ajouter un médicament
          </button>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Notes</label>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className={inputClass} />
          </div>

          {consultations.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                Rattacher à une consultation <span className="text-stone-400">(optionnel)</span>
              </label>
              <select
                value={consultationId}
                onChange={e => setConsultationId(e.target.value)}
                className={inputClass}
              >
                <option value="">Aucune</option>
                {consultations.map(c => (
                  <option key={c.id} value={c.id}>
                    {new Date(c.date).toLocaleDateString('fr-FR')}{c.motif ? ` — ${c.motif}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50">
              {saving ? 'Enregistrement…' : 'Enregistrer l\'ordonnance'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-stone-500 hover:text-stone-700">Annuler</button>
          </div>
        </form>
      )}

      {prescriptions.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-stone-400">Aucune ordonnance.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {prescriptions.map(p => (
            <div key={p.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-stone-800">
                  {new Date(p.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-xs text-stone-400">
                  {p.practitioner?.name || p.practitioner?.email || '—'}
                </span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {p.medications?.map((m, i) => (
                  <li key={i} className="text-sm text-stone-600">
                    {m.nom}{m.dci ? ` (${m.dci})` : ''} — {m.posologie} — {m.duree}
                  </li>
                ))}
              </ul>
              {p.notes && <p className="mt-1 text-xs text-stone-500">{p.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
