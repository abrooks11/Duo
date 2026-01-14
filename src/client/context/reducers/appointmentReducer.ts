import { produce } from 'immer';

import type { AppointmentState, AppointmentData, DateRangeObject} from '../types/state';

import type { AppointmentAction } from '../types/actions';

import {
  generateOrderedColumns,
  generateRowFilterDetails,
} from '../../utils/stateHelpers';

import {
  appointmentRowFilterMap,
  appointmentRowDisplayNames,
  appointmentColumnOrder,
  appointmentColumnDisplayNames,
} from '../../utils/keyMappings';

// Initial state for appointments
export const initialAppointmentState: AppointmentState = {
  data: [],
  rowFilterDetails: {},
  allColumnHeaders: [],
  selectedDateRange: [{
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
    color: '#3d91ff',
  }],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedFilters: [],
};

// Appointment reducer
export const appointmentReducer = (
  state: AppointmentState,
  action: AppointmentAction
): AppointmentState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'appointments/GET_APPOINTMENTS':
        draft.data = action.payload.data;
        draft.isLoading = false;
        draft.error = null;
        draft.lastUpdated = new Date();

        // Generate filter details
        draft.rowFilterDetails = generateRowFilterDetails(
          action.payload.data,
          appointmentRowDisplayNames,
          'confirmationStatus',
          appointmentRowFilterMap
        );

        // Generate column headers
        draft.allColumnHeaders = generateOrderedColumns(
          appointmentColumnOrder,
          appointmentColumnDisplayNames
        );
        break;

      case 'appointments/SET_LOADING':
        draft.isLoading = action.payload.isLoading;
        if (action.payload.isLoading) {
          draft.error = null;
        }
        break;

      case 'appointments/SET_ERROR':
        draft.error = action.payload.error;
        draft.isLoading = false;
        break;

      case 'appointments/TOGGLE_FILTER':
        const { filterKey } = action.payload;
        if (draft.rowFilterDetails[filterKey]) {
          draft.rowFilterDetails[filterKey].isSelected =
            !draft.rowFilterDetails[filterKey].isSelected;
        }
        break;

      case 'appointments/SET_DATE_RANGE':
        draft.selectedDateRange = action.payload.dateRange;
        break;

      default:
        // TypeScript will ensure this is never reached
        break;
    }
  });
};

// Action creators for appointments
export const appointmentActions = {
  getAppointments: (data: AppointmentData[]): AppointmentAction => ({
    type: 'appointments/GET_APPOINTMENTS',
    payload: { data }
  }),
  
  setLoading: (isLoading: boolean): AppointmentAction => ({
    type: 'appointments/SET_LOADING',
    payload: { isLoading }
  }),
  
  setError: (error: string | null): AppointmentAction => ({
    type: 'appointments/SET_ERROR',
    payload: { error }
  }),
  
  toggleFilter: (filterKey: string): AppointmentAction => ({
    type: 'appointments/TOGGLE_FILTER',
    payload: { filterKey }
  }),
  
  setDateRange: (dateRange: DateRangeObject[]): AppointmentAction => ({
    type: 'appointments/SET_DATE_RANGE',
    payload: { dateRange }
  })
};