import { useState } from 'react';
import { format } from 'date-fns';
import VoicemailDropDown from './VoicemailDropDown';
// import VoicemailActions from './VoicemailActions';

interface VoicemailRowProps {
  key: string;
  id: string;
  phone: string;
  name: string;
  date: string;
  duration: string;
  transcript: string;
}

const formatPhoneNumber = (phone: string) => {
  // Remove leading 1
  const cleaned = phone.slice(1, phone.length);
  // Format as (xxx) xxx-xxxx
  const area = cleaned.slice(0, 3);
  const mid = cleaned.slice(3, 6);
  const end = cleaned.slice(6, cleaned.length);
  return `(${area}) ${mid}-${end}`; // Return original if format doesn't match
};

const formatDuration = (duration: string) => {
  const seconds = Math.floor(parseInt(duration) / 1000);
  return `${seconds}s`;
};

const assignCategory = (str :string) => {
  const appointmentKeywords = [
    'appointment',
    'schedule',
    'cancel',
    'reschedule',
    'annual',
  ];
  const prescriptionKeywords = ['prescription', 'pharmacy', 'cvs', 'walgreens'];
  const referralKeywords = ['refer', 'referral', 'referred'];

  if (!str) return 'unassigned';

  const lowerStr = str.toLowerCase();
  // console.log('Input string:', lowerStr);

  if (appointmentKeywords.some(keyword => lowerStr.includes(keyword))) {
    // console.log('Found appointment keyword');
    return 'appointment';
  }
  if (prescriptionKeywords.some(keyword => lowerStr.includes(keyword))) {
    // console.log('Found prescription keyword');
    return 'prescription';
  }
  if (referralKeywords.some(keyword => lowerStr.includes(keyword))) {
    // console.log('Found referral keyword');
    return 'referral-pt';
  }

  // console.log('No keywords found');
  return 'unassigned';
};

const VoicemailRow = ({
  id,
  phone,
  name,
  date,
  duration,
  transcript,
}: VoicemailRowProps) => {
  const [category, setCategory] = useState( assignCategory(transcript))

  const formattedDate = format(new Date(date), 'MMM dd');
  const formattedPhone = formatPhoneNumber(phone);
  const formattedDuration = formatDuration(duration);

  return (
    <tr id={id}>
      <td className="py-2 align-top">{formattedDate}</td>
      <td className="py-2 align-top">{formattedPhone}</td>
      <td className="py-2 align-top">{name}</td>
      <td className="py-2 align-top">
        <VoicemailDropDown reason={category} onChange={setCategory} />
      </td>
      <td className="py-2 align-top">{formattedDuration}</td>
      <td className="py-2 w-[70%]">
        {transcript}
        {/* <VoicemailActions content={transcript} /> */}
      </td>
    </tr>
  );
};

export default VoicemailRow;
