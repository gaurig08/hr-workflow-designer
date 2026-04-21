import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';
import type { WorkflowNodeData } from '../../types';

const NODE_COLORS: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  start:     { bg: '#0f2', border: '#22c55e', badge: '#166534', dot: '#4ade80' },
  task:      { bg: '#3b82f6', border: '#3b82f6', badge: '#1e3a8a', dot: '#93c5fd' },
  approval:  { bg: '#f59e0b', border: '#f59e0b', badge: '#78350f', dot: '#fcd34d' },
  automated: { bg: '#8b5cf6', border: '#8b5cf6', badge: '#3b0764', dot: '#c4b5fd' },
  end:       { bg: '#ef4444', border: '#ef4444', badge: '#7f1d1d', dot: '#fca5a5' },
};

const NODE_LABELS: Record<string, string> = {
  start: 'START',
  task: 'TASK',
  approval: 'APPROVAL',
  automated: 'AUTO',
  end: 'END',
};

interface BaseNodeProps extends NodeProps<WorkflowNodeData> {
  icon: React.ReactNode;
  children?: React.ReactNode;
  hasSource?: boolean;
  hasTarget?: boolean;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  selected,
  type = 'task',
  icon,
  children,
  hasSource = true,
  hasTarget = true,
}) => {
  const { selectNode, validationErrors } = useWorkflowStore();
  const colors = NODE_COLORS[type] || NODE_COLORS.task;
  const hasError = validationErrors.some((e) => e.nodeId === id);

  const title = (data as { title?: string }).title || (data as { endMessage?: string }).endMessage || '';

  return (
    <div
      onClick={() => selectNode(id)}
      style={{
        background: '#1a1d2e',
        border: `2px solid ${selected ? colors.border : hasError ? '#ef4444' : '#2d3048'}`,
        borderRadius: 12,
        padding: '12px 16px',
        minWidth: 180,
        cursor: 'pointer',
        boxShadow: selected
          ? `0 0 0 3px ${colors.border}33, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: colors.dot, border: '2px solid #1a1d2e', width: 10, height: 10 }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            background: `${colors.border}22`,
            border: `1px solid ${colors.border}44`,
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.dot,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 9,
              fontFamily: 'Space Mono, monospace',
              color: colors.dot,
              letterSpacing: '0.1em',
              marginBottom: 2,
            }}
          >
            {NODE_LABELS[type]}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#e2e8f0',
              fontFamily: 'DM Sans, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 130,
            }}
          >
            {title || 'Untitled'}
          </div>
        </div>
      </div>

      {children}

      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: colors.dot, border: '2px solid #1a1d2e', width: 10, height: 10 }}
        />
      )}
    </div>
  );
};
