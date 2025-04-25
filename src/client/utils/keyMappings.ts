// APPOINTMENTS
export const appointmentMap = {
  // values are read; key is returned
  scheduled: ['Scheduled', 'Confirmed'],
  completed: ['Check-out'],
  cancelled: ['Cancelled'],
  noShow: ['No-show'],
};

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

export const voicemailColumnOrder = [
  "createdDate",
  "callerName",
  "callerNumber",
  "callerType",
  "duration",
  "reason",
  "transcription",
  "status",
  "id",
  "messageFolder",
  "officeId",
  "officeName,",
]

export const voicemailColumnNames = {
  "callerName": "Caller Name",
  "callerNumber": "Caller Number",
  "callerType": "Caller Type",
  "createdDate": "Date",
  "duration": "Duration",
  "id": "Call ID",
  "messageFolder": "Message Folder",
  "officeId": "Office id",
  "officeName": "Office name,", // Note: There appears to be a comma in this key
  "reason": "Reason",
  "status": "Status",
  "transcription": "Transcription"
};



export const appointmentColumnOrder = [
  "insuranceStatus",
  "copay",
  "patientBalance",
  "confirmationStatus",
  "patientFullName",
  "patientCaseName",
  "primaryInsurancePolicyNumber",
  "appointmentReason",
  "notes",
  "startDate",
  "alertMessage",
  "id",
  "createdDate",
  "lastModifiedDate",
  "patientId"
]


export const appointmentColumnNames = {
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
