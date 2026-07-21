export type ScheduleEntry = {
  id: string
  vaccineName: string
  doseLabel: string
  ageMonths: number
  order?: number | null
  notes?: string | null
}

export type VaccinationData = {
  id: string
  vaccineName: string
  doseLabel: string
  dateAdministered: string
}

export type AlertStatus = 'overdue' | 'upcoming'
const MS_PER_MONTH = 30.44 * 24 * 60 * 60 * 1000

export function computeAgeMonths(birthDate: string): number {
  const now = new Date()
  const birth = new Date(birthDate)
  return (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()
}

export type PatientAlert = {
  patientId: string
  patientName: string
  patientGender?: string | null
  status: AlertStatus
  vaccines: { vaccineName: string; doseLabel: string; ageMonths: number }[]
}

export function computePatientAlerts(
  patientId: string,
  patientName: string,
  patientGender: string | null | undefined,
  patientBirthDate: string | null | undefined,
  schedule: ScheduleEntry[],
  vaccinations: VaccinationData[],
): PatientAlert | null {
  if (!patientBirthDate) return null

  const ageMonths = computeAgeMonths(patientBirthDate)
  const isBoy = patientGender === 'boy'
  const overdue: PatientAlert['vaccines'] = []
  const upcoming: PatientAlert['vaccines'] = []

  for (const entry of schedule) {
    if (entry.notes?.includes('Filles uniquement') && isBoy) continue

    const done = vaccinations.some(
      (v) => v.vaccineName === entry.vaccineName && v.doseLabel === entry.doseLabel,
    )
    if (done) continue

    if (ageMonths >= entry.ageMonths) {
      overdue.push({ vaccineName: entry.vaccineName, doseLabel: entry.doseLabel, ageMonths: entry.ageMonths })
    } else if (entry.ageMonths - ageMonths <= 1) {
      upcoming.push({ vaccineName: entry.vaccineName, doseLabel: entry.doseLabel, ageMonths: entry.ageMonths })
    }
  }

  if (overdue.length === 0 && upcoming.length === 0) return null

  const status: AlertStatus = overdue.length > 0 ? 'overdue' : 'upcoming'
  const vaccines = [...overdue, ...upcoming]
  return { patientId, patientName, patientGender, status, vaccines }
}
