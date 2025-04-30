// import React, { createContext, useEffect, useReducer, useRef } from "react";
// import helper function for fetching appointments from the database
// import api from "../hooks/useApi";

// import react hooks
import React, { createContext, useReducer } from 'react';

// import immer for state management
import { produce } from 'immer';

import {
  ColumnDisplayNames,
  RowFilterMap, 
  patientColumnOrder,
  patientColumnNames,
} from '../utils/keyMappings';

import {appointmentRowFilterMap,
  appointmentRowDisplayNames, 
  appointmentColumnOrder,
  appointmentColumnDisplayNames,
} from '../utils/keyMappings';

import {voicemailRowFilterMap,
  voicemailRowDisplayNames, 
  voicemailColumnOrder,
  voicemailColumnDisplayNames,
} from '../utils/keyMappings';

// types for context object
interface DispatchAction {
  type: string;
  payload: any;
}

interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<DispatchAction>;
}

// TYPE ASSERTIONS AND LABELS FOR ACTIONS
interface GlobalStateActions {
  DISPLAY_UPLOAD_MODAL: string;
  GET_DATA: string;
  SET_COLUMN_LIST: string;
  SET_ROW_FILTER_LIST: string;
  SET_DATA_SORT: string;
  DELETE_VOICEMAIL: string;
}

const ActionTypes: GlobalStateActions = {
  DISPLAY_UPLOAD_MODAL: 'DISPLAY_UPLOAD_MODAL',
  GET_DATA: 'GET_DATA',
  SET_COLUMN_LIST: 'SET_COLUMN_LIST',
  SET_ROW_FILTER_LIST: 'SET_ROW_FILTER_LIST',
  SET_DATA_SORT: 'SET_DATA_SORT',
  DELETE_VOICEMAIL: 'DELETE_VOICEMAIL',
};

// TYPE ASSERTIONS AND LABELS FOR STATE
interface GlobalState {
  uploadModal: boolean;
  appointments: ResourceObject;
  claims: ResourceObject;
  patients: ResourceObject;
  voicemail: ResourceObject;
}

interface ResourceObject {
  data: any[];
  rowFilterDetails: RowFilterDetails;
  allColumnHeaders: TableColumn[]; // get from keys of first object in data array
  // allRowFilters: TableFilter[]; // defined in reducer
  // selectedFilters: TableFilter[];
  // selectedSort: {
  //   column: string;
  //   sortOrder: string;
  // };
  // Add column configuration; columnConfig{orderMap, ColumnDisplayNames, widths, etc . . . }
}

interface RowFilterDetail {
  displayName: string;
sum: number;
isSelected: boolean;
}

interface RowFilterDetails {
  [key: string]: RowFilterDetail
}

interface TableColumn {
  key: string;
  order: number;
  displayName: string;
  isVisible: boolean;
}

interface TableFilter {
  key: string;
  label: string;
  isSelected: boolean;
  data: any[];
}

// !! INITIAL STATE
const initialState: GlobalState = {
  uploadModal: false,
  appointments: {
    data: [], // data from database
    rowFilterDetails: {}, 
    allColumnHeaders: [], // all keys from first object in data array
    // TABLE SORT
    // selectedSort: {
    //   column: '',
    //   sortOrder: '',
    // },
  },
  claims: {
    data: [], // data from database
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    // TABLE FILTERS
    allRowFilters: [
      { key: 'missed', label: 'Missed', isSelected: false, data: [] },
      { key: 'owes', label: 'Owes', isSelected: false, data: [] },
      { key: 'paid', label: 'Paid', isSelected: false, data: [] },
      { key: 'processing', label: 'Processing', isSelected: false, data: [] },
      { key: 'settled', label: 'Settled', isSelected: false, data: [] },
      { key: 'transferred', label: 'Transferred', isSelected: false, data: [] },
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: '',
      sortOrder: '',
    },
  },
  patients: {
    data: [], // data from database
    filteredData: [],
    allColumnHeaders: [],
    // TABLE FILTERS
    allRowFilters: [
      { key: 'balance', label: 'Has Balance', isSelected: false, data: [] },
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: '',
      sortOrder: '',
    },
  },
  voicemail: {
    data: [], // data from database
    rowFilterDetails: {}, 
    allColumnHeaders: [],
    // TABLE SORT
    // selectedSort: {
    //   column: '',
    //   sortOrder: '',
    // },
  },
};

// define reducer function and action handlers
const reducer = (state: GlobalState, action: DispatchAction): GlobalState => {
  // helper function for flattening nested objects from server.json
  const flattenObject = (obj: { [key: string]: any }) => {
    const flattened: { [key: string]: any } = {};

    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(flattened, flattenObject(value));
      } else {
        flattened[key] = value;
      }
    });
    return flattened;
  };

  const generateOrderedColumns = (
    orderMap: string[],
    nameMap: ColumnDisplayNames
  ) => {
    return orderMap
      .map((label, index) => {
        return {
          key: label,
          order: index,
          displayName: nameMap[label],
          isVisible: true,
        };
      })
      .sort((a, b) => a.order - b.order); //### do I need to sort?
  };

const generateRowFilterDetails = (data: any[], displayNames: ColumnDisplayNames, targetColumnName: string, filterMap?: RowFilterMap) :RowFilterDetails  => {
    // Create template object from keys in ordered filter list; Initialize with zero counts and not selected
    const filterDetails = Object.fromEntries(
    Object.entries(displayNames).map(([key, _]) => [key, {displayName:displayNames[key],  sum: 0, isSelected: false}])
  );    
 // Iterate over data and update counts
 if (filterMap) {
 for (const row of data) {
  const filterKey = row[targetColumnName];

    // Check each filter group
    for (const key in filterMap) {
      if (filterMap[key].includes(filterKey)) {
        filterDetails[key].sum += 1;
      }
    }
  }
  } else {
    // console.log('Processing data without filterMap');
      for (const row of data) {
        const filterKey = row[targetColumnName];
        // console.log('Current row filterKey:', filterKey);
        // console.log('Available keys in filterDetails:', Object.keys(filterDetails));
        
        if (filterDetails[filterKey] === undefined) {
          console.log('Warning: No matching key found for:', filterKey);
          continue;
        }
        filterDetails[filterKey].sum += 1;
      }
  }
  

// Calculate total if it's in the ordered list
if (Object.keys(displayNames).includes('total')) {
  filterDetails['total'].sum = data.length
}

return filterDetails;
};

  return produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.DISPLAY_UPLOAD_MODAL:
        draft.uploadModal = action.payload;
        break;
      case ActionTypes.GET_DATA:
        // extract data and resourceType from payload
        const { resourceType, data } = action.payload;

        if (Array.isArray(data) && data.length > 0) {
          // generate list of column labels from  keys of first object in response array then filter into categories
          const flatSingleRow = flattenObject(data[0]);

          const allColumnHeaders = Object.keys(flatSingleRow).map((header) => ({
            key: header,
            value: header,
            isSelected: true,

            // !TODO: refactor this to maintain selected columns from state
            // isSelected:
            //   state.appointments.allColumns.find((h) => h.value === header)
            //     ?.isSelected || true,
          }));

          // const target =generateRowFilterDetails(data, appointmentRowFilterMap, appointmentRowDisplayNames,  'confirmationStatus');
          // console.log({ target });

          if (resourceType === 'appointments') {
            console.log({data})
            draft.appointments.data = data.map((row) => flattenObject(row));
            draft.appointments.rowFilterDetails = generateRowFilterDetails(data, appointmentRowDisplayNames, 'confirmationStatus', appointmentRowFilterMap);
            draft.appointments.allColumnHeaders = generateOrderedColumns(
              appointmentColumnOrder,
              appointmentColumnDisplayNames
            );
          } else if (resourceType === 'claims') {
            draft.claims.data = data;
            // ALL AND SELECTED COLUMNS
            draft.claims.allColumnHeaders = allColumnHeaders;
          } else if (resourceType === 'patients') {
            draft.patients.data = data;
            draft.patients.allColumnHeaders = generateOrderedColumns(
              patientColumnOrder,
              patientColumnNames
            );
          } else if (resourceType === 'voicemail') {
            // console.log(data[0])
            draft.voicemail.data = data.map((row) => flattenObject(row));
            draft.voicemail.rowFilterDetails = generateRowFilterDetails(data.filter(row => row.messageFolder === 'inbox'), voicemailRowDisplayNames, 'reason');
            draft.voicemail.allColumnHeaders = generateOrderedColumns(
              voicemailColumnOrder,
              voicemailColumnDisplayNames
            );
          } 
        }
        break;
      case ActionTypes.SET_ROW_FILTER_LIST:
        console.log('SET_ROW_FILTER_LIST PAYLOAD: ', action.payload);
        console.log(state.appointments.allRowFilters);

        // use the path name to know which object to select
        // use the filter name to know this prop to select from allRowFilters
        // use the status to toggle the isSelected value

        // get filter key from payload
        const { pathname } = action.payload;
        if (pathname.includes('appointments')) {
          draft.appointments.allRowFilters;
        }
        break;
      // default case returns state
      case ActionTypes.DELETE_VOICEMAIL:
        const id = action.payload;
        console.log('DISPATCHED ID', id);
        const target = draft.voicemail.data.find(
          (message) => message.id === id
        );
        target.messageFolder = 'trash';
        console.log({ target });

        break;
      default:
        break;
    }
  });
};

// create instance of Context object and store in variable
const GlobalContext = createContext<GlobalContextType | null>(null);

// create provider component that will wrap the application and provide the global state
const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // initialize the global state
  const [state, dispatch] = useReducer(reducer, initialState);

  // return the GlobalContext.Provider component with the global state and dispatch function as the value
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// export the GlobalContext for other components to use to access the global state and dispatch function
// export the GlobalProvider for use in the main App component, wrapping the component tree that needs access to the context
// export the ActionTypes for use in other components
// export custom types for use in other components
export { GlobalProvider, GlobalContext, ActionTypes };
export type { GlobalState, RowFilterDetails, TableColumn, TableFilter };
