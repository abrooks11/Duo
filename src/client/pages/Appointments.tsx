import { useEffect, useState, useMemo } from 'react';

import AppointmentTable from '../features/appointments/components/AppointmentTable';

import useDateRangeFilter from '../hooks/useDateRangeFilter';

import { formatDate } from '../utils/stateHelpers';
import { appointmentRowFilterMap } from '../utils/keyMappings';
import { useAppointment } from '@client/features/appointments/hooks/useAppointment';

import InsuranceSelector from '../features/appointments/components/InsuranceSlector';
import CopaySummary from '../features/appointments/components/CopaySummary';

import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

const Appointments = () => {
  const {
    appointments,
    allColumnHeaders,
    rowFilterDetails,
    // isLoading,
    // error,
    loadAppointments,
  } = useAppointment();

  const [selectedInsurance, setSelectedInsurance] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string[]>([]);

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

  const dateFilteredData = useDateRangeFilter(filteredData, 'startDate');

  // Unique options derived from the full (pre-date-filter) dataset so options
  // don't disappear as the date range changes.
  const insuranceOptions = useMemo(
    () =>
      [...new Set(formattedDateData.map((r) => r.patientCaseName).filter(Boolean))].sort(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointments]
  );

  const reasonOptions = useMemo(
    () =>
      [...new Set(formattedDateData.map((r) => r.appointmentReason).filter(Boolean))].sort(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointments]
  );

  // Apply multiselect filters last
  const finalData = useMemo(
    () =>
      dateFilteredData.filter((row) => {
        const ins =
          selectedInsurance.length === 0 ||
          selectedInsurance.includes(row.patientCaseName);
        const rsn =
          selectedReason.length === 0 ||
          selectedReason.includes(row.appointmentReason);
        return ins && rsn;
      }),
    [dateFilteredData, selectedInsurance, selectedReason]
  );

  const hasFilters = selectedInsurance.length > 0 || selectedReason.length > 0;

  return (
    <div>
      {/* <h1>Appointments</h1> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <InsuranceSelector />
        <CopaySummary />
      </div>

      {formattedDateData.length > 0 && (
        <>
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-4">
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="insurance-filter-label">Insurance</InputLabel>
              <Select
                labelId="insurance-filter-label"
                multiple
                value={selectedInsurance}
                onChange={(e) => setSelectedInsurance(e.target.value as string[])}
                input={<OutlinedInput label="Insurance" />}
                renderValue={(selected) =>
                  selected.length === 1
                    ? selected[0]
                    : `Insurance (${selected.length})`
                }
              >
                {insuranceOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Checkbox checked={selectedInsurance.includes(opt)} />
                    <ListItemText primary={opt} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="reason-filter-label">Reason</InputLabel>
              <Select
                labelId="reason-filter-label"
                multiple
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value as string[])}
                input={<OutlinedInput label="Reason" />}
                renderValue={(selected) =>
                  selected.length === 1
                    ? selected[0]
                    : `Reason (${selected.length})`
                }
              >
                {reasonOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Checkbox checked={selectedReason.includes(opt)} />
                    <ListItemText primary={opt} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {hasFilters && (
              <button
                onClick={() => {
                  setSelectedInsurance([]);
                  setSelectedReason([]);
                }}
                className="text-sm text-slate-500 hover:text-slate-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>

          <AppointmentTable
            columns={allColumnHeaders}
            data={finalData}
            styling="w-full h-full"
          />
        </>
      )}
    </div>
  );
};

export default Appointments;
