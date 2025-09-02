// All action types
import type { AppointmentData, VoicemailData, DateRangeObject } from './state';

export interface UIActions {
  DISPLAY_UPLOAD_MODAL: 'ui/DISPLAY_UPLOAD_MODAL';
}

export type UIAction = {
  type: 'ui/DISPLAY_UPLOAD_MODAL';
  payload: { isOpen: boolean };
};

export interface AppointmentActions {
  GET_APPOINTMENTS: 'appointments/GET_APPOINTMENTS';
  TOGGLE_APPOINTMENT_FILTER: 'appointments/TOGGLE_FILTER';
  SET_APPOINTMENT_DATE_RANGE: 'appointments/SET_DATE_RANGE';
  SET_APPOINTMENTS_LOADING: 'appointments/SET_LOADING';
  SET_APPOINTMENTS_ERROR: 'appointments/SET_ERROR';
}

export type AppointmentAction =
  | {
      type: 'appointments/GET_APPOINTMENTS';
      payload: { data: AppointmentData[] };
    }
  | { type: 'appointments/TOGGLE_FILTER'; payload: { filterKey: string } }
  | {
      type: 'appointments/SET_DATE_RANGE';
      payload: { dateRange: DateRangeObject[] };
    }
  | { type: 'appointments/SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'appointments/SET_ERROR'; payload: { error: string | null } };

export interface VoicemailActions {
  GET_VOICEMAIL: 'voicemail/GET_VOICEMAIL';
  TOGGLE_VOICEMAIL_FILTER: 'voicemail/TOGGLE_FILTER';
  SET_VOICEMAIL_DATE_RANGE: 'voicemail/SET_DATE_RANGE';
  SET_VOICEMAIL_LOADING: 'voicemail/SET_LOADING';
  SET_VOICEMAIL_ERROR: 'voicemail/SET_ERROR';
}

export type VoicemailAction =
  | { type: 'voicemail/GET_VOICEMAIL'; payload: { data: VoicemailData[] } }
  | { type: 'voicemail/TOGGLE_FILTER'; payload: { filterKey: string } }
  | {
      type: 'voicemail/SET_DATE_RANGE';
      payload: { dateRange: DateRangeObject[] };    }
  | { type: 'voicemail/SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'voicemail/SET_ERROR'; payload: { error: string | null } };

// Combined action type
export type AppAction = UIAction | AppointmentAction | VoicemailAction;
