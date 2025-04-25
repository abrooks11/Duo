import { useEffect } from 'react';

// import state
import useGlobalContext from '../../hooks/useGlobalContext';

// import custom components
import VoicemailTable from '../voicemail/VoicemailTable';

// import custom hooks
import useApi from '../../hooks/useApi';

const Voicemail = () => {

  const api = useApi();

  useEffect(() => {
    if (!inbox.length && !trash.length) {
      api.getAll('voicemail');
    }
  }, []);

  // get global state from context
  const { state } = useGlobalContext();
  const { data, allColumnHeaders, selectedColumnHeaders, selectedFilters, selectedSort } =
    state.voicemail;

    const formattedVoicemailData = data.map((row) => {
            return {
        ...row,
        duration: Math.floor(row.duration/1000)
      };
    });
    
    const inbox = formattedVoicemailData.filter((row) => row.messageFolder === 'inbox');
    const trash = formattedVoicemailData.filter((row) => row.messageFolder === 'trash');

  return (
    <div className="voicemail-container">
      <div className="voicemail-section">
        <h1>({inbox.length || 0}) Unread</h1>
        {inbox.length > 0 && (
          <div className="table-container">
            <VoicemailTable
              columns={allColumnHeaders}
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
              columns={allColumnHeaders}
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