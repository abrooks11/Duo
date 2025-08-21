-- CreateTable
CREATE TABLE "Voicemail" (
    "id" TEXT NOT NULL,
    "callerNumber" TEXT NOT NULL,
    "callerName" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "messageFolder" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "callerType" TEXT,
    "officeId" TEXT,
    "officeName" TEXT,

    CONSTRAINT "Voicemail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientVoicemail" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "voicemailId" TEXT NOT NULL,

    CONSTRAINT "PatientVoicemail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voicemail_id_key" ON "Voicemail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PatientVoicemail_patientId_voicemailId_key" ON "PatientVoicemail"("patientId", "voicemailId");

-- AddForeignKey
ALTER TABLE "PatientVoicemail" ADD CONSTRAINT "PatientVoicemail_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientVoicemail" ADD CONSTRAINT "PatientVoicemail_voicemailId_fkey" FOREIGN KEY ("voicemailId") REFERENCES "Voicemail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
