import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Add this import
import useGlobalContext from '../../hooks/useGlobalContext';
import type { GlobalState, TableColumn } from '../../context/GlobalContext';
import { ActionTypes } from '../../context/GlobalContext';

function ColumnFilterList() {
  // get state and dispatch from global context
  const { state, dispatch } = useGlobalContext();
  // get all columns from state
  const { allColumnHeaders } = state.appointments;
  const [allColumnLabels, setAllColumnLabels] = useState<TableColumn[]>([]);

  const location = useLocation();  // Add this hook

// Map paths to their corresponding state properties
const PATH_TO_STATE_MAP: Record<string, keyof GlobalState> = {
  "": 'home', 
  appointments: 'appointments',
  claims: 'claims',
  patients: 'patients',
  voicemail: 'voicemail',
};


useEffect(() => {
  // Remove leading slash and get the path
const currentPath = location.pathname.slice(1);

// Get the corresponding state property from the map
const stateProperty = PATH_TO_STATE_MAP[currentPath];

const columnHeaders = state[stateProperty]?.allColumnHeaders || []
console.log(columnHeaders.length);


if (columnHeaders.length) {
  setAllColumnLabels(columnHeaders);
} else {
  setAllColumnLabels([]);
}
}, [location.pathname, state]);



  // const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // extract checkbox name and checked status from event target
  //   const { name, checked } = e.target;
  //   // dispatch action to update column status
  //   // dispatch({
  //   //   type: ActionTypes.SET_APPOINTMENT_COLUMNS,
  //   //   payload: {
  //   //     column: name,
  //   //     isSelected: checked,
  //   //   },
  //   // });
  // };

  return (
    <div className="header-selector-wrapper">
      <h2>Select Columns</h2>
      {allColumnLabels.map((column) => (
        <div key={column.value} className="header-selector-item">
          <input
            id={column.value}
            type="checkbox"
            value={column.value}
            name={column.value}
            // onChange={handleColumnChange}
            checked={column.isSelected}
          />
          <label htmlFor={column.value}>{column.label}</label>
        </div>
      ))}
    </div>
  );
}

export default ColumnFilterList;
