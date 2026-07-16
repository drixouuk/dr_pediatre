import type { PayloadHandler, PayloadRequest } from 'payload'

export const resolveTenant: PayloadHandler = async (req: PayloadRequest) => {
  const domain = req.query?.domain as string | undefined

  if (!domain) {
    return Response.json({ error: 'Missing domain query parameter' }, { status: 400 })
  }

  try {
    const result = await req.payload.find({
      collection: 'tenants',
      where: { domain: { equals: domain } },
      depth: 0,
      limit: 1,
    })

    const doc = result.docs?.[0]
    if (!doc) {
      return Response.json({ tenant: null }, { status: 200 })
    }

    return Response.json({
      tenant: {
        id: doc.id,
        slug: (doc as any).slug || doc.id,
        name: (doc as any).name,
      },
    })
  } catch {
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
