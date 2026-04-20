import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdoptionForm from '../components/AdoptionForm'
import '../styles/petdetail.css'

function PetDetail() {
  const { pid } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pet, setPet] = useState(null)
  const [description, setDescription] = useState('')
  const [loadingDesc, setLoadingDesc] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch(`/api/pets/${pid}`)
      .then(res => res.json())
      .then(data => setPet(data.payload))
  }, [pid])

  const generateDescription = async () => {
    setLoadingDesc(true)
    const res = await fetch('/api/ai/pet-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pet.name, specie: pet.specie, birthDate: pet.birthDate })
    })
    const data = await res.json()
    setDescription(data.payload)
    setLoadingDesc(false)
  }

  const handleAdoptClick = () => {
    if (!user) return navigate('/login')
    setShowForm(true)
  }

  const handleAdopted = () => {
    setShowForm(false)
    setPet({ ...pet, adopted: true })
  }

  if (!pet) return <p>Cargando...</p>

  return (
    <div className="petdetail-container">
      <span className="petdetail-back" onClick={() => navigate('/')}>
        ← Volver
      </span>

      <div className="petdetail-card">
        {pet.image
          ? <img className="petdetail-image" src={pet.image} alt={pet.name} />
          : <div className="petdetail-image-placeholder">🐾</div>
        }

        <div className="petdetail-body">
          <h1>{pet.name}</h1>

          <div className="petdetail-info">
            <p>🐶 {pet.specie}</p>
            {pet.birthDate && <p>📅 {new Date(pet.birthDate).toLocaleDateString()}</p>}
            <p>{pet.adopted ? '❤️ Adoptado' : '✅ Disponible'}</p>
          </div>

          {!pet.adopted && (
            <button className="petdetail-btn" onClick={handleAdoptClick} style={{ marginBottom: '12px' }}>
              ❤️ Adoptar
            </button>
          )}

          {pet.adopted && (
            <p style={{ color: '#5A52D5', fontWeight: '600', marginBottom: '12px' }}>
              🎉 ¡Esta mascota ya fue adoptada!
            </p>
          )}

          <button
            className="petdetail-btn"
            onClick={generateDescription}
            disabled={loadingDesc}
            style={{ background: 'transparent', color: '#5A52D5', border: '1.5px solid #5A52D5' }}
          >
            {loadingDesc ? 'Generando...' : '✨ Conoce mas sobre esta mascota'}
          </button>

          {description && (
            <div className="petdetail-description">
              <h3>Descripción generada por IA</h3>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AdoptionForm
          pet={pet}
          user={user}
          onClose={() => setShowForm(false)}
          onAdopted={handleAdopted}
        />
      )}
    </div>
  )
}

export default PetDetail