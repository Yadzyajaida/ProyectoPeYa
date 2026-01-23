"use client";

import { useState, useEffect, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ExternalLink,
  Copy,
  Loader2,
  Rocket,
  Trash2,
  Timer,
  Info,
} from "lucide-react";

const RATE_LIMIT = 50;
const COOLDOWN_MS = 6 * 60 * 1000;
const OPEN_DELAY_MS = 1200;

const COOLDOWN_KEY = "linkGeneratorCooldownEndTime";
const LAST_ID_KEY = "linkGeneratorLastProcessedId";
const OPENED_COUNT_KEY = "linkGeneratorOpenedCount";
const OPENED_LINKS_KEY = "linkGeneratorOpenedLinks";

const getRemainingCooldown = () => {
  if (typeof window === 'undefined') return 0;
  const end = localStorage.getItem(COOLDOWN_KEY);
  if (!end) return 0;
  const diff = Number(end) - Date.now();
  return diff > 0 ? Math.ceil(diff / 1000) : 0;
};

export function LinkGenerator() {
  const { toast } = useToast();
  const [idsInput, setIdsInput] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<string[]>([]);
  const [cooldown, setCooldown] = useState(0);
  const [lastId, setLastId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [openedLinks, setOpenedLinks] = useState<Set<number>>(new Set());
  const [openedCount, setOpenedCount] = useState(0);

  useEffect(() => {
    setCooldown(getRemainingCooldown());
  
    const storedLastId = localStorage.getItem(LAST_ID_KEY);
    if (storedLastId) setLastId(storedLastId);
  
    const storedOpenedCount = localStorage.getItem(OPENED_COUNT_KEY);
    if (storedOpenedCount) setOpenedCount(Number(storedOpenedCount));
  
    const storedOpenedLinks = localStorage.getItem(OPENED_LINKS_KEY);
    if (storedOpenedLinks) {
      setOpenedLinks(new Set<number>(JSON.parse(storedOpenedLinks)));
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        const remaining = getRemainingCooldown();
        setCooldown(remaining);
        if (remaining <= 0) {
          localStorage.removeItem(COOLDOWN_KEY);
          localStorage.removeItem(OPENED_COUNT_KEY);
          localStorage.removeItem(OPENED_LINKS_KEY);
          localStorage.removeItem(LAST_ID_KEY);
          handleClear();
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (openedCount >= RATE_LIMIT && cooldown <= 0) {
      const endTime = Date.now() + COOLDOWN_MS;
      localStorage.setItem(COOLDOWN_KEY, String(endTime));
      setCooldown(getRemainingCooldown());
      toast({
        title: "Límite alcanzado",
        description: `Has abierto ${RATE_LIMIT} enlaces. La herramienta entrará en enfriamiento.`,
        variant: "destructive",
      });
    }
  }, [openedCount, cooldown, toast]);

  const handleGenerate = (linkType: 'BO' | 'VBO') => {
    if (cooldown > 0) {
      toast({
        variant: "destructive",
        title: "Enfriamiento activo",
        description: "Debes esperar a que termine el temporizador.",
      });
      return;
    }

    const ids = idsInput
      .split(/[\s,]+/)
      .map((i) => i.trim())
      .filter((i) => i && !isNaN(Number(i)));

    if (ids.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "IDs inválidos." });
      return;
    }

    const batch = ids.slice(0, RATE_LIMIT);
    const lastProcessedId = batch[batch.length - 1];

    if(ids.length > RATE_LIMIT) {
        toast({
            title: `Límite de ${RATE_LIMIT} alcanzado`,
            description: `Se procesaron los primeros ${RATE_LIMIT} IDs. Último ID del lote: ${lastProcessedId}`
        });
    }
    
    setGeneratedLinks(
      batch.map(
        (id) => {
          if (linkType === 'BO') {
            return `https://backoffice-app.pedidosya.com/#/partners/${id}/catalogue`;
          }
          // VBO
          return `https://vbo.us.logisticsbackoffice.com/vendor-management/vendors/PY_AR/vendor/${id}/default-attributes`;
        }
      )
    );
    setIdsInput(batch.join('\n'));
    setLastId(lastProcessedId);
    setOpenedCount(0);
    setOpenedLinks(new Set());
    localStorage.setItem(LAST_ID_KEY, lastProcessedId);
    localStorage.setItem(OPENED_COUNT_KEY, '0');
    localStorage.setItem(OPENED_LINKS_KEY, '[]');
  };

  const openLink = (link: string, index: number) => {
    if (openedLinks.has(index) || cooldown > 0) return;
  
    window.open(link, "_blank");
  
    setOpenedLinks(prev => {
      const next = new Set(prev);
      next.add(index);
      localStorage.setItem(OPENED_LINKS_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  
    setOpenedCount(prev => {
      const next = prev + 1;
      localStorage.setItem(OPENED_COUNT_KEY, String(next));
      return next;
    });
  };
  
  const handleOpenAll = () => {
    startTransition(() => {
        generatedLinks.forEach((link, index) => {
            setTimeout(() => {
                openLink(link, index);
            }, index * OPEN_DELAY_MS);
        });
    });
  };

  const handleClear = () => {
    setIdsInput('');
    setGeneratedLinks([]);
    setLastId(null);
    setOpenedCount(0);
    setOpenedLinks(new Set());
  
    localStorage.removeItem(LAST_ID_KEY);
    localStorage.removeItem(OPENED_COUNT_KEY);
    localStorage.removeItem(OPENED_LINKS_KEY);
  
    toast({
      title: 'Limpiado',
      description: 'Se ha limpiado la entrada y los enlaces generados.',
    });
  };

  const minutes = Math.floor(cooldown / 60);
  const seconds = cooldown % 60;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de Enlaces</CardTitle>
        <CardDescription>
          Pega una lista de IDs para generar enlaces masivamente. Máximo {RATE_LIMIT} enlaces cada 6 minutos.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Lista de IDs (uno por línea o separados por coma)</Label>
              <Textarea
                rows={10}
                placeholder={`Ej:
      12345
      67890
      62651
      o 12345,67890,62651`}
                value={idsInput}
                onChange={(e) => setIdsInput(e.target.value)}
                disabled={cooldown > 0}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleGenerate('BO')}
                disabled={cooldown > 0 || !idsInput.trim()}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Enlaces BO
              </Button>

              <Button
                onClick={() => handleGenerate('VBO')}
                disabled={cooldown > 0 || !idsInput.trim()}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Enlaces VBO
              </Button>

              {generatedLinks.length > 0 && (
                <Button onClick={handleOpenAll} disabled={isPending || cooldown > 0 || openedCount >= RATE_LIMIT}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  {isPending ? "Abriendo..." : "Abrir todos"}
                </Button>
              )}

              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar
              </Button>
            </div>

            {cooldown > 0 && (
              <Alert variant="destructive">
                <Timer className="h-4 w-4" />
                <AlertTitle>Enfriamiento activo</AlertTitle>
                <AlertDescription>
                  Tiempo restante: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </AlertDescription>
              </Alert>
            )}

            {lastId && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Último ID procesado en el lote anterior</AlertTitle>
                <AlertDescription>{lastId}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            {generatedLinks.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium">
                    {generatedLinks.length} enlaces listos ({openedCount} abiertos)
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLinks.join("\n"));
                      toast({
                        title: "Copiado",
                        description: "Se copiaron todos los enlaces.",
                      });
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                </div>
                <ScrollArea className="h-[400px] border rounded-md p-4">
                  <div className="space-y-2">
                    {generatedLinks.map((link, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded-md"
                      >
                        <span
                          className={`truncate transition-colors cursor-pointer hover:underline ${
                            openedLinks.has(i) ? "text-muted-foreground line-through" : ""
                          }`}
                          onClick={() => openLink(link, i)}
                        >
                          {link}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground border rounded-md">
                Los enlaces generados aparecerán aquí
              </div>
            )}
          </div>

        </div>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        {isPending ? 'Abriendo enlaces en segundo plano...' : 'La herramienta está lista.'}
      </CardFooter>
    </Card>
  );
}
