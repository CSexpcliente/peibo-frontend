import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './FileUpload'
import SearchSimilar from './SearchSimilar'

function App() {
  const [message, setMessage] = useState('Conectando...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://peibo-backend.onrender.com/')
      .then(res => res.json())
      .then(data => {
        setMessage(`✅ Backend conectado`)
        setLoading(false)
      })
      .catch(err => {
        setMessage(`❌ Error: ${err.message}`)
        setLoading(false)
      })
  }, [])

  return (
    <div className="container">
      <h1>🚀 Peibo Analyzer</h1>
      <p>{loading ? 'Conectando...' : message}</p>
      
      {!loading && <FileUpload />}
      <SearchSimilar />
    </div>
  )
}

export default App