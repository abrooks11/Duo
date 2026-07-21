// Root Reducer: Export for all reducers

import type {
  AppAction,
  AppointmentAction,
  VoicemailAction,
  ReportAction,
} from '../types/actions';

import type { GlobalState, ClaimState, PatientState } from '../types/state';

import {
  appointmentReducer,
  initialAppointmentState,
} from './appointmentReducer';

import { voicemailReducer, initialVoicemailState } from './voicemailReducer';

import { reportReducer, initialReportState } from './reportReducer';

const initialClaimState: ClaimState = {
  data: [],
  rowFilterDetails: {},
  allColumnHeaders: [],
  selectedDateRange: [{ startDate: new Date(), endDate: new Date(), key: 'selection', color: '#3d91ff' }],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedFilters: [],
};

const initialPatientState: PatientState = {
  data: [],
  rowFilterDetails: {},
  allColumnHeaders: [],
  selectedDateRange: [{ startDate: new Date(), endDate: new Date(), key: 'selection', color: '#3d91ff' }],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedFilters: [],
};

// Combined initial state
export const initialGlobalState: GlobalState = {
  ui: {uploadModal: false},
  appointments: initialAppointmentState,
  claims: initialClaimState,
  patients: initialPatientState,
  voicemail: initialVoicemailState,
  reports: initialReportState,
};

// Root reducer that delegates to domain reducers
export const rootReducer = (
  state: GlobalState,
  action: AppAction
): GlobalState => {
  // Handle domain-specific actions

 if (action.type.startsWith('ui/')) {
   switch (action.type) {
     case 'ui/DISPLAY_UPLOAD_MODAL':
       return {
         ...state,
         ui: {
           ...state.ui,
           uploadModal: action.payload.isOpen,
         },
       };
     default:
       return state;
   }
 }
  if (action.type.startsWith('appointments/')) {
    return {
      ...state,
      appointments: appointmentReducer(
        state.appointments,
        action as AppointmentAction
      ),
    };
  }

  // if (action.type.startsWith('claims/')) {
  //   return {
  //     ...state,
  //     claims: claimReducer(state.claims, action as ClaimAction)
  //   };
  // }

  // if (action.type.startsWith('patients/')) {
  //   return {
  //     ...state,
  //     patients: patientReducer(state.patients, action as PatientAction)
  //   };
  // }

  if (action.type.startsWith('voicemail/')) {
    return {
      ...state,
      voicemail: voicemailReducer(state.voicemail, action as VoicemailAction),
    };
  }

  if (action.type.startsWith('reports/')) {
    return {
      ...state,
      reports: reportReducer(state.reports, action as ReportAction),
    };
  }

  // Default case
  return state;
};

export { appointmentActions } from './appointmentReducer';
export { voicemailActions } from './voicemailReducer';
export { reportActions } from './reportReducer';