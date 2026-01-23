'use client';

import { UnifiedFileProcessor } from '@/components/unified-file-processor';
import { processFiles } from '@/app/actions';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function XlsxProcessorPage() {
  return (
    <DashboardLayout>
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto justify-items-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Procesador para codificación
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Sube tus archivos de productos y opcionales para procesarlos de forma conjunta y descargarlos en formato CSV UTF-8, se descargan listos para codificar.
            Descarga y sube tus archivos
          </p>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 gap-8">
          <UnifiedFileProcessor
            title="Procesador de Productos y Opcionales"
            description="Procesa ambos archivos simultáneamente. El sistema ajustará los SKUs, sincronizará los datos entre los archivos y generará los CSVs listos para usar."
            processAction={processFiles}
          />
        </div>
      </main>
    </DashboardLayout>
  );
}
