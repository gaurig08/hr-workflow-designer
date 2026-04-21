import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { nodeTypes } from '../Nodes';
import { useDragDrop } from '../../hooks';

export const Canvas: React.FC = () => {
  const {
    nodes, edges,
    onNodesChange, onEdgesChange, onConnect,
    selectNode,
  } = useWorkflowStore();

  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const { onDrop, onDragOver } = useDragDrop();

  const handleDrop = useCallback(
    (e: React.DragEvent) => onDrop(e, rfInstance.current),
    [onDrop]
  );

  const handlePaneClick = useCallback(() => selectNode(null), [selectNode]);

  return (
    <div style={{ flex: 1, position: 'relative', background: '#0d0f1a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => { rfInstance.current = instance; }}
        onDrop={handleDrop}
        onDragOver={onDragOver}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
        style={{ background: '#0d0f1a' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e2130"
        />
        <Controls
          style={{
            background: '#1a1d2e',
            border: '1px solid #2d3048',
            borderRadius: 8,
          }}
        />
        <MiniMap
          style={{ background: '#0f1117', border: '1px solid #1e2130' }}
          nodeColor={() => '#6366f1'}
          maskColor="rgba(0,0,0,0.5)"
        />
      </ReactFlow>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>⬡</div>
          <div style={{ fontSize: 16, color: '#334155', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
            Drag nodes from the sidebar
          </div>
          <div style={{ fontSize: 12, color: '#1e2130', fontFamily: 'DM Sans, sans-serif', marginTop: 6 }}>
            Start with a Start node and build your workflow
          </div>
        </div>
      )}
    </div>
  );
};
