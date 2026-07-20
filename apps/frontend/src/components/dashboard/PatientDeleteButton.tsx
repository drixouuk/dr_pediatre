'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

type Props = {
  patientId: string
  patientName: string
}

export default function PatientDeleteButton({ patientId, patientName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    const res = await fetch(`/api/cms-proxy/patients/${patientId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      setError('Erreur lors de la suppression')
      setDeleting(false)
      return
    }

    setConfirming(false)
    setDeleting(false)
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? '…' : 'Confirmer'}
        </button>
        <button
          onClick={() => { setConfirming(false); setError('') }}
          className="text-xs text-stone-400 hover:text-stone-600"
        >
          Annuler
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Supprimer ${patientName}`}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-stone-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="size-3" />
      Supprimer
    </button>
  )
}
