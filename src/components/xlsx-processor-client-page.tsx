'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { UnifiedFileProcessor } from '@/components/unified-file-processor';
import { processFiles } from '@/app/actions';
import { DashboardLayout } from '@/components/dashboard-layout';
import MensajeFlotante from "@/components/mensaje-flotante";
import { Info, X } from "lucide-react";

export default function XlsxProcessorClientPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (!session) { redirect('/'); }

  return (
    <DashboardLayout>
      <header className="py-8 px-6 sm:px-8 lg:px-6">
        <div className="max-w-7xl mx-auto justify-items-center">
          <h1 className="text-12xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Procesador de archivos
          </h1>
          <div className="mt-4 max-w-6xl text-lg text-muted-foreground">
            <div className="flex items-start gap-6">
              <Info className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Puntos clave del procesador</h2>
                <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-2">
                    <li>Este procesador es exclusivo para el proceso de <strong>codificar menú</strong>.</li>
                    <li>Los archivos a subir deben estar en formato <strong>XLSX</strong> y tener las <strong>mismas columnas</strong> que los archivos descargados de <strong>Backoffice</strong>.</li>
                    <li>No necesitas corregir SKUs vacíos, duplicados, ni eliminar columnas. El sistema se encarga de todo automáticamente.</li>
                    <li>El sistema revisará que las columnas cumplan con el formato adeacuado según las indicaciones de <strong>Backoffice</strong>.</li>
                    <li>Si el archivo de opcionales cuenta con SKUs de opcionales repetidos, <strong>dentro de un mismo grupo opcional</strong>, el sistema le antepone una letra para que puedan ser subidos <strong>(debido a un error del sistema Backoffice, donde solo sube el último opcional con SKU repetido)</strong> .</li>
                    <li>El sistema revisa las columnas de cantidad mínima y máxima de los opcionales y los rellena aútomaticamente.</li>
                    <li>Si el archivo de opcionales está vacío, la herramienta lo ignorará y solo procesará el de productos.</li>
                    <li>Al finalizar, se descargará el/los archivo(s) <strong>.CSV</strong> y se mostrará un log con todas las modificaciones tanto en productos como en opcionales.</li>
                    <li>Sube los archivos generados directamente a un local eliminado. Si hubo correcciones de SKU, sube ambos archivos (productos y opcionales), una vez cargados realiza las modificaciones directamente en el Backoffice.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 gap-8">
          <UnifiedFileProcessor
            title="Procesador de productos y opcionales"
            description={"Procesa ambos archivos simultáneamente. El sistema ajustará los SKUs, sincronizará los datos entre los archivos y generará los CSVs listos para usar."}
            processAction={processFiles}
          />
        </div>
      </main>
    </DashboardLayout>
  );
}
