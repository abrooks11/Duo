export interface ColumnDisplayNames {
  [key: string]: string;
}
export interface RowDisplayNames {
  [key: string]: string;
}

export interface RowFilterMap {
  [key: string]: string[];
}

// APPOINTMENTS
export const appointmentRowFilterMap: RowFilterMap = {
  // values are read; key is returned
  scheduled: ['Scheduled', 'Confirmed'],
  completed: ['Check-out'],
  cancelled: ['Cancelled'],
  noShow: ['No-show'],
};

export const appointmentRowFilterOrder: string[] = [
  'scheduled',
  'completed',
  'cancelled',
  'noShow',
  'total',
];

export const appointmentRowDisplayNames: RowDisplayNames = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  noShow: 'No Show',
  total: 'Total',
};

export const appointmentColumnOrder: string[] = [
  'actions',
  'insEligibility',
  'patientCopay',
  'patientBalance',
  'startDate',
  'confirmationStatus',
  'patientFullName',
  'patientCaseName',
  'primaryInsurancePolicyNumber',
  'appointmentReason',
  'notes',
  'alertMessage',
  'id',
  'createdDate',
  'lastModifiedDate',
  'patientId',
];

export const appointmentColumnDisplayNames: ColumnDisplayNames = {
  actions: 'Actions',
  insEligibility: 'Eligibility', // custom
  patientCopay: 'Co-Pay', // custom
  patientBalance: 'Balance',
  patientFullName: 'Name',
  patientCaseName: 'Insurance',
  primaryInsurancePolicyNumber: 'Member ID',
  appointmentReason: 'Reason',
  notes: 'Notes',
  confirmationStatus: 'Confirmation',
  startDate: 'Date',
  alertMessage: 'Patient Alert',
  id: 'ID - Appointment', // appointment id
  createdDate: 'Created',
  lastModifiedDate: 'Modified',
  patientId: 'ID - Patient',
};

// PATIENTS
export const patientColumnOrder: string[] = [
  'id',
  'patientFullName',
  'dob',
  'mobilePhone',
  'primaryInsurancePolicyPlanName',
  'primaryInsurancePolicyNumber',
  'primaryInsurancePolicyPlanAddressLine1',
  'secondaryInsurancePolicyPlanName',
  'secondaryInsurancePolicyNumber',
  'secondaryInsurancePolicyPlanAddressLine1',
  'alertMessage',
  'lastAppointmentDate',
  'lastEncounterDate',
  'lastStatementDate',
  'insuranceBalance',
  'patientBalance',
  'totalBalance',

  'createdDate',
  'lastModifiedDate',
  'primaryInsurancePolicyCompanyName',
  'primaryInsurancePolicyCompanyId',
  'primaryInsurancePolicyPlanId',
  'primaryInsurancePolicyPlanCity',
  'primaryInsurancePolicyPlanState',
  'primaryInsurancePolicyPlanZipCode',
  'secondaryInsurancePolicyCompanyId',
  'secondaryInsurancePolicyCompanyName',
  'secondaryInsurancePolicyPlanId',
  'secondaryInsurancePolicyPlanCity',
  'secondaryInsurancePolicyPlanState',
  'secondaryInsurancePolicyPlanZipCode',
];
export const patientColumnNames: ColumnDisplayNames = {
  id: 'id',
  patientFullName: 'Full Name',
  dob: 'Date of Birth',
  mobilePhone: 'Mobile Phone',
  primaryInsurancePolicyPlanName: 'Primary Insurance',
  primaryInsurancePolicyPlanAddressLine1: 'Primary PO Box',
  primaryInsurancePolicyNumber: 'Primary Policy ID',
  secondaryInsurancePolicyPlanName: 'Secondary Insurance',
  secondaryInsurancePolicyPlanAddressLine1: 'Secondary PO Box',
  secondaryInsurancePolicyNumber: 'Secondary Policy ID',
  alertMessage: 'Alert Message',
  lastAppointmentDate: 'Last Appointment',
  lastEncounterDate: 'Last Encounter',
  lastStatementDate: 'Last Statement Date',
  insuranceBalance: 'Insurance Balance',
  patientBalance: 'Patient Balance',
  totalBalance: 'Total Balance',

  createdDate: 'createdDate',
  lastModifiedDate: 'lastModifiedDate',
  primaryInsurancePolicyPlanCity: 'primaryInsurancePolicyPlanCity',
  primaryInsurancePolicyPlanState: 'primaryInsurancePolicyPlanState',
  primaryInsurancePolicyCompanyId: 'primaryInsurancePolicyCompanyId',
  primaryInsurancePolicyCompanyName: 'primaryInsurancePolicyCompanyName',
  primaryInsurancePolicyPlanId: 'primaryInsurancePolicyPlanId',
  primaryInsurancePolicyPlanZipCode: 'primaryInsurancePolicyPlanZipCode',
  secondaryInsurancePolicyCompanyId: 'secondaryInsurancePolicyCompanyId',
  secondaryInsurancePolicyCompanyName: 'secondaryInsurancePolicyCompanyName',
  secondaryInsurancePolicyPlanId: 'secondaryInsurancePolicyPlanId',
  secondaryInsurancePolicyPlanCity: 'secondaryInsurancePolicyPlanCity',
  secondaryInsurancePolicyPlanState: 'secondaryInsurancePolicyPlanState',
  secondaryInsurancePolicyPlanZipCode: 'secondaryInsurancePolicyPlanZipCode',
};

// CLAIMS
export const claimRowDisplayNames = [
  'Missed',
  'Owes',
  'Paid',
  'Processing',
  'Settled',
  'Transferred',
];

// VOICEMAIL
export const voicemailRowDisplayNames: RowDisplayNames = {
  appointment: 'Appointment',
  lab: 'Labs',
  memo: 'Memo',
  misc: 'Misc',
  prescription: 'Prescription',
  recordRequest: 'Record Request',
  referral: 'Referral',
  total: 'Total',
};

export const voicemailColumnOrder: string[] = [
  'createdDate',
  'callerName',
  'callerNumber',
  'callerType',
  'duration',
  'reason',
  'transcription',
  'notes',
  'actions',
  // 'status',
  // 'id',
  // 'messageFolder',
  // 'officeId',
  // 'officeName,',
];

export const voicemailColumnDisplayNames: ColumnDisplayNames = {
  actions: 'Actions',
  callerName: 'Caller Name',
  callerNumber: 'Caller Number',
  callerType: 'Caller Type',
  createdDate: 'Date',
  duration: 'Duration',
  id: 'Call ID',
  messageFolder: 'Message Folder',
  officeId: 'Office Id',
  officeName: 'Office name',
  notes: 'Notes',
  reason: 'Reason',
  status: 'Status',
  transcription: 'Transcription',
};
