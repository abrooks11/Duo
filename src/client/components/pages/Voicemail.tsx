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
  const { data, selectedColumnHeaders, selectedFilters, selectedSort } =
    state.voicemail;

    const formattedVoicemailData = data.map((row) => {
      return {
        ...row,
        created_at: formatDate(row.created_at),
        duration: formatDuration(row.duration),
        // duration: formatDuration(row.duration),
      };
    });
  

    const inbox = formattedVoicemailData.filter((row) => row.messageFolder === 'inbox');
    const trash = formattedVoicemailData.filter((row) => row.messageFolder === 'trash');

  const api = useApi();

  useEffect(() => {
    if (!inbox.length && !trash.length) {
      api.getAll('voicemail');
    }
  }, []);


  return (
    <div className="voicemail-container">
      <div className="voicemail-section">
        <h1>({inbox.length || 0}) Unread</h1>
        {inbox.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={selectedColumnHeaders}
              data={inbox}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
      <div className="voicemail-section">
        <h1>({trash.length}) Read</h1>
        {trash.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={selectedColumnHeaders}
              data={trash}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Voicemail;