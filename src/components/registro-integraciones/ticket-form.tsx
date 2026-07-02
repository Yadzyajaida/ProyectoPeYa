'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Chile', 'Colombia', 'Costa Rica',
  'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras',
  'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'Uruguay', 'Venezuela',
];

const ACCOUNT_TYPES = [
  { value: 'IB', label: 'IB — Cuentas muy importantes' },
  { value: 'KA', label: 'KA — Cuentas importantes' },
];

export interface TicketData {
  ticket: string;
  partnerId: string;
  partner: string;
  accountType: string;
  country: string;
}

interface TicketFormProps {
  onSubmit: (data: TicketData) => void;
}

export function TicketForm({ onSubmit }: TicketFormProps) {
  const [formData, setFormData] = useState<TicketData>({
    ticket: '',
    partnerId: '',
    partner: '',
    accountType: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.ticket && formData.partner && formData.accountType && formData.country;

  return (
    <Card className="animate-in fade-in duration-300">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-foreground mb-2">📋 Registrar Ticket</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Completa la información del ticket antes de documentar las acciones realizadas.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="ticket" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Ticket ID
              </Label>
              <Input
                type="text"
                id="ticket"
                name="ticket"
                value={formData.ticket}
                onChange={handleChange}
                required
                placeholder="Número de ticket"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerId" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                ID del Partner
              </Label>
              <Input
                type="text"
                id="partnerId"
                name="partnerId"
                value={formData.partnerId}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Nombre del Partner
              </Label>
              <Input
                type="text"
                id="partner"
                name="partner"
                value={formData.partner}
                onChange={handleChange}
                required
                placeholder="Nombre de la tienda"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Tipo de Cuenta
              </Label>
              <Select value={formData.accountType} onValueChange={(val) => setFormData(p => ({ ...p, accountType: val }))} required>
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="country" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                País
              </Label>
              <Select value={formData.country} onValueChange={(val) => setFormData(p => ({ ...p, country: val }))} required>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Seleccionar país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-6 pt-5 border-t border-border">
            <Button type="submit" disabled={!isValid}>
              Iniciar Registro →
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
