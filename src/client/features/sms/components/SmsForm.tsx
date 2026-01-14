import "../smsStyles.css"
import { useSmsForm } from "@client/context/shared/smsFormcontext";
import { sendSms } from "../services/smsApi";
import type { SMS } from "../../../types/types";



export const SmsForm = () => {
  
 const {
   fullName,
   phoneNumber,
   transcript, 
   message,
   handleNameChange,
   handlePhoneNumberChange,
   handleTranscriptChange,
   handleMessageChange,
   handleSmsFormSubmit,
 } = useSmsForm();

    
    return (
      <div className="sms-Wrapper">
        <form onSubmit={handleSmsFormSubmit} className="sms-form">
          <div className="sms-form-element">
            <label htmlFor="name">Name:</label>
            <input
              type="tel"
              id="name"
              name="name"
              value={fullName}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="sms-form-element">
            <label htmlFor="mobile">Phone Number:</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              //   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              required
            />
          </div>
          <div className="sms-form-element">
            <label htmlFor="transcript">Transcript:</label>
            <textarea
              id="transcript"
              name="transcript"
              rows={4}
              cols={50}
              value={transcript}
              onChange={handleTranscriptChange}
              required
            />
          </div>
          <div className="sms-form-element">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              cols={50}
              value={message}
              onChange={handleMessageChange}
              required
            />
          </div>
          <button type="submit">Send SMS</button>
        </form>
      </div>
    );
}