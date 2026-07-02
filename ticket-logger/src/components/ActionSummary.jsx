import React, { useState } from 'react';

function ActionSummary({ ticketData, processData, actions, onReset }) {
  const [copied, setCopied] = useState(false);

  const buildSummaryText = () => {
    const lines = [
      `TICKET: ${ticketData.ticket}`,
      ticketData.partnerId ? `ID PARTNER: ${ticketData.partnerId}` : null,
      `PARTNER: ${ticketData.partner}`,
      `TIPO DE CUENTA: ${ticketData.accountType}`,
      `PAÍS: ${ticketData.country}`,
      '',
      processData ? 'PROCESO SEGUIDO:' : null,
      processData ? `  Categoría: ${processData.categoria}` : null,
      processData ? `  Proceso: ${processData.proceso}` : null,
      processData ? `  Gestión/Asunto (HeroCare): ${processData.gestionHeroCare}` : null,
      processData ? `  Motivo de Contacto: ${processData.motivoContacto}` : null,
      processData ? '' : null,
      'ACCIONES REALIZADAS:',
      ...actions.map((act, i) => `  ${i + 1}. [${act.tool}] ${act.label}`),
    ].filter(Boolean);
    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildSummaryText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Group actions by tool
  const boActions = actions.filter(a => a.toolId === 'bo');
  const vboActions = actions.filter(a => a.toolId === 'vendor_bo');

  return (
    <div className="fade-in">
      <div className="panel">
        {/* Ticket Info */}
        <div className="summary-section">
          <h3>Información del Ticket</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Ticket ID</span>
              <span className="value">{ticketData.ticket}</span>
            </div>
            <div className="summary-item">
              <span className="label">ID Partner</span>
              <span className="value">{ticketData.partnerId || '—'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Partner</span>
              <span className="value">{ticketData.partner}</span>
            </div>
            <div className="summary-item">
              <span className="label">Tipo de Cuenta</span>
              <span className="value">{ticketData.accountType}</span>
            </div>
            <div className="summary-item full-width">
              <span className="label">País</span>
              <span className="value">{ticketData.country}</span>
            </div>
          </div>
        </div>

        {/* Process Info */}
        {processData && (
          <div className="summary-section">
            <h3>📑 Proceso y Tipificación</h3>
            <div style={{ background: 'var(--bg-dark)', borderRadius: '10px', padding: '16px' }}>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">Categoría</span>
                  <span className="value">{processData.categoria}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Proceso</span>
                  <span className="value">{processData.proceso}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Gestión / Asunto (HeroCare)</span>
                  <span className="value" style={{ color: 'var(--pink)' }}>{processData.gestionHeroCare}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Motivo de Contacto Local</span>
                  <span className="value" style={{ color: 'var(--accent-blue)' }}>{processData.motivoContacto}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions by tool */}
        {boActions.length > 0 && (
          <div className="summary-section">
            <h3>🖥️ Acciones en Backoffice</h3>
            <div className="actions-timeline">
              {boActions.map((act, i) => (
                <div className="timeline-item" key={`bo-${i}`}>
                  <div className="timeline-number">{i + 1}</div>
                  <div>
                    <div className="timeline-content">{act.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vboActions.length > 0 && (
          <div className="summary-section">
            <h3>🔧 Acciones en Vendor Backoffice</h3>
            <div className="actions-timeline">
              {vboActions.map((act, i) => (
                <div className="timeline-item" key={`vbo-${i}`}>
                  <div className="timeline-number">{i + 1}</div>
                  <div>
                    <div className="timeline-content">{act.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="summary-actions">
          <button className="btn-primary" onClick={handleCopy}>
            {copied ? '✅ Copiado!' : '📋 Copiar Resumen'}
          </button>
          <button className="btn-secondary" onClick={onReset}>
            ＋ Nuevo Ticket
          </button>
        </div>
      </div>

      {copied && (
        <div className="toast">
          Resumen copiado al portapapeles
        </div>
      )}
    </div>
  );
}

export default ActionSummary;
