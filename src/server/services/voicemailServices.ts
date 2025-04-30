import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// UPLOAD SINGLE VOICEMAIL TO DATABASE
export const createVoicemail = async (voicemailObj: any): Promise<void> => {
  // extract values from voicemail object. add custom properties and format phone number. upload to voicemail table. query patient table by phone number for matching patient.
  const { id, created_at, duration, message_folder, status, transcription } =
    voicemailObj;

  let { caller, caller_name } = voicemailObj;

  const callDetails = {
    callerType: 'other',
    reason: 'misc',
  };

  function formatPhoneNumber(input: string): void {
    // Extract the last 10 digits if the number has country code
    const digits = input.slice(-10);

    // Format as (XXX) XXX-XXXX
    caller = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  const determineReason = (transcription: String): void => {
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

  const determineCallerName = async (phoneNumber: string): Promise<void> => {
    const matchingPatients = await prisma.patient.findMany({
      where: {
        mobilePhone: phoneNumber,
      },
    });
    // console.log({matchingPatients})

    if (matchingPatients.length > 0) {
      callDetails.callerType = 'patient';
      caller_name = matchingPatients[0].patientFullName;
    }
  };

  formatPhoneNumber(caller);
  determineReason(transcription);
  await determineCallerName(caller);

  await prisma.voicemail.upsert({
    where: {
      id: id,
    },
    update: {
      messageFolder: message_folder,
      status: status,
    },
    create: {
      id: id, // e.g. "4cbda5b4-4d14-48dc-a82e-aed957e788cf"
      callerNumber: caller,
      callerName: caller_name || '',
      createdDate: created_at,
      duration: duration || 0,
      messageFolder: message_folder,
      status: status,
      transcription: transcription || '',
      callerType: callDetails.callerType,
      reason: callDetails.reason,
    },
  });
};

export const getDbVoicemail = async () => {
  const inbox = await prisma.voicemail.findMany({
    where: { messageFolder: 'inbox' },
    orderBy: {
      createdDate: 'desc',
    },
  });

  
  const trash = await prisma.voicemail.findMany({
    take: 100, 
    where: { messageFolder: 'trash' },
    orderBy: {
      createdDate: 'desc'
    }
  })

  return [...inbox, ...trash]
};

export const updateVoicemailNote = async (vmId: string, content: string) => {
const matchingVoicemail = await prisma.voicemail.findUnique({where: {id: vmId}})
console.log({vmId, content})
if (!matchingVoicemail) {
  console.error('NO MATCHING VOICEMAIL FOUND')
  return 
}

await prisma.voicemail.update({
    where: {
      id: vmId,
    },
    data: {
      notes: content,
    },
  })

return 'Noted Added'
}
export const updateVoicemailReason = async (vmId: string, reason: string) => {
const matchingVoicemail = await prisma.voicemail.findUnique({where: {id: vmId}})
console.log({vmId, reason})
if (!matchingVoicemail) {
  console.error('NO MATCHING VOICEMAIL FOUND')
  return 
}

await prisma.voicemail.update({
    where: {
      id: vmId,
    },
    data: {
      reason: reason,
    },
  })
  const updatedTarget = await prisma.voicemail.findUnique({where: {id: vmId}})

console.log({updatedTarget});
return 'Noted Added'
}

export const changeFolder = async (vmId : string) => {
  await prisma.voicemail.update({
    where: {
      id: vmId
    }, 
    data:{
      messageFolder: 'trash'
    }
  })
}