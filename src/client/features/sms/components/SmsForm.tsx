import { useState } from "react"
import { sendSms } from "../services/smsApi";
import "../smsStyles.css"
import type { SMS } from "../../../types/types";

export const SmsForm = () => {

    const [phoneNumber, setPhoneNumber] = useState('8177230336'); 
    const [message, setMessage] = useState('Test SMS'); 

    const handleSubmit = async (e) => {
      e.preventDefault()

      const smsData: SMS = {
        phoneNumber, message
      }
      console.log("phone number and message:", smsData)
      const sentSmsStatus = await sendSms(smsData)
      if (sentSmsStatus === 200) {
        setPhoneNumber('')
        setMessage("")
      }
    };

    const handlePhoneNumberChange = (e) => {
      setPhoneNumber(e.target.value)
    }
    const handleMessageChange = (e) => {
      setMessage(e.target.value)
    }
    
    return (
      <div className="sms-Wrapper">
        <form onSubmit={handleSubmit} className="sms-form">
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