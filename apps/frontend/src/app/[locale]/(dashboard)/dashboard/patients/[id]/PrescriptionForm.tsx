'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { generatePrescriptionPDF, type DoctorInfo, type PatientInfo } from '@/lib/generate-pdf'

type MedicationSuggestion = {
  nom: string
  dci: string
  posologie: string
  duree: string
  count: number
}

type Medication = {
  nom: string
  dci: string
  posologie: string
  duree: string
}

type TemplateDoc = {
  id: string
  name: string
  medications?: { nom: string; dci: string; posologie: string; duree: string }[]
  notes?: string | null
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
  tenantId?: string
  doctorInfo?: DoctorInfo
  patientInfo?: PatientInfo
}

export default function PrescriptionForm({ patientId, prescriptions, consultations, tenantId, doctorInfo, patientInfo }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')

  const filteredPrescriptions = prescriptions.filter(p => {
    if (filterQuery.trim()) {
      const q = filterQuery.trim().toLowerCase()
      const inMeds = p.medications?.some(m => m.nom?.toLowerCase().includes(q))
      const inNotes = p.notes?.toLowerCase().includes(q)
      if (!inMeds && !inNotes) return false
    }
    if (filterDateFrom && new Date(p.date) < new Date(filterDateFrom)) return false
    if (filterDateTo) {
      const end = new Date(filterDateTo)
      end.setHours(23, 59, 59, 999)
      if (new Date(p.date) > end) return false
    }
    return true
  })
  const [medications, setMedications] = useState<Medication[]>([
    { nom: '', dci: '', posologie: '', duree: '' },
  ])
  const [notes, setNotes] = useState('')
  const [consultationId, setConsultationId] = useState(
    consultations.length > 0 ? consultations[0].id : '',
  )
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templates, setTemplates] = useState<TemplateDoc[]>([])
  const [suggestions, setSuggestions] = useState<Record<number, MedicationSuggestion[]>>({})
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({})
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const searchMedications = async (i: number, query: string) => {
    if (query.trim().length < 2) {
      setSuggestions(prev => ({ ...prev, [i]: [] }))
      setOpenDropdown(null)
      return
    }
    setLoadingSuggestions(true)
    const res = await fetch(`/api/medications/autocomplete?q=${encodeURIComponent(query.trim())}`)
    if (res.ok) {
      const data = await res.json()
      setSuggestions(prev => ({ ...prev, [i]: data.suggestions ?? [] }))
      if (data.suggestions?.length > 0) setOpenDropdown(i)
    }
    setLoadingSuggestions(false)
  }

  useEffect(() => {
    fetch('/api/cms-proxy/templates?where[type][equals]=prescription&depth=0&limit=50')
      .then(r => r.json())
      .then(j => setTemplates(j.docs ?? []))
      .catch(() => {})
  }, [])

  const saveAsTemplate = async () => {
    const name = prompt('Nom du modèle :')
    if (!name?.trim()) return
    setSavingTemplate(true)
    const res = await fetch('/api/cms-proxy/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        type: 'prescription',
        medications: medications.filter(m => m.nom.trim()),
        notes: notes || undefined,
      }),
    })
    if (res.ok) {
      const t = await fetch('/api/cms-proxy/templates?where[type][equals]=prescription&depth=0&limit=50')
      const j = await t.json()
      setTemplates(j.docs ?? [])
    }
    setSavingTemplate(false)
  }

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
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-semibold text-stone-800">Ordonnances</h2>
          {prescriptions.length > 0 && (
            <span className="text-xs text-stone-400">({filteredPrescriptions.length}/{prescriptions.length})</span>
          )}
        </div>
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
          {templates.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                defaultValue=""
                onChange={(e) => {
                  const t = templates.find(tmpl => tmpl.id === e.target.value)
                  if (t) {
                    if (t.medications?.length) setMedications(t.medications)
                    if (t.notes) setNotes(t.notes)
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
          {medications.map((med, i) => (
            <div key={i} className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500">Médicament {i + 1}</span>
                {medications.length > 1 && (
                  <button type="button" onClick={() => removeMedication(i)} className="text-xs text-red-500 hover:text-red-700">Retirer</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="mb-0.5 block text-xs text-stone-600">Nom *</label>
                  <input
                    ref={(el) => { inputRefs.current[i] = el }}
                    value={med.nom}
                    onChange={e => {
                      const val = e.target.value
                      updateMed(i, 'nom', val)
                      if (debounceRef.current[i]) clearTimeout(debounceRef.current[i])
                      debounceRef.current[i] = setTimeout(() => searchMedications(i, val), 300)
                    }}
                    onFocus={() => { if (med.nom.trim().length >= 2) searchMedications(i, med.nom) }}
                    onBlur={() => setTimeout(() => setOpenDropdown(curr => curr === i ? null : curr), 200)}
                    required
                    className={inputClass}
                    autoComplete="off"
                  />
                  {openDropdown === i && suggestions[i]?.length > 0 && (
                    <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
                      {suggestions[i].map((s, si) => (
                        <button
                          key={si}
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); updateMed(i, 'nom', s.nom); updateMed(i, 'dci', s.dci); updateMed(i, 'posologie', s.posologie); updateMed(i, 'duree', s.duree); setOpenDropdown(null) }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-stone-700 transition-colors duration-200 hover:bg-primary-50"
                        >
                          <span className="font-medium">{s.nom}</span>
                          <span className="text-xs text-stone-400">{s.count !== undefined && `×${s.count}`}</span>
                        </button>
                      ))}
                    </div>
                  )}
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

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50">
              {saving ? 'Enregistrement…' : 'Enregistrer l\'ordonnance'}
            </button>
            <button type="button" onClick={saveAsTemplate} disabled={savingTemplate}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50">
              {savingTemplate ? 'Enregistrement…' : 'Sauvegarder comme modèle'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-stone-500 hover:text-stone-700">Annuler</button>
          </div>
        </form>
      )}

      {prescriptions.length > 0 && (
        <div className="border-b border-stone-100 px-4 py-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[180px] flex-1">
              <label className="mb-0.5 block text-xs text-stone-500">Rechercher</label>
              <input type="text" value={filterQuery} onChange={e => setFilterQuery(e.target.value)}
                placeholder="Médicament, notes..."
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

      {filteredPrescriptions.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-stone-400">
          {prescriptions.length > 0 ? 'Aucune ordonnance ne correspond à la recherche.' : 'Aucune ordonnance.'}
        </p>
      ) : (
        <div className="divide-y divide-stone-100">
          {filteredPrescriptions.map(p => (
            <div key={p.id} className="px-4 py-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-stone-800">
                  {new Date(p.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-2">
                  {p.medications?.length > 0 && doctorInfo && patientInfo && (
                    <button
                      onClick={() => generatePrescriptionPDF(doctorInfo, patientInfo, {
                        date: new Date(p.date).toLocaleDateString('fr-FR'),
                        medications: p.medications,
                        notes: p.notes,
                      })}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      title="Télécharger l'ordonnance PDF"
                    >
                      PDF
                    </button>
                  )}
                  <span className="text-xs text-stone-400">
                    {p.practitioner?.name || p.practitioner?.email || '—'}
                  </span>
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
