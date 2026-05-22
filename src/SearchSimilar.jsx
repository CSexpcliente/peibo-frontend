import { useState } from 'react';
import './SearchSimilar.css';

export default function SearchSimilar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(
        `https://peibo-backend.onrender.com/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        setResults(data.results);
      } else {
        setError(data.message || 'Error en la búsqueda');
      }
    } catch (err) {
      setError('No se pudo conectar al backend. Intenta más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-similar">
      <div className="search-container">
        <h2>🔍 Buscar análisis similares</h2>
        
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Ej: problemas de acceso, errores de conectividad..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Buscando...' : '🚀 Buscar'}
          </button>
        </form>

        {error && <div className="error-message">❌ {error}</div>}
      </div>

      {results.length > 0 && (
        <div className="results-container">
          <h3>📊 {results.length} análisis similares encontrados</h3>
          <div className="results-list">
            {results.map((result, idx) => (
              <div key={result.id} className="result-card">
                <div className="result-header">
                  <span className="result-number">#{idx + 1}</span>
                  <span className="result-similarity">
                    {(result.similarity * 100).toFixed(0)}% coincidencia
                  </span>
                </div>
                <div className="result-info">
                  <p className="result-filename">📄 {result.filename}</p>
                  <p className="result-date">
                    📅 {new Date(result.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="no-results">
          Sin resultados para "{query}"
        </div>
      )}
    </div>
  );
}