import { FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-default/70 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 font-display text-primary">
          <FlaskConical className="h-4 w-4 text-brand" />
          <span>ML<span className="text-brand">Lab</span></span>
        </div>
        <p className="text-xs text-muted font-mono">
          Machine Learning, you can see. ·{' '}
          <Link to="/about" className="text-brand hover:underline">
            About the project
          </Link>
        </p>
      </div>
    </footer>
  )
}

