import type { SmsResponse } from "./smsTypes.ts";

export async function sendSMS(_to: string, _message: string): Promise<SmsResponse> {
  // TODO: implement SMS sending via RingRX
  return { response: null };
}