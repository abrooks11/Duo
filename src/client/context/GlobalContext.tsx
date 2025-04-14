// import React, { createContext, useEffect, useReducer, useRef } from "react";
// import helper function for fetching appointments from the database
// import api from "../hooks/useApi";

// import react hooks
import React, { createContext, useReducer } from "react";

// import immer for state management
import { produce } from "immer";

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
}

const ActionTypes: GlobalStateActions = {
  DISPLAY_UPLOAD_MODAL: "DISPLAY_UPLOAD_MODAL",
  GET_DATA: "GET_DATA",
  SET_COLUMN_LIST: "SET_COLUMN_LIST",
  SET_ROW_FILTER_LIST: "SET_ROW_FILTER_LIST",
  SET_DATA_SORT: "SET_DATA_SORT",
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
  allFilters: TableFilter[]; // defined in reducer
  selectedFilters: TableFilter[];
  selectedSort: {
    column: string;
    sortOrder: string;
  };
}

interface TableColumn {
  label: string;
  value: string;
  isSelected: boolean;
}

interface TableFilter {
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
    allFilters: [
      { label: "Scheduled", isSelected: false, data: [] },
      { label: "Completed", isSelected: false, data: [] },
      { label: "Cancelled", isSelected: false, data: [] },
      { label: "No Show", isSelected: false, data: [] },
      { label: "Total", isSelected: false, data: [] },
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: "",
      sortOrder: "",
    },
  },
  claims: {
    data: [], // data from database
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
    // TABLE FILTERS
    allFilters: [
      { label: "Missed", isSelected: false, data: [] },
      { label: "Owes", isSelected: false, data: [] },
      { label: "Paid", isSelected: false, data: [] },
      { label: "Processing", isSelected: false, data: [] },
      { label: "Settled", isSelected: false, data: [] },
      { label: "X-Fer", isSelected: false, data: [] },
    ],    
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: "",
      sortOrder: "",
    },
  },
  patients: {
    data: [], // data from database
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
    // TABLE FILTERS
    allFilters: [
      { label: "Has Balance", isSelected: false, data: [] }
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: "",
      sortOrder: "",
    },
  },
  voicemail: {
    data: [], // data from database
    filteredData: [],
    // TABLE COLUMN NAMES
    allColumnHeaders: [], // all keys from first object in data array
    selectedColumnHeaders: [], // default to all columns
    // TABLE FILTERS
    allFilters: [
      { label: "Scheduled", isSelected: false, data: [] },
      { label: "Completed", isSelected: false, data: [] },
      { label: "Cancelled", isSelected: false, data: [] },
      { label: "No Show", isSelected: false, data: [] },
      { label: "Total", isSelected: false, data: [] },
    ],
    selectedFilters: [], // default to 0 filters
    // TABLE SORT
    selectedSort: {
      column: "",
      sortOrder: "",
    },
  }
};

// define reducer function and action handlers
const reducer = (state: GlobalState, action: DispatchAction): GlobalState => {
  const flattenObject = (obj: {[key:string]: any}) => {
    const flattened: {[key:string]: any} = {}
  
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
  
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value))
      } else {
        flattened[key] = value
      }
    })
  
    return flattened
  }

  return produce(state, (draft) => {

    switch (action.type) {
      case ActionTypes.DISPLAY_UPLOAD_MODAL:
        draft.uploadModal = action.payload;
        break;
      case ActionTypes.GET_DATA:
        // extract data and dataType from payload
        const { dataType, data } = action.payload;

        // if the data is an array and has length, check the dataType
        // generate allColumns from  keys of first object in data array,
        // generate selectedColumns from allColumns,
        // generate filter list table
        if (Array.isArray(data) && data.length > 0) {
          // ALL COLUMNS
          const flatSingleRow = flattenObject(data[0])
          // console.log("FLAT DATA:", flatSingleRow)
          const allColumnHeaders = Object.keys(flatSingleRow).map((header) => (
            {
            label: header,
            value: header,
            isSelected: true,
            // !TODO: refactor this to maintain selected columns from state
            // isSelected:
            //   state.appointments.allColumns.find((h) => h.value === header)
            //     ?.isSelected || true,
          }
        ));


          if (dataType === "patients") {
            draft.patients.data = data;
            // ALL AND SELECTED COLUMNS
            draft.patients.allColumnHeaders = allColumnHeaders;
            draft.patients.selectedColumnHeaders = allColumnHeaders.filter(
              (column) => column.isSelected
            );
          } else if (dataType === "appointments") {
            draft.appointments.data = data.map((row)=>flattenObject(row));
            // ALL AND SELECTED COLUMNS
            draft.appointments.allColumnHeaders = allColumnHeaders;
            draft.appointments.selectedColumnHeaders = allColumnHeaders.filter(
              (column) => column.isSelected
            );
          } else if (dataType === "claims") {
            draft.claims.data = data;
            // ALL AND SELECTED COLUMNS
            draft.claims.allColumnHeaders = allColumnHeaders;
            draft.claims.selectedColumnHeaders = allColumnHeaders.filter(
              (column) => column.isSelected
            );
          }
        }
        break;
      case ActionTypes.SET_ROW_FILTER_LIST:
      console.log("SET_ROW_FILTER_LIST PAYLOAD: ", action.payload);
      console.log(state.appointments.allFilters);

      // use the path name to know which object to select (appt, claims or patiets)
      // use the filter name to know this prop to select from allFilters
      // use the status to toggle the isSelected value
      
     // get filter key from payload
      const { componentFilterName, selectStatus, pathname } = action.payload;
        if (pathname.includes('appointments')) {
          draft.appointments.allFilters
        }
        break;
      // default case returns state
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
