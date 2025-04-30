import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Add this import
import useGlobalContext from '../../hooks/useGlobalContext';
import type { GlobalState, RowFilterDetails } from '../../context/GlobalContext';
import { ActionTypes } from '../../context/GlobalContext';



function RowFilterList() {
  const { state, dispatch } = useGlobalContext();
  // const [rowFilterList, setRowFilterList] = useState<TableFilter[]>([]);
  const [rowFilterList, setRowFilterList] = useState<RowFilterDetails>({});
  const [resource, setResource] = useState<string>()
  const location = useLocation();  // Add this hook

// Map paths to their corresponding state properties
const PATH_TO_STATE_MAP: Record<string, keyof GlobalState> = {
  appointments: 'appointments',
  claims: 'claims',
  patients: 'patients',
  voicemail: 'voicemail',
};

  useEffect(() => {
      // Remove leading slash and get the path
  const currentPath = location.pathname.slice(1);
  
  setResource(currentPath)

  // Get the corresponding state property from the map
  const stateProperty = PATH_TO_STATE_MAP[currentPath];
  
  
  const filterList = stateProperty ? state[stateProperty]?.rowFilterDetails || {} : {};
  if (filterList) {
    setRowFilterList(filterList);
  } else {
    setRowFilterList({});
  }
}, [location.pathname, state]);

  /*
   * function for selecting/deselecting a single filter from the list of filters
   */

  const handleFilterClick = (filterKey: string) : void => {
    // console.log('FILTER CLICKED: ', filterKey);
    // console.log('RESOURCE: ', resource);

    dispatch({
      type: ActionTypes.TOGGLE_FILTER,
      payload: {
        filterResource: resource,
        filterKey: filterKey,
      },
    });
  };

  return (
    <div className="status-list-wrapper">
      <h2>Filter Rows</h2>
      {rowFilterList &&
        Object.entries(rowFilterList).map(([key, details]) =>
          { 
            const {displayName, sum, isSelected} = details
            // console.log(key)
            return (
          <div
            key={key}
            className={isSelected ? 'selected-filter' : ''}
            onClick={() => handleFilterClick(key)}
          >
            <p className="status-table-label">{displayName}</p>
            <p className="status-table-count">{sum}</p>
          </div>
        )})}
    </div>
  );
}

export default RowFilterList;
