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
    initialValues?: Partial<SmsFormState>
}

const SmsFormContext = createContext<SmsFormContextValue | undefined>(undefined);

export const SmsFormProvider: React.FC<SmsFormProviderProps> = ({children, initialValues={}}) => {
  const [fullName, setFullName] = useState('Banana');
  const [phoneNumber, setPhoneNumber] = useState('817-723-0336');
  const [transcript, setTranscript] = useState('Initial voicemail . . .');
  const [message, setMessage] = useState('Typed reply . . . ');

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
    setFullName(initialValues.fullName || '');
    setPhoneNumber(initialValues.phoneNumber || '');
    setTranscript(initialValues.transcript || '');
    setMessage(initialValues.message || '');
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