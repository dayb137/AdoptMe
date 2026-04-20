import { useNavigate } from 'react-router-dom'
import '../styles/petcard.css'

function PetCard({ pet }) {
  const navigate = useNavigate()

  return (
    <div className="pet-card" onClick={() => navigate(`/pets/${pet._id}`)}>
      {pet.image
        ? <img className="pet-card-image" src={pet.image} alt={pet.name} />
        : <div className="pet-card-image-placeholder">🐾</div>
      }
      <div className="pet-card-body">
        <h2>{pet.name}</h2>
        <p>🐶 {pet.specie}</p>
        <span className={`pet-card-badge ${pet.adopted ? 'adopted' : 'available'}`}>
          {pet.adopted ? 'Adoptado' : 'Disponible'}
        </span>
      </div>
    </div>
  )
}

export default PetCard