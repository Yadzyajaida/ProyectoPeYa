'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Link as LinkIcon} from 'lucide-react';

export default function EnlacesGoogle() {
  return (
    <DashboardLayout>
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Documentos
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Una colección de documentos o sheets creados por el equipo para facilitar la gestión de integraciones.
          </p>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href="https://docs.google.com/document/d/1OqGgsJzInXzzqnQOXTCcP0ACF0BhEXi2YjTvPpbLOC0/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Guía de Escalaciones</CardTitle>
                <CardDescription className="mt-2">
                  Consulta las rutas para escalaciones urgentes.
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href="https://docs.google.com/spreadsheets/d/1xjyXZE-Euk_fUZcoLGDbzIjVdA9XUAmD/edit?gid=1033260094#gid=1033260094" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Templates Nice</CardTitle>
                <CardDescription className="mt-2">
                  Templates amigables para las diversas gestiones.
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href="https://docs.google.com/spreadsheets/d/1_w8qumDWMf3cx1o5PGXyWlSMs1_KwxUwVBRAEQ3yeQE/edit?gid=240001792#gid=240001792" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Lista de Locales Integradas</CardTitle>
                <CardDescription className="mt-2">
                  Lista de Tiendas Integradas en menús compartidos para identificar o añadir.
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href="https://docs.google.com/spreadsheets/d/18smPZvC53Rw85qbiq8CdIrT-l8vg60XIUSXA9byRiqk/edit?gid=443275292#gid=443275292" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Locales eliminados asignados</CardTitle>
                <CardDescription className="mt-2">
                  Lista de Locales eliminados para utlilziar asignados para identificar o añadir.
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href="https://docs.google.com/spreadsheets/d/1putMthnP2F_1wiMDnCs-v8Femy4lo4NDcBAXD9S8aVw/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Identificador de Locales</CardTitle>
                <CardDescription className="mt-2">
                  Lista de Locales clasificados por su Identificador de Locales IB,KA y LT
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href="https://docs.google.com/spreadsheets/d/1vPueVoGogcdpLTgsvfqj3S0AT5xBdGHQ6w0pja7xZ7s/edit?pli=1&gid=1564924724#gid=1564924724" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Tipificación por SOP | IS | HeroCare </CardTitle>
                <CardDescription className="mt-2">
                  Tipificaciones de casos de HeroCare clasificadas por SOP
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
          <a href="https://docs.google.com/spreadsheets/d/1vPueVoGogcdpLTgsvfqj3S0AT5xBdGHQ6w0pja7xZ7s/edit?pli=1&gid=1564924724#gid=1564924724" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Seteo Masivo</CardTitle>
                <CardDescription className="mt-2">
                  Saca una copia, cambia los datos y subelo a Vendor
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        </div>
      </main>
    </DashboardLayout>
  );
}
