import { useState, useEffect } from 'react';

// import custom components
import {VoicemailTable, useVoicemail} from '../features/voicemail/index_voicemail';

// import custom hooks
import useDateRangeFilter from '../hooks/useDateRangeFilter';

import {SmsForm} from '../features/sms/components/SmsForm'

const Voicemail = () => {
  const {
    voicemail,
    allColumnHeaders,
    rowFilterDetails,
    // isLoading,
    // error,
    loadVoicemail,
  } = useVoicemail();

  const [inbox, setInbox] = useState<any[]>([]);

  useEffect(() => {
    if (!voicemail.length) {
      loadVoicemail();
    }
  }, [voicemail.length, loadVoicemail]);

  // This effect runs when data changes (is fetched from API)
  useEffect(() => {
    processVoicemailData();
  }, [voicemail]);

  const processVoicemailData = () => {
    if (voicemail.length) {
      const formattedVoicemailData = voicemail.map((row) => {
        return {
          ...row,
          duration: Math.floor(row.duration / 1000),
        };
      });

      setInbox(
        formattedVoicemailData.filter((row) => row.messageFolder === 'inbox')
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
        <h1>Send Message</h1>
        <SmsForm />
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
    </div>
  );
};

export default Voicemail;
