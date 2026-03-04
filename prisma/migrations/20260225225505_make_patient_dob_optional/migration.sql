/*
  Warnings:

  - You are about to alter the column `amount` on the `Deposit` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the `EOB` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CHECK', 'CREDIT_CARD', 'EFT');

-- DropForeignKey
ALTER TABLE "EOB" DROP CONSTRAINT "EOB_depositId_fkey";

-- DropIndex
DROP INDEX "Deposit_id_key";

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "description" TEXT,
ADD COLUMN     "postDate" TIMESTAMP(3),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "dob" DROP NOT NULL;

-- DropTable
DROP TABLE "EOB";

-- CreateTable
CREATE TABLE "Eob" (
    "id" INTEGER NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "lastModifiedDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "payerType" TEXT NOT NULL DEFAULT 'insurance',
    "payerName" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "depositId" TEXT,
    "isMatched" BOOLEAN NOT NULL DEFAULT false,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Eob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sqlQuery" TEXT NOT NULL,
    "cachedData" JSONB,
    "cachedAt" TIMESTAMP(3),
    "folderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Eob_reference_key" ON "Eob"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Eob_depositId_key" ON "Eob"("depositId");

-- AddForeignKey
ALTER TABLE "Eob" ADD CONSTRAINT "Eob_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "ReportFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
