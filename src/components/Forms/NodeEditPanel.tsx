import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { automationsApi } from '../../api/mockApi';
import type {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  KeyValuePair,
  AutomationAction,
} from '../../types';

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontFamily: 'Space Mono, monospace',
  color: '#475569',
  letterSpacing: '0.08em',
  marginBottom: 4,
  display: 'block',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  background: '#0f1117',
  border: '1px solid #2d3048',
  borderRadius: 6,
  color: '#e2e8f0',
  fontSize: 12,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
};

const fieldGroup: React.CSSProperties = { marginBottom: 14 };

// Reusable KV Editor
const KVEditor: React.FC<{
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
}> = ({ pairs, onChange }) => {
  const add = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i: number, field: 'key' | 'value', val: string) =>
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));

  return (
    <div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="key"
            value={p.key}
            onChange={(e) => update(i, 'key', e.target.value)}
          />
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="value"
            value={p.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button
            onClick={() => remove(i)}
            style={{
              background: '#1a1d2e', border: '1px solid #2d3048', borderRadius: 6,
              color: '#ef4444', cursor: 'pointer', padding: '0 8px', fontSize: 14,
            }}
          >×</button>
        </div>
      ))}
      <button
        onClick={add}
        style={{
          background: 'transparent', border: '1px dashed #2d3048', borderRadius: 6,
          color: '#475569', cursor: 'pointer', padding: '5px 10px',
          fontSize: 11, fontFamily: 'DM Sans, sans-serif', width: '100%',
        }}
      >+ Add pair</button>
    </div>
  );
};

// Start Node Form
const StartForm: React.FC<{ nodeId: string; data: StartNodeData }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const u = (partial: Partial<StartNodeData>) => updateNodeData(nodeId, partial as Partial<WorkflowNodeData>);
  return (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>TITLE</label>
        <input style={inputStyle} value={data.title} onChange={(e) => u({ title: e.target.value })} />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>METADATA</label>
        <KVEditor pairs={data.metadata} onChange={(metadata) => u({ metadata })} />
      </div>
    </>
  );
};

// Task Node Form
const TaskForm: React.FC<{ nodeId: string; data: TaskNodeData }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const u = (partial: Partial<TaskNodeData>) => updateNodeData(nodeId, partial as Partial<WorkflowNodeData>);
  return (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>TITLE *</label>
        <input style={inputStyle} value={data.title} onChange={(e) => u({ title: e.target.value })} required />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea
          style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
          value={data.description}
          onChange={(e) => u({ description: e.target.value })}
        />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>ASSIGNEE</label>
        <input style={inputStyle} value={data.assignee} placeholder="e.g. HR Manager" onChange={(e) => u({ assignee: e.target.value })} />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>DUE DATE</label>
        <input style={inputStyle} type="date" value={data.dueDate} onChange={(e) => u({ dueDate: e.target.value })} />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>CUSTOM FIELDS</label>
        <KVEditor pairs={data.customFields} onChange={(customFields) => u({ customFields })} />
      </div>
    </>
  );
};

// Approval Node Form
const ApprovalForm: React.FC<{ nodeId: string; data: ApprovalNodeData }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const u = (partial: Partial<ApprovalNodeData>) => updateNodeData(nodeId, partial as Partial<WorkflowNodeData>);
  const roles = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'];
  return (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>TITLE</label>
        <input style={inputStyle} value={data.title} onChange={(e) => u({ title: e.target.value })} />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>APPROVER ROLE</label>
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={data.approverRole}
          onChange={(e) => u({ approverRole: e.target.value })}
        >
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>AUTO-APPROVE THRESHOLD (days)</label>
        <input
          style={inputStyle}
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(e) => u({ autoApproveThreshold: parseInt(e.target.value) || 0 })}
        />
        <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
          0 = no auto-approve
        </div>
      </div>
    </>
  );
};

// Automated Node Form
const AutomatedForm: React.FC<{ nodeId: string; data: AutomatedNodeData }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    automationsApi.getAutomations().then((a) => { setActions(a); setLoading(false); });
  }, []);

  const u = (partial: Partial<AutomatedNodeData>) => updateNodeData(nodeId, partial as Partial<WorkflowNodeData>);

  const selectedAction = actions.find((a) => a.id === data.actionId);

  return (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>TITLE</label>
        <input style={inputStyle} value={data.title} onChange={(e) => u({ title: e.target.value })} />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>ACTION</label>
        {loading ? (
          <div style={{ fontSize: 11, color: '#475569', padding: '8px 0' }}>Loading actions...</div>
        ) : (
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={data.actionId}
            onChange={(e) => u({ actionId: e.target.value, actionParams: {} })}
          >
            <option value="">— Select action —</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div style={fieldGroup}>
          <label style={labelStyle}>PARAMETERS</label>
          {selectedAction.params.map((param) => (
            <div key={param} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: '#6366f1', fontFamily: 'Space Mono, monospace', marginBottom: 3 }}>
                {param}
              </div>
              <input
                style={inputStyle}
                placeholder={`Enter ${param}...`}
                value={data.actionParams[param] || ''}
                onChange={(e) =>
                  u({ actionParams: { ...data.actionParams, [param]: e.target.value } })
                }
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// End Node Form
const EndForm: React.FC<{ nodeId: string; data: EndNodeData }> = ({ nodeId, data }) => {
  const { updateNodeData } = useWorkflowStore();
  const u = (partial: Partial<EndNodeData>) => updateNodeData(nodeId, partial as Partial<WorkflowNodeData>);
  return (
    <>
      <div style={fieldGroup}>
        <label style={labelStyle}>END MESSAGE</label>
        <input style={inputStyle} value={data.endMessage} onChange={(e) => u({ endMessage: e.target.value })} />
      </div>
      <div style={fieldGroup}>
        <label style={labelStyle}>SHOW SUMMARY</label>
        <div
          onClick={() => u({ showSummary: !data.showSummary })}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            cursor: 'pointer', userSelect: 'none',
          }}
        >
          <div style={{
            width: 40, height: 22, borderRadius: 11,
            background: data.showSummary ? '#6366f1' : '#2d3048',
            position: 'relative', transition: 'background 0.2s',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              position: 'absolute', top: 3,
              left: data.showSummary ? 21 : 3,
              transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'DM Sans, sans-serif' }}>
            {data.showSummary ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </>
  );
};

// Main NodeEditPanel
export const NodeEditPanel: React.FC = () => {
  const { selectedNodeId, nodes, deleteNode, selectNode } = useWorkflowStore();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  const TYPE_COLORS: Record<string, string> = {
    start: '#22c55e', task: '#3b82f6', approval: '#f59e0b',
    automated: '#8b5cf6', end: '#ef4444',
  };
  const color = TYPE_COLORS[node.data.type] || '#6366f1';

  return (
    <div style={{
      width: 260,
      background: '#0f1117',
      borderLeft: '1px solid #1e2130',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid #1e2130',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: 'Space Mono, monospace', color, letterSpacing: '0.1em' }}>
            {node.data.type.toUpperCase()} NODE
          </div>
          <div style={{ fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#e2e8f0', fontWeight: 600, marginTop: 2 }}>
            Configure
          </div>
        </div>
        <button
          onClick={() => selectNode(null)}
          style={{
            background: 'transparent', border: '1px solid #2d3048',
            borderRadius: 6, color: '#475569', cursor: 'pointer',
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}
        >×</button>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {node.data.type === 'start' && <StartForm nodeId={node.id} data={node.data as StartNodeData} />}
        {node.data.type === 'task' && <TaskForm nodeId={node.id} data={node.data as TaskNodeData} />}
        {node.data.type === 'approval' && <ApprovalForm nodeId={node.id} data={node.data as ApprovalNodeData} />}
        {node.data.type === 'automated' && <AutomatedForm nodeId={node.id} data={node.data as AutomatedNodeData} />}
        {node.data.type === 'end' && <EndForm nodeId={node.id} data={node.data as EndNodeData} />}
      </div>

      {/* Footer */}
      <div style={{ padding: 12, borderTop: '1px solid #1e2130' }}>
        <button
          onClick={() => deleteNode(node.id)}
          style={{
            width: '100%', padding: '8px', background: '#1a0a0a',
            border: '1px solid #3f1010', borderRadius: 8,
            color: '#f87171', cursor: 'pointer', fontSize: 12,
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          🗑 Delete Node
        </button>
      </div>
    </div>
  );
};
