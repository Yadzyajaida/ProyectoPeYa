/*
  VBO Form Configuration
  Provides the structured options for the VBO Vendor Management flow.
*/

import type { ActionOption } from './action-tree';

export const vboMainMenu: ActionOption[] = [
  { id: 'vendor_management', label: 'Vendor Management', icon: '🏢' },
  { id: 'device_management', label: 'Device Management (DMS)', icon: '📱' },
  { id: 'go_account_management', label: 'Go Account Management', icon: '💳' },
];

export const vboVendorManagementMenu: ActionOption[] = [
  { id: 'vendors', label: 'Vendors', icon: '🏪' },
  { id: 'pos_integrations', label: 'POS Integrations', icon: '🔌' },
];

export const vboVendorSearchOptions: ActionOption[] = [
  { id: 'search_vendor_id', label: 'Por Vendor ID' },
  { id: 'search_partner_name', label: 'Por Nombre del Partner' },
  { id: 'search_lpvid', label: 'Por LPVID' },
];

export const vboDefaultAttributes: ActionOption[] = [
  { id: 'val_vendor_name', label: 'Vendor Name' },
  { id: 'val_platform_vendor_id', label: 'Platform Vendor ID' },
  { id: 'val_lpvid', label: 'Logistics Physical Vendor ID' },
];

export const vboVerticals: string[] = [
  'Restaurant',
  'Coffee',
  'Licorería',
  'Veterinaria',
];

export const vboIntegrationTypes: string[] = [
  'POS DIRECT',
  'POS INDIRECT',
  'NON POS (No tiene integración)',
];

export const vboCountries: string[] = [
  'Argentina', 'Bolivia', 'Chile', 'Colombia', 'Costa Rica',
  'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras',
  'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'Uruguay', 'Venezuela',
];

export const vboPosSearchOptions: ActionOption[] = [
  { id: 'search_remote_id', label: 'Por Remote ID' },
  { id: 'search_lpvid', label: 'Por LPVID' },
];

export const vboPosEditOptions: ActionOption[] = [
  { id: 'edit_chain_id', label: 'Chain ID' },
  { id: 'edit_remote_id', label: 'Remote ID' },
  { id: 'edit_integration_type', label: 'Integration type' },
  { id: 'edit_allow_catalog', label: 'Allow catalog import' },
  { id: 'edit_hide_customer_info', label: 'Hide Customer information' },
];
