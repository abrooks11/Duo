import { useState } from "react"
import { sendRingSms } from "../../utils/voicemailApi";
import type { SMS } from "../../types/types";
export const SmsWrapper = () => {

    const [phoneNumber, setPhoneNumber] = useState('8177230336'); 
    const [message, setMessage] = useState('Test SMS'); 

    const handleSmsSubmit = (e) => {
      e.preventDefault()
      console.log('submit button working');
      const smsInfo: SMS = {
        phoneNumber, message
      }
      console.log(smsInfo)
      sendRingSms(smsInfo)
    };

    const handlePhoneNumberChange = (e) => {
      setPhoneNumber(e.target.value)
    }
    const handleMessageChange = (e) => {
      setMessage(e.target.value)
    }
    
    return (
      <div className="sms-Wrapper">
        <form onSubmit={handleSmsSubmit} className="sms-form">
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
            <label htmlFor="message">Message:</label>
            <input
              type="text"
              id="message"
              name="message"
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