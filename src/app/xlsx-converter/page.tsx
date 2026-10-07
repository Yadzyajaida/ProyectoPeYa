'use client';

import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { FileConverter } from '@/components/file-converter';
import { convertFiles, convertCsvToXlsx } from '@/app/actions';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function XlsxConverterPage() {
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
              Convertidor de archivos
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sube tus archivos para convertirlos entre diferentes formatos.
            </p>
          </div>
        </header>
        <main className="flex-grow w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 pb-0">
          <div className="grid grid-cols-1 gap-8">
            <FileConverter
              title="Convertidor de XLSX a CSV"
              description="Convierte tus archivos XLSX o XLS a CSV. El resultado será delimitado por punto y coma."
              processAction={convertFiles}
              fileType='xlsx-to-csv'
              acceptedFileTypes={{'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls']}}
              fileTypeDescription='XLSX o XLS'
            />
            <FileConverter
              title="Convertidor de CSV a XLSX"
              description="Convierte tus archivos CSV (delimitados por punto y coma) a formato XLSX."
              processAction={convertCsvToXlsx}
              fileType='csv-to-xlsx'
              acceptedFileTypes={{'text/csv': ['.csv']}}
              fileTypeDescription='CSV'
            />
          </div>
        </main>
      </DashboardLayout>
    );
  }
}
