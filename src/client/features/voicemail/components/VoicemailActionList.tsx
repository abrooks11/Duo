import { useState } from 'react';
import { useVoicemail } from '../index_voicemail';
import { useSmsForm } from '@client/context/shared/smsFormcontext';
import textBubble from '@client/assets/text-bubble.svg';
import trashCan from '@client/assets/trash-can.svg';
import { MessageSquareText, Trash2 } from 'lucide-react';

interface Props {
  vmId: string;
  rowData: any;
}

const VoicemailActionList = ({ vmId, rowData }: Props) => {
  const { populateForm } = useSmsForm();

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
    console.log(rowData);
    populateForm({
      fullName: rowData.callerName,
      phoneNumber: rowData.callerNumber,
      transcript: rowData.transcription,
    });
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`p-1 rounded-full ${
          isDeleting ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
        title={isDeleting ? 'Deleting...' : 'Delete'}
      >
        <Trash2 />
      </button>
      <button
        onClick={handleReply}
        className="p-1 rounded-full hover:bg-gray-100"
        title="Reply"
      >
        <MessageSquareText />
        {/* <img src={textBubble} alt="Reply" className="w-5 h-5" /> */}
      </button>
    </div>
  );
};

export default VoicemailActionList;
