// import react hooks 
import { useEffect, useMemo } from "react";
// import state
import useGlobalContext from "../../hooks/useGlobalContext";

// import custom components 
import Table from "../ui/Table";

// import custom hooks 
import useApi from "../../hooks/useApi";

// import custom hooks/utilities
import dataTransformers from "../../utils/dataTransformers";

const Appointments = () => {
  // get global state from context
  const { state } = useGlobalContext();

  // destructure appointment object from global state
  const { data, selectedColumnHeaders, selectedFilters, selectedSort } =
    state.appointments;

  // extract utils 
  const {formatDate, filterAndSort} = dataTransformers 

  // use custom hook
  const api = useApi()

  useEffect(()=>{
    api.getAll('appointments')
  }, [])


  // prep data: format the dates
  const formattedDateData = data.map((row) => {
    // console.log()
    return {
      ...row,
      createdDate: formatDate(row.createdDate),
      lastModifiedDate: formatDate(row.lastModifiedDate),
      startDate: formatDate(row.startDate),
    };
  });

  // process the data (apply filters and sort)
  const processedData = useMemo(() => {
    return filterAndSort(formattedDateData, selectedFilters, selectedSort);
  }, [formattedDateData, selectedFilters, selectedSort]);

  return (
    <div>
      <h1>Appointments</h1>
      {processedData.length > 0 && (
        <Table columns={selectedColumnHeaders} data={processedData} />
      )}
    </div>
  );
}

export default Appointments 