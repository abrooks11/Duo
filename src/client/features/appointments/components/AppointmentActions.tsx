import { sendSms } from '@client/features/sms/services/smsApi';
import { apiClient } from '@client/hooks/useApi';

import { MessageSquare, MessageSquareCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
interface AppointmentActionsProps {
  patientId: number;
  patientCopay: number;
  appointmentId: number; // appointment id
  appointmentReason: string;
  isNotified: boolean;
}

const AppointmentActions = ({
  patientId,
  patientCopay,
  appointmentId,
  appointmentReason,
}: AppointmentActionsProps) => {
  // const [isHighCopay, setIsHighCopay] = useState<boolean>(patientCopay >= 50);
  // const [isTelehealth, setIsTelehealth] = useState<boolean>(appointmentReason === 'PHONE CONSULT');
  const isHighCopay = patientCopay >= 50;
  const isTelehealth = appointmentReason === 'PHONE CONSULT';
  const [isNotified, setIsNotified] = useState<boolean>(false);

  const ganerateMessage = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const inOfficeMessage = `Hello! This is Dr. Brooks’ office and in preparation for your upcoming visit, we have contacted your insurance carrier regarding your benefits.\n\nIn the estimate they provided, they determined your financial responsibility to be $${patientCopay}.\n\nPlease note that per our office policy, patient co-pays, deductible amounts and overdue balances are due on the date of service.\n\nShould you have questions regarding your benefits, please reply to this message so that we may assist you further.\n\nThank you!`;

    const telehealthMessage = `Hello! This is Dr. Brooks’ office and in preparation for your upcoming telehealth consult, we have contacted your insurance carrier regarding your benefits.\n\nIn the estimate they provided, they determined your financial responsibility to be $${patientCopay}.\n\nPayment for this consult is due by 12:00 PM ${formattedDate}.\n\nWe can accept payment via the secure-link sent to you via email and mobile.\n\nShould you have any questions, please reply to this message so that we may assist you further!`;

    return isTelehealth ? telehealthMessage : inOfficeMessage;
  };

  const fetchPatientPhoneNumber = async () => {
    const response = await apiClient.get<any>(`patients/${patientId}`);
    if (!response.success) {
      throw new Error(response.error || `Failed to fetch patient ${patientId}`);
    }
    return response.data.mobilePhone;
  };

  const handleCopaySms = async () => {
    // if patient has been notified of copay --> return
    if (isNotified) return;

    // fetch patient cell number using patient id
    const patientPhoneNumber = await fetchPatientPhoneNumber();

    // generate text message
    const message = ganerateMessage();
    console.log({ patientPhoneNumber });

    // send text message
    // console.log('Sending copay sms to ', patientId);
    // const test = await sendSms('817-723-0336', message);
    const test = 200;
    console.log(test);

    // if text message sucessful, mark appointment as isNotified
    if (test === 200) {
      setIsNotified(true);
      const data = {
        phoneNumber: patientPhoneNumber,
        message: message,
        status: 'sent',
      };
      const response = await apiClient.post<any>(
        `appointments/sms/${appointmentId}`,
        data
      );
      if (!response.success) {
        throw new Error(
          response.error || `Failed to fetch patient ${appointmentId}`
        );
      }
    }
  };

  useEffect(() => {
    const fetchAppointmentSms = async () => {
      const response = await apiClient.get<any>(
        `appointments/sms/${appointmentId}`
      );

        console.log({ appointmentReason, isHighCopay, isTelehealth, response });

      if (response.data) {
        setIsNotified(true);
      }

      if (!response.success) {
        throw new Error(
          response.error || `Failed to fetch appointment ${appointmentId}`
        );
      }
      return response.data;
    };

    if ((isHighCopay || isTelehealth) && isNotified === false) {
      // check db for appointment sms
      fetchAppointmentSms();
    }
  }, [isHighCopay, isTelehealth, appointmentId]);

  return (
    <div className="flex justify-center align-middle">
      {isHighCopay || isTelehealth ? (
        isNotified ? (
          <MessageSquareCheck />
        ) : (
          <button
            onClick={handleCopaySms}
            className="copaySms p-1 rounded-full hover:bg-gray-100"
          >
            <MessageSquare />
          </button>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AppointmentActions;
