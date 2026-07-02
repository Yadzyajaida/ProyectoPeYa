'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import {
  boSections, catalogTabs, catalogEntities, catalogEntityActions,
  configSections, cargaSections, itemsEliminadosEntities, boSearchOptions,
  editarPerfilOptions,
  type ActionOption, type ConfigSection,
} from '@/lib/data/action-tree';
import {
  vboMainMenu, vboVendorManagementMenu, vboVendorSearchOptions,
  vboDefaultAttributes, vboVerticals, vboIntegrationTypes, vboCountries,
  vboPosSearchOptions, vboPosEditOptions,
} from '@/lib/data/vbo-action-tree';

export interface ActionEntry {
  tool: string;
  toolId: string;
  label: string;
}

type Phase =
  | 'TOOL' | 'SEARCH' | 'BO_SECTION' | 'BO_EDITAR_PERFIL'
  | 'CAT_TAB' | 'CAT_ENTITY' | 'CAT_CONFIG' | 'CAT_CONFIG_OPT'
  | 'CAT_CARGA' | 'CAT_CARGA_OPT' | 'CAT_ITEMS_ELIM'
  | 'VBO_MAIN' | 'VBO_VM_SECTION' | 'VBO_VENDOR_WIZARD' | 'VBO_POS_WIZARD';

interface VendorStep {
  id: string;
  label: string;
  conditional?: boolean;
}

const TOOLS = [
  { id: 'bo', label: 'Backoffice', icon: '🖥️', desc: 'Gestión de catálogo, pedidos y perfiles' },
  { id: 'vendor_bo', label: 'Vendor US Back Office', icon: '🔧', desc: 'Configuración e integración POS' },
];

const VENDOR_STEPS: VendorStep[] = [
  { id: 'search', label: 'Búsqueda' },
  { id: 'country', label: 'País' },
  { id: 'attributes', label: 'Default Attributes' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'integration', label: 'Tipo Integración' },
  { id: 'linked', label: 'Linked Vendors' },
  { id: 'linked_count', label: 'Cantidad', conditional: true },
  { id: 'auto_accept', label: 'Auto Accept' },
];

const POS_STEPS: VendorStep[] = [
  { id: 'search', label: 'Búsqueda' },
  { id: 'edit', label: 'Edit Vendor' },
];

interface VendorData {
  search: string;
  country: string;
  attributes: string[];
  vertical: string;
  integration: string;
  linked: string;
  linkedCount: string;
  autoAccept: string;
}

interface PosData {
  search: string;
  edits: string[];
}

interface ActionWizardProps {
  onComplete: (actions: ActionEntry[]) => void;
}

export function ActionWizard({ onComplete }: ActionWizardProps) {
  const [phase, setPhase] = useState<Phase>('TOOL');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [selectedToolLabel, setSelectedToolLabel] = useState<string | null>(null);
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const [entityIndex, setEntityIndex] = useState(0);
  const [selectedSubSection, setSelectedSubSection] = useState<ConfigSection | null>(null);

  const [vendorStep, setVendorStep] = useState(0);
  const [vendorData, setVendorData] = useState<VendorData>({
    search: '', country: '', attributes: [], vertical: '',
    integration: '', linked: '', linkedCount: '', autoAccept: '',
  });

  const [posStep, setPosStep] = useState(0);
  const [posData, setPosData] = useState<PosData>({ search: '', edits: [] });

  const addAction = (label: string, tool?: string, toolId?: string) => {
    setActions(prev => [...prev, {
      tool: tool || selectedToolLabel || '',
      toolId: toolId || selectedToolId || '',
      label,
    }]);
  };

  const removeAction = (index: number) => {
    setActions(prev => prev.filter((_, i) => i !== index));
  };

  // ── Render helpers ──

  const renderBreadcrumb = () => {
    if (breadcrumb.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-muted-foreground text-xs">›</span>}
            <span className={`text-xs ${i === breadcrumb.length - 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderTimeline = () => {
    if (actions.length === 0) return null;
    return (
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="space-y-0">
            {actions.map((act, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">{act.label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{act.tool}</p>
                </div>
                <button
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  onClick={() => removeAction(i)}
                  title="Eliminar acción"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOptions = (
    options: (ActionOption | { id?: string; label: string; icon?: string; isSkip?: boolean })[],
    onClick: (opt: ActionOption) => void,
    cols?: number
  ) => (
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : 'repeat(auto-fill, minmax(200px, 1fr))' }}
    >
      {options.map(opt => (
        <button
          key={opt.id || opt.label}
          className={`text-left p-3.5 rounded-md border transition-all text-sm ${
            opt.isSkip
              ? 'border-dashed border-border text-muted-foreground/70 hover:text-muted-foreground hover:border-muted-foreground'
              : 'border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-foreground'
          }`}
          onClick={() => onClick(opt as ActionOption)}
        >
          {opt.icon && <span className="mr-2">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );

  const renderBackAndFinish = (onBack?: (() => void) | null) => (
    <div className="flex justify-between items-center pt-5 border-t border-border mt-6">
      <div>
        {onBack && (
          <Button variant="ghost" onClick={onBack}>← Volver</Button>
        )}
      </div>
      <div>
        {actions.length > 0 && (
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onComplete(actions)}>
            ✅ Finalizar Ticket
          </Button>
        )}
      </div>
    </div>
  );

  // ── VBO Vendor Wizard helpers ──

  const finalizeVendorWizard = (data: VendorData) => {
    const parts = ['Vendor Management → Vendors'];
    parts.push(`Búsqueda: ${data.search}`);
    parts.push(`País: ${data.country}`);
    if (data.attributes.length > 0) {
      parts.push(`Validó: ${data.attributes.join(', ')}`);
    }
    parts.push(`Vertical: ${data.vertical}`);
    parts.push(`Tipo: ${data.integration}`);
    if (data.linked === 'Sí') {
      parts.push(`Linked: Sí (${data.linkedCount} tiendas)`);
    } else {
      parts.push('Linked: No');
    }
    parts.push(`Auto Accept: ${data.autoAccept}`);
    addAction(parts.join(' → '));
  };

  const renderVendorProgress = () => {
    const visibleSteps = VENDOR_STEPS.filter(s => {
      if (s.id === 'linked_count') return vendorData.linked === 'Sí';
      return true;
    });
    const currentStepId = VENDOR_STEPS[vendorStep]?.id;
    const currentVisibleIdx = visibleSteps.findIndex(s => s.id === currentStepId);

    return (
      <div className="flex gap-1 mb-6 p-4 bg-muted/30 rounded-lg border border-border">
        {visibleSteps.map((step, i) => (
          <div
            key={step.id}
            className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-md text-xs ${
              i < currentVisibleIdx ? 'text-green-500' :
              i === currentVisibleIdx ? 'bg-primary/10 text-primary font-semibold' :
              'text-muted-foreground'
            }`}
          >
            {i < currentVisibleIdx ? '✅' : i === currentVisibleIdx ? '📍' : '○'}
            <span className="whitespace-nowrap">{step.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const finalizePosWizard = (data: PosData) => {
    const parts = ['Vendor Management → POS Integrations'];
    parts.push(`Búsqueda: ${data.search}`);
    if (data.edits.length > 0) {
      parts.push(`Editó: ${data.edits.join(', ')}`);
    } else {
      parts.push('Editó: Nada (Solo visualizó)');
    }
    addAction(parts.join(' → '));
  };

  const renderPosProgress = () => (
    <div className="flex gap-1 mb-6 p-4 bg-muted/30 rounded-lg border border-border">
      {POS_STEPS.map((step, i) => (
        <div
          key={step.id}
          className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-md text-xs ${
            i < posStep ? 'text-green-500' :
            i === posStep ? 'bg-primary/10 text-primary font-semibold' :
            'text-muted-foreground'
          }`}
        >
          {i < posStep ? '✅' : i === posStep ? '📍' : '○'}
          <span className="whitespace-nowrap">{step.label}</span>
        </div>
      ))}
    </div>
  );

  // ══════════════════════════════════════════════
  // PHASE: TOOL
  // ══════════════════════════════════════════════
  if (phase === 'TOOL') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-foreground mb-1">
              {actions.length === 0 ? '¿Qué fue lo primero que hiciste?' : '¿Qué herramienta accionamos ahora?'}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">Selecciona la herramienta donde realizaste la gestión</p>
            <div className="grid grid-cols-2 gap-3">
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  className="flex flex-col items-center gap-2 p-7 rounded-md border border-border bg-card text-center hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => {
                    setSelectedToolId(tool.id);
                    setSelectedToolLabel(tool.label);
                    setBreadcrumb([tool.label]);
                    if (tool.id === 'bo') {
                      setPhase('SEARCH');
                    } else {
                      setPhase('VBO_MAIN');
                    }
                  }}
                >
                  <span className="text-4xl">{tool.icon}</span>
                  <strong className="text-foreground">{tool.label}</strong>
                  <span className="text-xs text-muted-foreground">{tool.desc}</span>
                </button>
              ))}
            </div>
            {renderBackAndFinish(null)}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: SEARCH (BO only)
  // ══════════════════════════════════════════════
  if (phase === 'SEARCH') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Cómo encontramos al partner?</h2>
            {renderOptions(boSearchOptions, (opt) => {
              addAction(`Ingreso a ${selectedToolLabel} → Búsqueda: ${opt.label}`);
              setBreadcrumb([selectedToolLabel!]);
              setPhase('BO_SECTION');
            })}
            {renderBackAndFinish(() => { setPhase('TOOL'); setBreadcrumb([]); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: BO_SECTION
  // ══════════════════════════════════════════════
  if (phase === 'BO_SECTION') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué gestión realizamos en Backoffice?</h2>
            {renderOptions(boSections, (opt) => {
              if (opt.id === 'catalogo') {
                setBreadcrumb([selectedToolLabel!, 'Catálogo']);
                setPhase('CAT_TAB');
              } else if (opt.id === 'editar_perfil') {
                setBreadcrumb([selectedToolLabel!, 'Editar Perfil']);
                setPhase('BO_EDITAR_PERFIL');
              } else if (opt.id === 'pedidos') {
                addAction('Pedidos');
                setBreadcrumb([selectedToolLabel!]);
              }
            })}
            <div className="flex justify-between items-center pt-5 border-t border-border mt-6">
              <Button variant="ghost" onClick={() => { setBreadcrumb([]); setPhase('TOOL'); }}>
                ← Cambiar Herramienta
              </Button>
              {actions.length > 0 && (
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onComplete(actions)}>
                  ✅ Finalizar Ticket
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: BO_EDITAR_PERFIL
  // ══════════════════════════════════════════════
  if (phase === 'BO_EDITAR_PERFIL') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué gestión realizamos en el menú?</h2>
            {renderOptions(editarPerfilOptions, (opt) => {
              addAction(`Editar Perfil → ${opt.label}`);
              setBreadcrumb([selectedToolLabel!]);
              setPhase('BO_SECTION');
            })}
            {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel!]); setPhase('BO_SECTION'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_TAB
  // ══════════════════════════════════════════════
  if (phase === 'CAT_TAB') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿En qué pestaña de Catálogo trabajamos?</h2>
            {renderOptions(catalogTabs, (opt) => {
              setBreadcrumb([selectedToolLabel!, 'Catálogo', opt.label]);
              if (opt.id === 'cat_editor') {
                setEntityIndex(0);
                setPhase('CAT_ENTITY');
              } else if (opt.id === 'cat_config') {
                setPhase('CAT_CONFIG');
              } else if (opt.id === 'cat_carga') {
                setPhase('CAT_CARGA');
              } else if (opt.id === 'cat_items_elim') {
                setPhase('CAT_ITEMS_ELIM');
              } else {
                addAction(`Catálogo → ${opt.label}`);
                setBreadcrumb([selectedToolLabel!, 'Catálogo']);
              }
            })}
            {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel!]); setPhase('BO_SECTION'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_ENTITY
  // ══════════════════════════════════════════════
  if (phase === 'CAT_ENTITY') {
    const entity = catalogEntities[entityIndex];
    if (!entity) {
      setBreadcrumb([selectedToolLabel!, 'Catálogo']);
      setPhase('CAT_TAB');
      return null;
    }
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-1">
              {entity.icon} {entity.label}: ¿Qué realizamos?
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Entidad {entityIndex + 1} de {catalogEntities.length}
            </p>
            <div className="flex gap-1 mb-6 p-4 bg-muted/30 rounded-lg border border-border">
              {catalogEntities.map((e, i) => (
                <div key={e.id} className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-md text-xs ${
                  i < entityIndex ? 'text-green-500' :
                  i === entityIndex ? 'bg-primary/10 text-primary font-semibold' :
                  'text-muted-foreground'
                }`}>
                  {e.icon}
                  <span>{e.label}</span>
                </div>
              ))}
            </div>
            {renderOptions(catalogEntityActions, (opt) => {
              if (!opt.isSkip) {
                addAction(`Catálogo → ${entity.label} → ${opt.label}`);
              }
              const nextIdx = entityIndex + 1;
              if (nextIdx < catalogEntities.length) {
                setEntityIndex(nextIdx);
                setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Editor', catalogEntities[nextIdx].label]);
              } else {
                setBreadcrumb([selectedToolLabel!, 'Catálogo']);
                setPhase('CAT_TAB');
              }
            })}
            {renderBackAndFinish(() => {
              if (entityIndex > 0) {
                setEntityIndex(entityIndex - 1);
                setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Editor', catalogEntities[entityIndex - 1].label]);
              } else {
                setBreadcrumb([selectedToolLabel!, 'Catálogo']);
                setPhase('CAT_TAB');
              }
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_CONFIG
  // ══════════════════════════════════════════════
  if (phase === 'CAT_CONFIG') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué sección de Configuración elegiste?</h2>
            {renderOptions(configSections, (opt) => {
              const section = configSections.find(s => s.id === opt.id)!;
              setSelectedSubSection(section);
              setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Configuración', opt.label]);
              setPhase('CAT_CONFIG_OPT');
            })}
            {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel!, 'Catálogo']); setPhase('CAT_TAB'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_CONFIG_OPT
  // ══════════════════════════════════════════════
  if (phase === 'CAT_CONFIG_OPT' && selectedSubSection) {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">{selectedSubSection.question}</h2>
            {renderOptions(selectedSubSection.options, (opt) => {
              addAction(`Catálogo → Configuración → ${selectedSubSection.label} → ${opt.label}`);
              setSelectedSubSection(null);
              setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Configuración']);
              setPhase('CAT_CONFIG');
            })}
            {renderBackAndFinish(() => {
              setSelectedSubSection(null);
              setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Configuración']);
              setPhase('CAT_CONFIG');
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_CARGA
  // ══════════════════════════════════════════════
  if (phase === 'CAT_CARGA') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué apartado de Carga de archivos elegiste?</h2>
            {renderOptions(cargaSections, (opt) => {
              const section = cargaSections.find(s => s.id === opt.id)!;
              setSelectedSubSection(section);
              setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Carga de archivos', opt.label]);
              setPhase('CAT_CARGA_OPT');
            })}
            {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel!, 'Catálogo']); setPhase('CAT_TAB'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_CARGA_OPT
  // ══════════════════════════════════════════════
  if (phase === 'CAT_CARGA_OPT' && selectedSubSection) {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">{selectedSubSection.question}</h2>
            {renderOptions(selectedSubSection.options, (opt) => {
              addAction(`Catálogo → Carga de archivos → ${selectedSubSection.label} → ${opt.label}`);
              setSelectedSubSection(null);
              setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Carga de archivos']);
              setPhase('CAT_CARGA');
            })}
            {renderBackAndFinish(() => {
              setSelectedSubSection(null);
              setBreadcrumb([selectedToolLabel!, 'Catálogo', 'Carga de archivos']);
              setPhase('CAT_CARGA');
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: CAT_ITEMS_ELIM
  // ══════════════════════════════════════════════
  if (phase === 'CAT_ITEMS_ELIM') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué entidad logramos buscar en Items Eliminados?</h2>
            {renderOptions(itemsEliminadosEntities, (opt) => {
              addAction(`Catálogo → Items Eliminados → ${opt.label}`);
              setBreadcrumb([selectedToolLabel!, 'Catálogo']);
              setPhase('CAT_TAB');
            })}
            {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel!, 'Catálogo']); setPhase('CAT_TAB'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: VBO_MAIN
  // ══════════════════════════════════════════════
  if (phase === 'VBO_MAIN') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué herramienta escogimos en VBO?</h2>
            {renderOptions(vboMainMenu, (opt) => {
              setBreadcrumb([selectedToolLabel!, opt.label]);
              if (opt.id === 'vendor_management') {
                setPhase('VBO_VM_SECTION');
              } else {
                addAction(opt.label);
                setBreadcrumb([selectedToolLabel!]);
              }
            })}
            {renderBackAndFinish(() => { setBreadcrumb([]); setPhase('TOOL'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: VBO_VM_SECTION
  // ══════════════════════════════════════════════
  if (phase === 'VBO_VM_SECTION') {
    return (
      <div className="animate-in fade-in duration-300">
        {renderTimeline()}
        <Card>
          <CardContent className="p-6">
            {renderBreadcrumb()}
            <h2 className="text-lg font-medium text-foreground mb-5">¿Qué apartado escogimos?</h2>
            {renderOptions(vboVendorManagementMenu, (opt) => {
              setBreadcrumb([selectedToolLabel!, 'Vendor Management', opt.label]);
              if (opt.id === 'vendors') {
                setVendorStep(0);
                setVendorData({ search: '', country: '', attributes: [], vertical: '', integration: '', linked: '', linkedCount: '', autoAccept: '' });
                setPhase('VBO_VENDOR_WIZARD');
              } else if (opt.id === 'pos_integrations') {
                setPosStep(0);
                setPosData({ search: '', edits: [] });
                setPhase('VBO_POS_WIZARD');
              }
            })}
            {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel!]); setPhase('VBO_MAIN'); })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // PHASE: VBO_VENDOR_WIZARD
  // ══════════════════════════════════════════════
  if (phase === 'VBO_VENDOR_WIZARD') {
    const stepId = VENDOR_STEPS[vendorStep]?.id;

    const goBack = () => {
      if (vendorStep > 0) {
        let prevStep = vendorStep - 1;
        if (VENDOR_STEPS[prevStep]?.id === 'linked_count' && vendorData.linked !== 'Sí') {
          prevStep--;
        }
        setVendorStep(prevStep);
      } else {
        setBreadcrumb([selectedToolLabel!, 'Vendor Management']);
        setPhase('VBO_VM_SECTION');
      }
    };

    const goNext = () => {
      let nextStep = vendorStep + 1;
      if (VENDOR_STEPS[nextStep]?.id === 'linked_count' && vendorData.linked !== 'Sí') {
        nextStep++;
      }
      if (nextStep >= VENDOR_STEPS.length) {
        finalizeVendorWizard(vendorData);
        setBreadcrumb([selectedToolLabel!]);
        setPhase('VBO_MAIN');
      } else {
        setVendorStep(nextStep);
      }
    };

    // Search
    if (stepId === 'search') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">¿Cómo buscamos al partner?</h2>
              {renderOptions(vboVendorSearchOptions, (opt) => {
                setVendorData(prev => ({ ...prev, search: opt.label }));
                goNext();
              })}
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Country
    if (stepId === 'country') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">¿Qué país escogimos?</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {vboCountries.map(country => (
                  <button
                    key={country}
                    className="text-left p-3.5 rounded-md border border-border bg-card text-sm text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-foreground transition-all"
                    onClick={() => {
                      setVendorData(prev => ({ ...prev, country }));
                      goNext();
                    }}
                  >
                    🌍 {country}
                  </button>
                ))}
              </div>
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default Attributes
    if (stepId === 'attributes') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-1">Default Attributes: ¿Qué validamos?</h2>
              <p className="text-sm text-muted-foreground mb-4">Selecciona los campos que validaste. Puedes elegir varios.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vboDefaultAttributes.map(attr => {
                  const isSelected = vendorData.attributes.includes(attr.label);
                  return (
                    <button
                      key={attr.id}
                      className={`text-left p-3.5 rounded-md border transition-all text-sm ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/5'
                      }`}
                      onClick={() => {
                        setVendorData(prev => {
                          const attrs = prev.attributes.includes(attr.label)
                            ? prev.attributes.filter(a => a !== attr.label)
                            : [...prev.attributes, attr.label];
                          return { ...prev, attributes: attrs };
                        });
                      }}
                    >
                      <span className="mr-2">{isSelected ? '✅' : '☐'}</span>
                      {attr.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-border mt-6">
                <Button variant="ghost" onClick={goBack}>← Volver</Button>
                <Button onClick={goNext}>Continuar →</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Vertical
    if (stepId === 'vertical') {
      const verticalOptions = vboVerticals.map(v => ({ id: v, label: v }));
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">¿Qué Vertical tiene el vendor?</h2>
              {renderOptions(verticalOptions, (opt) => {
                setVendorData(prev => ({ ...prev, vertical: opt.label }));
                goNext();
              })}
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Integration type
    if (stepId === 'integration') {
      const integrationOptions = vboIntegrationTypes.map(t => ({ id: t, label: t }));
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">¿Qué tipo de integración tiene?</h2>
              {renderOptions(integrationOptions, (opt) => {
                setVendorData(prev => ({ ...prev, integration: opt.label }));
                goNext();
              })}
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Linked Vendors
    if (stepId === 'linked') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">Linked Vendors: ¿Está unificado por SR con otras tiendas?</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex flex-col items-center gap-2 p-7 rounded-md border border-border bg-card text-center hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => {
                    setVendorData(prev => ({ ...prev, linked: 'Sí' }));
                    goNext();
                  }}
                >
                  <span className="text-4xl">✅</span>
                  <strong className="text-foreground">Sí</strong>
                </button>
                <button
                  className="flex flex-col items-center gap-2 p-7 rounded-md border border-border bg-card text-center hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => {
                    setVendorData(prev => ({ ...prev, linked: 'No', linkedCount: '' }));
                    let next = vendorStep + 1;
                    if (VENDOR_STEPS[next]?.id === 'linked_count') next++;
                    if (next >= VENDOR_STEPS.length) {
                      const newData = { ...vendorData, linked: 'No', linkedCount: '' };
                      finalizeVendorWizard(newData);
                      setBreadcrumb([selectedToolLabel!]);
                      setPhase('VBO_MAIN');
                    } else {
                      setVendorStep(next);
                    }
                  }}
                >
                  <span className="text-4xl">❌</span>
                  <strong className="text-foreground">No</strong>
                </button>
              </div>
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Linked Count
    if (stepId === 'linked_count') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">¿Con cuántas tiendas está unificado?</h2>
              <div className="max-w-xs mb-5 space-y-2">
                <Label htmlFor="linkedCount">Cantidad de tiendas</Label>
                <Input
                  type="number"
                  id="linkedCount"
                  min={1}
                  value={vendorData.linkedCount}
                  onChange={(e) => setVendorData(prev => ({ ...prev, linkedCount: e.target.value }))}
                  placeholder="Ej. 3"
                  autoFocus
                />
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-border mt-6">
                <Button variant="ghost" onClick={goBack}>← Volver</Button>
                <Button disabled={!vendorData.linkedCount} onClick={goNext}>Continuar →</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Auto Accept Orders
    if (stepId === 'auto_accept') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderVendorProgress()}
              <h2 className="text-lg font-medium text-foreground mb-1">Custom Attributes: Auto Accept Orders</h2>
              <p className="text-sm text-muted-foreground mb-4">¿Está encendido o apagado?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="flex flex-col items-center gap-2 p-7 rounded-md border border-border bg-card text-center hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => {
                    const newData = { ...vendorData, autoAccept: 'Encendido' };
                    setVendorData(newData);
                    finalizeVendorWizard(newData);
                    setBreadcrumb([selectedToolLabel!]);
                    setPhase('VBO_MAIN');
                  }}
                >
                  <span className="text-4xl">🟢</span>
                  <strong className="text-foreground">Encendido</strong>
                </button>
                <button
                  className="flex flex-col items-center gap-2 p-7 rounded-md border border-border bg-card text-center hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => {
                    const newData = { ...vendorData, autoAccept: 'Apagado' };
                    setVendorData(newData);
                    finalizeVendorWizard(newData);
                    setBreadcrumb([selectedToolLabel!]);
                    setPhase('VBO_MAIN');
                  }}
                >
                  <span className="text-4xl">🔴</span>
                  <strong className="text-foreground">Apagado</strong>
                </button>
              </div>
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // ══════════════════════════════════════════════
  // PHASE: VBO_POS_WIZARD
  // ══════════════════════════════════════════════
  if (phase === 'VBO_POS_WIZARD') {
    const stepId = POS_STEPS[posStep]?.id;

    const goBack = () => {
      if (posStep > 0) {
        setPosStep(posStep - 1);
      } else {
        setBreadcrumb([selectedToolLabel!, 'Vendor Management']);
        setPhase('VBO_VM_SECTION');
      }
    };

    const goNext = () => {
      const nextStep = posStep + 1;
      if (nextStep >= POS_STEPS.length) {
        finalizePosWizard(posData);
        setBreadcrumb([selectedToolLabel!]);
        setPhase('VBO_MAIN');
      } else {
        setPosStep(nextStep);
      }
    };

    // Search
    if (stepId === 'search') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderPosProgress()}
              <h2 className="text-lg font-medium text-foreground mb-5">¿Cómo encontramos al partner?</h2>
              {renderOptions(vboPosSearchOptions, (opt) => {
                setPosData(prev => ({ ...prev, search: opt.label }));
                goNext();
              })}
              {renderBackAndFinish(goBack)}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Edit
    if (stepId === 'edit') {
      return (
        <div className="animate-in fade-in duration-300">
          {renderTimeline()}
          <Card>
            <CardContent className="p-6">
              {renderBreadcrumb()}
              {renderPosProgress()}
              <h2 className="text-lg font-medium text-foreground mb-1">¿Qué tocamos en Edit Vendor?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona los campos que editaste o verificaste. Puedes elegir varios.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vboPosEditOptions.map(attr => {
                  const isSelected = posData.edits.includes(attr.label);
                  return (
                    <button
                      key={attr.id}
                      className={`text-left p-3.5 rounded-md border transition-all text-sm ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/5'
                      }`}
                      onClick={() => {
                        setPosData(prev => {
                          const edits = prev.edits.includes(attr.label)
                            ? prev.edits.filter(a => a !== attr.label)
                            : [...prev.edits, attr.label];
                          return { ...prev, edits };
                        });
                      }}
                    >
                      <span className="mr-2">{isSelected ? '✅' : '☐'}</span>
                      {attr.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-border mt-6">
                <Button variant="ghost" onClick={goBack}>← Volver</Button>
                <Button onClick={goNext}>Continuar →</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Fallback
  return null;
}
