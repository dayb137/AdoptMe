import { useState, useEffect } from 'react'
import '../styles/adoptionform.css'

function AdoptionForm({ pet, user, onClose, onAdopted }) {
  const [step, setStep] = useState('questions') // questions | result
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [evaluating, setEvaluating] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetch('/api/ai/adoption-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: pet.name, specie: pet.specie })
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.payload)
        setLoading(false)
      })
  }, [])

  const handleAnswer = (id, value) => {
    setAnswers({ ...answers, [id]: value })
  }

  const handleSubmit = async () => {
    setEvaluating(true)

    const formattedAnswers = questions.map(q => ({
      pregunta: q.pregunta,
      respuesta: answers[q.id] || ''
    }))

    const res = await fetch('/api/ai/evaluate-adoption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: pet.name,
        specie: pet.specie,
        answers: formattedAnswers
      })
    })

    const data = await res.json()
    setResult(data.payload)
    setStep('result')
    setEvaluating(false)
  }

  const handleConfirmAdoption = async () => {
    const res = await fetch(`/api/adoptions/${user._id}/${pet._id}`, {
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json()
    if (data.status === 'success') onAdopted()
  }

  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id]?.trim())

  return (
    <div className="adoption-overlay" onClick={onClose}>
      <div className="adoption-modal" onClick={e => e.stopPropagation()}>

        {step === 'questions' && (
          <>
            <h2>🐾 Formulario de adopción</h2>
            <p className="subtitle">Respondé estas preguntas para adoptar a <strong>{pet.name}</strong></p>

            {loading ? (
              <div className="loading-questions">
                ✨ Generando preguntas personalizadas...
              </div>
            ) : (
              <>
                {questions.map(q => (
                  <div key={q.id} className="adoption-question">
                    <p>{q.id}. {q.pregunta}</p>
                    <textarea
                      placeholder="Tu respuesta..."
                      value={answers[q.id] || ''}
                      onChange={e => handleAnswer(q.id, e.target.value)}
                    />
                  </div>
                ))}

                <div className="adoption-actions">
                  <button className="adoption-btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                  <button
                    className="adoption-btn-primary"
                    onClick={handleSubmit}
                    disabled={!allAnswered || evaluating}
                  >
                    {evaluating ? '✨ Evaluando...' : 'Enviar respuestas'}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {step === 'result' && result && (
          <div className="adoption-result">
            <div className="result-icon">{result.apto ? '🎉' : '😔'}</div>
            <h3 className={result.apto ? 'apto' : 'no-apto'}>
              {result.apto ? '¡Sos apto para adoptar!' : 'Por ahora no cumplís los requisitos'}
            </h3>
            <p>{result.mensaje}</p>

            <div className="adoption-actions" style={{ justifyContent: 'center' }}>
              {result.apto ? (
                <>
                  <button className="adoption-btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                  <button className="adoption-btn-primary" onClick={handleConfirmAdoption}>
                    ❤️ Confirmar adopción
                  </button>
                </>
              ) : (
                <button className="adoption-btn-primary" onClick={onClose}>
                  Entendido
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdoptionForm