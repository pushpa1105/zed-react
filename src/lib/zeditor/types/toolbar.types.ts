import type { INITIAL_TOOLBAR_STATE } from "@/lib/zeditor/constants";

export type ToolbarState = typeof INITIAL_TOOLBAR_STATE;
export type ToolbarStateKey = keyof ToolbarState;
export type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key];