import { useWorkflowStore } from "@/store/workflow-store";
import { Edge, Node } from "@xyflow/react";
import { useCallback, useMemo } from "react";

interface UseUnsavedChangesReturn {
  hasUnsavedChanges: boolean;
  discardChanges: () => {
    nodes: Node[];
    edges: Edge[];
  };
}

export function useUnsavedChanges({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}): UseUnsavedChangesReturn {
  const { savedNodes = [], savedEdges = [] } = useWorkflowStore();

  const hasUnsavedChanges = useMemo(() => {
    const nodeData = (list: Node[]) =>
      [...list]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((n) => ({ id: n.id, type: n.type, data: n.data }));

    const edgeData = (list: Edge[]) =>
      [...list]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((e) => ({ id: e.id, source: e.source, target: e.target }));

    return (
      JSON.stringify(nodeData(nodes)) !==
        JSON.stringify(nodeData(savedNodes)) ||
      JSON.stringify(edgeData(edges)) !== JSON.stringify(edgeData(savedEdges))
    );
  }, [nodes, edges, savedNodes, savedEdges]);

  const discardChanges = useCallback(() => {
    return { nodes: savedNodes, edges: savedEdges };
  }, [savedEdges, savedNodes]);

  return {
    hasUnsavedChanges,
    discardChanges,
  };
}
