export interface Sms {
  phoneNumber: string;
  message: string; // must be URL encoded
}

export interface SmsRequest {
    body: Sms
}

export interface SmsResponse {
    response: any
}