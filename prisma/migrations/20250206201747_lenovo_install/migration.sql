-- CreateTable
CREATE TABLE "Appointment" (
    "AppointmentReason1" TEXT,
    "ConfirmationStatus" TEXT,
    "CreatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastModifiedDate" TIMESTAMP(3) NOT NULL,
    "Notes" TEXT,
    "PatientCaseName" TEXT,
    "PatientFullName" TEXT NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "Type" TEXT NOT NULL,
    "PatientID" INTEGER NOT NULL,
    "ID" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedDate" TIMESTAMP(3) NOT NULL,
    "encounterId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientDateOfBirth" TIMESTAMP(3) NOT NULL,
    "serviceStartDate" TIMESTAMP(3) NOT NULL,
    "procedureCode" TEXT NOT NULL,
    "procedureName" TEXT NOT NULL,
    "procedureModifier1" TEXT,
    "encounterDiagnosisId1" INTEGER,
    "unitCharge" DOUBLE PRECISION NOT NULL,
    "primaryInsuranceCompanyName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "appointmentId" INTEGER,
    "primaryInsuranceAddressLine1" TEXT NOT NULL,
    "secondaryInsuranceAddressLine1" TEXT,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedDate" TIMESTAMP(3) NOT NULL,
    "patientFullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "primaryInsurancePolicyCompanyId" INTEGER,
    "primaryInsurancePolicyCompanyName" TEXT NOT NULL,
    "primaryInsurancePolicyPlanId" INTEGER,
    "primaryInsurancePolicyPlanName" TEXT NOT NULL,
    "primaryInsurancePolicyPlanAddressLine1" TEXT NOT NULL,
    "primaryInsurancePolicyPlanCity" TEXT NOT NULL,
    "primaryInsurancePolicyPlanState" TEXT NOT NULL,
    "primaryInsurancePolicyPlanZipCode" TEXT NOT NULL,
    "primaryInsurancePolicyNumber" TEXT NOT NULL,
    "secondaryInsurancePolicyCompanyId" INTEGER,
    "secondaryInsurancePolicyCompanyName" TEXT NOT NULL,
    "secondaryInsurancePolicyPlanId" INTEGER,
    "secondaryInsurancePolicyPlanName" TEXT NOT NULL,
    "secondaryInsurancePolicyPlanAddressLine1" TEXT NOT NULL,
    "secondaryInsurancePolicyPlanCity" TEXT NOT NULL,
    "secondaryInsurancePolicyPlanState" TEXT NOT NULL,
    "secondaryInsurancePolicyPlanZipCode" TEXT NOT NULL,
    "secondaryInsurancePolicyNumber" TEXT NOT NULL,
    "alertMessage" TEXT,
    "lastAppointmentDate" TIMESTAMP(3),
    "lastEncounterDate" TIMESTAMP(3),
    "lastStatementDate" TIMESTAMP(3),
    "insuranceBalance" DOUBLE PRECISION,
    "patientBalance" DOUBLE PRECISION,
    "totalBalance" DOUBLE PRECISION,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
