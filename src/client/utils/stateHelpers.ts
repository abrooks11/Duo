import type { ColumnDisplayNames, RowFilterMap } from './keyMappings';
import type { RowFilterDetails } from './../context/types/state';

export const formatDate = (
  date: string | Date,
  includeTime: boolean = false
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);

  // Format date as MM/DD/YYYY
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC', // Keep in UTC timezone
  };

  // Format time as H:MM AM/PM
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC', // Keep in UTC timezone
  };

  const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);

  if (includeTime) {
    const formattedTime = dateObj.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} ${formattedTime}`;
  } else {
    return formattedDate;
  }
};

export const generateOrderedColumns = (
  orderMap: string[],
  nameMap: ColumnDisplayNames
) => {
  return orderMap
    .map((label, index) => {
      return {
        key: label,
        order: index,
        displayName: nameMap[label],
        isVisible: true,
      };
    })
    .sort((a, b) => a.order - b.order);
};

export const generateRowFilterDetails = (
  data: any[],
  displayNames: ColumnDisplayNames,
  targetColumnName: string,
  filterMap?: RowFilterMap
): RowFilterDetails => {
  // Create template object from keys in ordered filter list; Initialize with zero counts and not selected
  const filterDetails = Object.fromEntries(
    Object.entries(displayNames).map(([key, _]) => [
      key,
      { displayName: displayNames[key], sum: 0, isSelected: false },
    ])
  );
  // Iterate over data and update counts
  if (filterMap) {
    for (const row of data) {
      const filterKey = row[targetColumnName];

      // Check each filter group
      for (const key in filterMap) {
        if (filterMap[key].includes(filterKey)) {
          filterDetails[key].sum += 1;
        }
      }
    }
  } else {
    // console.log('Processing data without filterMap');
    for (const row of data) {
      const filterKey = row[targetColumnName];
      // console.log('Current row filterKey:', filterKey);
      // console.log('Available keys in filterDetails:', Object.keys(filterDetails));

      if (filterDetails[filterKey] === undefined) {
        console.log('Warning: No matching key found for:', filterKey);
        continue;
      }
      filterDetails[filterKey].sum += 1;
    }
  }

  // Calculate total if it's in the ordered list
  if (Object.keys(displayNames).includes('total')) {
    filterDetails['total'].sum = data.length;
  }

  return filterDetails;
};
