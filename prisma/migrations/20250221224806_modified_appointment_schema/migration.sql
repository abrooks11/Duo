/*
  Warnings:

  - You are about to drop the column `AppointmentReason1` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `ConfirmationStatus` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedDate` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `ID` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `LastModifiedDate` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `Notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `PatientCaseName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `PatientFullName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `PatientID` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `StartDate` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentReason` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmationStatus` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModifiedDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "AppointmentReason1",
DROP COLUMN "ConfirmationStatus",
DROP COLUMN "CreatedDate",
DROP COLUMN "ID",
DROP COLUMN "LastModifiedDate",
DROP COLUMN "Notes",
DROP COLUMN "PatientCaseName",
DROP COLUMN "PatientFullName",
DROP COLUMN "PatientID",
DROP COLUMN "StartDate",
DROP COLUMN "Type",
ADD COLUMN     "appointmentReason" TEXT NOT NULL,
ADD COLUMN     "confirmationStatus" TEXT NOT NULL,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastModifiedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "patientCaseName" TEXT,
ADD COLUMN     "patientId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
