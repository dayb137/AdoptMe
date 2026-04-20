import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/petdetail.css'

function PetDetail() {
  const { pid } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [pet, setPet] = useState(null)
  const [description, setDescription] = useState('')
  const [loadingDesc, setLoadingDesc] = useState(false)
  const [loadingAdopt, setLoadingAdopt] = useState(false)
  const [adoptMessage, setAdoptMessage] = useState('')

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
      body: JSON.stringify({
        name: pet.name,
        specie: pet.specie,
        birthDate: pet.birthDate
      })
    })
    const data = await res.json()
    setDescription(data.payload)
    setLoadingDesc(false)
  }

  const handleAdopt = async () => {
    if (!user) return navigate('/login')
    setLoadingAdopt(true)
    setAdoptMessage('')

    const res = await fetch(`/api/adoptions/${user._id}/${pid}`, {
      method: 'POST',
      credentials: 'include'
    })

    const data = await res.json()

    if (data.status === 'success') {
      setAdoptMessage('¡Adoptaste esta mascota! 🎉')
      setPet({ ...pet, adopted: true })
    } else {
      setAdoptMessage(data.error || 'Error al adoptar')
    }

    setLoadingAdopt(false)
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
            <button
              className="petdetail-btn"
              onClick={handleAdopt}
              disabled={loadingAdopt}
              style={{ marginBottom: '12px' }}
            >
              {loadingAdopt ? 'Procesando...' : '❤️ Adoptar'}
            </button>
          )}

          {adoptMessage && (
            <p style={{ color: pet.adopted ? '#5A52D5' : '#E07A7A', marginBottom: '12px' }}>
              {adoptMessage}
            </p>
          )}

          <button
            className="petdetail-btn"
            onClick={generateDescription}
            disabled={loadingDesc}
            style={{ background: 'transparent', color: '#5A52D5', border: '1.5px solid #5A52D5' }}
          >
            {loadingDesc ? 'Generando...' : '✨ Generar descripción con IA'}
          </button>

          {description && (
            <div className="petdetail-description">
              <h3>Descripción generada por IA</h3>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PetDetail