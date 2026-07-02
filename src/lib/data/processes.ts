/*
  Proceso Seguido — Matriz de Tipificación
  Cada categoría (SOP) contiene sus procesos con la tipificación HeroCare y Motivo de Contacto.
  Los textos que incluyen "{partner}" serán reemplazados dinámicamente con el nombre del partner.
*/

export interface ProcessItem {
  id: string;
  label: string;
  gestionHeroCare: string;
  motivoContacto: string;
}

export interface ProcessCategory {
  id: string;
  label: string;
  icon: string;
  processes: ProcessItem[];
}

export const processCategories: ProcessCategory[] = [
  {
    id: 'gestion_campanas',
    label: 'Gestión de Campañas',
    icon: '📢',
    processes: [
      {
        id: 'solicitud_campana_marketing',
        label: 'Solicitud de campaña de Marketing',
        gestionHeroCare: 'Campaña Marketing',
        motivoContacto: 'Interés en participar en Campaña',
      },
      {
        id: 'solicitud_gestion_campana',
        label: 'Solicitud de gestión de campaña',
        gestionHeroCare: 'Gestión de Campaña Marketing',
        motivoContacto: 'Interés en participar en Campaña',
      },
      {
        id: 'eliminacion_campana',
        label: 'Eliminación de campaña de marketing',
        gestionHeroCare: 'Eliminación de Campaña Marketing',
        motivoContacto: 'Terminación de campañas comerciales',
      },
      {
        id: 'quita_tag',
        label: 'Quita de TAG/Etiqueta y fecha en productos',
        gestionHeroCare: 'Gestión de Campaña Marketing',
        motivoContacto: 'Interés en participar en campañas comerciales',
      },
    ],
  },
  {
    id: 'actualizacion_catalogos',
    label: 'Actualización de Catálogos Integrados',
    icon: '📋',
    processes: [
      {
        id: 'actualizacion_menu',
        label: 'Actualización de menú',
        gestionHeroCare: 'Actualización de Menú',
        motivoContacto: 'Agregar items o ingredientes',
      },
      {
        id: 'actualizacion_precios',
        label: 'Actualización de precios',
        gestionHeroCare: 'Actualización de Precios',
        motivoContacto: 'Cambio de precios',
      },
      {
        id: 'borrado_menu',
        label: 'Borrado de menú',
        gestionHeroCare: 'Borrado de Menú',
        motivoContacto: 'Cambiar configuración de menú',
      },
      {
        id: 'unificar_menu',
        label: 'Unificar menú',
        gestionHeroCare: 'Unificar Menú',
        motivoContacto: 'Cambio de diseño del Menú',
      },
      {
        id: 'desunificar_menu',
        label: 'Desunificar menú',
        gestionHeroCare: 'Desunificar Menú',
        motivoContacto: 'Cambio de diseño del Menú',
      },
      {
        id: 'codificar_menu',
        label: 'Codificar menú',
        gestionHeroCare: 'Codificar Menú',
        motivoContacto: 'Cambiar configuración de menú',
      },
      {
        id: 'solicitud_archivo_codificar',
        label: 'Solicitud de archivo para codificar menú',
        gestionHeroCare: 'Solicitud de archivos CSV',
        motivoContacto: 'Cambiar configuración de menú',
      },
      {
        id: 'mapeo_productos',
        label: 'Mapeo de productos',
        gestionHeroCare: 'Mapeo de Productos',
        motivoContacto: 'Cambiar configuración de menú',
      },
    ],
  },
  {
    id: 'config_integraciones',
    label: 'Configuración de Integraciones',
    icon: '⚙️',
    processes: [
      {
        id: 'mapeo_restaurante',
        label: 'Mapeo de restaurante',
        gestionHeroCare: 'Mapeo de Restaurant',
        motivoContacto: 'Configurar o Cambiar',
      },
      {
        id: 'baja_integracion',
        label: 'Solicitud de baja de integración',
        gestionHeroCare: 'Baja de Integración',
        motivoContacto: 'Configurar o Cambiar',
      },
      {
        id: 'seteo_integracion',
        label: 'Seteo de integración',
        gestionHeroCare: 'Seteo de Integración ({partner})',
        motivoContacto: 'Configurar o Cambiar',
      },
      {
        id: 'edicion_perfil_datos',
        label: 'Edición de perfil — Configuración de datos',
        gestionHeroCare: 'Edición de Perfil: Configuración de datos de Usuarios',
        motivoContacto: 'Otros problemas con la app',
      },
      {
        id: 'edicion_perfil_notas',
        label: 'Edición de perfil — Soporte de notas de productos',
        gestionHeroCare: 'Edición de Perfil: Soporte de Notas de Productos',
        motivoContacto: 'Otros problemas con la app',
      },
      {
        id: 'onboarding_integracion',
        label: 'Onboarding Integración',
        gestionHeroCare: 'Onboarding | ({partner})',
        motivoContacto: 'Configurar o Cambiar',
      },
    ],
  },
  {
    id: 'soporte_tecnico',
    label: 'Soporte Técnico',
    icon: '🔧',
    processes: [
      {
        id: 'verificar_integracion',
        label: 'Verificar Integración',
        gestionHeroCare: 'Verificar Integración ({partner})',
        motivoContacto: 'Problema técnico',
      },
      {
        id: 'pedido_prueba',
        label: 'Pedido de prueba',
        gestionHeroCare: 'Pedido de Prueba',
        motivoContacto: 'Pregunta sobre funcionalidad',
      },
      {
        id: 'modelo_atencion_issues',
        label: 'Modelo de atención de issues',
        gestionHeroCare: 'Modelo de atención de issues',
        motivoContacto: 'Problema técnico',
      },
      {
        id: 'analisis_orden',
        label: 'Análisis de orden',
        gestionHeroCare: 'Análisis de Orden',
        motivoContacto: 'Problema técnico',
      },
    ],
  },
  {
    id: 'migracion_sdk_api',
    label: 'Migración SDK - API',
    icon: '🔄',
    processes: [
      {
        id: 'rollback_pos_api',
        label: 'Rollback POS API a SDK',
        gestionHeroCare: 'Rollback | POS API ({partner})',
        motivoContacto: 'Configurar o Cambiar',
      },
      {
        id: 'migracion_sdk_pos',
        label: 'Migración SDK a POS API',
        gestionHeroCare: 'Migration | POS API ({partner})',
        motivoContacto: 'Configurar o Cambiar',
      },
      {
        id: 'roadmap',
        label: 'Roadmap',
        gestionHeroCare: 'Roadmap | POS API ({partner})',
        motivoContacto: 'Pregunta sobre funcionalidad',
      },
    ],
  },
  {
    id: 'procesos',
    label: 'Procesos',
    icon: '📂',
    processes: [
      {
        id: 'issue_bug_catalogo',
        label: 'Issue/bug Actualización de Promociones & Catálogo',
        gestionHeroCare: 'Issue/bug Catálogo | SFTP DH ({partner})',
        motivoContacto: 'Configurar o Cambiar',
      },
      {
        id: 'verificar_credenciales_sftp',
        label: 'Verificar Credenciales SFTP',
        gestionHeroCare: 'Credenciales | SFTP DH ({partner})',
        motivoContacto: 'Configurar o Cambiar',
      },
    ],
  },
];
