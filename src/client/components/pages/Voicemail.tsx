import { useState, useEffect } from 'react';

// import state
import useGlobalContext from '../../hooks/useGlobalContext';

// import custom components
import VoicemailTable from '../voicemail/VoicemailTable';

// import custom hooks
import useApi from '../../hooks/useApi';
import { requestVoicemail } from '../../utils/voicemailApi';

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



  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <h1>Unread</h1>
        {inbox.data.length > 0 && (
          <div className='flex-1'>
            <VoicemailTable
              columns={selectedColumnHeaders}
              data={inbox.data}
              className="w-full h-full overflow-auto"
              />
              </div>
            )}
      </div>
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <h1>Read</h1>
        {trash.data.length > 0 && (
          <div className='flex-1'>
            <VoicemailTable
              columns={selectedColumnHeaders}
              data={trash.data}
              className="w-full h-full overflow-auto"
              />
              </div>
            )}
      </div>
    </div>
  );
};

export default Voicemail;