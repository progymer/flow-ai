import { FileIcon, GitBranch, Globe, MousePointer2Icon, Play, Square } from "lucide-react";
import { generatedId } from "../helper";
import { MODELS } from "./constants";

 export const NodeTypeEnum = {
    START: "start",
    AGENT: "agent",
    IF_ELSE: "if_else",
    END: "end",
    HTTP: "http",
    COMMENT: "comment",
 } as const;

 export type NodeType = (typeof NodeTypeEnum)[keyof typeof NodeTypeEnum];

 type NodeConfigBase = {
    type: NodeType;
    label: string;
    icon: React.ElementType;
    color: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputs: Record<string, any>;
    outputs: string[];
 }

 export const NODE_CONFIG: Record<NodeType, NodeConfigBase> = {
   [NodeTypeEnum.START]: {
     type: NodeTypeEnum.START,
     label: "Start",
     icon: Play,
     color: "bg-emerald-500",
     inputs: {
       inputValue: "",
     },
     outputs: ["input"]
   },
   [NodeTypeEnum.AGENT]: {
     type: NodeTypeEnum.AGENT,
     label: "Agent",
     icon: MousePointer2Icon,
     color: "bg-blue-500",
     inputs: {
       label: "Agent",
       instructions: "",
       model: MODELS[0].value,
       tools: [],
       outputFormat: "text", //text or json
       responseSchema: null,
     },
     outputs: ["output.text"]
   },
   [NodeTypeEnum.IF_ELSE]: {
     type: NodeTypeEnum.IF_ELSE,
     label: "if / Else",
     icon: GitBranch,
     color: "bg-orange-500",
     inputs: {
       conditions: [
         {
           caseName: "",
           variable: "",
           operator: "",
           value: "",
         },
       ],
     },
     outputs: ["output.result"]
   },
   [NodeTypeEnum.HTTP]: {
     type: NodeTypeEnum.HTTP,
     label: "HTTP",
     icon: Globe,
     color: "bg-blue-400",
     inputs: {
      method: "GET",
      url: "",
      headers: {},
      body: {},
     },
     outputs: ["output.body"]
   },
   [NodeTypeEnum.END]: {
     type: NodeTypeEnum.END,
     label: "End",
     icon: Square,
     color: "bg-red-400",
     inputs: {
      value: "",
     },
     outputs: ["output.text"]
   },
   [NodeTypeEnum.COMMENT]: {
     type: NodeTypeEnum.COMMENT,
     label: "Note",
     icon: FileIcon,
     color: "bg-gray-500",
     inputs: {
       comments: "",
     },
     outputs: []
   },
 };

 export const getNodeConfig = (type: NodeType) => {
    const nodetype = NODE_CONFIG?.[type];
    if(!nodetype) return null;
    return nodetype;
 }

 export type CreateNodeOptions = {
    type: NodeType;
    position?: { x: number; y: number; } 
 }

 export function createNode({
    type,
    position = { x:400, y:200 },
 }: CreateNodeOptions) {
    const config = getNodeConfig(type);
    const id = generatedId(type);
    if(!config) throw new Error(`No node config found ${type}`)

    return {
        id,
        type,
        position,
        deletable: type === NodeTypeEnum.START ? false : true,
        data: {
            label: config.label,
            color: config.color,
            outputs: config.outputs,
            ... config.inputs
        }
    }    
 }