'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { processCategories, type ProcessCategory, type ProcessItem } from '@/lib/data/processes';

interface ProcessData {
  categoria: string;
  proceso: string;
  gestionHeroCare: string;
  motivoContacto: string;
}

interface ProcessWizardProps {
  partnerName: string;
  onComplete: (data: ProcessData) => void;
  onBack: () => void;
}

export function ProcessWizard({ partnerName, onComplete, onBack }: ProcessWizardProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProcessCategory | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<ProcessItem | null>(null);

  const replacePartner = (text: string) => {
    return text.replace(/\{partner\}/g, partnerName || 'Partner');
  };

  const handleCategorySelect = (cat: ProcessCategory) => {
    setSelectedCategory(cat);
    setSelectedProcess(null);
  };

  const handleProcessSelect = (proc: ProcessItem) => {
    setSelectedProcess(proc);
  };

  const handleConfirm = () => {
    if (!selectedCategory || !selectedProcess) return;
    onComplete({
      categoria: selectedCategory.label,
      proceso: selectedProcess.label,
      gestionHeroCare: replacePartner(selectedProcess.gestionHeroCare),
      motivoContacto: selectedProcess.motivoContacto,
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProcess(null);
  };

  // Paso 1: Elegir categoría (SOP)
  if (!selectedCategory) {
    return (
      <Card className="animate-in fade-in duration-300">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-foreground mb-2">📑 Proceso Seguido</h2>
          <p className="text-sm text-muted-foreground mb-5">
            ¿En qué categoría se encuentra el proceso que realizaste?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {processCategories.map(cat => (
              <button
                key={cat.id}
                className="text-left p-3.5 rounded-md border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                onClick={() => handleCategorySelect(cat)}
              >
                <span className="text-xl block mb-1">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-5 border-t border-border">
            <Button variant="ghost" onClick={onBack}>← Volver</Button>
            <div />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Paso 2: Elegir proceso
  if (!selectedProcess) {
    return (
      <Card className="animate-in fade-in duration-300">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-foreground mb-2">
            {selectedCategory.icon} {selectedCategory.label}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">¿Qué proceso realizaste?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedCategory.processes.map(proc => (
              <button
                key={proc.id}
                className="text-left p-3.5 rounded-md border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                onClick={() => handleProcessSelect(proc)}
              >
                {proc.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6 pt-5 border-t border-border">
            <Button variant="ghost" onClick={handleBackToCategories}>← Cambiar categoría</Button>
            <div />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Paso 3: Confirmación con tipificación auto-generada
  return (
    <Card className="animate-in fade-in duration-300">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-foreground mb-2">✅ Confirmar Tipificación</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Revisa que la información sea correcta antes de continuar.
        </p>

        <div className="bg-muted/50 rounded-lg p-5 mb-5 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Categoría</p>
            <p className="font-semibold text-foreground">{selectedCategory.icon} {selectedCategory.label}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Proceso</p>
            <p className="font-semibold text-foreground">{selectedProcess.label}</p>
          </div>
          <hr className="border-border" />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Gestión / Asunto (HeroCare)</p>
            <p className="font-semibold text-primary">{replacePartner(selectedProcess.gestionHeroCare)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Motivo de Contacto Local</p>
            <p className="font-semibold text-blue-500">{selectedProcess.motivoContacto}</p>
          </div>
        </div>

        <div className="flex justify-between pt-5 border-t border-border">
          <Button variant="ghost" onClick={() => setSelectedProcess(null)}>← Cambiar proceso</Button>
          <Button onClick={handleConfirm}>Confirmar y Continuar →</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export type { ProcessData };
