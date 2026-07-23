'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { generateConsultationPDF, type DoctorInfo, type PatientInfo } from '@/lib/generate-pdf'

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
  isPediatrie?: boolean
  doctorInfo?: DoctorInfo
  patientInfo?: PatientInfo
}

export default function ConsultationForm({ patientId, consultations, isPediatrie, doctorInfo, patientInfo }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const filteredConsultations = consultations.filter(c => {
    if (filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase()
      if (!c.motif?.toLowerCase().includes(q) && !c.diagnostic?.toLowerCase().includes(q)) return false
    }
    if (filterDateFrom && new Date(c.date) < new Date(filterDateFrom)) return false
    if (filterDateTo) {
      const end = new Date(filterDateTo)
      end.setHours(23, 59, 59, 999)
      if (new Date(c.date) > end) return false
    }
    return true
  })
  const [motif, setMotif] = useState('')
  const [examenClinique, setExamenClinique] = useState('')
  const [poids, setPoids] = useState('')
  const [taille, setTaille] = useState('')
  const [perimetreCranien, setPerimetreCranien] = useState('')
  const [diagnostic, setDiagnostic] = useState('')
  const [codeActe, setCodeActe] = useState('')
  const [error, setError] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [showTemplateSave, setShowTemplateSave] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templates, setTemplates] = useState<{ id: string; name: string; motif?: string; examenClinique?: string; diagnostic?: string; codeActe?: string }[]>([])

  useEffect(() => {
    fetch('/api/cms-proxy/templates?where[type][equals]=consultation&depth=0&limit=50')
      .then(r => r.json())
      .then(j => setTemplates(j.docs ?? []))
      .catch(() => {})
  }, [])

  const saveAsTemplate = async () => {
    if (!templateName.trim()) return
    setSavingTemplate(true)
    const res = await fetch('/api/cms-proxy/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: templateName.trim(),
        type: 'consultation',
        motif: motif || undefined,
        examenClinique: examenClinique || undefined,
        diagnostic: diagnostic || undefined,
        codeActe: codeActe || undefined,
      }),
    })
    if (res.ok) {
      const t = await fetch('/api/cms-proxy/templates?where[type][equals]=consultation&depth=0&limit=50')
      const j = await t.json()
      setTemplates(j.docs ?? [])
    }
    setShowTemplateSave(false)
    setTemplateName('')
    setSavingTemplate(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
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
    } else {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.")
    }
    setSaving(false)
  }

  const inputClass = 'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none'

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-semibold text-stone-800">Consultations</h2>
          {consultations.length > 0 && (
            <span className="text-xs text-stone-400">({filteredConsultations.length}/{consultations.length})</span>
          )}
        </div>
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
          {templates.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                defaultValue=""
                onChange={(e) => {
                  const t = templates.find(tmpl => tmpl.id === e.target.value)
                  if (t) {
                    setMotif(t.motif || '')
                    setExamenClinique(t.examenClinique || '')
                    setDiagnostic(t.diagnostic || '')
                    setCodeActe(t.codeActe || '')
                  }
                }}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              >
                <option value="">Charger un modèle...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Motif</label>
            <input value={motif} onChange={e => setMotif(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Examen clinique</label>
            <textarea rows={4} value={examenClinique} onChange={e => setExamenClinique(e.target.value)} className={inputClass} />
          </div>
          <div className={`grid gap-4 ${isPediatrie ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Poids (kg)</label>
              <input type="number" step="0.1" value={poids} onChange={e => setPoids(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Taille (cm)</label>
              <input type="number" step="0.1" value={taille} onChange={e => setTaille(e.target.value)} className={inputClass} />
            </div>
            {isPediatrie && (
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">PC (cm)</label>
                <input type="number" step="0.1" value={perimetreCranien} onChange={e => setPerimetreCranien(e.target.value)} className={inputClass} />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Diagnostic</label>
            <textarea rows={3} value={diagnostic} onChange={e => setDiagnostic(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Code acte (NGAP)</label>
            <input value={codeActe} onChange={e => setCodeActe(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50">
              {saving ? 'Enregistrement…' : 'Enregistrer la consultation'}
            </button>
            {!showTemplateSave ? (
              <button type="button" onClick={() => setShowTemplateSave(true)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">
                Sauvegarder comme modèle
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input value={templateName} onChange={e => setTemplateName(e.target.value)}
                  placeholder="Nom du modèle" autoFocus
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" />
                <button type="button" onClick={saveAsTemplate} disabled={savingTemplate || !templateName.trim()}
                  className="rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50">
                  Enregistrer
                </button>
                <button type="button" onClick={() => { setShowTemplateSave(false); setTemplateName('') }}
                  className="text-sm text-stone-500 hover:text-stone-700">
                  Annuler
                </button>
              </div>
            )}
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-stone-500 hover:text-stone-700">
              Annuler
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}

      {consultations.length > 0 && (
        <div className="border-b border-stone-100 px-4 py-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[180px] flex-1">
              <label className="mb-0.5 block text-xs text-stone-500">Rechercher</label>
              <input type="text" value={filterQuery} onChange={e => setFilterQuery(e.target.value)}
                placeholder="Motif, diagnostic..."
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-700 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-stone-500">Du</label>
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-stone-500">Au</label>
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>
            {(filterQuery || filterDateFrom || filterDateTo) && (
              <button onClick={() => { setFilterQuery(''); setFilterDateFrom(''); setFilterDateTo('') }}
                className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors duration-200">
                Effacer
              </button>
            )}
          </div>
        </div>
      )}

      {filteredConsultations.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-stone-400">
          {consultations.length > 0 ? 'Aucune consultation ne correspond à la recherche.' : 'Aucune consultation.'}
        </p>
      ) : (
        <div className="divide-y divide-stone-100">
          {filteredConsultations.map(c => (
            <div key={c.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-stone-800">
                  {new Date(c.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-2">
                  {c.diagnostic && doctorInfo && patientInfo && (
                    <button
                      onClick={() => generateConsultationPDF(doctorInfo, patientInfo, {
                        date: new Date(c.date).toLocaleDateString('fr-FR'),
                        motif: c.motif,
                        diagnostic: c.diagnostic,
                        poids: c.poids,
                        taille: c.taille,
                        perimetreCranien: c.perimetreCranien,
                      })}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      title="Télécharger le certificat PDF"
                    >
                      PDF
                    </button>
                  )}
                  <span className="text-xs text-stone-400">
                    {c.practitioner?.name || c.practitioner?.email || '—'}
                  </span>
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
