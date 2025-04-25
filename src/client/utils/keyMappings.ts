export interface DisplayNames {
  [key: string]: string;
}

// APPOINTMENTS
export const appointmentMap = {
  // values are read; key is returned
  scheduled: ['Scheduled', 'Confirmed'],
  completed: ['Check-out'],
  cancelled: ['Cancelled'],
  noShow: ['No-show'],
};

export const appointmentColumnOrder: string[] = [
  'insuranceStatus',
  'copay',
  'patientBalance',
  'confirmationStatus',
  'patientFullName',
  'patientCaseName',
  'primaryInsurancePolicyNumber',
  'appointmentReason',
  'notes',
  'startDate',
  'alertMessage',
  'id',
  'createdDate',
  'lastModifiedDate',
  'patientId',
];

export const appointmentColumnNames: DisplayNames = {
  insuranceStatus: 'Eligibility', // custom
  copay: 'Co-Pay', // custom
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
    "id",
    "patientFullName",
    "dob",
    "mobilePhone",
    "primaryInsurancePolicyPlanName",
    "primaryInsurancePolicyNumber",
    "primaryInsurancePolicyPlanAddressLine1",
    "secondaryInsurancePolicyPlanName",
    "secondaryInsurancePolicyNumber",
    "secondaryInsurancePolicyPlanAddressLine1",
    "alertMessage",
    "lastAppointmentDate",
    "lastEncounterDate",
    "lastStatementDate",
    "insuranceBalance",
    "patientBalance",
    "totalBalance", 

    "createdDate",
    "lastModifiedDate",
    "primaryInsurancePolicyCompanyName",
    "primaryInsurancePolicyCompanyId",
    "primaryInsurancePolicyPlanId",
    "primaryInsurancePolicyPlanCity",
    "primaryInsurancePolicyPlanState",
    "primaryInsurancePolicyPlanZipCode",
    "secondaryInsurancePolicyCompanyId",
    "secondaryInsurancePolicyCompanyName",
    "secondaryInsurancePolicyPlanId",
    "secondaryInsurancePolicyPlanCity",
    "secondaryInsurancePolicyPlanState",
    "secondaryInsurancePolicyPlanZipCode",
]
export const patientColumnNames: DisplayNames = {
  id:"id",
  patientFullName:"Full Name",
  dob:"Date of Birth",
  mobilePhone:"Mobile Phone",
  primaryInsurancePolicyPlanName:"Primary Insurance",
  primaryInsurancePolicyPlanAddressLine1:"Primary PO Box",
  primaryInsurancePolicyNumber:"Primary Policy ID",
  secondaryInsurancePolicyPlanName:"Secondary Insurance",
  secondaryInsurancePolicyPlanAddressLine1:"Secondary PO Box",
  secondaryInsurancePolicyNumber:"Secondary Policy ID",
  alertMessage:"Alert Message",
  lastAppointmentDate:"Last Appointment",
  lastEncounterDate:"Last Encounter",
  lastStatementDate:"Last Statement Date",
  insuranceBalance:"Insurance Balance",
  patientBalance:"Patient Balance",
  totalBalance:"Total Balance",


  createdDate:"createdDate",
  lastModifiedDate:"lastModifiedDate",
  primaryInsurancePolicyPlanCity:"primaryInsurancePolicyPlanCity",
  primaryInsurancePolicyPlanState:"primaryInsurancePolicyPlanState",
  primaryInsurancePolicyCompanyId:"primaryInsurancePolicyCompanyId",
  primaryInsurancePolicyCompanyName:"primaryInsurancePolicyCompanyName",
  primaryInsurancePolicyPlanId:"primaryInsurancePolicyPlanId",
  primaryInsurancePolicyPlanZipCode:"primaryInsurancePolicyPlanZipCode",
  secondaryInsurancePolicyCompanyId:"secondaryInsurancePolicyCompanyId",
  secondaryInsurancePolicyCompanyName:"secondaryInsurancePolicyCompanyName",
  secondaryInsurancePolicyPlanId:"secondaryInsurancePolicyPlanId",
  secondaryInsurancePolicyPlanCity:"secondaryInsurancePolicyPlanCity",
  secondaryInsurancePolicyPlanState:"secondaryInsurancePolicyPlanState",
  secondaryInsurancePolicyPlanZipCode:"secondaryInsurancePolicyPlanZipCode",
}




// CLAIMS
export const claimCategories = [
  'Missed',
  'Owes',
  'Paid',
  'Processing',
  'Settled',
  'Transferred',
];

// VOICEMAIL
export const voicemailCategories = [
  'Appointment',
  'Labs', // ORDERS; RESULTS;
  'Memo', // ASSIGN TO MEDICAL STAFF
  'Miscellaneous', // FMLA; INTAKE; INSURANCE INQUIRIES;
  'Records', // RECORD REQUESTS
  'Referrals', // REFERRALS; PATIENT VS CLINIC (CLINIC KEYWORDS: office, nurse, )
  'Rx,', // PATIENT VS PHARMACY
];

export const voicemailColumnOrder: string[] = [
  'createdDate',
  'callerName',
  'callerNumber',
  'callerType',
  'duration',
  'reason',
  'transcription',
  'status',
  'id',
  'messageFolder',
  'officeId',
  'officeName,',
];

export const voicemailColumnNames: DisplayNames = {
  callerName: 'Caller Name',
  callerNumber: 'Caller Number',
  callerType: 'Caller Type',
  createdDate: 'Date',
  duration: 'Duration',
  id: 'Call ID',
  messageFolder: 'Message Folder',
  officeId: 'Office id',
  officeName: 'Office name,', // Note: There appears to be a comma in this key
  reason: 'Reason',
  status: 'Status',
  transcription: 'Transcription',
};

