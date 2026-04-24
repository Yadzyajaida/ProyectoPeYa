'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import ExcelComparatorUI from "@/components/ui/ExcelComparatorUI";

export default function CompararExcel() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Cargando...</p>;

  if (!session) {
    redirect('/'); 
  }{
    return (
      <DashboardLayout>
        <header className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto justify-items-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
              Comparar Archivos
            </h1>
            <p className="mt-4 max-w-6xl text-lg text-muted-foreground">
              Sube tus archivos para comparar los valores de las columnas y filas ingresadas.
            </p>
          </div>
        </header>
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 gap-8">
            <ExcelComparatorUI />
          </div>
        </main>
      </DashboardLayout>
      
    );
  }
}