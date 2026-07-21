import { MessageCircle, MessageCircleCheck } from 'lucide-react';
interface Props {
  patientId: number;
}

const AppointmentActions = ({ patientId: _patientId }: Props) => {
  const handleCopaySms = () => {
    console.log('Sending copay sms . . . ');
  };

  return (
    <div className="flex justify-center align-middle">
      <button
        onClick={handleCopaySms}
        className="copaySms p-1 rounded-full hover:bg-gray-100"
      >
        <MessageCircle />
      </button>
    </div>
  );
};

export default AppointmentActions;
