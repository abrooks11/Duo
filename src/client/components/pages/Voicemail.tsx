import { useEffect } from 'react';

// import state
import useGlobalContext from '../../hooks/useGlobalContext';

// import custom components
import VoicemailTable from '../voicemail/VoicemailTable';

// import custom hooks
import useApi from '../../hooks/useApi';
import {formatDate, formatDuration} from '../../utils/dataTransformers'

const Voicemail = () => {
  // get global state from context
  const { state } = useGlobalContext();
  const { inbox, trash, selectedColumnHeaders, selectedFilters, selectedSort } =
    state.voicemail;

  const api = useApi();

  useEffect(() => {
    if (!inbox.data.length && !trash.data.length) {
      api.getAll('voicemail');
    }
  }, []);

  const formattedInboxData = inbox.data.map((row) => {
    return {
      ...row,
      created_at: formatDate(row.created_at),
      duration: formatDuration(row.duration),
      // duration: formatDuration(row.duration),
    };
  });

  const formattedTrashData = trash.data.map((row) => {
    return {
      ...row,
      created_at: formatDate(row.created_at),
      duration: formatDuration(row.duration),
    };
  });


  return (
    <div className="voicemail-container">
      <div className="voicemail-section">
        <h1>({inbox.data.length || 0}) Unread</h1>
        {inbox.data.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={selectedColumnHeaders}
              data={formattedInboxData}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
      <div className="voicemail-section">
        <h1>({trash.data.length}) Read</h1>
        {trash.data.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={selectedColumnHeaders}
              data={formattedTrashData}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Voicemail;