export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  type: 'start';
  title: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  type: 'end';
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationStep {
  nodeId: string;
  nodeType: NodeType;
  title: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors: string[];
}

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
}
