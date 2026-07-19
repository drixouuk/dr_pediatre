import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <p className="font-heading text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-stone-800">
          Page introuvable
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-500">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-primary-700 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-primary-800"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
