import { FlaskConical } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-graphite-700/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 font-display text-paper">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span>
            ML<span className="text-primary">Lab</span>
          </span>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-1">
          <p className="font-mono text-xs text-graphite-500">
            Every simulation runs live in your browser — no server, no data leaves this tab.
          </p>
          <p className="font-mono text-xs text-graphite-400 mt-2">
            This was Made by Dr.Sumalatha Lingamgunta, Professor of CSE, UCEK, JNTUK
          </p>
        </div>
      </div>
    </footer>
  )
}
