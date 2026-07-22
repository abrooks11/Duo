// All state interfaces

// Main global state
export interface GlobalState {
  ui: UIState;
  appointments: AppointmentState;
  voicemail: VoicemailState;
  // reports: ReportState;
}

export interface UIState {
  uploadModal: boolean;
  // Other UI state
}

// Base interface for all resource states
export interface BaseResourceState<T> {
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
export interface VoicemailState extends BaseResourceState<VoicemailData> {
  // Voicemail-specific properties if needed
  selectedFilters: string[];
}
export interface ReportState {
  folders: ReportFolder[];
  selectedReportId: string | null;
  isCreating: boolean;
  isRunning: boolean;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  error: string | null;
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
  notes: string | null;
  officeId: null;
  officeName: null;
}

export interface ReportData {
  id: string;
  name: string;
  description: string;
  sqlQuery: string;
  cachedData: any[] | null;
  cachedAt: string | null;
  folderId: string | null;
  folder?: ReportFolder | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFolder {
  id: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  reports: ReportData[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  label: string;
  description: string;
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

export interface TableColumn {
  key: string;
  order: number;
  displayName: string;
  isVisible: boolean;
}

export interface TableFilter {
  key: string;
  label: string;
  isSelected: boolean;
  data: AppointmentData[] | VoicemailData[];
}
