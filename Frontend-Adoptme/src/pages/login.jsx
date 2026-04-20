import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/login.css'

function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const res = await fetch('/api/sessions/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (data.status === 'success') {
      setUser(data.payload)
      navigate('/')
    } else {
      setError(data.error || 'Error al iniciar sesión')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🐾 Adoptme</h1>
        <p>Iniciá sesión para continuar</p>

        <div className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </div>

        <div className="login-footer">
          ¿No tenés cuenta? <span onClick={() => navigate('/register')}>Registrate</span>
        </div>
      </div>
    </div>
  )
}

export default Login