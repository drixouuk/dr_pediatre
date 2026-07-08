import type { CollectionAfterReadHook, CollectionAfterChangeHook } from 'payload'

export const logPatientReadAccess: CollectionAfterReadHook = async ({ req, doc }) => {
  if (!req.user) return doc

  await req.payload
    .create({
      collection: 'audit-logs',
      data: {
        action: 'read',
        collectionName: 'patients',
        documentId: doc.id as string,
        user: req.user.id,
        tenant:
          typeof req.user.tenant === 'object'
            ? (req.user.tenant as any).id
            : (req.user as any).tenant,
        timestamp: new Date().toISOString(),
      },
    })
    .catch((err: unknown) =>
      console.error("Erreur lors de la création de l'Audit Log (read):", err),
    )

  return doc
}

export const logPatientWriteAccess: CollectionAfterChangeHook = async ({ req, doc }) => {
  if (!req.user) return doc

  await req.payload
    .create({
      collection: 'audit-logs',
      data: {
        action: 'write',
        collectionName: 'patients',
        documentId: doc.id as string,
        user: req.user.id,
        tenant:
          typeof req.user.tenant === 'object'
            ? (req.user.tenant as any).id
            : (req.user as any).tenant,
        timestamp: new Date().toISOString(),
      },
    })
    .catch((err: unknown) =>
      console.error("Erreur lors de la création de l'Audit Log (write):", err),
    )

  return doc
}
