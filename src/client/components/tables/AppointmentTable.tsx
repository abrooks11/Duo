import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import DropDown from '../ui/DropDown'
import AppointmentActions from '../ui/AppointmentActions';

interface Props {
  columns: any[];
  data: any[];
  styling: string;
  dynamicHeight?: boolean;
}

interface AppointmentRow {
    insEligibility: string;
    patientCopay: number;
    patientBalance: number;
    startDate: string;
    confirmationStatus: string;
    patientFullName: string;
    patientCaseName: string;
    primaryInsurancePolicyNumber: string;
    appointmentReason: string;
    alertMessage: string;
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
    // Special handling for the transcription column to show overflow
    if (key === 'patientCopay') {
      return {
        field: key,
        headerName: displayName,
        width: 200,
        editable: true,
      };
    }
    return {
      field: key,
      headerName: displayName,
      width: 200,
    };
  });

  const processRowUpdate = (
    updatedRow: AppointmentRow,
    originalRow: AppointmentRow
  ) => {
    console.log('Row information: ', { updatedRow, originalRow });
    if (updatedRow.insEligibility !== originalRow.insEligibility) {
    //   updateVoicemailNote(originalRow.id, updatedRow.notes);
      return updatedRow;
    }
    if (updatedRow.patientCopay !== originalRow.patientCopay) {
    //   updateVoicemailNote(originalRow.id, updatedRow.notes);
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
