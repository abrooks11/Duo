import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import VoicemailActions from './VoicemailActions';

interface Props {
  columns: any[];
  data: any[];
  className: string;
}

const VoicemailTable = ({ columns, data, className }: Props) => {
  const muiRows: GridRowsProp = data
  const muiColumns: GridColDef[] = columns.map(column => {
    const { key, order, displayName, isVisible } = column;

    // Special handling for the date column to include actions
    if (key === 'createdDate') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        renderCell: (params) => {
          return (
            <div className="w-full h-full group relative">
              {/* Date shown by default */}
              <div className="group-hover:invisible">
                {new Date(params.value).toLocaleDateString()}
              </div>
              {/* Actions shown on hover */}
              <div className="absolute inset-0 invisible group-hover:visible">
                <VoicemailActions vmId={params.row.id} />
              </div>
            </div>
          );
        }
      };
    }

    return {
      field: key,
      headerName: displayName, 
      width: 200
    }
  })

  return (
    <div className={className}>
      <DataGrid rows={muiRows} columns={muiColumns} />
    </div>
  );
};

export default VoicemailTable;