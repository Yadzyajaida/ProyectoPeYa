'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import UnifiedComparator from "@/components/UnifiedComparator";
import { DashboardLayout } from '@/components/dashboard-layout';


export default function CompararExcelPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Cargando...</p>;

  if (!session) {
    redirect('/'); 
  }{
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-10 px-2 sm:px-4 lg:px-6">
              <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                      Comparador de archivos
                  </h1>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                      Sube tus archivos para comparar los valores de las columnas y filas ingresadas.
                  </p>
                  
              </div>

              <Card>
                  <CardHeader>
                      <CardTitle>Comparador de productos y opcionales</CardTitle>
                      <CardDescription>
                          Seleccione la columna de referencia para realizar la comparación (ID, Nombre o SKU) y suba las versiones antiguas y nuevas de sus archivos.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <UnifiedComparator />
                  </CardContent>
              </Card>

              
          </div>
      </DashboardLayout>
      
    );
  }
}
