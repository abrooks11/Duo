import { DateRange } from 'react-date-range';
import useGlobalContext from '../../hooks/useGlobalContext';
import { ActionTypes } from '../../context/GlobalContext';

// import { addDays, format, isWeekend } from 'date-fns';

// IMPORT DATE RANGE CSS
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const FullCalendar = () => {
  const {state, dispatch} = useGlobalContext()
  const {selectedDateRange} = state

  const setRange = (dateRange) => {
    // console.log(dateRange);
    dispatch({
      type: ActionTypes.SET_CALENDAR_RANGE,
      payload: dateRange,
    });
  };

  return (
    <div className="w-100%">
      {/* <h1>Calendar</h1> */}
      <DateRange
        editableDateInputs={true}
        onChange={item => setRange([item.selection])}
        moveRangeOnFirstSelection={true}
        retainEndDateOnFirstSelection={true}
        ranges={selectedDateRange}

      />
    </div>
  );
};

export default FullCalendar;
