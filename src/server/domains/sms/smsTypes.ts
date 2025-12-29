export interface Sms {
    to: string;
    message: string; // must be URL encoded
}

export interface SmsRequest {
    body: Sms
}

export interface SmsResponse {
    response: any
}