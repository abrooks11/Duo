// All state interfaces

// Main global state
export interface GlobalState {
  ui: UIState;
  appointments: AppointmentState;
//   claims: ClaimState;
//   patients: PatientState;
  voicemail: VoicemailState;
}

export interface UIState {
  uploadModal: boolean;
  // Other UI state
}

// Base interface for all resource states
export interface BaseResourceState<T = any> {
  data: T[];
  rowFilterDetails: RowFilterDetails;
  allColumnHeaders: TableColumn[];
  selectedDateRange: DateRangeObject[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface AppointmentState extends BaseResourceState<AppointmentData> {
  // Appointment-specific properties
  selectedFilters: string[];
}

// export interface ClaimState extends BaseResourceState<ClaimData> {
//   filteredData: ClaimData[];
//   allRowFilters: TableFilter[];
//   selectedFilters: TableFilter[];
// }

// export interface PatientState extends BaseResourceState<PatientData> {
//   filteredData: PatientData[];
//   allRowFilters: TableFilter[];
//   selectedFilters: TableFilter[];
// }

export interface VoicemailState extends BaseResourceState<VoicemailData> {
  // Voicemail-specific properties if needed
  selectedFilters: string[];
}

export interface AppointmentData {
  id: number;
  createdDate: Date;
  lastModifiedDate: Date;
  appointmentReason: string;
  confirmationStatus: string;
  patientCaseName: string;
  startDate: Date;
  notes: string;
  insEligibility: string | null;
  patientCopay: number | null;
  patientId: number;
  patientFullName: string;
  dob: Date;
  primaryInsurancePolicyNumber: string;
  alertMessage: string | null;
  patientBalance: number | null;
}

export interface VoicemailData {
    id: number
}

export interface DateRangeObject {
  startDate: Date;
  endDate: Date; // Initially set to the same day for single day selection
  key: string;
  color: string;
}

interface RowFilterDetail {
  displayName: string;
  sum: number;
  isSelected: boolean;
}

export interface RowFilterDetails {
  [key: string]: RowFilterDetail;
}

interface TableColumn {
  key: string;
  order: number;
  displayName: string;
  isVisible: boolean;
}

export interface TableFilter {
  key: string;
  label: string;
  isSelected: boolean;
  data: any[];
}
