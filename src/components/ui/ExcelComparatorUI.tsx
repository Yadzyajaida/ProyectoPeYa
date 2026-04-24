import FileComparator from "../FileComparator";

export default function ExcelComparatorUI() {
  return (
    <div className="space-y-12">
      <FileComparator
        title="Comparador de productos"
        fileType="productos"
        idColumn="ID"
        file1Label="Archivo de productos antiguo"
        file2Label="Archivo de Productos Nuevo"
        description="Sube el archivo antiguo y el nuevo de productos. El nombre de ambos archivos debe contener la palabra 'productos'."
      />
      <FileComparator
        title="Comparador de opcionales"
        fileType="opcionales"
        idColumn="ID Opción"
        file1Label="Archivo de opcionales antiguo"
        file2Label="Archivo de opcionales nuevo"
        description="Sube el archivo antiguo y el nuevo de opcionales. El nombre de ambos archivos debe contener la palabra 'opcionales'."
      />
    </div>
  );
}
