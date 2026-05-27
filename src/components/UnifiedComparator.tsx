'use client';

import { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, File as FileIcon, X, UploadCloud, CheckCircle2, KeyRound } from 'lucide-react';

// Type definitions
type DataRow = { [key: string]: any; };
type FileGroup = { products: File | null; optionals: File | null };
type LogState = { products: string[]; optionals: string[] };
type ComparisonKey = 'ID' | 'Nombre' | 'SKU';

// --- Helper Functions ---

const normalizeKeys = (data: DataRow[]): DataRow[] => {
  if (!data) return [];
  return data.map(row => 
    Object.keys(row).reduce((acc, key) => {
      acc[key.toLowerCase()] = row[key];
      return acc;
    }, {} as DataRow)
  );
};

// --- Sub-components ---

const FilePill = ({ file, onClear, label }: { file: File, onClear: () => void, label: string }) => (
  <div className="flex items-center justify-between w-full px-3 py-2 bg-background rounded-lg border">
    <div className="flex items-center gap-3 overflow-hidden">
      <FileIcon className="w-6 h-6 flex-shrink-0 text-primary" />
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-medium truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
    <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="p-1 rounded-full text-muted-foreground hover:bg-muted">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const DropzoneSection = ({ files, onFilesChange, title, inputRef }: { files: FileGroup, onFilesChange: (files: FileGroup) => void, title: string, inputRef: React.RefObject<HTMLInputElement | null> }) => {
    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFiles(e.dataTransfer.files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(e.target.files);
    };

    const handleFiles = (fileList: FileList) => {
        let updatedFiles = { ...files };
        Array.from(fileList).forEach(file => {
            const fileName = file.name.toLowerCase();
            if (fileName.includes('productos')) {
                updatedFiles.products = file;
            } else if (fileName.includes('opcionales')) {
                updatedFiles.optionals = file;
            }
        });
        onFilesChange(updatedFiles);
        if(inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div
                className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer bg-card hover:border-primary transition-all duration-300 min-h-[180px] h-full"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input ref={inputRef as React.RefObject<HTMLInputElement>} type="file" multiple className="hidden" onChange={handleFileSelect} accept=".csv, .xlsx, .xls" />
                
                {(!files.products && !files.optionals) ? (
                    <div className="text-center pointer-events-none">
                        <UploadCloud className="mx-auto w-10 h-10 text-muted-foreground" />
                        <p className="mt-2 font-semibold text-primary">Subir archivos</p>
                        <p className="mt-1 text-xs text-muted-foreground">Arrastra y suelta 'productos' y 'opcionales'</p>
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-1 gap-4">
                        {files.products && <FilePill file={files.products} onClear={() => onFilesChange({ ...files, products: null })} label="Archivo de Productos" />} 
                        {files.optionals && <FilePill file={files.optionals} onClear={() => onFilesChange({ ...files, optionals: null })} label="Archivo de Opcionales" />}
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultCard = ({ title, logs }: { title: string, logs: string[] }) => (
    <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="flex items-center gap-2 text-base font-semibold mb-3"><FileIcon className="w-4 h-4"/> {title} ({logs.length})</h3>
        <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">{logs.join('\n')}</pre>
    </div>
);

// --- Main Component ---

export default function UnifiedComparator() {
  const [filesOld, setFilesOld] = useState<FileGroup>({ products: null, optionals: null });
  const [filesNew, setFilesNew] = useState<FileGroup>({ products: null, optionals: null });
  const [comparisonKey, setComparisonKey] = useState<ComparisonKey>('ID');

  const [logs, setLogs] = useState<LogState>({ products: [], optionals: [] });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const inputRefOld = useRef<HTMLInputElement>(null);
  const inputRefNew = useRef<HTMLInputElement>(null);

  const readExcelFile = (file: File): Promise<DataRow[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const jsonData = XLSX.utils.sheet_to_json<DataRow>(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
                resolve(normalizeKeys(jsonData)); // Normalize keys to lowercase
            } catch (e) { reject(e); }
        };
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
    });
  };

  const compareLogic = (oldData: DataRow[], newData: DataRow[], keyField: string, columnsToWatch: string[]) => {
    const changes: string[] = [];
    const oldMap = new Map<any, { row: DataRow; index: number }>();
    oldData.forEach((row, index) => {
        const key = row[keyField];
        if (key != null && String(key).trim() !== '') {
            oldMap.set(String(key).trim(), { row, index });
        }
    });

    const newMap = new Map<any, { row: DataRow; index: number }>();
    newData.forEach((row, index) => {
        const key = row[keyField];
        if (key != null && String(key).trim() !== '') {
            newMap.set(String(key).trim(), { row, index });
        }
    });

    const isComparingByNonIdKey = keyField.toLowerCase() !== 'id';

    for (const [key, { row: newRow, index: newIndex }] of newMap.entries()) {
        const excelRow = newIndex + 2;
        if (oldMap.has(key)) {
            const { row: oldRow } = oldMap.get(key)!;
            const rowChanges: string[] = [];

            for (const col of columnsToWatch) {
                if (isComparingByNonIdKey && col.toLowerCase() === 'id') {
                    continue;
                }

                const val1 = oldRow[col] ?? '';
                const val2 = newRow[col] ?? '';
                
                let areDifferent = false;
                if (col.toLowerCase() === 'precio') {
                    const num1 = parseFloat(String(val1));
                    const num2 = parseFloat(String(val2));
                    if (!isNaN(num1) && !isNaN(num2)) {
                        areDifferent = num1 !== num2;
                    } else {
                        areDifferent = String(val1).trim() !== String(val2).trim();
                    }
                } else {
                    areDifferent = String(val1).trim() !== String(val2).trim();
                }

                if (areDifferent) {
                    rowChanges.push(`la columna "${col}" cambió de "${val1}" a "${val2}"`);
                }
            }

            if (rowChanges.length > 0) {
                 changes.push(`* Fila ${excelRow} (${keyField}: "${key}"): ${rowChanges.join(', ')}.`);
            }
        } else {
            changes.push(`+ Fila ${excelRow}: Nuevo añadido (${keyField}: "${key}").`);
        }
    }

    for (const [key, { row: oldRow, index: oldIndex }] of oldMap.entries()) {
        if (!newMap.has(key)) {
            changes.push(`- Fila ${oldIndex + 2} (antiguo): Eliminado (${keyField}: "${key}").`);
        }
    }
    return changes.sort();
  };

  const handleCompare = async () => {
    setIsLoading(true);
    setError('');
    setLogs({ products: [], optionals: [] });
    setIsCompleted(false);

    try {
        const [pOld, oOld, pNew, oNew] = await Promise.all([
            filesOld.products ? readExcelFile(filesOld.products) : Promise.resolve([]),
            filesOld.optionals ? readExcelFile(filesOld.optionals) : Promise.resolve([]),
            filesNew.products ? readExcelFile(filesNew.products) : Promise.resolve([]),
            filesNew.optionals ? readExcelFile(filesNew.optionals) : Promise.resolve([]),
        ]);

        let pKey: string, oKey: string;
        const pCols = ['sección', 'nombre', 'precio', 'sku', 'descripción'];
        const oCols = ['sku producto', 'grupo de opciones', 'nombre opción', 'precio', 'sku', 'modifica precio'];

        switch (comparisonKey) {
            case 'Nombre':
                pKey = 'nombre';
                oKey = 'nombre opción';
                break;
            case 'SKU':
                pKey = 'sku';
                oKey = 'sku';
                break;
            case 'ID':
            default:
                pKey = 'id';
                oKey = 'id opción'; 
                break;
        }

        const productChanges = (filesOld.products && filesNew.products) ? compareLogic(pOld, pNew, pKey, pCols) : [];
        const optionalChanges = (filesOld.optionals && filesNew.optionals) ? compareLogic(oOld, oNew, oKey, oCols) : [];

        setLogs({ products: productChanges, optionals: optionalChanges });
        setIsCompleted(true);

    } catch (e) {
        console.error(e);
        setError("Hubo un error al leer o comparar los archivos.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleClear = () => {
      setFilesOld({ products: null, optionals: null });
      setFilesNew({ products: null, optionals: null });
      setLogs({ products: [], optionals: [] });
      setError('');
      setIsCompleted(false);
  };
  
  const canCompare = useMemo(() => {
    return (filesOld.products && filesNew.products) || (filesOld.optionals && filesNew.optionals);
  }, [filesOld, filesNew]);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DropzoneSection files={filesOld} onFilesChange={setFilesOld} title="Archivos antiguos" inputRef={inputRefOld} />
            <DropzoneSection files={filesNew} onFilesChange={setFilesNew} title="Archivos nuevos" inputRef={inputRefNew} />
        </div>
        <div className='flex flex-row items-center justify-center gap-4 pt-4'>
            <label className='flex items-center gap-2 text-lg font-semibold'>
                <KeyRound className="w-6 h-6 text-primary" />
                Comparar por:
            </label>
            <Select value={comparisonKey} onValueChange={(v) => setComparisonKey(v as ComparisonKey)}>
                <SelectTrigger className="w-full max-w-xs text-base h-12">
                    <SelectValue placeholder="Elegir clave..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ID">ID</SelectItem>
                    <SelectItem value="Nombre">Nombre</SelectItem>
                    <SelectItem value="SKU">SKU</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center gap-4 pt-6">
        <div className="flex justify-center gap-4 w-full">
            <Button onClick={handleCompare} disabled={isLoading || !canCompare} className="w-full max-w-xs text-lg py-6">
              {isLoading ? 'Comparando...' : 'Comparar Archivos'}
            </Button>
            <Button onClick={handleClear} variant="outline" size="lg">
              <Trash className="h-5 w-5" />
            </Button>
        </div>

        {isCompleted && logs.products.length === 0 && logs.optionals.length === 0 && !error && (
             <div className="mt-6 p-4 w-full text-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center justify-center gap-3">
                <CheckCircle2 className="w-6 h-6"/>
                <p className="font-semibold text-base">¡Proceso completado! No se encontraron cambios.</p>
            </div>
        )}
        {error && <p className="mt-6 text-sm font-medium text-destructive text-center">{error}</p>}
        
        {(logs.products.length > 0 || logs.optionals.length > 0) && (
            <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {logs.products.length > 0 && <ResultCard title="Modificaciones en Productos" logs={logs.products} />}
                 {logs.optionals.length > 0 && <ResultCard title="Modificaciones en Opcionales" logs={logs.optionals} />}
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
