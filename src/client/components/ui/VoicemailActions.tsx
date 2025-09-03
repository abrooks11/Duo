
import { useState } from 'react';
import { useVoicemail } from '../../hooks/useVoicemail';
import textBubble from '../../assets/text-bubble.svg';
import trashCan from '../../assets/trash-can.svg';

interface Props {
  vmId: string
}

const VoicemailActions = ({ vmId }: Props) => {
  const { deleteVoicemail } = useVoicemail();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent double-clicks
    
    setIsDeleting(true);
    try {
      await deleteVoicemail(vmId);
      console.log('Voicemail deleted successfully');
    } catch (error) {
      console.error('Failed to delete voicemail:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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
        disabled={isDeleting}
        className={`p-1 rounded-full ${
          isDeleting 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'hover:bg-gray-100'
        }`}
        title={isDeleting ? "Deleting..." : "Delete"}
      >
        <img 
          src={trashCan} 
          alt="Delete" 
          className={`w-5 h-5 ${isDeleting ? 'opacity-50' : ''}`} 
        />
      </button>
    </div>
  );
};

export default VoicemailActions;
