// import context and action types
import useGlobalContext from './useGlobalContext';
import { ActionTypes } from '../context/GlobalContext';

import { requestVoicemail } from '../utils/voicemailApi';

const BASE_URL = 'http://localhost:3000/api';

interface apiRequests {
  getAll: (endpoint: string) => Promise<any>;
}

const useApi = () => {
  // get global state from context
  const { dispatch } = useGlobalContext();

  const api: apiRequests = {
    getAll: async (endpoint) => {
      try {
        let serverData = {};

        if (endpoint === 'voicemail') {
          serverData = await requestVoicemail();
        } else {
          const response = await fetch(`${BASE_URL}/${endpoint}`);
          serverData = await response.json();
        }

        if (serverData) {
          // console.log(`REQUEST FOR ${endpoint} successful`)
          dispatch({
            type: ActionTypes.GET_DATA,
            payload: { resourceType: endpoint, data: serverData },
          });
        }
        // console.log({serverData})
        return serverData;
      } catch (error) {
        console.error(`Error fetching ${endpoint}: `, error);
      }
    },
  };

  return api;
};

export default useApi;
