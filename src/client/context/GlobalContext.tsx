import React, { createContext, useReducer } from 'react';

import type { GlobalState } from './types/state';
import type { AppAction } from './types/actions';
import { rootReducer, initialGlobalState } from './reducers/index.reducer';

interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<AppAction>;
}

// create instance of Context object and store in variable
const GlobalContext = createContext<GlobalContextType | null>(null);

// create provider component that will wrap the application and provide the global state
const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(rootReducer, initialGlobalState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
