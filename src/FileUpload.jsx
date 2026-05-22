import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import axios from 'axios'

export default function FileUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [analyses, setAnalyses] = useState([])

  // Cargar histórico
  const loadAnalyses = async () => {
    try {
      const { data, error: err } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (err) throw err
      setAnalyses(data || [])
    } catch (err) {
      console.error('Error loading:', err)
    }
  }

  useEffect(() => {
    loadAnalyses()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Selecciona un archivo')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('📤 Enviando a backend...')

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        'https://peibo-backend.onrender.com/analyze',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      const analysisResult = response.data
      console.log('✅ Backend respondió')

      // Guardar en Supabase
      console.log('💾 Guardando en BD...')
      const { data: savedData, error: dbError } = await supabase
        .from('analyses')
        .insert([
          {
            filename: file.name,
            file_size: file.size,
            result: analysisResult,
          },
        ])
        .select()

      if (dbError) throw new Error(dbError.message)

      console.log('✅ Guardado en BD')
      setResult(analysisResult)
      setFile(null)
      await loadAnalyses()

    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📤 Subir Chat WhatsApp</h2>

      <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={loading}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button
          type="submit"
          disabled={!file || loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Analizando...' : '📊 Analizar'}
        </button>
      </form>

      {error && (
        <div style={{ color: '#ef4444', padding: '10px', marginBottom: '10px' }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ backgroundColor: '#f0fdf4', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
          <h3>✅ Análisis Completado</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {analyses.length > 0 && (
        <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '4px' }}>
          <h3>📋 Últimos Análisis ({analyses.length})</h3>
          <ul style={{ fontSize: '14px' }}>
            {analyses.map((analysis) => (
              <li key={analysis.id} style={{ marginBottom: '8px' }}>
                <strong>{analysis.filename}</strong> <br />
                <small>
                  {new Date(analysis.created_at).toLocaleString()} • {Math.round(analysis.file_size / 1024)} KB
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}