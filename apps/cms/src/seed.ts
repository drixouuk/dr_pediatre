import { getPayload } from 'payload'
import config from '../payload.config.js'

const lexical = (text: string, dir: 'ltr' | 'rtl' = 'ltr') => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      },
    ],
    direction: dir,
    format: '',
    indent: 0,
    version: 1,
  },
})

const lexicalMixed = (
  segments: { text: string; bold?: boolean }[],
  dir: 'ltr' | 'rtl' = 'ltr',
) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: segments.map((s) => ({
          type: 'text' as const,
          text: s.text,
          ...(s.bold ? { bold: true } : {}),
          version: 1,
        })),
      },
    ],
    direction: dir,
    format: '',
    indent: 0,
    version: 1,
  },
})

const baseData = {
  phone: '—',
  coordinates: { lat: 30.3576702, lng: -9.5279038 },
  schedules: [
    { day: 'Lun–Ven / الإثنين–الجمعة', open: '08:30', close: '16:30' },
    { day: 'Sam / السبت', open: '09:00', close: '13:00' },
  ],
}

const LOCALES = ['fr', 'en', 'ar'] as const

const localeData: Record<string, Record<string, any>> = {
  fr: {
    address: 'Face au souk Al Houria, porte 10, Immeuble Nassim, 1er étage, bureau 4, Inezgane',
    pricing: lexicalMixed([
      { text: 'Paiement en espèces uniquement. Consultation à partir de ' },
      { text: '200 MAD', bold: true },
      { text: '.' },
    ]),
  },
  en: {
    address: 'Face au souk Al Houria, door 10, Immeuble Nassim, 1st floor, office 4, Inezgane',
    pricing: lexicalMixed([
      { text: 'Cash payment only. Consultation from ' },
      { text: '200 MAD', bold: true },
      { text: '.' },
    ]),
  },
  ar: {
    address: 'أمام سوق الحورية، باب 10، عمارة نسيم، الطابق الأول، مكتب 4، إنزكان',
    pricing: lexicalMixed(
      [
        { text: 'الدفع نقداً فقط. الاستشارة من ' },
        { text: '200 درهم', bold: true },
        { text: '.' },
      ],
      'rtl',
    ),
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
    bio: lexical("Pédiatre installée à Inezgane, dédiée à la santé et au bien-être des enfants de la région d'Agadir."),
  },
  en: {
    specialty: 'Pediatrician',
    bio: lexical('Pediatrician based in Inezgane, dedicated to the health and well-being of children in the Agadir region.'),
  },
  ar: {
    specialty: 'طبيبة أطفال',
    bio: lexical('طبيبة أطفال في إنزكان، مكرسة لصحة ورفاهية الأطفال في منطقة أكادير.', 'rtl'),
  },
}

async function seed() {
  const payload = await getPayload({ config })

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

  const existingDoctor = await payload.find({
    collection: 'doctors',
    where: { slug: { equals: 'dr-guinane-aicha' } },
    limit: 1,
  })

  let doctor
  if (existingDoctor.docs.length === 0) {
    doctor = await payload.create({
      collection: 'doctors',
      data: doctorData as any,
    })
  } else {
    doctor = existingDoctor.docs[0]
  }

  for (const [locale, data] of Object.entries(doctorLocaleData)) {
    await payload.update({
      collection: 'doctors',
      id: doctor.id,
      data: data as any,
      locale: locale as any,
    })
  }
  console.log('✅ Doctor seeded')

  const existingReviews = await payload.find({
    collection: 'reviews',
    limit: 1,
  })

  if (existingReviews.docs.length === 0) {
    const reviewsData = [
      { author: 'Ahmed Sam', rating: 5, text: "Docteur très compétente, très à l'écoute, diagnostic rapide bronchite sévère chez ma fille, oxygène directement sur place. Elle prescrit juste ce qu'il faut. Je vous la recommande les yeux fermés.", date: '2025-11-25', source: 'google' },
      { author: 'Mohamed Lhbib AGUENAOU', rating: 5, text: 'Très bonne pédiatre. Merci beaucoup dr.', date: '2026-01-25', source: 'google' },
      { author: 'Brahim Bouhouch', rating: 5, text: "Je recommande à 100% c'est une personne très sympathique et très professionnelle, très agréable et à l'écoute qui prend le temps d'expliquer et de rassurer les parents et l'enfant.", date: '2025-08-25', source: 'google' },
      { author: 'MB. PRODUCTION', rating: 5, text: "Je lui donnerai plus de 5 étoiles si je pouvais. Dr GUINANE AICHA est d'une extrême gentillesse et bienveillance, surtout pas matérialiste. Elle est toujours disponible et joignable.", date: '2025-06-25', source: 'google' },
      { author: 'Anouar El boukili', rating: 5, text: "Une des meilleures médecins. Dès notre première consultation, j'ai été impressionné par son professionnalisme et sa bienveillance. Elle a su mettre mon enfant à l'aise.", date: '2025-06-20', source: 'google' },
      { author: 'laila FOUAD', rating: 5, text: 'Dre Guinane est une pédiatre très compétente. Elle fait preuve d\'un grand professionnalisme et d\'une patience remarquable, même dans les situations imprévues.', date: '2025-06-15', source: 'google' },
      { author: 'Halima KEDDAR', rating: 5, text: 'Une pédiatre exceptionnelle, dotée d\'une grande expertise et de traitements efficaces. Son approche avec les enfants est douce et professionnelle. Je la recommande vivement.', date: '2025-06-10', source: 'google' },
      { author: 'Inès NEJJAR', rating: 4, text: 'Médecin humaine à l\'écoute, très satisfaite de la consultation pour mon petit. Elle ne prescrit pas trop de médicaments. J\'aimerais juste que l\'accueil s\'améliore.', date: '2025-06-05', source: 'google' },
      { author: 'Zayad Mariam', rating: 5, text: 'Je vous la recommande sans hésiter, une pédiatre douce à l\'écoute, humaine, professionnelle, toujours souriante. Ma petite fille vous adore. Merci Dr Guinane, tbark allah 3lik.', date: '2025-05-30', source: 'google' },
      { author: 'assia moutaaziz', rating: 5, text: 'Médecin très compétente, humaine et attentive qui accorde le temps qu\'il faut pour chaque patient. Je la recommande vivement.', date: '2025-05-25', source: 'google' },
      { author: 'imane shimou', rating: 5, text: 'Dr Aicha une pédiatre attentionnée, compétente, elle a de l\'intérêt pour le malade. Sincèrement elle est la meilleure, je la recommande vivement.', date: '2025-05-20', source: 'google' },
    ]

    for (const review of reviewsData) {
      await payload.create({
        collection: 'reviews',
        data: {
          author: review.author,
          rating: review.rating,
          text: review.text,
          date: review.date,
          source: review.source as 'google' | 'direct',
          published: true,
        } as any,
        locale: 'fr' as any,
      })
    }
    console.log('✅ 11 reviews seeded')
  } else {
    console.log('→ Reviews already exist, skipping')
  }

  console.log('🎉 Seed complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
