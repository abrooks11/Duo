-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT NOT NULL,
    "payerName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EOB" (
    "id" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT NOT NULL,
    "payerType" TEXT NOT NULL DEFAULT 'insurance',
    "payerName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "depositId" TEXT NOT NULL,

    CONSTRAINT "EOB_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_id_key" ON "Deposit"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_reference_key" ON "Deposit"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "EOB_id_key" ON "EOB"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EOB_reference_key" ON "EOB"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "EOB_depositId_key" ON "EOB"("depositId");

-- AddForeignKey
ALTER TABLE "EOB" ADD CONSTRAINT "EOB_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
