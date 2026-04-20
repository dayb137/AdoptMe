import { useState, useEffect, useRef } from 'react'

function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy AdoptBot 🐾 ¿En qué te puedo ayudar?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pets, setPets] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('/api/pets')
      .then(res => res.json())
      .then(data => setPets(data.payload))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessages,
        pets
      })
    })

    const data = await res.json()
    setMessages([...newMessages, { role: 'assistant', content: data.payload }])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {open && (
        <div style={{
          width: '320px',
          height: '420px',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div style={{ background: '#6c63ff', color: 'white', padding: '12px 16px', borderRadius: '12px 12px 0 0', fontWeight: 'bold' }}>
            🐾 AdoptBot
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#6c63ff' : '#f0f0f0',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: '12px',
                maxWidth: '80%',
                fontSize: '14px'
              }}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#f0f0f0', padding: '8px 12px', borderRadius: '12px', fontSize: '14px' }}>
                Escribiendo...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu pregunta..."
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ background: '#6c63ff', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          background: '#6c63ff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'block',
          marginLeft: 'auto'
        }}
      >
        {open ? '✕' : '🐾'}
      </button>
    </div>
  )
}

export default ChatBot