import type { JSX, ReactNode } from 'react';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ToolbarContext } from '@/lib/zeditor/context/Toolbar/ToolbarContext';
import { INITIAL_TOOLBAR_STATE } from '@/lib/zeditor/constants';
import type { ToolbarStateKey, ToolbarStateValue } from '@/lib/zeditor/types';

export const ToolbarProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE);
  const selectionFontSize = toolbarState.fontSize;

  const updateToolbarState = useCallback(
    <Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) => {
      setToolbarState(prev => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2));
  }, [selectionFontSize, updateToolbarState]);

  const contextValue = useMemo(() => {
    return {
      toolbarState,
      updateToolbarState,
    };
  }, [toolbarState, updateToolbarState]);

  return <ToolbarContext.Provider value={contextValue}>{children}</ToolbarContext.Provider>;
};