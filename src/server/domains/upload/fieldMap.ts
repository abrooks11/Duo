/**
 * Use field map to convert excel column headers into 
 */

type FieldMapType = {
  [key: string]: string;
};

const fieldMap: FieldMapType = {
  ID: 'id',
  CreatedDate: 'createdDate',
  LastModifiedDate: 'lastModifiedDate',
  PatientFullName: 'patientFullName',
  DOB: 'dob',
  MobilePhone: 'mobilePhone',

  // PATIENT HEADERS
  PrimaryInsurancePolicyCompanyId: 'primaryInsurancePolicyCompanyId',
  PrimaryInsurancePolicyCompanyName: 'primaryInsurancePolicyCompanyName',
  PrimaryInsurancePolicyPlanId: 'primaryInsurancePolicyPlanId',
  PrimaryInsurancePolicyPlanName: 'primaryInsurancePolicyPlanName',
  PrimaryInsurancePolicyPlanAddressLine1:
    'primaryInsurancePolicyPlanAddressLine1',
  PrimaryInsurancePolicyPlanCity: 'primaryInsurancePolicyPlanCity',
  PrimaryInsurancePolicyPlanState: 'primaryInsurancePolicyPlanState',
  PrimaryInsurancePolicyPlanZipCode: 'primaryInsurancePolicyPlanZipCode',
  PrimaryInsurancePolicyNumber: 'primaryInsurancePolicyNumber',

  SecondaryInsurancePolicyCompanyId: 'secondaryInsurancePolicyCompanyId',
  SecondaryInsurancePolicyCompanyName: 'secondaryInsurancePolicyCompanyName',
  SecondaryInsurancePolicyPlanId: 'secondaryInsurancePolicyPlanId',
  SecondaryInsurancePolicyPlanName: 'secondaryInsurancePolicyPlanName',
  SecondaryInsurancePolicyPlanAddressLine1:
    'secondaryInsurancePolicyPlanAddressLine1',

  SecondaryInsurancePolicyPlanCity: 'secondaryInsurancePolicyPlanCity',
  SecondaryInsurancePolicyPlanState: 'secondaryInsurancePolicyPlanState',
  SecondaryInsurancePolicyPlanZipCode: 'secondaryInsurancePolicyPlanZipCode',
  SecondaryInsurancePolicyNumber: 'secondaryInsurancePolicyNumber',

  AlertMessage: 'alertMessage',
  LastAppointmentDate: 'lastAppointmentDate',
  LastEncounterDate: 'lastEncounterDate',
  LastStatementDate: 'lastStatementDate',
  InsuranceBalance: 'insuranceBalance',
  PatientBalance: 'patientBalance',
  TotalBalance: 'totalBalance',

  // APPOINTMENT HEADERS
  ConfirmationStatus: 'confirmationStatus',
  PatientID: 'patientId',
  PatientCaseName: 'patientCaseName',
  StartDate: 'startDate',
  AppointmentReason1: 'appointmentReason',
  Notes: 'notes',
  Type: 'type',

  // EOB HEADERS
  PayerType: "payerType", 
  PayerName: "payerName", 
  PaymentMethod: "paymentMethod",
  ReferenceNumber: "reference", 
  Amount: "amount", 



  // BANK PAYMENT HEADERS
   "Post Date": "date", 
  Description: "description",
  Credit: "credit"

};

export default fieldMap;
