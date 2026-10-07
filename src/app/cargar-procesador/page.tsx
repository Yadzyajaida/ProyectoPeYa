'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CargarProcesadorUploader } from '@/components/cargar-procesador-uploader';
import { Info } from "lucide-react";

export default function CargarProcesadorPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Cargando...</p>;

  //if (!session) {
  //  redirect('/'); 
  //}
  
  return (
    <DashboardLayout>
      <header className="pb-2 pt-0 px-6 sm:px-8 lg:px-6">
        <div className="w-full max-w-[1600px] mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Cargar Procesador
          </h1>
          <div className="mt-2 w-full text-muted-foreground">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">Sube tus archivos para convertirlos al formato adecuado</h2>
                <ul className="list-disc pl-5 text-muted-foreground text-xs space-y-1">
                    <li>Selecciona el tipo de formato al que deseas convertir (Productos, Opcionales, Precios, etc.).</li>
                    <li>Sube tu archivo de Excel. El sistema detectará automáticamente la hoja con datos.</li>
                    <li>Indica si el archivo que subes ya tiene encabezados o no.</li>
                    <li>Se corregirán automáticamente los SKUs duplicados y vacíos en los formatos aplicables.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-0">
        <CargarProcesadorUploader />
      </main>
    </DashboardLayout>
  );
}
