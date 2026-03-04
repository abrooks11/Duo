/*
  Warnings:

  - Added the required column `paymentMethod` to the `EOB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EOB" ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ALTER COLUMN "reference" DROP NOT NULL;
