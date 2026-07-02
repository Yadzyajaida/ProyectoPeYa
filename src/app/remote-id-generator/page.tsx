'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard-layout';
import { RemoteIdGenerator } from '@/components/remote-id-generator';

export default function RemoteIdGeneratorPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;

  if (!session) {
    redirect('/'); 
  }{
    return (
      <DashboardLayout>
        <header className="py-8 px-2 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto justify-items-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
              Generador de remote ID
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Crea un remote ID estandarizado según el nombre del local.
            </p>
          </div>
        </header>
        <main className="flex-grow w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-12">
          <div className="grid grid-cols-1 gap-8">
            <RemoteIdGenerator />
          </div>
        </main>
      </DashboardLayout>
    );
  } 
}
