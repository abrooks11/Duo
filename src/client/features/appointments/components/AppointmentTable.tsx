import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import DropDown from '@client/components/ui/DropDown'
import AppointmentActions from './AppointmentActions';
import { updateCopay, updateAppointmentNote } from '../services/appointmentApi';

interface Props {
  columns: any[];
  data: any[];
  styling: string;
  dynamicHeight?: boolean;
}

interface AppointmentRow {
    insEligibility: string;
    patientCopay: number;
    patientBalance: string | number;
    startDate: string;
    confirmationStatus: string;
    patientFullName: string;
    patientCaseName: string;
    primaryInsurancePolicyNumber: string;
    appointmentReason: string;
    alertMessage: string;
    notes: string;
    id: number;
    createdDate: string;
    lastModifiedDate: string;
    patientId: number;
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
    updatedRow: AppointmentRow,
    originalRow: AppointmentRow
  ) => {
    if (updatedRow.insEligibility !== originalRow.insEligibility) {
      return updatedRow;
    }
    if (updatedRow.notes !== originalRow.notes) {
      await updateAppointmentNote(originalRow.id, updatedRow.notes);
      return updatedRow;
    }
    if (updatedRow.patientCopay !== originalRow.patientCopay) {
      await updateCopay(originalRow.id, updatedRow.patientCopay);
      return updatedRow;
    }
    return originalRow;
  };

  // Handle process row update errors
  const handleProcessRowUpdateError = (error: any) => {
    console.error('Error saving row update:', error);
  };

  return (
    <div className={styling}>
      <DataGrid
        cellSelection
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
