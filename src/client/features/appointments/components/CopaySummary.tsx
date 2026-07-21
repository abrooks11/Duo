import { useState } from 'react';
import { useAppointment } from '../hooks/useAppointment';
import { formatDate } from '../../../utils/stateHelpers';

interface CopaySummaryData {
  totalCopays: number;
  totalAmount: number;
  patientsOwingCopays: Array<{
    patientId: string;
    patientName: string;
    appointmentDate: string;
    copayAmount: number;
    insuranceCompany: string;
  }>;
}

const CopaySummary = () => {
  const { appointments, selectedDateRange } = useAppointment();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get date filtered appointments with copays
  const getCopaySummary = (): CopaySummaryData => {
    // Apply date filtering similar to insurance extractor
    const dateRange = selectedDateRange?.[0];
    const startDate = dateRange?.startDate;
    const endDate = dateRange?.endDate;
    
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    const stripTime = (date: Date | null): Date | null => {
      if (!date) return null;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    
    const startDateStripped = stripTime(start);
    const endDateStripped = stripTime(end);
    
    let filteredAppointments = appointments;
    
    if (startDateStripped || endDateStripped) {
      const isSingleDaySelection = startDateStripped && 
        endDateStripped && 
        startDateStripped.getTime() === endDateStripped.getTime();
      
      filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.startDate);
        const appointmentDateStripped = stripTime(appointmentDate);
        
        if (!appointmentDateStripped) return false;
        
        if (isSingleDaySelection) {
          return appointmentDateStripped.getTime() === startDateStripped!.getTime();
        }
        
        const afterStart = !startDateStripped || 
          appointmentDateStripped.getTime() >= startDateStripped.getTime();
        const beforeEnd = !endDateStripped || 
          appointmentDateStripped.getTime() <= endDateStripped.getTime();
        
        return afterStart && beforeEnd;
      });
    }

    // Filter for appointments with copays (scheduled/confirmed)
    const appointmentsWithCopays = filteredAppointments.filter(appointment => {
      const status = appointment.confirmationStatus?.toLowerCase() || '';
      const isScheduledOrConfirmed = status === 'scheduled' || status === 'confirmed';
      const hasCopay = appointment.patientCopay && appointment.patientCopay > 0;
      
      return isScheduledOrConfirmed && hasCopay;
    });

    const patientsOwingCopays = appointmentsWithCopays
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .map((appointment) => ({
        patientId: String(appointment.patientId),
        patientName: appointment.patientFullName || 'Unknown Patient',
        appointmentDate: formatDate(appointment.startDate),
        copayAmount: appointment.patientCopay || 0,
        insuranceCompany: appointment.patientCaseName || 'Unknown Insurance',
      }));

    return {
      totalCopays: appointmentsWithCopays.length,
      totalAmount: appointmentsWithCopays.reduce((sum, apt) => sum + (apt.patientCopay || 0), 0),
      patientsOwingCopays: patientsOwingCopays
    };
  };

  const copaySummary = getCopaySummary();

  const generateEmailText = () => {
    const today = new Date().toLocaleDateString();
    const dateRange = selectedDateRange?.[0];
    const rangeText = dateRange?.startDate && dateRange?.endDate 
      ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
      : today;
    
    let emailText = `Daily Copay Summary - ${rangeText}\n\n`;
    emailText += `Total Patients with Copays: ${copaySummary.totalCopays}\n`;
    emailText += `Total Copay Amount: $${copaySummary.totalAmount.toFixed(2)}\n\n`;
    emailText += `Patient Details:\n`;
    emailText += `Name, Patient ID, Appointment Date, Copay Amount, Insurance\n`;
    
    copaySummary.patientsOwingCopays.forEach(patient => {
      emailText += `${patient.patientName} - $${patient.copayAmount.toFixed(2)}\n`;
    });

    return emailText;
  };

  const handleCopyToClipboard = async () => {
    const emailText = generateEmailText();
    
    try {
      await navigator.clipboard.writeText(emailText);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Daily Copay Summary
      </h2>
      <p className="text-xs text-gray-600 mb-4">
        Summary of scheduled/confirmed appointments with copays within selected date range
      </p>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 rounded p-3 text-center">
          <div className="text-lg font-bold text-blue-700">{copaySummary.totalCopays}</div>
          <div className="text-xs text-blue-600">Patients with Copays</div>
        </div>
        <div className="bg-green-50 rounded p-3 text-center">
          <div className="text-lg font-bold text-green-700">${copaySummary.totalAmount.toFixed(2)}</div>
          <div className="text-xs text-green-600">Total Copay Amount</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCopyToClipboard}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
            copyStatus === 'success' 
              ? 'bg-green-100 text-green-700' 
              : copyStatus === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {copyStatus === 'success' ? '✓ Copied!' : copyStatus === 'error' ? 'Copy Failed' : 'Copy Email Text'}
        </button>
      </div>

      {/* Patient List */}
      {copaySummary.patientsOwingCopays.length > 0 ? (
        <div className="bg-gray-50 rounded p-3">
          <div className="text-xs text-gray-600 mb-2">Patient Details</div>
          <div className="max-h-40 overflow-y-auto">
            {copaySummary.patientsOwingCopays.map((patient, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-800">{patient.patientName}</div>
                  <div className="text-xs text-gray-500">ID: {patient.patientId} | {patient.appointmentDate}</div>
                  <div className="text-xs text-gray-500">{patient.insuranceCompany}</div>
                </div>
                <div className="text-sm font-bold text-green-700">
                  ${patient.copayAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <div className="text-sm font-medium mb-1">No Copays Found</div>
          <div className="text-xs">No scheduled/confirmed appointments with copays in selected date range</div>
        </div>
      )}
    </div>
  );
};

export default CopaySummary;