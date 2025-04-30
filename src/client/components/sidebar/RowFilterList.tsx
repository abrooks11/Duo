import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // Add this import
import useGlobalContext from '../../hooks/useGlobalContext';
import type { GlobalState, RowFilterDetails } from '../../context/GlobalContext';
import { ActionTypes } from '../../context/GlobalContext';



function RowFilterList() {
  const { state, dispatch } = useGlobalContext();
  // const [rowFilters, setRowFilters] = useState<TableFilter[]>([]);
  const [rowFilters, setRowFilters] = useState<RowFilterDetails>({});
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

  // Get the corresponding state property from the map
  const stateProperty = PATH_TO_STATE_MAP[currentPath];
  
  
  const filterList = stateProperty ? state[stateProperty]?.rowFilterDetails || {} : {};
  if (filterList) {
    setRowFilters(filterList);
  } else {
    setRowFilters({});
  }
}, [location.pathname, state]);

  /*
   * function for selecting/deselecting a single filter from the list of filters
   */

  // const handleFilterClick = (statusFilter: TableFilter) => {
  //   console.log('FILTER CLICKED: ', statusFilter);
  //   console.log('FILTER STATUS:', statusFilter.isSelected);

  //   dispatch({
  //     type: ActionTypes.SET_ROW_FILTER_LIST,
  //     payload: {
  //       pathname: currentPath,
  //       componentFilterName: statusFilter,
  //       selectStatus: !statusFilter.isSelected,
  //     },
  //   });
  // };

  return (
    <div className="status-list-wrapper">
      <h2>Filter Rows</h2>
      {rowFilters &&
        Object.entries(rowFilters).map(([key, details]) =>
          { 
            const {displayName, sum, isSelected} = details
            return (
          <div
            key={key}
            className={isSelected ? 'selected-filter' : ''}
            // onClick={() => handleFilterClick(filter)}
          >
            <p className="status-table-label">{displayName}</p>
            <p className="status-table-count">{sum}</p>
          </div>
        )})}
    </div>
  );
}

export default RowFilterList;
