import React, { useState } from 'react';

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Chile', 'Colombia', 'Costa Rica',
  'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras',
  'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'Uruguay', 'Venezuela'
];

const ACCOUNT_TYPES = [
  { value: 'IB', label: 'IB — Cuentas muy importantes' },
  { value: 'KA', label: 'KA — Cuentas importantes' }
];

function TicketForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    ticket: '',
    partnerId: '',
    partner: '',
    accountType: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.ticket && formData.partner && formData.accountType && formData.country;

  return (
    <div className="panel fade-in">
      <h2 className="wizard-question" style={{ marginBottom: '8px' }}>📋 Registrar Ticket</h2>
      <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
        Completa la información del ticket antes de documentar las acciones realizadas.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="ticket">Ticket ID</label>
            <input
              type="text"
              id="ticket"
              name="ticket"
              value={formData.ticket}
              onChange={handleChange}
              required
              placeholder="Número de ticket"
            />
          </div>
          <div className="input-group">
            <label htmlFor="partnerId">ID del Partner</label>
            <input
              type="text"
              id="partnerId"
              name="partnerId"
              value={formData.partnerId}
              onChange={handleChange}
              placeholder="Opcional"
            />
          </div>
          <div className="input-group">
            <label htmlFor="partner">Nombre del Partner</label>
            <input
              type="text"
              id="partner"
              name="partner"
              value={formData.partner}
              onChange={handleChange}
              required
              placeholder="Nombre de la tienda"
            />
          </div>
          <div className="input-group">
            <label htmlFor="accountType">Tipo de Cuenta</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seleccionar tipo</option>
              {ACCOUNT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="country">País</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Seleccionar país</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="wizard-actions">
          <div></div>
          <button type="submit" className="btn-primary" disabled={!isValid}>
            Iniciar Registro →
          </button>
        </div>
      </form>
    </div>
  );
}

export default TicketForm;
