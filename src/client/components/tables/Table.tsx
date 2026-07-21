import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import type { TableColumn } from '../../context/types/state';

interface Props {
  columns: TableColumn[];
  data: any[];
}

function Table({ columns, data }: Props) {
  const muiRows: GridRowsProp = data;
  const muiColumns: GridColDef[] = columns.map((column) => {
    // const { key, order, displayName, isVisible } = column;
    const { key, displayName } = column;
    
    return {
      field: key,
      headerName: displayName,
      width: 200,
    };
  });

  return (
    <div>
      <DataGrid rows={muiRows} columns={muiColumns} />
    </div>
  );
}

export default Table;