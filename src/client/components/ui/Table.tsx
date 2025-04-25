import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { TableColumn } from '../../context/GlobalContext';

interface Props {
  columns: TableColumn[];
  data: any[];
}

function Table({ columns, data }: Props) {
  const muiRows: GridRowsProp = data;
  const muiColumns: GridColDef[] = columns.map((column) => {
    const { key, order, displayName, isVisible } = column;
    
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