import { useState, useEffect } from 'react';
// import state
import useGlobalContext from '../../hooks/useGlobalContext';


// import custom components
import VoicemailTable from '../tables/VoicemailTable';

// import custom hooks
import useApi from '../../hooks/useApi';
import useDateRangeFilter from '../../hooks/useDateRangeFilter';

const Voicemail = () => {
  // get global state from context
  const { state } = useGlobalContext();
  const { data, rowFilterDetails, allColumnHeaders } = state.voicemail;

  const [inbox, setInbox] = useState<any[]>([]);
  const [trash, setTrash] = useState<any[]>([]);
  
  const api = useApi();
  
  useEffect(() => {
    if (!data.length) {
      api.getAll('voicemail');
    }
  }, []);
  
  // This effect runs when data changes (is fetched from API)
  useEffect(() => {
    processVoicemailData();
  }, [data]);
  
  
  const processVoicemailData = () => {
    if (data.length) {
      const formattedVoicemailData = data.map((row) => {
        return {
          ...row,
          duration: Math.floor(row.duration / 1000),
        };
      });

      setInbox(
        formattedVoicemailData.filter((row) => row.messageFolder === 'inbox')
      );
      setTrash(
        formattedVoicemailData.filter((row) => row.messageFolder === 'trash')
      );
    }
  };

  // Get active filters
  const activeFilters = Object.entries(rowFilterDetails)
    .filter(([_, details]) => details.isSelected)
    .map(([key]) => key);

  // Filter the data based on active filters
  const filteredInboxData = inbox.filter((row) => {
    // If no filters are selected, show all data
    if (activeFilters.length === 0) return true;

    // Check if the row matches any of the selected filters
    return activeFilters.some((filterKey) => {
      return row.reason === filterKey;
    });
  });

  const dateFilteredInboxData = useDateRangeFilter(filteredInboxData, 'createdDate')


  return (
    <div className="voicemail-container">
      <div className="voicemail-section">
        <h1>({inbox.length || 0}) Unread</h1>
        {inbox.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={allColumnHeaders}
              data={dateFilteredInboxData}
              className="w-full h-full"
              dynamicHeight={true}
            />
          </div>
        )}
      </div>
      {/* <div className="voicemail-section">
        <h1>({trash.length}) Read</h1>
        {trash.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={allColumnHeaders}
              data={trash}
              className="w-full h-full"
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Voicemail;
