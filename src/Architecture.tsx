import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  type NodeProps,
  type Node,
} from "@xyflow/react";
import {
  Box,
  Database,
  Globe,
  ShieldCheck,
  Network,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import { components } from "./data";
import "@xyflow/react/dist/style.css";
type Component = (typeof components)[number];
const icons = {
  Presentation: Globe,
  Integration: Network,
  Security: ShieldCheck,
  Application: Box,
  Data: Database,
  Platform: Box,
};
function SystemNode({
  data,
  selected,
}: NodeProps<Node<{ component: Component }>>) {
  const c = data.component;
  const Icon = icons[c.layer as keyof typeof icons];
  return (
    <div className={`system-node ${selected ? "selected" : ""}`}>
      <Handle type="target" position={Position.Top} />
      <div className={`node-icon ${c.layer.toLowerCase()}`}>
        <Icon size={18} />
      </div>
      <div>
        <strong>{c.name}</strong>
        <small>{c.tech}</small>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
const nodeTypes = { system: SystemNode };
const positions = [
  [260, 0],
  [260, 130],
  [520, 130],
  [0, 280],
  [260, 280],
  [520, 280],
  [0, 435],
  [260, 435],
  [520, 435],
  [0, 590],
  [260, 590],
  [520, 590],
];
function makeNodes(deployment: boolean) {
  return components
    .filter((_, i) => deployment || i < 9)
    .map((c, i) => ({
      id: c.id,
      type: "system",
      position: { x: positions[i][0], y: positions[i][1] },
      data: { component: c },
    }));
}
const links = [
  ["web", "gateway", "HTTPS"],
  ["iam", "gateway", "OIDC"],
  ["gateway", "java", "REST"],
  ["gateway", "go", "REST"],
  ["gateway", "python", "REST"],
  ["java", "mysql", "SQL / TLS"],
  ["go", "oracle", "SQL / TLS"],
  ["python", "mongo", "TLS"],
  ["platform", "java", "hosts"],
  ["delivery", "platform", "deploy"],
  ["observe", "platform", "telemetry"],
];
export function Architecture() {
  const [deployment, setDeployment] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(makeNodes(false));
  const [selected, setSelected] = useState(components[1]);
  const [revision, setRevision] = useState(0);
  const reset = (d = deployment) => {
    setDeployment(d);
    setNodes(makeNodes(d));
    setRevision((r) => r + 1);
  };
  const edges = links
    .filter(
      ([a, b]) =>
        nodes.some((n) => n.id === a) && nodes.some((n) => n.id === b),
    )
    .map(([source, target, label]) => ({
      id: `${source}-${target}`,
      source,
      target,
      label,
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#8ca3ae" },
      style: { stroke: "#8ca3ae", strokeWidth: 1.5 },
      labelStyle: { fontSize: 10, fill: "#536572" },
      labelBgStyle: { fill: "#f7fafb" },
      labelBgPadding: [5, 3] as [number, number],
    }));
  return (
    <section className="architecture-shell">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">REFERENCE BLUEPRINT / 01</span>
          <h2>Connected services architecture</h2>
        </div>
        <span className="badge">
          <span className="dot" /> Target state
        </span>
      </div>
      <div className="canvas-toolbar">
        <div className="segmented">
          <button aria-pressed={!deployment} onClick={() => reset(false)}>
            Logical view
          </button>
          <button aria-pressed={deployment} onClick={() => reset(true)}>
            Deployment view
          </button>
        </div>
        <button className="subtle" onClick={() => reset()}>
          <RotateCcw size={14} /> Reset layout
        </button>
      </div>
      <div className="architecture-body">
        <div className="diagram">
          <div className="diagram-label">
            {deployment
              ? "CLOUD PLATFORM · PRIVATE SERVICE & DATA NETWORK"
              : "CHANNEL → INTEGRATION → SERVICES → DATA"}
          </div>
          <ReactFlow
            key={revision}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelected(node.data.component)}
            onSelectionChange={({ nodes: selectedNodes }) => {
              if (selectedNodes[0])
                setSelected(selectedNodes[0].data.component);
            }}
            fitView
            fitViewOptions={{ padding: 0.17 }}
            minZoom={0.25}
            maxZoom={1.6}
            nodesConnectable={false}
            proOptions={{ hideAttribution: false }}
          >
            <Background gap={20} color="#dce4e8" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
        <aside className="inspector">
          <span className="eyebrow">COMPONENT INSPECTOR</span>
          <div className="inspector-icon">
            <Box size={25} />
          </div>
          <span className="badge">{selected.layer} layer</span>
          <h3>{selected.name}</h3>
          <p className="mono">{selected.tech}</p>
          <dl>
            <dt>Responsibility</dt>
            <dd>{selected.purpose}</dd>
            <dt>Interfaces & dependencies</dt>
            <dd>{selected.interfaces}</dd>
            <dt>Security considerations</dt>
            <dd>{selected.security}</dd>
            <dt>Design trade-off</dt>
            <dd>{selected.tradeoff}</dd>
          </dl>
          <a href="#decisions">
            Review architecture decisions <ArrowUpRight size={14} />
          </a>
        </aside>
      </div>
      <div className="canvas-footer">
        <span>
          <span className="dot" /> Select a component to inspect its design
        </span>
        <span>Drag to arrange · Scroll to zoom</span>
      </div>
      <details className="component-list">
        <summary>
          Accessible component list · {components.length} components
        </summary>
        <div className="component-buttons">
          {components.map((c) => (
            <button key={c.id} onClick={() => setSelected(c)}>
              {c.name}
            </button>
          ))}
        </div>
      </details>
    </section>
  );
}
