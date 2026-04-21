
# HR Workflow Designer

A visual drag-and-drop workflow builder for HR admins — built with React, React Flow, TypeScript, and Zustand.

![React](https://img.shields.io/badge/React-18-61dafb)     ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)     ![Vite](https://img.shields.io/badge/Vite-5-646cff)      ![ReactFlow](https://img.shields.io/badge/React_Flow-11-ff0072)

---

## How to Run

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
````

Open [http://localhost:5173](http://localhost:5173)

```bash
npm run build
```

No backend, no environment variables, no database setup required — everything runs locally out of the box.

---

## Architecture

### Folder Structure

```
src/
├── api/
│   └── mockApi.ts
│
├── components/
│   ├── Canvas/
│   │   ├── index.tsx
│   │   └── Toolbar.tsx
│   ├── Forms/
│   │   └── NodeEditPanel.tsx
│   ├── Nodes/
│   │   ├── BaseNode.tsx
│   │   └── index.tsx
│   ├── Sandbox/
│   │   └── index.tsx
│   └── Sidebar/
│       └── index.tsx
│
├── hooks/
│   └── index.ts
│
├── store/
│   └── workflowStore.ts
│
├── types/
│   └── index.ts
│
├── utils/
│   └── templates.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

### Data Flow

```
User interaction (drag / click / connect)
        ↓
  React Flow events
        ↓
  Zustand store (workflowStore)
        ↓
  Components re-render with new state
        ↓
  On simulate → mockApi.ts → SimulationResult → SandboxPanel
```

The store is the single source of truth:

* nodes
* edges
* selected node
* validation errors
* simulation results
* UI state

Components never talk to each other directly — everything flows through the store.

---

## Design Decisions

### Zustand over Context or Redux

* Single flat store
* No boilerplate (reducers/actions/providers)
* Fine-grained selectors prevent unnecessary re-renders
* Easily scalable via store slices

### BaseNode Composition Pattern

* Shared layout, handles, selection, error UI
* Each node type wraps `BaseNode`
* New node types ≈ 10 lines of code

### Mock API as a Real Abstraction

* Async functions with artificial delay
* Clean separation from UI
* Swap with real backend by editing one file

### Dynamic Automated Node Forms

* Driven by API response (`GET /automations`)
* No hardcoded form fields
* New automation = auto-generated form

### Discriminated Union for Node Data

* Strong TypeScript typing per node
* No `any`
* Compile-time safety
* Easier navigation and refactoring

### Topological Sort in Simulation

* DFS-based execution order
* Ensures correct dependency flow
* Mimics real workflow engines

---

## What Was Completed

| Feature                   | Status |
| ------------------------- | ------ |
| Drag-and-drop canvas      | ✅      |
| 5 node types              | ✅      |
| Edge connections          | ✅      |
| Node config panel         | ✅      |
| Delete nodes/edges        | ✅      |
| Auto-validation           | ✅      |
| Node forms                | ✅      |
| Key-value editor          | ✅      |
| Dynamic automation inputs | ✅      |
| Boolean toggles           | ✅      |
| Mock APIs                 | ✅      |
| Simulation engine         | ✅      |
| Sandbox log viewer        | ✅      |
| Graph validation          | ✅      |
| Export JSON               | ✅      |
| Import JSON               | ✅      |
| Templates (3)             | ✅      |
| MiniMap + controls        | ✅      |
| Validation badge          | ✅      |

---

## What I Would Add With More Time

* Undo / Redo (history stack)
* Visual error indicators directly on nodes
* Conditional branching (Approval yes/no paths)
* Auto-layout 
* Keyboard shortcuts (Delete, Duplicate, Escape)
* Real backend (FastAPI / Express)
* Edge condition labels (Approved / Rejected / Escalated)

---

## Tech Stack

| Tool                 | Version | Purpose          |
| -------------------- | ------- | ---------------- |
| React                | 18      | UI framework     |
| TypeScript           | 5       | Type safety      |
| Vite                 | 5       | Build tool       |
| React Flow           | 11      | Graph editor     |
| Zustand              | 4       | State management |
| DM Sans + Space Mono | —       | Typography       |

---

```
```