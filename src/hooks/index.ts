import { useCallback, useEffect, useRef } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { workflowApi } from '../api/mockApi';
import type { ValidationError } from '../types';
import type { Node } from 'reactflow';
import type { WorkflowNodeData } from '../types';

export const useSimulation = () => {
  const { nodes, edges, setSimulationResult, setIsSimulating, isSimulating } = useWorkflowStore();

  const run = useCallback(async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const result = await workflowApi.simulate(nodes, edges);
      setSimulationResult(result);
    } catch (err) {
      setSimulationResult({ success: false, steps: [], errors: ['Simulation failed unexpectedly.'] });
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, setIsSimulating, setSimulationResult]);

  return { run, isSimulating };
};

export const useValidation = () => {
  const { nodes, edges, setValidationErrors } = useWorkflowStore();

  const validate = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    const startNodes = nodes.filter((n) => n.data.type === 'start');
    const endNodes = nodes.filter((n) => n.data.type === 'end');

    if (startNodes.length === 0)
      errors.push({ message: 'Missing Start node', severity: 'error' });
    if (startNodes.length > 1)
      errors.push({ message: 'Multiple Start nodes found', severity: 'error' });
    if (endNodes.length === 0)
      errors.push({ message: 'Missing End node', severity: 'error' });

    const connectedIds = new Set<string>();
    edges.forEach((e) => { connectedIds.add(e.source); connectedIds.add(e.target); });

    nodes.forEach((n) => {
      if (nodes.length > 1 && !connectedIds.has(n.id)) {
        errors.push({
          nodeId: n.id,
          message: `Node is disconnected`,
          severity: 'warning',
        });
      }
    });

    setValidationErrors(errors);
    return errors;
  }, [nodes, edges, setValidationErrors]);

  return { validate };
};

export const useNodeId = () => {
  const counter = useRef(0);
  return useCallback((prefix: string) => `${prefix}_${++counter.current}_${Date.now()}`, []);
};

export const useDragDrop = () => {
  const { addNode } = useWorkflowStore();
  const generateId = useNodeId();

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent, reactFlowInstance: { screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number } } | null) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const id = generateId(type);

      const defaultData: Record<string, WorkflowNodeData> = {
        start: { type: 'start', title: 'Start', metadata: [] },
        task: { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
        approval: { type: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 },
        automated: { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} },
        end: { type: 'end', endMessage: 'Workflow Complete', showSummary: true },
      };

      const node: Node<WorkflowNodeData> = {
        id,
        type,
        position,
        data: defaultData[type],
      };

      addNode(node);
    },
    [addNode, generateId]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return { onDragStart, onDrop, onDragOver };
};
