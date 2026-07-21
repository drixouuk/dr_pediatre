import { Check } from 'lucide-react'

type Props = {
  slug: string
  name: string
  price: number
  features: string[]
  badge?: string
  ctaLabel: string
  ctaVariant: 'primary' | 'outline'
  isActive?: boolean
  onClick: () => void
}

export default function TierCard({
  slug,
  name,
  price,
  features,
  badge,
  ctaLabel,
  ctaVariant,
  isActive,
  onClick,
}: Props) {
  return (
    <div
      className={`flex flex-col rounded-xl border-2 p-6 transition-all duration-200 ${
        isActive
          ? 'border-primary-500 ring-2 ring-primary-500/20'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      <div className="mb-4">
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-600">
            {badge}
          </span>
        )}
        <h3 className="font-heading text-lg font-bold text-stone-800">{name}</h3>
        <div className="mt-1 flex items-baseline gap-0.5">
          <span className="font-heading text-3xl font-bold text-primary-700">
            {price === 0 ? 'Gratuit' : `${price} MAD`}
          </span>
          {price > 0 && <span className="text-sm text-stone-500">/mois</span>}
        </div>
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
            <Check className="mt-0.5 size-4 shrink-0 text-primary-500" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 ${
          ctaVariant === 'primary'
            ? 'bg-primary-700 text-white hover:bg-primary-800'
            : 'border border-primary-200 text-primary-700 hover:bg-primary-50'
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  )
}
