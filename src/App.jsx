import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './FileUpload'
import SearchSimilar from './SearchSimilar'
import ExportButton from './components/ExportButton.jsx'

function App() {
  const [message, setMessage] = useState('Conectando...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
   fetch('https://psychic-space-umbrella-jr5wjgw6v9rx25xw-8000.app.github.dev/')
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
      <ExportButton analysisData={{theme: "Coverage", metrics: {}}} />
    </div>
  )
}

export default App