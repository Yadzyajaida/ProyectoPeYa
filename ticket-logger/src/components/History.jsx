import React, { useEffect, useState } from 'react';
import { db, collection, query, where, getDocs } from '../firebase';

function History({ user }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) return;
      
      try {
        const q = query(
          collection(db, 'tickets'),
          where('agenteEmail', '==', user.email)
        );
        
        const querySnapshot = await getDocs(q);
        let fetchedTickets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Ordenar en el cliente (más reciente primero)
        fetchedTickets.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return <div className="panel"><p className="text-muted text-center">Cargando historial...</p></div>;
  }

  if (tickets.length === 0) {
    return (
      <div className="panel text-center" style={{ padding: '60px 30px' }}>
        <p style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</p>
        <h2 style={{ marginBottom: '8px' }}>Sin registros aún</h2>
        <p className="text-muted">Los tickets que completes aparecerán aquí automáticamente.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <p className="text-muted text-sm" style={{ marginBottom: '16px' }}>
        {tickets.length} {tickets.length === 1 ? 'ticket registrado' : 'tickets registrados'}
      </p>
      {tickets.map(ticket => (
        <div key={ticket.id} className="panel" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <span className="ticket-badge">{ticket.ticketId}</span>
            <span className="text-muted text-sm">{new Date(ticket.fecha).toLocaleString()}</span>
          </div>
          
          <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', marginBottom: '15px', gap: '10px' }}>
            {ticket.partnerId && (
              <div>
                <p className="text-muted text-sm">ID Partner</p>
                <strong>{ticket.partnerId}</strong>
              </div>
            )}
            <div>
              <p className="text-muted text-sm">Partner</p>
              <strong>{ticket.partner}</strong>
            </div>
            <div>
              <p className="text-muted text-sm">Cuenta</p>
              <strong>{ticket.cuenta}</strong>
            </div>
            <div>
              <p className="text-muted text-sm">País</p>
              <strong>{ticket.pais}</strong>
            </div>
          </div>

          {/* Proceso y Tipificación */}
          {ticket.procesoSeguido && (
            <div style={{ background: 'var(--bg-dark)', padding: '12px 15px', borderRadius: '8px', marginBottom: '8px' }}>
              <p className="text-muted text-sm" style={{ marginBottom: '6px' }}>📑 Proceso Seguido</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{ticket.procesoSeguido}</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '6px' }}>
                {ticket.gestionHeroCare && (
                  <div>
                    <p className="text-muted text-sm" style={{ fontSize: '0.75rem' }}>HeroCare</p>
                    <span style={{ color: 'var(--pink)', fontSize: '0.85rem' }}>{ticket.gestionHeroCare}</span>
                  </div>
                )}
                {ticket.motivoContacto && (
                  <div>
                    <p className="text-muted text-sm" style={{ fontSize: '0.75rem' }}>Motivo de Contacto</p>
                    <span style={{ color: 'var(--accent-blue)', fontSize: '0.85rem' }}>{ticket.motivoContacto}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Separated BO / VBO sections */}
          {ticket.accionesBackoffice && (
            <div style={{ background: 'var(--bg-dark)', padding: '12px 15px', borderRadius: '8px', marginBottom: '8px' }}>
              <p className="text-muted text-sm" style={{ marginBottom: '6px' }}>🖥️ Backoffice</p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{ticket.accionesBackoffice}</p>
            </div>
          )}
          {ticket.accionesVbo && (
            <div style={{ background: 'var(--bg-dark)', padding: '12px 15px', borderRadius: '8px' }}>
              <p className="text-muted text-sm" style={{ marginBottom: '6px' }}>🔧 Vendor Backoffice</p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{ticket.accionesVbo}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default History;
