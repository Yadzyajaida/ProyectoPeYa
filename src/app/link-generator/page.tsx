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
        <header className="pb-2 pt-0 px-2 sm:px-4 lg:px-6">
          <div className="max-w-[1600px] mx-auto ">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Apertura de multipágina
            </h1>
            <p className="mt-2 text-muted-foreground">
              Pega una lista de IDs para generar enlaces de Backoffice o VBO. Se podra aperturar masivamente o de manera manual.
            </p>
          </div>
        </header>
        <main className="flex-grow w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 pb-0">
          <div className="grid grid-cols-1 gap-8 ">
            <LinkGenerator />
          </div>
        </main>
      </DashboardLayout>
    );
  }
}
