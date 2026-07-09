import type { Payload } from "payload";

const lexical = (text: string, dir: "ltr" | "rtl" = "ltr") => ({
  root: {
    type: "root",
    children: [
      {
        type: "paragraph",
        version: 1,
        children: [{ type: "text", text, version: 1 }],
      },
    ],
    direction: dir,
    format: "",
    indent: 0,
    version: 1,
  },
});

const lexicalMixed = (
  segments: { text: string; bold?: boolean }[],
  dir: "ltr" | "rtl" = "ltr",
) => ({
  root: {
    type: "root",
    children: [
      {
        type: "paragraph",
        version: 1,
        children: segments.map((s) => ({
          type: "text" as const,
          text: s.text,
          ...(s.bold ? { bold: true } : {}),
          version: 1,
        })),
      },
    ],
    direction: dir,
    format: "",
    indent: 0,
    version: 1,
  },
});

const TENANT_SLUG = "dr-guinane";
const TENANT_DOMAIN = "drguinane.drixou.uk";

const DOCTOR_EMAIL = "drguinane.drixou.uk";

async function seedTenant(payload: Payload) {
  const existing = await payload.find({
    collection: "tenants",
    where: { domain: { equals: TENANT_DOMAIN } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log("→ Tenant already exists, skipping");
    return existing.docs[0];
  }

  const tenant = await payload.create({
    collection: "tenants",
    data: {
      name: "Cabinet Pédiatrique Dr. Guinane Aïcha",
      domain: TENANT_DOMAIN,
      settings: {
        defaultLocale: "fr",
        activeTier: "clinique",
      },
      calcomSettings: {
        eventSlug: "consultation-pediatrique",
        username: "drixou",
        customUrl: "https://calcom.drixou.uk",
      },
    },
  });

  console.log("✅ Tenant created");
  return tenant;
}

async function seedDoctorUser(payload: Payload, tenantId: any) {
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: DOCTOR_EMAIL } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log("→ Doctor user already exists, skipping");
    return existing.docs[0];
  }

  const user = await payload.create({
    collection: "users",
    data: {
      email: DOCTOR_EMAIL,
      password: process.env.SEED_DOCTOR_PASSWORD ?? "changeme123",
      name: "Dr Guinane Aicha",
      roles: ["tenant_admin", "doctor"],
      tenant: tenantId,
    },
  });

  console.log("✅ Doctor user created");
  return user;
}

async function seedDoctor(payload: Payload, tenantId: any) {
  const existing = await payload.find({
    collection: "doctors",
    where: { slug: { equals: "dr-guinane-aicha" } },
    limit: 1,
  });

  let doctor: any;
  if (existing.docs.length === 0) {
    doctor = await payload.create({
      collection: "doctors",
      data: {
        tenant: tenantId,
        name: "Dr Guinane Aicha",
        slug: "dr-guinane-aicha",
        rpps: "—",
        languages: [{ language: "Français" }, { language: "العربية" }],
      } as any,
    });
  } else {
    doctor = existing.docs[0];
  }

  const localeData: Record<string, Record<string, any>> = {
    fr: {
      specialty: "Pédiatre",
      bio: lexical(
        "Pédiatre installée à Inezgane, dédiée à la santé et au bien-être des enfants de la région d'Agadir.",
      ),
    },
    en: {
      specialty: "Pediatrician",
      bio: lexical(
        "Pediatrician based in Inezgane, dedicated to the health and well-being of children in the Agadir region.",
      ),
    },
    ar: {
      specialty: "طبيبة أطفال",
      bio: lexical(
        "طبيبة أطفال في إنزكان، مكرسة لصحة ورفاهية الأطفال في منطقة أكادير.",
        "rtl",
      ),
    },
  };

  for (const [locale, data] of Object.entries(localeData)) {
    await payload.update({
      collection: "doctors",
      id: doctor.id,
      data: data as any,
      locale: locale as any,
    });
  }
  console.log("✅ Doctor seeded");
}

async function seedPracticeInfo(payload: Payload) {
  const baseData = {
    phone: "+212 6XX XXX XXX",
    coordinates: { lat: 30.3576702, lng: -9.5279038 },
    schedules: [
      { day: "Lun–Ven / الإثنين–الجمعة", open: "09:00", close: "16:30" },
      { day: "Sam / السبت", open: "09:00", close: "13:00" },
    ],
  };

  const localeData: Record<string, Record<string, any>> = {
    fr: {
      address:
        "Face au souk Al Houria, porte 10, Immeuble Nassim, 1er étage, bureau 4, Inezgane",
      pricing: lexicalMixed([
        { text: "Paiement en espèces uniquement. Consultation à partir de " },
        { text: "250 MAD", bold: true },
        { text: "." },
      ]),
    },
    en: {
      address:
        "Face au souk Al Houria, door 10, Immeuble Nassim, 1st floor, office 4, Inezgane",
      pricing: lexicalMixed([
        { text: "Cash payment only. Consultation from " },
        { text: "250 MAD", bold: true },
        { text: "." },
      ]),
    },
    ar: {
      address:
        "أمام سوق الحورية، باب 10، عمارة نسيم، الطابق الأول، مكتب 4، إنزكان",
      pricing: lexicalMixed(
        [
          { text: "الدفع نقداً فقط. الاستشارة من " },
          { text: "250 درهم", bold: true },
          { text: "." },
        ],
        "rtl",
      ),
    },
  };

  for (const [locale, data] of Object.entries(localeData)) {
    if (locale === "fr") {
      await payload.updateGlobal({
        slug: "practice-info",
        data: { ...baseData, ...data } as any,
        locale: "fr" as any,
      });
    } else {
      await payload.updateGlobal({
        slug: "practice-info",
        data: data as any,
        locale: locale as any,
      });
    }
  }
  console.log("✅ PracticeInfo seeded");
}

async function seedReviews(payload: Payload, tenantId: any) {
  const existing = await payload.find({
    collection: "reviews",
    where: { tenant: { equals: tenantId } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log("→ Reviews already exist, skipping");
    return;
  }

  const reviewsData = [
    {
      author: "Ahmed Sam",
      rating: 5,
      text: "Docteur très compétente, très à l'écoute, diagnostic rapide bronchite sévère chez ma fille, oxygène directement sur place. Elle prescrit juste ce qu'il faut. Je vous la recommande les yeux fermés.",
      date: "2025-11-25",
      source: "google",
    },
    {
      author: "Mohamed Lhbib AGUENAOU",
      rating: 5,
      text: "Très bonne pédiatre. Merci beaucoup dr.",
      date: "2026-01-25",
      source: "google",
    },
    {
      author: "Brahim Bouhouch",
      rating: 5,
      text: "Je recommande à 100% c'est une personne très sympathique et très professionnelle, très agréable et à l'écoute qui prend le temps d'expliquer et de rassurer les parents et l'enfant.",
      date: "2025-08-25",
      source: "google",
    },
    {
      author: "MB. PRODUCTION",
      rating: 5,
      text: "Je lui donnerai plus de 5 étoiles si je pouvais. Dr GUINANE AICHA est d'une extrême gentillesse et bienveillance, surtout pas matérialiste. Elle est toujours disponible et joignable.",
      date: "2025-06-25",
      source: "google",
    },
    {
      author: "Anouar El boukili",
      rating: 5,
      text: "Une des meilleures médecins. Dès notre première consultation, j'ai été impressionné par son professionnalisme et sa bienveillance. Elle a su mettre mon enfant à l'aise.",
      date: "2025-06-20",
      source: "google",
    },
    {
      author: "laila FOUAD",
      rating: 5,
      text: "Dre Guinane est une pédiatre très compétente. Elle fait preuve d'un grand professionnalisme et d'une patience remarquable, même dans les situations imprévues.",
      date: "2025-06-15",
      source: "google",
    },
    {
      author: "Halima KEDDAR",
      rating: 5,
      text: "Une pédiatre exceptionnelle, dotée d'une grande expertise et de traitements efficaces. Son approche avec les enfants est douce et professionnelle. Je la recommande vivement.",
      date: "2025-06-10",
      source: "google",
    },
    {
      author: "Inès NEJJAR",
      rating: 4,
      text: "Médecin humaine à l'écoute, très satisfaite de la consultation pour mon petit. Elle ne prescrit pas trop de médicaments. J'aimerais juste que l'accueil s'améliore.",
      date: "2025-06-05",
      source: "google",
    },
    {
      author: "Zayad Mariam",
      rating: 5,
      text: "Je vous la recommande sans hésiter, une pédiatre douce à l'écoute, humaine, professionnelle, toujours souriante. Ma petite fille vous adore. Merci Dr Guinane, tbark allah 3lik.",
      date: "2025-05-30",
      source: "google",
    },
    {
      author: "assia moutaaziz",
      rating: 5,
      text: "Médecin très compétente, humaine et attentive qui accorde le temps qu'il faut pour chaque patient. Je la recommande vivement.",
      date: "2025-05-25",
      source: "google",
    },
    {
      author: "imane shimou",
      rating: 5,
      text: "Dr Aicha une pédiatre attentionnée, compétente, elle a de l'intérêt pour le malade. Sincèrement elle est la meilleure, je la recommande vivement.",
      date: "2025-05-20",
      source: "google",
    },
  ];

  for (const review of reviewsData) {
    await payload.create({
      collection: "reviews",
      data: {
        tenant: tenantId,
        author: review.author,
        rating: review.rating,
        text: review.text,
        date: review.date,
        source: review.source as "google" | "direct",
        published: true,
      } as any,
      locale: "fr" as any,
    });
  }
  console.log("✅ 11 reviews seeded");
}

async function seedServices(payload: Payload, tenantId: any) {
  const existing = await payload.find({
    collection: "services",
    where: { tenant: { equals: tenantId } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log("→ Services already exist, skipping");
    return;
  }

  const icons: Record<string, string> = {
    nourrisson: "Baby",
    vaccins: "Syringe",
    suivi: "HeartPulse",
    urgences: "Stethoscope",
    nutrition: "Apple",
    certificats: "FileCheck",
  };

  const slugs = Object.keys(icons);
  const localeData: Record<string, { title: string; description: string }[]> = {
    fr: [
      {
        title: "Consultation nourrisson",
        description:
          "Suivi du développement, courbes de croissance, conseils allaitement et nutrition",
      },
      {
        title: "Vaccinations",
        description:
          "Calendrier vaccinal complet selon le programme national marocain",
      },
      {
        title: "Suivi pédiatrique régulier",
        description:
          "Bilans de santé annuels, suivi scolaire, développement psychomoteur",
      },
      {
        title: "Consultations urgentes",
        description:
          "Fièvre, gastro-entérite, infections ORL, allergies — sans rendez-vous selon disponibilité",
      },
      {
        title: "Nutrition & diététique",
        description:
          "Conseils personnalisés pour une alimentation équilibrée à chaque âge",
      },
      {
        title: "Certificats médicaux",
        description:
          "Certificats de bonne santé, aptitude sportive, crèche et école",
      },
    ],
    en: [
      {
        title: "Infant consultation",
        description:
          "Development monitoring, growth charts, breastfeeding and nutrition advice",
      },
      {
        title: "Vaccinations",
        description:
          "Full vaccination schedule according to the Moroccan national program",
      },
      {
        title: "Regular check-ups",
        description:
          "Annual health check-ups, school follow-up, psychomotor development",
      },
      {
        title: "Urgent consultations",
        description:
          "Fever, gastroenteritis, ENT infections, allergies — walk-in subject to availability",
      },
      {
        title: "Pediatric nutrition",
        description: "Personalized advice for balanced nutrition at every age",
      },
      {
        title: "Medical certificates",
        description:
          "Health certificates, sports fitness, nursery and school certificates",
      },
    ],
    ar: [
      {
        title: "استشارة الرضيع",
        description: "متابعة النمو، منحنيات النمو، نصائح الرضاعة والتغذية",
      },
      {
        title: "التطعيمات",
        description: "جدول التطعيم الكامل وفق البرنامج الوطني المغربي",
      },
      {
        title: "المتابعة الدورية",
        description: "فحوصات صحية سنوية، متابعة مدرسية، التطور النفسحركي",
      },
      {
        title: "الاستشارات العاجلة",
        description:
          "الحمى، التهاب المعدة، عدوى الأنف والأذن والحنجرة، الحساسية",
      },
      {
        title: "التغذية والحمية",
        description: "نصائح شخصية لتغذية متوازنة في كل مرحلة عمرية",
      },
      {
        title: "الشهادات الطبية",
        description: "شهادات صحية، لياقة رياضية، دور الحضانة والمدارس",
      },
    ],
    tzm: [
      {
        title: "ⴰⵙⵏⵉⵊⵉ ⵏ ⵓⵊⴷⵉⵄ",
        description:
          "ⴰⵙⴻⴽⵛⴷ ⵏ ⵓⵏⵏⵉⵔⵉ, ⵜⵉⵖⵎⵔⵜ ⵏ ⵓⵏⵏⵉⵔⵉ, ⵜⵉⵏⴰⵜⵉⵏ ⵉ ⵜⵖⵓⵔⵉ ⴷ ⵜⴰⵍⵍⴻⵙⵜ",
      },
      {
        title: "ⵜⵉⵏⴼⵍⵉⵜⵉⵏ",
        description: "ⴰⵖⴰⵏⵉⴱ ⵏ ⵜⵏⴼⵍⵉⵜ ⴰⵎ ⵓⵖⴰⵏⵉⴱ ⴰⵎⴰⵜⵜⵓⵔ ⴰⵎⴰⵖⵔⵉⴱⵉ",
      },
      {
        title: "ⴰⵙⴻⴽⵛⴷ ⴰⵎⴰⵜⵓ",
        description: "ⵜⵉⴼⵔⴰⵏⵉⵏ ⵏ ⵓⵣⵔⴼ ⴰⵙⴳⴳⴰⵙ, ⴰⵙⴻⴽⵛⴷ ⵏ ⵜⵖⵓⵔⵉ, ⴰⵏⵏⵉⵔⵉ ⴰⵥⴰⵡⴰⵏ",
      },
      {
        title: "ⴰⵙⵏⵉⵊⵉ ⵏ ⵜⵎⵔⴰⵖⵜ",
        description: "ⵜⴰⵖⵣⵉ, ⵜⵉⵎⵙⴰⵍ ⵏ ⵉⴼⴰⵙⵙⵏ, ⵜⵉⵎⵙⴰⵍ ⵏ ⵉⵎⵉ ⴷ ⵉⵎⵣⵣⵓⵖⵏ, ⵜⴰⵖⵣⵉⵎⵜ",
      },
      {
        title: "ⵜⴰⵍⵍⴻⵙⵜ ⵏ ⵉⵣⴷⴰⵏⵏ",
        description: "ⵜⵉⵏⴰⵜⵉⵏ ⵉ ⵜⴰⵍⵍⴻⵙⵜ ⵜⴰⵎⵣⴷⴰⵢⵜ ⴷⴻⴳ ⴽⵓⵍ ⴰⵣⵎⵣ",
      },
      {
        title: "ⵜⵉⵣⵔⴰⵡⵉⵏ ⵏ ⵓⵣⵔⴼ",
        description: "ⵜⵉⵣⵔⴰⵡⵉⵏ ⵏ ⵓⵣⵔⴼ, ⵜⴰⵖⵓⵍⵜ ⵏ ⵓⵖⵔⴱⴰⵣ, ⵜⵉⵖⵉⵡⴰⵏⵉⵏ ⵏ ⵉⵖⵔⴱⴰⵣⵏ",
      },
    ],
  };

  const locales = ["fr", "en", "ar", "tzm"];

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const icon = icons[slug];

    let service: any;
    for (const locale of locales) {
      const items = localeData[locale] ?? localeData["fr"];
      const item = items[i];
      const data: Record<string, unknown> = {
        tenant: tenantId,
        title: item.title,
        icon,
        order: i + 1,
      };

      if (locale === "fr") {
        data.description = lexical(item.description);
        service = await payload.create({
          collection: "services",
          data: data as any,
          locale: "fr" as any,
        });
      } else {
        data.description = lexical(
          item.description,
          locale === "ar" ? "rtl" : "ltr",
        );
        await payload.update({
          collection: "services",
          id: service!.id,
          data: data as any,
          locale: locale as any,
        });
      }
    }
  }
  console.log("✅ 6 services seeded");
}

export async function seed(payload: Payload) {
  console.log("🌱 Starting seed...");

  const tenant = await seedTenant(payload);
  await seedSuperadmin(payload);
  await seedDoctorUser(payload, tenant.id as any);
  await seedDoctor(payload, tenant.id as any);
  await seedPracticeInfo(payload);
  await seedReviews(payload, tenant.id as any);
  await seedServices(payload, tenant.id as any);

  console.log("🎉 Seed complete");
}
