import { TableFilter } from '../context/types/state';

interface dataTransformers {
  filterAndSort: (
    data: any[],
    selectedFilters: TableFilter[],
    selectedSort: { column: string; sortOrder: string }
  ) => any[];
}


const dataTransformers: dataTransformers = {
  filterAndSort: (data, selectedFilters, selectedSort) => {
    // init result to store processed data
    let result: any[] = data;
    //   console.log("selectedFilters", selectedFilters);
    //   console.log("selectedSort", selectedSort);
    //   console.log("sample obj", data[0]);

    // check if any filters are selected
    if (selectedFilters.length > 0) {
      // define the rules for filtering by status and assert type
      // interface StatusRules {
      //   [key: string]: string[];
      // }

      // const appointmentStatusRules: StatusRules = {
      //   scheduled: ["Scheduled", "Confirmed"],
      //   completed: ["Check-Out", "Unspecified"],
      //   cancelled: ["Cancelled", "Rescheduled"],
      //   noShow: ["No-Show"],
      // };

      // init empty array to store filtered data
      let filteredData: any[] = [];

      // iterate through the filters in the array and spread the result of each filter into the result
      selectedFilters.forEach((filter) => {
        console.log('FILTER', filter);
        // const result = data.filter((row: any) => {
        //   return filter.includes(
        //     row.ConfirmationStatus
        //   );
        // });
        // filteredData = [...filteredData, ...result];
      });

      // reassign result to the filtered data
      result = filteredData;
    }

    if (selectedSort.column) {
      let sortedData = result.sort((a, b) => {
        // if header has number data, sort by number
        if (
          typeof a[selectedSort.column] === 'number' &&
          typeof b[selectedSort.column] === 'number'
        ) {
          return a[selectedSort.column] - b[selectedSort.column];
        }
        // ! TODO: fix this so it sorts by date
        // if header has string data, sort by string
        return a[selectedSort.column].localeCompare(b[selectedSort.column]);
      });

      result =
        selectedSort.sortOrder === 'ascending'
          ? sortedData
          : sortedData.reverse();
    }
    // return the filtered and sorted data
    return result;
  },
};

export default dataTransformers;
