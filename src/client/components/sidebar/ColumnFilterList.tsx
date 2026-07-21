import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useGlobalContext from '../../hooks/useGlobalContext';
import type { GlobalState, TableColumn } from '../../context/types/state';

function ColumnFilterList() {
  const { state } = useGlobalContext();
  const [allColumnLabels, setAllColumnLabels] = useState<TableColumn[]>([]);

  const location = useLocation();

// Map paths to their corresponding state properties
const PATH_TO_STATE_MAP: Record<string, keyof GlobalState> = {
  appointments: 'appointments',
  claims: 'claims',
  patients: 'patients',
  voicemail: 'voicemail',
};


useEffect(() => {
  const currentPath = location.pathname.slice(1);
  const stateProperty = PATH_TO_STATE_MAP[currentPath];

  if (!stateProperty || stateProperty === 'ui' || stateProperty === 'reports') {
    setAllColumnLabels([]);
    return;
  }

  const resourceState = state[stateProperty];
  const columnHeaders = resourceState?.allColumnHeaders ?? [];

  if (columnHeaders.length) {
    setAllColumnLabels(columnHeaders);
  } else {
    setAllColumnLabels([]);
  }
}, [location.pathname, state]);



  const handleColumnChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: dispatch column toggle action
  };

  return (
    <div className="header-selector-wrapper">
      <h2>Select Columns</h2>
      {allColumnLabels.map((column) => (
        <div key={column.key} className="header-selector-item">
          <input
            id={column.key}
            type="checkbox"
            value={column.key}
            name={column.key}
            onChange={handleColumnChange}
            checked={column.isVisible}
          />
          <label htmlFor={column.key}>{column.displayName}</label>
        </div>
      ))}
    </div>
  );
}

export default ColumnFilterList;
