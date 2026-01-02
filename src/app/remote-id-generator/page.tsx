'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { RemoteIdGenerator } from '@/components/remote-id-generator';

export default function RemoteIdGeneratorPage() {
  return (
    <DashboardLayout>
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Generador de Remote ID
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Crea Remote IDs estandarizados para locales de forma masiva.
          </p>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 gap-8">
          <RemoteIdGenerator />
        </div>
      </main>
    </DashboardLayout>
  );
}
