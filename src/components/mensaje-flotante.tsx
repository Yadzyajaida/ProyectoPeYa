"use client";
import { useState } from "react";
import { Info, X } from "lucide-react";

export default function MensajeFlotante() {
  const [show, setShow] = useState(false);

  return (
    <>
      <a
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-1 text-blue-500 dark:text-blue-400 hover:underline cursor-pointer font-medium align-middle"
      >
        <Info className="w-5 h-5" />
        Importante
      </a>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setShow(false)}
          ></div>

          <div className="relative bg-card rounded-lg shadow-lg max-w-4xl w-full p-6 m-4 border">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary mt-1 shrink-0" />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">Puntos clave del procesador</h2>
                <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-2">
                    <li>Los archivos a subir deben estar en formato <strong>XLSX</strong> y tener las <strong>mismas columnas</strong> que los templates de "Solicitud de Archivos CSV".</li>
                    <li>No necesitas corregir SKUs vacíos, duplicados, ni eliminar columnas. El sistema se encarga de todo automáticamente.</li>
                    <li>Si el archivo de opcionales está vacío, la herramienta lo ignorará y solo procesará el de productos.</li>
                    <li>Al finalizar, se descargará el/los archivo(s) <strong>.CSV</strong> y se mostrará un log con todas las modificaciones de SKUs.</li>
                    <li>Sube los archivos generados directamente a un local eliminado. Si hubo correcciones de SKU, sube ambos archivos (productos y opcionales) antes de hacer cualquier otra modificación manual.</li>
                    <li>Guíate por el log de modificaciones para realizar correcciones manuales en los SKUs después de haber subido los archivos.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
