"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetWorkflowById } from "@/features/use-workflow";
import { useParams } from "next/navigation";
import  Header  from "./_common/header";
import { WorkflowProvider } from "@/context/workflow-context";
import WorkflowCanvas from "./_common/workflow-canvas";
import { ReactFlowProvider } from "@xyflow/react";


const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: workflow, isPending } = useGetWorkflowById(id);
  const nodes = workflow?.flowObject?.nodes || [];
  const edges = workflow?.flowObject?.edges || [];

  if (!workflow && !isPending) {
    return <div>Workflow not found</div>
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="size-12 text-primary" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <ReactFlowProvider>
        <WorkflowProvider
          workflowId={workflow?.id ?? ""}
          initialNodes={nodes}
          initialEdges={edges}
        >
          <div className="flex flex-col h-screen relative">
            <Header
              name={workflow?.name}
              workflowId={workflow?.id}
              isLoading={isPending}
            />
            <div className="flex-1 relative overflow-hidden">
                <WorkflowCanvas workflowId={workflow.id} />
            </div>
          </div>
        </WorkflowProvider>
      </ReactFlowProvider>
    </div>
  );
}

export default Page