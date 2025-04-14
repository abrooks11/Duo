const VoicemailDropDown = ({ reason, onChange }) => {
  return (
    <select
      name="reason"
      id="reason"
      value={reason}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="unassigned">Unassigned</option>
      <option value="appointment">Appointment</option>
      <option value="admin">Admin</option>
      <option value="labs">Labs</option>
      <option value="prescription">Prescription</option>
      <option value="record-request">Record Request</option>
      <option value="referral-pt">Referral; Patient</option>
      <option value="referral-clinic">Referral; Clinic</option>
    </select>
  );
};

export default VoicemailDropDown;
