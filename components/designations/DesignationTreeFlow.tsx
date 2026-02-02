// src/pages/Designations/DesignationTreeFlow.tsx
import React, { useEffect, useMemo, useState } from "react";
import dagre from "dagre";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeProps,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Briefcase, Eye, Pencil, MoreVertical } from "lucide-react";

export type TreeDesignation = {
  id: string | number;
  title?: string | null;
  code?: string | null;
  job_level?: number | null;
  job_level_label?: string | null;
  department_name?: string | null;
  grade_name?: string | null;
  reports_to_title?: string | null;
  active_emp_count?: number | null;
  active?: boolean;
  children?: TreeDesignation[];
};

type Props = {
  roots: TreeDesignation[];
  isLoading?: boolean;
  onView: (d: TreeDesignation) => void;
  onEdit: (d: TreeDesignation) => void;
};

const NODE_W = 340;
const NODE_H = 140;
const GAP_X = 140;

type CardNodeData = {
  d: TreeDesignation;
  onView: (d: TreeDesignation) => void;
  onEdit: (d: TreeDesignation) => void;
} & Record<string, unknown>;

type DesignationNode = Node<CardNodeData, "designationCard">;

// ✅ Custom Node (Card) — compact by default, expand details on hover
function DesignationCardNode({ data }: NodeProps<DesignationNode>) {
  const d = data.d;

  return (
    <div className="relative z-10 group rounded-2xl border bg-white shadow-sm hover:shadow-md transition w-[340px]">
      {/* LR: incoming from left */}
      <Handle type="target" position={Position.Left} className="!bg-slate-400 !w-2 !h-2" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              {/* ✅ ALWAYS visible */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-slate-900 truncate max-w-[210px]">
                  {d.title || "—"}
                </div>

                {!!d.job_level_label && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {d.job_level_label}
                  </span>
                )}

                {!!d.children?.length && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {d.children.length} sub
                  </span>
                )}
              </div>

              {/* ✅ Compact line always visible */}
              <div className="text-xs text-slate-500 mt-1 truncate">
                {d.code ? `Code: ${d.code}` : "Code: —"}
              </div>

              {/* ✅ Hidden details (show on hover) */}
              <div className="mt-2 space-y-1 text-xs text-slate-500 hidden group-hover:block">
                <div>Dept: {d.department_name || "—"} • Grade: {d.grade_name || "—"}</div>
                <div>Reports To: {d.reports_to_title || "—"}</div>
                <div>Active Emp: {Number(d.active_emp_count ?? 0) || 0}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 nodrag">
            <StatusBadge status={d.active ? "active" : "inactive"} />

            {/* ✅ actions only appear on hover (clean UI) */}
            <div className=" transition">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-40 p-2 bg-white flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => data.onView(d)}
                  >
                    <Eye className="h-3 w-3" /> View
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={() => data.onEdit(d)}
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* LR: outgoing to right */}
      <Handle type="source" position={Position.Right} className="!bg-slate-400 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  designationCard: DesignationCardNode,
};

function buildGraphFromRoot(root: TreeDesignation, onView: Props["onView"], onEdit: Props["onEdit"]) {
  const nodes: DesignationNode[] = [];
  const edges: Edge[] = [];

  const walk = (n: TreeDesignation) => {
    const id = String(n.id);

    nodes.push({
      id,
      type: "designationCard",
      position: { x: 0, y: 0 },
      width: NODE_W,
      height: NODE_H,
      data: { d: n, onView, onEdit },
    });

    (n.children || []).forEach((c) => {
      const cid = String(c.id);

      edges.push({
        id: `${id}->${cid}`,
        source: id,
        target: cid,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
        style: { strokeWidth: 2 },
      });

      walk(c);
    });
  };

  walk(root);
  return { nodes, edges };
}

// ✅ Dagre layout (Left -> Right)
function layoutWithDagre(nodes: DesignationNode[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  // 🔥 LR layout
  g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 120 });

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const laidOut = nodes.map((n) => {
    const p = g.node(n.id);
    return {
      ...n,
      position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 },
    };
  });

  return { nodes: laidOut, edges };
}

export default function DesignationTreeFlow({ roots, isLoading, onView, onEdit }: Props) {
  const [nodes, setNodes] = useState<DesignationNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const built = useMemo(() => {
    let yOffset = 0;
    const allNodes: DesignationNode[] = [];
    const allEdges: Edge[] = [];

    // Since LR is wide, stack roots vertically
    for (const r of roots || []) {
      const { nodes: n1, edges: e1 } = buildGraphFromRoot(r, onView, onEdit);
      const { nodes: n2, edges: e2 } = layoutWithDagre(n1, e1);

      const shiftedNodes = n2.map((n) => ({
        ...n,
        position: { x: n.position.x, y: n.position.y + yOffset },
      }));

      allNodes.push(...shiftedNodes);
      allEdges.push(...e2);

      const maxY = Math.max(...shiftedNodes.map((n) => n.position.y), 0);
      yOffset = maxY + NODE_H + GAP_X;
    }

    return { nodes: allNodes, edges: allEdges };
  }, [roots, onView, onEdit]);

  useEffect(() => {
    setNodes(built.nodes);
    setEdges(built.edges);
  }, [built]);

  if (isLoading) {
    return <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">Loading...</div>;
  }
  if (!roots?.length) {
    return <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">No designations found.</div>;
  }

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="p-3 border-b text-sm text-slate-600">
        Left → Right org tree • Hover cards for details
      </div>

      <div className="relative" style={{ height: "75vh", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}

          zoomOnScroll
          zoomOnPinch
          zoomOnDoubleClick
          panOnDrag
          minZoom={0.15}
          maxZoom={2.5}
          preventScrolling={true}
          defaultEdgeOptions={{
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
            style: { strokeWidth: 2 },
          }}
        >
          <Background />
          <Controls showZoom showFitView showInteractive />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
