import { useState, useCallback } from 'react';

export function useUIState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);

  const updateState = useCallback((updater: Partial<T>) => {
    setState(prevState => ({
      ...prevState,
      ...updater
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return {
    state,
    updateState,
    resetState
  };
}