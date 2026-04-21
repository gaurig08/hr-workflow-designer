import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from 'reactflow';
import type { WorkflowNodeData, SimulationResult, ValidationError } from '../types';

interface WorkflowStore {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  validationErrors: ValidationError[];
  isSandboxOpen: boolean;

  // Actions
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  addNode: (node: Node<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  toggleSandbox: () => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,
  validationErrors: [],
  isSandboxOpen: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<WorkflowNodeData>[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge({ ...connection, animated: true, style: { stroke: '#6366f1' } }, state.edges),
    })),

  selectNode: (id) => set({ selectedNodeId: id }),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    })),

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  setSimulationResult: (result) => set({ simulationResult: result }),
  setIsSimulating: (v) => set({ isSimulating: v }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  toggleSandbox: () => set((state) => ({ isSandboxOpen: !state.isSandboxOpen })),

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      set({ nodes, edges, selectedNodeId: null });
    } catch {
      console.error('Invalid workflow JSON');
    }
  },
}));
