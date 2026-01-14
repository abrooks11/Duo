// Type definitions for voicemail requested from local database

export interface VoicemailSchema {
  id: string;
  callerNumber: string;
  callerName: string;
  createdDate: Date;
  duration: number;
  messageFolder: string; //inbox or trash
  status: string;
  transcription: string;
  callerType: string | null;
  reason: string | null ;
  notes: string | null; // default response is null
  officeId: string | null; // default response is null
  officeName: string | null; // default response is null
}

export interface RingRxVoicemail {
  
}