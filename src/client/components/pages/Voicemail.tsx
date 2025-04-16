import { useState } from 'react';
import VoicemailTable from '../voicemail/VoicemailTable';
import { requestVoicemail } from '../../utils/voicemailApi';

const Voicemail = () => {
  const [inbox, setInbox] = useState([]);

  const handleGetVoicemail = async (folder:string ) => {
    console.log('FOLDER: ', folder);
    const voicemail = await requestVoicemail(folder);
    setInbox(voicemail);
  };

  return (
    <div>
      {/* TOP BUTTON WRAPPER */}
      <div>need button for unread emails and button for read voicemails </div>
      <div className="h-[100px] border border-red-100 flex justify-center gap-4">
        <button
          className="bg-rose-400 h-[50px] w-[100px] hover:bg-rose-600"
          onClick={() => handleGetVoicemail('inbox')}
        >
          Unread
        </button>
        <button
          className="bg-rose-400 h-[50px] w-[100px] hover:bg-rose-600"
          onClick={() => handleGetVoicemail('trash')}
        >
          Read
        </button>
      </div>

      <div className="min-h-[100px] border-2 border-blue-100 flex flex-col justify-center gap-4">
        <VoicemailTable voicemailList={inbox} />
      </div>
    </div>
  );
};

export default Voicemail;
