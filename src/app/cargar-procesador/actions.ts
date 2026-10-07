'use server';

import * as xlsx from 'xlsx';

type ProcessResult = {
  data?: string;
  fileName?: string;
  error?: string;
  warning?: string;
  log?: string[];
};

const FORMATS = {
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

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[;"\n,]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function arrayToCSV(data: any[][], delimiter = ';'): string {
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


export async function processFormatFile(formData: FormData): Promise<ProcessResult> {
  const file = formData.get('file') as File | null;
  const formatType = formData.get('formatType') as keyof typeof FORMATS;
  const hasHeaders = formData.get('hasHeaders') === 'true';
  const confirmStockZero = formData.get('confirmStockZero') === 'true';

  if (!file) return { error: 'Debes subir un archivo.' };
  if (!FORMATS[formatType]) return { error: 'Formato no válido.' };

  const targetHeaders = FORMATS[formatType];
  let log: string[] = [];

  try {
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    
    // Find the first sheet that has data
    let worksheet;
    let rawData: any[][] = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
      const cleaned = trimTrailingEmptyRows(data);
      if (cleaned.length > 0) {
        worksheet = sheet;
        rawData = cleaned;
        break;
      }
    }

    if (!worksheet || rawData.length === 0) {
      return { error: 'El archivo está vacío o no contiene hojas con datos.' };
    }

    // Filter out completely empty rows FIRST
    let filteredData = rawData.filter(row => row && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== ''));

    if (filteredData.length === 0) {
       return { error: 'El archivo no contiene filas de datos.' };
    }

    // Skip the first row if user specified it has headers
    let content = hasHeaders ? filteredData.slice(1) : filteredData;

    let processedContent = content;

    // SKU Logic based on format
    if (formatType === 'productos') {
      // Map content to match target header length strictly
      processedContent = content.map(row => targetHeaders.map((_, i) => (i < row.length ? row[i] : '')));

      const skuIndex = 5; // SKU producto(*)
      const nameIndex = 3; // Nombre del producto (*)
      const priceIndex = 4; // Precio del producto(*)
      
      const skuCounts: { [key: string]: number } = {};
      let emptySkuCount = 0;

      processedContent.forEach((row, index) => {
        const excelRow = hasHeaders ? index + 2 : index + 1;
        const nombreProducto = row[nameIndex];
        
        // Fix Price
        const price = parseFloat(row[priceIndex]);
        row[priceIndex] = isNaN(price) || price < 0 ? 0 : price;

        const rawSku = row[skuIndex];
        if (rawSku === null || rawSku === undefined || String(rawSku).trim() === '') {
          const prefix = getNextPrefix(emptySkuCount);
          row[skuIndex] = prefix;
          log.push(`- Fila ${excelRow} / Nombre "${nombreProducto}": SKU vacío rellenado con '${prefix}'.`);
          emptySkuCount++;
          return;
        }

        const originalSku = String(rawSku).trim();
        if (skuCounts[originalSku]) {
          const count = skuCounts[originalSku];
          const prefix = getNextPrefix(count - 1);
          const newSku = `${prefix}${originalSku}`;
          log.push(`- Fila ${excelRow} / Nombre "${nombreProducto}": SKU duplicado '${originalSku}' renombrado a '${newSku}'.`);
          row[skuIndex] = newSku;
          skuCounts[originalSku]++;
        } else {
          skuCounts[originalSku] = 1;
        }
      });
    } else if (formatType === 'opcionales') {
      // Map content to match target header length strictly
      processedContent = content.map(row => targetHeaders.map((_, i) => (i < row.length ? row[i] : '')));

      const prodSkuIndex = 0; // SKU producto(*)
      const groupNameIndex = 1; // Nombre del grupo de opcionales(*)
      const minQtyIndex = 4; // Cantidad Mínima(*)
      const maxQtyIndex = 5; // Cantidad Máxima(*)
      const optNameIndex = 6; // Nombre del opcional(*)
      const optSkuIndex = 8; // SKU del opcional(*)
      
      const skuCounter = new Map<string, number>();
      let emptySkuCount = 0;

      processedContent.forEach((row, index) => {
        const excelRow = hasHeaders ? index + 2 : index + 1;
        
        // Fix min/max quantities
        const minQty = row[minQtyIndex];
        const maxQty = row[maxQtyIndex];
        if (String(maxQty).trim() !== '' && String(minQty).trim() === '') {
           row[minQtyIndex] = 0;
        }

        const rawSku = row[optSkuIndex];
        if (rawSku === null || rawSku === undefined || String(rawSku).trim() === '') {
           const prefix = getNextPrefix(emptySkuCount);
           row[optSkuIndex] = prefix;
           log.push(`- Fila ${excelRow}: SKU de opción vacío rellenado con '${prefix}'.`);
           emptySkuCount++;
           return;
        }

        const prodSku = String(row[prodSkuIndex]).trim();
        const groupName = String(row[groupNameIndex]).trim();
        const originalSku = String(rawSku).trim();

        const compositeKey = `${prodSku}-${groupName}-${originalSku}`;
        const currentCount = skuCounter.get(compositeKey) || 0;

        if (currentCount > 0) {
            const prefix = getNextPrefix(currentCount - 1);
            const newSku = `${prefix}${originalSku}`;
            log.push(`- Fila ${excelRow}: SKU de opción duplicado '${originalSku}' renombrado a '${newSku}'.`);
            row[optSkuIndex] = newSku;
        }
        
        skuCounter.set(compositeKey, currentCount + 1);
      });
    } else if (formatType === 'precios') {
      let skuIndex = 0;
      let nameIndex = 1;
      let priceIndex = 2;
      let stockIndex = 3;

      if (hasHeaders && content.length > 0 && rawData[0]) {
        const headerRow = rawData[0].map(h => String(h || '').trim().toLowerCase());
        const sIdx = headerRow.findIndex(h => h.includes('sku'));
        const nIdx = headerRow.findIndex(h => h.includes('nombre'));
        const pIdx = headerRow.findIndex(h => h.includes('precio'));
        const stIdx = headerRow.findIndex(h => h.includes('stock'));

        if (sIdx !== -1) skuIndex = sIdx;
        if (nIdx !== -1) nameIndex = nIdx;
        if (pIdx !== -1) priceIndex = pIdx;
        if (stIdx !== -1) stockIndex = stIdx;
      }

      let hasZeroStock = false;
      const newProcessed: any[][] = [];
      const seenSkus = new Set<string>();
      
      content.forEach((row, index) => {
        const excelRow = hasHeaders ? index + 2 : index + 1;
        
        const rawStock = row[stockIndex];
        let stockVal = 1; // default if empty
        if (rawStock !== null && rawStock !== undefined && String(rawStock).trim() !== '') {
          stockVal = parseInt(String(rawStock), 10);
          if (isNaN(stockVal) || (stockVal !== 0 && stockVal !== 1)) stockVal = 1;
        }
        
        const s = row[skuIndex] !== undefined && row[skuIndex] !== null ? String(row[skuIndex]).trim() : '';
        const n = row[nameIndex] !== undefined && row[nameIndex] !== null ? String(row[nameIndex]).trim() : '';
        const p = row[priceIndex] !== undefined && row[priceIndex] !== null ? String(row[priceIndex]).trim() : '';

        // Eliminar fila si sku, nombre o precio están vacíos
        if (s === '' || n === '' || p === '') {
          if (s !== '' || n !== '' || p !== '') {
            log.push(`- Fila ${excelRow}: Fila eliminada porque una columna esencial (SKU, Nombre o Precio) está vacía.`);
          }
          return; // skip
        }

        // Detectar SKU duplicado y eliminar la fila
        if (seenSkus.has(s)) {
          log.push(`- Fila ${excelRow}: SKU duplicado '${s}' detectado. Fila eliminada.`);
          return; // skip
        }
        seenSkus.add(s);

        if (stockVal === 0) hasZeroStock = true;

        const newRow = [...row];
        // Ensure stock index exists in the row if we are updating it, or just append it if needed
        while (newRow.length <= stockIndex) {
            newRow.push('');
        }
        newRow[stockIndex] = stockVal;
        
        newProcessed.push(newRow);
      });

      if (hasZeroStock && !confirmStockZero) {
        return { warning: 'stock_0_detected', error: 'Hay valores de Stock en 0' };
      }

      processedContent = newProcessed;
    } else {
       // precios_opcionales
       processedContent = content.map(row => targetHeaders.map((_, i) => (i < row.length ? row[i] : '')));
    }

    if (formatType === 'precios' && hasHeaders && rawData[0]) {
      processedContent.unshift(rawData[0]);
    } else {
      processedContent.unshift(targetHeaders);
    }

    const csvString = arrayToCSV(processedContent, ';');
    const utf8BOM = "\uFEFF";
    const finalCsv = utf8BOM + csvString;
    const base64Data = Buffer.from(finalCsv, 'utf8').toString('base64');

    if (log.length === 0) {
      log.push('Archivo procesado correctamente sin correcciones necesarias.');
    }

    return {
      data: base64Data,
      fileName: `${formatType}_procesado.csv`,
      log
    };

  } catch (e) {
    console.error('Process error:', e);
    return { error: 'Ocurrió un error al procesar el archivo. Verifica que el formato sea correcto.' };
  }
}

export async function generateTemplate(formatType: keyof typeof FORMATS | 'completa'): Promise<{ data: string, fileName: string }> {
  const workbook = xlsx.utils.book_new();

  const addSheet = (fmt: keyof typeof FORMATS, sheetName: string) => {
    const headers = FORMATS[fmt];
    const data: any[][] = [headers];

    if (fmt === 'precios') {
      // Add 40 rows of just '1' in the stock column (index 3) with empty cells before it
      for (let i = 0; i < 40; i++) {
        data.push(['', '', '', 1]);
      }
    }

    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  };

  if (formatType === 'completa') {
    addSheet('productos', 'Productos');
    addSheet('opcionales', 'Opcionales');
    addSheet('precios', 'Precios');
    addSheet('precios_opcionales', 'Precios Opcionales');
  } else {
    addSheet(formatType, formatType.charAt(0).toUpperCase() + formatType.slice(1));
  }

  const xlsxBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  const base64Data = Buffer.from(xlsxBuffer).toString('base64');
  
  return {
    data: base64Data,
    fileName: formatType === 'completa' ? 'Plantilla_Completa.xlsx' : `Plantilla_${formatType}.xlsx`
  };
}
