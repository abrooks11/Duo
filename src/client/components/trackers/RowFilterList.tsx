import { useState, useEffect } from 'react';
import useGlobalContext from '../../hooks/useGlobalContext';
import { ActionTypes, TableFilter } from '../../context/GlobalContext';

// USING THE CURRENT PATH NAME EXTRACT ROW FILTERS FROM STATE

function RowFilterList() {
  const { state, dispatch } = useGlobalContext();
  const [rowFilters, setRowFilters] = useState<TableFilter[]>([]);

  const currentPath = window.location.pathname.slice(1);
  console.log('CURRENT PATH', currentPath);

  useEffect(() => {
    switch (currentPath) {
      case 'home':
        setRowFilters([]);
        break;
      case 'appointments':
        setRowFilters(state.appointments.allFilters);
        break;
      case 'claims':
        setRowFilters(state.claims.allFilters);
        break;
      case 'patients':
        setRowFilters(state.patients.allFilters);
        break;
      default:
        setRowFilters([]);
        break;
    }
  }, [currentPath]);

  console.log('CURRENT PATH:', currentPath);
  console.log('ROW FILTERS: ', rowFilters);

  /*
   * function for selecting/deselecting a single filter from the list of filters
   */
  const handleFilterClick = (statusFilter: TableFilter) => {
    console.log('FILTER CLICKED: ', statusFilter);
    console.log('FILTER STATUS:', statusFilter.isSelected);

    dispatch({
      type: ActionTypes.SET_ROW_FILTER_LIST,
      payload: {
        pathname: currentPath,
        componentFilterName: statusFilter,
        selectStatus: !statusFilter.isSelected,
      },
    });
  };

  return (
    <div className="status-list-wrapper">
      <h2>Filter by Status</h2>
      {rowFilters &&
        rowFilters.map((filter: any) => (
          <div
            key={filter.label}
            className={filter.isSelected ? 'selected-filter' : ''}
            onClick={() => handleFilterClick(filter)}
          >
            <p className="status-table-label">{filter.label}</p>
            <p className="status-table-count">{filter.data.length}</p>
          </div>
        ))}
    </div>
  );
}

export default RowFilterList;
