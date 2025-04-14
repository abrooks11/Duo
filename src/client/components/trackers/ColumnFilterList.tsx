import React, { useState } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';
import { ActionTypes } from '../../context/GlobalContext';

function ColumnFilterList() {
  // get state and dispatch from global context
  const { state, dispatch } = useGlobalContext();
  // get all columns from state
  const { allColumnHeaders } = state.appointments;
  // sample column object: {
  //     "label": "AppointmentReason1",
  //     "value": "AppointmentReason1",
  //     "selected": true
  // }

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // extract checkbox name and checked status from event target
    const { name, checked } = e.target;
    // dispatch action to update column status
    // dispatch({
    //   type: ActionTypes.SET_APPOINTMENT_COLUMNS,
    //   payload: {
    //     column: name,
    //     isSelected: checked,
    //   },
    // });
  };

  return (
    <div className="header-selector-wrapper">
      <h2>Select Columns</h2>
      {allColumnHeaders.map((column) => (
        <div key={column.value} className="header-selector-item">
          <input
            id={column.value}
            type="checkbox"
            value={column.value}
            name={column.value}
            onChange={handleColumnChange}
            checked={column.isSelected}
          />
          <label htmlFor={column.value}>{column.label}</label>
        </div>
      ))}
    </div>
  );
}

export default ColumnFilterList;
