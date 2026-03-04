// All action types
import type { AppointmentData, VoicemailData, DateRangeObject, ReportFolder, ReportData } from './state';

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
  DELETE_VOICEMAIL: 'voicemail/DELETE_VOICEMAIL';
  TOGGLE_VOICEMAIL_FILTER: 'voicemail/TOGGLE_FILTER';
  SET_VOICEMAIL_DATE_RANGE: 'voicemail/SET_DATE_RANGE';
  SET_VOICEMAIL_LOADING: 'voicemail/SET_LOADING';
  SET_VOICEMAIL_ERROR: 'voicemail/SET_ERROR';
}

export type VoicemailAction =
  | { type: 'voicemail/GET_VOICEMAIL'; payload: { data: VoicemailData[] } }
  | { type: 'voicemail/DELETE_VOICEMAIL'; payload: { id: string } }
  | { type: 'voicemail/TOGGLE_FILTER'; payload: { filterKey: string } }
  | {
      type: 'voicemail/SET_DATE_RANGE';
      payload: { dateRange: DateRangeObject[] };    }
  | { type: 'voicemail/SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'voicemail/SET_ERROR'; payload: { error: string | null } };

export interface ReportActions {
  GET_FOLDERS: 'reports/GET_FOLDERS';
  SELECT_REPORT: 'reports/SELECT_REPORT';
  SET_CREATING: 'reports/SET_CREATING';
  SET_RUNNING: 'reports/SET_RUNNING';
  ADD_REPORT: 'reports/ADD_REPORT';
  UPDATE_REPORT: 'reports/UPDATE_REPORT';
  DELETE_REPORT: 'reports/DELETE_REPORT';
  ADD_FOLDER: 'reports/ADD_FOLDER';
  UPDATE_FOLDER: 'reports/UPDATE_FOLDER';
  DELETE_FOLDER: 'reports/DELETE_FOLDER';
  SET_UNSAVED: 'reports/SET_UNSAVED';
  SET_LOADING: 'reports/SET_LOADING';
  SET_ERROR: 'reports/SET_ERROR';
}

export type ReportAction =
  | { type: 'reports/GET_FOLDERS'; payload: { folders: ReportFolder[] } }
  | { type: 'reports/SELECT_REPORT'; payload: { reportId: string | null } }
  | { type: 'reports/SET_CREATING'; payload: { isCreating: boolean } }
  | { type: 'reports/SET_RUNNING'; payload: { isRunning: boolean } }
  | { type: 'reports/ADD_REPORT'; payload: { report: ReportData } }
  | { type: 'reports/UPDATE_REPORT'; payload: { report: ReportData } }
  | { type: 'reports/DELETE_REPORT'; payload: { reportId: string } }
  | { type: 'reports/ADD_FOLDER'; payload: { folder: ReportFolder } }
  | { type: 'reports/UPDATE_FOLDER'; payload: { folder: ReportFolder } }
  | { type: 'reports/DELETE_FOLDER'; payload: { folderId: string } }
  | { type: 'reports/SET_UNSAVED'; payload: { hasUnsavedChanges: boolean } }
  | { type: 'reports/SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'reports/SET_ERROR'; payload: { error: string | null } };

// Combined action type
export type AppAction = UIAction | AppointmentAction | VoicemailAction | ReportAction;
