import { useEffect, useMemo } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';
import Table from '../tables/Table';
import useApi from '../../hooks/useApi';
import dataTransformers from '../../utils/dataTransformers';

function Claims() {
  const { state } = useGlobalContext();
  const { data, selectedColumnHeaders, selectedFilters, selectedSort } =
    state.claims;
  const { formatDate, filterAndSort } = dataTransformers;
  const api = useApi();

  useEffect(() => {
    api.getAll('claims');
  }, []);

  // Format dates in the data
  const formattedDateData = data.map((row) => {
    return {
      ...row,
      createdDate: formatDate(row.createdDate),
      lastModifiedDate: formatDate(row.lastModifiedDate),
      serviceStartDate: formatDate(row.serviceStartDate),
    };
  });

  // Process the data with filters and sorting
  const processedData = useMemo(() => {
    return filterAndSort(formattedDateData, selectedFilters, selectedSort);
  }, [formattedDateData, selectedFilters, selectedSort]);

  return (
    <div>
      <h1>Claims</h1>
      {processedData.length > 0 && (
        <Table columns={selectedColumnHeaders} data={processedData} />
      )}
    </div>
  );
}

export default Claims;
