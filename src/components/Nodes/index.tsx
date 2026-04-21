import React from 'react';
import type { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../../types';

// Icons (inline SVG to avoid external deps)
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const ClipboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-3" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);
const FlagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

export const StartNode: React.FC<NodeProps<StartNodeData>> = (props) => (
  <BaseNode {...props} type="start" icon={<PlayIcon />} hasTarget={false} />
);

export const TaskNode: React.FC<NodeProps<TaskNodeData>> = (props) => {
  const { data } = props;
  return (
    <BaseNode {...props} type="task" icon={<ClipboardIcon />}>
      {data.assignee && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid #2d3048',
          fontSize: 11, color: '#64748b', fontFamily: 'DM Sans, sans-serif',
          display: 'flex', gap: 6, alignItems: 'center',
        }}>
          <span style={{ color: '#94a3b8' }}>👤</span>
          <span>{data.assignee}</span>
          {data.dueDate && <span style={{ marginLeft: 'auto', color: '#64748b' }}>{data.dueDate}</span>}
        </div>
      )}
    </BaseNode>
  );
};

export const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = (props) => {
  const { data } = props;
  return (
    <BaseNode {...props} type="approval" icon={<CheckIcon />}>
      {data.approverRole && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid #2d3048',
          fontSize: 11, color: '#94a3b8', fontFamily: 'DM Sans, sans-serif',
        }}>
          Role: <span style={{ color: '#fcd34d' }}>{data.approverRole}</span>
        </div>
      )}
    </BaseNode>
  );
};

export const AutomatedNode: React.FC<NodeProps<AutomatedNodeData>> = (props) => {
  const { data } = props;
  return (
    <BaseNode {...props} type="automated" icon={<ZapIcon />}>
      {data.actionId && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid #2d3048',
          fontSize: 11, color: '#94a3b8', fontFamily: 'Space Mono, monospace',
        }}>
          <span style={{ color: '#c4b5fd' }}>{data.actionId}</span>
        </div>
      )}
    </BaseNode>
  );
};

export const EndNode: React.FC<NodeProps<EndNodeData>> = (props) => (
  <BaseNode {...props} type="end" icon={<FlagIcon />} hasSource={false} />
);

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
