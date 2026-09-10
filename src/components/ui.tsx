import type { ReactNode } from 'react'

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`panel p-5 ${className}`}>{children}</div>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="label-eyebrow mb-2">{children}</p>
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="font-mono text-xs text-muted">{label}</label>
        <span className="font-mono text-xs text-brand">{formatValue ? formatValue(value) : value}</span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {options.map((opt) => (
        <button
          key={opt.id}
          role="radio"
          aria-checked={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
            value === opt.id
              ? 'border-primary/30 bg-primary/5 text-primary'
              : 'border-border text-secondary hover:text-primary hover:border-primary/30'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function StatCard({ label, value, hint, className = '' }: { label: string; value: string; hint?: string; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface-secondary p-3.5 ${className}`.trim()}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-primary">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export function InsightBox({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-primary ${className}`}>
      {children}
    </div>
  )
}
