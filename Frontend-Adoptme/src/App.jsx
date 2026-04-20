import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PetDetail from './pages/PetDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pets/:pid' element={<PetDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App