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
  id?: string;
};

export function RemoteIdGenerator() {
  const { toast } = useToast();
  const [country, setCountry] = useState('');
  const [inputData, setInputData] = useState('');
  const [generatedData, setGeneratedData] = useState<GeneratedIdData[]>([]);
  const [isTableCopied, setIsTableCopied] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-zA-Z0-9 ]/g, '') 
      .trim()
      .replace(/\s+/g, '-'); 
  };

  const handleGenerate = () => {
    if (!country) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debes seleccionar un país.' });
      return;
    }
    if (!inputData.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'El campo de entrada no puede estar vacío.' });
      return;
    }

    const lines = inputData.trim().split('\n');

    const remoteIdsData = lines.map(line => {
        line = line.trim();
        if (!line) return null;

        let localName = line;
        let id;
        const parts = line.split(/\s+/);

        if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
            id = parts.pop();
            localName = parts.join(' ');
        } else if (parts.length > 1 && /^\d+$/.test(parts[0])) {
            id = parts.shift();
            localName = parts.join(' ');
        }

        if (!localName) return null;

        const normalizedName = normalizeText(localName);
        const remoteId = `${country}-${normalizedName}-0001`.toUpperCase();

        return { localName, remoteId, id };
    }).filter(Boolean) as GeneratedIdData[];
    
    setGeneratedData(remoteIdsData);
    toast({
      title: "Éxito",
      description: `Se generaron ${remoteIdsData.length} Remote IDs.`
    });
  };

  const handleCopyRow = (row: GeneratedIdData) => {
    let entry = `Nombre del local: ${row.localName}`;
    if (row.id) {
      entry += `\nId: ${row.id}`;
    }
    entry += `\nRemote Id: ${row.remoteId}`;

    navigator.clipboard.writeText(entry)
      .then(() => toast({ title: 'Copiado', description: 'Datos del local copiados.' }))
      .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'No se pudo copiar.' }));
  };

  const handleCopyAsText = () => {
    if (generatedData.length === 0) return;

    const textToCopy = generatedData.map(row => {
      let entry = `Nombre del local: ${row.localName}`;
      if (row.id) {
        entry += `\nId: ${row.id}`;
      }
      entry += `\nRemote Id: ${row.remoteId}`;
      return entry;
    }).join('\n\n');

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsTextCopied(true);
        toast({ title: "Copiado", description: "Datos copiados como texto." });
        setTimeout(() => setIsTextCopied(false), 3000);
      })
      .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'No se pudo copiar.' }));
  };
  
  const handleCopyTable = () => {
    if (generatedData.length === 0) return;
    const hasIds = generatedData.some(row => row.id);
    const header = ["NOMBRE DEL LOCAL"];
    if (hasIds) header.push("ID");
    header.push("REMOTE ID");

    const tableContent = generatedData.map(row => 
        [row.localName, hasIds ? row.id || '' : null, row.remoteId].filter(item => item !== null).join('\t')
    ).join('\n');
    const contentToCopy = [header.join('\t'), tableContent].join('\n');

    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        setIsTableCopied(true);
        toast({ title: "Copiado", description: "Tabla copiada para hoja de cálculo." });
        setTimeout(() => setIsTableCopied(false), 3000);
      })
      .catch(() => toast({ variant: 'destructive', title: 'Error', description: 'No se pudo copiar.' }));
  };

  const handleClear = () => {
    setCountry('');
    setInputData('');
    setGeneratedData([]);
    setIsTableCopied(false);
    setIsTextCopied(false);
  };
  
  const hasIds = generatedData.some(row => row.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de Remote ID</CardTitle>
        <CardDescription>
          Pega tu lista de locales (un local por línea). El sistema detectará automáticamente los IDs.
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

        <div className="grid w-full gap-2">
            <Label htmlFor="data-textarea">Nombres de Locales y IDs (uno por línea)</Label>
            <Textarea
                id="data-textarea"
                placeholder={'Mi Restaurante Genial\nLa Pizzería de Juan 67890\n12345 El Otro Local'}
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                rows={8}
            />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
           <Button onClick={handleGenerate} className="w-full sm:w-auto">
             <Rocket className="mr-2 h-4 w-4" />
             Generar IDs
           </Button>
           {generatedData.length > 0 && (
            <Button onClick={handleClear} variant="outline" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar y empezar de nuevo
            </Button>
           )}
        </div>
        
        {generatedData.length > 0 && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Se generaron {generatedData.length} Remote IDs</AlertTitle>
              <AlertDescription>
                Revisa la tabla con los resultados. Puedes copiar los datos en el formato que prefieras.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOMBRE DEL LOCAL</TableHead>
                    {hasIds && <TableHead>ID</TableHead>}
                    <TableHead>REMOTE ID</TableHead>
                    <TableHead className="text-right">Copiar Fila</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {row.localName}
                      </TableCell>
                       {hasIds && <TableCell>{row.id}</TableCell>}
                      <TableCell>{row.remoteId}</TableCell>
                      <TableCell className="text-right">
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
            <Button onClick={handleCopyAsText} variant="secondary">
                {isTextCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {isTextCopied ? 'Copiado' : 'Copiar como Texto'}
            </Button>
            <Button onClick={handleCopyTable} variant="secondary">
                {isTableCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {isTableCopied ? 'Copiado' : 'Copiar para Hoja de Cálculo'}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
