import { Response } from "express";
import { VoicemailSchema } from "../domains/voicemail/voicemailTypes";

export interface TypedResponse<T extends Record<string, unknown> = Record<string, unknown>> extends Response {
    locals: T;
}

// type interfaces for res.locals for key resources
// voicemail:
// sms:  

export interface VoicemailLocals {
    voicemail?: VoicemailSchema[]
}

export interface SmsLocals {
    isSuccessful: boolean; // default value = false 
    id?: string;
}

// GLOBAL API RESPONSE OBJECT
export interface ApiResponse<T = any> {
    isSuccessful: boolean;
    data?: T;
    error?: ApiErrorResponse;
}

export interface ApiErrorResponse {
    code: string; 
    message: string;
    details?: any;
    statusCode: number;
}