import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { notFound } from 'next/navigation'
import PatientNotesForm from './PatientNotesForm'
import AddToQueueButton from './AddToQueueButton'
import ConsultationForm from './ConsultationForm'
import PrescriptionForm from './PrescriptionForm'
import DocumentUpload from './DocumentUpload'

import { computeAge } from '@/lib/age'

type Patient = {
  id: string
  fullName: string
  gender?: string | null
  birthDate?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  nationalId?: string | null
  medicalNotes?: string
  createdAt: string
  updatedAt: string
}

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

type Document = {
  id: string
  documentType: string
  filename?: string
  url?: string
  createdAt: string
}

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params
  const user = await requireAuth()

  const canViewClinical = user.roles?.includes('doctor') || user.roles?.includes('tenant_admin') || user.roles?.includes('superadmin')

  const [patient, consultationsData, prescriptionsData, documentsData] = await Promise.all([
    fetchCMS<Patient>(`/api/patients/${id}`, { revalidate: 0 }),
    canViewClinical
      ? fetchCMS<{ docs: Consultation[] }>(
          `/api/consultations?where[patient][equals]=${id}&sort=-date&depth=1&limit=50`,
          { revalidate: 0 },
        )
      : Promise.resolve(null),
    canViewClinical
      ? fetchCMS<{ docs: Prescription[] }>(
          `/api/prescriptions?where[patient][equals]=${id}&sort=-date&depth=1&limit=50`,
          { revalidate: 0 },
        )
      : Promise.resolve(null),
    canViewClinical
      ? fetchCMS<{ docs: Document[] }>(
          `/api/documents?where[patient][equals]=${id}&sort=-createdAt&depth=0&limit=50`,
          { revalidate: 0 },
        )
      : Promise.resolve(null),
  ])

  if (!patient) notFound()

  const consultations = consultationsData?.docs ?? []
  const prescriptions = prescriptionsData?.docs ?? []
  const documents = documentsData?.docs ?? []

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">{patient.fullName}</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
          <span>CIN : {patient.nationalId || 'Non renseigné'}</span>
          {patient.birthDate && (
            <>
              <span>Né(e) le {new Date(patient.birthDate).toLocaleDateString('fr-FR')}</span>
              <span className="font-medium text-stone-700">{computeAge(patient.birthDate)}</span>
            </>
          )}
          {patient.address && <span>Adresse : {patient.address}</span>}
          {patient.phone && <span>Tél : {patient.phone}</span>}
          {patient.email && <span>Email : {patient.email}</span>}
          <span>Créé le {new Date(patient.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      <div className="mb-8">
        <AddToQueueButton patientId={patient.id} />
      </div>

      <div className="mb-8">
        <PatientNotesForm patientId={patient.id} initialNotes={patient.medicalNotes || ''} />
      </div>

      {canViewClinical && (
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ConsultationForm patientId={patient.id} consultations={consultations} />
          <PrescriptionForm patientId={patient.id} prescriptions={prescriptions} consultations={consultations} />
        </div>
      )}

      {canViewClinical && (
        <div className="mb-8">
          <DocumentUpload patientId={patient.id} documents={documents} />
        </div>
      )}
    </div>
  )
}
