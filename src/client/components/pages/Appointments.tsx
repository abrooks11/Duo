// import react hooks
import { useEffect } from 'react';

// import state
import useGlobalContext from '../../hooks/useGlobalContext';

// import custom components
import AppointmentTable from '../tables/AppointmentTable';

// import custom hooks
import useApi from '../../hooks/useApi';
import useDateRangeFilter from '../../hooks/useDateRangeFilter';

// import custom hooks/utilities
import { formatDate } from '../../utils/dataTransformers';
import { appointmentRowFilterMap } from '../../utils/keyMappings';

const Appointments = () => {
  // get global state from context
  const { state } = useGlobalContext();
  
  
  // destructure appointment object from global state
  const {
    data,
    rowFilterDetails, 
    allColumnHeaders,
  } = state.appointments;
  
  // use custom hook
  const api = useApi();
  
  useEffect(() => {
    if (!data.length) {
      api.getAll('appointments');
    }
  }, []);
  

  

  // prep data: format the dates
  const formattedDateData = data.map((row) => {
    const {createdDate, lastModifiedDate, startDate} = row

    return {
      ...row,
      createdDate: formatDate(createdDate),
      lastModifiedDate: formatDate(lastModifiedDate),
      startDate: formatDate(startDate, true),
    };
  });

// Get active filters
const activeFilters = Object.entries(rowFilterDetails)
.filter(([_, details]) => details.isSelected)
.map(([key]) => key);


// Filter the data based on active filters
const filteredData = formattedDateData.filter(row => {
  // If no filters are selected, show all data
  if (activeFilters.length === 0) return true;
  
  // Check if the row matches any of the selected filters
  return activeFilters.some(filterKey => {
    if (appointmentRowFilterMap[filterKey]) {
      return appointmentRowFilterMap[filterKey].includes(row.confirmationStatus);
    }
    return false;
  });
});

const dateFilteredData = useDateRangeFilter(filteredData, 'startDate')


// console.log({activeFilters});
// console.log({filteredData});

  return (
    <div>
      <h1>Appointments</h1>
      {formattedDateData.length > 0 && (
        <AppointmentTable columns={allColumnHeaders} data={dateFilteredData} styling="w-full h-full" />
      )}
    </div>
  );
};

export default Appointments;
