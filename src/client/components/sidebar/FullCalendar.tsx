import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
// import { addDays, format, isWeekend } from 'date-fns';

import useGlobalContext from '../../hooks/useGlobalContext';
import { appointmentActions } from '../../context/reducers/appointmentReducer';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Add this import
import useStateMap from '../../hooks/useStateMap';


// IMPORT DATE RANGE CSS
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const FullCalendar = () => {
  // !!!need type definition for resource pages
  const location = useLocation();
  const currentPage = useStateMap(); // Move hook call to top level
  const [resource, setResource] = useState<string>('appointments')
  const [RANGE, SETRANGE] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
      color: '#3d91ff',
    },
  });

  const {state, dispatch} = useGlobalContext()

  useEffect(() => {
    if (currentPage === 'appointments') {
      const DATERANGE = state[currentPage]?.selectedDateRange
      setResource(currentPage)
      if (DATERANGE && DATERANGE.selection) {
        SETRANGE({ selection: { ...DATERANGE.selection } })
      }
      // console.log({currentPage, DATERANGE});
    }
}, [currentPage, state]); // Update dependency array


  const setRange = (item) => {
    // console.log(item);
    SETRANGE(item)
    
    // Only handle appointments for now since that's the only implemented reducer
    if (resource === 'appointments') {
      dispatch(appointmentActions.setDateRange([item.selection]));
    }
  };

  return (
    <div className="w-100%">
      {/* <h1>Calendar</h1> */}
      <DateRange
        editableDateInputs={true}
        onChange={item => setRange(item) }
        moveRangeOnFirstSelection={true}
        retainEndDateOnFirstSelection={true}
        ranges={[RANGE.selection]}
      />
    </div>
  );
};

export default FullCalendar;
