import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { notFound } from 'next/navigation'
import PatientNotesForm from './PatientNotesForm'

type Patient = {
  id: string
  fullName: string
  nationalId?: string
  medicalNotes?: string
  createdAt: string
  updatedAt: string
}

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params
  await requireAuth()

  const patient = await fetchCMS<Patient>(`/api/patients/${id}`, { revalidate: 0 })
  if (!patient) notFound()

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">{patient.fullName}</h1>
        <p className="mt-1 text-stone-500">
          CIN : {patient.nationalId || 'Non renseigné'} &middot; Créé le{' '}
          {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <PatientNotesForm patientId={patient.id} initialNotes={patient.medicalNotes || ''} />
    </div>
  )
}
