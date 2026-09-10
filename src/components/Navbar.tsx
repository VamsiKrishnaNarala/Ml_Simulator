import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { FlaskConical, Menu, X, LogOut, MessageSquareHeart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn ML' },
  { to: '/playground', label: 'Playground' },
  { to: '/algorithms', label: 'Algorithms' },
  { to: '/compare', label: 'Compare' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/about', label: 'About' },
  { to: '/feedback', label: 'Feedback' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
          <FlaskConical className="h-5 w-5 text-brand" strokeWidth={2.25} />
          ML<span className="text-brand">Lab</span>
        </NavLink>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 font-mono text-[13px] tracking-wide transition-colors ${
                    isActive ? 'bg-surface-secondary text-brand' : 'text-muted hover:text-primary hover:bg-surface-hover'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-border/70">
            <span className="font-mono text-[13px] text-muted">{user}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>

          <button
            className="rounded-lg p-2 text-primary lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/70 px-5 py-3 lg:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 font-mono text-sm transition-colors ${isActive ? 'bg-surface-secondary text-brand' : 'text-muted'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-3">
            <span className="font-mono text-sm text-muted">{user}</span>
            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-error transition-colors hover:bg-error/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
