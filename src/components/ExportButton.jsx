import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import './ExportButton.css';

export default function ExportButton({ analysisData }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const element = document.createElement('div');
      element.innerHTML = `
        <h1>Peibo Analyzer - Análisis de WhatsApp</h1>
        <p><strong>Período:</strong> ${analysisData.period || 'Reciente'}</p>
        <p><strong>Tema:</strong> ${analysisData.theme || 'General'}</p>
        <hr>
        <h2>Métricas</h2>
        <pre>${JSON.stringify(analysisData.metrics || {}, null, 2)}</pre>
      `;

      const opt = {
        margin: 10,
        filename: 'peibo_analysis.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={isLoading}
      className="export-btn"
    >
      📄 {isLoading ? 'Generando...' : 'Exportar PDF'}
    </button>
  );
}