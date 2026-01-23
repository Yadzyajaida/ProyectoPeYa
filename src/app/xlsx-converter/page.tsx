'use client';

import { FileConverter } from '@/components/file-converter';
import { convertFiles, convertCsvToXlsx } from '@/app/actions';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function XlsxConverterPage() {
  return (
    <DashboardLayout>
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto justify-items-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Convertidor de Archivos
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Sube tus archivos para convertirlos entre diferentes formatos.
          </p>
        </div>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
