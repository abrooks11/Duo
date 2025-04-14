/* NOTE: CUSTOM HOOKS:
Hooks vs Utils: custom hooks are specifically for managing React-related logic and state, while utility functions are for general-purpose operations that don't depend on React's features
Use case: when you need to share stateful logic between components OR interact with React's lifecycle OR need to use other React hooks
Naming convention: must start with "use"
: must use other React hooks
*/

import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

// Custom hook to use the GlobalContext
const useGlobalContext = () => {
  // call useContext hook to get the context and store in variable
  const context = useContext(GlobalContext);
  // if context is null, throw an error
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  // return the context value which contains the global state and dispatch function
  return context;
};

export default useGlobalContext;
