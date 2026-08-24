'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { TicketForm, type TicketData } from './ticket-form';
import { ProcessWizard, type ProcessData } from './process-wizard';
import { ActionWizard, type ActionEntry } from './action-wizard';
import { ActionSummary } from './action-summary';
import { History } from './history';
import { db, collection, addDoc } from '@/lib/firebase-client';

const STEPS = [
  { key: 'ticket', label: 'Datos del Ticket' },
  { key: 'process', label: 'Proceso Seguido' },
  { key: 'actions', label: 'Acciones Realizadas' },
  { key: 'summary', label: 'Resumen Final' },
];

interface RegistroIntegracionesProps {
  userEmail: string;
  activeTab: 'tickets' | 'history';
}

export function RegistroIntegraciones({ userEmail, activeTab }: RegistroIntegracionesProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [processData, setProcessData] = useState<ProcessData | null>(null);
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleTicketSubmit = (data: TicketData) => {
    setTicketData(data);
    setCurrentStep(1);
  };

  const handleProcessComplete = (data: ProcessData) => {
    setProcessData(data);
    setCurrentStep(2);
  };

  const handleProcessBack = () => {
    setCurrentStep(0);
  };

  const handleActionsComplete = async (completedActions: ActionEntry[]) => {
    setActions(completedActions);
    setIsSaving(true);
    setCurrentStep(3);

    try {
      const boActions = completedActions.filter(a => a.toolId === 'bo').map(a => a.label).join(' | ');
      const vboActions = completedActions.filter(a => a.toolId === 'vendor_bo').map(a => a.label).join(' | ');

      const payload = {
        fecha: new Date().toISOString(),
        agenteEmail: userEmail,
        ticketId: ticketData!.ticket,
        partnerId: ticketData!.partnerId || '',
        partner: ticketData!.partner,
        cuenta: ticketData!.accountType,
        pais: ticketData!.country,
        procesoSeguido: processData ? `${processData.categoria} → ${processData.proceso}` : '',
        gestionHeroCare: processData ? processData.gestionHeroCare : '',
        motivoContacto: processData ? processData.motivoContacto : '',
        accionesBackoffice: boActions,
        accionesVbo: vboActions,
        acciones: completedActions.map(a => `[${a.tool}] ${a.label}`),
      };

      // Guardar en Firebase Firestore
      await addDoc(collection(db, 'tickets'), payload);

      // Guardar en Google Sheets (Apps Script Web App)
      const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbyzH5wBSYmkUCup2vj9ze2lh_kTQXwm6O9If8oP9CVqDDqlq9dt_kGPoXIkuzb0OLaARw/exec';

      fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(JSON.stringify(payload)),
      }).catch(err => console.error('Error al enviar a Sheets:', err));

    } catch (error) {
      console.error('Error guardando el ticket:', error);
      alert('Hubo un error guardando el ticket en la base de datos.');
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

  return (
    <>
      <header className="py-6 px-2 sm:px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            {activeTab === 'tickets' ? 'Registro de Ticket' : 'Mi Historial'}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {activeTab === 'tickets'
              ? 'Documenta paso a paso las acciones realizadas en cada herramienta'
              : 'Consulta los tickets que has completado anteriormente'}
          </p>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-12">
        {activeTab === 'tickets' && (
          <>
            {/* Step Indicator */}
            <div className="flex mb-7">
              {STEPS.map((step, index) => (
                <div
                  key={step.key}
                  className={`flex-1 py-3 text-center text-xs font-medium border-b-2 transition-colors ${
                    index < currentStep
                      ? 'border-primary text-primary'
                      : index === currentStep
                      ? 'border-foreground text-foreground font-semibold'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {step.label}
                </div>
              ))}
            </div>

            {/* Persistent ticket header when past step 0 */}
            {ticketData && currentStep > 0 && (
              <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg border border-border bg-card mb-5 animate-in fade-in duration-300">
                <Badge className="bg-primary text-primary-foreground">{ticketData.ticket}</Badge>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {ticketData.partnerId && <span>🆔 {ticketData.partnerId}</span>}
                  <span>👤 {ticketData.partner}</span>
                  <span>🏷️ {ticketData.accountType}</span>
                  <span>🌍 {ticketData.country}</span>
                </div>
              </div>
            )}

            {/* Wizard steps */}
            {currentStep === 0 && (
              <TicketForm onSubmit={handleTicketSubmit} />
            )}
            {currentStep === 1 && (
              <ProcessWizard
                partnerName={ticketData?.partner || ''}
                onComplete={handleProcessComplete}
                onBack={handleProcessBack}
              />
            )}
            {currentStep === 2 && (
              <ActionWizard onComplete={handleActionsComplete} />
            )}
            {currentStep === 3 && (
              <ActionSummary
                ticketData={ticketData!}
                processData={processData}
                actions={actions}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <History userEmail={userEmail} />
        )}
      </main>
    </>
  );
}
