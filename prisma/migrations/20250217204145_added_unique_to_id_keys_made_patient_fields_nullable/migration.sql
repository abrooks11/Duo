/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Charge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "primaryInsurancePolicyCompanyName" DROP NOT NULL,
ALTER COLUMN "primaryInsurancePolicyPlanName" DROP NOT NULL,
ALTER COLUMN "primaryInsurancePolicyPlanAddressLine1" DROP NOT NULL,
ALTER COLUMN "primaryInsurancePolicyPlanCity" DROP NOT NULL,
ALTER COLUMN "primaryInsurancePolicyPlanState" DROP NOT NULL,
ALTER COLUMN "primaryInsurancePolicyPlanZipCode" DROP NOT NULL,
ALTER COLUMN "primaryInsurancePolicyNumber" DROP NOT NULL,
ALTER COLUMN "secondaryInsurancePolicyPlanName" DROP NOT NULL,
ALTER COLUMN "secondaryInsurancePolicyPlanAddressLine1" DROP NOT NULL,
ALTER COLUMN "secondaryInsurancePolicyPlanCity" DROP NOT NULL,
ALTER COLUMN "secondaryInsurancePolicyPlanState" DROP NOT NULL,
ALTER COLUMN "secondaryInsurancePolicyPlanZipCode" DROP NOT NULL,
ALTER COLUMN "secondaryInsurancePolicyNumber" DROP NOT NULL,
ALTER COLUMN "mobilePhone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Charge_id_key" ON "Charge"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");
