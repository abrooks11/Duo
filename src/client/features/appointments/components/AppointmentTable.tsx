import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import DropDown from '@client/components/ui/DropDown'
import AppointmentActions from './AppointmentActions';
import { updateCopay, updateAppointmentNote } from '../services/appointmentApi';

interface Props {
  columns: any[];
  data: any[];
  styling: string;
  dynamicHeight?: boolean;
}

const AppointmentTable = ({
  columns,
  data,
  styling,
  dynamicHeight = false,
}: Props) => {
  
  const muiRows: GridRowsProp = data;
  const muiColumns: GridColDef[] = columns.map((column) => {
    // const { key, order, displayName, isVisible } = column;
    const { key, displayName } = column;
    if (key === 'actions') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        renderCell: (params) => {
          return <AppointmentActions patientId={params.row.patientId} />;
        },
      };
    }
    // Special handling for the notes column to include editable text field
    if (key === 'insEligibility') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        renderCell: (params) => {
          return <DropDown dropDownList={{pending: 'Pending', active: 'Active', termed:'Termed', oon:'Out of Network'}} value={params.row.insEligibility}/>;
        },
      };
    }
    if (key === 'notes') {
      return {
        field: key,
        headerName: displayName,
        width: 250,
        editable: true,
      };
    }
    if (key === 'patientCopay') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        type: 'number',
        editable: true,
      };
    }
    return {
      field: key,
      headerName: displayName,
      width: 200,
    };
  });

  const processRowUpdate = async (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel
  ): Promise<GridValidRowModel> => {
    if (newRow.insEligibility !== oldRow.insEligibility) {
      return newRow;
    }
    if (newRow.notes !== oldRow.notes) {
      await updateAppointmentNote(oldRow.id, newRow.notes);
      return newRow;
    }
    if (newRow.patientCopay !== oldRow.patientCopay) {
      await updateCopay(oldRow.id, newRow.patientCopay);
      return newRow;
    }
    return oldRow;
  };

  // Handle process row update errors
  const handleProcessRowUpdateError = (error: any) => {
    console.error('Error saving row update:', error);
  };

  return (
    <div className={styling}>
      <DataGrid
        rows={muiRows}
        columns={muiColumns}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        getRowHeight={dynamicHeight? () => 'auto' : () => null}
      />
    </div>
  );
};

export default AppointmentTable;
