import clipboard from '../../assets/clipboard-text.svg'
import scan from '../../assets/scan-1.svg'

interface Props {
    patientId: number
}

const AppointmentActions = ({patientId}: Props) => {
    const handleInsuranceStatus = () => {
        console.log('FETCHING INSURANCE STATUS . . . ');

      }
      
      const handleAppointmentCopay = () => {
        console.log('FETCHING APPOINTMENT COPAY . . . ');
        
      }
      
  return (
    <div className="flex items-center justify-center">
    <button 
      onClick={handleInsuranceStatus}
      className="p-1 rounded-full hover:bg-gray-100"
      title="Insurance Status"
    >
      <img src={scan} alt="Insurance status" className="w-5 h-5" />
    </button>
    <button 
      onClick={handleAppointmentCopay}
      className="p-1 rounded-full hover:bg-gray-100"
      title="Appointment Copay"
    >
      <img src={clipboard} alt="Patient Estimate" className="w-5 h-5" />
    </button>
  </div>  )
}

export default AppointmentActions