import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/** UPLOAD SINGLE VOICEMAIL TO DATABASE
 * 
 * Takes a raw voicemail object and processes it for database storage by:
 * 1. Extracting and formatting core voicemail properties
 * 2. Formatting phone number to standard (XXX) XXX-XXXX format
 * 3. Analyzing transcription to determine call reason category
 * 4. Querying patient database to identify if caller is an existing patient
 * 5. Upserting the processed voicemail data to the database
 * 
 * @param voicemailObj - Raw voicemail object from external source (e.g., phone system API)
 * @returns Promise<void>
 */

export const createVoicemail = async (voicemailObj: any): Promise<void> => {
  // Extract core voicemail properties from the incoming object
  const { id, created_at, duration, message_folder, status, transcription } =
    voicemailObj;

  // Extract caller information (will be modified by formatting functions)
  let { caller, caller_name } = voicemailObj;

  // Initialize call classification with default values
  // Will be updated based on transcription analysis and patient lookup
  const callDetails = {
    callerType: 'other', // Will become 'patient' if found in database
    reason: 'misc', // Will be categorized based on transcription keywords
  };

  /**
   * Formats a phone number to standard (XXX) XXX-XXXX format
   * Handles numbers with or without country codes by taking last 10 digits
   * Modifies the 'caller' variable directly
   *
   * @param input - Raw phone number string (may include country code)
   */
  function formatPhoneNumber(input: string): void {
    // Extract the last 10 digits if the number has country code
    const digits = input.slice(-10);

    // Format as (XXX) XXX-XXXX
    caller = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  /**
   * Analyzes voicemail transcription to categorize the reason for the call
   * Uses keyword matching to determine if call is about appointments, prescriptions, etc.
   * Modifies callDetails.reason based on first matching category found
   * Priority order: appointment > prescription > referral > records > misc (default)
   *
   * @param transcription - Text transcription of the voicemail message
   */
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

  /**
   * Queries the patient database to check if the caller is an existing patient
   * If found, updates caller type to 'patient' and sets caller name from patient record
   * Modifies callDetails.callerType and caller_name variables
   *
   * @param phoneNumber - Formatted phone number to search for in patient records
   */
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
      id: id, // Unique identifier from external system (e.g. "4cbda5b4-4d14-48dc-a82e-aed957e788cf")
      callerNumber: caller, // Formatted phone number
      callerName: caller_name || '', // Patient name if found, empty string if not
      createdDate: created_at, // Original timestamp from voicemail system
      duration: duration || 0, // Call duration in seconds, default to 0
      messageFolder: message_folder, // Folder classification from phone system
      status: status, // Message status (new, read, etc.)
      transcription: transcription || '', // Voice-to-text transcription, empty if unavailable
      callerType: callDetails.callerType, // 'patient' or 'other' based on database lookup
      reason: callDetails.reason, // Call category based on transcription analysis
    },
  });
};

export const getDbVoicemail = async () => {
  const result = await prisma.voicemail.findMany({
    where: { messageFolder: 'inbox' },
    orderBy: {
      createdDate: 'desc',
    },
  });

  console.log("voicemail", result[0])

  return result
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

return 'Note updated'
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

return 'Reason updated'
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