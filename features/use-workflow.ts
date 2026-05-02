import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Workflow } from "@/lib/generated/prisma/client";
import { Edge, Node } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflow-store";

type CreateWorkflowPayload = {
  name: string;
  description?: string;
};

type WorkflowType = {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flowObject: any;
};

export const useGetWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      return await axios
        .get<{ data: Workflow[] }>("/api/workflow")
        .then((res) => res.data.data);
    },
  });
};

export const useCreateWorkflow = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ name, description }: CreateWorkflowPayload) =>
      axios
        .post("/api/workflow", {
          name,
          description,
        })
        .then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Workflow created successfully");
      router.push(`/workflow/${data.data.id}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create workflow");
    },
  });
};

export const useGetWorkflowById = (workflowId: string) => {
  const { setSavedState } = useWorkflowStore();
  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async () => {
      return await axios
        .get<{ data: WorkflowType }>(`/api/workflow/${workflowId}`)
        .then((res) => {
          const result = res.data.data;
          setSavedState(result.flowObject.nodes, result.flowObject.edges);
          return result;
        });
    },
    enabled: !!workflowId,
  });
};

export const useDeleteWorkflow = () => {
  const router = useRouter();
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: async (workflowId: string) =>
      axios.delete(`/api/workflow/${workflowId}`).then((res) => res.data),
    onSuccess: () => {
      toast.success("Workflow deleted");
      queryClient.invalidateQueries({ queryKey: ["workflows"] }); 
      router.push("/workflow");
    },
    onError: () => {
      toast.error("Failed to delete workflow");
    },
  });
};

export const useUpdateWorkflow = (workflowId: string) => {
  const { setSavedState } = useWorkflowStore();
  return useMutation({
    mutationFn: async (data: { nodes: Node[]; edges: Edge[] }) =>
      axios
        .put(`/api/workflow/${workflowId}`, data)
        .then((res) => res.data),
    onSuccess: (data) => {
      const result = data.data;
      setSavedState(result.flowObject.nodes, result.flowObject.edges)
      toast.success("Workflow updated successfully")
    },
    onError: (error) => {
      console.log("Update workflow failed", error)
      toast.error("failed to update workflow")
    }
  })
}