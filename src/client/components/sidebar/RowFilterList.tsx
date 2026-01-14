import { useState, useEffect } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';
import type { RowFilterDetails } from '../../context/types/state';
import { appointmentActions } from '../../context/reducers/appointmentReducer';
import { voicemailActions } from '../../context/reducers/voicemailReducer';
import useStateMap from '../../hooks/useStateMap';



function RowFilterList() {
  const { state, dispatch } = useGlobalContext();
  const currentPage = useStateMap(); // Move hook call to top level
  const [rowFilterList, setRowFilterList] = useState<RowFilterDetails>({});
  const [resource, setResource] = useState<string>()

  useEffect(() => {
    if (currentPage && state[currentPage]) {
      // Type guard to ensure the resource has rowFilterDetails
      const resourceState = state[currentPage];
      if ('rowFilterDetails' in resourceState) {
        const filterList = resourceState.rowFilterDetails || {};
        setResource(currentPage);
        setRowFilterList(filterList);
      } else {
        setRowFilterList({});
      }
    } else {
      setRowFilterList({});
    }
  }, [currentPage, state]); // Update dependency array

  /*
   * function for selecting/deselecting a single filter from the list of filters
   */

  const handleFilterClick = (filterKey: string): void => {
    if (!resource) return;
    
    // Use domain-specific actions based on the current resource
    if (resource === 'appointments') {
      dispatch(appointmentActions.toggleFilter(filterKey));
    } else if (resource === 'voicemail') {
      dispatch(voicemailActions.toggleFilter(filterKey));
    }
    // Add claims and patients when those reducers are implemented
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
