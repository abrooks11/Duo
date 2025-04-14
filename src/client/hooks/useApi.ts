// import context and action types
import useGlobalContext from './useGlobalContext';
import { ActionTypes } from '../context/GlobalContext';

const BASE_URL = 'http://localhost:3000/api';
// const response = await fetch("http://localhost:3000/api/appointments");

interface apiRequests {
  getAll: (endpoint: string) => Promise<any>;
}

const useApi = () => {
  // get global state from context
  const { dispatch } = useGlobalContext();

  const api: apiRequests = {
    getAll: async (endpoint) => {
      try {
        const response = await fetch(`${BASE_URL}/${endpoint}`);
        const data = await response.json();
        // console.log('FETCHING', endpoint);
        if (data) {
          // console.log(`REQUEST FOR ${endpoint} successful`)
          dispatch({
            type: ActionTypes.GET_DATA,
            payload: { resourceType: endpoint, data: data },
          });
        }
        return data;
      } catch (error) {
        console.error(`Error fetching ${endpoint}: `, error);
      }
    },
  };

  return api;
};

export default useApi;
