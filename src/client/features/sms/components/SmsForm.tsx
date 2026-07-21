import "../smsStyles.css"
import { useSmsForm } from "@client/context/shared/smsFormcontext";

const QUICK_REPLIES: ReadonlyArray<{ readonly label: string; readonly message: string }> = [
  {
    label: 'Confirm Cancellation',
    message: `Hello! This is Dr. Brooks' office reaching out because we received your message.\n\nThank you for the heads up! We will remove that appointment from our calendar.\n\nWhenever you're ready to reschedule, view our availability and request an appointment online at https://www.exclusivelygyn.com/scheduleonline`,
  },
  {
    label: 'Lab Results',
    message: `Hello! Your lab results should be available online on the CPL portal.\n\nClick the link below to find their website.\n\nhttps://www.exclusivelygyn.com/labs\n\nIf you would like to schedule a phone consult to discuss your results further, request an appointment by visiting our website at\n\nhttps://www.exclusivelygyn.com/scheduleonline`,
  },
  {
    label: 'WWE Too Early',
    message: `Hello! This is Dr. Brooks' office reaching out because we received your message.\n\nYou'll be due for a yearly after DATE.\n\nWe’ve recently moved our scheduling online!\n\nView our availability and request an appointment anytime by visiting our website at https://www.exclusivelygyn.com/scheduleonline\n\nThe calendar shows appointments up to six weeks ahead, so that date might not be available just yet. Please check back closer to that time for additional openings.`,
  },
] as const;

export const SmsForm = () => {

 const {
   fullName,
   phoneNumber,
   transcript,
   message,
   setMessage,
   handleNameChange,
   handlePhoneNumberChange,
   handleTranscriptChange,
   handleMessageChange,
   handleSmsFormSubmit,
 } = useSmsForm();

    
    return (
      <div className="sms-Wrapper">
        <form onSubmit={handleSmsFormSubmit} className="sms-form">
          <div className="flex gap-2">
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
          </div>
          <div className="flex gap-2">
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
            <div className="sms-quick-replies">
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
          </div>
            <span>Quick replies:</span>
            <div className="sms-quick-replies-buttons">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.label}
                  type="button"
                  className="sms-quick-reply-btn"
                  onClick={() => setMessage(reply.message)}
                >
                  {reply.label}
                </button>
              ))}
            </div>
          <button type="submit">Send SMS</button>
        </form>
      </div>
    );
}