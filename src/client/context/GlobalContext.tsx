// import React, { createContext, useEffect, useReducer, useRef } from "react";
// import helper function for fetching appointments from the database
// import api from "../hooks/useApi";

// import react hooks
import React, { createContext, useReducer } from 'react';

// import immer for state management
import { produce } from 'immer';

import {
  appointmentMap,
  appointmentColumnOrder,
  appointmentColumnNames,
  voicemailColumnOrder,
  voicemailColumnNames,
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
  appointments: DataObject;
  claims: DataObject;
  patients: DataObject;
  voicemail: DataObject;
}

interface DataObject {
  data: any[];
  filteredData: any[];
  allColumnHeaders: TableColumn[]; // get from keys of first object in data array
  selectedColumnHeaders: TableColumn[];
  allRowFilters: TableFilter[]; // defined in reducer
  selectedFilters: TableFilter[];
  selectedSort: {
    column: string;
    sortOrder: string;
  };
  // Add column configuration
  columnConfig: {
    orderMap: Record<string, number>;
    displayNames?: Record<string, string>;
    widths?: Record<string, number>;
    // Additional column properties as needed
    additionalProps?: Record<string, any>;
  };
}

interface TableColumn {
  label: string;
  value: string;
  isSelected: boolean;
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
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
    // TABLE FILTERS
    allRowFilters: [
      { key: 'scheduled', label: 'Scheduled', isSelected: false, data: [] },
      { key: 'completed', label: 'Completed', isSelected: false, data: [] },
      { key: 'cancelled', label: 'Cancelled', isSelected: false, data: [] },
      { key: 'noShow', label: 'No Show', isSelected: false, data: [] },
      { key: 'total', label: 'Total', isSelected: false, data: [] },
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: '',
      sortOrder: '',
    },
    columnConfig: {
      orderMap: appointmentColumnOrder,
      displayNames: appointmentColumnNames,
      // widths?: Record<string, number>;
      // // Additional column properties as needed
      // additionalProps?: Record<string, any>;
    },
  },
  claims: {
    data: [], // data from database
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
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
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
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
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
    // TABLE FILTERS
    allRowFilters: [
      { key: 'admin', label: 'Admin', isSelected: false, data: [] },
      { key: 'appointment', label: 'Appointment', isSelected: false, data: [] },
      { key: 'memo', label: 'Memo', isSelected: false, data: [] },
      { key: 'misc', label: 'Misc', isSelected: false, data: [] },
      {
        key: 'prescription',
        label: 'Prescription',
        isSelected: false,
        data: [],
      },
      { key: 'referral', label: 'Referral', isSelected: false, data: [] },
      {
        key: 'recordRequest',
        label: 'Record Request',
        isSelected: false,
        data: [],
      },
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: '',
      sortOrder: '',
    },
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

  const generateOrderedColumns = (orderMap :string[], nameMap) => {
    return orderMap.map((label, index) => {
      return {
        key: label, 
        order: index,
        displayName: nameMap[label],
        isVisible: true,
      }
    }).sort((a,b) => a.order - b.order)
  }


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

          const target = generateOrderedColumns(appointmentColumnOrder, appointmentColumnNames)
          console.log({ target });

          if (resourceType === 'patients') {
            // assign database response, column labels to
            draft.patients.data = data;
            // ALL AND SELECTED COLUMNS
            draft.patients.allColumnHeaders = allColumnHeaders;
            draft.patients.selectedColumnHeaders = allColumnHeaders.filter(
              (column) => column.isSelected
            );
          } else if (resourceType === 'appointments') {
            // Flatten and map the raw appointment data through the flattenObject function; assign to global
            draft.appointments.data = data.map((row) => flattenObject(row));
            // All columns are initially marked as selected (isSelected: true)
            draft.appointments.allColumnHeaders = generateOrderedColumns(appointmentColumnOrder, appointmentColumnNames);
            // Filter to only keep the selected columns
            draft.appointments.selectedColumnHeaders = allColumnHeaders.filter(
              (column) => column.isSelected
            );

            // Process and categorize appointments based on their confirmation status
            // Uses reduce to build filtered lists for each status category
            const filteredData = data.reduce((acc, currentRow, index) => {
              // Extract the confirmation status from the current appointment
              const { confirmationStatus } = currentRow;

              // For each category in the appointmentMap (scheduled, completed, cancelled, etc.)
              for (const key in appointmentMap) {
                // Check if current appointment's status matches this category
                if (appointmentMap[key].includes(confirmationStatus)) {
                  // Find the index of the current category in our accumulator array
                  const targetIndex = acc.findIndex(
                    (element) => element.key === key
                  );
                  // Find the index of the 'total' category which tracks all appointments
                  const totalIndex = acc.findIndex(
                    (element) => element.key === 'total'
                  );

                  // If category not found in accumulator (shouldn't happen, but safety check)
                  if (targetIndex === -1) {
                    console.log('key not found for ', confirmationStatus);
                    return acc;
                  }

                  // Add the appointment to its specific category
                  acc[targetIndex].data.push(currentRow);
                  // Also add it to the 'total' category which tracks all appointments
                  acc[totalIndex].data.push(currentRow);
                }
              }
              // Return the updated accumulator for the next iteration
              return acc;
            }, draft.appointments.allRowFilters);
          } else if (resourceType === 'claims') {
            draft.claims.data = data;
            // ALL AND SELECTED COLUMNS
            draft.claims.allColumnHeaders = allColumnHeaders;
            draft.claims.selectedColumnHeaders = allColumnHeaders.filter(
              (column) => column.isSelected
            );
          } else if (resourceType === 'voicemail') {
            console.log(data[0])
            draft.voicemail.data = data;
            const neededKeys = [
              'callerName',
              'callerNumber',
              'callerType',
              'createdDate',
              'duration',
              'id',
              'messageFolder',
              'officeId',
              'officeName',
              'reason',
              'status',
              'transcription',
            ];
            const neededColumns = allColumnHeaders.filter((header) =>
              neededKeys.includes(header.label)
            );
            draft.voicemail.allColumnHeaders = generateOrderedColumns(voicemailColumnOrder, voicemailColumnNames);;
            // console.log(neededColumns);
            draft.voicemail.selectedColumnHeaders = neededColumns.filter(
              (column) => column.isSelected
            );
          }
        }
        break;
      case ActionTypes.SET_ROW_FILTER_LIST:
        console.log('SET_ROW_FILTER_LIST PAYLOAD: ', action.payload);
        console.log(state.appointments.allRowFilters);

        // use the path name to know which object to select (appt, claims or patiets)
        // use the filter name to know this prop to select from allRowFilters
        // use the status to toggle the isSelected value

        // get filter key from payload
        const { componentFilterName, selectStatus, pathname } = action.payload;
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
export type { GlobalState, TableColumn, TableFilter };
