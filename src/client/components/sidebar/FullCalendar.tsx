import { DateRange } from 'react-date-range';
import type { RangeKeyDict } from 'react-date-range';

import useGlobalContext from '../../hooks/useGlobalContext';
import { appointmentActions } from '../../context/reducers/appointmentReducer';

import { useState, useEffect } from 'react';
import useStateMap from '../../hooks/useStateMap';


// IMPORT DATE RANGE CSS
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const FullCalendar = () => {
  const currentPage = useStateMap();
  const [resource, setResource] = useState<string>('appointments')
  const [RANGE, SETRANGE] = useState<RangeKeyDict>({
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
      if (DATERANGE && DATERANGE[0]) {
        SETRANGE({ selection: { ...DATERANGE[0] } })
      }
      // console.log({currentPage, DATERANGE});
    }
}, [currentPage, state]); // Update dependency array


  const setRange = (item: RangeKeyDict) => {
    // console.log(item);
    SETRANGE(item)

    // Only handle appointments for now since that's the only implemented reducer
    if (resource === 'appointments' && item.selection) {
      const sel = item.selection;
      dispatch(appointmentActions.setDateRange([{
        startDate: sel.startDate ?? new Date(),
        endDate: sel.endDate ?? new Date(),
        key: sel.key ?? 'selection',
        color: (sel as { color?: string }).color ?? '#3d91ff',
      }]));
    }
  };

  return (
    <div className="calendar">
      {/* <h1>Calendar</h1> */}
      <DateRange
        editableDateInputs={true}
        onChange={item => setRange(item) }
        moveRangeOnFirstSelection={true}
        retainEndDateOnFirstSelection={true}
        ranges={[RANGE.selection ?? { startDate: new Date(), endDate: new Date(), key: 'selection' }]}
      />
    </div>
  );
};

export default FullCalendar;
