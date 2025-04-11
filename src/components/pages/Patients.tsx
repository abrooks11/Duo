// import react hooks 
import { useEffect, useMemo } from "react";
// import context and action types
import useGlobalContext from "../../hooks/useGlobalContext";

// import custom components 
import Table from "../ui/Table";

// import custom hooks 
import useApi from "../../hooks/useApi";

// import custom utilities
import dataTransformers from "../../utils/dataTransformers";

function Patients() {
  // get global state from context
  const { state } = useGlobalContext();

  // destructure patient object from global state
  const { data, selectedColumnHeaders, selectedFilters, selectedSort } =
    state.patients;

  // extract utils 
  const {formatDate, filterAndSort} = dataTransformers 

  // use custom hook
  const api = useApi()

  useEffect(()=>{
    api.getAll('patients')
  }, [])

  // prep data: format the dates
  const formattedDateData = data.map((row) => {
    return {
      ...row,
      createdDate: formatDate(row.createdDate),
      lastModifiedDate: formatDate(row.lastModifiedDate),
      startDate: formatDate(row.startDate),
      dob: formatDate(row.dob)
    };
  });

  // process the data: apply filters and sort
  const processedData = useMemo(() => {
    return filterAndSort(formattedDateData, selectedFilters, selectedSort);
  }, [formattedDateData, selectedFilters, selectedSort]);

  return (
    <div>
      <h1>Patients</h1>
      {processedData.length > 0 && (
        <Table columns={selectedColumnHeaders} data={processedData} />
      )}
    </div>
  );
}

export default Patients;
