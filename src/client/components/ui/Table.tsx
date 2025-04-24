import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { TableColumn } from '../../context/GlobalContext';

interface Props {
  columns: TableColumn[];
  data: any[];
}

function Table({ columns, data }: Props) {
  const muiRows: GridRowsProp = data;
  const muiColumns: GridColDef[] = columns.map((column) => {
    const { label, value } = column;
    
    return {
      field: label,
      headerName: value,
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