// import {
//   ListItemButton,
//   ListItemText,
//   Typography,
// } from '@mui/material';
// import { Description as ReportIcon } from '@mui/icons-material';
// import type { ReportData } from '../../../context/types/state';

// interface ReportListItemProps {
//   report: ReportData;
//   isSelected: boolean;
//   onSelect: (reportId: string) => void;
// }

// const ReportListItem = ({ report, isSelected, onSelect }: ReportListItemProps) => {
//   return (
//     <ListItemButton
//       selected={isSelected}
//       onClick={() => onSelect(report.id)}
//       sx={{
//         pl: 4,
//         borderRadius: 1,
//         mb: 0.5,
//         '&.Mui-selected': {
//           backgroundColor: 'primary.light',
//           '&:hover': {
//             backgroundColor: 'primary.light',
//           },
//         },
//       }}
//     >
//       <ReportIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
//       <ListItemText
//         primary={
//           <Typography variant="body2" noWrap sx={{ fontWeight: isSelected ? 600 : 400 }}>
//             {report.name}
//           </Typography>
//         }
//         secondary={
//           <Typography
//             variant="caption"
//             color="text.secondary"
//             noWrap
//             sx={{ display: 'block', maxWidth: '180px' }}
//           >
//             {report.description}
//           </Typography>
//         }
//       />
//     </ListItemButton>
//   );
// };

// export default ReportListItem;
