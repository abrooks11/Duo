import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// UPLOAD SINGLE VOICEMAIL TO DATABASE
export const createVoicemail = async (voicemailObj: any): Promise<void> => {
  const {
    id,
    caller,
    caller_name,
    created_at,
    duration,
    message_folder,
    status,
    transcription,
  } = voicemailObj;

  const callDetails = {
    callerType: 'other',
    reason: 'misc',
  };
  const readTranscript = (transcription: String): any => {
    const appointmentKeywords = [
      'appointment',
      'schedule',
      'cancel',
      'reschedule',
      'annual',
    ];
    const prescriptionKeywords = ['prescription', 'refill'];
    const referralKeywords = ['refer', 'referral', 'referred'];
    const recordRequestKeywords = ['record', 'records', 'request'];

    if (!transcription) return;

    const lowerStr = transcription.toLowerCase();

    if (appointmentKeywords.some((keyword) => lowerStr.includes(keyword))) {
      callDetails.reason = 'appointment';
      return;
    }
    if (prescriptionKeywords.some((keyword) => lowerStr.includes(keyword))) {
      callDetails.reason = 'prescription';
      return;
    }
    if (referralKeywords.some((keyword) => lowerStr.includes(keyword))) {
      callDetails.reason = 'referral';
      return;
    }
    if (recordRequestKeywords.some((keyword) => lowerStr.includes(keyword))) {
      callDetails.reason = 'records';
      return;
    }
  };

  readTranscript(transcription);

  const newVoicemail = await prisma.voicemail.create({
    data: {
      id: id, // e.g. "4cbda5b4-4d14-48dc-a82e-aed957e788cf"
      callerNumber: caller,
      callerName: caller_name,
      createdDate: created_at,
      duration: duration,
      messageFolder: message_folder,
      status: status,
      transcription: transcription,
      callerType: callDetails.callerType,
      reason: callDetails.reason,
    },
  });

  const matchingPatients = await prisma.patient.findMany({
    where:{ mobilePhone: caller}
  })
};
