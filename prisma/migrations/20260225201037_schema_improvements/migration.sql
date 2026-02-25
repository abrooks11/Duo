/*
  Warnings:

  - You are about to alter the column `unitCharge` on the `Charge` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `insuranceBalance` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `patientBalance` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalBalance` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - The `callerType` column on the `Voicemail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reason` column on the `Voicemail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CallerType" AS ENUM ('patient', 'other', 'clinic', 'pharmacy', 'insurance');

-- CreateEnum
CREATE TYPE "VoicemailReason" AS ENUM ('appointment', 'prescription', 'referral', 'recordRequest', 'lab', 'memo', 'misc', 'other');

-- DropIndex
DROP INDEX "Appointment_id_key";

-- DropIndex
DROP INDEX "Charge_id_key";

-- DropIndex
DROP INDEX "Patient_id_key";

-- DropIndex
DROP INDEX "Payment_id_key";

-- DropIndex
DROP INDEX "Voicemail_id_key";

-- AlterTable
ALTER TABLE "Charge" ALTER COLUMN "unitCharge" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "insuranceBalance" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "patientBalance" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalBalance" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Voicemail" DROP COLUMN "callerType",
ADD COLUMN     "callerType" "CallerType",
DROP COLUMN "reason",
ADD COLUMN     "reason" "VoicemailReason";

-- CreateIndex
CREATE INDEX "Charge_patientId_idx" ON "Charge"("patientId");

-- CreateIndex
CREATE INDEX "Charge_appointmentId_idx" ON "Charge"("appointmentId");

-- CreateIndex
CREATE INDEX "PatientVoicemail_voicemailId_idx" ON "PatientVoicemail"("voicemailId");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
