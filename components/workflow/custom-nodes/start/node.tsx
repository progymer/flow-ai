import { NodeProps } from "@xyflow/react"
import WorkflowNode from "../../workflow-node";
import { PlayIcon } from "lucide-react";
import StartSettings from "./settings";

const StartNode = (props: NodeProps) => {
  const { id, data, selected } = props;
  const bgColor = data?.color as string; 
  return (
    <>
    <WorkflowNode 
      nodeId={id}
      label="Start"
      subText="Trigger"
      Icon={PlayIcon}
      className="min-w-28"
      isDeletable={false}
      selected={selected}
      handles={{
        target: false,
        source: true
      }}
      color={bgColor}
      settingTitle="start node settings"
      settingDescription="the workflow starting point"
      settingComponent={<StartSettings nodeId={id} />}
    />
    </>
  )
}

export default StartNode