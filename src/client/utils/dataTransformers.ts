import { TableFilter } from '../context/GlobalContext';

interface dataTransformers {
  filterAndSort: (
    data: any[],
    selectedFilters: TableFilter[],
    selectedSort: { column: string; sortOrder: string }
  ) => any[];
}

export const formatDate = (date: string, includeTime: boolean = false): string => {
  const dateObj = new Date(date);

  // Format date as MM/DD/YYYY
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit', 
    timeZone: 'UTC' // Keep in UTC timezone
  };
  
  // Format time as H:MM AM/PM
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, 
    timeZone: 'UTC' // Keep in UTC timezone
  };

  const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);

  if (includeTime) {
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} ${formattedTime}`;
  } else {
    return formattedDate;
  }
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
