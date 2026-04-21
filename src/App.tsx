import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Canvas/Toolbar';
import { NodeEditPanel } from './components/Forms/NodeEditPanel';
import { SandboxPanel } from './components/Sandbox';
import { useWorkflowStore } from './store/workflowStore';

function App() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const isSandboxOpen = useWorkflowStore((s) => s.isSandboxOpen);

  return (
    <ReactFlowProvider>
      <div style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#0d0f1a',
        overflow: 'hidden',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <Sidebar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          paddingBottom: isSandboxOpen ? '40vh' : 0,
          transition: 'padding-bottom 0.3s ease',
        }}>
          <Toolbar />
          <Canvas />
        </div>
        {selectedNodeId && <NodeEditPanel />}
        <SandboxPanel />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
