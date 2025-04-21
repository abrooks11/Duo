
// APPOINTMENTS 
export const appointmentMap = {
  // values are read; key is returned 
    scheduled: ['Scheduled', 'Confirmed'], 
    completed: ['Check-out'],
    cancelled: ["Cancelled"],
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
]

  // VOICEMAIL 
  export const voicemailCategories = [
    'Appointment',
    'Labs', // ORDERS; RESULTS; 
    'Memo', // ASSIGN TO MEDICAL STAFF
    'Miscellaneous', // FMLA; INTAKE; INSURANCE INQUIRIES; 
    'Records', // RECORD REQUESTS 
    'Referrals', // REFERRALS; PATIENT VS CLINIC (CLINIC KEYWORDS: office, nurse, )
    'Rx,', // PATIENT VS PHARMACY 
  ]