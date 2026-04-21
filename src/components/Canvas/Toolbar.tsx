import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useValidation } from '../../hooks';

export const Toolbar: React.FC = () => {
  const { nodes, edges, validationErrors, isSandboxOpen, toggleSandbox } = useWorkflowStore();
  const { validate } = useValidation();

  const errCount = validationErrors.filter(e => e.severity === 'error').length;
  const warnCount = validationErrors.filter(e => e.severity === 'warning').length;

  React.useEffect(() => {
    if (nodes.length > 0) validate();
  }, [nodes.length, edges.length]);

  return (
    <div style={{
      height: 44,
      background: '#0f1117',
      borderBottom: '1px solid #1e2130',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 16,
      flexShrink: 0,
    }}>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Stat label="Nodes" value={nodes.length} color="#94a3b8" />
        <Stat label="Edges" value={edges.length} color="#94a3b8" />
      </div>

      <div style={{ flex: 1 }} />

      {/* Validation status */}
      {nodes.length > 0 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {errCount > 0 && (
            <Badge color="#ef4444" bg="#1a0a0a" border="#3f1010">
              ✕ {errCount} error{errCount > 1 ? 's' : ''}
            </Badge>
          )}
          {warnCount > 0 && (
            <Badge color="#f59e0b" bg="#1a0f00" border="#3f2a00">
              ⚠ {warnCount} warning{warnCount > 1 ? 's' : ''}
            </Badge>
          )}
          {errCount === 0 && warnCount === 0 && nodes.length > 0 && (
            <Badge color="#22c55e" bg="#0a1f0a" border="#166534">
              ✓ Valid
            </Badge>
          )}
        </div>
      )}

      {/* Sandbox toggle */}
      <button
        onClick={toggleSandbox}
        style={{
          padding: '5px 12px',
          background: isSandboxOpen ? '#1a1d2e' : 'transparent',
          border: `1px solid ${isSandboxOpen ? '#6366f1' : '#2d3048'}`,
          borderRadius: 6,
          color: isSandboxOpen ? '#a5b4fc' : '#475569',
          cursor: 'pointer',
          fontSize: 11,
          fontFamily: 'Space Mono, monospace',
          letterSpacing: '0.05em',
          transition: 'all 0.15s',
        }}
      >
        {isSandboxOpen ? '▼ SANDBOX' : '▶ SANDBOX'}
      </button>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    <span style={{ fontSize: 10, color: '#334155', fontFamily: 'Space Mono, monospace' }}>{label}</span>
    <span style={{ fontSize: 12, color, fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>{value}</span>
  </div>
);

const Badge: React.FC<{ color: string; bg: string; border: string; children: React.ReactNode }> = ({
  color, bg, border, children,
}) => (
  <div style={{
    padding: '3px 8px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 4,
    fontSize: 10,
    color,
    fontFamily: 'DM Sans, sans-serif',
    fontWeight: 500,
  }}>
    {children}
  </div>
);
