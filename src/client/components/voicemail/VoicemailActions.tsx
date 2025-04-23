import textBubble from '../../assets/text-bubble.svg';
import { deleteVoicemail } from '../../utils/voicemailApi';

interface Props {
  vmId : string
}

const VoicemailActions = ({vmId}: Props) => {
// NEED BUTTONS FOR: DELETE, REPLY 
const handleDelete = async () => {
  await deleteVoicemail(vmId)
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
      <img src={textBubble} alt="Delete" className="w-5 h-5" />
    </button>
  </div>
  );
};

export default VoicemailActions;
