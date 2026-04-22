export const TOOL_NODE_ENUM = {
  SELECT: "select",
  HAND: "hand",
} as const;

export type ToolModeType = (typeof TOOL_NODE_ENUM)[keyof typeof TOOL_NODE_ENUM];
