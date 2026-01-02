import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileSpreadsheet, FileCog, Link as LinkIcon, FileWarning, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <DashboardLayout>
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Herramientas
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Una colección de utilidades para simplificar tu trabajo.
          </p>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/xlsx-processor">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileSpreadsheet className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Procesador XLSX</CardTitle>
                <CardDescription className="mt-2">
                  Convierte y procesa tus archivos XLSX a formato CSV (listo para subir).
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/xlsx-converter">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileCog className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Convertidor</CardTitle>
                <CardDescription className="mt-2">
                  Convierte rápidamente archivos XLSX o XLS a formato CSV UTF-8 o a la inversa.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/link-generator">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <LinkIcon className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Generador de Enlaces</CardTitle>
                <CardDescription className="mt-2">
                  Crea enlaces de catálogo de Backoffice a partir de una lista de IDs.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/remote-id-generator">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Fingerprint className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Generador de Remote ID</CardTitle>
                <CardDescription className="mt-2">
                  Crea Remote IDs estandarizados para locales.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <a href="https://docs.google.com/document/d/1OqGgsJzInXzzqnQOXTCcP0ACF0BhEXi2YjTvPpbLOC0/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileWarning className="w-10 h-10 text-primary" />
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
                  <FileWarning className="w-10 h-10 text-primary" />
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
                  <FileWarning className="w-10 h-10 text-primary" />
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
                  <FileWarning className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Locales eliminados asignados</CardTitle>
                <CardDescription className="mt-2">
                  Lista de Locales eliminados para utlilziar asignados para identificar o añadir.
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        </div>
      </main>
    </DashboardLayout>
  );
}