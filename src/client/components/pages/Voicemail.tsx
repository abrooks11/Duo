import { useState, useEffect } from 'react';

// import state
import useGlobalContext from "../../hooks/useGlobalContext";

// import custom components 
import Table from "../ui/Table";
import VoicemailTable from '../voicemail/VoicemailTable';

// import custom hooks 
import useApi from "../../hooks/useApi";
import { requestVoicemail } from '../../utils/voicemailApi';

const Voicemail = () => {
  

  
  // get global state from context
  const { state } = useGlobalContext();
  
  // destructure appointment object from global state
  const { data, selectedColumnHeaders, selectedFilters, selectedSort } =
  state.voicemail;

  const api = useApi()
  
  useEffect(()=>{
    if (!data.length) {
      api.getAll('voicemail')
    }
    console.log(data)
  }, [])

  // const [inbox, setInbox] = useState([]);

  // const handleGetVoicemail = async (folder:string ) => {
  //   console.log('FOLDER: ', folder);
  //   const voicemail = await requestVoicemail(folder);
  //   setInbox(voicemail);
  // };

  return (
    <div>
      {/* TOP BUTTON WRAPPER */}
      <div>NEED TO ADD VOICEMAIL TO STATE </div>
      <div className="h-[100px] border border-red-100 flex justify-center gap-4">
        {/* <button
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
        </button> */}
      </div>

      <div className="min-h-[100px] border-2 border-blue-100 flex flex-col justify-center gap-4">
      {data.length > 0 && (
        <Table columns={selectedColumnHeaders} data={data} />
      )}
       {/* <VoicemailTable voicemailList={data} /> */}
      </div>
    </div>
  );
};

export default Voicemail;
