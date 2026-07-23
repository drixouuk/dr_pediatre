export type LMSEntry = [number, number, number]
export type ReferenceTable = [number, number, number, number][]

export function computeZScore(measurement: number, L: number, M: number, S: number): number {
  if (L === 0) return Math.log(measurement / M) / S
  return (Math.pow(measurement / M, L) - 1) / (L * S)
}

export function zScoreToPercentile(z: number): number {
  const sign = z < 0 ? -1 : 1
  const x = Math.abs(z) / Math.SQRT2
  const t = 1 / (1 + 0.3275911 * x)
  const erf = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)
  const cdf = 0.5 * (1 + sign * erf)
  return Math.round(cdf * 1000) / 10
}

function interpolateLMS(table: ReferenceTable, ageMonths: number): { L: number; M: number; S: number } {
  if (ageMonths <= table[0][0]) return { L: table[0][1], M: table[0][2], S: table[0][3] }
  const last = table[table.length - 1]
  if (ageMonths >= last[0]) return { L: last[1], M: last[2], S: last[3] }
  for (let i = 0; i < table.length - 1; i++) {
    const [age1, L1, M1, S1] = table[i]
    const [age2, L2, M2, S2] = table[i + 1]
    if (ageMonths >= age1 && ageMonths <= age2) {
      const ratio = (ageMonths - age1) / (age2 - age1)
      return { L: L1 + ratio * (L2 - L1), M: M1 + ratio * (M2 - M1), S: S1 + ratio * (S2 - S1) }
    }
  }
  return { L: last[1], M: last[2], S: last[3] }
}

export function computeMeasurementZScore(value: number, ageMonths: number, table: ReferenceTable): { z: number; percentile: number } {
  const { L, M, S } = interpolateLMS(table, ageMonths)
  const z = computeZScore(value, L, M, S)
  const clampedZ = Math.max(-5, Math.min(5, z))
  return { z: clampedZ, percentile: zScoreToPercentile(clampedZ) }
}

export function generateReferenceCurves(table: ReferenceTable): { age: number; p3: number; p50: number; p97: number }[] {
  const Z = { p3: -1.881, p50: 0, p97: 1.881 }
  return table.map(([age, L, M, S]) => {
    const cv = (z: number) => parseFloat((L === 0 ? M * Math.exp(S * z) : M * Math.pow(1 + L * S * z, 1 / L)).toFixed(2))
    return { age, p3: cv(Z.p3), p50: cv(Z.p50), p97: cv(Z.p97) }
  })
}

export function percentileColor(percentile: number): string {
  if (percentile < 3) return '#EF4444'
  if (percentile > 97) return '#F97316'
  return '#0F766E'
}

export function percentileLabel(percentile: number): string {
  if (percentile < 3) return 'Sous le 3e percentile'
  if (percentile > 97) return 'Au-dessus du 97e percentile'
  if (percentile < 15) return 'Sous le 15e percentile'
  if (percentile > 85) return 'Au-dessus du 85e percentile'
  return 'Dans la norme'
}
