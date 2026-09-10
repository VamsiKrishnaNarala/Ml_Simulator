import { FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/50 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2 font-display text-primary">
          <FlaskConical className="h-4 w-4 text-brand" />
          <span>
            ML<span className="text-brand">Lab</span>
          </span>
        </div>

        <p className="text-xs text-secondary font-mono tracking-[0.02em]">
          Made by L SUMALATHA, JNTUK UCEK
        </p>
      </div>
    </footer>
  )
}

