'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadCloud, Download, Info, AlertCircle, CheckCircle2, FileDown } from "lucide-react";
import { processFormatFile, generateTemplate } from '@/app/cargar-procesador/actions';

const FORMATS_INFO = {
  productos: [
    'Nombre de la sección(*)', 'SKU Sección', 'SKU Name Sección', 'Nombre del producto (*)', 
    'Precio del producto(*)', 'SKU producto(*)', 'SKU Name del producto', 'Descripción del producto', 'Imagen del producto'
  ],
  opcionales: [
    'SKU producto(*)', 'Nombre del grupo de opcionales(*)', 'SKU del grupo de opcionales', 'SKU Name del grupo de opcionales', 
    'Cantidad Mínima(*)', 'Cantidad Máxima(*)', 'Nombre del opcional(*)', 'Precio del opcional(*)', 'SKU del opcional(*)', 
    'SKU Name del opcional', 'Modifica precio(*)', 'REVISAR LOS COMENTARIOS'
  ],
  precios: [
    'SKU item (producto)(*)', 'Nombre(*)', 'Precio(*)', 'Stock(*) (0 baja  - 1 alta)'
  ],
  precios_opcionales: [
    'SKU producto(*)', 'Nombre del grupo de opcionales(*)', 'Nombre del opcional(*)', 'Precio del opcional(*)', 
    'SKU del opcional(*)', 'Modifica precio(*)'
  ]
};

export function CargarProcesadorUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [formatType, setFormatType] = useState<keyof typeof FORMATS_INFO>('productos');
  const [hasHeaders, setHasHeaders] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showStockWarning, setShowStockWarning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setShowSuccess(false);
      setLogs([]);
      setError(null);
    }
  };

  const handleProcess = async (confirmStockZero = false) => {
    if (!file) {
      setError("Debes seleccionar un archivo.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowSuccess(false);
    if (!confirmStockZero) {
        setLogs([]);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('formatType', formatType);
    formData.append('hasHeaders', hasHeaders ? 'true' : 'false');
    formData.append('confirmStockZero', confirmStockZero ? 'true' : 'false');

    try {
      const result = await processFormatFile(formData);

      if (result.warning === 'stock_0_detected') {
        setShowStockWarning(true);
        setIsLoading(false);
        return;
      } else if (result.error) {
        setError(result.error);
      } else {
        if (result.data && result.fileName) {
          downloadFileBase64(result.data, result.fileName, false);
          setShowSuccess(true);
        }
        if (result.log) {
          setLogs(result.log);
        }
      }
    } catch (e) {
      setError("Ocurrió un error inesperado al procesar.");
    } finally {
      if (error || showSuccess || (confirmStockZero && !error)) {
         // Fallback ensure isLoading is false if we are done
      }
      // Actually we just want to ensure it turns off on success or error.
      // But let's just always turn it off here except if we are returning early.
      setIsLoading(false);
    }
  };

  const downloadFileBase64 = (base64Data: string, fileName: string, isXlsx: boolean = false) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: isXlsx ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = async (isCompleta: boolean) => {
    setIsLoading(true);
    try {
      const result = await generateTemplate(isCompleta ? 'completa' : formatType);
      downloadFileBase64(result.data, result.fileName, true);
    } catch (e) {
      setError("No se pudo generar la plantilla.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(false)} className="gap-1 h-8 text-xs" disabled={isLoading}>
            <FileDown className="w-3 h-3" />
            Descargar Plantilla ({formatType})
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDownloadTemplate(true)} className="gap-1 h-8 text-xs border-primary text-primary hover:bg-primary/10" disabled={isLoading}>
            <FileDown className="w-3 h-3" />
            Descargar Completa
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm">Error</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {showSuccess && (
        <Alert className="bg-green-500/10 text-green-600 border-green-500/20 py-2">
          <CheckCircle2 className="h-4 w-4 stroke-green-600" />
          <AlertTitle className="text-sm">¡Éxito!</AlertTitle>
          <AlertDescription className="text-xs">¡Archivo procesado y descargado con éxito!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Formatos soportados y opciones</CardTitle>
          <CardDescription className="text-xs">Selecciona el tipo de archivo que deseas generar y adjunta tu archivo Excel (.xlsx / .xls).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format-select">Tipo de Formato a Generar</Label>
                <Select value={formatType} onValueChange={(val) => setFormatType(val as keyof typeof FORMATS_INFO)}>
                  <SelectTrigger id="format-select">
                    <SelectValue placeholder="Selecciona el formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="productos">Productos</SelectItem>
                    <SelectItem value="opcionales">Opcionales</SelectItem>
                    <SelectItem value="precios">Precios</SelectItem>
                    <SelectItem value="precios_opcionales">Precios Opcionales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 border p-4 rounded-md bg-muted/50">
                <Checkbox 
                  id="has-headers" 
                  checked={hasHeaders} 
                  onCheckedChange={(checked) => setHasHeaders(checked as boolean)} 
                />
                <Label htmlFor="has-headers" className="text-sm cursor-pointer">
                  Mi archivo contiene una fila de encabezados<br/>
                  <span className="text-xs text-muted-foreground font-normal">
                    (Se ignorará la primera fila. Si está desmarcado, se asumirá que la fila 1 contiene datos).
                  </span>
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Subir Archivo Excel</Label>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Haz clic para seleccionar el archivo</p>
                  <p className="text-xs text-muted-foreground mt-1">.xlsx, .xls</p>
                  {file && (
                    <div className="mt-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium break-all">
                      {file.name}
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => handleProcess(false)} 
                disabled={!file || isLoading}
              >
                {isLoading ? 'Procesando...' : 'Procesar y Convertir'}
              </Button>
            </div>

            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Columnas Esperadas (en orden)</AlertTitle>
                <AlertDescription className="mt-2 text-xs text-muted-foreground">
                  <p className="mb-2">El sistema espera que los datos en tu archivo sigan este orden de columnas (tengan o no el mismo nombre en el encabezado):</p>
                  <ol className="list-decimal pl-4 space-y-1 text-foreground/80">
                    {FORMATS_INFO[formatType].map((col, i) => (
                      <li key={i}>{col}</li>
                    ))}
                  </ol>
                </AlertDescription>
              </Alert>

              {logs.length > 0 && (
                <div className="space-y-2 pt-4">
                  <Label className="text-sm font-semibold">Registro de Correcciones Automáticas:</Label>
                  <div className="bg-black/90 text-green-400 p-4 rounded-md h-48 overflow-y-auto text-xs font-mono">
                    {logs.map((log, idx) => (
                      <div key={idx} className="mb-1 leading-tight">{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showStockWarning} onOpenChange={setShowStockWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Stock 0</AlertDialogTitle>
            <AlertDialogDescription>
              Se ha detectado stock igual a 0 en tu archivo de precios. ¿Estás seguro de querer procesarlo de esta manera?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowStockWarning(false);
              handleProcess(true);
            }}>
              Aceptar y Procesar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
