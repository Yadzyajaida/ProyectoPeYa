"use client";

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from 'lucide-react';

interface FileComparatorProps {
  title: string;
  fileType: 'productos' | 'opcionales';
  idColumn: string;
  file1Label: string;
  file2Label: string;
  description: string;
}

// DataRow types
type DataRow = { [key: string]: any; };

export default function FileComparator({ title, fileType, idColumn, file1Label, file2Label, description }: FileComparatorProps) {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileSetter: (file: File | null) => void, fileNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.includes(fileType)) {
        fileSetter(file);
        if (error.includes(`archivo ${fileNumber}`)) {
            setError('');
        }
      } else {
        fileSetter(null);
        e.target.value = ''; 
        setError(`Error: El archivo ${fileNumber} debe contener la palabra "${fileType}" en su nombre.`);
      }
    }
  };

  const readExcelFile = (file: File): Promise<DataRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<DataRow>(worksheet, { defval: "" });
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setError('Por favor, sube ambos archivos para comparar.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLog([]);

    try {
      const data1 = await readExcelFile(file1);
      const data2 = await readExcelFile(file2);

      const dataMap1 = new Map<string | number, { row: DataRow, index: number }>();
      data1.forEach((row, index) => {
        if (row[idColumn] != null) {
          dataMap1.set(row[idColumn], { row, index });
        }
      });

      const dataMap2 = new Map<string | number, { row: DataRow, index: number }>();
      data2.forEach((row, index) => {
        if (row[idColumn] != null) {
          dataMap2.set(row[idColumn], { row, index });
        }
      });

      const changes: string[] = [];

      // Check for modifications and additions
      for (const [id, { row: row2, index: index2 }] of dataMap2.entries()) {
        const excelRow = index2 + 2; // +2 to account for 0-based index and header row
        const data1Entry = dataMap1.get(id);

        if (data1Entry) {
          // ID exists in both files: Check for modifications
          const { row: row1 } = data1Entry;
          const rowChanges: string[] = [];
          const allKeys = new Set([...Object.keys(row1), ...Object.keys(row2)]);

          for (const key of allKeys) {
            if (key !== idColumn) {
              const val1 = row1[key] ?? "";
              const val2 = row2[key] ?? "";
              if (String(val1) !== String(val2)) {
                rowChanges.push(`la columna "${key}" cambió de "${val1}" a "${val2}"`);
              }
            }
          }

          if (rowChanges.length > 0) {
            changes.push(`FILA ${excelRow}: ID ${id}: ${rowChanges.join(', ')}.`);
          }
        } else {
          // ID is new in the second file
          changes.push(`FILA ${excelRow}: ID ${id} añadido en el nuevo archivo.`);
        }
      }

      // Check for deletions
      for (const [id, { index: index1 }] of dataMap1.entries()) {
        if (!dataMap2.has(id)) {
          const excelRow = index1 + 2;
          changes.push(`FILA ${excelRow} (archivo antiguo): ID ${id} eliminado del nuevo archivo.`);
        }
      }

      if (changes.length === 0) {
        setLog(['✅ No se encontraron diferencias, adiciones ni eliminaciones entre los archivos.']);
      } else {
        setLog(changes);
      }

    } catch (e) {
      console.error(e);
      setError('Hubo un error al leer o comparar los archivos. Revisa la consola para más detalles.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFile1(null);
    setFile2(null);
    setLog([]);
    setError('');
    if (fileInput1Ref.current) fileInput1Ref.current.value = '';
    if (fileInput2Ref.current) fileInput2Ref.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
              <Label htmlFor={`file1-${fileType}`}>{file1Label}</Label>
              <Input ref={fileInput1Ref} id={`file1-${fileType}`} type="file" onChange={(e) => handleFileChange(e, setFile1, 1)} accept=".csv, .xlsx, .xls" />
              {file1 && <p className="text-sm text-muted-foreground truncate">Cargado: {file1.name}</p>}
          </div>
          <div className="space-y-2">
              <Label htmlFor={`file2-${fileType}`}>{file2Label}</Label>
              <Input ref={fileInput2Ref} id={`file2-${fileType}`} type="file" onChange={(e) => handleFileChange(e, setFile2, 2)} accept=".csv, .xlsx, .xls"/>
              {file2 && <p className="text-sm text-muted-foreground truncate">Cargado: {file2.name}</p>}
          </div>
        </div>

        {log.length > 0 && (
          <div className="space-y-2">
              <Label>Resultados de la Comparación</Label>
              <Textarea readOnly value={log.join('\n')} rows={Math.min(10, log.length)} className="font-mono text-xs" />
          </div>
        )}
         {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button onClick={handleCompare} disabled={isLoading || !file1 || !file2}>
          {isLoading ? 'Comparando...' : 'Comparar'}
        </Button>
        <Button onClick={handleClear} variant="ghost" disabled={!file1 && !file2 && log.length === 0 && !error}>
          <Trash className="mr-2 h-4 w-4" />
          Limpiar
        </Button>
      </CardFooter>
    </Card>
  );
}
