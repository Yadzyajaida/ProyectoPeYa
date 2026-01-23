"use client";

import { useState, useRef, useTransition, type ComponentProps } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

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

export function FileConverter({
  title,
  description,
  fileType,
  processAction,
  acceptedFileTypes,
  fileTypeDescription,
  className,
  ...props
}: FileConverterProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      return Object.values(acceptedFileTypes).flat().includes(ext);
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selecciona al menos un archivo",
      });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("fileType", fileType);

    startTransition(async () => {
      const results = await processAction(formData);

      const success = results.filter((r) => r.data && r.fileName);
      const errors = results.filter((r) => r.error);

      success.forEach((result) => handleDownload(result));

      if (success.length) {
        toast({
          title: "Conversión completada",
          description: `${success.length} archivo(s) descargado(s) automáticamente`,
        });
      }

      if (errors.length) {
        toast({
          variant: "destructive",
          title: "Algunos archivos fallaron",
          description: `${errors.length} archivo(s) no se pudieron convertir`,
        });
      }

      // limpiar
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const handleDownload = (result: ProcessResult) => {
    if (!result.data || !result.fileName) return;
  
    const bytes = Uint8Array.from(atob(result.data), c => c.charCodeAt(0));
  
    const blob = new Blob([bytes], {
      type: result.fileName.endsWith(".csv")
        ? "text/csv;charset=utf-8;"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer">
            <UploadCloud className="w-10 h-10 mb-2" />
            <p className="text-sm">{fileTypeDescription}</p>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept={Object.values(acceptedFileTypes).flat().join(",")}
              onChange={(e) => handleFileChange(e.target.files)}
            />
          </label>

          {selectedFiles.length > 0 && (
            <ScrollArea className="h-40">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span className="truncate text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSelectedFiles((f) => f.filter((_, x) => x !== i))
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Convirtiendo...
              </>
            ) : (
              "Convertir y descargar"
            )}
          </Button>

          {isPending && <Progress className="animate-pulse" />}
        </form>
      </CardContent>
    </Card>
  );
}