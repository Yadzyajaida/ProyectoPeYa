"use client";

import { useState, useRef, useTransition, type ComponentProps } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, X, DownloadCloud, Loader2, Info, FileCheck2, Package, PackagePlus, FilePenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';

type ProcessResult = {
  data?: string;
  fileName?: string;
  error?: string;
  productosLog?: string[];
  opcionalesLog?: string[];
};

interface UnifiedFileProcessorProps extends ComponentProps<typeof Card> {
  title: string;
  description: string;
  processAction: (formData: FormData) => Promise<ProcessResult[]>;
}

export function UnifiedFileProcessor({ title, description, processAction, className, ...props }: UnifiedFileProcessorProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<ProcessResult[] | null>(null);
  const [productosFile, setProductosFile] = useState<File | null>(null);
  const [opcionalesFile, setOpcionalesFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    let newProductosFile = productosFile;
    let newOpcionalesFile = opcionalesFile;

    newFiles.forEach(file => {
      const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
      if (!isXlsx) {
          toast({ variant: 'destructive', title: 'Error de archivo', description: `Archivo no válido: ${file.name}. Solo se aceptan archivos .xlsx` });
          return;
      }
      
      if (file.name.toLowerCase().includes('producto')) {
        newProductosFile = file;
      } else if (file.name.toLowerCase().includes('opciona')) {
        newOpcionalesFile = file;
      } else {
        if (!newProductosFile) {
            newProductosFile = file;
        } else if (!newOpcionalesFile) {
            newOpcionalesFile = file;
        }
      }
    });

    setProductosFile(newProductosFile);
    setOpcionalesFile(newOpcionalesFile);
    setResults(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productosFile) {
      toast({ variant: 'destructive', title: 'Error', description: 'El archivo de Productos es obligatorio.' });
      return;
    }
    
    const formData = new FormData();
    formData.append('productos', productosFile);
    if (opcionalesFile) {
      formData.append('opcionales', opcionalesFile);
    }


    startTransition(async () => {
      const response = await processAction(formData);
      setResults(response);
      
      const errors = response.filter(r => r.error && r.fileName !== 'opcionales_procesado.csv'); // Ignore "no data" error for optional file
      const mainError = response.find(r => r.error && r.fileName !== 'opcionales_procesado.csv');

      if (errors.length > 0 && mainError) {
        toast({ variant: 'destructive', title: 'Proceso Fallido', description: mainError.error || 'Ocurrió un error.' });
      } else {
        toast({ title: 'Éxito', description: 'Archivos procesados. Listos para descargar.'});
      }
    });
  };
  
  const handleDownload = (result: ProcessResult) => {
    if (!result?.data || !result?.fileName) return;
    const BOM = '\uFEFF';
    const csvContent = result.data.startsWith(BOM) ? result.data : BOM + result.data;
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = result.fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleClear = () => {
    setProductosFile(null);
    setOpcionalesFile(null);
    setResults(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const removeFile = (type: 'productos' | 'opcionales') => {
    if (type === 'productos') {
      setProductosFile(null);
    } else {
      setOpcionalesFile(null);
    }
  }

  const productosLog = results?.[0]?.productosLog;
  const opcionalesLog = results?.[0]?.opcionalesLog;
  const successfulResults = results?.filter(r => r.data) || [];

  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {(!productosFile && !opcionalesFile) ? (
            <div 
              className="relative"
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag} 
              onDragOver={handleDrag} 
              onDrop={handleDrop}
            >
              <label 
                htmlFor='dropzone-file-unified'
                className={cn(
                  "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors",
                  dragActive ? "border-primary" : "border-border"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Subir Archivos</span></p>
                  <p className="text-xs text-muted-foreground">Arrastra y suelta 'productos' y 'opcionales' (.xlsx)</p>
                </div>
                <Input id='dropzone-file-unified' ref={fileInputRef} type="file" className="hidden" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple onChange={(e) => handleFileChange(e.target.files)} />
              </label>
            </div>
          ) : (
             <div className="space-y-4">
                <p className="text-sm font-medium text-center text-muted-foreground">Archivos seleccionados:</p>
                <div className='grid sm:grid-cols-2 gap-4'>
                    {/* Productos File */}
                    <div className="p-3 border rounded-lg bg-muted/30 h-full flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Package className="w-6 h-6 text-primary flex-shrink-0" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate">{productosFile?.name || 'No seleccionado'}</span>
                            <span className="text-xs text-muted-foreground">Archivo de Productos (Obligatorio)</span>
                          </div>
                        </div>
                        {productosFile && <Button variant="ghost" size="icon" onClick={() => removeFile('productos')} className="text-muted-foreground hover:text-destructive flex-shrink-0"><X className="w-4 h-4" /></Button>}
                      </div>
                    </div>
                    {/* Opcionales File */}
                    <div className="p-3 border rounded-lg bg-muted/30 h-full flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <PackagePlus className="w-6 h-6 text-primary/80 flex-shrink-0" />
                           <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate">{opcionalesFile?.name || 'No seleccionado'}</span>
                            <span className="text-xs text-muted-foreground">Archivo de Opcionales (Opcional)</span>
                          </div>
                        </div>
                        {opcionalesFile && <Button variant="ghost" size="icon" onClick={() => removeFile('opcionales')} className="text-muted-foreground hover:text-destructive flex-shrink-0"><X className="w-4 h-4" /></Button>}
                      </div>
                    </div>
                </div>
             </div>
          )}
          
          {(productosFile || opcionalesFile) && (
            <div className="flex gap-2">
                <Button type="submit" className="w-full" disabled={isPending || !productosFile}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : 'Procesar Archivos'}
                </Button>
                <Button variant="outline" onClick={handleClear} disabled={isPending}>
                  Limpiar
                </Button>
            </div>
          )}

          {isPending && (
            <div className="space-y-2">
                <Progress value={undefined} className="w-full animate-pulse" />
                <p className="text-sm text-center text-muted-foreground">Analizando tus archivos...</p>
            </div>
          )}
          
          {results && (
            <div className="space-y-4">
              {successfulResults.length > 0 && (
                 <div className="p-4 text-center border-2 border-dashed rounded-lg bg-green-500/10 border-green-500/50 space-y-3">
                  <p className="font-medium text-green-700 dark:text-green-300">¡Proceso completado!</p>
                  <div className='flex flex-wrap gap-4 justify-center'>
                    {successfulResults.map(res => (
                       <Button key={res.fileName} onClick={() => handleDownload(res)} variant="secondary">
                           <DownloadCloud className="mr-2 h-4 w-4" />
                           Descargar {res.fileName}
                       </Button>
                    ))}
                  </div>
                </div>
              )}
             
              <div className="grid md:grid-cols-2 gap-4">
                {productosLog && productosLog.length > 0 && (
                  <Alert>
                    <FilePenLine className="h-4 w-4" />
                    <AlertTitle>Modificaciones en Productos ({productosLog.length})</AlertTitle>
                    <ScrollArea className="h-100 mt-2">
                      <AlertDescription>
                        <ul className="space-y-1 text-xs">
                          {productosLog.map((msg, index) => (
                            <li key={index}>{msg}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </ScrollArea>
                  </Alert>
                )}
                {opcionalesLog && opcionalesLog.length > 0 && (
                  <Alert>
                    <FilePenLine className="h-4 w-4" />
                    <AlertTitle>Modificaciones en Opcionales ({opcionalesLog.length})</AlertTitle>
                    <ScrollArea className="h-100 mt-2">
                      <AlertDescription>
                        <ul className="space-y-1 text-xs">
                          {opcionalesLog.map((msg, index) => (
                            <li key={index}>{msg}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </ScrollArea>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
