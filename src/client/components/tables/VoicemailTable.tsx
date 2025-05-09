import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import VoicemailActions from '../ui/VoicemailActions';
import DropDown from '../ui/DropDown';
import { voicemailRowDisplayNames } from '../../utils/keyMappings';
import {
  updateVoicemailNote,
  updateVoicemailReason,
} from '../../utils/voicemailApi';

interface Props {
  columns: any[];
  data: any[];
  className: string;
  dynamicHeight?: boolean;
}

interface VoicemailRow {
  callerName: string;
  callerNumber: string;
  callerType: string;
  createdDate: string;
  duration: number;
  id: string;
  messageFolder: string;
  notes: string;
  officeId?: null;
  officeName?: null;
  reason: string;
  status: string;
  transcription: string;
}

const VoicemailTable = ({
  columns,
  data,
  className,
  dynamicHeight = false,
}: Props) => {
  const muiRows: GridRowsProp = data;
  const muiColumns: GridColDef[] = columns.map((column) => {
    // const { key, order, displayName, isVisible } = column;
    const { key, displayName } = column;

    // Special handling for the date column to include actions
    if (key === 'createdDate') {
      return {
        field: key,
        headerName: displayName,
        width: 100,
        renderCell: (params) => {
          return new Date(params.value).toLocaleDateString();
        },
      };
    }
    // Special handling for the notes column to include editable text field
    if (key === 'actions') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        renderCell: (params) => {
          return <VoicemailActions vmId={params.row.id} />;
        },
      };
    }
    // Special handling for the notes column to include editable text field
    if (key === 'notes') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        editable: true,
      };
    }
    // Special handling for the notes column to include editable text field
    if (key === 'reason') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        // editable: true,
        renderCell: (params) => {
          return (
            <DropDown
              dropDownList={voicemailRowDisplayNames}
              value={params.row.reason}
              onChange={(newValue) => {
                const newRow = { ...params.row, reason: newValue };
                params.api.updateRows([{ id: params.id, reason: newValue }]);
                processRowUpdate(newRow, params.row);
              }}
            />
          );
        },
      };
    }
    // Special handling for the transcription column to show overflow
    if (key === 'transcription') {
      return {
        field: key,
        headerName: displayName,
        width: 500, // updated width
      };
    }
    return {
      field: key,
      headerName: displayName,
      width: 200,
    };
  });

  const processRowUpdate = (
    updatedRow: VoicemailRow,
    originalRow: VoicemailRow
  ) => {
    // console.log('Row information: ', { updatedRow, originalRow });
    if (updatedRow.notes !== originalRow.notes) {
      updateVoicemailNote(originalRow.id, updatedRow.notes);
      return updatedRow;
    }
    if (updatedRow.reason !== originalRow.reason) {      
      updateVoicemailReason(originalRow.id, updatedRow.reason);
      return updatedRow;
    }
    return originalRow;
  };

  // Handle process row update errors
  const handleProcessRowUpdateError = (error: any) => {
    console.error('Error saving row update:', error);
  };

  return (
    <div className={className}>
      <DataGrid
        rows={muiRows}
        columns={muiColumns}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        getRowHeight={dynamicHeight ? () => 'auto' : () => null}
      />
    </div>
  );
};

export default VoicemailTable;
