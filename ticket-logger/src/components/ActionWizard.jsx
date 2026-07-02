import React, { useState } from 'react';
import {
  boSections, catalogTabs, catalogEntities, catalogEntityActions,
  configSections, cargaSections, itemsEliminadosEntities, boSearchOptions,
  editarPerfilOptions
} from '../data/actionTree';
import {
  vboMainMenu, vboVendorManagementMenu, vboVendorSearchOptions,
  vboDefaultAttributes, vboVerticals, vboIntegrationTypes, vboCountries,
  vboPosSearchOptions, vboPosEditOptions
} from '../data/vboActionTree';

/*
  Phase flow:
    TOOL              → Pick BO or VBO
    --- BO ---
    SEARCH            → How did you find the partner? (BO only)
    BO_SECTION        → Catálogo / Editar Perfil / Pedidos
    BO_EDITAR_PERFIL  → Seleccionar menú / Crear nuevo menú
    CAT_TAB           → Which tab in Catálogo?
    CAT_ENTITY        → Sequential: Sección → Producto → Grupo → Opcionales
    CAT_CONFIG        → Pick config sub-section
    CAT_CONFIG_OPT    → Pick option within config sub-section
    CAT_CARGA         → Pick carga sub-section
    CAT_CARGA_OPT     → Pick option within carga sub-section
    CAT_ITEMS_ELIM    → Which entity did we search for?
    --- VBO ---
    VBO_MAIN          → Vendor Management / DMS / Go Account
    VBO_VM_SECTION    → Vendors / POS Integrations
    VBO_VENDOR_WIZARD → Sequential form: search → country → attributes → vertical → integration → linked → auto-accept
*/

const TOOLS = [
  { id: 'bo', label: 'Backoffice', icon: '🖥️', desc: 'Gestión de catálogo, pedidos y perfiles' },
  { id: 'vendor_bo', label: 'Vendor US Back Office', icon: '🔧', desc: 'Configuración e integración POS' },
];

// Steps for the VBO Vendor Wizard
const VENDOR_STEPS = [
  { id: 'search', label: 'Búsqueda' },
  { id: 'country', label: 'País' },
  { id: 'attributes', label: 'Default Attributes' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'integration', label: 'Tipo Integración' },
  { id: 'linked', label: 'Linked Vendors' },
  { id: 'linked_count', label: 'Cantidad', conditional: true },
  { id: 'auto_accept', label: 'Auto Accept' },
];

// Steps for the VBO POS Integrations Wizard
const POS_STEPS = [
  { id: 'search', label: 'Búsqueda' },
  { id: 'edit', label: 'Edit Vendor' },
];

function ActionWizard({ onComplete }) {
  const [phase, setPhase] = useState('TOOL');
  const [selectedToolId, setSelectedToolId] = useState(null);
  const [selectedToolLabel, setSelectedToolLabel] = useState(null);
  const [actions, setActions] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);

  // Catalog entity sequential state
  const [entityIndex, setEntityIndex] = useState(0);

  // Config / Carga sub-section state
  const [selectedSubSection, setSelectedSubSection] = useState(null);

  // VBO Vendor Wizard state
  const [vendorStep, setVendorStep] = useState(0);
  const [vendorData, setVendorData] = useState({
    search: '',
    country: '',
    attributes: [],
    vertical: '',
    integration: '',
    linked: '',
    linkedCount: '',
    autoAccept: '',
  });

  // VBO POS Wizard state
  const [posStep, setPosStep] = useState(0);
  const [posData, setPosData] = useState({
    search: '',
    edits: [],
  });

  // Helper to add an action
  const addAction = (label, tool, toolId) => {
    setActions(prev => [...prev, { tool: tool || selectedToolLabel, toolId: toolId || selectedToolId, label }]);
  };

  const removeAction = (index) => {
    setActions(prev => prev.filter((_, i) => i !== index));
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderBreadcrumb = () => {
    if (breadcrumb.length === 0) return null;
    return (
      <div className="breadcrumb">
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="separator">›</span>}
            <span className={`crumb ${i === breadcrumb.length - 1 ? 'active' : ''}`}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderTimeline = () => {
    if (actions.length === 0) return null;
    return (
      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="actions-timeline">
          {actions.map((act, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-number">{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div className="timeline-content">{act.label}</div>
                <div className="timeline-tool">{act.tool}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  className="btn-ghost"
                  onClick={() => removeAction(i)}
                  title="Eliminar acción"
                  style={{ padding: '8px' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOptions = (options, onClick, cols) => (
    <div className="options-grid" style={cols ? { gridTemplateColumns: `repeat(${cols}, 1fr)` } : {}}>
      {options.map(opt => (
        <button
          key={opt.id || opt.label || opt}
          className={`option-btn ${opt.isSkip ? 'option-skip' : ''}`}
          onClick={() => onClick(opt)}
        >
          {opt.icon && <span className="option-icon">{opt.icon}</span>}
          {opt.label || opt}
        </button>
      ))}
    </div>
  );

  const renderBackAndFinish = (onBack) => (
    <div className="wizard-actions">
      <div className="action-group">
        {onBack && (
          <button className="btn-ghost" onClick={onBack}>← Volver</button>
        )}
      </div>
      <div className="action-group">
        {actions.length > 0 && (
          <button className="btn-success" onClick={() => onComplete(actions)}>
            ✅ Finalizar Ticket
          </button>
        )}
      </div>
    </div>
  );

  // ============================================
  // VBO Vendor Wizard: build final summary string
  // ============================================
  const finalizeVendorWizard = (data) => {
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

  // ============================================
  // VBO Vendor Wizard: progress bar
  // ============================================
  const renderVendorProgress = () => {
    const visibleSteps = VENDOR_STEPS.filter(s => {
      if (s.id === 'linked_count') return vendorData.linked === 'Sí';
      return true;
    });
    const currentStepId = VENDOR_STEPS[vendorStep]?.id;
    const currentVisibleIdx = visibleSteps.findIndex(s => s.id === currentStepId);

    return (
      <div className="entity-progress">
        {visibleSteps.map((step, i) => (
          <div
            key={step.id}
            className={`entity-dot ${i < currentVisibleIdx ? 'done' : ''} ${i === currentVisibleIdx ? 'current' : ''}`}
          >
            {i < currentVisibleIdx ? '✅' : i === currentVisibleIdx ? '📍' : '○'}
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // ============================================
  // VBO POS Wizard: build final summary string
  // ============================================
  const finalizePosWizard = (data) => {
    const parts = ['Vendor Management → POS Integrations'];
    parts.push(`Búsqueda: ${data.search}`);
    if (data.edits.length > 0) {
      parts.push(`Editó: ${data.edits.join(', ')}`);
    } else {
      parts.push('Editó: Nada (Solo visualizó)');
    }
    addAction(parts.join(' → '));
  };

  // ============================================
  // VBO POS Wizard: progress bar
  // ============================================
  const renderPosProgress = () => {
    return (
      <div className="entity-progress">
        {POS_STEPS.map((step, i) => (
          <div
            key={step.id}
            className={`entity-dot ${i < posStep ? 'done' : ''} ${i === posStep ? 'current' : ''}`}
          >
            {i < posStep ? '✅' : i === posStep ? '📍' : '○'}
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // ============================================
  // PHASE: TOOL
  // ============================================
  if (phase === 'TOOL') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          <h2 className="wizard-question">
            {actions.length === 0 ? '¿Qué fue lo primero que hiciste?' : '¿Qué herramienta accionamos ahora?'}
          </h2>
          <p className="text-muted text-sm" style={{ marginBottom: '20px' }}>
            Selecciona la herramienta donde realizaste la gestión
          </p>
          <div className="options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                className="option-btn option-btn-large"
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
                <span className="option-icon-large">{tool.icon}</span>
                <strong>{tool.label}</strong>
                <span className="text-muted text-sm">{tool.desc}</span>
              </button>
            ))}
          </div>
          {renderBackAndFinish(null)}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: SEARCH (BO only)
  // ============================================
  if (phase === 'SEARCH') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Cómo encontramos al partner?</h2>
          {renderOptions(boSearchOptions, (opt) => {
            addAction(`Ingreso a ${selectedToolLabel} → Búsqueda: ${opt.label}`);
            setBreadcrumb([selectedToolLabel]);
            setPhase('BO_SECTION');
          })}
          {renderBackAndFinish(() => { setPhase('TOOL'); setBreadcrumb([]); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: BO_SECTION
  // ============================================
  if (phase === 'BO_SECTION') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué gestión realizamos en Backoffice?</h2>
          {renderOptions(boSections, (opt) => {
            if (opt.id === 'catalogo') {
              setBreadcrumb([selectedToolLabel, 'Catálogo']);
              setPhase('CAT_TAB');
            } else if (opt.id === 'editar_perfil') {
              setBreadcrumb([selectedToolLabel, 'Editar Perfil']);
              setPhase('BO_EDITAR_PERFIL');
            } else if (opt.id === 'pedidos') {
              addAction('Pedidos');
              setBreadcrumb([selectedToolLabel]);
            }
          })}
          <div className="wizard-actions">
            <div className="action-group">
              <button className="btn-ghost" onClick={() => { setBreadcrumb([]); setPhase('TOOL'); }}>
                ← Cambiar Herramienta
              </button>
            </div>
            <div className="action-group">
              {actions.length > 0 && (
                <button className="btn-success" onClick={() => onComplete(actions)}>
                  ✅ Finalizar Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: BO_EDITAR_PERFIL
  // ============================================
  if (phase === 'BO_EDITAR_PERFIL') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué gestión realizamos en el menú?</h2>
          {renderOptions(editarPerfilOptions, (opt) => {
            addAction(`Editar Perfil → ${opt.label}`);
            setBreadcrumb([selectedToolLabel]);
            setPhase('BO_SECTION');
          })}
          {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel]); setPhase('BO_SECTION'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_TAB — Sub-tabs within Catálogo
  // ============================================
  if (phase === 'CAT_TAB') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿En qué pestaña de Catálogo trabajamos?</h2>
          {renderOptions(catalogTabs, (opt) => {
            setBreadcrumb([selectedToolLabel, 'Catálogo', opt.label]);
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
              setBreadcrumb([selectedToolLabel, 'Catálogo']);
            }
          })}
          {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel]); setPhase('BO_SECTION'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_ENTITY — Sequential entity flow
  // ============================================
  if (phase === 'CAT_ENTITY') {
    const entity = catalogEntities[entityIndex];
    if (!entity) {
      setBreadcrumb([selectedToolLabel, 'Catálogo']);
      setPhase('CAT_TAB');
      return null;
    }
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">
            {entity.icon} {entity.label}: ¿Qué realizamos?
          </h2>
          <p className="text-muted text-sm" style={{ marginBottom: '16px' }}>
            Entidad {entityIndex + 1} de {catalogEntities.length}
          </p>
          <div className="entity-progress">
            {catalogEntities.map((e, i) => (
              <div key={e.id} className={`entity-dot ${i < entityIndex ? 'done' : ''} ${i === entityIndex ? 'current' : ''}`}>
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
              setBreadcrumb([selectedToolLabel, 'Catálogo', 'Editor', catalogEntities[nextIdx].label]);
            } else {
              setBreadcrumb([selectedToolLabel, 'Catálogo']);
              setPhase('CAT_TAB');
            }
          })}
          {renderBackAndFinish(() => {
            if (entityIndex > 0) {
              setEntityIndex(entityIndex - 1);
              setBreadcrumb([selectedToolLabel, 'Catálogo', 'Editor', catalogEntities[entityIndex - 1].label]);
            } else {
              setBreadcrumb([selectedToolLabel, 'Catálogo']);
              setPhase('CAT_TAB');
            }
          })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_CONFIG
  // ============================================
  if (phase === 'CAT_CONFIG') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué sección de Configuración elegiste?</h2>
          {renderOptions(configSections, (opt) => {
            setSelectedSubSection(opt);
            setBreadcrumb([selectedToolLabel, 'Catálogo', 'Configuración', opt.label]);
            setPhase('CAT_CONFIG_OPT');
          })}
          {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel, 'Catálogo']); setPhase('CAT_TAB'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_CONFIG_OPT
  // ============================================
  if (phase === 'CAT_CONFIG_OPT' && selectedSubSection) {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">{selectedSubSection.question}</h2>
          {renderOptions(selectedSubSection.options, (opt) => {
            addAction(`Catálogo → Configuración → ${selectedSubSection.label} → ${opt.label}`);
            setSelectedSubSection(null);
            setBreadcrumb([selectedToolLabel, 'Catálogo', 'Configuración']);
            setPhase('CAT_CONFIG');
          })}
          {renderBackAndFinish(() => {
            setSelectedSubSection(null);
            setBreadcrumb([selectedToolLabel, 'Catálogo', 'Configuración']);
            setPhase('CAT_CONFIG');
          })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_CARGA
  // ============================================
  if (phase === 'CAT_CARGA') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué apartado de Carga de archivos elegiste?</h2>
          {renderOptions(cargaSections, (opt) => {
            setSelectedSubSection(opt);
            setBreadcrumb([selectedToolLabel, 'Catálogo', 'Carga de archivos', opt.label]);
            setPhase('CAT_CARGA_OPT');
          })}
          {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel, 'Catálogo']); setPhase('CAT_TAB'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_CARGA_OPT
  // ============================================
  if (phase === 'CAT_CARGA_OPT' && selectedSubSection) {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">{selectedSubSection.question}</h2>
          {renderOptions(selectedSubSection.options, (opt) => {
            addAction(`Catálogo → Carga de archivos → ${selectedSubSection.label} → ${opt.label}`);
            setSelectedSubSection(null);
            setBreadcrumb([selectedToolLabel, 'Catálogo', 'Carga de archivos']);
            setPhase('CAT_CARGA');
          })}
          {renderBackAndFinish(() => {
            setSelectedSubSection(null);
            setBreadcrumb([selectedToolLabel, 'Catálogo', 'Carga de archivos']);
            setPhase('CAT_CARGA');
          })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: CAT_ITEMS_ELIM
  // ============================================
  if (phase === 'CAT_ITEMS_ELIM') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué entidad logramos buscar en Items Eliminados?</h2>
          {renderOptions(itemsEliminadosEntities, (opt) => {
            addAction(`Catálogo → Items Eliminados → ${opt.label}`);
            setBreadcrumb([selectedToolLabel, 'Catálogo']);
            setPhase('CAT_TAB');
          })}
          {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel, 'Catálogo']); setPhase('CAT_TAB'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: VBO_MAIN — Vendor Management / DMS / Go Account
  // ============================================
  if (phase === 'VBO_MAIN') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué herramienta escogimos en VBO?</h2>
          {renderOptions(vboMainMenu, (opt) => {
            setBreadcrumb([selectedToolLabel, opt.label]);
            if (opt.id === 'vendor_management') {
              setPhase('VBO_VM_SECTION');
            } else {
              // DMS and Go Account — log directly for now
              addAction(opt.label);
              setBreadcrumb([selectedToolLabel]);
            }
          })}
          {renderBackAndFinish(() => { setBreadcrumb([]); setPhase('TOOL'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: VBO_VM_SECTION — Vendors / POS Integrations
  // ============================================
  if (phase === 'VBO_VM_SECTION') {
    return (
      <div className="fade-in">
        {renderTimeline()}
        <div className="panel">
          {renderBreadcrumb()}
          <h2 className="wizard-question">¿Qué apartado escogimos?</h2>
          {renderOptions(vboVendorManagementMenu, (opt) => {
            setBreadcrumb([selectedToolLabel, 'Vendor Management', opt.label]);
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
          {renderBackAndFinish(() => { setBreadcrumb([selectedToolLabel]); setPhase('VBO_MAIN'); })}
        </div>
      </div>
    );
  }

  // ============================================
  // PHASE: VBO_VENDOR_WIZARD — Sequential Vendor Form
  // ============================================
  if (phase === 'VBO_VENDOR_WIZARD') {
    const stepId = VENDOR_STEPS[vendorStep]?.id;

    const goBack = () => {
      if (vendorStep > 0) {
        let prevStep = vendorStep - 1;
        // Skip linked_count going back if linked is not Sí
        if (VENDOR_STEPS[prevStep]?.id === 'linked_count' && vendorData.linked !== 'Sí') {
          prevStep--;
        }
        setVendorStep(prevStep);
      } else {
        setBreadcrumb([selectedToolLabel, 'Vendor Management']);
        setPhase('VBO_VM_SECTION');
      }
    };

    const goNext = () => {
      let nextStep = vendorStep + 1;
      // Skip linked_count if linked is No
      if (VENDOR_STEPS[nextStep]?.id === 'linked_count' && vendorData.linked !== 'Sí') {
        nextStep++;
      }
      if (nextStep >= VENDOR_STEPS.length) {
        // Finalize
        finalizeVendorWizard(vendorData);
        setBreadcrumb([selectedToolLabel]);
        setPhase('VBO_MAIN');
      } else {
        setVendorStep(nextStep);
      }
    };

    // --- Step: SEARCH ---
    if (stepId === 'search') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">¿Cómo buscamos al partner?</h2>
            {renderOptions(vboVendorSearchOptions, (opt) => {
              setVendorData(prev => ({ ...prev, search: opt.label }));
              goNext();
            })}
            {renderBackAndFinish(goBack)}
          </div>
        </div>
      );
    }

    // --- Step: COUNTRY ---
    if (stepId === 'country') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">¿Qué país escogimos?</h2>
            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {vboCountries.map(country => (
                <button
                  key={country}
                  className="option-btn"
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
          </div>
        </div>
      );
    }

    // --- Step: DEFAULT ATTRIBUTES ---
    if (stepId === 'attributes') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">Default Attributes: ¿Qué validamos?</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '16px' }}>
              Selecciona los campos que validaste. Puedes elegir varios.
            </p>
            <div className="options-grid">
              {vboDefaultAttributes.map(attr => {
                const isSelected = vendorData.attributes.includes(attr.label);
                return (
                  <button
                    key={attr.id}
                    className={`option-btn ${isSelected ? 'option-btn-selected' : ''}`}
                    onClick={() => {
                      setVendorData(prev => {
                        const attrs = prev.attributes.includes(attr.label)
                          ? prev.attributes.filter(a => a !== attr.label)
                          : [...prev.attributes, attr.label];
                        return { ...prev, attributes: attrs };
                      });
                    }}
                  >
                    <span className="option-icon">{isSelected ? '✅' : '☐'}</span>
                    {attr.label}
                  </button>
                );
              })}
            </div>
            <div className="wizard-actions" style={{ marginTop: '20px' }}>
              <div className="action-group">
                <button className="btn-ghost" onClick={goBack}>← Volver</button>
              </div>
              <div className="action-group">
                <button className="btn-primary" onClick={goNext}>
                  Continuar →
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- Step: VERTICAL ---
    if (stepId === 'vertical') {
      const verticalOptions = vboVerticals.map(v => ({ id: v, label: v }));
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">¿Qué Vertical tiene el vendor?</h2>
            {renderOptions(verticalOptions, (opt) => {
              setVendorData(prev => ({ ...prev, vertical: opt.label }));
              goNext();
            })}
            {renderBackAndFinish(goBack)}
          </div>
        </div>
      );
    }

    // --- Step: INTEGRATION TYPE ---
    if (stepId === 'integration') {
      const integrationOptions = vboIntegrationTypes.map(t => ({ id: t, label: t }));
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">¿Qué tipo de integración tiene?</h2>
            {renderOptions(integrationOptions, (opt) => {
              setVendorData(prev => ({ ...prev, integration: opt.label }));
              goNext();
            })}
            {renderBackAndFinish(goBack)}
          </div>
        </div>
      );
    }

    // --- Step: LINKED VENDORS ---
    if (stepId === 'linked') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">Linked Vendors: ¿Está unificado por SR con otras tiendas?</h2>
            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button
                className="option-btn option-btn-large"
                onClick={() => {
                  setVendorData(prev => ({ ...prev, linked: 'Sí' }));
                  goNext();
                }}
              >
                <span className="option-icon-large">✅</span>
                <strong>Sí</strong>
              </button>
              <button
                className="option-btn option-btn-large"
                onClick={() => {
                  setVendorData(prev => ({ ...prev, linked: 'No', linkedCount: '' }));
                  // Skip linked_count
                  let next = vendorStep + 1;
                  if (VENDOR_STEPS[next]?.id === 'linked_count') next++;
                  if (next >= VENDOR_STEPS.length) {
                    const newData = { ...vendorData, linked: 'No', linkedCount: '' };
                    finalizeVendorWizard(newData);
                    setBreadcrumb([selectedToolLabel]);
                    setPhase('VBO_MAIN');
                  } else {
                    setVendorStep(next);
                  }
                }}
              >
                <span className="option-icon-large">❌</span>
                <strong>No</strong>
              </button>
            </div>
            {renderBackAndFinish(goBack)}
          </div>
        </div>
      );
    }

    // --- Step: LINKED COUNT ---
    if (stepId === 'linked_count') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">¿Con cuántas tiendas está unificado?</h2>
            <div className="input-group" style={{ maxWidth: '300px', marginBottom: '20px' }}>
              <label htmlFor="linkedCount">Cantidad de tiendas</label>
              <input
                type="number"
                id="linkedCount"
                min="1"
                value={vendorData.linkedCount}
                onChange={(e) => setVendorData(prev => ({ ...prev, linkedCount: e.target.value }))}
                placeholder="Ej. 3"
                autoFocus
              />
            </div>
            <div className="wizard-actions">
              <div className="action-group">
                <button className="btn-ghost" onClick={goBack}>← Volver</button>
              </div>
              <div className="action-group">
                <button
                  className="btn-primary"
                  disabled={!vendorData.linkedCount}
                  onClick={goNext}
                >
                  Continuar →
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // --- Step: AUTO ACCEPT ORDERS ---
    if (stepId === 'auto_accept') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderVendorProgress()}
            <h2 className="wizard-question">Custom Attributes: Auto Accept Orders</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '16px' }}>
              ¿Está encendido o apagado?
            </p>
            <div className="options-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button
                className="option-btn option-btn-large"
                onClick={() => {
                  const newData = { ...vendorData, autoAccept: 'Encendido' };
                  setVendorData(newData);
                  finalizeVendorWizard(newData);
                  setBreadcrumb([selectedToolLabel]);
                  setPhase('VBO_MAIN');
                }}
              >
                <span className="option-icon-large">🟢</span>
                <strong>Encendido</strong>
              </button>
              <button
                className="option-btn option-btn-large"
                onClick={() => {
                  const newData = { ...vendorData, autoAccept: 'Apagado' };
                  setVendorData(newData);
                  finalizeVendorWizard(newData);
                  setBreadcrumb([selectedToolLabel]);
                  setPhase('VBO_MAIN');
                }}
              >
                <span className="option-icon-large">🔴</span>
                <strong>Apagado</strong>
              </button>
            </div>
            {renderBackAndFinish(goBack)}
          </div>
        </div>
      );
    }
  }

  // ============================================
  // PHASE: VBO_POS_WIZARD — Sequential POS Integrations Form
  // ============================================
  if (phase === 'VBO_POS_WIZARD') {
    const stepId = POS_STEPS[posStep]?.id;

    const goBack = () => {
      if (posStep > 0) {
        setPosStep(posStep - 1);
      } else {
        setBreadcrumb([selectedToolLabel, 'Vendor Management']);
        setPhase('VBO_VM_SECTION');
      }
    };

    const goNext = () => {
      let nextStep = posStep + 1;
      if (nextStep >= POS_STEPS.length) {
        finalizePosWizard(posData);
        setBreadcrumb([selectedToolLabel]);
        setPhase('VBO_MAIN');
      } else {
        setPosStep(nextStep);
      }
    };

    // --- Step: SEARCH ---
    if (stepId === 'search') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderPosProgress()}
            <h2 className="wizard-question">¿Cómo encontramos al partner?</h2>
            {renderOptions(vboPosSearchOptions, (opt) => {
              setPosData(prev => ({ ...prev, search: opt.label }));
              goNext();
            })}
            {renderBackAndFinish(goBack)}
          </div>
        </div>
      );
    }

    // --- Step: EDIT ---
    if (stepId === 'edit') {
      return (
        <div className="fade-in">
          {renderTimeline()}
          <div className="panel">
            {renderBreadcrumb()}
            {renderPosProgress()}
            <h2 className="wizard-question">¿Qué tocamos en Edit Vendor?</h2>
            <p className="text-muted text-sm" style={{ marginBottom: '16px' }}>
              Selecciona los campos que editaste o verificaste. Puedes elegir varios.
            </p>
            <div className="options-grid">
              {vboPosEditOptions.map(attr => {
                const isSelected = posData.edits.includes(attr.label);
                return (
                  <button
                    key={attr.id}
                    className={`option-btn ${isSelected ? 'option-btn-selected' : ''}`}
                    onClick={() => {
                      setPosData(prev => {
                        const edits = prev.edits.includes(attr.label)
                          ? prev.edits.filter(a => a !== attr.label)
                          : [...prev.edits, attr.label];
                        return { ...prev, edits };
                      });
                    }}
                  >
                    <span className="option-icon">{isSelected ? '✅' : '☐'}</span>
                    {attr.label}
                  </button>
                );
              })}
            </div>
            <div className="wizard-actions" style={{ marginTop: '20px' }}>
              <div className="action-group">
                <button className="btn-ghost" onClick={goBack}>← Volver</button>
              </div>
              <div className="action-group">
                <button className="btn-primary" onClick={goNext}>
                  Continuar →
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Fallback
  return null;
}

export default ActionWizard;
