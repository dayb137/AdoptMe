import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/register.css'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/sessions/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (data.status === 'success') {
      setSuccess('¡Cuenta creada! Redirigiendo...')
      setTimeout(() => navigate('/login'), 1500)
    } else {
      setError(data.error || 'Error al registrarse')
    }

    setLoading(false)
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🐾 Adoptme</h1>
        <p>Creá tu cuenta para adoptar</p>

        <div className="register-form">
          <input
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Apellido"
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}
          <button className="register-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </div>

        <div className="register-footer">
          ¿Ya tenés cuenta? <span onClick={() => navigate('/login')}>Iniciá sesión</span>
        </div>
      </div>
    </div>
  )
}

export default Register