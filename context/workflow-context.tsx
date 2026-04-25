import { createNode, NodeTypeEnum } from "@/lib/workflow/node-config";
import { Edge, Node } from "@xyflow/react";
import { createContext, useContext, useState } from "react";


export type WorkflowView = "edit" | "preview"

interface WorkflowContextType {
  view: WorkflowView;
  setView: (view: WorkflowView) => void;
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  getVariables: (nodeId: string) => {
    id: string,
    label: string,
    outputs: string[],
  }[];
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
    undefined
)

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
    const start_node = createNode({
      type: NodeTypeEnum.START,
    })

    const [view, setView] = useState<WorkflowView>("edit")
    const [nodes, setNodes] = useState<Node[]>([start_node]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const getUpstreamNodes = (nodeId: string) => {
        const upstream = new Set<string>();

        const addToSet = (id: string) => {
            edges
              .filter((e) => e.target === id)
              .forEach((e) => {
                upstream.add(e.source)
                addToSet(e.source)
              })
        }

        addToSet(nodeId);
        return upstream
    }

    const getVariables = (nodeId: string) => {
        const upstreamIds = getUpstreamNodes(nodeId)
        return nodes.filter((node) => upstreamIds.has(node.id))
            .map((node) => ({
                id: node.id,
                label: String(node.data.label) || "Unknown",
                outputs: (node.data.outputs as string[]) || [],
            }))
    }

    return (
        <WorkflowContext.Provider
            value={{
                view,
                setView,
                nodes,
                edges,
                setNodes,
                setEdges,
                getVariables
            }}
        >
            {children}
        </WorkflowContext.Provider>
    )
}

export function useWorkflow() {
    const context = useContext(WorkflowContext)
    if (context === undefined) {
        throw new Error("useWorkflow must be used within a workflow provider")
    }
    return context
}