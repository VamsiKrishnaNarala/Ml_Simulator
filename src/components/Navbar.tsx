import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { FlaskConical, Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn ML' },
  { to: '/playground', label: 'Playground' },
  { to: '/algorithms', label: 'Algorithms' },
  { to: '/compare', label: 'Compare' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-graphite-700/70 bg-graphite-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
          <FlaskConical className="h-5 w-5 text-cyan" strokeWidth={2.25} />
          ML<span className="text-cyan">Lab</span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 font-mono text-[13px] tracking-wide transition ${
                  isActive ? 'bg-graphite-700 text-cyan' : 'text-graphite-500 hover:text-paper'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded-lg p-2 text-paper lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-graphite-700/70 px-5 py-3 lg:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 font-mono text-sm ${isActive ? 'bg-graphite-700 text-cyan' : 'text-graphite-500'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
