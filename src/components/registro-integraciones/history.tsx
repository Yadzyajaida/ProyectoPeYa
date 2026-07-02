'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db, collection, query, where, getDocs } from '@/lib/firebase-client';

interface TicketRecord {
  id: string;
  fecha: string;
  ticketId: string;
  partnerId?: string;
  partner: string;
  cuenta: string;
  pais: string;
  procesoSeguido?: string;
  gestionHeroCare?: string;
  motivoContacto?: string;
  accionesBackoffice?: string;
  accionesVbo?: string;
}

interface HistoryProps {
  userEmail: string;
}

export function History({ userEmail }: HistoryProps) {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userEmail) return;

      try {
        const q = query(
          collection(db, 'tickets'),
          where('agenteEmail', '==', userEmail)
        );

        const querySnapshot = await getDocs(q);
        let fetchedTickets: TicketRecord[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TicketRecord[];

        // Ordenar en el cliente (más reciente primero)
        fetchedTickets.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        setTickets(fetchedTickets);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userEmail]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Cargando historial...</p>
        </CardContent>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="p-16 text-center">
          <p className="text-5xl mb-3">📭</p>
          <h2 className="text-lg font-semibold text-foreground mb-2">Sin registros aún</h2>
          <p className="text-muted-foreground text-sm">Los tickets que completes aparecerán aquí automáticamente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      <p className="text-sm text-muted-foreground">
        {tickets.length} {tickets.length === 1 ? 'ticket registrado' : 'tickets registrados'}
      </p>
      {tickets.map(ticket => (
        <Card key={ticket.id}>
          <CardContent className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
              <Badge className="bg-primary text-primary-foreground">{ticket.ticketId}</Badge>
              <span className="text-xs text-muted-foreground">{new Date(ticket.fecha).toLocaleString()}</span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {ticket.partnerId && (
                <div>
                  <p className="text-xs text-muted-foreground">ID Partner</p>
                  <p className="text-sm font-medium text-foreground">{ticket.partnerId}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Partner</p>
                <p className="text-sm font-medium text-foreground">{ticket.partner}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cuenta</p>
                <p className="text-sm font-medium text-foreground">{ticket.cuenta}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">País</p>
                <p className="text-sm font-medium text-foreground">{ticket.pais}</p>
              </div>
            </div>

            {/* Proceso y Tipificación */}
            {ticket.procesoSeguido && (
              <div className="bg-muted/50 p-3 rounded-lg mb-2">
                <p className="text-xs text-muted-foreground mb-1.5">📑 Proceso Seguido</p>
                <p className="text-sm mb-1.5">{ticket.procesoSeguido}</p>
                <div className="flex gap-5 flex-wrap mt-1.5">
                  {ticket.gestionHeroCare && (
                    <div>
                      <p className="text-[0.7rem] text-muted-foreground">HeroCare</p>
                      <span className="text-sm text-primary">{ticket.gestionHeroCare}</span>
                    </div>
                  )}
                  {ticket.motivoContacto && (
                    <div>
                      <p className="text-[0.7rem] text-muted-foreground">Motivo de Contacto</p>
                      <span className="text-sm text-blue-500">{ticket.motivoContacto}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Separated BO / VBO sections */}
            {ticket.accionesBackoffice && (
              <div className="bg-muted/50 p-3 rounded-lg mb-2">
                <p className="text-xs text-muted-foreground mb-1.5">🖥️ Backoffice</p>
                <p className="text-sm leading-relaxed">{ticket.accionesBackoffice}</p>
              </div>
            )}
            {ticket.accionesVbo && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1.5">🔧 Vendor Backoffice</p>
                <p className="text-sm leading-relaxed">{ticket.accionesVbo}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
