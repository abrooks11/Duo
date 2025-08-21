-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Appointment_id_seq";

-- AlterTable
ALTER TABLE "Charge" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Charge_id_seq";

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Patient_id_seq";
