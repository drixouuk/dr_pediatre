import type { ReferenceTable } from './growth-lms'
import whoWfaBoys from '@/data/growth/who-wfa-boys.json'
import whoWfaGirls from '@/data/growth/who-wfa-girls.json'
import whoHfaBoys from '@/data/growth/who-hfa-boys.json'
import whoHfaGirls from '@/data/growth/who-hfa-girls.json'
import cdcWfaBoys from '@/data/growth/cdc-wfa-boys.json'
import cdcWfaGirls from '@/data/growth/cdc-wfa-girls.json'
import cdcHfaBoys from '@/data/growth/cdc-hfa-boys.json'
import cdcHfaGirls from '@/data/growth/cdc-hfa-girls.json'

const WHO_TABLES: Record<string, Record<string, ReferenceTable>> = {
  boy: { weight: whoWfaBoys as ReferenceTable, height: whoHfaBoys as ReferenceTable },
  girl: { weight: whoWfaGirls as ReferenceTable, height: whoHfaGirls as ReferenceTable },
}
const CDC_TABLES: Record<string, Record<string, ReferenceTable>> = {
  boy: { weight: cdcWfaBoys as ReferenceTable, height: cdcHfaBoys as ReferenceTable },
  girl: { weight: cdcWfaGirls as ReferenceTable, height: cdcHfaGirls as ReferenceTable },
}

export function getReferenceTable(ageMonths: number, gender: 'boy' | 'girl', measurement: 'weight' | 'height'): ReferenceTable {
  const tables = ageMonths < 24 ? WHO_TABLES : CDC_TABLES
  return tables[gender]?.[measurement] || []
}

export function ageAtDate(birthDateISO: string, measurementDateISO: string): number {
  const birth = new Date(birthDateISO)
  const measure = new Date(measurementDateISO)
  return (measure.getFullYear() - birth.getFullYear()) * 12 + measure.getMonth() - birth.getMonth()
}
