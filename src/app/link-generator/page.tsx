'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { LinkGenerator } from '@/components/link-generator';

export default function LinkGeneratorPage() {
  return (
    <DashboardLayout>
      <header className="py-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto justify-items-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Generador de enlaces
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Pega una lista de IDs para generar enlaces de Backoffice o VBO masivamente.
          </p>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 gap-8 ">
          <LinkGenerator />
        </div>
      </main>
    </DashboardLayout>
  );
}
