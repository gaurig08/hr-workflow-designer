import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from '../types';

export interface WorkflowTemplate {
  name: string;
  icon: string;
  desc: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    name: 'Onboarding',
    icon: '🏢',
    desc: 'New employee flow',
    nodes: [
      { id: 'start_1', type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'New Hire Onboarding', metadata: [{ key: 'department', value: 'Engineering' }] } },
      { id: 'task_1', type: 'task', position: { x: 300, y: 180 }, data: { type: 'task', title: 'Collect Documents', description: 'Gather ID, tax forms, and bank details', assignee: 'HR Admin', dueDate: '', customFields: [] } },
      { id: 'auto_1', type: 'automated', position: { x: 300, y: 320 }, data: { type: 'automated', title: 'Send Welcome Email', actionId: 'send_email', actionParams: { to: 'new_hire@company.com', subject: 'Welcome to the Team!' } } },
      { id: 'task_2', type: 'task', position: { x: 300, y: 460 }, data: { type: 'task', title: 'IT Equipment Setup', description: 'Provision laptop, accounts, and access cards', assignee: 'IT Team', dueDate: '', customFields: [] } },
      { id: 'approval_1', type: 'approval', position: { x: 300, y: 600 }, data: { type: 'approval', title: 'Manager Sign-off', approverRole: 'Manager', autoApproveThreshold: 0 } },
      { id: 'auto_2', type: 'automated', position: { x: 300, y: 740 }, data: { type: 'automated', title: 'Update HRIS', actionId: 'update_hris', actionParams: { employeeId: '', field: 'status', value: 'active' } } },
      { id: 'end_1', type: 'end', position: { x: 300, y: 880 }, data: { type: 'end', endMessage: 'Onboarding Complete! 🎉', showSummary: true } },
    ],
    edges: [
      { id: 'e1', source: 'start_1', target: 'task_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e2', source: 'task_1', target: 'auto_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e3', source: 'auto_1', target: 'task_2', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e4', source: 'task_2', target: 'approval_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e5', source: 'approval_1', target: 'auto_2', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e6', source: 'auto_2', target: 'end_1', animated: true, style: { stroke: '#6366f1' } },
    ],
  },
  {
    name: 'Leave Approval',
    icon: '🏖',
    desc: 'Leave request flow',
    nodes: [
      { id: 'start_1', type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'Leave Request Submitted', metadata: [{ key: 'type', value: 'Annual Leave' }] } },
      { id: 'auto_1', type: 'automated', position: { x: 300, y: 200 }, data: { type: 'automated', title: 'Notify Manager', actionId: 'notify_slack', actionParams: { channel: '#approvals', message: 'New leave request pending review' } } },
      { id: 'approval_1', type: 'approval', position: { x: 300, y: 360 }, data: { type: 'approval', title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 3 } },
      { id: 'approval_2', type: 'approval', position: { x: 300, y: 500 }, data: { type: 'approval', title: 'HR Sign-off', approverRole: 'HRBP', autoApproveThreshold: 0 } },
      { id: 'auto_2', type: 'automated', position: { x: 300, y: 640 }, data: { type: 'automated', title: 'Update Leave Balance', actionId: 'update_hris', actionParams: { employeeId: '', field: 'leave_balance', value: '' } } },
      { id: 'auto_3', type: 'automated', position: { x: 300, y: 780 }, data: { type: 'automated', title: 'Confirm to Employee', actionId: 'send_email', actionParams: { to: 'employee@company.com', subject: 'Leave Approved' } } },
      { id: 'end_1', type: 'end', position: { x: 300, y: 920 }, data: { type: 'end', endMessage: 'Leave Approved & Recorded', showSummary: false } },
    ],
    edges: [
      { id: 'e1', source: 'start_1', target: 'auto_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e2', source: 'auto_1', target: 'approval_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e3', source: 'approval_1', target: 'approval_2', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e4', source: 'approval_2', target: 'auto_2', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e5', source: 'auto_2', target: 'auto_3', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e6', source: 'auto_3', target: 'end_1', animated: true, style: { stroke: '#6366f1' } },
    ],
  },
  {
    name: 'Doc Verification',
    icon: '📄',
    desc: 'Document check flow',
    nodes: [
      { id: 'start_1', type: 'start', position: { x: 300, y: 50 }, data: { type: 'start', title: 'Document Submission', metadata: [{ key: 'docType', value: 'ID Proof' }] } },
      { id: 'task_1', type: 'task', position: { x: 300, y: 200 }, data: { type: 'task', title: 'Initial Review', description: 'Check document completeness and format', assignee: 'HR Coordinator', dueDate: '', customFields: [{ key: 'priority', value: 'high' }] } },
      { id: 'auto_1', type: 'automated', position: { x: 300, y: 360 }, data: { type: 'automated', title: 'Generate Report', actionId: 'generate_doc', actionParams: { template: 'verification_report', recipient: 'hr@company.com' } } },
      { id: 'approval_1', type: 'approval', position: { x: 300, y: 500 }, data: { type: 'approval', title: 'Compliance Approval', approverRole: 'Director', autoApproveThreshold: 0 } },
      { id: 'auto_2', type: 'automated', position: { x: 300, y: 640 }, data: { type: 'automated', title: 'Create JIRA Ticket', actionId: 'create_ticket', actionParams: { project: 'HR', summary: 'Document verified - archive' } } },
      { id: 'end_1', type: 'end', position: { x: 300, y: 780 }, data: { type: 'end', endMessage: 'Documents Verified & Filed', showSummary: true } },
    ],
    edges: [
      { id: 'e1', source: 'start_1', target: 'task_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e2', source: 'task_1', target: 'auto_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e3', source: 'auto_1', target: 'approval_1', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e4', source: 'approval_1', target: 'auto_2', animated: true, style: { stroke: '#6366f1' } },
      { id: 'e5', source: 'auto_2', target: 'end_1', animated: true, style: { stroke: '#6366f1' } },
    ],
  },
];
