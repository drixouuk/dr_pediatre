'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight, CheckCircle, ClipboardList } from 'lucide-react'
import StepIndicator from './StepIndicator'
import TierCard from './TierCard'
import SignupForm from './SignupForm'

const tiers = [
  {
    slug: 'vitrine',
    name: 'Vitrine',
    price: 0,
    badge: 'Gratuit',
    features: [
      'Site vitrine personnalisé',
      '4 langues (fr/en/ar/tzm)',
      'Design responsive',
      'Hébergement inclus',
      'Nom de domaine personnalisé',
    ],
  },
  {
    slug: 'rdv',
    name: 'RDV',
    price: 149,
    features: [
      'Tout Vitrine +',
      'Prise de rendez-vous en ligne (Cal.com)',
      'Agenda synchronisé',
      'Notifications automatiques',
    ],
  },
  {
    slug: 'dossier',
    name: 'Dossier',
    price: 299,
    features: [
      'Tout RDV +',
      'Dossier patient numérique',
      "File d'attente",
      'Consultation + Ordonnance',
      'Carnet vaccinal',
      'Courbes de croissance',
    ],
  },
  {
    slug: 'clinique',
    name: 'Clinique',
    price: 499,
    features: [
      'Tout Dossier +',
      'Multi-praticiens',
      "Registre d'audit",
      'Statistiques avancées',
      'Support prioritaire',
    ],
  },
]

const steps = [
  { label: 'Formule' },
  { label: 'Inscription' },
  { label: 'Confirmation' },
]

type SuccessData = { domain: string; email: string }

export default function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState('generaliste')
  const [success, setSuccess] = useState<SuccessData | null>(null)

  const isSelfService = selectedTier === 'vitrine' || selectedTier === 'rdv'
  const isContact = selectedTier === 'dossier' || selectedTier === 'clinique'

  const handleTierClick = (slug: string) => {
    setSelectedTier(slug)
    if (slug === 'dossier' || slug === 'clinique') {
      setStep(2)
    } else {
      setStep(1)
    }
  }

  const handleSignupSuccess = (data: SuccessData) => {
    setSuccess(data)
    setStep(2)
  }

  const selected = tiers.find((t) => t.slug === selectedTier)

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-stone-800">
          Créer votre espace professionnel
        </h1>
        <p className="mt-2 text-stone-500">
          Choisissez la formule adaptée à votre activité
        </p>
      </div>

      <StepIndicator steps={steps} current={step} />

      {step === 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <TierCard
                key={t.slug}
                slug={t.slug}
                name={t.name}
                price={t.price}
                features={t.features}
                badge={t.badge}
                ctaLabel={t.slug === 'dossier' || t.slug === 'clinique' ? 'Nous contacter' : 'Commencer'}
                ctaVariant={t.slug === 'dossier' || t.slug === 'clinique' ? 'outline' : 'primary'}
                isActive={selectedTier === t.slug}
                onClick={() => handleTierClick(t.slug)}
              />
            ))}
          </div>

          {selectedTier && (selectedTier === 'dossier' || selectedTier === 'clinique') && (
            <div className="mt-6 mx-auto max-w-xs">
              <label className="mb-1 block text-sm font-medium text-stone-700">Spécialité</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              >
                <option value="pediatrie">Pédiatrie</option>
                <option value="generaliste">Médecine générale</option>
                <option value="gynecologie">Gynécologie</option>
                <option value="dermatologie">Dermatologie</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          )}
        </>
      )}

      {step === 1 && selected && isSelfService && (
        <div>
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
              {selected.name} — {selected.price === 0 ? 'Gratuit' : `${selected.price} MAD/mois`}
            </span>
          </div>
          <SignupForm
            tier={selected.slug as 'vitrine' | 'rdv'}
            specialty={selectedSpecialty}
            onSuccess={handleSignupSuccess}
            onBack={() => setStep(0)}
          />
        </div>
      )}

      {step === 2 && isSelfService && success && (
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle className="mx-auto size-16 text-success-500" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-stone-800">
            Votre cabinet est prêt !
          </h2>
          <p className="mt-2 text-stone-500">
            Votre site est accessible à l'adresse :
          </p>
          <a
            href={`https://${success.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-lg font-medium text-primary-600 hover:text-primary-700 underline"
          >
            https://{success.domain}
          </a>

          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-800 transition-colors duration-200"
            >
              Accéder à mon espace
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 rounded-lg bg-stone-50 p-6 text-left">
            <h3 className="font-heading text-sm font-semibold text-stone-700">Prochaines étapes :</h3>
            <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-stone-600">
              <li>Personnalisez votre site vitrine depuis votre espace</li>
              <li>Ajoutez vos informations de contact, horaires, services</li>
              {selectedTier === 'rdv' && <li>Configurez vos disponibilités dans Cal.com</li>}
            </ol>
          </div>

          {step < 2 && (
            <button onClick={() => setStep(1)} className="mt-6 text-sm text-stone-500 hover:text-stone-700 transition-colors duration-200">
              Retour
            </button>
          )}
        </div>
      )}

      {step === 2 && isContact && selected && (
        <div className="mx-auto max-w-lg text-center">
          <ClipboardList className="mx-auto size-16 text-primary-500" />
          <h2 className="mt-4 font-heading text-2xl font-bold text-stone-800">
            Demande envoyée
          </h2>
          <p className="mt-2 text-stone-500">
            Merci pour votre intérêt pour la formule <strong>{selected.name}</strong> !
          </p>
          <p className="mt-4 text-stone-500">
            Nous vous contacterons dans les 48h pour organiser une démo et configurer votre espace.
          </p>
          <p className="mt-4 text-sm text-stone-400">
            En attendant, vous pouvez nous écrire à :{' '}
            <a href="mailto:contact@dr-tabibi.ma" className="text-primary-600 hover:text-primary-700 underline">
              contact@dr-tabibi.ma
            </a>
          </p>
          <button onClick={() => { setStep(0); setSelectedTier(null) }} className="mt-8 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200">
            Choisir une autre formule
          </button>
        </div>
      )}
    </div>
  )
}
