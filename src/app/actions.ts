'use server';

import * as xlsx from 'xlsx';

type ProcessResult = {
  data?: string;
  fileName?: string;
  error?: string;
  productosLog?: string[];
  opcionalesLog?: string[];
};

type MultiProcessResult = ProcessResult[];

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';

  const str = String(value);

  if (/[;"\n,]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function arrayToCSV(data: any[][], delimiter = ','): string {
  return data
    .map(row => row.map(cell => escapeCSV(cell)).join(delimiter))
    .join('\n');
}

function getNextPrefix(count: number): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (count < alphabet.length) {
        return alphabet[count];
    }
    return String(count - alphabet.length + 1);
}

function trimTrailingEmptyRows(data: any[][]): any[][] {
  let lastIndex = data.length - 1;

  while (lastIndex >= 0) {
    const row = data[lastIndex];
    const hasRealData = row?.some(
      cell => cell !== null && cell !== undefined && String(cell).trim() !== ''
    );
    if (hasRealData) break;
    lastIndex--;
  }

  return data.slice(0, lastIndex + 1);
}

function processProductos(data: any[][]): { processedData: any[][]; log: string[], idToSkuMap: {[key: string]: string} } {
    if (data.length < 2) return { processedData: [], log: [], idToSkuMap: {} };

    const cleaned = trimTrailingEmptyRows(data);
    const header = cleaned[0].map(h => String(h || '').trim());
    const content = cleaned.slice(1);

    const log: string[] = [];
    const idToSkuMap: {[key: string]: string} = {};

    const originalRequiredHeaders = [
        'ID', 'Sección', 'SKU Sección', 'SKU Name Sección', 'Nombre', 
        'Precio', 'SKU', 'SKU Name', 'Descripción', 'Imagen'
    ];
    
    const headerIndices = originalRequiredHeaders.map(reqHeader => header.indexOf(reqHeader));

    if (headerIndices.some(index => index === -1)) {
        const missingHeaders = originalRequiredHeaders.filter((_, i) => headerIndices[i] === -1);
        log.push(`Error: Faltan las siguientes columnas requeridas: ${missingHeaders.join(', ')}`);
        return { processedData: [], log, idToSkuMap: {} };
    }
    
    const orderedContent = content
        .filter(row => row && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== ''))
        .map(row => {
            const newRow = headerIndices.map(index => (index !== -1 && index < row.length) ? row[index] : '');
            return newRow;
        });

    const idIndex = originalRequiredHeaders.indexOf('ID');
    const precioIndex = originalRequiredHeaders.indexOf('Precio');
    const skuIndex = originalRequiredHeaders.indexOf('SKU');
    const nombreProductoIndex = originalRequiredHeaders.indexOf('Nombre');

    orderedContent.forEach(row => {
        const price = parseFloat(row[precioIndex]);
        row[precioIndex] = isNaN(price) || price < 0 ? 0 : price;
    });

    const skuCounts: { [key: string]: number } = {};
    let emptySkuCount = 0;

    orderedContent.forEach((row, index) => {
        const rawSku = row[skuIndex];
        const productId = String(row[idIndex]).trim();
        const excelRow = index + 2; 
        const nombreProducto =  row[nombreProductoIndex]; 

        if (!productId) {
            log.push(`Fila ${excelRow}: Se omitió la fila por no tener ID de producto.`);
            return;
        }

        if (rawSku === null || rawSku === undefined || String(rawSku).trim() === '') {
            const prefix = getNextPrefix(emptySkuCount);
            const newSku = prefix;
            row[skuIndex] = newSku;
            log.push(`- Fila ${excelRow} / Nombre "${nombreProducto}": SKU vacío rellenado con '${newSku}'.`);
            idToSkuMap[productId] = newSku;
            emptySkuCount++;
            return;
        }

        const originalSku = String(rawSku).trim();
        if (skuCounts[originalSku]) {
            const count = skuCounts[originalSku];
            const prefix = getNextPrefix(count-1);
            const newSku = `${prefix}${originalSku}`;
            log.push(`- Fila ${excelRow} / Nombre "${nombreProducto}": SKU duplicado '${originalSku}' renombrado a '${newSku}'.`);
            row[skuIndex] = newSku;
            idToSkuMap[productId] = newSku;
            skuCounts[originalSku]++;
        } else {
            skuCounts[originalSku] = 1;
            idToSkuMap[productId] = originalSku; 
        }
    });

    const finalData = orderedContent.map(row => {
        const newRow = [...row];
        newRow.splice(idIndex, 1); 
        return newRow;
    });
    
    return { processedData: finalData, log, idToSkuMap };
}


function processOpcionales(data: any[][], idToSkuMap: {[key: string]: string}): { processedData: any[][], log: string[] } {
    if (data.length < 2) return { processedData: [], log: [] };

    const cleaned = trimTrailingEmptyRows(data);
    const header = cleaned[0].map(h => String(h || '').trim());
    const content = cleaned.slice(1);
    
    const log: string[] = [];
    const loggedProductIds = new Set<string>();
    
    const idProductoIndex = header.indexOf('ID Producto');
    const skuProductoIndex = header.indexOf('SKU Producto');
 
    if (Object.keys(idToSkuMap).length > 0 && idProductoIndex !== -1 && skuProductoIndex !== -1) {
      content.forEach((row) => {
          const skuProducto = String(row[skuProductoIndex]).trim();
          if (idToSkuMap[skuProducto] && !loggedProductIds.has(skuProducto)) {
              const oldSku = row[skuProductoIndex];
              const newSku = idToSkuMap[skuProducto];
              
              if (String(oldSku).trim() !== newSku) {
                  log.push(`- Nombre de producto ${skuProducto}: SKU actualizado a '${newSku}'.`);
                  loggedProductIds.add(skuProducto);
              }
          }
      });
      
      content.forEach((row) => {
          const productId = String(row[idProductoIndex]).trim();
          if (idToSkuMap[productId]) {
              row[skuProductoIndex] = idToSkuMap[productId];
          }
      });
    }

    const filteredContent = content
        .map((row, index) => row ? [...row, index + 2] : null)
        .filter(row => row && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== ''));

    const originalRowIndex = header.length;
    
    const cantidadGrupoIndex = header.indexOf('Cantidad Grupo de opciones');
    const nombreGrupoIndex = header.indexOf('Grupo de opciones');
    const cantidadMinIndex = header.indexOf('Cantidad mínima Grupo de opciones');
    const cantidadMaxIndex = header.indexOf('Cantidad máxima Grupo de opciones');
        
    filteredContent.forEach(row => {
        if (!row) return;
        if (cantidadMinIndex === -1 || cantidadMaxIndex === -1) return;

        const cantidadGrupo = row[cantidadGrupoIndex];
        const cantidadMax = row[cantidadMaxIndex];
        const cantidadMin = row[cantidadMinIndex];

        const hasValue = (val: any) => val !== null && val !== undefined && String(val).trim() !== '';

        if (hasValue(cantidadGrupo) && !hasValue(cantidadMin) && !hasValue(cantidadMax)) {
            row[cantidadMinIndex] = cantidadGrupo;
            row[cantidadMaxIndex] = cantidadGrupo;
        }
        else if (!hasValue(cantidadGrupo) && hasValue(cantidadMax)) {
             if (!hasValue(cantidadMin)) {
                row[cantidadMinIndex] = 0;
             }
        }
        else if (hasValue(cantidadGrupo) && hasValue(cantidadMax)) {
            if (!hasValue(cantidadMin)) {
                row[cantidadMinIndex] = 0;
            }
        }
    });

    const skuOpcionalIndex = header.indexOf('SKU');
    if (skuOpcionalIndex !== -1 && idProductoIndex !== -1 && skuProductoIndex !== -1) {

        const groupedByProductAndName: { [key: string]: any[][] } = {};
        filteredContent.forEach(row => {
            if (!row) return;
            const productId = String(row[idProductoIndex]).trim();
            const productName = String(row[skuProductoIndex]).trim(); // Usamos SKU Producto como Nombre Producto
            const compositeKey = `${productId}-${productName}`;

            if (!groupedByProductAndName[compositeKey]) {
                groupedByProductAndName[compositeKey] = [];
            }
            groupedByProductAndName[compositeKey].push(row);
        });

        for (const compositeKey in groupedByProductAndName) {
            const productRows = groupedByProductAndName[compositeKey];

            const groupedByOptionGroup: { [key: string]: any[][] } = {};
            productRows.forEach(row => {
                const nombreGrupo = String(row[nombreGrupoIndex]).trim();
                if (!groupedByOptionGroup[nombreGrupo]) {
                    groupedByOptionGroup[nombreGrupo] = [];
                }
                groupedByOptionGroup[nombreGrupo].push(row);
            });

            for (const groupName in groupedByOptionGroup) {
                const groupRows = groupedByOptionGroup[groupName];
                const skuCounts: { [key: string]: number } = {};
                let emptySkuCount = 0;

                groupRows.forEach(row => {
                    const rawSku = row[skuOpcionalIndex];
                    const excelRow = row[originalRowIndex];

                    if (rawSku === null || rawSku === undefined || String(rawSku).trim() === '') {
                        const prefix = getNextPrefix(emptySkuCount);
                        const newSku = prefix;
                        row[skuOpcionalIndex] = newSku;
                        log.push(`- Fila ${excelRow}: SKU de opción vacío rellenado con '${newSku}'.`);
                        emptySkuCount++;
                    } else {
                        const originalSku = String(rawSku).trim();
                        if (skuCounts[originalSku]) {
                            const count = skuCounts[originalSku];
                            const prefix = getNextPrefix(count - 1);
                            const newSku = `${prefix}${originalSku}`;
                            log.push(`- Fila ${excelRow}: SKU de opción duplicado '${originalSku}' dentro del producto '${compositeKey}' y grupo '${groupName}' renombrado a '${newSku}'.`);
                            row[skuOpcionalIndex] = newSku;
                            skuCounts[originalSku]++;
                        } else {
                            skuCounts[originalSku] = 1;
                        }
                    }
                });
            }
        }
    }

    const requiredHeaders = [
        'SKU Producto', 'Grupo de opciones', 'SKU Grupo de opciones', 
        'SKU Nombre Grupo de opciones', 'Cantidad mínima Grupo de opciones', 'Cantidad máxima Grupo de opciones', 
        'Nombre Opción', 'Precio', 'SKU', 'SKU Nombre', 'Modifica precio'
    ];
    
    const headerIndices = requiredHeaders.map(reqHeader => header.indexOf(reqHeader));

    const processed = filteredContent.map(row => {
        if (!row) return null;
        
        return headerIndices.map(index => (index !== -1 ? row[index] : ''));

    }).filter(row => row !== null) as any[][];

    processed.forEach(row => {
        const parseNumeric = (val: any) => {
            const num = parseFloat(val);
            return isNaN(num) || num < 0 ? 0 : num;
        };
        row[4] = parseNumeric(row[4]);
        row[5] = parseNumeric(row[5]);
        row[7] = parseNumeric(row[7]);
    });

    return { processedData: processed, log };
}


export async function processFiles(formData: FormData): Promise<MultiProcessResult> {
  const productosFile = formData.get('productos') as File | null;
  const opcionalesFile = formData.get('opcionales') as File | null;

  if (!productosFile && !opcionalesFile) {
    return [{ error: 'Debes subir al menos un archivo.' }];
  }

  let results: MultiProcessResult = [];
  let productosLog: string[] = [];
  let opcionalesLog: string[] = [];
  let idToSkuMap: { [key: string]: string } = {};

  try {
    if (productosFile) {
      const productosBuffer = await productosFile.arrayBuffer();
      const productosWorkbook = xlsx.read(productosBuffer, { type: 'buffer' });
      const productosSheetName = productosWorkbook.SheetNames[0];
      
      if (!productosSheetName) {
        productosLog.push('El archivo de productos no contiene hojas.');
      } else {
        const productosWorksheet = productosWorkbook.Sheets[productosSheetName];
        const productosData: any[][] = xlsx.utils.sheet_to_json(productosWorksheet, { header: 1, defval: '' });

        if (productosData.length <= 1) {
          productosLog.push('El archivo de productos está vacío o solo contiene encabezados.');
        } else {
          const { processedData: processedProductos, log, idToSkuMap: newIdToSkuMap } = processProductos(productosData);
          productosLog.push(...log);
          idToSkuMap = newIdToSkuMap;

          if (processedProductos.length > 0) {
            const csvString = arrayToCSV(processedProductos, ';');
            results.push({
              data: csvString,
              fileName: 'productos_procesado.csv',
            });
          } else {
            productosLog.push('No se procesaron datos de productos. Verifica los encabezados o el contenido del archivo.');
          }
        }
      }
    }

    if (opcionalesFile) {
      const opcionalesBuffer = await opcionalesFile.arrayBuffer();
      const opcionalesWorkbook = xlsx.read(opcionalesBuffer, { type: 'buffer' });
      const opcionalesSheetName = opcionalesWorkbook.SheetNames[0];

      if (!opcionalesSheetName) {
        opcionalesLog.push('El archivo de opcionales no contiene hojas.');
      } else {
        const opcionalesWorksheet = opcionalesWorkbook.Sheets[opcionalesSheetName];
        const opcionalesData: any[][] = xlsx.utils.sheet_to_json(opcionalesWorksheet, { header: 1, defval: '' });

        if (opcionalesData.length > 1) {
          const { processedData: processedOpcionales, log: opcionalesProcessingLog } = processOpcionales(opcionalesData, idToSkuMap);
          opcionalesLog.push(...opcionalesProcessingLog);

          if (processedOpcionales.length > 0) {
            const csvString = arrayToCSV(processedOpcionales, ';');
            results.push({
              data: csvString,
              fileName: 'opcionales_procesado.csv',
            });
          } else {
            opcionalesLog.push('No se procesaron datos de opcionales.');
          }
        } else {
          opcionalesLog.push('Archivo Opcionales está vacío o solo contiene encabezados, no se generó archivo.');
        }
      }
    }

    if (results.length > 0) {
      results[0].productosLog = productosLog;
      results[0].opcionalesLog = opcionalesLog;
    } else if (productosLog.length > 0 || opcionalesLog.length > 0) {
      return [{ productosLog, opcionalesLog, error: "No se generaron archivos descargables. Revisa los logs para más detalles." }];
    }

    return results;

  } catch (e) {
    console.error('File processing error:', e);
    return [{ error: 'Ocurrió un error al procesar los archivos. Verifica que el formato sea correcto.' }];
  }
}

export async function convertFiles(
  formData: FormData
): Promise<ProcessResult[]> {
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return [{ error: "No se enviaron archivos" }];
  }

  return Promise.all(
    files.map(async (file) => {
      try {
        if (!/\.(xls|xlsx)$/i.test(file.name)) {
          return { error: "Archivo inválido", fileName: file.name };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = xlsx.read(buffer, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          return { error: "No contiene hojas", fileName: file.name };
        }

        const worksheet = workbook.Sheets[sheetName];

        const csv = xlsx.utils.sheet_to_csv(worksheet, {
          FS: ";",
          RS: "\n",
          blankrows: false,
        });

        const utf8Buffer = Buffer.from("\uFEFF" + csv, "utf8");

        return {
          data: utf8Buffer.toString("base64"),
          fileName: file.name.replace(/\.(xls|xlsx)$/i, ".csv"),
        };
      } catch (err) {
        console.error(err);
        return { error: "Error al convertir", fileName: file.name };
      }
    })
  );
}

export async function convertCsvToXlsx(formData: FormData): Promise<MultiProcessResult> {
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return [{ error: 'Por favor, selecciona al menos un archivo.' }];
  }

  const results: ProcessResult[] = [];

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      results.push({
        error: `Tipo de archivo inválido para ${file.name}. Solo se admiten archivos CSV.`,
        fileName: file.name,
      });
      continue;
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      const csvWorkbook = xlsx.read(buffer, {
        type: 'buffer',
        raw: false, 
      });

      const sheetName = csvWorkbook.SheetNames[0];
      const worksheet = csvWorkbook.Sheets[sheetName];

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const xlsxBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'buffer',
      });

      const base64Data = Buffer.from(xlsxBuffer).toString('base64');
      const originalFileName = file.name.replace(/\.csv$/i, '');

      results.push({
        data: base64Data,
        fileName: `${originalFileName}.xlsx`,
      });

    } catch (e) {
      console.error(`CSV to XLSX conversion error for ${file.name}:`, e);
      results.push({
        error: `Error al convertir ${file.name}.`,
        fileName: file.name,
      });
    }
  }

  return results;
}
