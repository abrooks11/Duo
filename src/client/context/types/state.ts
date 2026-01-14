// All state interfaces

// Main global state
export interface GlobalState {
  ui: UIState;
  appointments: AppointmentState;
  claims: ClaimState;
  patients: PatientState;
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

export interface ClaimState extends BaseResourceState<ClaimData> {
  // Claim-specific properties
  selectedFilters: TableFilter[];
  // filteredData: ClaimData[];
  // allRowFilters: TableFilter[];
}

export interface PatientState extends BaseResourceState<PatientData> {
  // Patient-specific properties
  selectedFilters: TableFilter[];
  // filteredData: PatientData[];
  // allRowFilters: TableFilter[];
}

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

export interface ClaimData {}

export interface PatientData {
  id: number;
  createdDate: Date;
  lastModifiedDate: Date;
  patientFullName: string;
  dob: Date;
  mobilePhone: string;
  primaryInsurancePolicyCompanyId: null;
  primaryInsurancePolicyCompanyName: string;
  primaryInsurancePolicyPlanId: null;
  primaryInsurancePolicyPlanName: string;
  primaryInsurancePolicyPlanAddressLine1: string;
  primaryInsurancePolicyPlanCity: string;
  primaryInsurancePolicyPlanState: string | null;
  primaryInsurancePolicyPlanZipCode: number | null;
  primaryInsurancePolicyNumber: string | null;
  secondaryInsurancePolicyCompanyId: number | null;
  secondaryInsurancePolicyCompanyName: string | null;
  secondaryInsurancePolicyPlanId: number | null;
  secondaryInsurancePolicyPlanName: string | null;
  secondaryInsurancePolicyPlanAddressLine1: string | null;
  secondaryInsurancePolicyPlanCity: string | null;
  secondaryInsurancePolicyPlanState: string | null;
  secondaryInsurancePolicyPlanZipCode: number | null;
  secondaryInsurancePolicyNumber: string | null;
  alertMessage: string | null;
  lastAppointmentDate: Date | null;
  lastEncounterDate: Date | null;
  lastStatementDate: Date | null;
  insuranceBalance: number | null;
  patientBalance: number | null;
  totalBalance: number | null;
}

export interface VoicemailData {
  id: string;
  callerNumber: string;
  callerName: string;
  createdDate: Date;
  duration: number;
  messageFolder: string;
  status: string;
  transcription: string;
  callerType: string;
  reason: string;
  notes: null;
  officeId: null;
  officeName: null;
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
