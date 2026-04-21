import type { AutomationAction, SimulationResult, SimulationStep } from '../types';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../types';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const automationsApi = {
  getAutomations: async (): Promise<AutomationAction[]> => {
    await delay(300);
    return [
      { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
      { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
      { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
      { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'summary'] },
      { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
      { id: 'schedule_meeting', label: 'Schedule Meeting', params: ['attendees', 'duration', 'title'] },
    ];
  },
};

export const workflowApi = {
  simulate: async (
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[]
  ): Promise<SimulationResult> => {
    await delay(800);

    const errors: string[] = [];

    // Basic validation
    const startNodes = nodes.filter((n) => n.data.type === 'start');
    const endNodes = nodes.filter((n) => n.data.type === 'end');

    if (startNodes.length === 0) errors.push('Workflow must have a Start node.');
    if (startNodes.length > 1) errors.push('Workflow must have exactly one Start node.');
    if (endNodes.length === 0) errors.push('Workflow must have an End node.');

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach((e) => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    nodes.forEach((n) => {
      if (nodes.length > 1 && !connectedNodeIds.has(n.id)) {
        errors.push(`Node "${(n.data as { title?: string; endMessage?: string }).title || n.id}" is not connected.`);
      }
    });

    if (errors.length > 0) {
      return { success: false, steps: [], errors };
    }

    // Topological sort simulation
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const adjacency = new Map<string, string[]>();
    nodes.forEach((n) => adjacency.set(n.id, []));
    edges.forEach((e) => adjacency.get(e.source)?.push(e.target));

    const visited = new Set<string>();
    const order: string[] = [];

    const dfs = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const neighbors = adjacency.get(id) || [];
      neighbors.forEach(dfs);
      order.unshift(id);
    };

    startNodes.forEach((n) => dfs(n.id));

    const steps: SimulationStep[] = order.map((id, idx) => {
      const node = nodeMap.get(id)!;
      const data = node.data;
      const title =
        (data as { title?: string }).title ||
        (data as { endMessage?: string }).endMessage ||
        node.id;

      const messages: Record<NodeType, string> = {
        start: 'Workflow initiated. Entry point triggered.',
        task: `Task assigned to "${(data as { assignee?: string }).assignee || 'Unassigned'}". Awaiting completion.`,
        approval: `Awaiting approval from "${(data as { approverRole?: string }).approverRole || 'Approver'}".`,
        automated: `Executing automated action: ${(data as { actionId?: string }).actionId || 'none'}.`,
        end: 'Workflow completed successfully.',
      };

      return {
        nodeId: id,
        nodeType: data.type as NodeType,
        title,
        status: 'success',
        message: messages[data.type as NodeType] || 'Step executed.',
        timestamp: new Date(Date.now() + idx * 1500).toISOString(),
      };
    });

    return { success: true, steps, errors: [] };
  },
};
