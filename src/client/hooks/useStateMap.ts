import { useLocation } from 'react-router-dom';
import type { GlobalState } from '../context/types/state';

const useStateMap = () => {
  const location = useLocation();
  
  // Map paths to their corresponding state properties
  const PATH_TO_STATE_MAP: Record<string, keyof GlobalState> = {
    appointments: 'appointments',
    voicemail: 'voicemail',
  };

  // Remove leading slash and get the path
  const currentPath = location.pathname.slice(1);

  return PATH_TO_STATE_MAP[currentPath];
};

export default useStateMap;
