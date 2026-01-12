import { useMemo } from 'react';
import { useAppointment } from './useAppointment';
import { formatDate } from '@client/utils/stateHelpers';

interface InsuranceCompany {
  name: string;
  code: string;
  patterns: string[];
}

const INSURANCE_COMPANIES: InsuranceCompany[] = [
  {
    name: 'Aetna',
    code: 'AETNA',
    patterns: ['aetna']
  },
  {
    name: 'BC/BS',
    code: 'BCBS', 
    patterns: ['blue', 'bcbs', 'bc/bs']
  },
  {
    name: 'Cigna',
    code: 'CIGNA',
    patterns: ['cigna']
  },
  {
    name: 'United',
    code: 'UNITED',
    patterns: ['united', 'uhc', 'united healthcare']
  }
];

export const useInsuranceExtractor = () => {
  const { appointments, selectedDateRange } = useAppointment();
console.log(appointments[0])

  // Date filtering helper function
  const getDateFilteredAppointments = useMemo(() => {
    const dateRange = selectedDateRange?.[0] || {};
    const { startDate, endDate } = dateRange;
    
    // Convert to Date objects
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Create a function to strip time from dates
    const stripTime = (date: Date | null): Date | null => {
      if (!date) return null;
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    
    // Strip time components
    const startDateStripped = stripTime(start);
    const endDateStripped = stripTime(end);
    
    // If no dates are selected, return all appointments
    if (!startDateStripped && !endDateStripped) return appointments;
    
    // Check if it's a single-day selection
    const isSingleDaySelection = startDateStripped && 
      endDateStripped && 
      startDateStripped.getTime() === endDateStripped.getTime();
    
    return appointments.filter(appointment => {
      // Convert appointment date and strip time
      const appointmentDate = new Date(appointment.startDate);
      const appointmentDateStripped = stripTime(appointmentDate);
      
      if (!appointmentDateStripped) return false; // Skip invalid dates
      
      // For single-day selection
      if (isSingleDaySelection) {
        return appointmentDateStripped.getTime() === startDateStripped!.getTime();
      }
      
      // For date range
      const afterStart = !startDateStripped || 
        appointmentDateStripped.getTime() >= startDateStripped.getTime();
      const beforeEnd = !endDateStripped || 
        appointmentDateStripped.getTime() <= endDateStripped.getTime();
      
      return afterStart && beforeEnd;
    });
  }, [appointments, selectedDateRange]);

  // Extract patient data by insurance company
  const extractPatientsByInsurance = useMemo(() => {
    const insuranceData: Record<string, string> = {};

    INSURANCE_COMPANIES.forEach(company => {
      const matchingPatients = getDateFilteredAppointments
        .filter(appointment => {
          // Check insurance match
          const insuranceName = appointment.patientCaseName?.toLowerCase() || '';
          const insuranceMatch = company.patterns.some(pattern => insuranceName.includes(pattern));
          
          // Check confirmation status (scheduled or confirmed)
          const status = appointment.confirmationStatus?.toLowerCase() || '';
          const isScheduledOrConfirmed = status === 'scheduled' || status === 'confirmed';
          
          // Check copay amount (null, 0, or undefined means no copay)
          const hasCopay = appointment.patientCopay && appointment.patientCopay > 0;
          
          return insuranceMatch && isScheduledOrConfirmed && !hasCopay;
        })
        .map(appointment => {
          const dobFormatted = formatDate(appointment.dob); // MM/DD/YYYY format
          return `${appointment.primaryInsurancePolicyNumber},${dobFormatted}`;
        })
        .sort(); // Sort for consistent output

      insuranceData[company.code] = matchingPatients.join('\n');
    });

    return insuranceData;
  }, [getDateFilteredAppointments]);

  // Get patient count by insurance (using same filtering logic)
  const getPatientCount = useMemo(() => {
    const counts: Record<string, number> = {};
    
    INSURANCE_COMPANIES.forEach(company => {
      const count = getDateFilteredAppointments.filter(appointment => {
        // Check insurance match
        const insuranceName = appointment.patientCaseName?.toLowerCase() || '';
        const insuranceMatch = company.patterns.some(pattern => insuranceName.includes(pattern));
        
        // Check confirmation status (scheduled or confirmed)
        const status = appointment.confirmationStatus?.toLowerCase() || '';
        const isScheduledOrConfirmed = status === 'scheduled' || status === 'confirmed';
        
        // Check copay amount (null, 0, or undefined means no copay)
        const hasCopay = appointment.patientCopay && appointment.patientCopay > 0;
        
        return insuranceMatch && isScheduledOrConfirmed && !hasCopay;
      }).length;
      
      counts[company.code] = count;
    });

    return counts;
  }, [getDateFilteredAppointments]);

  return {
    insuranceCompanies: INSURANCE_COMPANIES,
    extractPatientsByInsurance,
    getPatientCount,
    totalAppointments: getDateFilteredAppointments.length
  };
};