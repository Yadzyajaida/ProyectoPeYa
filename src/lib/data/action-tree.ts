/*
  Backoffice Action Tree

  This tree is used for the APARTADO phase after selecting BO.
  The main sections of BO are: Catálogo, Editar Perfil, Pedidos.

  Within Catálogo, the sub-tabs are:
    - Catálogo (editor) → sequential entity flow (Sección, Producto, Grupo, Opcionales)
    - Items deshabilitados
    - Configuración → Exportar, Gestión SKUs, Migraciones
    - Carga de archivos → multiple upload sections
    - Monitor carga de imágenes
    - Items Eliminados → entity filter search
*/

export interface ActionOption {
  id: string;
  label: string;
  icon?: string;
  isSkip?: boolean;
}

export interface ConfigSection {
  id: string;
  label: string;
  icon: string;
  question: string;
  options: ActionOption[];
}

// The main BO sections the agent picks from
export const boSections: ActionOption[] = [
  { id: 'catalogo', label: 'Catálogo', icon: '📦' },
  { id: 'editar_perfil', label: 'Editar Perfil', icon: '👤' },
  { id: 'pedidos', label: 'Pedidos', icon: '📋' },
];

// Sub-tabs within Catálogo
export const catalogTabs: ActionOption[] = [
  { id: 'cat_editor', label: 'Catálogo (Editor)', icon: '✏️' },
  { id: 'cat_items_des', label: 'Items deshabilitados', icon: '🚫' },
  { id: 'cat_config', label: 'Configuración', icon: '⚙️' },
  { id: 'cat_carga', label: 'Carga de archivos', icon: '📁' },
  { id: 'cat_monitor', label: 'Monitor carga de imágenes', icon: '🖼️' },
  { id: 'cat_items_elim', label: 'Items Eliminados', icon: '🗑️' },
  { id: 'cat_ontologia', label: 'Ontología', icon: '🧬' },
];

// Sequential entities for the Catálogo Editor
export const catalogEntities: ActionOption[] = [
  { id: 'seccion', label: 'Sección', icon: '📂' },
  { id: 'producto', label: 'Producto', icon: '🍔' },
  { id: 'grupo_opcionales', label: 'Grupo de opcionales', icon: '📎' },
  { id: 'opcionales', label: 'Opcionales', icon: '🔘' },
];

export const catalogEntityActions: ActionOption[] = [
  { id: 'crear', label: 'Crear', icon: '➕' },
  { id: 'modificar', label: 'Modificar', icon: '✏️' },
  { id: 'borrar', label: 'Borrar', icon: '🗑️' },
  { id: 'mover', label: 'Mover', icon: '↔️' },
  { id: 'no_aplica', label: 'No aplica / Siguiente', icon: '⏭️', isSkip: true },
];

// Configuración sub-sections
export const configSections: ConfigSection[] = [
  {
    id: 'conf_info',
    label: 'Información general',
    icon: 'ℹ️',
    question: '¿Qué editaste en Información general?',
    options: [
      { id: 'conf_info_nombre', label: 'Nombre del catálogo' },
      { id: 'conf_info_layout', label: 'Layout' },
      { id: 'conf_info_guardar', label: 'Guardar' },
    ],
  },
  {
    id: 'conf_exportar',
    label: 'Exportar',
    icon: '📥',
    question: '¿Qué descargamos?',
    options: [
      { id: 'conf_exp_secciones', label: 'Secciones' },
      { id: 'conf_exp_productos', label: 'Productos' },
      { id: 'conf_exp_grupos', label: 'Grupos de opciones' },
      { id: 'conf_exp_opciones', label: 'Opciones' },
    ],
  },
  {
    id: 'conf_sku',
    label: 'Gestión de SKUs',
    icon: '🏷️',
    question: '¿Qué realizamos en Gestión de SKUs?',
    options: [
      { id: 'conf_sku_generar', label: 'Generar SKUs faltantes' },
      { id: 'conf_sku_eliminar', label: 'Eliminar SKUs' },
    ],
  },
  {
    id: 'conf_migraciones',
    label: 'Migraciones',
    icon: '🔄',
    question: '¿Qué realizamos en Migraciones?',
    options: [
      { id: 'conf_mig_cache', label: 'Global Catalog - Refrescar cache 2nd Layer' },
    ],
  },
];

// Carga de archivos sub-sections
export const cargaSections: ConfigSection[] = [
  {
    id: 'carga_subir',
    label: 'Subir archivo',
    icon: '📤',
    question: '¿Qué botón accionamos?',
    options: [
      { id: 'carga_sub_inicial', label: 'Carga Inicial' },
      { id: 'carga_sub_stock', label: 'Gestión de stock' },
      { id: 'carga_sub_opcionales', label: 'Carga de opcionales' },
      { id: 'carga_sub_config', label: 'Configuración' },
    ],
  },
  {
    id: 'carga_imagenes',
    label: 'Carga de imágenes',
    icon: '🖼️',
    question: '¿Qué tipo de carga de imágenes realizamos?',
    options: [
      { id: 'carga_img_id', label: 'Subir imágenes por ID' },
      { id: 'carga_img_sku', label: 'Subir imágenes por SKU' },
    ],
  },
  {
    id: 'carga_integraciones',
    label: 'Integraciones',
    icon: '🔗',
    question: '¿Qué accionamos en Integraciones?',
    options: [
      { id: 'carga_int_inicial', label: 'Carga inicial' },
      { id: 'carga_int_opcionales', label: 'Carga de opcionales' },
      { id: 'carga_int_chequeo', label: 'Chequeo con catálogo' },
    ],
  },
  {
    id: 'carga_ordenacion',
    label: 'Ordenación',
    icon: '🔢',
    question: '¿Qué ordenamos?',
    options: [
      { id: 'carga_ord_productos', label: 'Ordenación de Productos' },
      { id: 'carga_ord_secciones', label: 'Ordenación de Secciones' },
    ],
  },
  {
    id: 'carga_mover',
    label: 'Mover',
    icon: '➡️',
    question: '¿Qué movimos?',
    options: [
      { id: 'carga_mov_productos', label: 'Mover Productos' },
    ],
  },
];

// Items Eliminados — entity filter
export const itemsEliminadosEntities: ActionOption[] = [
  { id: 'elim_seccion', label: 'Sección' },
  { id: 'elim_producto', label: 'Producto' },
  { id: 'elim_opcion', label: 'Opción' },
  { id: 'elim_grupo', label: 'Grupo de Opcionales' },
];

// Editar Perfil options
export const editarPerfilOptions: ActionOption[] = [
  { id: 'ep_seleccionar_menu', label: 'Seleccionar menú', icon: '✅' },
  { id: 'ep_crear_menu', label: 'Crear nuevo menú', icon: '➕' },
];

// BO Search options
export const boSearchOptions: ActionOption[] = [
  { id: 'search_id', label: 'Por ID de Tienda' },
  { id: 'search_nombre', label: 'Por Nombre' },
  { id: 'search_pedido', label: 'Por número de Pedido' },
];
