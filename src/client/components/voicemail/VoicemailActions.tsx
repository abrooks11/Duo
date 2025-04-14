import textBubble from '../../assets/text-bubble.svg';
import { requestAiResponse } from "../../utils/voicemailApi";

const VoicemailActions = ({content}) => {
    const generateResponse = async () => {
        console.log('generateResponse clicked')
        const response = await requestAiResponse("voicemail", content)
        console.log('Generated response', response);
    };

  return (
    <div className="border-2 border-orange-400">
      <button onClick={generateResponse}><img src={textBubble} alt="Text Bubble" className="w-5 h-5" /></button>
    </div>
  );
};

export default VoicemailActions;
