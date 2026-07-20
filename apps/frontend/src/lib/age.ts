export function computeAge(birthDate: string): string {
  const now = new Date()
  const birth = new Date(birthDate)
  const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

  if (totalMonths < 1) return 'Nouveau-né'
  if (totalMonths < 24) return `${totalMonths} mois`
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (months === 0) return `${years} ans`
  return `${years} ans et ${months} mois`
}
