import { useState } from 'react';
import { useVoicemail } from '../index_voicemail';
import { useSmsForm } from '@client/context/shared/smsFormcontext';
import { MessageSquareText, Trash2 } from 'lucide-react';
import { VoicemailData } from '@client/context/types/state';

interface Props {
  vmId: string;
  rowData: VoicemailData;
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
    populateForm({
      fullName: rowData.callerName,
      phoneNumber: rowData.callerNumber,
      transcript: rowData.transcription,
    });
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <button
        onClick={handleReply}
        className="p-1 rounded-full hover:bg-gray-100"
        title="Reply"
      >
        <MessageSquareText />
      </button>
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
    </div>
  );
};

export default VoicemailActionList;
