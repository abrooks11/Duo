import VoicemailRow from './VoicemailRow'

const VoicemailTable = ({voicemailList}) => {
  return (
    <table>
      {/* HEADER ROW */}
      <thead>
        <tr>
          <th>Date</th>
          <th>Phone Number</th>
          <th>Name</th>
          <th>Reason</th>
          <th>Duration</th>
          <th>Transcription</th>
        </tr>
      </thead>
      <tbody>
        {voicemailList &&
            voicemailList.map(element => {
              const {
                id,
                caller, // phone number
                caller_name,
                created_at,
                duration,
                transcription,
              } = element;
              return (
                <VoicemailRow
                  key={id}
                  id={id}
                  phone={caller}
                  name={caller_name}
                  date={created_at}
                  duration={duration}
                  transcript={transcription}
                />
              );
            })}
      </tbody>
    </table>
  )
}

export default VoicemailTable
