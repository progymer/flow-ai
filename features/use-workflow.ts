import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner";
import { Workflow } from "@/lib/generated/prisma/client";

type CreateWorkflowPayload = {
    name: string;
    description?: string;
}

export const useGetWorkflows = () => {
    return useQuery({
        queryKey: ["workflows"],
        queryFn: async () => {
            return await axios
                .get<{ data: Workflow[] }>("/api/workflow")
                .then((res) => res.data.data)
        }
    })
}

export const useCreateWorkflow = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async({ name, description }: CreateWorkflowPayload) =>
            axios.post("/api/workflow" , {
                name,
                description,
            })
            .then((res) => res.data),
        onSuccess: (data) => {
            toast.success("Workflow created successfully");
            router.push(`/workflow/${data.data.id}`)
        }, 
        onError: (error) => {
            console.error(error);
            toast.error("Failed to create workflow")
        }
            
    });
}