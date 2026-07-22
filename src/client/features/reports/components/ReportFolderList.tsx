// import { useState } from 'react';
// import {
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Typography,
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import {
//   Folder as FolderIcon,
//   FolderOpen as FolderOpenIcon,
//   ExpandLess,
//   ExpandMore,
//   MoreVert as MoreIcon,
// } from '@mui/icons-material';
// import ReportListItem from './ReportListItem';
// import type { ReportFolder } from '../../../context/types/state';

// interface ReportFolderListProps {
//   folders: ReportFolder[];
//   selectedReportId: string | null;
//   onSelectReport: (reportId: string) => void;
//   onDeleteFolder: (folderId: string) => void;
//   onRenameFolder: (folderId: string, newName: string) => void;
// }

// const ReportFolderList = ({
//   folders,
//   selectedReportId,
//   onSelectReport,
//   onDeleteFolder,
//   onRenameFolder,
// }: ReportFolderListProps) => {
//   const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() => {
//     // Open all folders by default
//     const initial: Record<string, boolean> = {};
//     folders.forEach((f) => {
//       initial[f.id] = true;
//     });
//     return initial;
//   });
//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
//   const [menuFolderId, setMenuFolderId] = useState<string | null>(null);

//   const toggleFolder = (folderId: string) => {
//     setOpenFolders((prev) => ({
//       ...prev,
//       [folderId]: !prev[folderId],
//     }));
//   };

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, folderId: string) => {
//     event.stopPropagation();
//     setMenuAnchor(event.currentTarget);
//     setMenuFolderId(folderId);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setMenuFolderId(null);
//   };

//   const handleDelete = () => {
//     if (menuFolderId) {
//       onDeleteFolder(menuFolderId);
//     }
//     handleMenuClose();
//   };

//   const handleRename = () => {
//     if (menuFolderId) {
//       const folder = folders.find((f) => f.id === menuFolderId);
//       const newName = prompt('Enter new folder name:', folder?.name);
//       if (newName && newName.trim()) {
//         onRenameFolder(menuFolderId, newName.trim());
//       }
//     }
//     handleMenuClose();
//   };

//   return (
//     <List component="nav" sx={{ p: 0 }}>
//       {folders.map((folder) => {
//         const isOpen = openFolders[folder.id] ?? true;
//         const hasReports = folder.reports.length > 0;

//         return (
//           <Box key={folder.id}>
//             <ListItemButton
//               onClick={() => toggleFolder(folder.id)}
//               sx={{
//                 borderRadius: 1,
//                 '&:hover .folder-menu': {
//                   opacity: 1,
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ minWidth: 36 }}>
//                 {isOpen ? (
//                   <FolderOpenIcon color="primary" />
//                 ) : (
//                   <FolderIcon color="action" />
//                 )}
//               </ListItemIcon>
//               <ListItemText
//                 primary={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Typography variant="body2" fontWeight={500}>
//                       {folder.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       ({folder.reports.length})
//                     </Typography>
//                   </Box>
//                 }
//               />
//               {!folder.isDefault && (
//                 <IconButton
//                   size="small"
//                   className="folder-menu"
//                   onClick={(e) => handleMenuOpen(e, folder.id)}
//                   sx={{ opacity: 0, transition: 'opacity 0.2s' }}
//                 >
//                   <MoreIcon fontSize="small" />
//                 </IconButton>
//               )}
//               {isOpen ? <ExpandLess /> : <ExpandMore />}
//             </ListItemButton>

//             <Collapse in={isOpen} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 {hasReports ? (
//                   folder.reports.map((report) => (
//                     <ReportListItem
//                       key={report.id}
//                       report={report}
//                       isSelected={selectedReportId === report.id}
//                       onSelect={onSelectReport}
//                     />
//                   ))
//                 ) : (
//                   <Typography
//                     variant="caption"
//                     color="text.secondary"
//                     sx={{ pl: 6, py: 1, display: 'block' }}
//                   >
//                     No reports
//                   </Typography>
//                 )}
//               </List>
//             </Collapse>
//           </Box>
//         );
//       })}

//       <Menu
//         anchorEl={menuAnchor}
//         open={Boolean(menuAnchor)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleRename}>Rename</MenuItem>
//         <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
//           Delete
//         </MenuItem>
//       </Menu>
//     </List>
//   );
// };

// export default ReportFolderList;
