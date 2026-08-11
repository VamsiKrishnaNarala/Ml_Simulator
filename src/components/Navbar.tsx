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
    <header className="sticky top-0 z-50 border-b border-graphite-700/70 bg-graphite-900/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
          <FlaskConical className="h-5 w-5 text-primary" strokeWidth={2.25} />
          ML<span className="text-primary">Lab</span>
        </NavLink>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 font-mono text-[13px] tracking-wide transition ${
                    isActive ? 'bg-graphite-700 text-primary' : 'text-graphite-500 hover:text-paper'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-graphite-700/70">
            <span className="font-mono text-[13px] text-graphite-500">{user}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-rose hover:bg-rose/10 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>

          <button
            className="rounded-lg p-2 text-paper lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
                `rounded-lg px-3 py-2.5 font-mono text-sm ${isActive ? 'bg-graphite-700 text-primary' : 'text-graphite-500'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-graphite-700/70 pt-3">
            <span className="font-mono text-sm text-graphite-500">{user}</span>
            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose transition hover:bg-rose/10"
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
