// import {
//   Box,
//   Button,
//   ButtonGroup,
//   Tooltip,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Refresh as RefreshIcon,
//   FileDownload as ExportIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   ContentCopy as DuplicateIcon,
// } from '@mui/icons-material';

// interface ReportActionsProps {
//   isRunning: boolean;
//   onRefresh: () => void;
//   onExport: () => void;
//   onEdit: () => void;
//   onDelete: () => void;
//   onDuplicate: () => void;
// }

// const ReportActions = ({
//   isRunning,
//   onRefresh,
//   onExport,
//   onEdit,
//   onDelete,
//   onDuplicate,
// }: ReportActionsProps) => {
//   return (
//     <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//       <ButtonGroup variant="outlined" size="small">
//         <Tooltip title="Refresh data">
//           <Button onClick={onRefresh} disabled={isRunning}>
//             {isRunning ? <CircularProgress size={18} /> : <RefreshIcon />}
//           </Button>
//         </Tooltip>
//         <Tooltip title="Export to Excel">
//           <Button onClick={onExport}>
//             <ExportIcon />
//           </Button>
//         </Tooltip>
//       </ButtonGroup>

//       <ButtonGroup variant="outlined" size="small">
//         <Tooltip title="Edit report">
//           <Button onClick={onEdit}>
//             <EditIcon />
//           </Button>
//         </Tooltip>
//         <Tooltip title="Duplicate report">
//           <Button onClick={onDuplicate}>
//             <DuplicateIcon />
//           </Button>
//         </Tooltip>
//         <Tooltip title="Delete report">
//           <Button onClick={onDelete} color="error">
//             <DeleteIcon />
//           </Button>
//         </Tooltip>
//       </ButtonGroup>
//     </Box>
//   );
// };

// export default ReportActions;
