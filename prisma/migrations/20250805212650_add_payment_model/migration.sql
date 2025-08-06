-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT NOT NULL,
    "payerType" TEXT NOT NULL DEFAULT 'insurance',
    "payerName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_id_key" ON "Payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");
