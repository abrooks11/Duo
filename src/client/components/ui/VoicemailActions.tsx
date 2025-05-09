
import useGlobalContext from '../../hooks/useGlobalContext';
import { ActionTypes } from '../../context/GlobalContext';

import { deleteVoicemail } from '../../utils/voicemailApi';
import textBubble from '../../assets/text-bubble.svg';
import trashCan from '../../assets/trash-can.svg';



interface Props {
  vmId : string
}

const VoicemailActions = ({vmId}: Props) => {
  const {dispatch} = useGlobalContext()


const handleDelete = async () => {
  const {status} = await deleteVoicemail(vmId)
  console.log('delete status', status);
  if (status === 200) {
    dispatch({
      type: ActionTypes.DELETE_VOICEMAIL,
      payload: vmId
    })
  }
  return 
}

const handleReply = () => {
  console.log('REPLYING . . . ');
  
}

  return (
    <div className="flex items-center justify-center">
    <button 
      onClick={handleReply}
      className="p-1 rounded-full hover:bg-gray-100"
      title="Reply"
    >
      <img src={textBubble} alt="Reply" className="w-5 h-5" />
    </button>
    <button 
      onClick={handleDelete}
      className="p-1 rounded-full hover:bg-gray-100"
      title="Delete"
    >
      <img src={trashCan} alt="Delete" className="w-5 h-5" />
    </button>
  </div>
  );
};

export default VoicemailActions;
