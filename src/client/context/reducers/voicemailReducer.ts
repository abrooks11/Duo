import { produce } from 'immer';

import type {
  VoicemailState,
  VoicemailData,
  DateRangeObject,
} from '../types/state';

import type { VoicemailAction } from '../types/actions';

import {
  generateOrderedColumns,
  generateRowFilterDetails,
} from '../../utils/stateHelpers';

import {
  voicemailRowDisplayNames,
  voicemailColumnOrder,
  voicemailColumnDisplayNames,
} from '../../utils/keyMappings';

export const initialVoicemailState: VoicemailState = {
  data: [],
  rowFilterDetails: {},
  allColumnHeaders: [],
  selectedDateRange: [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
      color: '#3d91ff',
    },
  ],
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedFilters: [],
};

export const voicemailReducer = (
  state: VoicemailState,
  action: VoicemailAction
): VoicemailState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'voicemail/GET_VOICEMAIL':
        draft.data = action.payload.data;
        draft.isLoading = false;
        draft.error = null;
        draft.lastUpdated = new Date();

        // Generate filter details
        draft.rowFilterDetails = generateRowFilterDetails(
          action.payload.data,
          voicemailRowDisplayNames,
          'reason',
        );

        // Generate column headers
        draft.allColumnHeaders = generateOrderedColumns(
          voicemailColumnOrder,
          voicemailColumnDisplayNames
        );
        break;

      case 'voicemail/SET_LOADING':
        draft.isLoading = action.payload.isLoading;
        if (action.payload.isLoading) {
          draft.error = null;
        }
        break;

      case 'voicemail/SET_ERROR':
        draft.error = action.payload.error;
        draft.isLoading = false;
        break;

      case 'voicemail/TOGGLE_FILTER':
        const { filterKey } = action.payload;
        if (draft.rowFilterDetails[filterKey]) {
          draft.rowFilterDetails[filterKey].isSelected =
            !draft.rowFilterDetails[filterKey].isSelected;
        }
        break;

      case 'voicemail/SET_DATE_RANGE':
        draft.selectedDateRange = action.payload.dateRange;
        break;

      default:
        // TypeScript will ensure this is never reached
        break;
    }
  });
};

// Action creators for voicemail
export const voicemailActions = {
  getVoicemail: (data: VoicemailData[]): VoicemailAction => ({
    type: 'voicemail/GET_VOICEMAIL',
    payload: { data }
  }),
  
  setLoading: (isLoading: boolean): VoicemailAction => ({
    type: 'voicemail/SET_LOADING',
    payload: { isLoading }
  }),
  
  setError: (error: string | null): VoicemailAction => ({
    type: 'voicemail/SET_ERROR',
    payload: { error }
  }),
  
  toggleFilter: (filterKey: string): VoicemailAction => ({
    type: 'voicemail/TOGGLE_FILTER',
    payload: { filterKey }
  }),
  
  setDateRange: (dateRange: DateRangeObject[]): VoicemailAction => ({
    type: 'voicemail/SET_DATE_RANGE',
    payload: { dateRange }
  })
};