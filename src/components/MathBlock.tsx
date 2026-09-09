import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathBlockProps {
  latex: string
  displayMode?: boolean
  className?: string
}

export default function MathBlock({ latex, displayMode = false, className = '' }: MathBlockProps) {
  const ref = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, {
        displayMode,
        throwOnError: false,
        errorColor: '#ef4444',
        output: 'html',
      })
    } catch {
      if (ref.current) ref.current.textContent = latex
    }
  }, [latex, displayMode])
  
  if (displayMode) {
    return (
      <div className={`overflow-x-auto py-2 text-center ${className}`}>
        <span ref={ref} />
      </div>
    )
  }
  return <span ref={ref} className={className} />
}

export function MathInline({ latex, className }: { latex: string; className?: string }) {
  return <MathBlock latex={latex} displayMode={false} className={className} />
}

export function MathDisplay({ latex, className }: { latex: string; className?: string }) {
  return <MathBlock latex={latex} displayMode={true} className={className} />
}
