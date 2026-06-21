import type { ToolbarState, ToolbarStateKey, ToolbarStateValue } from '@/lib/zeditor/types';
import { createContext } from 'react';


type ContextShape = {
  toolbarState: ToolbarState;
  updateToolbarState<Key extends ToolbarStateKey>(
    key: Key,
    value: ToolbarStateValue<Key>,
  ): void;
};

export const ToolbarContext = createContext<ContextShape>({
  toolbarState: {} as ToolbarState,
  updateToolbarState<Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) { },
});
