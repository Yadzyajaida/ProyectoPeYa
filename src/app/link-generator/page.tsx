'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { LinkGenerator } from '@/components/link-generator';

export default function LinkGeneratorPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Cargando...</p>;

  if (!session) {
    redirect('/'); 
  }{
    return (
      <DashboardLayout>
        <header className="py-8 px-2 sm:px-4 lg:px-6 text-center">
          <div className="max-w-7xl mx-auto justify-items-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
              Apertura de multipágina
            </h1>
            <p className="mt-4 max-w-6xl text-lg text-muted-foreground">
              Pega una lista de IDs para generar enlaces de Backoffice o VBO. Se podra aperturar masivamente o de manera manual.
            </p>
          </div>
        </header>
        <main className="flex-grow w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-12">
          <div className="grid grid-cols-1 gap-8 ">
            <LinkGenerator />
          </div>
        </main>
      </DashboardLayout>
    );
  }
}
