import { useState } from 'react'

export default function FileUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('https://peibo-backend.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>📤 Subir Chat de WhatsApp</h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".txt"
        />
        <button type="submit" disabled={!file || loading}>
          {loading ? 'Analizando...' : 'Analizar'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h3>📊 Resultados:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}