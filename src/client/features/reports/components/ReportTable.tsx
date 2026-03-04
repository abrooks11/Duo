import { useMemo } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

interface ReportTableProps {
  data: any[];
}

const ReportTable = ({ data }: ReportTableProps) => {
  // Generate columns from data
  const columns: GridColDef[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => {
      // Determine column type based on first row value
      const value = firstRow[key];
      let type: 'string' | 'number' | 'date' | 'dateTime' | 'boolean' = 'string';

      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
        // Check if it looks like a date
        const dateStr = String(value);
        if (dateStr.includes('T') || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
          type = 'dateTime';
        }
      }

      return {
        field: key,
        headerName: formatHeaderName(key),
        flex: 1,
        minWidth: 120,
        type,
        valueFormatter: (params: any) => {
          if (params === null || params === undefined) return '-';
          if (type === 'dateTime' && params) {
            try {
              return new Date(params).toLocaleDateString();
            } catch {
              return params;
            }
          }
          if (type === 'number' && typeof params === 'number') {
            // Format currency-like numbers
            if (key.toLowerCase().includes('amount') ||
                key.toLowerCase().includes('balance') ||
                key.toLowerCase().includes('charge') ||
                key.toLowerCase().includes('payment')) {
              return `$${params.toFixed(2)}`;
            }
            return params.toLocaleString();
          }
          return params;
        },
      };
    });
  }, [data]);

  // Add row IDs if not present
  const rows = useMemo(() => {
    return data.map((row, index) => ({
      ...row,
      id: row.id ?? index,
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body1">No data found</Typography>
        <Typography variant="caption">
          Try modifying your report description or refreshing the data.
        </Typography>
      </Box>
    );
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 25 },
        },
      }}
      pageSizeOptions={[10, 25, 50, 100]}
      slots={{
        toolbar: GridToolbar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
      disableRowSelectionOnClick
      density="compact"
      sx={{
        border: 'none',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: 'grey.100',
          fontWeight: 600,
        },
        '& .MuiDataGrid-cell': {
          borderColor: 'grey.200',
        },
        '& .MuiDataGrid-toolbarContainer': {
          padding: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      }}
    />
  );
};

// Helper function to convert camelCase/snake_case to Title Case
function formatHeaderName(key: string): string {
  return key
    // Insert space before capitals (camelCase)
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores with spaces (snake_case)
    .replace(/_/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export default ReportTable;
