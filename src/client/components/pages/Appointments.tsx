// import react hooks
import { useEffect, useMemo } from 'react';
// import state
import useGlobalContext from '../../hooks/useGlobalContext';

// import custom components
import Table from '../tables/Table';
import AppointmentTable from '../tables/AppointmentTable';


// import custom hooks
import useApi from '../../hooks/useApi';

// import custom hooks/utilities
import dataTransformers, { formatDate } from '../../utils/dataTransformers';

const Appointments = () => {
  // get global state from context
  const { state } = useGlobalContext();

  // destructure appointment object from global state
  const {
    data,
    rowFilterDetails, 
    allColumnHeaders,
  } = state.appointments;

  // console.log({data});
  

  // extract utils
  const { filterAndSort } = dataTransformers;

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

  // process the data (apply filters and sort)
  // const processedData = useMemo(() => {
  //   return filterAndSort(formattedDateData, selectedFilters, selectedSort);
  // }, [formattedDateData, selectedFilters, selectedSort]);

  return (
    <div>
      <h1>Appointments</h1>
      {formattedDateData.length > 0 && (
        <AppointmentTable columns={allColumnHeaders} data={formattedDateData} styling="w-full h-full" />
      )}
    </div>
  );
};

export default Appointments;
