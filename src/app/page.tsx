import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileCode, Type, FileText, FileSpreadsheet, FileCog, Link as LinkIcon, FileWarning, Fingerprint } from 'lucide-react';
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
                  <FileCode className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Generador de Remote ID</CardTitle>
                <CardDescription className="mt-2">
                  Crea Remote IDs estandarizados para locales.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/enlaces-google">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Documentos</CardTitle>
                <CardDescription className="mt-2">
                  Una colección de documentos o sheets creados por el equipo para facilitar la gestión de integraciones.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </DashboardLayout>
  );
}
