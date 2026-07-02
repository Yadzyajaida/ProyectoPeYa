import React, { useState } from 'react';
import { processCategories } from '../data/processes';

function ProcessWizard({ partnerName, onComplete, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // Reemplazar {partner} dinámicamente
  const replacePartner = (text) => {
    return text.replace(/\{partner\}/g, partnerName || 'Partner');
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setSelectedProcess(null);
    setConfirmed(false);
  };

  const handleProcessSelect = (proc) => {
    setSelectedProcess(proc);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    onComplete({
      categoria: selectedCategory.label,
      proceso: selectedProcess.label,
      gestionHeroCare: replacePartner(selectedProcess.gestionHeroCare),
      motivoContacto: selectedProcess.motivoContacto
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProcess(null);
    setConfirmed(false);
  };

  // Paso 1: Elegir categoría (SOP)
  if (!selectedCategory) {
    return (
      <div className="panel fade-in">
        <h2 className="wizard-question" style={{ marginBottom: '8px' }}>📑 Proceso Seguido</h2>
        <p className="text-muted text-sm" style={{ marginBottom: '20px' }}>
          ¿En qué categoría se encuentra el proceso que realizaste?
        </p>
        <div className="options-grid">
          {processCategories.map(cat => (
            <button
              key={cat.id}
              className="option-btn"
              onClick={() => handleCategorySelect(cat)}
            >
              <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: '4px' }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
        <div className="wizard-actions" style={{ marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onBack}>
            ← Volver
          </button>
          <div></div>
        </div>
      </div>
    );
  }

  // Paso 2: Elegir proceso
  if (!selectedProcess) {
    return (
      <div className="panel fade-in">
        <h2 className="wizard-question" style={{ marginBottom: '8px' }}>
          {selectedCategory.icon} {selectedCategory.label}
        </h2>
        <p className="text-muted text-sm" style={{ marginBottom: '20px' }}>
          ¿Qué proceso realizaste?
        </p>
        <div className="options-grid">
          {selectedCategory.processes.map(proc => (
            <button
              key={proc.id}
              className="option-btn"
              onClick={() => handleProcessSelect(proc)}
            >
              {proc.label}
            </button>
          ))}
        </div>
        <div className="wizard-actions" style={{ marginTop: '20px' }}>
          <button className="btn-secondary" onClick={handleBackToCategories}>
            ← Cambiar categoría
          </button>
          <div></div>
        </div>
      </div>
    );
  }

  // Paso 3: Confirmación con tipificación auto-generada
  return (
    <div className="panel fade-in">
      <h2 className="wizard-question" style={{ marginBottom: '8px' }}>✅ Confirmar Tipificación</h2>
      <p className="text-muted text-sm" style={{ marginBottom: '20px' }}>
        Revisa que la información sea correcta antes de continuar.
      </p>

      <div style={{ background: 'var(--bg-dark)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <p className="text-muted text-sm" style={{ marginBottom: '4px' }}>Categoría</p>
          <strong>{selectedCategory.icon} {selectedCategory.label}</strong>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <p className="text-muted text-sm" style={{ marginBottom: '4px' }}>Proceso</p>
          <strong>{selectedProcess.label}</strong>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />
        <div style={{ marginBottom: '16px' }}>
          <p className="text-muted text-sm" style={{ marginBottom: '4px' }}>Gestión / Asunto (HeroCare)</p>
          <strong style={{ color: 'var(--pink)' }}>{replacePartner(selectedProcess.gestionHeroCare)}</strong>
        </div>
        <div>
          <p className="text-muted text-sm" style={{ marginBottom: '4px' }}>Motivo de Contacto Local</p>
          <strong style={{ color: 'var(--accent-blue)' }}>{selectedProcess.motivoContacto}</strong>
        </div>
      </div>

      <div className="wizard-actions">
        <button className="btn-secondary" onClick={() => setSelectedProcess(null)}>
          ← Cambiar proceso
        </button>
        <button className="btn-primary" onClick={handleConfirm}>
          Confirmar y Continuar →
        </button>
      </div>
    </div>
  );
}

export default ProcessWizard;
