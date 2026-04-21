import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';

const STATUS_COLOR: Record<string, string> = {
  success: '#22c55e',
  error: '#ef4444',
  running: '#f59e0b',
  pending: '#475569',
};

const TYPE_ICON: Record<string, string> = {
  start: '▶',
  task: '📋',
  approval: '✓',
  automated: '⚡',
  end: '⚑',
};

export const SandboxPanel: React.FC = () => {
  const { simulationResult, isSimulating, isSandboxOpen, toggleSandbox, nodes, edges } = useWorkflowStore();

  if (!isSandboxOpen) return null;

  const workflowJson = JSON.stringify({ nodes: nodes.length, edges: edges.length }, null, 2);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 220,
      right: simulationResult ? 260 : 0,
      background: '#0a0c12',
      borderTop: '1px solid #1e2130',
      zIndex: 100,
      maxHeight: '40vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid #1e2130',
        background: '#0f1117',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: isSimulating ? '#f59e0b' : simulationResult?.success ? '#22c55e' : simulationResult ? '#ef4444' : '#475569' }} />
          <span style={{ fontSize: 12, fontFamily: 'Space Mono, monospace', color: '#94a3b8', letterSpacing: '0.05em' }}>
            SIMULATION SANDBOX
          </span>
          {isSimulating && (
            <span style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'DM Sans, sans-serif', animation: 'pulse 1s infinite' }}>
              Running...
            </span>
          )}
        </div>
        <button
          onClick={toggleSandbox}
          style={{
            background: 'transparent', border: 'none',
            color: '#475569', cursor: 'pointer', fontSize: 16,
          }}
        >×</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', gap: 16 }}>

        {/* Workflow info */}
        <div style={{ width: 160, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: '#475569', marginBottom: 8 }}>
            GRAPH SUMMARY
          </div>
          <div style={{ background: '#1a1d2e', borderRadius: 8, padding: 10, border: '1px solid #2d3048' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'DM Sans, sans-serif', marginBottom: 4 }}>
              {nodes.length} nodes · {edges.length} edges
            </div>
            <pre style={{ fontSize: 10, color: '#475569', fontFamily: 'Space Mono, monospace', margin: 0 }}>
              {workflowJson}
            </pre>
          </div>
        </div>

        {/* Execution log */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color: '#475569', marginBottom: 8 }}>
            EXECUTION LOG
          </div>

          {isSimulating && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12 }}>
              <div style={{
                width: 16, height: 16, border: '2px solid #6366f1',
                borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'DM Sans, sans-serif' }}>
                Simulating workflow execution...
              </span>
            </div>
          )}

          {simulationResult && !isSimulating && (
            <>
              {simulationResult.errors.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  {simulationResult.errors.map((err, i) => (
                    <div key={i} style={{
                      padding: '6px 10px', background: '#1a0a0a',
                      border: '1px solid #3f1010', borderRadius: 6, marginBottom: 4,
                      fontSize: 11, color: '#f87171', fontFamily: 'DM Sans, sans-serif',
                      display: 'flex', gap: 6,
                    }}>
                      <span>✕</span>{err}
                    </div>
                  ))}
                </div>
              )}

              {simulationResult.steps.map((step, i) => (
                <div key={step.nodeId} style={{
                  display: 'flex', gap: 10, marginBottom: 8,
                  padding: '8px 10px',
                  background: '#1a1d2e',
                  border: `1px solid ${STATUS_COLOR[step.status]}33`,
                  borderRadius: 8,
                  animation: `fadeIn 0.3s ease ${i * 0.08}s both`,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: `${STATUS_COLOR[step.status]}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, flexShrink: 0,
                  }}>
                    {TYPE_ICON[step.nodeType]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                        {step.title}
                      </span>
                      <span style={{
                        fontSize: 9, fontFamily: 'Space Mono, monospace',
                        color: STATUS_COLOR[step.status], letterSpacing: '0.05em',
                      }}>
                        {step.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'DM Sans, sans-serif', marginTop: 2 }}>
                      {step.message}
                    </div>
                  </div>
                </div>
              ))}

              {simulationResult.success && simulationResult.steps.length > 0 && (
                <div style={{
                  padding: '8px 12px', background: '#0a1f0a',
                  border: '1px solid #166534', borderRadius: 8,
                  fontSize: 12, color: '#4ade80', fontFamily: 'DM Sans, sans-serif',
                  display: 'flex', gap: 6, alignItems: 'center',
                }}>
                  ✓ Workflow simulation completed successfully in {simulationResult.steps.length} steps.
                </div>
              )}
            </>
          )}

          {!simulationResult && !isSimulating && (
            <div style={{ fontSize: 12, color: '#334155', fontFamily: 'DM Sans, sans-serif', padding: '8px 0' }}>
              Run a simulation to see execution results here.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};
