import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TicketForm from './components/TicketForm';
import ProcessWizard from './components/ProcessWizard';
import ActionWizard from './components/ActionWizard';
import ActionSummary from './components/ActionSummary';
import History from './components/History';
import { auth, db, signOut, collection, addDoc } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

const STEPS = [
  { key: 'ticket', label: 'Datos del Ticket' },
  { key: 'process', label: 'Proceso Seguido' },
  { key: 'actions', label: 'Acciones Realizadas' },
  { key: 'summary', label: 'Resumen Final' },
];

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const [activeTab, setActiveTab] = useState('tickets');
  
  const [currentStep, setCurrentStep] = useState(0); // 0: Ticket, 1: Process, 2: Actions, 3: Summary
  const [ticketData, setTicketData] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [actions, setActions] = useState([]);
  
  const [isSaving, setIsSaving] = useState(false);

  // Escuchar estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleTicketSubmit = (data) => {
    setTicketData(data);
    setCurrentStep(1);
  };

  const handleProcessComplete = (data) => {
    setProcessData(data);
    setCurrentStep(2);
  };

  const handleProcessBack = () => {
    setCurrentStep(0);
  };

  const handleActionsComplete = async (completedActions) => {
    setActions(completedActions);
    setIsSaving(true);
    setCurrentStep(3);

    try {
      // 1. Preparar datos
      const boActions = completedActions.filter(a => a.toolId === 'bo').map(a => a.label).join(' | ');
      const vboActions = completedActions.filter(a => a.toolId === 'vendor_bo').map(a => a.label).join(' | ');

      const payload = {
        fecha: new Date().toISOString(),
        agenteEmail: user.email,
        ticketId: ticketData.ticket,
        partnerId: ticketData.partnerId || '',
        partner: ticketData.partner,
        cuenta: ticketData.accountType,
        pais: ticketData.country,
        procesoSeguido: processData ? `${processData.categoria} → ${processData.proceso}` : '',
        gestionHeroCare: processData ? processData.gestionHeroCare : '',
        motivoContacto: processData ? processData.motivoContacto : '',
        accionesBackoffice: boActions,
        accionesVbo: vboActions,
        acciones: completedActions.map(a => `[${a.tool}] ${a.label}`) 
      };

      // 2. Guardar en Firebase Firestore
      await addDoc(collection(db, 'tickets'), payload);

      // 3. Guardar en Google Sheets (Apps Script Web App)
      const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyzH5wBSYmkUCup2vj9ze2lh_kTQXwm6O9If8oP9CVqDDqlq9dt_kGPoXIkuzb0OLaARw/exec";
      
      // Enviamos como formulario URL-encoded (100% compatible con no-cors + Apps Script)
      fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(JSON.stringify(payload))
      }).catch(err => console.error("Error al enviar a Sheets:", err));

    } catch (error) {
      console.error("Error guardando el ticket:", error);
      alert("Hubo un error guardando el ticket en la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTicketData(null);
    setProcessData(null);
    setActions([]);
    setCurrentStep(0);
  };

  if (loadingAuth) {
    return (
      <div className="dashboard-layout">
        <main className="main-content centered-full">
          <p className="text-muted">Cargando...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-layout">
        <main className="main-content centered-full">
          <div className="login-wrapper">
            <div className="brand-logo large">P</div>
            <Login onLogin={handleLogin} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">P</div>
          <h2>Integraciones</h2>
          <span className="text-muted text-sm">ID tracker</span>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <span>📋</span> Tickets
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span>🕰️</span> Historial
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={user.photoURL || 'https://via.placeholder.com/32'} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{user.email}</span>
            </div>
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.8rem', width: '100%', textAlign: 'left' }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-container">
          <header className="topbar">
            <div>
              <h1>{activeTab === 'tickets' ? 'Registro de Ticket' : 'Mi Historial'}</h1>
              <p className="topbar-subtitle">
                {activeTab === 'tickets' 
                  ? 'Documenta paso a paso las acciones realizadas en cada herramienta'
                  : 'Consulta los tickets que has completado anteriormente'}
              </p>
            </div>
          </header>

          {activeTab === 'tickets' && (
            <>
              <div className="step-indicator">
                {STEPS.map((step, index) => (
                  <div
                    key={step.key}
                    className={`step ${index < currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
                  >
                    {step.label}
                  </div>
                ))}
              </div>

              {/* Persistent ticket header when past step 0 */}
              {ticketData && currentStep > 0 && (
                <div className="ticket-header-bar fade-in">
                  <span className="ticket-badge">{ticketData.ticket}</span>
                  <div className="ticket-info">
                    {ticketData.partnerId && <span>🆔 {ticketData.partnerId}</span>}
                    <span>👤 {ticketData.partner}</span>
                    <span>🏷️ {ticketData.accountType}</span>
                    <span>🌍 {ticketData.country}</span>
                  </div>
                </div>
              )}

              <div className="card-container fade-in">
                {currentStep === 0 && (
                  <TicketForm onSubmit={handleTicketSubmit} />
                )}
                {currentStep === 1 && (
                  <ProcessWizard 
                    partnerName={ticketData?.partner}
                    onComplete={handleProcessComplete}
                    onBack={handleProcessBack}
                  />
                )}
                {currentStep === 2 && (
                  <ActionWizard onComplete={handleActionsComplete} />
                )}
                {currentStep === 3 && (
                  <ActionSummary
                    ticketData={ticketData}
                    processData={processData}
                    actions={actions}
                    onReset={handleReset}
                  />
                )}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <History user={user} />
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
