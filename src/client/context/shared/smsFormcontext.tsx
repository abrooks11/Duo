import { useState, createContext, useContext, ReactNode } from "react";
import { sendSms } from '@client/features/sms/services/smsApi'

// Types
interface SmsFormState {
  fullName: string;
  phoneNumber: string;
  transcript: string;
  message: string;
}

interface SmsFormContextValue {
  // State
  fullName: string;
  phoneNumber: string;
  transcript: string;
  message: string;

  // Actions
  setFullName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
  setTranscript: (transcript: string) => void;
  setMessage: (message: string) => void;
  handleNameChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handlePhoneNumberChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleTranscriptChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleMessageChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSmsFormSubmit: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  populateForm: (data: Partial<SmsFormState>) => void;
  resetForm: () => void;
}

interface SmsFormProviderProps {
    children: ReactNode;
}

const SmsFormContext = createContext<SmsFormContextValue | undefined>(undefined);

export const SmsFormProvider: React.FC<SmsFormProviderProps> = ({children}) => {

  const defaultValues = {
    name: import.meta.env.VITE_DEFAULT_NAME, 
    phoneNumber: import.meta.env.VITE_DEFAULT_PHONE_NUMBER,
    transcript: import.meta.env.VITE_DEFAULT_VOICEMAIL_TRANSCRIPT,
    smsReply: import.meta.env.VITE_DEFAULT_SMS_REPLY
    
  }

  const [fullName, setFullName] = useState(defaultValues.name);
  const [phoneNumber, setPhoneNumber] = useState(defaultValues.phoneNumber);
  const [transcript, setTranscript] = useState(defaultValues.transcript);
  const [message, setMessage] = useState(defaultValues.smsReply);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFullName(e.target.value);
  };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  
  const handleSmsFormSubmit = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();

    console.log('phone number and message:', message);
    const sentSmsStatus = await sendSms(phoneNumber, message);
    if (sentSmsStatus === 200) {
      resetForm()
    }
  };

  // Populate form from voicemail data
  const populateForm = (data: Partial<SmsFormState>) => {
    if (data.fullName !== undefined) setFullName(data.fullName);
    if (data.phoneNumber !== undefined) setPhoneNumber(data.phoneNumber);
    if (data.transcript !== undefined) setTranscript(data.transcript);
    if (data.message !== undefined) setMessage(data.message);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFullName(defaultValues.name || '');
    setPhoneNumber(defaultValues.phoneNumber || '');
    setTranscript('');
    setMessage(defaultValues.smsReply || '');
  };

  const value: SmsFormContextValue = {
    fullName,
    phoneNumber,
    transcript, 
    message,
    setFullName,
    setPhoneNumber,
    setTranscript,
    setMessage,
    handleNameChange,
    handlePhoneNumberChange,
    handleTranscriptChange,
    handleMessageChange,
    handleSmsFormSubmit,
    populateForm,
    resetForm,
  };

return(    <SmsFormContext.Provider value={value}>{children}</SmsFormContext.Provider>)
 
}

export const useSmsForm = (): SmsFormContextValue => {
    const context = useContext(SmsFormContext)
      if (context === undefined) {
    throw new Error('useSmsForm must be used within a SmsFormProvider');
  }
  
  return context;
}