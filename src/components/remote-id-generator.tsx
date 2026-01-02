"use client";

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Copy, Check, Info, Rocket, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const countries = [
  { value: 'AR', label: 'Argentina' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'PA', label: 'Panamá' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Perú' },
  { value: 'DO', label: 'Rep. Dominicana' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' },
];

type GeneratedIdData = {
  localName: string;
  remoteId: string;
};

export function RemoteIdGenerator() {
  const { toast } = useToast();
  const [country, setCountry] = useState('');
  const [namesInput, setNamesInput] = useState('');
  const [idsInput, setIdsInput] = useState('');
  const [generatedData, setGeneratedData] = useState<GeneratedIdData[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with dashes
  };

  const handleGenerate = () => {
    if (!country) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes seleccionar un país.' });
      return;
    }
    if (!namesInput.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'El campo de nombres de locales no puede estar vacío.' });
      return;
    }

    const localNames = namesInput.split('\n').map(name => name.trim()).filter(name => name.length > 0);
    const optionalIds = idsInput.split('\n').map(id => id.trim()).filter(id => id.length > 0);

    if (optionalIds.length > 0 && optionalIds.length !== localNames.length) {
        toast({ variant: 'destructive', title: 'Error de Coincidencia', description: 'La cantidad de IDs debe coincidir con la cantidad de nombres de locales.' });
        return;
    }

    const remoteIdsData = localNames.map((name, index) => {
      const normalizedName = normalizeText(name);
      const idPart = optionalIds[index] ? `${normalizeText(optionalIds[index])}` : '';
      const remoteId = `${country}-${normalizedName}${idPart ? '-' + idPart : ''}-0001`.toUpperCase();

      return { localName: name, remoteId };
    });
    
    setGeneratedData(remoteIdsData);
    toast({
      title: "Éxito",
      description: `Se generaron ${remoteIdsData.length} Remote IDs.`,
    });
  };

  const handleCopyRow = (row: GeneratedIdData) => {
    const textToCopy = `${row.localName}\t${row.remoteId}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast({ title: 'Copiado', description: 'Fila copiada al portapapeles.' }))
      .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'No se pudo copiar. Usa HTTPS o prueba en otro navegador.' }));
  };

  const handleCopyTable = () => {
    if (generatedData.length === 0) return;
    const header = ["NOMBRE DEL LOCAL", "REMOTE ID DATOS"];
    const tableContent = generatedData.map(row => 
        [row.localName, row.remoteId].join('\t')
    ).join('\n');
    const contentToCopy = [header.join('\t'), tableContent].join('\n');

    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        setIsCopied(true);
        toast({ title: "Copiado", description: "Tabla copiada al portapapeles. Puedes pegarla en una hoja de cálculo." });
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'No se pudo copiar. Usa HTTPS o prueba en otro navegador.' }));
  };

  const handleClear = () => {
    setCountry('');
    setNamesInput('');
    setIdsInput('');
    setGeneratedData([]);
    setIsCopied(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de Remote ID</CardTitle>
        <CardDescription>
          Completa los campos para generar los Remote IDs estandarizados para uno o más locales.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full gap-2">
            <Label htmlFor="country-select">País (dos letras)</Label>
            <Select onValueChange={setCountry} value={country}>
                <SelectTrigger id="country-select">
                    <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                    {countries.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label} ({c.value})</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid w-full gap-2">
                <Label htmlFor="names-textarea">Nombres de Locales (uno por línea)</Label>
                <Textarea
                    id="names-textarea"
                    placeholder="Mi Restaurante Genial&#10;La Pizzería de Juan"
                    value={namesInput}
                    onChange={(e) => setNamesInput(e.target.value)}
                    rows={8}
                />
            </div>
            <div className="grid w-full gap-2">
                <Label htmlFor="ids-textarea">IDs  (este campo es opcional uno por linea)</Label>
                <Textarea
                    id="ids-textarea"
                    placeholder="12345&#10;67890"
                    value={idsInput}
                    onChange={(e) => setIdsInput(e.target.value)}
                    rows={8}
                />
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
           <Button onClick={handleGenerate} className="w-full sm:w-auto">
             <Rocket className="mr-2 h-4 w-4" />
             Generar IDs
           </Button>
           {generatedData.length > 0 && (
            <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar y Empezar de Nuevo
            </Button>
           )}
        </div>
        
        {generatedData.length > 0 && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Se generaron {generatedData.length} Remote IDs</AlertTitle>
              <AlertDescription>
                Revisa la tabla con los resultados. Puedes copiarla para pegarla en una hoja de cálculo.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOMBRE DEL LOCAL</TableHead>
                    <TableHead>REMOTE ID DATOS</TableHead>
                    <TableHead>ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <input
                          type="text"
                          value={row.localName}
                          onChange={(e) => {
                            const newData = [...generatedData];
                            newData[index].localName = e.target.value;
                            setGeneratedData(newData);
                          }}
                          className="w-full border rounded px-1 py-0.5 text-sm"
                        />
                      </TableCell>
                      <TableCell>{row.remoteId}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyRow(row)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>

      {generatedData.length > 0 && (
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button onClick={handleCopyTable} variant="secondary">
                {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {isCopied ? 'Copiado' : 'Copiar Tabla para Hoja de Cálculo'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
