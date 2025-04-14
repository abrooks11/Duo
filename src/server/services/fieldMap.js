// interface ExcelHeaders {
//     ID:number;
//     CreatedDate:string;
//     LastModifiedDate:string;
//     PatientFullName:string;
//     DOB:string;
//     MobilePhone:string;

//     PrimaryInsurancePolicyCompanyId:string;
//     PrimaryInsurancePolicyCompanyName:string;
//     PrimaryInsurancePolicyPlanId:string;
//     PrimaryInsurancePolicyPlanName: string;
//     PrimaryInsurancePolicyPlanAddressLine1: string;
//     PrimaryInsurancePolicyPlanCity: string;
//     PrimaryInsurancePolicyPlanState: string;
//     PrimaryInsurancePolicyPlanZipCode: string;
//     PrimaryInsurancePolicyNumber: string;

//     SecondaryInsurancePolicyCompanyId: string;
//     SecondaryInsurancePolicyCompanyName: string;
//     SecondaryInsurancePolicyPlanId: string;
//     SecondaryInsurancePolicyPlanName: string;
//     SecondaryInsurancePolicyPlanAddressLine1: string;
//     SecondaryInsurancePolicyPlanCity: string;
//     SecondaryInsurancePolicyPlanState: string;
//     SecondaryInsurancePolicyPlanZipCode: string;
//     SecondaryInsurancePolicyNumber: string;

//     AlertMessage: string;
//     LastAppointmentDate: string;
//     LastEncounterDate: string;
//     LastStatementDate: string;
//     InsuranceBalance: number;
//     PatientBalance: number;
//     TotalBalance: number;
// }

// interface PrismaHeaders {
//     id:number;
//     createdDate:string;
//     lastModifiedDate:string;
//     patientFullName:string;
//     dob:string;
//     mobilePhone:string;

//     primaryInsurancePolicyCompanyId:string;
//     primaryInsurancePolicyCompanyName:string;
//     primaryInsurancePolicyPlanId:string;
//     primaryInsurancePolicyPlanName: string;
//     primaryInsurancePolicyPlanAddressLine1: string;
//     primaryInsurancePolicyPlanCity: string;
//     primaryInsurancePolicyPlanState: string;
//     primaryInsurancePolicyPlanZipCode: string;
//     primaryInsurancePolicyNumber: string;

//     secondaryInsurancePolicyCompanyId: string;
//     secondaryInsurancePolicyCompanyName: string;
//     secondaryInsurancePolicyPlanId: string;
//     secondaryInsurancePolicyPlanName: string;
//     secondaryInsurancePolicyPlanAddressLine1: string;
//     secondaryInsurancePolicyPlanCity: string;
//     secondaryInsurancePolicyPlanState: string;
//     secondaryInsurancePolicyPlanZipCode: string;
//     secondaryInsurancePolicyNumber: string;

//     alertMessage: string;
//     lastAppointmentDate: string;
//     lastEncounterDate: string;
//     lastStatementDate: string;
//     insuranceBalance: number;
//     patientBalance: number;
//     totalBalance: number;
//   }

const fieldMap = {
  ID: "id",
  CreatedDate: "createdDate",
  LastModifiedDate: "lastModifiedDate",
  PatientFullName: "patientFullName",
  DOB: "dob",
  MobilePhone: "mobilePhone",

  // PATIENT HEADERS
  PrimaryInsurancePolicyCompanyId: "primaryInsurancePolicyCompanyId",
  PrimaryInsurancePolicyCompanyName: "primaryInsurancePolicyCompanyName",
  PrimaryInsurancePolicyPlanId: "primaryInsurancePolicyPlanId",
  PrimaryInsurancePolicyPlanName: "primaryInsurancePolicyPlanName",
  PrimaryInsurancePolicyPlanAddressLine1:
    "primaryInsurancePolicyPlanAddressLine1",
  PrimaryInsurancePolicyPlanCity: "primaryInsurancePolicyPlanCity",
  PrimaryInsurancePolicyPlanState: "primaryInsurancePolicyPlanState",
  PrimaryInsurancePolicyPlanZipCode: "primaryInsurancePolicyPlanZipCode",
  PrimaryInsurancePolicyNumber: "primaryInsurancePolicyNumber",

  SecondaryInsurancePolicyCompanyId: "secondaryInsurancePolicyCompanyId",
  SecondaryInsurancePolicyCompanyName: "secondaryInsurancePolicyCompanyName",
  SecondaryInsurancePolicyPlanId: "secondaryInsurancePolicyPlanId",
  SecondaryInsurancePolicyPlanName: "secondaryInsurancePolicyPlanName",
  SecondaryInsurancePolicyPlanAddressLine1:
    "secondaryInsurancePolicyPlanAddressLine1",

  SecondaryInsurancePolicyPlanCity: "secondaryInsurancePolicyPlanCity",
  SecondaryInsurancePolicyPlanState: "secondaryInsurancePolicyPlanState",
  SecondaryInsurancePolicyPlanZipCode: "secondaryInsurancePolicyPlanZipCode",
  SecondaryInsurancePolicyNumber: "secondaryInsurancePolicyNumber",

  AlertMessage: "alertMessage",
  LastAppointmentDate: "lastAppointmentDate",
  LastEncounterDate: "lastEncounterDate",
  LastStatementDate: "lastStatementDate",
  InsuranceBalance: "insuranceBalance",
  PatientBalance: "patientBalance",
  TotalBalance: "totalBalance",

  // APPOINTMENT HEADERS
  ConfirmationStatus: 'confirmationStatus',
  PatientID: 'patientId',
  PatientCaseName: 'patientCaseName',
  StartDate: 'startDate',
  AppointmentReason1: 'appointmentReason',
  Notes: 'notes',
  Type: 'type'
};

export default fieldMap;