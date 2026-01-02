"use client";

import { useState, useRef, useTransition, type ComponentProps } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, X, DownloadCloud, Loader2, Download, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type ProcessResult = {
  data?: string;
  fileName?: string;
  error?: string;
};

interface FileConverterProps extends ComponentProps<typeof Card> {
  title: string;
  description: string;
  fileType: string;
  processAction: (formData: FormData) => Promise<ProcessResult[]>;
  acceptedFileTypes: { [key: string]: string[] };
  fileTypeDescription: string;
}

export function FileConverter({ title, description, fileType, processAction, acceptedFileTypes, fileTypeDescription, className, ...props }: FileConverterProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<ProcessResult[] | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
  
    const newFiles = Array.from(files);
  
    const validFiles = newFiles.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileMimeType = file.type;

      const isValidType = Object.entries(acceptedFileTypes).some(([mime, exts]) => {
        return exts.includes(fileExtension) || mime === fileMimeType;
      });
  
      if (!isValidType) {
        toast({
          variant: 'destructive',
          title: 'Error de archivo',
          description: `Archivo no válido: ${file.name}. Se esperaba ${fileTypeDescription}`,
        });
      }
  
      return isValidType;
    });
  
    setSelectedFiles(prev => [...prev, ...validFiles]);
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
    if (selectedFiles.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Por favor, selecciona al menos un archivo.' });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('fileType', fileType);

    startTransition(async () => {
      const response = await processAction(formData);
      setResults(response);
      const successCount = response.filter(r => r.data).length;
      const errorCount = response.filter(r => r.error).length;

      if (successCount > 0) {
        toast({ title: 'Éxito', description: `${successCount} archivo(s) convertido(s). Listo(s) para descargar.` });
      }
      if (errorCount > 0) {
        toast({ variant: 'destructive', title: 'Conversión Fallida', description: `${errorCount} archivo(s) no se pudieron convertir.` });
      }
    });
  };

  const handleDownload = (result: ProcessResult) => {
    if (!result?.data || !result?.fileName) return;

    let blob;
    if (result.fileName.endsWith('.csv')) {
      const BOM = '\uFEFF';
      const csvContent = result.data.startsWith(BOM) ? result.data : BOM + result.data;
      blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
    } else if (result.fileName.endsWith('.xlsx')) {
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    } else {
        return; 
    }
    
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
    setSelectedFiles([]);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  }

  const acceptString = Object.values(acceptedFileTypes).flat().join(',');

  const successfulResults = results?.filter(r => r.data && r.fileName) || [];
  const errorResults = results?.filter(r => r.error) || [];

  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedFiles.length === 0 && (
            <div
              className="relative"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label
                htmlFor={`dropzone-file-${fileType}`}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors",
                  dragActive ? "border-primary" : "border-border"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta</p>
                  <p className="text-xs text-muted-foreground">{fileTypeDescription}</p>
                </div>
                <Input id={`dropzone-file-${fileType}`} ref={fileInputRef} type="file" className="hidden" accept={acceptString} multiple onChange={(e) => handleFileChange(e.target.files)} />
              </label>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <ScrollArea className="h-48 w-full pr-4">
                <div className='space-y-2'>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className='flex items-center gap-2'>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Convirtiendo...
                    </>
                  ) : `Convertir ${selectedFiles.length} Archivo(s)`}
                </Button>
                <Button variant="outline" onClick={handleClear}>Limpiar</Button>
              </div>
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
                <Alert variant="default" className="border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300">
                  <Download className="h-4 w-4 text-green-700 dark:text-green-300" />
                  <AlertTitle>Conversión Completada</AlertTitle>
                  <ScrollArea className="h-40 mt-2">
                    <AlertDescription className="space-y-2">
                      {successfulResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="truncate">{result.fileName}</span>
                          <Button onClick={() => handleDownload(result)} variant="ghost" size="sm" className="h-7">
                            <DownloadCloud className="mr-2 h-4 w-4" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </AlertDescription>
                  </ScrollArea>
                </Alert>
              )}
              {errorResults.length > 0 && (<Alert variant="destructive"> <Info className="h-4 w-4" /> <AlertTitle>Archivos con Errores</AlertTitle> <ScrollArea className="h-24 mt-2"> <AlertDescription> <ul className="space-y-1 text-xs"> {errorResults.map((result, index) => (<li key={index}><b>{result.fileName}:</b> {result.error}</li>))} </ul> </AlertDescription> </ScrollArea> </Alert>)} </div>)} </form> </CardContent> </Card>);
}