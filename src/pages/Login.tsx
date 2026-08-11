import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Panel, Eyebrow } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [rollNumber, setRollNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!rollNumber || !password) {
      setError('Please fill in both fields')
      return
    }

    if (rollNumber !== password) {
      setError('Username and Password must match your Roll Number')
      return
    }

    // Basic format check for typical roll numbers (alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(rollNumber)) {
      setError('Invalid Roll Number format')
      return
    }

    login(rollNumber.toUpperCase())
    navigate('/')
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-5">
      <Panel className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Eyebrow>Welcome Back</Eyebrow>
          <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Student Login</h1>
          <p className="mt-2 text-sm text-graphite-500">
            Please use your Roll Number as both your Username and Password to access the ML Lab.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-500">
              Roll Number (Username)
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full rounded-xl border border-graphite-600 bg-graphite-900/50 px-4 py-2.5 text-paper outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="e.g. 21A91A0501"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-graphite-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-graphite-600 bg-graphite-900/50 px-4 py-2.5 text-paper outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Must match Roll Number"
            />
          </div>

          {error && (
            <p className="text-sm text-rose">{error}</p>
          )}

          <button type="submit" className="btn-primary mt-6 w-full justify-center">
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
        </form>
      </Panel>
    </div>
  )
}
