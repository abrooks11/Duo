// import { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Divider,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';
// import { CreateNewFolder as NewFolderIcon } from '@mui/icons-material';
// import CreateReportForm from './CreateReportForm';
// import ReportFolderList from './ReportFolderList';
// import type { ReportFolder } from '../../../context/types/state';

// interface ReportsSidebarProps {
//   folders: ReportFolder[];
//   selectedReportId: string | null;
//   isCreating: boolean;
//   isLoading: boolean;
//   error: string | null;
//   onSelectReport: (reportId: string) => void;
//   onCreateReport: (data: { name: string; description: string; folderId?: string }) => Promise<void>;
//   onSetCreating: (isCreating: boolean) => void;
//   onCreateFolder: (name: string) => Promise<void>;
//   onDeleteFolder: (folderId: string) => Promise<void>;
//   onRenameFolder: (folderId: string, newName: string) => Promise<void>;
// }

// const ReportsSidebar = ({
//   folders,
//   selectedReportId,
//   isCreating,
//   isLoading,
//   error,
//   onSelectReport,
//   onCreateReport,
//   onSetCreating,
//   onCreateFolder,
//   onDeleteFolder,
//   onRenameFolder,
// }: ReportsSidebarProps) => {
//   const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
//   const [newFolderName, setNewFolderName] = useState('');

//   const handleCreateFolder = async () => {
//     if (newFolderName.trim()) {
//       await onCreateFolder(newFolderName.trim());
//       setNewFolderName('');
//       setNewFolderDialogOpen(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         width: 300,
//         height: '100%',
//         borderRight: '1px solid',
//         borderColor: 'divider',
//         display: 'flex',
//         flexDirection: 'column',
//         backgroundColor: 'background.default',
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
//         <Typography variant="h6" fontWeight="bold">
//           Reports
//         </Typography>
//       </Box>

//       {/* Create Report Form */}
//       <CreateReportForm
//         isOpen={isCreating}
//         folders={folders}
//         isLoading={isLoading}
//         error={error}
//         onSubmit={onCreateReport}
//         onCancel={() => onSetCreating(false)}
//         onOpen={() => onSetCreating(true)}
//       />

//       {/* Folder List */}
//       <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
//         <ReportFolderList
//           folders={folders}
//           selectedReportId={selectedReportId}
//           onSelectReport={onSelectReport}
//           onDeleteFolder={onDeleteFolder}
//           onRenameFolder={onRenameFolder}
//         />
//       </Box>

//       {/* Add Folder Button */}
//       <Divider />
//       <Box sx={{ p: 2 }}>
//         <Button
//           variant="text"
//           startIcon={<NewFolderIcon />}
//           onClick={() => setNewFolderDialogOpen(true)}
//           fullWidth
//           size="small"
//         >
//           New Folder
//         </Button>
//       </Box>

//       {/* New Folder Dialog */}
//       <Dialog open={newFolderDialogOpen} onClose={() => setNewFolderDialogOpen(false)}>
//         <DialogTitle>Create New Folder</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             label="Folder Name"
//             value={newFolderName}
//             onChange={(e) => setNewFolderName(e.target.value)}
//             fullWidth
//             sx={{ mt: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setNewFolderDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleCreateFolder} variant="contained" disabled={!newFolderName.trim()}>
//             Create
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ReportsSidebar;
