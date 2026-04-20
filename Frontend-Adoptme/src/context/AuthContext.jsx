import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions/current', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado')
        return res.json()
      })
      .then(data => {
        if (data.status === 'success') {
          setUser(data.payload)
        } else {
          setUser(null)
        }
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}