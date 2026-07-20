import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { notFound } from 'next/navigation'
import PatientNotesForm from './PatientNotesForm'
import AddToQueueButton from './AddToQueueButton'
import ConsultationForm from './ConsultationForm'
import PrescriptionForm from './PrescriptionForm'
import DocumentUpload from './DocumentUpload'

type Patient = {
  id: string
  fullName: string
  nationalId?: string
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
  await requireAuth()

  const [patient, consultationsData, prescriptionsData, documentsData] = await Promise.all([
    fetchCMS<Patient>(`/api/patients/${id}`, { revalidate: 0 }),
    fetchCMS<{ docs: Consultation[] }>(
      `/api/consultations?where[patient][equals]=${id}&sort=-date&depth=1&limit=50`,
      { revalidate: 0 },
    ),
    fetchCMS<{ docs: Prescription[] }>(
      `/api/prescriptions?where[patient][equals]=${id}&sort=-date&depth=1&limit=50`,
      { revalidate: 0 },
    ),
    fetchCMS<{ docs: Document[] }>(
      `/api/documents?where[patient][equals]=${id}&sort=-createdAt&depth=0&limit=50`,
      { revalidate: 0 },
    ),
  ])

  if (!patient) notFound()

  const consultations = consultationsData?.docs ?? []
  const prescriptions = prescriptionsData?.docs ?? []
  const documents = documentsData?.docs ?? []

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">{patient.fullName}</h1>
        <p className="mt-1 text-stone-500">
          CIN : {patient.nationalId || 'Non renseigné'} &middot; Créé le{' '}
          {new Date(patient.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div className="mb-8">
        <AddToQueueButton patientId={patient.id} />
      </div>

      <div className="mb-8">
        <PatientNotesForm patientId={patient.id} initialNotes={patient.medicalNotes || ''} />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConsultationForm patientId={patient.id} consultations={consultations} />
        <PrescriptionForm patientId={patient.id} prescriptions={prescriptions} consultations={consultations} />
      </div>

      <div className="mb-8">
        <DocumentUpload patientId={patient.id} documents={documents} />
      </div>
    </div>
  )
}
