export function computeAge(birthDate: string): string {
  const now = new Date()
  const birth = new Date(birthDate)
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth()

  if (months < 1) return 'Nouveau-né'
  if (months < 24) return `${months} mois`
  const years = Math.floor(months / 12)
  return `${years} ans`
}
