import { getPayload } from 'payload'
import config from '../payload.config.js'

const baseData = {
  phone: '—',
  coordinates: { lat: 30.3576702, lng: -9.5279038 },
  schedules: [
    { day: 'Lun–Ven / الإثنين–الجمعة', open: '08:30', close: '16:30' },
    { day: 'Sam / السبت', open: '09:00', close: '13:00' },
  ],
}

const localeData: Record<string, Record<string, any>> = {
  fr: {
    address: 'Face au souk Al Houria, porte 10, Immeuble Nassim, 1er étage, bureau 4, Inezgane',
    pricing: [
      { children: [{ text: 'Paiement en espèces uniquement. Consultation à partir de ' }, { text: '200 MAD', bold: true }, { text: '.' }] },
    ],
  },
  ar: {
    address: 'أمام سوق الحورية، باب 10، عمارة نسيم، الطابق الأول، مكتب 4، إنزكان',
    pricing: [
      { children: [{ text: 'الدفع نقداً فقط. الاستشارة من ' }, { text: '200 درهم', bold: true }, { text: '.' }] },
    ],
  },
}

const doctorData = {
  name: 'Dr Guinane Aicha',
  slug: 'dr-guinane-aicha',
  rpps: '—',
  languages: [{ language: 'Français' }, { language: 'العربية' }],
}

const doctorLocaleData: Record<string, Record<string, any>> = {
  fr: {
    specialty: 'Pédiatre',
    bio: [
      { children: [{ text: "Pédiatre installée à Inezgane, dédiée à la santé et au bien-être des enfants de la région d'Agadir." }] },
    ],
  },
  ar: {
    specialty: 'طبيبة أطفال',
    bio: [
      { children: [{ text: 'طبيبة أطفال في إنزكان، مكرسة لصحة ورفاهية الأطفال في منطقة أكادير.' }] },
    ],
  },
}

async function seed() {
  const payload = await getPayload({ config })

  const existingPractice = await payload.findGlobal({
    slug: 'practice-info',
    depth: 0,
  })

  if (!existingPractice || !existingPractice.id) {
    // Seed each locale separately
    for (const [locale, data] of Object.entries(localeData)) {
      if (locale === 'fr') {
        await payload.updateGlobal({
          slug: 'practice-info',
          data: { ...baseData, ...data } as any,
          locale: 'fr' as any,
        })
      } else {
        await payload.updateGlobal({
          slug: 'practice-info',
          data: data as any,
          locale: locale as any,
        })
      }
    }
    console.log('✅ PracticeInfo seeded')
  } else {
    console.log('→ PracticeInfo already exists, skipping')
  }

  const existingDoctor = await payload.find({
    collection: 'doctors',
    where: { slug: { equals: 'dr-guinane-aicha' } },
    limit: 1,
  })

  if (existingDoctor.docs.length === 0) {
    const doc = await payload.create({
      collection: 'doctors',
      data: doctorData as any,
      locale: 'fr' as any,
    })

    for (const [locale, data] of Object.entries(doctorLocaleData)) {
      if (locale !== 'fr') {
        await payload.update({
          collection: 'doctors',
          id: doc.id,
          data: data as any,
          locale: locale as any,
        })
      }
    }
    console.log('✅ Doctor seeded')
  } else {
    console.log('→ Doctor already exists, skipping')
  }

  console.log('🎉 Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
