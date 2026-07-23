export function getTenantId(user: { tenant?: string | { id: string } | null }): string | undefined {
  if (!user?.tenant) return undefined
  return typeof user.tenant === 'object' ? (user.tenant as { id: string }).id : user.tenant
}

export function getDoctorProfileId(user: { doctorProfile?: string | { id: string } | null }): string | undefined {
  if (!user?.doctorProfile) return undefined
  return typeof user.doctorProfile === 'object' ? (user.doctorProfile as { id: string }).id : user.doctorProfile
}
