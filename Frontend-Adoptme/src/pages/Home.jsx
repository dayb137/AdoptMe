import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PetCard from '../components/PetCard'
import { useAuth } from '../context/AuthContext'
import '../styles/home.css'

function Home() {
  const [pets, setPets] = useState([])
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/pets')
      .then(res => res.json())
      .then(data => setPets(data.payload))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/sessions/logout', {
      method: 'POST',
      credentials: 'include'
    })
    logout()
    navigate('/login')
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <header className="home-header">
        <div>
          <h1>🐾 Adoptme</h1>
          <p>Encontrá tu compañero ideal</p>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#888' }}>
                Hola, <strong>{user.name}</strong>
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button className="logout-btn" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          )}
        </div>
      </header>

      <main className="home-main">
        <h2>Mascotas disponibles</h2>
        <div className="pets-grid">
          {pets.map(pet => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home