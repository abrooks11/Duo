// import { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   Collapse,
//   IconButton,
//   Alert,
//   Skeleton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
//   TextField,
// } from '@mui/material';
// import {
//   ExpandMore as ExpandIcon,
//   ExpandLess as CollapseIcon,
//   Code as CodeIcon,
// } from '@mui/icons-material';
// import ReportActions from './ReportActions';
// import ReportTable from './ReportTable';
// import type { ReportData } from '../../../context/types/state';

// interface ReportViewProps {
//   report: ReportData | null;
//   isRunning: boolean;
//   isLoading: boolean;
//   error: string | null;
//   onRefresh: (id: string) => Promise<void>;
//   onEdit: (id: string, data: { name?: string; description?: string }) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   onDuplicate: (id: string) => Promise<void>;
//   onExport: (report: ReportData) => void;
// }

// const ReportView = ({
//   report,
//   isRunning,
//   isLoading,
//   error,
//   onRefresh,
//   onEdit,
//   onDelete,
//   onDuplicate,
//   onExport,
// }: ReportViewProps) => {
//   const [showQuery, setShowQuery] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editName, setEditName] = useState('');
//   const [editDescription, setEditDescription] = useState('');

//   // Empty state
//   if (!report && !isLoading) {
//     return (
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           flexDirection: 'column',
//           color: 'text.secondary',
//           p: 4,
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           No Report Selected
//         </Typography>
//         <Typography variant="body2">
//           Select a report from the sidebar or create a new one to get started.
//         </Typography>
//       </Box>
//     );
//   }

//   // Loading skeleton
//   if (isLoading && !report) {
//     return (
//       <Box sx={{ flex: 1, p: 3 }}>
//         <Skeleton variant="text" width={300} height={40} />
//         <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
//         <Skeleton variant="rectangular" height={400} />
//       </Box>
//     );
//   }

//   if (!report) return null;

//   const handleRefresh = () => onRefresh(report.id);
//   const handleDuplicate = () => onDuplicate(report.id);

//   const handleDeleteClick = () => setDeleteDialogOpen(true);
//   const handleDeleteConfirm = async () => {
//     await onDelete(report.id);
//     setDeleteDialogOpen(false);
//   };

//   const handleEditClick = () => {
//     setEditName(report.name);
//     setEditDescription(report.description);
//     setEditDialogOpen(true);
//   };

//   const handleEditConfirm = async () => {
//     await onEdit(report.id, {
//       ...(editName !== report.name ? { name: editName } : {}),
//       ...(editDescription !== report.description ? { description: editDescription } : {}),
//     });
//     setEditDialogOpen(false);
//   };

//   const handleExport = () => onExport(report);

//   const cachedAt = report.cachedAt ? new Date(report.cachedAt).toLocaleString() : 'Never';
//   const rowCount = report.cachedData?.length ?? 0;

//   return (
//     <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//         <Box>
//           <Typography variant="h5" fontWeight="bold" gutterBottom>
//             {report.name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {report.description}
//           </Typography>
//           <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
//             Last updated: {cachedAt} • {rowCount} rows
//           </Typography>
//         </Box>
//         <ReportActions
//           isRunning={isRunning}
//           onRefresh={handleRefresh}
//           onExport={handleExport}
//           onEdit={handleEditClick}
//           onDelete={handleDeleteClick}
//           onDuplicate={handleDuplicate}
//         />
//       </Box>

//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {/* SQL Query (collapsible) */}
//       <Paper variant="outlined" sx={{ mb: 2 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             p: 1,
//             cursor: 'pointer',
//             '&:hover': { backgroundColor: 'action.hover' },
//           }}
//           onClick={() => setShowQuery(!showQuery)}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <CodeIcon fontSize="small" color="action" />
//             <Typography variant="body2" fontWeight={500}>
//               SQL Query
//             </Typography>
//           </Box>
//           <IconButton size="small">
//             {showQuery ? <CollapseIcon /> : <ExpandIcon />}
//           </IconButton>
//         </Box>
//         <Collapse in={showQuery}>
//           <Box
//             sx={{
//               p: 2,
//               backgroundColor: 'grey.100',
//               fontFamily: 'monospace',
//               fontSize: '0.85rem',
//               whiteSpace: 'pre-wrap',
//               wordBreak: 'break-word',
//               borderTop: '1px solid',
//               borderColor: 'divider',
//             }}
//           >
//             {report.sqlQuery}
//           </Box>
//         </Collapse>
//       </Paper>

//       {/* Results Table */}
//       <Paper variant="outlined" sx={{ height: 'calc(100vh - 350px)', minHeight: 400 }}>
//         {isRunning ? (
//           <Box sx={{ p: 2 }}>
//             <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
//             <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
//             <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
//             <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
//             <Skeleton variant="rectangular" height={50} />
//           </Box>
//         ) : (
//           <ReportTable data={report.cachedData || []} />
//         )}
//       </Paper>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//         <DialogTitle>Delete Report</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete "{report.name}"? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDeleteConfirm} color="error" variant="contained">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Report</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Report Name"
//             value={editName}
//             onChange={(e) => setEditName(e.target.value)}
//             fullWidth
//             sx={{ mt: 2, mb: 2 }}
//           />
//           <TextField
//             label="Description"
//             value={editDescription}
//             onChange={(e) => setEditDescription(e.target.value)}
//             multiline
//             rows={3}
//             fullWidth
//             helperText="Changing the description will regenerate the SQL query"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleEditConfirm} variant="contained">
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ReportView;
