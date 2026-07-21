import { MessageSquare,  } from 'lucide-react';
interface Props {
  patientId: number;
}

const AppointmentActions = ({ patientId: _patientId }: Props) => {
  const handleCopaySms = () => {
    console.log('Sending copay sms to ', _patientId);
  };

  return (
    <div className="flex justify-center align-middle">
      <button
        onClick={handleCopaySms}
        className="copaySms p-1 rounded-full hover:bg-gray-100"
      >
        <MessageSquare />
      </button>
    </div>
  );
};

export default AppointmentActions;
