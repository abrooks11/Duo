// import react hooks
import { useEffect, useState } from 'react';

// import custom components
import AppointmentTable from '../features/appointments/components/AppointmentTable';

// import custom hooks
import useDateRangeFilter from '../hooks/useDateRangeFilter';

// import custom hooks/utilities
import { formatDate } from '../utils/stateHelpers';
import { appointmentRowFilterMap } from '../utils/keyMappings';
import { useAppointment } from '@client/features/appointments/hooks/useAppointment'

import InsuranceSelector from '../features/appointments/components/InsuranceSlector';
import CopaySummary from '../features/appointments/components/CopaySummary';
import { syncFromTebra } from '../features/appointments/services/appointmentApi';

const Appointments = () => {
  const {
    appointments,
    allColumnHeaders,
    rowFilterDetails,
    // isLoading,
    // error,
    loadAppointments,
  } = useAppointment();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().slice(0, 10);
    const { status, data } = await syncFromTebra(startDate, endDate);
    setSyncing(false);
    if (status === 200) {
      setSyncMessage(`Synced ${data.synced} appointments, skipped ${data.skipped}`);
      loadAppointments();
    } else {
      setSyncMessage('Sync failed');
    }
  };

  // use custom hook
  useEffect(() => {
    if (!appointments.length) {
      loadAppointments();
    }
  }, [appointments.length, loadAppointments]);

  // prep data: format the dates
  const formattedDateData = appointments.map((row) => {
    const { createdDate, lastModifiedDate, startDate, dob } = row;

    return {
      ...row,
      createdDate: formatDate(createdDate),
      lastModifiedDate: formatDate(lastModifiedDate),
      startDate: formatDate(startDate, true),
      dob: formatDate(dob),
    };
  });

  // Get active filters
  const activeFilters = Object.entries(rowFilterDetails)
    .filter(([_, details]) => details.isSelected)
    .map(([key]) => key);

  // Filter the data based on active filters
  const filteredData = formattedDateData.filter((row) => {
    // If no filters are selected, show all data
    if (activeFilters.length === 0) return true;

    // Check if the row matches any of the selected filters
    return activeFilters.some((filterKey) => {
      if (appointmentRowFilterMap[filterKey]) {
        return appointmentRowFilterMap[filterKey].includes(
          row.confirmationStatus
        );
      }
      return false;
    });
  });

  const dateFilteredData = useDateRangeFilter(filteredData, 'startDate')

  // console.log({activeFilters});
  // console.log({filteredData});

  return (
    <div>
      {/* <h1>Appointments</h1> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <InsuranceSelector />
        <CopaySummary />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {syncing ? 'Syncing...' : 'Sync from Tebra'}
        </button>
        {syncMessage && <span className="text-sm text-gray-600">{syncMessage}</span>}
      </div>
      {formattedDateData.length > 0 && (
        <AppointmentTable
          columns={allColumnHeaders}
          data={dateFilteredData}
          styling="w-full h-full"
        />
      )}
    </div>
  );
};

export default Appointments;
