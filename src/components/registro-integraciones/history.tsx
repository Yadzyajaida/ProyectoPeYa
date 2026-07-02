'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db, collection, query, where, getDocs } from '@/lib/firebase-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const ITEMS_PER_PAGE = 20;

export function History({ userEmail }: HistoryProps) {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);

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

  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = tickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="animate-in fade-in duration-300 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {tickets.length} {tickets.length === 1 ? 'ticket registrado' : 'tickets registrados'}
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Cuenta</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Proceso / Categoría</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTickets.map((ticket) => (
              <TableRow 
                key={ticket.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedTicket(ticket)}
              >
                <TableCell className="font-medium">
                  <Badge variant="outline" className="text-primary border-primary/20">
                    {ticket.ticketId}
                  </Badge>
                </TableCell>
                <TableCell className="truncate max-w-[200px]" title={ticket.partner}>
                  {ticket.partner}
                </TableCell>
                <TableCell>{ticket.cuenta}</TableCell>
                <TableCell>{ticket.pais}</TableCell>
                <TableCell className="truncate max-w-[250px]" title={ticket.procesoSeguido}>
                  {ticket.procesoSeguido || '—'}
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {new Date(ticket.fecha).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <span className="text-xs text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 border-b pb-4">
              <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                {selectedTicket?.ticketId}
              </Badge>
              <span className="text-sm text-muted-foreground font-normal">
                {selectedTicket ? new Date(selectedTicket.fecha).toLocaleString() : ''}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6 py-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
                {selectedTicket.partnerId && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium mb-1">ID Partner</p>
                    <p className="text-sm font-semibold text-foreground break-all">{selectedTicket.partnerId}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Partner</p>
                  <p className="text-sm font-semibold text-foreground break-all">{selectedTicket.partner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Cuenta</p>
                  <p className="text-sm font-semibold text-foreground break-all">{selectedTicket.cuenta}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium mb-1">País</p>
                  <p className="text-sm font-semibold text-foreground break-all">{selectedTicket.pais}</p>
                </div>
              </div>

              {/* Proceso y Tipificación */}
              {selectedTicket.procesoSeguido && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    📑 Proceso Seguido
                  </h4>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                    <p className="text-sm font-medium mb-3">{selectedTicket.procesoSeguido}</p>
                    <div className="flex gap-6 flex-wrap">
                      {selectedTicket.gestionHeroCare && (
                        <div>
                          <p className="text-[0.75rem] uppercase font-semibold text-muted-foreground mb-1">HeroCare</p>
                          <span className="text-sm text-primary">{selectedTicket.gestionHeroCare}</span>
                        </div>
                      )}
                      {selectedTicket.motivoContacto && (
                        <div>
                          <p className="text-[0.75rem] uppercase font-semibold text-muted-foreground mb-1">Motivo de Contacto</p>
                          <span className="text-sm text-blue-500">{selectedTicket.motivoContacto}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones */}
              {(selectedTicket.accionesBackoffice || selectedTicket.accionesVbo) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTicket.accionesBackoffice && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        🖥️ Backoffice
                      </h4>
                      <div className="bg-muted/50 p-4 rounded-lg h-full border border-border/50">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.accionesBackoffice}</p>
                      </div>
                    </div>
                  )}
                  {selectedTicket.accionesVbo && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        🔧 Vendor Backoffice
                      </h4>
                      <div className="bg-muted/50 p-4 rounded-lg h-full border border-border/50">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.accionesVbo}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
