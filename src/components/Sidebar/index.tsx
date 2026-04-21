import React from 'react';
import { useDragDrop } from '../../hooks';
import { useWorkflowStore } from '../../store/workflowStore';
import { useSimulation } from '../../hooks';
import { useValidation } from '../../hooks';
import { WORKFLOW_TEMPLATES } from '../../utils/templates';

const NODE_ITEMS = [
  { type: 'start', label: 'Start', desc: 'Entry point', color: '#22c55e', icon: '▶' },
  { type: 'task', label: 'Task', desc: 'Human task', color: '#3b82f6', icon: '📋' },
  { type: 'approval', label: 'Approval', desc: 'Approval step', color: '#f59e0b', icon: '✓' },
  { type: 'automated', label: 'Automated', desc: 'System action', color: '#8b5cf6', icon: '⚡' },
  { type: 'end', label: 'End', desc: 'Completion', color: '#ef4444', icon: '⚑' },
];

export const Sidebar: React.FC = () => {
  const { onDragStart } = useDragDrop();
  const { toggleSandbox, exportWorkflow, importWorkflow, nodes, setNodes, setEdges, selectNode } = useWorkflowStore();
  const { run, isSimulating } = useSimulation();
  const { validate } = useValidation();
  const errors = useWorkflowStore((s) => s.validationErrors);

  const loadTemplate = (templateName: string) => {
    const tpl = WORKFLOW_TEMPLATES.find(t => t.name === templateName);
    if (!tpl) return;
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    selectNode(null);
  };

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => importWorkflow(ev.target?.result as string);
      reader.readAsText(file);
    };
    input.click();
  };

  const handleRunTest = () => {
    validate();
    toggleSandbox();
    run();
  };

  return (
    <div style={{
      width: 220,
      background: '#0f1117',
      borderRight: '1px solid #1e2130',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #1e2130' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#6366f1', letterSpacing: '0.15em' }}>
          TREDENCE
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginTop: 2 }}>
          Workflow Designer
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {/* Node Palette */}
        <div style={{ padding: '0 12px', marginBottom: 4 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>
            NODES
          </div>
          {NODE_ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                marginBottom: 4,
                background: '#1a1d2e',
                border: '1px solid #2d3048',
                borderRadius: 8,
                cursor: 'grab',
                transition: 'all 0.15s',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = item.color;
                (e.currentTarget as HTMLDivElement).style.background = `${item.color}11`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#2d3048';
                (e.currentTarget as HTMLDivElement).style.background = '#1a1d2e';
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: `${item.color}22`, border: `1px solid ${item.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Sans, sans-serif' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div style={{ padding: '8px 12px', marginTop: 4, borderTop: '1px solid #1e2130' }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>
            TEMPLATES
          </div>
          {WORKFLOW_TEMPLATES.map((t) => (
            <div
              key={t.name}
              onClick={() => loadTemplate(t.name)}
              style={{
                padding: '7px 10px',
                marginBottom: 4,
                background: '#1a1d2e',
                border: '1px solid #2d3048',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f1';
                (e.currentTarget as HTMLDivElement).style.background = '#6366f111';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#2d3048';
                (e.currentTarget as HTMLDivElement).style.background = '#1a1d2e';
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: '#475569', fontFamily: 'DM Sans, sans-serif' }}>{t.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 9, color: '#334155', fontFamily: 'Space Mono, monospace' }}>LOAD</div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div style={{ padding: '8px 12px', background: '#1a0a0a', borderTop: '1px solid #3f1010' }}>
          {errors.slice(0, 2).map((e, i) => (
            <div key={i} style={{ fontSize: 10, color: '#f87171', fontFamily: 'DM Sans, sans-serif', marginBottom: 2 }}>
              {e.severity === 'error' ? '✕' : '⚠'} {e.message}
            </div>
          ))}
          {errors.length > 2 && (
            <div style={{ fontSize: 10, color: '#64748b' }}>+{errors.length - 2} more</div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: 12, borderTop: '1px solid #1e2130', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          onClick={handleRunTest}
          disabled={isSimulating || nodes.length === 0}
          style={{
            padding: '9px 12px',
            background: isSimulating ? '#1e2130' : '#6366f1',
            color: isSimulating ? '#475569' : '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: isSimulating || nodes.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: 12,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 600,
            transition: 'all 0.15s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {isSimulating ? '⏳ Running...' : '▶ Run Simulation'}
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleExport}
            style={{
              flex: 1, padding: '7px 4px',
              background: '#1a1d2e', color: '#94a3b8',
              border: '1px solid #2d3048', borderRadius: 8,
              cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans, sans-serif',
            }}
          >
            ↓ Export
          </button>
          <button
            onClick={handleImport}
            style={{
              flex: 1, padding: '7px 4px',
              background: '#1a1d2e', color: '#94a3b8',
              border: '1px solid #2d3048', borderRadius: 8,
              cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans, sans-serif',
            }}
          >
            ↑ Import
          </button>
        </div>
      </div>
    </div>
  );
};
