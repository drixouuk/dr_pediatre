import type { CollectionAfterReadHook, CollectionAfterChangeHook } from 'payload'

async function writeAlert(payload: any, level: 'error' | 'critical', message: string, context: unknown) {
  try {
    await payload.create({
      collection: 'system-alerts',
      data: {
        level,
        message,
        context: JSON.parse(JSON.stringify(context)),
        timestamp: new Date().toISOString(),
      },
    })
  } catch {
    console.error('CRITICAL: audit log AND alert both failed', message, context)
  }
}

async function createAuditLog(req: any, action: string, doc: any) {
  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action,
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
  } catch (err) {
    console.error("Erreur lors de la création de l'Audit Log:", err)
    await writeAlert(req.payload, 'error', "Échec d'écriture audit-log", {
      action,
      documentId: doc.id,
      error: String(err),
    })
  }
}

export const logPatientReadAccess: CollectionAfterReadHook = async ({ req, doc }) => {
  if (!req.user) return doc
  await createAuditLog(req, 'read', doc)
  return doc
}

export const logPatientWriteAccess: CollectionAfterChangeHook = async ({ req, doc }) => {
  if (!req.user) return doc
  await createAuditLog(req, 'write', doc)
  return doc
}
