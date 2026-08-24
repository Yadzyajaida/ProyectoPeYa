'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { TicketData } from './ticket-form';
import type { ProcessData } from './process-wizard';
import type { ActionEntry } from './action-wizard';

interface ActionSummaryProps {
  ticketData: TicketData;
  processData: ProcessData | null;
  actions: ActionEntry[];
  onReset: () => void;
}

export function ActionSummary({ ticketData, processData, actions, onReset }: ActionSummaryProps) {
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

  const boActions = actions.filter(a => a.toolId === 'bo');
  const vboActions = actions.filter(a => a.toolId === 'vendor_bo');

  return (
    <div className="animate-in fade-in duration-300">
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Ticket Info */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Información del Ticket
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Ticket ID</span>
                <span className="text-sm text-foreground break-all">{ticketData.ticket}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">ID Partner</span>
                <span className="text-sm text-foreground break-all">{ticketData.partnerId || '—'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Partner</span>
                <span className="text-sm text-foreground break-all">{ticketData.partner}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Tipo de Cuenta</span>
                <span className="text-sm text-foreground">{ticketData.accountType}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-xs text-muted-foreground">País</span>
                <span className="text-sm text-foreground">{ticketData.country}</span>
              </div>
            </div>
          </div>

          {/* Process Info */}
          {processData && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                📑 Proceso y Tipificación
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Categoría</span>
                    <span className="text-sm text-foreground">{processData.categoria}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Proceso</span>
                    <span className="text-sm text-foreground">{processData.proceso}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Gestión / Asunto (HeroCare)</span>
                    <span className="text-sm text-primary">{processData.gestionHeroCare}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Motivo de Contacto Local</span>
                    <span className="text-sm text-blue-500">{processData.motivoContacto}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions by tool */}
          {boActions.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                🖥️ Acciones en Backoffice
              </h3>
              <div className="space-y-0">
                {boActions.map((act, i) => (
                  <div key={`bo-${i}`} className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{act.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vboActions.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                🔧 Acciones en Vendor Backoffice
              </h3>
              <div className="space-y-0">
                {vboActions.map((act, i) => (
                  <div key={`vbo-${i}`} className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{act.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleCopy}>
              {copied ? '✅ Copiado!' : '📋 Copiar Resumen'}
            </Button>
            <Button variant="outline" onClick={onReset}>
              ＋ Nuevo Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {copied && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-medium animate-in slide-in-from-bottom-3 duration-300">
          Resumen copiado al portapapeles
        </div>
      )}
    </div>
  );
}
