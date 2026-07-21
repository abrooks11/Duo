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

  const insuranceMap = useMemo(() => {
    const result = [
      { label: 'BC/BS', keywordList: ['bc/bs', 'bcbs'] },
      { label: 'AETNA', keywordList: ['aetna', 'meritain'] },
      { label: 'CIGNA', keywordList: [] },
      {
        label: 'UNITED',
        keywordList: ['united', 'uhc', 'united healthcare'],
      },
      { label: 'UMR', keywordList: [] },
      { label: 'MEDICARE', keywordList: ['medicare', 'mcr'] },
      { label: 'TRICARE', keywordList: [] },
      { label: 'HUMANA', keywordList: [] },
    ];
    return result;
  }, []);

  const reasonMap = useMemo(() => {
    const result = [
      { label: 'WELLNESS', reasonList: ['Well'] },
      {
        label: 'E/M',
        reasonList: [
          'Injection',
          'Colpo',
          'Consultation',
          'Follow',
          'Iud',
          'Problem',
          'Pellet',
          'Post',
          'Pre',
          'Weight',
          'Votiva',
        ],
      },
      { label: 'TELEHEALTH', reasonList: ['Phone'] },
      { label: 'SURGERY', reasonList: [] },
    ];
    return result;
  }, []);
  // Unique options derived from the full (pre-date-filter) dataset so options
  // don't disappear as the date range changes.
  const insuranceOptions = useMemo(() => {
    const insuranceList = insuranceMap.map((ins) => ins.label);
    return ['ALL', ...insuranceList, 'OTHER', 'CLEAR'];
  }, [insuranceMap]);

  const reasonOptions = useMemo(() => {
    const reasonList = reasonMap.map((rsn) => rsn.label);
    return ['ALL', ...reasonList, 'CLEAR'];
  }, [reasonMap]);

  const checkIns = useCallback(
    (ins: string | null | undefined): boolean => {
      if (!ins) return false;

      const haystack = ins.toLowerCase();

      // Only match against the insurers the user actually selected.
      return selectedInsurance.some((selectedLabel) => {
        const entry = insuranceMap.find((m) => m.label === selectedLabel);
        if (!entry) return false;

        if (haystack.includes(entry.label.toLowerCase())) return true;

        return entry.keywordList.some((keyword) =>
          haystack.includes(keyword.toLowerCase())
        );
      });
    },
    [selectedInsurance, insuranceMap]
  );

  const checkRsn = useCallback(
    (rsn: string | null | undefined): boolean => {
      if (!rsn) return false;

      const haystack = rsn.toLowerCase();

      // Only match against the reasons the user actually selected.
      return selectedReason.some((selectedLabel) => {
        const entry = reasonMap.find((m) => m.label === selectedLabel);
        if (!entry) return false;

        if (haystack.includes(entry.label.toLowerCase())) return true;

        return entry.reasonList.some((keyword) =>
          haystack.includes(keyword.toLowerCase())
        );
      });
    },
    [selectedReason, reasonMap]
  );

  // Apply multiselect filters last
  const finalData = useMemo(() => {
    const result = dateFilteredData.filter((row) => {
      const ins: boolean =
        selectedInsurance.length === 0 || checkIns(row.patientCaseName);

      const rsn: boolean =
        selectedReason.length === 0 || checkRsn(row.appointmentReason);
      return ins && rsn;
    });
    // console.log({selectedInsurance, result})
    return result;
  }, [dateFilteredData, selectedInsurance, selectedReason, checkIns, checkRsn]);

  console.log({ finalData });

  const hasFilters = selectedInsurance.length > 0 || selectedReason.length > 0;

  // Control tokens are not real filter values — they trigger check-all / clear.
  const insuranceSelectable = insuranceOptions.filter(
    (opt) => opt !== 'ALL' && opt !== 'CLEAR'
  );
  const reasonSelectable = reasonOptions.filter(
    (opt) => opt !== 'ALL' && opt !== 'CLEAR'
  );

  const handleInsuranceChange = (value: string[]) => {
    if (value.includes('CLEAR')) return setSelectedInsurance([]);
    if (value.includes('ALL')) return setSelectedInsurance(insuranceSelectable);
    setSelectedInsurance(value);
  };

  const handleReasonChange = (value: string[]) => {
    if (value.includes('CLEAR')) return setSelectedReason([]);
    if (value.includes('ALL')) return setSelectedReason(reasonSelectable);
    setSelectedReason(value);
  };

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
                onChange={(e) =>
                  handleInsuranceChange(e.target.value as string[])
                }
                input={<OutlinedInput label="Insurance" />}
                renderValue={(selected) =>
                  selected.length === 1
                    ? selected[0]
                    : `Insurance (${selected.length})`
                }
              >
                {insuranceOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Checkbox
                      checked={
                        opt === 'ALL'
                          ? insuranceSelectable.every((o) =>
                              selectedInsurance.includes(o)
                            )
                          : opt === 'CLEAR'
                            ? false
                            : selectedInsurance.includes(opt)
                      }
                    />
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
                onChange={(e) => handleReasonChange(e.target.value as string[])}
                input={<OutlinedInput label="Reason" />}
                renderValue={(selected) =>
                  selected.length === 1
                    ? selected[0]
                    : `Reason (${selected.length})`
                }
              >
                {reasonOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Checkbox
                      checked={
                        opt === 'ALL'
                          ? reasonSelectable.every((o) =>
                              selectedReason.includes(o)
                            )
                          : opt === 'CLEAR'
                            ? false
                            : selectedReason.includes(opt)
                      }
                    />
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
