import { Calendar } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const FullCalendar = () => {



  return (
    <div>
      <h1>Calendar</h1>
      <Calendar
        date={new Date()}
      />
    </div>
  );
};

export default FullCalendar;
