import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/auth'
import { fetchCMS } from '@/lib/cms-fetch'
import { getTenantById, getDoctorProfile, getPracticeInfo } from '@/lib/payload'
import { notFound } from 'next/navigation'
import PatientClinicalFields from './PatientClinicalFields'
import AddToQueueButton from './AddToQueueButton'
import ConsultationForm from './ConsultationForm'
import PrescriptionForm from './PrescriptionForm'
import DocumentUpload from './DocumentUpload'
import GrowthChart from './GrowthChart'
import VaccinationRecord from '@/components/dashboard/VaccinationRecord'
import ReferringPractitionersWidget from './ReferringPractitionersWidget'

import { computeAge } from '@/lib/age'
import type { DoctorInfo, PatientInfo } from '@/lib/generate-pdf'

type Patient = {
  id: string
  fullName: string
  gender?: string | null
  birthDate?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  nationalId?: string | null
  antecedents?: string
  allergies?: string
  traitementsEnCours?: string
  medicalNotes?: string
  createdAt: string
  updatedAt: string
}

export type Consultation = {
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

type VaccineScheduleEntry = {
  id: string
  vaccineName: string
  doseLabel: string
  ageMonths: number
  order?: number | null
  notes?: string | null
}

type VaccinationData = {
  id: string
  vaccineName: string
  doseLabel: string
  dateAdministered: string
}

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params
  const user = await requireAuth()

  const canViewClinical = user.roles?.includes('doctor') || user.roles?.includes('tenant_admin') || user.roles?.includes('superadmin')

  const tenantId = getTenantId(user)
  const tenant = tenantId ? await getTenantById(tenantId) : null
  const isPediatrie = tenant?.settings?.specialty === 'pediatrie'

  const [patient, consultationsData, prescriptionsData, documentsData, scheduleData, vaccinationsData, doctor, practiceInfo] = await Promise.all([
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
    canViewClinical && isPediatrie
      ? fetchCMS<{ docs: VaccineScheduleEntry[] }>(
          '/api/vaccine-schedule?sort=ageMonths&limit=100&depth=0',
          { revalidate: 60 },
        )
      : Promise.resolve(null),
    canViewClinical && isPediatrie
      ? fetchCMS<{ docs: VaccinationData[] }>(
          `/api/vaccinations?where[patient][equals]=${id}&depth=0&limit=100`,
          { revalidate: 0 },
        )
      : Promise.resolve(null),
    tenantId ? getDoctorProfile(tenantId, 'fr') : Promise.resolve(null),
    tenantId ? getPracticeInfo(tenantId, 'fr') : Promise.resolve(null),
  ])

  if (!patient) notFound()

  const consultations = consultationsData?.docs ?? []
  const prescriptions = prescriptionsData?.docs ?? []
  const documents = documentsData?.docs ?? []
  const vaccineSchedule = scheduleData?.docs ?? []
  const patientVaccinations = vaccinationsData?.docs ?? []

  const doctorInfo: DoctorInfo | undefined = doctor ? {
    name: doctor.name,
    specialty: doctor.specialty || '',
    rpps: doctor.rpps || '—',
    address: practiceInfo?.address || '',
    phone: practiceInfo?.phone || '',
    city: practiceInfo?.city || '',
  } : undefined

  const patientInfo: PatientInfo | undefined = patient ? {
    name: patient.fullName,
    age: patient.birthDate ? computeAge(patient.birthDate) : '',
    nationalId: patient.nationalId || undefined,
    birthDate: patient.birthDate || undefined,
  } : undefined

  return (
    <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">{patient.fullName}</h1>
        <div className="mt-1 space-y-1 text-sm">
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-stone-500">
            <span>CIN : {patient.nationalId || 'Non renseigné'}</span>
            {patient.birthDate && (
              <>
                <span>Né(e) le {new Date(patient.birthDate).toLocaleDateString('fr-FR')}</span>
                <span className="font-medium text-stone-700">{computeAge(patient.birthDate)}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-stone-500">
            {patient.address && <span>{patient.address}</span>}
            {patient.phone && <span>{patient.phone}</span>}
            {patient.email && <span>{patient.email}</span>}
            <span className="text-stone-400">Créé le {new Date(patient.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AddToQueueButton patientId={patient.id} />
      </div>

      <div className="mb-8 rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 px-4 py-3">
          <h2 className="font-heading text-lg font-semibold text-stone-800">Médecins référents</h2>
        </div>
        <div className="px-4 py-3">
          <ReferringPractitionersWidget patientId={patient.id} initialIds={(patient as any).referringPractitioners
            ? Array.isArray((patient as any).referringPractitioners)
              ? (patient as any).referringPractitioners.map((r: any) => typeof r === 'object' ? r.id : r)
              : []
            : []} />
        </div>
      </div>

      <div className="mb-8">
        <PatientClinicalFields
          patientId={patient.id}
          initialData={canViewClinical ? {
            medicalNotes: patient.medicalNotes,
            antecedents: patient.antecedents,
            allergies: patient.allergies,
            traitementsEnCours: patient.traitementsEnCours,
          } : null}
        />
      </div>

      {canViewClinical && isPediatrie && (
        <GrowthChart consultations={consultations} />
      )}

      {canViewClinical && isPediatrie && (
        <VaccinationRecord
          patientId={patient.id}
          schedule={vaccineSchedule}
          vaccinations={patientVaccinations}
          patientGender={patient.gender}
          patientBirthDate={patient.birthDate}
        />
      )}

      {canViewClinical && (
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ConsultationForm patientId={patient.id} consultations={consultations} isPediatrie={isPediatrie} doctorInfo={doctorInfo} patientInfo={patientInfo} />
          <PrescriptionForm patientId={patient.id} prescriptions={prescriptions} consultations={consultations} tenantId={tenantId} doctorInfo={doctorInfo} patientInfo={patientInfo} />
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
