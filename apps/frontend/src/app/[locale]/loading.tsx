export default function Loading() {
  return (
    <div className="flex min-h-[60vh] animate-pulse flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="mx-auto h-10 w-3/4 rounded-lg bg-stone-200" />
        <div className="mx-auto h-5 w-1/2 rounded bg-stone-100" />
        <div className="mx-auto h-32 w-full rounded-xl bg-stone-100" />
      </div>
    </div>
  )
}
