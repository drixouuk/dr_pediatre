'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

type Consultation = {
  id: string
  date: string
  motif?: string | null
  practitioner: { email?: string; name?: string }
  poids?: number | null
  taille?: number | null
  perimetreCranien?: number | null
  diagnostic?: string | null
}

type Props = {
  patientId: string
  consultations: Consultation[]
}

export default function ConsultationForm({ patientId, consultations }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [motif, setMotif] = useState('')
  const [examenClinique, setExamenClinique] = useState('')
  const [poids, setPoids] = useState('')
  const [taille, setTaille] = useState('')
  const [perimetreCranien, setPerimetreCranien] = useState('')
  const [diagnostic, setDiagnostic] = useState('')
  const [codeActe, setCodeActe] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const body: Record<string, unknown> = {
      patient: patientId,
      motif: motif || undefined,
      examenClinique: examenClinique || undefined,
      poids: poids ? Number(poids) : undefined,
      taille: taille ? Number(taille) : undefined,
      perimetreCranien: perimetreCranien ? Number(perimetreCranien) : undefined,
      diagnostic: diagnostic || undefined,
      codeActe: codeActe || undefined,
    }

    const res = await fetch('/api/cms-proxy/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setShowForm(false)
      setMotif('')
      setExamenClinique('')
      setPoids('')
      setTaille('')
      setPerimetreCranien('')
      setDiagnostic('')
      setCodeActe('')
      router.refresh()
    }
    setSaving(false)
  }

  const inputClass = 'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none'

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <h2 className="font-heading text-lg font-semibold text-stone-800">Consultations</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800"
          >
            Nouvelle consultation
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Motif</label>
            <input value={motif} onChange={e => setMotif(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Examen clinique</label>
            <textarea rows={4} value={examenClinique} onChange={e => setExamenClinique(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Poids (kg)</label>
              <input type="number" step="0.1" value={poids} onChange={e => setPoids(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Taille (cm)</label>
              <input type="number" step="0.1" value={taille} onChange={e => setTaille(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">PC (cm)</label>
              <input type="number" step="0.1" value={perimetreCranien} onChange={e => setPerimetreCranien(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Diagnostic</label>
            <textarea rows={3} value={diagnostic} onChange={e => setDiagnostic(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Code acte (NGAP)</label>
            <input value={codeActe} onChange={e => setCodeActe(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50">
              {saving ? 'Enregistrement…' : 'Enregistrer la consultation'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-stone-500 hover:text-stone-700">
              Annuler
            </button>
          </div>
        </form>
      )}

      {consultations.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-stone-400">Aucune consultation.</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {consultations.map(c => (
            <div key={c.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-stone-800">
                  {new Date(c.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-xs text-stone-400">
                  {c.practitioner?.name || c.practitioner?.email || '—'}
                </span>
              </div>
              {c.motif && <p className="mt-1 text-sm text-stone-600">{c.motif}</p>}
              {(c.poids || c.taille || c.perimetreCranien) && (
                <p className="mt-0.5 text-xs text-stone-500">
                  {c.poids && `${c.poids} kg`}{c.poids && c.taille ? ' · ' : ''}{c.taille && `${c.taille} cm`}
                  {((c.poids || c.taille) && c.perimetreCranien) ? ' · ' : ''}{c.perimetreCranien && `PC ${c.perimetreCranien} cm`}
                </p>
              )}
              {c.diagnostic && <p className="mt-0.5 text-xs font-medium text-stone-700">{c.diagnostic}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
