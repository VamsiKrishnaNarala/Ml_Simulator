import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AuthContextType {
  user: string | null
  login: (rollNumber: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('mllab-user-roll')
    if (savedUser) {
      setUser(savedUser)
    }
  }, [])

  const login = (rollNumber: string) => {
    localStorage.setItem('mllab-user-roll', rollNumber)
    setUser(rollNumber)
  }

  const logout = () => {
    localStorage.removeItem('mllab-user-roll')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
