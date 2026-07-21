type Props = {
  steps: { label: string }[]
  current: number
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="mb-12 flex items-center justify-center gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200 ${
              i <= current
                ? 'bg-primary-700 text-white'
                : 'bg-stone-100 text-stone-400'
            }`}
          >
            {i + 1}
          </div>
          <span
            className={`hidden text-sm font-medium sm:inline ${
              i === current
                ? 'text-primary-700 font-bold'
                : i < current
                  ? 'text-primary-600'
                  : 'text-stone-400'
            }`}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`mx-1 h-px w-8 transition-colors duration-200 ${
                i < current ? 'bg-primary-400' : 'bg-stone-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
