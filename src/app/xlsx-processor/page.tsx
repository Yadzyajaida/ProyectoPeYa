'use client';

import { UnifiedFileProcessor } from '@/components/unified-file-processor';
import { processFiles } from '@/app/actions';
import { DashboardLayout } from '@/components/dashboard-layout';
import MensajeFlotante from "@/components/mensaje-flotante";


export default function XlsxProcessorPage() {

  return (
    <DashboardLayout>
      <header className="py-8 px-6 sm:px-8 lg:px-6">

        <div className="max-w-7xl mx-auto justify-items-center">
          <h1 className="text-12xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Procesador
          </h1>
          <div className="mt-4 max-w-6xl text-lg text-muted-foreground">
            Este procesador exclusivo para el proceso de codificar menú, nos agilizara la conversión del formato adecuado de ambos archivos de productos y opcionales para subirlos a BO sin inconvenientes. <MensajeFlotante />
          </div>
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
